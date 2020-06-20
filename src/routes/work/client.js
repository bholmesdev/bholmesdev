import { setSectionObserver } from '../../utils/navSections'

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
  setTimeout(() => {
    const videoEls = document.querySelectorAll('[data-route="work"] video')
    for (let videoEl of videoEls) {
      videoEl.load()
      videoEl.play()
    }
  }, 0)

  document.addEventListener('click', clickListener)

  //cleanup
  return () => {
    slideOutEl.className = 'closed'
    document.removeEventListener('click', clickListener)
  }
}
