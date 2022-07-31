/**
 * Takes in a variable number of arrays, and "zips" them together
 * into tuples based on their index
 * ex. [1, 2, 3], [4, 5, 6] -> [[1, 4], [2, 5], [3, 6]]
 */
 export function zip<T>(...rows: T[][]): T[][] {
  return [...rows[0]].map((_, c) => rows.map((row) => row[c]))
}

export const sleep = (duration: number) =>
new Promise((resolve) => setTimeout(resolve, duration))

export const toDataPageAttrs = (page: HTMLElement) =>
  [...page.querySelectorAll('[data-page]')].map((el) => ({
    el,
    value: el.getAttribute('data-page'),
  }))

export const getPageDiff = (page, prevPage) => {
  const [allPageEls, allPrevPageEls] = [page, prevPage].map(toDataPageAttrs)

  const pageElPairs = zip(allPageEls, allPrevPageEls)
  for (let [left, right] of pageElPairs) {
    if (left.value !== right.value) {
      return [left.el, right.el]
    }
  }
  return [null, null]
}

export function isStylesheet(e: Element): e is HTMLLinkElement {
  return e instanceof HTMLLinkElement
}

export function isScriptWithSrc(e: Element): e is HTMLScriptElement {
  return e instanceof HTMLScriptElement && e.hasAttribute('src')
}

