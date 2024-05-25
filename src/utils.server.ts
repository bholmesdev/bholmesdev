import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";
import type { APIContext } from "astro";
import { ActionError } from "astro:actions";
import { db, eq, gt, Post, sql } from "astro:db";
import { createHash } from "node:crypto";

export async function checkIfRateLimited(
  ctx: Pick<APIContext, "request" | "locals">
): Promise<boolean> {
  const ip = import.meta.env.DEV
    ? "development"
    : ctx.request.headers.get("cf-connecting-ip");
  if (!ip) {
    throw new ActionError({
      code: "FORBIDDEN",
      message: "No header found for rate limiting.",
    });
  }

  const redis = Redis.fromEnv(ctx.locals.runtime.env);
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
  ctx,
}: {
  postSlug: string;
  liked: boolean;
  ctx: Pick<APIContext, "locals">;
}): Promise<{ likes: number }> {
  const redis = Redis.fromEnv(ctx.locals.runtime.env);
  const likes = await getLikes({ postSlug, ctx });
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
  ctx,
}: {
  postSlug: string;
  ctx: Pick<APIContext, "locals">;
}): Promise<number> {
  const redis = Redis.fromEnv(ctx.locals.runtime.env);
  const likesStr = await redis.get(`likes:${postSlug}`);
  if (!likesStr) return 0;

  const num = Number(likesStr);
  if (isNaN(num)) return 0;

  return num;
}
