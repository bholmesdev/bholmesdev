import { ActionError, defineAction } from "astro:actions";
import { checkIfRateLimited, updateLikes, getLikes } from "~/utils.server";
import { z } from "astro:schema";
import { getEntry } from "astro:content";

export const server = {
  like: defineAction({
    input: z.object({
      postSlug: z
        .string()
        .refine(async (s) => Boolean(await getEntry("blog", s))),
      liked: z.boolean().default(false),
    }),
    handler: async ({ postSlug, liked }, ctx) => {
      const isRateLimited = await checkIfRateLimited(ctx);
      if (isRateLimited) {
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
        });
      }

      return await updateLikes({ postSlug, liked });
    },
  }),
  getLikes: defineAction({
    input: z.object({
      postSlug: z.string(),
    }),
    handler: getLikes,
  }),
};
