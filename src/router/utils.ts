/**
 * Takes in a variable number of arrays, and "zips" them together
 * into tuples based on their index
 * ex. [1, 2, 3], [4, 5, 6] -> [[1, 4], [2, 5], [3, 6]]
 */
 export function zip<T>(...rows: T[][]): (T | undefined)[][] {
  return [...rows[0]].map((_, c) => rows.map((row) => row[c]))
}

export const sleep = (duration: number) =>
new Promise((resolve) => setTimeout(resolve, duration))

export const toDataPageAttrs = (page: HTMLElement) =>
  [...page.querySelectorAll('[data-page]')].map((el) => ({
    el,
    value: el.getAttribute('data-page'),
  }))

export function getPageDiff (page: Element, prevPage: Element): [Element, Element] | null {
  const [allPageEls, allPrevPageEls] = [page, prevPage].map(toDataPageAttrs)

  const pageElPairs = zip(allPageEls, allPrevPageEls)
  // assume the entire page is different by default
  let diffPair: [Element, Element] = [page, prevPage]
  for (let [left, right] of pageElPairs) {
    if (typeof left === 'undefined' || typeof right === 'undefined') {
      // If either side is undefined, we've found our diff already
      return diffPair
    } else if (left.value === right.value) {
      // If page attributes are equal, these pages share a layout.
      // Assume the children of these layouts could be the diff,
      // and keep walking the pages to check for shared nested layouts
      diffPair = [left.el, right.el]
    } else {
      // In all other cases, the pages do *not* share a layout,
      // so we've found our diff already
      return diffPair
    }
  }
  return diffPair
}

export function isStylesheet(e: Element): e is HTMLLinkElement {
  return e instanceof HTMLLinkElement
}

export function isScriptWithSrc(e: Element): e is HTMLScriptElement {
  return e instanceof HTMLScriptElement && e.hasAttribute('src')
}

