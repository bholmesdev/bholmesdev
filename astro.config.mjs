import { defineConfig } from "astro/config";
import simpleScope from "vite-plugin-simple-scope";
import markdoc from "@astrojs/markdoc";
import icon from "astro-icon";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: cloudflare({
    imageService: "compile",
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    markdoc({
      allowHTML: true,
    }),
    icon(),
  ],
  vite: {
    plugins: [simpleScope()],
    esbuild: {
      keepNames: true,
    },
    ssr: {
      external: ["node:async_hooks", "node:crypto", "perf_hooks", "sharp"],
    },
  },
  experimental: {
    actions: true,
  },
});
