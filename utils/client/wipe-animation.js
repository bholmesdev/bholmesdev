const sleep = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration))

export default async function wipeAnimation(page, prevPage, destroyPrevPage) {
  const animDuration = getComputedStyle(
    document.querySelector('[data-page]')
  ).getPropertyValue('--nav-anim-duration')

  page.classList.toggle('slideIn')
  prevPage.classList.toggle('slideOut')
  await sleep(parseInt(animDuration) - 20)
  page.classList.toggle('slideIn')
  destroyPrevPage()
}
