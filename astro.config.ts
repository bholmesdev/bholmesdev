import { defineConfig } from "astro/config";
import simpleScope from "vite-plugin-simple-scope";
import markdoc from "@astrojs/markdoc";
import icon from "astro-icon";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";
import type { Plugin as VitePlugin } from "vite";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: netlify(),
  integrations: [markdoc(), icon(), react()],
  vite: {
    plugins: [simpleScope(), simpleQuery()],
    esbuild: {
      keepNames: true,
    },
  },
  experimental: {
    actions: true,
  },
});

const virtualModuleId = "simple:query";
const resolvedVirtualModuleId = "\0" + virtualModuleId;

function simpleQuery(): VitePlugin {
  return {
    name: "simple-query",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id, opts) {
      if (id !== resolvedVirtualModuleId) return;
      if (opts?.ssr) {
        return `
        import { scope } from 'simple:scope';
        export const $ = scope;`;
      }
      return `import $$ from 'jquery';
      import { scope } from 'simple:scope';
      export const $ = (id) => {
      const scopedSelector = '#' + scope(id);
      if (document.querySelector(scopedSelector)) {
        return $$(scopedSelector);
      }
      return $$(id);
    }`;
    },
  };
}
