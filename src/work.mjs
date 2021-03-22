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
  const detailsSlideOut = document.getElementById('details-slide-out')

  const showSlideOut = () => {
    detailsSlideOut.style.visibility = 'visible'
  }

  const hideSlideOutOnEmptyHash = () => {
    if (location.hash === '') {
      detailsSlideOut.style.visibility = 'hidden'
    }
  }

  const clickListener = (event) => {
    const { target } = event
    if (
      target.tagName === 'A' &&
      target.origin === location.origin &&
      target.hash &&
      target.hasAttribute('data-proj-link')
    ) {
      showSlideOut()
      location.replace(target.href)
    }

    if (target.id === 'close-btn') {
      event.preventDefault()
      location.replace(target.href)
    }
  }

  // lazily load videos once tab is visited
  const videoEls = document.querySelectorAll('[data-page="work"] video')
  const videoObserver = setVideoObserver(videoEls)

  document.addEventListener('click', clickListener)

  if (window.location.hash) {
    showSlideOut()
  }

  detailsSlideOut.addEventListener('transitionend', hideSlideOutOnEmptyHash)

  //cleanup
  return () => {
    videoObserver.disconnect()
    document.removeEventListener('click', clickListener)
    detailsSlideOut.removeEventListener(
      'transitionend',
      hideSlideOutOnEmptyHash
    )
  }
}
