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
        import { transitionEnabledOnThisPage } from 'astro:transitions/client';

        const $ = (scopeId) => {
          const selector = \`[data-target=\${scope(scopeId)}]\`;
          const element = document.querySelector(selector);
          if (!element) throw new Error(\`Element not found: \${selector}\`);

          element.all = (selector) => [...element.querySelectorAll(selector)];

          return element;
        }

        function hasScopeElement() {
          return !!document.querySelector(\`[data-target$="\${scope()}"]\`);
        }
          
        function ready(callback) {
          if (transitionEnabledOnThisPage()) {
            let cleanup;

            document.addEventListener("astro:page-load", async () => {
              if (cleanup) cleanup();
              if (!hasScopeElement()) return;

              cleanup = await callback();
            });
          } else {
            if (!hasScopeElement()) return;
            callback();
          }
        }\n${code}`;
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
