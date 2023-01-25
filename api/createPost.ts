import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

import multiparty from 'multiparty';
import { z } from 'zod';

const Post = z.object({
  name: z.string(),
  email: z.string().email(),
  title: z.string(),
  content: z.string(),
});

interface FormData {
  fields: z.infer<typeof Post>;
  files: any;
}

const redis = Redis.fromEnv();

export default async (request: VercelRequest, response: VercelResponse) => {
  const method = request.method;

  if (method !== 'POST') {
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

  try {
    // This will throw if the data is not in the correct format as specified
    // by the schema defined in "Post".
    Post.parse(data.fields);
  } catch (err) {
    response.status(400).json({ success: false });
    return;
  }

  const id = await redis.incr('messages:id');

  const p = redis.pipeline();
  p.hset(`messages:${id}`, data.fields);
  p.rpush('messages:ids', id);
  await p.exec();
};

export const config = {
  api: {
    bodyParser: false,
  },
};
