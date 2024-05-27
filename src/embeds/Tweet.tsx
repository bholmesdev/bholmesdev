import { useEffect, useState } from "react";

async function fetchTweet(id: string) {
  try {
    const oembedUrl = new URL("https://publish.twitter.com/oembed");
    oembedUrl.searchParams.set("url", id);
    oembedUrl.searchParams.set("omit_script", "true");
    oembedUrl.searchParams.set("dnt", "true");
    return (await fetch(oembedUrl).then((res) => res.json())) as {
      url: string;
      author_name: string;
      author_url: string;
      html: string;
    };
  } catch (e) {
    console.error(
      `[error]  astro-embed
         ${e.status} - ${e.statusText}: Failed to fetch tweet ${id}`
    );
    return undefined;
  }
}
export function Tweet({ id }: { id: string }) {
  const [html, setHtml] = useState("");
  useEffect(() => {
    (async () => {
      const res = await fetchTweet(id);
      if (!res) {
        throw new Error(`Tweet ${id} does not exist.`);
      }
      setHtml(res.html);
    })();
  }, [id]);

  return <p dangerouslySetInnerHTML={{ __html: html }} />;
}

<script async src="https://platform.twitter.com/widgets.js"></script>;
