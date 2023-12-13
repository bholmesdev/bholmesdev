import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import simpleScope from "vite-plugin-simple-scope";
import markdoc from "@astrojs/markdoc";

import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), markdoc(), alpinejs()],
  vite: {
    plugins: [simpleScope()],
  },
});
