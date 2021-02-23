import zip from './zip'

export const dataPageAttrs = (page) =>
  [...page.querySelectorAll('[data-page]')].map((el) => ({
    el,
    value: el.getAttribute('data-page'),
  }))

export const getPageDiff = (page, prevPage) => {
  const [allPageEls, allPrevPageEls] = [page, prevPage].map(dataPageAttrs)

  const pageElPairs = zip(allPageEls, allPrevPageEls)
  for (let [left, right] of pageElPairs) {
    if (left.value !== right.value) {
      return [left.el, right.el]
    }
  }
  return [null, null]
}
