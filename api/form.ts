import { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import multiparty from 'multiparty';

interface FormData {
  fields: FormFields;
  files: any;
}

interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const redis = Redis.fromEnv();

export default async (request: VercelRequest, response: VercelResponse) => {
  if (request.method !== 'POST') {
    response.status(405).json({ success: false });
    return;
  }

  // We need to parse the request body ourselves because we disabled the
  // default body parser in the config below due to it seeming not to work
  // well with form data.

  const form = new multiparty.Form();
  const data: FormData = await new Promise((resolve, reject) => {
    form.parse(request, function (err, fields, files) {
      if (err) reject({ err });
      resolve({ fields, files });
    });
  });

  const { name, email, subject, message } = data.fields;

  const id = await redis.incr('messages:id');

  const p = redis.pipeline();
  p.hset(`messages:${id}`, { name, email, subject, message });
  p.rpush('messages:ids', id);
  await p.exec();

  response.status(200).json({ success: true });
};

export const config = {
  api: {
    bodyParser: false,
  },
};
