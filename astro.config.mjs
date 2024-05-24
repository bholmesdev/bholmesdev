import { defineConfig } from "astro/config";
import simpleScope from "vite-plugin-simple-scope";
import markdoc from "@astrojs/markdoc";
import icon from "astro-icon";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: cloudflare({
    imageService: "custom",
    platformProxy: {
      enabled: true,
    },
  }),
  image: {
    endpoint: import.meta.env.PROD ? "./src/image-passthrough.ts" : undefined,
  },
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
    ssr: {
      external: ["node:async_hooks", "node:crypto", "perf_hooks", "sharp"],
    },
  },
  experimental: {
    actions: true,
  },
});
