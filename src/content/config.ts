import type { ImageMetadata } from "astro";
import { defineCollection, z } from "astro:content";

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

export const collections = { blog };
