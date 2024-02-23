import { defineConfig } from "astro/config";
import simpleScope from "vite-plugin-simple-scope";
import markdoc from "@astrojs/markdoc";
import tailwind from "@astrojs/tailwind";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [markdoc(), tailwind(), icon()],
  vite: {
    plugins: [simpleScope()],
    esbuild: {
      keepNames: true
    }
  }
});