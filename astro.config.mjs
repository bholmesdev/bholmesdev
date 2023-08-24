import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import { simpleScope } from './vite-plugin-simple-scoped.mjs';

import markdoc from "@astrojs/markdoc";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), markdoc()],
  vite: {
    plugins: [simpleScope()]
  }
});