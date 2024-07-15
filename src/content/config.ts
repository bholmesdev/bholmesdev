import type { ImageMetadata } from "astro";
import { defineCollection, z } from "astro:content";
import type { Loader } from "astro/loaders";
import { fetchStrapi } from "~/utils.server";

const blog = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Metadata from dev.to. May use someday?
      series: z.string().optional(),
      image: z
        .string()
        .regex(/^https:.*/)
        .transform(
          (url) =>
            ({
              src: url,
              width: 1200,
              height: 630,
              format: "jpeg",
            } satisfies ImageMetadata)
        )
        .or(image())
        .optional(),
      date: z.coerce.date(),
      draft: z.boolean().default(false),
    }),
});

const strapiBlog = defineCollection({
  type: "experimental_data",
  loader: postLoader({ url: "https://jsonplaceholder.typicode.com/posts" }),
});

export const collections = { blog, strapiBlog };

export interface PostLoaderConfig {
  url: string;
}

function postLoader(config: PostLoaderConfig): Loader {
  return {
    name: "post-loader",
    load: async ({ store, meta, logger }) => {
      logger.info("Loading posts");

      const lastSynced = meta.get("lastSynced");

      // Don't sync more than once a minute
      if (lastSynced && Date.now() - Number(lastSynced) < 1000 * 60) {
        logger.info("Skipping sync");
        return;
      }

      const res = await fetchStrapi("GET", "/api/blog-posts");
      const posts = (await res.json()).data;

      store.clear();

      for (const post of posts.slice(0, 10)) {
        store.set({ id: post.id, data: post });
      }
      meta.set("lastSynced", String(Date.now()));
    },
    schema: async () => {
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return z.object({
        title: z.string(),
        description: z.string(),
        draft: z.boolean().default(false),
        body: z.string(),
      });
    },
  };
}
