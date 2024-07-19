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
    plugins: [simpleScope(), {
      name: 'el',
      transform(code, id, opts) {
        const [baseId, search] = id.split('?');
        if (!baseId?.endsWith('.astro')) return;

        const isAstroFrontmatter = !search;

        if (isAstroFrontmatter) {
          return `
          import { scope } from 'simple:scope';
          const el = scope;\n${code}`;
        }

        const searchParams = new URLSearchParams(search);
        if (!searchParams.has('lang.ts')) return;

        return `
        import { scope } from 'simple:scope';

        const el = (scopeId) => {
          const selector = \`[data-el=\${scope(scopeId)}]\`;
          const element = document.querySelector(selector);
          if (!element) throw new Error(\`Element not found: \${selector}\`);

          return element;
        }\n${code}`; 
      }
    }],
    esbuild: {
      keepNames: true,
    },
  },
  experimental: {
    actions: true,
  },
});
