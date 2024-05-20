import { defineConfig } from "astro/config";
import simpleScope from "vite-plugin-simple-scope";
import markdoc from "@astrojs/markdoc";
import icon from "astro-icon";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: cloudflare({
    imageService: "cloudflare",
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
  image: {
    // service: squooshImageService(),
    // domains: ["https://dev-to-uploads.s3.amazonaws.com"],
  },
  vite: {
    plugins: [simpleScope()],
    esbuild: {
      keepNames: true,
    },
    ssr: {
      external: ["node:async_hooks", "node:crypto", "node:perf_hooks"],
    },
  },
  experimental: {
    actions: true,
  },
});
