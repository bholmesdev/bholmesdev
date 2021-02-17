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

const getSectionHeader = (id) => {
  return document.querySelector(`#${id} h2`).innerText
}

const setCurrSection = (sectionIndex, sectionIds) => {
  navCurrSectionNum.innerText = sectionIndex + 1
  navCurrSectionName.innerText = getSectionHeader(sectionIds[sectionIndex])
  setSectionColor(sectionIndex)

  const sectionLinks = navSectionsEl.querySelectorAll('a')
  sectionLinks.forEach((link) => {
    if (link.hash === '#' + sectionIds[sectionIndex]) {
      const sectionColor = getComputedStyle(
        document.getElementById(sectionIds[sectionIndex])
      ).getPropertyValue('--section-color')

      link.style.color = sectionColor
    } else {
      link.style.color = 'var(--body-color)'
    }
  })
}

const setSectionColor = (sectionIndex) => {
  navCurrSectionToggle.style.backgroundPositionY = 50 * sectionIndex + '%'
}

export const setNavSections = (sectionIds) => {
  clearNavSections()
  navCurrSectionToggle.removeAttribute('hidden')
  navSectionsEl.appendChild(headingEl)
  sectionIds.forEach((id) => {
    const link = document.createElement('a')
    const listItem = document.createElement('li')
    link.innerText = getSectionHeader(id)
    link.href = '#' + id
    listItem.appendChild(link)
    navSectionsEl.appendChild(listItem)

    setCurrSection(0, sectionIds)
  })
}

export const clearNavSections = () => {
  navSectionsEl.innerHTML = ''
  navCurrSectionName.innerText = ''
  navCurrSectionToggle.setAttribute('hidden', '')
}

const observerCallback = (callback, sectionIds) => (entries) => {
  entries.forEach((change) => {
    const sectionIndex = sectionIds.findIndex((id) => id === change.target.id)
    if (change.isIntersecting) {
      setCurrSection(sectionIndex, sectionIds)
    }
    callback && callback(change.isIntersecting, sectionIndex)
  })
}

export const setSectionObserver = (sectionIds, callback) => {
  setNavSections(sectionIds)

  observer = new IntersectionObserver(
    observerCallback(callback, sectionIds),
    observerOptions
  )
  sectionIds.forEach((id) => observer.observe(document.getElementById(id)))
}
