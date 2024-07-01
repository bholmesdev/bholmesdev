import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";
import type { APIContext } from "astro";
import { z } from "astro/zod";
import { createHash } from "node:crypto";
import { scope } from "simple:scope";

export const BUTTONDOWN_URL = "https://api.buttondown.email/v1/";

const envSchema = z.object({
  BUTTONDOWN_API_KEY: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
  UPSTASH_REDIS_REST_URL: z.string(),
});

export function getEnv() {
  return envSchema.parse(import.meta.env);
}

export async function checkIfRateLimited(
  ctx: Pick<APIContext, "request" | "locals">
): Promise<boolean> {
  const ip = import.meta.env.DEV
    ? scope("development")
    : ctx.locals.netlify.context.ip;

  const redis = Redis.fromEnv(getEnv());
  const ipHash = createHash("sha256").update(ip).digest("hex");
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 d"),
  });
  const limited = await ratelimit.limit(ipHash);
  return !limited.success;
}

export async function updateLikes({
  postSlug,
  liked,
}: {
  postSlug: string;
  liked: boolean;
}): Promise<{ likes: number }> {
  const redis = Redis.fromEnv(getEnv());
  const { likes } = await getLikes({ postSlug });
  if (liked) {
    return { likes: await redis.incr(`likes:${postSlug}`) };
  }
  if (likes > 0) {
    return { likes: await redis.decr(`likes:${postSlug}`) };
  }
  return { likes };
}

export async function getLikes({
  postSlug,
}: {
  postSlug: string;
}): Promise<{ likes: number }> {
  const redis = Redis.fromEnv(getEnv());
  const likesStr = await redis.get(`likes:${postSlug}`);
  if (!likesStr) return { likes: 0 };

  const num = Number(likesStr);
  if (isNaN(num)) return { likes: 0 };

  return { likes: num };
}
