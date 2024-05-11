import { defineConfig, squooshImageService } from "astro/config";
import simpleScope from "vite-plugin-simple-scope";
import markdoc from "@astrojs/markdoc";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [
    markdoc({
      allowHTML: true,
    }),
    icon(),
  ],
  image: {
    service: squooshImageService(),
    domains: ["https://dev-to-uploads.s3.amazonaws.com"],
  },
  vite: {
    plugins: [simpleScope()],
    esbuild: {
      keepNames: true,
    },
  },
});
