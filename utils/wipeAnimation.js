const fixedStyles = `
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  pointer-events: none;
`

const sleep = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration))

export default async function wipeAnimation(page, prevPage, destroyPrevPage) {
  page.style.cssText = fixedStyles
  prevPage.style.cssText = fixedStyles
  const duration = 300
  const easing = 'ease-out'
  prevPage.animate(
    [
      { transform: 'translateX(0)', opacity: 1 },
      { transform: 'translateX(-100px)', opacity: 0 },
    ],
    { duration, easing }
  )
  page.animate(
    [
      { transform: 'translateX(100px)', opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 },
    ],
    { duration, easing }
  )
  await sleep(duration)
  destroyPrevPage()
  page.style.cssText = ''
}
