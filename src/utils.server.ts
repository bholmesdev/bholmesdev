import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";
import type { APIContext } from "astro";
import { ActionError } from "astro:actions";
import { db, eq, Post } from "astro:db";
import { createHash } from "node:crypto";

export async function checkIfRateLimited(
  ctx: Pick<APIContext, "request" | "locals">
): Promise<boolean> {
  const ip = ctx.request.headers.get("cf-connecting-ip");
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

export async function getLikes(postSlug: string): Promise<number> {
  const post = await db
    .select({ likes: Post.likes })
    .from(Post)
    .where(eq(Post.slug, postSlug))
    .get();
  if (!post) return 0;

  return post.likes;
}
