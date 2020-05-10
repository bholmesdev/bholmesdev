;(function inBriefModeCheckbox() {
  const personalModeEl = document.getElementById('in-brief__personal-content')
  const recruiterModeEl = document.getElementById('in-brief__recruiter-content')
  const modeCheckboxEl = document.getElementById('in-brief-mode-checkbox')

  if (modeCheckboxEl.checked) {
    personalModeEl.style.display = 'none'
    recruiterModeEl.style.display = 'initial'
  }

  document.addEventListener('change', ({ target }) => {
    if (target === modeCheckboxEl) {
      if (target.checked) {
        personalModeEl.style.display = 'none'
        recruiterModeEl.style.display = 'initial'
      } else {
        personalModeEl.style.display = 'initial'
        recruiterModeEl.style.display = 'none'
      }
    }
  })
})()
;(function navigationDashedLineAnim() {
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
;(function coloredStripeLogic() {
  const observerOptions = {
    root: null,
    rootMargin: '-60% 0px -40% 0px',
    threshold: 0,
  }

  const sectionTargets = [
    document.getElementById('inbrief-section'),
    document.getElementById('iteach-section'),
  ]

  const allStripes = document.querySelectorAll('.line-accents > *')

  const observerCallback = (entries) => {
    entries.forEach((change) => {
      const targettedIndex = sectionTargets.findIndex(
        (target) => target === change.target
      )
      const selectedStripe = document.querySelector(
        `.line-accents > :nth-child(${targettedIndex + 1})`
      )
      if (change.isIntersecting) {
        for (let stripe of allStripes) {
          if (stripe === selectedStripe) {
            stripe.classList.add('active')
          } else {
            stripe.classList.remove('active')
          }
        }
      } else if (targettedIndex === 0) {
        selectedStripe.classList.remove('active')
      }
    })
  }

  const observer = new IntersectionObserver(observerCallback, observerOptions)
  sectionTargets.forEach((target) => observer.observe(target))
})()
