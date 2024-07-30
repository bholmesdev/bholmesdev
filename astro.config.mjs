import { defineConfig } from "astro/config";
import markdoc from "@astrojs/markdoc";
import icon from "astro-icon";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";
import simpleQuery from "simple-stack-query";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: netlify({
    edgeMiddleware:true
  }),
  integrations: [markdoc(), icon(), react(), simpleQuery()],
  experimental: {
    actions: true,
  },
});
