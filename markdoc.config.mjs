import { component, defineMarkdocConfig } from "@astrojs/markdoc/config";
import shiki from "@astrojs/markdoc/shiki";

export default defineMarkdocConfig({
  tags: {
    codepen: {
      render: component("./src/components/Codepen.astro"),
      attributes: {
        height: { type: Number },
        defaultTab: { type: String },
        url: { type: String, required: true },
      },
    },
    tweet: {
      render: component("./src/components/Tweet.astro"),
      attributes: {
        id: { type: String, required: true },
      },
    },
    youtube: {
      render: component("astro-embed", "YouTube"),
      attributes: {
        id: { type: String, required: true },
      },
    },
  },
  extends: [shiki()],
});
