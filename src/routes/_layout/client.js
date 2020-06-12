import index from '../me/client'
import projects from '../projects/client'
import { clearNavSections } from '../../utils/navSections'

const routeScripts = {
  '/': index,
  '/projects': projects,
}

let prevPathname = location.pathname
let prevRouteCleanup = routeScripts[prevPathname]()

const baseUrl = location.origin
const navDashedLine = document.getElementById('dashed-line-container')
const animDurationMS = 800

const pathToRoute = (path) => (path === '/' ? 'index' : path.slice(1))
const setVisiblePage = (pathname) => {
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
  prevRouteCleanup = routeScripts[pathname]()
}

const moveDashedLine = () => {
  // only trigger animation once the previous animation is done
  if (navDashedLine.classList.contains('move')) return

  navDashedLine.classList.add('move')
  setTimeout(() => {
    navDashedLine.classList.remove('move')
  }, animDurationMS)
}

const primaryNavEl = document.getElementById('primary-nav')
const jumpToSectionEl = document.getElementById('jump-to-sections')

document.addEventListener('click', (event) => {
  const { target } = event
  if (target.id === 'primary-nav-toggle') {
    if (primaryNavEl.classList.contains('toggled')) {
      primaryNavEl.classList.remove('toggled')
    } else {
      primaryNavEl.classList.add('toggled')
      jumpToSectionEl.classList.remove('toggled')
    }
  }
  if (target.id === 'jump-to-section-toggle') {
    if (jumpToSectionEl.classList.contains('toggled')) {
      jumpToSectionEl.classList.remove('toggled')
    } else {
      jumpToSectionEl.classList.add('toggled')
      primaryNavEl.classList.remove('toggled')
    }
  }
  if (target.tagName === 'A' && target.origin === baseUrl) {
    event.preventDefault()

    primaryNavEl.classList.remove('toggled')
    jumpToSectionEl.classList.remove('toggled')

    if (target.hash) {
      const el = document.querySelector(target.hash)
      el && el.scrollIntoView({ behavior: 'smooth' })
    } else {
      history.pushState({}, null, target.href)
      setVisiblePage(target.pathname)
      moveDashedLine()
    }
  }
})

onpopstate = () => {
  setVisiblePage(location.pathname)
}
