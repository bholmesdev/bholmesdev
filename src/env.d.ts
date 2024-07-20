/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite-plugin-simple-scope/types" />

type NetlifyLocals = import("@astrojs/netlify").NetlifyLocals;

declare namespace App {
  interface Locals extends NetlifyLocals {}
}

declare function $<T extends Element = HTMLElement>(
  selector: string,
  opts?: { optional: boolean }
): T & {
  all: () => T[];
};

declare function ready(callback: Function): void | Function;
