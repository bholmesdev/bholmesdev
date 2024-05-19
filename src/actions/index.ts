import { defineAction, getApiContext, z } from "astro:actions";
import { Redis } from "@upstash/redis/cloudflare";
import { getVisitorId } from "~/utils.server";

export const server = {
  like: defineAction({
    input: z.object({
      postSlug: z.string(),
    }),
    handler: async ({ postSlug }) => {
      const ctx = getApiContext();
      const redis = Redis.fromEnv(ctx.locals.runtime.env);

      const visitorId = getVisitorId(ctx);
      // TODO: decide behavior if visitorId is undefined
      if (!visitorId) {
        return { likes: await redis.scard(`likes:${postSlug}`) };
      }
      if (await redis.sismember(`likes:${postSlug}`, visitorId)) {
        await redis.srem(`likes:${postSlug}`, visitorId);
      } else {
        await redis.sadd(`likes:${postSlug}`, visitorId);
      }
      return { likes: await redis.scard(`likes:${postSlug}`) };
    },
  }),
};
