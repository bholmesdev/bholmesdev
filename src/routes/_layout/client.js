import index from '../me/client'
import work from '../work/client'
import { clearNavSections } from '../../utils/navSections'

const routeScripts = {
  '/': index,
  '/work': work,
}
const emptyScript = () => () => {}

let prevPathname = location.pathname
let prevRouteCleanup = (routeScripts[prevPathname] || emptyScript)()

/*--- handle page transitions ---*/
const animDurationMS = 800

const pathToRoute = (path) => (path === '/' ? 'index' : path.slice(1))
const setVisiblePage = (pathname) => {
  if (pathname === prevPathname) return

  const currPageEl = document.querySelector(
    `main[data-route="${pathToRoute(pathname)}"]`
  )
  const prevPageEl = document.querySelector(
    `main[data-route="${pathToRoute(prevPathname)}"]`
  )
  if (currPageEl) {
    currPageEl.removeAttribute('hidden')
    currPageEl.classList.add('slideIn')
    prevPageEl.classList.add('slideOut')
    prevPathname = pathname

    setTimeout(() => {
      prevPageEl.setAttribute('hidden', '')
      prevPageEl.classList.remove('slideOut')
      currPageEl.classList.remove('slideIn')
    }, animDurationMS)
  }
  // TODO: 404 page for invalid links
  clearNavSections()
  prevRouteCleanup()
  prevRouteCleanup = (routeScripts[pathname] || emptyScript)()
}

const navDashedLine = document.getElementById('dashed-line-container')
const moveDashedLine = () => {
  // only trigger animation once the previous animation is done
  if (navDashedLine.classList.contains('move')) return

  navDashedLine.classList.add('move')
  setTimeout(() => {
    navDashedLine.classList.remove('move')
  }, animDurationMS)
}

/*--- handle links and navigation ---*/
const primaryNavEl = document.getElementById('primary-nav')
const jumpToSectionEl = document.getElementById('jump-to-sections')

const setActiveNavLink = (pathname) => {
  const primaryNavLinks = primaryNavEl.querySelectorAll('a')
  primaryNavLinks.forEach((link) => {
    if (link.pathname === pathname) {
      link.classList.add('active')
    } else {
      link.classList.remove('active')
    }
  })
}

const toggleNavEl = (toggleEl, toggleOffEl) => {
  if (toggleEl.classList.contains('toggled')) {
    toggleEl.classList.remove('toggled')
  } else {
    toggleEl.classList.add('toggled')
    toggleOffEl.classList.remove('toggled')
  }
}

document.addEventListener('click', (event) => {
  const { target } = event
  if (target.id === 'primary-nav-toggle') {
    toggleNavEl(primaryNavEl, jumpToSectionEl)
  }
  if (target.id === 'jump-to-section-toggle') {
    toggleNavEl(jumpToSectionEl, primaryNavEl)
  }
  if (target.tagName === 'A' && target.origin === location.origin) {
    event.preventDefault()

    primaryNavEl.classList.remove('toggled')
    jumpToSectionEl.classList.remove('toggled')

    if (target.pathname !== prevPathname)
      history.pushState({}, null, target.href)
    setVisiblePage(target.pathname)
    setActiveNavLink(target.pathname)
    moveDashedLine()
  }
})

onpopstate = () => {
  setVisiblePage(location.pathname)
}
