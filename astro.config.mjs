import { defineConfig } from 'astro/config';

import svelte from "@astrojs/svelte";
import { simpleScope } from './vite-plugin-simple-scoped.mjs';

// https://astro.build/config
export default defineConfig({
    integrations: [svelte()],
    vite: {
        plugins: [simpleScope()],
    }
});
