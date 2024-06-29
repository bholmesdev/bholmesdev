import { defineConfig } from "astro/config";
import simpleScope from "vite-plugin-simple-scope";
import markdoc from "@astrojs/markdoc";
import icon from "astro-icon";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: netlify(),
  integrations: [
    markdoc({
      allowHTML: true,
    }),
    icon(),
    react(),
  ],
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
