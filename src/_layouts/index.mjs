export default () => {
  const navDashedLine = document.getElementById('dashed-line-container')
  const animDurationMS = 800

  ;(function moveDashedLine() {
    // only trigger animation once the previous animation is done
    if (navDashedLine.classList.contains('move')) return

    navDashedLine.classList.add('move')
    setTimeout(() => {
      navDashedLine.classList.remove('move')
    }, animDurationMS)
  })()

  /*--- handle links and navigation ---*/
  const primaryNavEl = document.getElementById('primary-nav')
  const jumpToSectionEl = document.getElementById('jump-to-sections')

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
    } else {
      toggleEl.classList.add('toggled')
      toggleOffEl.classList.remove('toggled')
    }
  }

  const linkEventListener = (event) => {
    const { target } = event
    if (target.id === 'primary-nav-toggle') {
      toggleNavEl(primaryNavEl, jumpToSectionEl)
    }
    if (target.id === 'jump-to-section-toggle') {
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

  return () => {
    document.removeEventListener('click', linkEventListener)
    primaryNavEl.classList.remove('toggled')
    jumpToSectionEl.classList.remove('toggled')
  }
}
