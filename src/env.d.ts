/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite-plugin-simple-scope/types" />

type NetlifyLocals = import("@astrojs/netlify").NetlifyLocals;

declare namespace App {
  interface Locals extends NetlifyLocals {}
}

declare module "simple:query" {
  export const $: (id: string) => ReturnType<typeof import("jquery")> & string;
}

declare function el(selector: string): HTMLElement & { all: HTMLElement[] };
