import { z } from "zod";

export const videoSchema = z
  .object({
    body: z.string(),
    headings: z.array(
      z.object({
        depth: z.number(),
        slug: z.string(),
        text: z.string(),
      })
    ),
    data: z.object({
      youtube: z.object({
        embedUrl: z.string().url(),
        url: z.string().url(),
        thumbnailUrl: z.string().url(),
      })
    }),
  })
  .transform((v) => ({
    title: v.headings.find((h) => h.depth === 1)?.text,
    ...v,
  }));

export const videosSchema = z.array(videoSchema);