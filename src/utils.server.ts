import type { Redis } from "@upstash/redis/cloudflare";
import { createHash } from "node:crypto";

export function getVisitorId({
  request,
}: {
  request: Request;
}): string | undefined {
  const ip = request.headers.get("cf-connecting-ip");
  if (!ip) return undefined;

  return createHash("sha256").update(ip).digest("hex");
}

export async function getLikes(
  redis: Redis,
  postSlug: string
): Promise<number> {
  const likesStr = await redis.get(`likes:${postSlug}`);
  if (!likesStr) return 0;

  const num = Number(likesStr);
  if (isNaN(num)) return 0;

  return num;
}
