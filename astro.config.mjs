import { defineConfig } from "astro/config";
import simpleScope from "vite-plugin-simple-scope";
import markdoc from "@astrojs/markdoc";
import icon from "astro-icon";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";
import simpleQuery from "simple-stack-query";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: netlify(),
  integrations: [markdoc(), icon(), react(), simpleQuery()],
  vite: {
    plugins: [simpleScope()],
    esbuild: {
      keepNames: true,
    },
  },
  experimental: {
    actions: true,
  },
});
