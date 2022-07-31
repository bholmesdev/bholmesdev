import { animatePageIntoView } from './pageTransition'
import { isScriptWithSrc, isStylesheet } from './utils'

if (import.meta.env.DEV) {
  console.log('CSR loaded!')
}
let prevPathname = location.pathname

async function yoinkHTML (href: string) {
  const response = await fetch(href)
  const htmlString = await response.text()
  const page = new DOMParser().parseFromString(htmlString, 'text/html')

  return page
}

/**
 * Resolve head elements that should be swapped on CSR
 * @returns Callback to remove old head elements
 * (delayed to handle animated page transitions)
 */
function resolveHead (newPage: Document) {
  const selectors = `
    head > title,
    head > link[rel="stylesheet"],
    head > style,
    head > script
  `
  const oldElements = [...document.querySelectorAll(selectors)]
  const newElements = [...newPage.querySelectorAll(selectors)]

  const linksToRemoveByHref = new Set(
    oldElements.filter(isStylesheet).map(e => e.href)
  )
  const scriptsToRemoveBySrc = new Set(
    oldElements.filter(isScriptWithSrc).map(e => e.src)
  )

  for (const newElement of newElements) {
    // Avoid injecting link hrefs or script srcs already on page
    // Can cause duplicate work depending on the browser
    if (isStylesheet(newElement) && linksToRemoveByHref.has(newElement.href)) {
      linksToRemoveByHref.delete(newElement.href)
    } else if (isScriptWithSrc(newElement) && scriptsToRemoveBySrc.has(newElement.src)) {
      scriptsToRemoveBySrc.delete(newElement.src)
    } else {
      document.head.appendChild(newElement)
    }
  }

  return () => {
    for (const el of oldElements) {
      if (
        isStylesheet(el) && !linksToRemoveByHref.has(el.href) ||
        isScriptWithSrc(el) && !scriptsToRemoveBySrc.has(el.src)
      ) continue
      document.head.removeChild(el)
    }
  }
}

async function setVisiblePage ({ pathname, href }: Pick<Location, 'pathname' | 'href'>) {
  document.body.toggleAttribute('data-page-loading')
  const page = await yoinkHTML(href)
  document.body.toggleAttribute('data-page-loading')
  const removeOldHeadElements = resolveHead(page)
  await animatePageIntoView(page)
  removeOldHeadElements()
  prevPathname = pathname
}

document.addEventListener('click', async function handleClientSideRouting (event) {
  const { target } = event
  if (target instanceof HTMLAnchorElement && target.origin === location.origin) {
    event.preventDefault()
    if (target.pathname !== prevPathname) {
      history.pushState({}, null, target.href)
      await setVisiblePage(target)
    }
  }
})

window.onpopstate = () => {
  if (location.pathname !== prevPathname) {
    setVisiblePage(location)
  }
}
