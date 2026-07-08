import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";

export async function GET(context: APIContext) {
  const site = context.site ?? new URL("http://localhost:4321");
  const blog = await getCollection("blog", ({ data }) => !data.draft);
  const container = await AstroContainer.create();

  const items = [];
  for (const post of blog.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  )) {
    const { Content } = await post.render();
    const html = await container.renderToString(
      Content as unknown as AstroComponentFactory,
    );
    items.push({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      // This assumes all posts are rendered as `/blog/[slug]` routes
      link: `/blog/${post.slug}/`,
      content: toRssValidHtml(html, site),
    });
  }

  return rss({
    title: "The BHolmesDev Blog",
    description: "A smattering of posts about web development by Ben Holmes",
    site,
    items,
  });
}

/**
 * Strip scripts, styles, and Astro-specific attributes,
 * and resolve relative URLs against the site origin
 * so the HTML is safe and readable in RSS readers.
 */
function toRssValidHtml(html: string, site: URL | string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "iframe"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "srcset", "alt", "width", "height"],
      iframe: ["src", "title", "width", "height", "allowfullscreen"],
    },
    transformTags: {
      // astro-embed renders `<lite-youtube>` custom elements, which RSS
      // readers can't run. Swap in a standard YouTube iframe embed.
      "lite-youtube": (_, attribs) => ({
        tagName: "iframe",
        attribs: {
          src: `https://www.youtube-nocookie.com/embed/${attribs.videoid}`,
          ...(attribs["data-title"] ? { title: attribs["data-title"] } : {}),
          width: "560",
          height: "315",
          allowfullscreen: "",
        },
      }),
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.href ? { href: new URL(attribs.href, site).href } : {}),
        },
      }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.src ? { src: new URL(attribs.src, site).href } : {}),
        },
      }),
    },
    // Drop link-less leftovers like lite-youtube's play button:
    // `<a href="..."><span></span></a>`
    exclusiveFilter: (frame) =>
      frame.tag === "a" && !frame.text.trim() && !frame.mediaChildren.length,
  });
}
