import index from './me/script'
import projects from './projects/script'
import './global.scss'

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

document.addEventListener('click', (event) => {
  const { target } = event
  if (target.tagName === 'A' && target.origin === baseUrl) {
    event.preventDefault()
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

//global logic
// ;(function navDashedLineAnim() {
//   const dashedLine = document.getElementById('dashed-line')
//   let translationY = 0
//   let speed = 100

//   setInterval(() => {
//     translationY = (translationY - 2) % 50
//     dashedLine.style.transform = `translateY(${translationY}px)`
//   }, 35)

//   let waitingOnAnimRequest = false
//   let prevScrollY = 0
//   let currScrollY = 0

//   window.onscroll = () => {
//     if (!waitingOnAnimRequest) {
//       window.requestAnimationFrame(() => {
//         prevScrollY = currScrollY
//         currScrollY = window.scrollY
//         speed = (prevScrollY - currScrollY) * 3

//         translationY = (translationY + speed) % 50
//         dashedLine.style.transform = `translateY(${translationY}px)`
//         waitingOnAnimRequest = false
//       })
//       waitingOnAnimRequest = true
//     }
//   }
// })()
