import { setSectionObserver } from '../utils/client/nav-sections'

const setVideoObserver = (videos) => {
  const observer = new IntersectionObserver(
    (changes) => {
      for (const { target, isIntersecting } of changes) {
        if (isIntersecting) {
          target.load()
          target.play()
        }
      }
    },
    {
      root: null,
      rootMargin: '0px 0px 0px 0px',
      threshold: 0,
    }
  )
  for (const video of videos) {
    observer.observe(video)
  }
  return observer
}

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
  const cleanupSectionObserver = setSectionObserver(sectionIds)

  // lazily load videos once tab is visited
  const videoEls = document.querySelectorAll('[data-page="work"] video')
  const videoObserver = setVideoObserver(videoEls)

  document.addEventListener('click', clickListener)

  //cleanup
  return () => {
    cleanupSectionObserver()
    slideOutEl.className = 'closed'
    videoObserver.disconnect()
    document.removeEventListener('click', clickListener)
  }
}
