import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const blog = await getCollection("blog");
  return rss({
    title: "The BHolmesDev Blog",
    description: "A smattering of posts about web development by Ben Holmes",
    site: context.site ?? "http://localhost:4321",
    items: blog
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        // Compute RSS link from post `slug`
        // This example assumes all posts are rendered as `/blog/[slug]` routes
        link: `/blog/${post.slug}/`,
      })),
  });
}
