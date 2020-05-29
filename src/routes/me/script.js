import './styles.scss'

export default () => {
  //colored stripe logic
  const observerOptions = {
    root: null,
    rootMargin: '-60% 0px -40% 0px',
    threshold: 0,
  }

  const sectionTargets = [
    document.getElementById('inbrief-section'),
    document.getElementById('iteach-section'),
    document.getElementById('icreate-section'),
  ]

  const allStripes = document.querySelectorAll('#line-accents > *')

  const observerCallback = (entries) => {
    entries.forEach((change) => {
      const targettedIndex = sectionTargets.findIndex(
        (target) => target === change.target
      )
      const selectedStripe = document.querySelector(
        `#line-accents > :nth-child(${targettedIndex + 1})`
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

  const clickListener = ({ target }) => {
    if (target.id === 'generate-random-project') {
      console.log('cool!')
    }
  }

  document.addEventListener('click', clickListener)

  // cleanup
  return () => {
    document.removeEventListener('click', clickListener)
    observer.disconnect()
  }
}
