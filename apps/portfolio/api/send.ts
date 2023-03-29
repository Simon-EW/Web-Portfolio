import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import Email from 'email-templates';
import { z } from 'zod';
import { resolve } from 'path';

const FormFields = z.object({
  name: z
    .string()
    .min(1, { message: 'Name must not be empty' })
    .max(100, { message: 'Name must not be longer than 100 characters' }),
  email: z.string().email(),
  subject: z
    .string()
    .min(1, { message: 'Subject must not be empty' })
    .max(250, { message: 'Subject must not be longer than 250 characters' }),
  message: z
    .string()
    .min(1, { message: 'Message must not be empty' })
    .max(5000, { message: 'Message must not be longer than 5000 characters' }),
});

export default async (request: VercelRequest, response: VercelResponse) => {
  if (request.method !== 'POST') {
    response.status(405).json({ success: false });
    return;
  }

  let json: unknown;

  try {
    json = JSON.parse(request.body);
  } catch (error) {
    response.status(400).json({ success: false, error: 'Invalid JSON' });
    return;
  }

  const input = FormFields.safeParse(json);

  if (!input.success) {
    response.status(400).json({ success: false, error: input.error });
    return;
  }

  const { name, email, subject, message } = input.data;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // const mailDir = process.env.NODE_ENV === 'production' ? resolve('./mail/') : resolve('./public/mail/');
    const mailDir = resolve('./assets/mail/');
    console.log(mailDir);

    const mail = new Email({
      message: {
        from: `Simon <${process.env.EMAIL_USER}>`,
      },
      views: {
        options: {
          extension: 'ejs',
        },
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: mailDir,
        },
      },
    });

    const emailTemplate = await mail.render(resolve(mailDir, 'contact.ejs'), {
      name,
      email,
      subject,
      message,
    });

    const mailOptions = {
      from: `Simon <${process.env.EMAIL_USER}>`,
      to: 'simon.alt.form@gmail.com',
      subject: `Form submission: ${subject}`,
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);

    if (!info || !info.accepted || info.accepted.length === 0) {
      throw new Error('Email not sent');
    }
  } catch (error) {
    response.status(500).json({ success: false });
    return;
  }

  response.status(200).json({ success: true });
};
