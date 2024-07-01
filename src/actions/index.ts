import { ActionError, defineAction, z } from "astro:actions";
import {
  checkIfRateLimited,
  updateLikes,
  BUTTONDOWN_URL,
  getEnv,
  getLikes,
} from "~/utils.server";
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
  subscribeToNewsletter: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
    }),
    handler: async ({ email }) => {
      const res = await fetch(new URL("subscribers", BUTTONDOWN_URL), {
        method: "POST",
        body: JSON.stringify({ email, tags: ["music"] }),
        headers: {
          "content-type": "application/json",
          Authorization: `Token ${getEnv().BUTTONDOWN_API_KEY}`,
        },
      });

      if (!res.ok) {
        const json = await res.json();
        if (json.code === "email_already_exists") {
          throw new ActionError({
            code: "CONFLICT",
            message: "Email already subscribed to newsletter.",
          });
        }
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Unable to subscribe to newsletter.",
        });
      }
      return { success: true };
    },
  }),
};
