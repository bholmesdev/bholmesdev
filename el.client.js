globalThis.el = (selector) => {
  const element = document.querySelector(selector);
  if (!element) throw new Error(`Element not found: ${selector}`);

  element.all = () => document.querySelectorAll(selector);
  return element;
};
