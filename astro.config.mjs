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
  integrations: [markdoc(), icon(), react()],
  vite: {
    plugins: [
      simpleScope(),
      {
        name: "simple-stack-dom",
        transform(code, id, opts) {
          const [baseId, search] = id.split("?");
          if (!baseId?.endsWith(".astro")) return;

          const isAstroFrontmatter = !search;

          if (isAstroFrontmatter) {
            return `
          import { scope } from 'simple:scope';
          const $ = scope;\n${code}`;
          }

          const searchParams = new URLSearchParams(search);
          if (!searchParams.has("lang.ts")) return;

          return `
        import { scope } from 'simple:scope';
        import * as __queryInternals from '/simple-query.mjs';

        const $ = __queryInternals.create$(scope);
        const ready = __queryInternals.createReady(scope);\n${code}`;
        },
      },
    ],
    esbuild: {
      keepNames: true,
    },
  },
  experimental: {
    actions: true,
  },
});
