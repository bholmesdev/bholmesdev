import { ActionError, defineAction, z } from "astro:actions";
import {
  checkIfRateLimited,
  updateLikes,
  getLikes,
  fetchStrapi,
} from "~/utils.server";
import { getEntry } from "astro:content";

export const server = {
  like: defineAction({
    input: z.object({
      postSlug: z
        .string()
        .refine(async (s) => Boolean(await getEntry("strapiBlog", s))),
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
  subscribeToNewsletter: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
    }),
    handler: async ({ email }) => {
      const res = await fetchStrapi("POST", "/api/newsletters", { email });

      if (!res.ok) {
        console.log(res.status, await res.clone().text());
        throw new ActionError({
          code: "BAD_REQUEST",
          message: `Unable to subscribe to newsletter.`,
        });
      }

      return { success: true };
    },
  }),
};
