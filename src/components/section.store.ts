import { atom } from "nanostores";

export const sectionStore = atom([]);
export const currSection = atom(0);

const observer = new IntersectionObserver(function intersecting(entries) {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const idx = sectionStore.get().indexOf(entry.target);
      currSection.set(idx);
    }
  }
});

export function addSection(element: HTMLElement) {
  sectionStore.set([...sectionStore.get(), element]);
  observer.observe(element);
}
