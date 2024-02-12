import { controller, target } from "@github/catalyst";
import { atom } from "nanostores";

export const progress = atom(0);

@controller
export class ArticleScrollElement extends HTMLElement {
  @target declare progress: HTMLProgressElement;

  #listener = () => {};
  connectedCallback() {
    this.#listener = () => {
      const articleHeight = this.offsetTop + this.offsetHeight;
      progress.set(
        Math.min((window.scrollY + window.innerHeight) / articleHeight, 1)
      );
    };
    document.addEventListener("scroll", this.#listener);
  }
  disconnectedCallback() {
    document.removeEventListener("scroll", this.#listener);
  }
}
