import { setSectionObserver } from '../utils/client/nav-sections'

export default () => {
  const slideOutEl = document.getElementById('details-slide-out')
  if (location.hash) {
    slideOutEl.className = ''
  }

  const clickListener = (event) => {
    const { target } = event
    if (
      target.tagName === 'A' &&
      target.origin === location.origin &&
      target.hash
    ) {
      event.preventDefault()
      slideOutEl.className = ''
      location.replace(target.href)
    }

    if (target.id === 'close-btn') {
      event.preventDefault()
      slideOutEl.className = 'closed'
      history.pushState('', document.title, location.pathname)
    }
  }

  const sectionIds = ['ongoing-section', 'complete-section']
  setSectionObserver(sectionIds)

  // lazily load videos once tab is visited
  const videoEls = document.querySelectorAll('[data-page="work"] video')
  setTimeout(() => {
    for (const videoEl of videoEls) {
      videoEl.load()
      videoEl.play()
    }
  }, 0)

  document.addEventListener('click', clickListener)

  //cleanup
  return () => {
    slideOutEl.className = 'closed'
    for (const videoEl of videoEls) {
      videoEl.pause()
    }
    document.removeEventListener('click', clickListener)
  }
}
