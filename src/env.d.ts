/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite-plugin-simple-scope/types" />

type NetlifyLocals = import("@astrojs/netlify").NetlifyLocals;

declare namespace App {
  interface Locals extends NetlifyLocals {}
}

declare function $<T extends Element = HTMLElement>(selector: string): T;

declare namespace $ {
  function all<T extends Element = HTMLElement>(selector: string): Array<T>;
  function optional<T extends Element = HTMLElement>(
    selector: string
  ): T | undefined;
}

declare function ready(callback: Function): void | Function;
