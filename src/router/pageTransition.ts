import { getPageDiff, sleep } from './utils'

export async function animatePageIntoView (newPage: Document) {
  const [page, prevPage] = getPageDiff(newPage, document)
  const layoutContainer = prevPage.parentElement
  layoutContainer.style.position = 'relative'
  layoutContainer.insertBefore(page, prevPage)

  await new Promise((resolve) => {
    requestAnimationFrame(async () => {
      const cssAnimDuration = getComputedStyle(
        document.querySelector('[data-page]')
      ).getPropertyValue('--page-anim-duration').trim()
      const digits = cssAnimDuration.match(/^\d+(\.\d+)?/)?.[0]
      const isSeconds = !cssAnimDuration.endsWith('ms')
      let animDuration = Number(digits)
      if (Number.isNaN(animDuration)) {
        animDuration = 0
      }
      if (isSeconds) {
        animDuration *= 1000
      }
      // HACK: Small offset to match JS delay against CSS animations
      animDuration -= 20
      
      page.toggleAttribute('data-page-enter')
      prevPage.toggleAttribute('data-page-exit')
      await sleep(animDuration)
      page.toggleAttribute('data-page-enter')
      layoutContainer.removeChild(prevPage)
      resolve(null)
    })
  })
}