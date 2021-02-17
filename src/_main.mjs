import trimSlashes from '../utils/client/trim-slashes'
import zip from '../utils/client/zip'
import wipeAnimation from '../utils/client/wipe-animation'
import intersection from '../utils/client/set-intersection'

const noop = () => {}
let prevPathname = location.pathname
let cleanupFns = []

const dataPageAttrs = (page) =>
  [...page.querySelectorAll('[data-page]')].map((el) => ({
    el,
    value: el.getAttribute('data-page'),
  }))

const getPageDiff = (page, prevPage) => {
  const [allPageEls, allPrevPageEls] = [page, prevPage].map(dataPageAttrs)

  const pageElPairs = zip(allPageEls, allPrevPageEls)
  for (let [left, right] of pageElPairs) {
    if (left.value !== right.value) {
      return [left.el, right.el]
    }
  }
  return [null, null]
}

const loadNewStyles = (styles) =>
  Promise.all([
    styles.map(
      (style) =>
        new Promise((resolve, reject) => {
          const newStyle = document.head.appendChild(style)
          newStyle.onload = resolve
          newStyle.onerror = reject
        })
    ),
  ])

const animatePageIntoView = async (fullPage) => {
  const stylesheetSelector = 'head > link[rel="stylesheet"]'
  const oldStyles = [...document.querySelectorAll(stylesheetSelector)]
  const newStyles = [...fullPage.querySelectorAll(stylesheetSelector)]

  const overlappingStyles = intersection(
    oldStyles.map(({ href }) => href),
    newStyles.map(({ href }) => href)
  )

  await loadNewStyles(
    // only load styles that *aren't already on the page*
    newStyles.filter((style) => !overlappingStyles.has(style.href))
  )

  const [page, prevPage] = getPageDiff(fullPage, document)
  const layoutContainer = prevPage.parentElement
  layoutContainer.style.position = 'relative'
  layoutContainer.insertBefore(page, prevPage)

  requestAnimationFrame(async () => {
    await wipeAnimation(page, prevPage, () =>
      layoutContainer.removeChild(prevPage)
    )
    oldStyles.forEach((style) => {
      if (!overlappingStyles.has(style.href)) {
        document.head.removeChild(style)
      }
    })
  })
}

const yoinkHTML = async (href) => {
  const response = await fetch(href)
  const htmlString = await response.text()
  const page = new DOMParser().parseFromString(htmlString, 'text/html')
  const title = page.querySelector('title').innerText

  return { page, title }
}

const yoinkLayoutJS = async (pageHTML = document) => {
  const layoutNames = dataPageAttrs(pageHTML)
    .map((attr) => attr.value)
    .filter((dataPage) => dataPage.startsWith('_layouts'))
  layoutNames.push('_layouts')
  return await Promise.all(layoutNames.map((layoutName) => yoinkJS(layoutName)))
}

const yoinkJS = async (pathname) => {
  try {
    const pathnameWithTrailingSlash = pathname ? pathname + '/' : pathname
    const [jsModule, pageDataModule] = await Promise.all([
      import(`./${pathnameWithTrailingSlash}__client.mjs`),
      import(`./${pathnameWithTrailingSlash}__data.mjs`),
    ])

    if (jsModule?.default) {
      return () => jsModule.default(pageDataModule?.default ?? {})
    } else {
      return () => noop
    }
  } catch (e) {
    return () => noop
  }
}

const setPageTitle = (title = '') => {
  const titleEl = document.querySelector('title')
  if (titleEl) {
    titleEl.innerText = title
  } else {
    const titleEl = document.createElement('title')
    titleEl.innerText = title
    document.documentElement.appendChild(titleEl)
  }
}

const popCleanup = () => {
  while (cleanupFns.length) cleanupFns.pop()()
}

const pushCleanup = (...pageJSFns) => {
  for (fn of pageJSFns) cleanupFns.push(fn())
}

const sequenceProcessHTMLLayoutJS = async (href = '') => {
  const { page, title } = await yoinkHTML(href)
  const layoutJSList = await yoinkLayoutJS(page)
  return { page, title, layoutJSList }
}

const setVisiblePage = async ({ pathname = '', href = '' }) => {
  popCleanup()
  const [{ page, title, layoutJSList }, mainJS] = await Promise.all([
    sequenceProcessHTMLLayoutJS(href),
    yoinkJS(trimSlashes(pathname)),
  ])
  setPageTitle(title)
  await (page && animatePageIntoView(page))
  // TODO: on quick navigation, it's possible to run the next page function
  // before the previous cleanup finishes
  // will probably need a queuing system to solve this
  pushCleanup(mainJS, ...layoutJSList)
  prevPathname = pathname
}

document.addEventListener('click', async (event) => {
  const { target } = event
  if (target.tagName === 'A' && target.origin === location.origin) {
    event.preventDefault()
    if (target.pathname !== prevPathname && target.hash === '') {
      history.pushState({}, null, target.href)
      await setVisiblePage(target)
    }
  }
})

onpopstate = () => {
  if (location.hash === '') {
    setVisiblePage(location)
  }
}

// on startup
;(async () => {
  const [mainJS, layoutJSList] = await Promise.all([
    yoinkJS(trimSlashes(location.pathname)),
    yoinkLayoutJS(),
  ])
  pushCleanup(mainJS, ...layoutJSList)
})()
