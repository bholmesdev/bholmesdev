export default () => {
  const slideOutEl = document.getElementById('details-slide-out')
  slideOutEl.className = 'closed'

  const clickListener = (event) => {
    const { target } = event
    if (target.tagName === 'A' && target.origin === location.origin) {
      if (target.hash) {
        slideOutEl.className = ''
        event.preventDefault()
        location.replace(target.href)
      } else {
        slideOutEl.className = 'closed'
      }
    }
  }

  document.addEventListener('click', clickListener)

  //cleanup
  return () => {
    document.removeEventListener('click', clickListener)
  }
}
