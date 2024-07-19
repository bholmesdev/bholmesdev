// Sample effect implementation from signal-polyfill:
// https://github.com/proposal-signals/signal-polyfill?tab=readme-ov-file#creating-a-simple-effect

import { transitionEnabledOnThisPage } from "astro:transitions/client";
import { Signal } from "signal-polyfill";

let needsEnqueue = true;

const w = new Signal.subtle.Watcher(() => {
  if (needsEnqueue) {
    needsEnqueue = false;
    queueMicrotask(processPending);
  }
});

function processPending() {
  needsEnqueue = true;

  for (const s of w.getPending()) {
    s.get();
  }

  w.watch();
}

let effectCleanupFns = new Set<() => void>();

export function effect(callback: Function, opts?: { signal: AbortSignal }) {
  let cleanup: Function | undefined;

  const computed = new Signal.Computed(() => {
    typeof cleanup === "function" && cleanup();
    cleanup = callback();
    effectCleanupFns.add(() => {
      w.unwatch(computed);
      typeof cleanup === "function" && cleanup();
      cleanup = undefined;
    });
  });

  w.watch(computed);
  computed.get();

  opts?.signal?.addEventListener(
    "abort",
    () => {
      w.unwatch(computed);
      typeof cleanup === "function" && cleanup();
      cleanup = undefined;
    },
    { once: true }
  );

}

export function onPageLoad(callback: Function) {
  if (transitionEnabledOnThisPage()) {
    let route = location.pathname;
    let cleanup: Function | undefined;

    document.addEventListener("astro:page-load", async () => {
      for (const d of effectCleanupFns) d();
      effectCleanupFns.clear();
      if (cleanup) cleanup();

      if (route === location.pathname) {
        cleanup = await callback();
      }
    });
  } else {
    callback();
  }
}
