const jumpToSection = {
  container: document.querySelector('.jump-to-section__container'),
  number: document.querySelector('#jump-to-section__toggle > span'),
  linkContainer: document.getElementById('jump-to-section__links'),
  labelContainer: document.getElementById('jump-to-section__label'),
  toggle: document.getElementById('jump-to-section__toggle'),
  heading: document.createElement('li'),
}
jumpToSection.heading.innerText = 'Jump to section'
jumpToSection.heading.className = 'heading'

const INTERSECTION_MARGIN = 100

const options = {
  rootMargin: `0px 0px -${INTERSECTION_MARGIN}px 0px`,
  threshold: 0,
}

export const getPageHeaders = () => [
  ...document.querySelectorAll('main h2.numbered'),
]

/**
 *
 * @param {(sectionIndex: number) => void} intersectionCallback Function to call whenever the section index changes
 * @returns Cleanup function to use within the page cleanup
 */
export const watchSectionHeaders = (intersectionCallback = () => {}) => {
  let sectionIndex = -1
  const headers = getPageHeaders()

  const handleIntersect = () => {
    const newSectionIndex = [...headers.entries()].reduce(
      (runningSectionIndex, [index, header]) => {
        const hasScrolledPastHeader =
          header.offsetTop <=
          window.scrollY + window.innerHeight - INTERSECTION_MARGIN

        // if we've already scrolled past this header,
        // we're *at least* as far down as this section
        return hasScrolledPastHeader ? index : runningSectionIndex
        // we'll keep looping to see how far down the page we really are
      },
      -1
    )
    if (newSectionIndex !== sectionIndex) {
      sectionIndex = newSectionIndex
      intersectionCallback(sectionIndex, headers)
    }
  }

  const observer = new IntersectionObserver(handleIntersect, options)
  headers.forEach((header) => observer.observe(header))

  return () => {
    observer.disconnect()
  }
}
