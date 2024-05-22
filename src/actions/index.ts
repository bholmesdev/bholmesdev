import { ActionError, defineAction, getApiContext, z } from "astro:actions";
import { Redis } from "@upstash/redis/cloudflare";
import { Ratelimit } from "@upstash/ratelimit";
import { getLikes, getVisitorId } from "~/utils.server";
import { getEntry } from "astro:content";

const BUTTONDOWN_URL = "https://api.buttondown.email/v1/";

export const server = {
  subscribeToNewsletter: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
      musicRecs: z.boolean(),
    }),
    handler: async ({ email, musicRecs }) => {
      const ctx = getApiContext();
      const res = await fetch(new URL("subscribers", BUTTONDOWN_URL), {
        method: "POST",
        body: JSON.stringify({ email, tags: musicRecs ? ["music"] : [] }),
        headers: {
          "content-type": "application/json",
          Authorization: `Token ${ctx.locals.runtime.env.BUTTONDOWN_API_KEY}`,
        },
      });

      if (!res.ok) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Unable to subscribe to newsletter.",
        });
      }
      return { success: true };
    },
  }),
  like: defineAction({
    input: z.object({
      postSlug: z
        .string()
        .refine(async (s) => Boolean(await getEntry("blog", s))),
      isLike: z.boolean().default(false),
    }),
    handler: async ({ postSlug, isLike }) => {
      const ctx = getApiContext();
      const redis = Redis.fromEnv(ctx.locals.runtime.env);
      const ratelimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, "1 d"),
      });

      if (import.meta.env.PROD) {
        const visitorId = getVisitorId(ctx);
        if (!visitorId) {
          throw new ActionError({
            code: "FORBIDDEN",
            message: "No header found for rate limiting.",
          });
        }

        const { success } = await ratelimiter.limit(visitorId);
        if (!success) {
          throw new ActionError({
            code: "TOO_MANY_REQUESTS",
          });
        }
      }

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
