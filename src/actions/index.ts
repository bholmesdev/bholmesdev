import { ActionError, defineAction, z } from "astro:actions";
import { checkIfRateLimited } from "~/utils.server";
import { getEntry } from "astro:content";
import { Post, db, gt, sql } from "astro:db";

const BUTTONDOWN_URL = "https://api.buttondown.email/v1/";

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

      const upsert = await db
        .insert(Post)
        .values({
          slug: postSlug,
          likes: liked ? 1 : 0,
        })
        .onConflictDoUpdate(
          liked
            ? {
                target: Post.slug,
                set: { likes: sql`likes + 1` },
              }
            : {
                target: Post.slug,
                set: { likes: sql`likes - 1` },
                where: gt(Post.likes, 0),
              }
        )
        .returning()
        .get();

      return { likes: upsert?.likes ?? 0 };
    },
  }),
  subscribeToNewsletter: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
      musicRecs: z.boolean(),
    }),
    handler: async ({ email, musicRecs }, ctx) => {
      const res = await fetch(new URL("subscribers", BUTTONDOWN_URL), {
        method: "POST",
        body: JSON.stringify({ email, tags: musicRecs ? ["music"] : [] }),
        headers: {
          "content-type": "application/json",
          Authorization: `Token ${ctx.locals.runtime.env.BUTTONDOWN_API_KEY}`,
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
