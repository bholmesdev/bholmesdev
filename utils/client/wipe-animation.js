const sleep = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration))

export default async function wipeAnimation(page, prevPage, destroyPrevPage) {
  const cssAnimDuration = getComputedStyle(
    document.querySelector('[data-page]')
  ).getPropertyValue('--nav-anim-duration')
  const animDuration = parseInt(cssAnimDuration) - 20
  const navDashedLine = document.getElementById('dashed-line-container')

  ;(function moveDashedLine() {
    // only trigger animation once the previous animation is done
    if (navDashedLine.classList.contains('move')) return
    navDashedLine.classList.add('move')
  })()
  ;(function slideInNewPage() {
    page.classList.toggle('slideIn')
    prevPage.classList.toggle('slideOut')
  })()

  await sleep(animDuration)
  navDashedLine.classList.remove('move')
  page.classList.toggle('slideIn')
  destroyPrevPage()
}
