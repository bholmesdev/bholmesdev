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
  loader: strapiLoader({ contentType: "blog-post" }),
});

export const collections = { blog, strapiBlog };

function strapiLoader({ contentType }: { contentType: string }): Loader {
  return {
    name: "post-loader",
    load: async ({ store, meta, logger }) => {
      const lastSynced = meta.get("lastSynced");

      // Don't sync more than once a minute
      if (lastSynced && Date.now() - Number(lastSynced) < 1000 * 60) {
        logger.info("Skipping Strapi sync");
        return;
      }

      logger.info("Fetching posts from Strapi");
      const res = await fetchStrapi("GET", `/api/${contentType}s`);
      const posts = (await res.json()).data;

      store.clear();

      for (const post of posts.slice(0, 10)) {
        store.set({ id: post.id, data: post });
      }
      meta.set("lastSynced", String(Date.now()));
    },
    schema: async () => {
      const res = await fetchStrapi(
        "GET",
        `/api/content-type-builder/content-types/api::${contentType}.${contentType}`
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch content type: ${contentType}`);
      }
      const contentTypeRes = await res.json();
      const attributes = contentTypeRes.data.schema.attributes;
      let validator: any = {};
      for (const [name, properties] of Object.entries(attributes)) {
        const { required } = properties as any;
        validator[name] = required ? z.string() : z.string().optional();
      }
      return z.object(validator);
    },
  };
}
