import { addSection } from "./section.store";

class NumberedSection extends HTMLElement {
  connectedCallback() {
    addSection(this);
  }
}

customElements.define("numbered-section", NumberedSection);
