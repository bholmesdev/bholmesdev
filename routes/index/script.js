let clickCount = 0
let speed = 100

document.addEventListener('click', () => {
  clickCount++
  console.log(`Clicked ${clickCount} times!`)
})

const dashedLine = document.getElementById('dashed-line')
let translationY = 0

setInterval(() => {
  translationY = (translationY - 2) % 50
  dashedLine.style.transform = `translateY(${translationY}px)`
}, 35)
;(function animationFrame() {
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

const observerOptions = {
  root: null,
  rootMargin: '-40% 0px -40% 0px',
  threshold: 0,
}

function SectionTarget(element) {
  this.el = element
  this.enteredTop = 0 // the y-pos where the section has entered the viewport
  this.exitedTop = 0 // the y-pos where the section has exited the viewport
}

const sectionTargets = [
  new SectionTarget(document.getElementById('inbrief')),
  new SectionTarget(document.getElementById('iteach')),
]

const intersectionTypes = [
  'enteredSection', // entered a new section
  'leftToPrevSection', // left the current section by scrolling up to a previous section
  'other', // either hasn't entered a section or remains in current section
]
const allStripes = document.querySelectorAll('.line-accents > *')

const observerCallback = (entries, observer) => {
  entries.forEach((change) => {
    let intersectionType = null
    const targettedIndex = sectionTargets.findIndex(
      (target) => target.el === change.target
    )
    const target = sectionTargets[targettedIndex]
    if (!target) return

    if (change.isIntersecting) {
      target.enteredTop = change.boundingClientRect.top
      intersectionType = intersectionTypes[0]
    } else {
      if (target.enteredTop > 0) {
        // don't set exited position until the section has entered into view
        target.exitedTop = change.boundingClientRect.top
      }
      if (target.exitedTop > target.enteredTop) {
        intersectionType = intersectionTypes[1]
      } else {
        intersectionType = intersectionTypes[2]
      }
    }

    if (intersectionType === intersectionTypes[2]) return

    let visibleSectionIndex = 0
    if (intersectionType === intersectionTypes[0]) {
      // show stripe for current section
      visibleSectionIndex = targettedIndex + 1
    }
    if (intersectionType === intersectionTypes[1]) {
      // show stripe for previous section
      visibleSectionIndex = targettedIndex
    }
    for (let stripe of allStripes) {
      const selectedStripe = document.querySelector(
        `.line-accents > :nth-child(${visibleSectionIndex})`
      )

      if (stripe === selectedStripe) {
        stripe.classList.add('active')
      } else {
        stripe.classList.remove('active')
      }
    }
  })
}

const observer = new IntersectionObserver(observerCallback, observerOptions)
sectionTargets.forEach((target) => observer.observe(target.el))
