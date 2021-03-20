const sleep = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration))

export default async function wipeAnimation(page, prevPage, destroyPrevPage) {
  const cssAnimDuration = getComputedStyle(
    document.querySelector('[data-page]')
  ).getPropertyValue('--nav-anim-duration')
  const animDuration = parseInt(cssAnimDuration) - 20

  ;(function slideInNewPage() {
    page.classList.toggle('slideIn')
    prevPage.classList.toggle('slideOut')
  })()

  await sleep(animDuration)
  page.classList.toggle('slideIn')
  destroyPrevPage()
}
