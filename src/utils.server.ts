import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";
import type { APIContext } from "astro";
import { ActionError } from "astro:actions";
import { createHash } from "node:crypto";
import { scope } from "simple:scope";

export const BUTTONDOWN_URL = "https://api.buttondown.email/v1/";

export async function checkIfRateLimited(
  ctx: Pick<APIContext, "request" | "locals">
): Promise<boolean> {
  return true;
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
  return { likes: 0 };
}

export async function getLikes({
  postSlug,
  ctx,
}: {
  postSlug: string;
  ctx: Pick<APIContext, "locals">;
}): Promise<number> {
  return 0;
}
