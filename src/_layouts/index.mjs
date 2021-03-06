export default () => {
  /*--- handle links and navigation ---*/
  const primaryNavEl = document.getElementById('primary-nav')
  const jumpToSectionEl = document.getElementById('jump-to-section__links')
  const jumpToSectionContainer = document.querySelector(
    '.jump-to-section__container'
  )

  ;(function setActiveNavLink() {
    const primaryNavLinks = primaryNavEl.querySelectorAll('a')
    primaryNavLinks.forEach((link) => {
      if (link.pathname === location.pathname) {
        link.classList.add('active')
      } else {
        link.classList.remove('active')
      }
    })
  })()

  const toggleNavEl = (toggleEl, toggleOffEl) => {
    if (toggleEl.classList.contains('toggled')) {
      toggleEl.classList.remove('toggled')
      const cssAnimDuration = getComputedStyle(toggleEl).getPropertyValue(
        '--anim-duration'
      )
      setTimeout(() => {
        toggleEl.style.visibility = 'hidden'
      }, parseInt(cssAnimDuration))
    } else {
      toggleEl.style.visibility = 'visible'
      toggleEl.classList.add('toggled')
      toggleOffEl.classList.remove('toggled')
    }
  }

  const linkEventListener = (event) => {
    const { target } = event
    if (target.id === 'primary-nav-toggle') {
      toggleNavEl(primaryNavEl, jumpToSectionEl)
    }
    if (target.id === 'jump-to-section__toggle') {
      toggleNavEl(jumpToSectionEl, primaryNavEl)
    }
    if (
      target.tagName === 'A' &&
      target.origin === location.origin &&
      target.hash
    ) {
      jumpToSectionEl.classList.remove('toggled')
    }
  }
  document.addEventListener('click', linkEventListener)

  const scrollDownListener = () => {
    if (window.scrollY > 0) {
      primaryNavEl.classList.remove('toggled')
      jumpToSectionContainer.classList.add('showing')
    } else {
      primaryNavEl.classList.add('toggled')
      jumpToSectionContainer.classList.remove('showing')
    }
  }
  document.addEventListener('scroll', scrollDownListener)
  scrollDownListener()

  return () => {
    document.removeEventListener('click', linkEventListener)
    document.removeEventListener('scroll', scrollDownListener)
  }
}
