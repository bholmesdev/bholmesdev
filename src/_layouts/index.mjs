import { isMobile, getCSSVariable } from '../_includes/css-helpers'
import {
  watchSectionHeaders,
  getPageHeaders,
} from '../_includes/table-of-contents-observer'

const primaryNavEl = document.getElementById('primary-nav__links')

const jumpToSectionColors = ['--green', '--red', '--purple']

const jumpToSection = {
  container: document.querySelector('.jump-to-section__container'),
  number: document.querySelector('#jump-to-section__toggle > span'),
  linkContainer: document.getElementById('jump-to-section__links'),
  labelContainer: document.getElementById('jump-to-section__label'),
  toggle: document.getElementById('jump-to-section__toggle'),
  heading: document.createElement('li'),
}
jumpToSection.heading.innerText = 'Jump to section'
jumpToSection.heading.className = 'heading'

const loadingSpinner = document.getElementById('loading-spinner')

// Once we've scrolled our current section label into view,
// We need to set hide the other labels so they aren't
// picked up by screenreaders
let currentSectionIndex = 0
const onJumpToSectionTransition = () => {
  for (let [
    index,
    label,
  ] of jumpToSection.labelContainer.childNodes.entries()) {
    if (currentSectionIndex !== index) {
      label.style.visibility = 'hidden'
    }
  }
}
const onCloseTableOfContents = () => {
  if (!jumpToSection.linkContainer.classList.contains('toggled')) {
    jumpToSection.linkContainer.style.visibility = 'hidden'
  }
}

const onHideJumpToSectionToggle = ({ target }) => {
  if (
    target === jumpToSection.container &&
    !jumpToSection.container.classList.contains('showing')
  ) {
    jumpToSection.container.style.visibility = 'hidden'
  }
}

const clearNavSections = () => {
  jumpToSection.linkContainer.innerHTML = ''
  jumpToSection.labelContainer.innerText = ''
}

const setNavSections = () => {
  const headers = getPageHeaders()
  clearNavSections()
  if (headers.length <= 1) {
    jumpToSection.container.classList.add('visually-hidden')
  } else {
    jumpToSection.container.classList.remove('visually-hidden')
  }
  jumpToSection.linkContainer.appendChild(jumpToSection.heading)
  headers.forEach((header) => {
    const link = document.createElement('a')
    const listItem = document.createElement('li')
    link.innerText = header.innerText
    link.href = '#' + header.id
    listItem.appendChild(link)
    jumpToSection.linkContainer.appendChild(listItem)

    const labelSpan = document.createElement('span')
    labelSpan.innerText = header.innerText
    jumpToSection.labelContainer.appendChild(labelSpan)
  })
}

const setCurrentSection = (sectionIndex) => {
  currentSectionIndex = Math.max(0, sectionIndex)
  jumpToSection.number.innerText = currentSectionIndex + 1
  for (let [
    index,
    label,
  ] of jumpToSection.labelContainer.childNodes.entries()) {
    label.style.visibility = 'visible'
    if (currentSectionIndex === index) {
      label.style.opacity = 1
      jumpToSection.labelContainer.style.setProperty(
        '--translate',
        label.offsetLeft
      )
    } else {
      label.style.opacity = 0
    }
  }

  // set toggle color
  jumpToSection.toggle.style.backgroundPositionY =
    50 * currentSectionIndex + '%'

  const sectionLinks = jumpToSection.linkContainer.querySelectorAll('a')

  if (sectionLinks?.length) {
    for (const link of sectionLinks) {
      link.style.color = 'var(--body-color)'
    }
    sectionLinks[currentSectionIndex].style.color = `var(${
      jumpToSectionColors[currentSectionIndex % 3]
    })`
  }
}

export default ({ onLoading }) => {
  onLoading(() => {
    loadingSpinner.classList.add('loading')

    return () => {
      loadingSpinner.classList.remove('loading')
    }
  })

  /*--- handle links and navigation ---*/
  const unobserveHeaders = watchSectionHeaders(setCurrentSection)
  setNavSections()
  setCurrentSection(0)
  ;(function setActiveNavLink() {
    const primaryNavLinks = primaryNavEl.querySelectorAll('a')
    primaryNavLinks.forEach((link) => {
      const isHomePageLink = link.pathname === '/'
      if (
        (isHomePageLink && location.pathname === '/') ||
        (!isHomePageLink && location.pathname.startsWith(link.pathname))
      ) {
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
    const cssAnimDuration = parseInt(
      getCSSVariable('--anim-duration', toggleEl)
    )
    setTimeout(() => {
      toggleEl.style.visibility = 'hidden'
    }, cssAnimDuration)
  }

  const onEscapePressed = ({ key }) => {
    if (key === 'Escape') {
      collapseNavEl(primaryNavEl)
      collapseNavEl(jumpToSection.linkContainer)
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
      toggleNavEls(primaryNavEl, jumpToSection.linkContainer)
    }
    if (target.id === 'jump-to-section__toggle') {
      toggleNavEls(jumpToSection.linkContainer, primaryNavEl)
    }
    // on mobile: collapse the "jump to section" slideout when you click a link
    if (
      target.tagName === 'A' &&
      target.origin === location.origin &&
      target.hash &&
      isMobile()
    ) {
      jumpToSection.linkContainer.classList.remove('toggled')
    }
  }
  document.addEventListener('click', linkEventListener)
  document.addEventListener('keyup', onEscapePressed)
  jumpToSection.container.addEventListener(
    'transitionend',
    onHideJumpToSectionToggle
  )
  jumpToSection.labelContainer.addEventListener(
    'transitionend',
    onJumpToSectionTransition
  )
  jumpToSection.linkContainer.addEventListener(
    'transitionend',
    onCloseTableOfContents
  )

  // expand primary navigation when scrolling to top of the page,
  // only above the mobile breakpoint
  const scrollDownListener = () => {
    if (!isMobile()) {
      if (window.scrollY > 0) {
        collapseNavEl(primaryNavEl)
        jumpToSection.container.classList.add('showing')
        jumpToSection.container.style.visibility = 'visible'
      } else {
        expandNavEl(primaryNavEl)
        jumpToSection.container.classList.remove('showing')
      }
    }
  }
  document.addEventListener('scroll', scrollDownListener)
  scrollDownListener()

  return () => {
    unobserveHeaders()
    document.removeEventListener('click', linkEventListener)
    document.removeEventListener('scroll', scrollDownListener)
    document.removeEventListener('keyup', onEscapePressed)
    jumpToSection.container.removeEventListener(
      'transitionend',
      onHideJumpToSectionToggle
    )
    jumpToSection.labelContainer.removeEventListener(
      'transitionend',
      onJumpToSectionTransition
    )
    jumpToSection.linkContainer.removeEventListener(
      'transitionend',
      onCloseTableOfContents
    )

    // if we're leaving the current page and we're on mobile,
    // we should collapse the dropdown nav
    if (isMobile()) {
      primaryNavEl.classList.remove('toggled')
    }
  }
}
