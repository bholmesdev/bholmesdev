const baseUrl = location.origin

const pushState = (url) => history.pushState({}, null, url)
const allPageEls = document.querySelectorAll('main[data-route]')

const setVisiblePage = (pathname) => {
  const pageEl = document.querySelector(`main[data-route="${pathname}"]`)
  if (pageEl) {
    for (let el of allPageEls) {
      console.log(el)
      el.setAttribute('hidden', '')
    }
    pageEl.removeAttribute('hidden')
  }
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

onpopstate = () => {
  setVisiblePage(location.pathname)
}
