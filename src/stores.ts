import { Signal } from "signal-polyfill";

export const isDrawing = new Signal.State(false);
export const progress = new Signal.State(0);
export const currentSectionIdx = new Signal.State(0);
