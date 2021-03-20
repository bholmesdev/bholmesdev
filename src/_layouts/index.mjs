import { isMobile, getCSSVariable } from '../_includes/css-helpers'

const primaryNavEl = document.getElementById('primary-nav__links')
const jumpToSectionEl = document.getElementById('jump-to-section__links')
const jumpToSectionContainer = document.querySelector(
  '.jump-to-section__container'
)

const onHideJumpToSectionToggle = ({ target }) => {
  if (
    target === jumpToSectionContainer &&
    !jumpToSectionContainer.classList.contains('showing')
  ) {
    jumpToSectionContainer.style.visibility = 'hidden'
  }
}

export default () => {
  /*--- handle links and navigation ---*/

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

  const expandNavEl = (toggleEl) => {
    if (toggleEl.classList.contains('toggled')) return

    toggleEl.style.visibility = 'visible'
    toggleEl.classList.add('toggled')
  }

  const collapseNavEl = (toggleEl) => {
    if (!toggleEl.classList.contains('toggled')) return

    toggleEl.classList.remove('toggled')
    const cssAnimDuration = getCSSVariable('--anim-duration', toggleEl)
    setTimeout(() => {
      toggleEl.style.visibility = 'hidden'
    }, cssAnimDuration)
  }

  const onEscapePressed = ({ key }) => {
    if (key === 'Escape') {
      collapseNavEl(primaryNavEl)
      collapseNavEl(jumpToSectionEl)
    }
  }

  /**
   * Handle clicks on either the primary nav toggle or "jump to section" nav toggle
   *
   * @param toggleEl Element directly clicked on (primary toggle or "jump to section" toggle)
   * @param toggleOffEl Opposite nav element that was *not* clicked on. Used for hiding the opposing element (ex. table of contents) to avoid overlaying on the toggled nav element (ex. the primary nav)
   */
  const toggleNavEls = (toggleEl, toggleOffEl) => {
    if (toggleEl.classList.contains('toggled')) {
      collapseNavEl(toggleEl)
    } else {
      expandNavEl(toggleEl)
      toggleOffEl.classList.remove('toggled')
    }
  }

  const linkEventListener = (event) => {
    const { target } = event
    if (target.id === 'primary-nav__toggle') {
      toggleNavEls(primaryNavEl, jumpToSectionEl)
    }
    if (target.id === 'jump-to-section__toggle') {
      toggleNavEls(jumpToSectionEl, primaryNavEl)
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
  document.addEventListener('keyup', onEscapePressed)
  jumpToSectionContainer.addEventListener(
    'transitionend',
    onHideJumpToSectionToggle
  )

  // expand primary navigation when scrolling to top of the page,
  // only above the mobile breakpoint
  const scrollDownListener = () => {
    if (!isMobile()) {
      if (window.scrollY > 0) {
        collapseNavEl(primaryNavEl)
        jumpToSectionContainer.classList.add('showing')
        jumpToSectionContainer.style.visibility = 'visible'
      } else {
        expandNavEl(primaryNavEl)
        jumpToSectionContainer.classList.remove('showing')
      }
    }
  }
  document.addEventListener('scroll', scrollDownListener)
  scrollDownListener()

  return () => {
    document.removeEventListener('click', linkEventListener)
    document.removeEventListener('scroll', scrollDownListener)
    document.removeEventListener('keyup', onEscapePressed)
    jumpToSectionContainer.removeEventListener(
      'transitionend',
      onHideJumpToSectionToggle
    )

    // if we're leaving the current page and we're on mobile,
    // we should collapse the dropdown nav
    if (isMobile()) {
      primaryNavEl.classList.remove('toggled')
    }
  }
}
