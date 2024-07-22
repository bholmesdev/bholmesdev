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

export function effect(callback: Function, opts?: { signal: AbortSignal }) {
  let cleanup: Function | undefined;

  const computed = new Signal.Computed(() => {
    typeof cleanup === "function" && cleanup();
    cleanup = callback();
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
