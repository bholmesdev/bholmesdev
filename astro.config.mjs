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

        function $(scopeId) {
          const element = document.querySelector($._getSelector(scopeId));
          if (!element) throw new Error(\`Element not found: \${selector}\`);
          return element;
        }
        Object.assign($, {
          optional(scopeId) {
            const selector = $._getSelector(scopeId);
            return document.querySelector(selector) ?? undefined
          },
          all(scopeId) {
            const selector = $._getSelector(scopeId);
            return [...document.querySelectorAll(selector)];
          },
          _getSelector(scopeId) {
            return \`[data-target=\${JSON.stringify(scope(scopeId))}]\`
          },
          _hasScopeElement() {
            const selector = \`[data-target$=\${JSON.stringify(scope())}\`;
            return Boolean(document.querySelector(selector));
          },
        });
          
        function ready(callback) {
          if (transitionEnabledOnThisPage()) {
            let cleanup;

            document.addEventListener("astro:page-load", async () => {
              if (cleanup) cleanup();
              if (!$._hasScopeElement()) return;

              cleanup = await callback();
            });
          } else {
            if (!$._hasScopeElement()) return;
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
