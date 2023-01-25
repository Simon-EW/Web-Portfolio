import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async (request: VercelRequest, response: VercelResponse) => {
  const { id } = request.query;
  const method = request.method;

  console.log('id', id);

  if (method !== 'GET') {
    response.status(405).json({ success: false });
    return;
  }

  const post = await redis.hgetall(`posts:${id}`);

  console.log('post', post);

  if (!post) {
    response.status(404).json({ success: false });
    return;
  }

  response.status(200).json(post);
};
