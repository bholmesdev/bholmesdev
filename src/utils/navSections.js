const headingEl = document.createElement('li')
headingEl.innerText = 'Sections on this page:'
headingEl.className = 'heading'
const navSectionsEl = document.getElementById('jump-to-sections')
const navCurrSectionName = document.getElementById('current-section')
const navCurrSectionNum = document.querySelector(
  '#jump-to-section-toggle > span'
)
const navCurrSectionToggle = document.getElementById('jump-to-section-toggle')

const observerOptions = {
  root: null,
  rootMargin: '-60% 0px -40% 0px',
  threshold: 0,
}

let observer = null

const getSectionHeader = (element) => {
  return document.querySelector(`#${element.id} h2`).innerText
}

const setCurrSection = (sectionIndex, sectionElements) => {
  navCurrSectionNum.innerText = sectionIndex + 1
  navCurrSectionName.innerText = getSectionHeader(sectionElements[sectionIndex])
  setSectionColor(sectionIndex)
}

const setSectionColor = (sectionIndex) => {
  navCurrSectionToggle.style.backgroundPositionY = 50 * sectionIndex + '%'
}

export const setNavSections = (sectionElements) => {
  navCurrSectionToggle.removeAttribute('hidden')
  navSectionsEl.appendChild(headingEl)
  sectionElements.forEach((section) => {
    const link = document.createElement('a')
    const listItem = document.createElement('li')
    link.innerText = getSectionHeader(section)
    link.href = '#' + section.id
    listItem.appendChild(link)
    navSectionsEl.appendChild(listItem)

    setCurrSection(0, sectionElements)
  })
}

export const clearNavSections = () => {
  navSectionsEl.innerHTML = ''
  navCurrSectionName.innerText = ''
  navCurrSectionToggle.setAttribute('hidden', '')
}

const observerCallback = (callback, sectionElements) => (entries) => {
  entries.forEach((change) => {
    const sectionIndex = sectionElements.findIndex(
      (target) => target === change.target
    )
    if (change.isIntersecting) {
      setCurrSection(sectionIndex, sectionElements)
    }
    callback && callback(change.isIntersecting, sectionIndex)
  })
}

export const setSectionObserver = (sectionElements, callback) => {
  setNavSections(sectionElements)

  observer = new IntersectionObserver(
    observerCallback(callback, sectionElements),
    observerOptions
  )
  sectionElements.forEach((target) => observer.observe(target))
}
