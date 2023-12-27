import { defineConfig } from "astro/config";
import simpleScope from "vite-plugin-simple-scope";
import markdoc from "@astrojs/markdoc";
import alpinejs from "@astrojs/alpinejs";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [markdoc(), alpinejs(), tailwind()],
  vite: {
    plugins: [simpleScope()],
  },
});
