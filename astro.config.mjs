import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import { simpleScope } from './vite-plugin-simple-scoped.mjs';
import checker from 'vite-plugin-checker';
import markdoc from "@astrojs/markdoc";

// https://astro.build/config
export default defineConfig({
    integrations: [svelte(), markdoc()],
    vite: {
        plugins: [
            simpleScope(),
            checker({
                typescript: true,
                overlay: { initialIsOpen: false, badgeStyle: 'left: 55px; bottom: 8px;' },
                enableBuild: false, // we already check that in `yarn ci:check`
            }),
        ]
    }
});
