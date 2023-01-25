import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async (request: VercelRequest, response: VercelResponse) => {
  const start = Number(request.query.start) ?? 0;
  const end = Number(request.query.end) ?? 10;

  const messages = await redis.lrange('messages:ids', start, end);

  const p = redis.pipeline();
  messages.forEach((id: any) => p.hmget(`messages:${id}`, 'name', 'subject'));
  const messagesData = await p.exec<[Record<string, unknown>]>();

  response.status(200).json(messagesData);
};
