import { getPageDiff } from "./utils"

const sleep = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration))

export async function animatePageIntoView (newPage: Document) {
  const [page, prevPage] = getPageDiff(newPage, document)
  const layoutContainer = prevPage.parentElement
  layoutContainer.style.position = 'relative'
  layoutContainer.insertBefore(page, prevPage)

  await new Promise((resolve) => {
    requestAnimationFrame(async () => {
      const cssAnimDuration = getComputedStyle(
        document.querySelector('[data-page]')
      ).getPropertyValue('--page-anim-duration')
      const animDuration = parseInt(cssAnimDuration) - 20
    
      ;(function slideInNewPage() {
        page.toggleAttribute('data-page-enter')
        prevPage.toggleAttribute('data-page-exit')
      })()
    
      await sleep(animDuration)
      page.toggleAttribute('data-page-enter')

      layoutContainer.removeChild(prevPage)
      resolve(null)
    })
  })
}