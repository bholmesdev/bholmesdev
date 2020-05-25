import index from './me/script'
import projects from './projects/script'
import './global.css'

const routeScripts = {
  '/': index,
  '/projects': projects,
}

let prevRouteCleanup = () => {}

const baseUrl = location.origin
const allPageEls = document.querySelectorAll('main[data-route]')

const setVisiblePage = (pathname) => {
  const pageEl = document.querySelector(`main[data-route="${pathname}"]`)
  if (pageEl) {
    for (let el of allPageEls) {
      el.setAttribute('hidden', '')
    }
    pageEl.removeAttribute('hidden')
  }
  prevRouteCleanup()
  prevRouteCleanup = routeScripts[pathname]()
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
    }
  }
})

onload = () => {
  prevRouteCleanup = routeScripts[location.pathname]()
}

onpopstate = () => {
  setVisiblePage(location.pathname)
}

//global logic
;(function navDashedLineAnim() {
  const dashedLine = document.getElementById('dashed-line')
  let translationY = 0
  let speed = 100

  setInterval(() => {
    translationY = (translationY - 2) % 50
    dashedLine.style.transform = `translateY(${translationY}px)`
  }, 35)

  let waitingOnAnimRequest = false
  let prevScrollY = 0
  let currScrollY = 0

  window.onscroll = () => {
    if (!waitingOnAnimRequest) {
      window.requestAnimationFrame(() => {
        prevScrollY = currScrollY
        currScrollY = window.scrollY
        speed = (prevScrollY - currScrollY) * 3

        translationY = (translationY + speed) % 50
        dashedLine.style.transform = `translateY(${translationY}px)`
        waitingOnAnimRequest = false
      })
      waitingOnAnimRequest = true
    }
  }
})()
