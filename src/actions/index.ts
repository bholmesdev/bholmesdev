import { ActionError, defineAction, getApiContext, z } from "astro:actions";
import { Redis } from "@upstash/redis/cloudflare";
import { getLikes, getVisitorId } from "~/utils.server";

export const server = {
  like: defineAction({
    input: z.object({
      postSlug: z.string(),
      isLike: z.boolean().default(false),
    }),
    handler: async ({ postSlug, isLike }) => {
      const ctx = getApiContext();
      const redis = Redis.fromEnv(ctx.locals.runtime.env);

      const visitorId = getVisitorId(ctx);
      if (!visitorId) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: "No header found for rate limiting.",
        });
      }

      // throw new ActionError({
      //   code: 'TOO_MANY_REQUESTS',
      // })
      // rate limit based on postSlug
      const likes = await getLikes(redis, postSlug);
      if (isLike) {
        return { likes: await redis.incr(`likes:${postSlug}`) };
      }
      if (likes > 0) {
        return { likes: await redis.decr(`likes:${postSlug}`) };
      }
      return { likes };
    },
  }),
};
