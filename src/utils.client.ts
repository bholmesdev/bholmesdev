const templateToShownMap = new WeakMap<HTMLTemplateElement, ChildNode>();

export function showTemplate(template: HTMLTemplateElement) {
  const content = template.content.cloneNode(true);
  if (!content.firstChild) {
    throw new Error(
      "Template show failed. Template does not have any content."
    );
  }
  if (!template.parentElement) {
    throw new Error(
      "Template show failed. Template does not have a parent element. Does the template exist in the document?"
    );
  }

  const element = template.parentElement.insertBefore(
    content.firstChild,
    template
  );
  templateToShownMap.set(template, element);
  return element;
}

export function hideTemplate(template: HTMLTemplateElement) {
  const shown = templateToShownMap.get(template);
  if (shown) {
    shown.remove();
    templateToShownMap.delete(template);
  }
}

export function toggleTemplate(template: HTMLTemplateElement) {
  if (templateToShownMap.has(template)) {
    hideTemplate(template);
  } else {
    showTemplate(template);
  }
}

export function toAttr(value: string | boolean | number) {
  if (typeof value === "boolean") {
    return value ? "" : null;
  }
  return value.toString();
}

export function createRoot(rootName: string) {
  return {
    name: rootName,
    target(name: string) {
      return `${rootName}.${name}`;
    },
    action(name: string) {
      if (import.meta.env.DEV) {
        return `const el = this.closest(${JSON.stringify(rootName)})
      if (!el) throw new Error('Action ${JSON.stringify(
        name
      )} called, but no parent root was found. Did you wrap this element with a root?');
      const action = el.${name};
      if (typeof action !== "function") throw new Error('Action ${JSON.stringify(
        name
      )} does not exist on ${JSON.stringify(rootName)}');
      action(event)`;
      }
      return `this.closest(${JSON.stringify(rootName)})?.${name}?.(event)`;
    },
  };
}
