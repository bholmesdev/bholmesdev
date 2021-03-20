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

let observer = null
const observerOptions = {
  root: null,
  rootMargin: '-60% 0px -40% 0px',
  threshold: 0,
}

const getSectionHeader = (id) => {
  return document.querySelector(`#${id} h2`).innerText
}

const setCurrSection = (sectionIndex, sectionIds) => {
  currentSectionIndex = sectionIndex
  setSectionColor()
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

  const sectionLinks = jumpToSection.linkContainer.querySelectorAll('a')
  sectionLinks.forEach((link) => {
    if (link.hash === '#' + sectionIds[currentSectionIndex]) {
      const sectionColor = getComputedStyle(
        document.getElementById(sectionIds[currentSectionIndex])
      ).getPropertyValue('--section-color')

      link.style.color = sectionColor
    } else {
      link.style.color = 'var(--body-color)'
    }
  })
}

const setSectionColor = () => {
  jumpToSection.toggle.style.backgroundPositionY =
    50 * currentSectionIndex + '%'
}

export const setNavSections = (sectionIds) => {
  clearNavSections()
  if (sectionIds.length === 0) {
    jumpToSection.container.classList.add('visually-hidden')
  } else {
    jumpToSection.container.classList.remove('visually-hidden')
  }
  jumpToSection.linkContainer.appendChild(jumpToSection.heading)
  sectionIds.forEach((id) => {
    const link = document.createElement('a')
    const listItem = document.createElement('li')
    link.innerText = getSectionHeader(id)
    link.href = '#' + id
    listItem.appendChild(link)
    jumpToSection.linkContainer.appendChild(listItem)

    const labelSpan = document.createElement('span')
    labelSpan.innerText = getSectionHeader(id)
    jumpToSection.labelContainer.appendChild(labelSpan)

    setCurrSection(0, sectionIds)
  })
}

export const clearNavSections = () => {
  jumpToSection.linkContainer.innerHTML = ''
  jumpToSection.labelContainer.innerText = ''
}

const cleanUpObservers = () => {
  observer?.disconnect()

  jumpToSection.labelContainer.removeEventListener(
    'transitionend',
    onJumpToSectionTransition
  )
  jumpToSection.linkContainer.removeEventListener(
    'transitionend',
    onCloseTableOfContents
  )
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

  jumpToSection.labelContainer.addEventListener(
    'transitionend',
    onJumpToSectionTransition
  )
  jumpToSection.linkContainer.addEventListener(
    'transitionend',
    onCloseTableOfContents
  )

  observer = new IntersectionObserver(
    observerCallback(callback, sectionIds),
    observerOptions
  )
  sectionIds.forEach((id) => observer.observe(document.getElementById(id)))

  return cleanUpObservers
}
