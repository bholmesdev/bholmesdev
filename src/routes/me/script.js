import './styles.scss'
import projects from '../../utils/projectList'
import { setSectionObserver } from '../../utils/navSections'

export default () => {
  const sections = [
    document.getElementById('inbrief-section'),
    document.getElementById('iteach-section'),
    document.getElementById('icreate-section'),
  ]

  setSectionObserver(sections, (isIntersecting, sectionIndex) => {
    const allStripes = document.querySelectorAll('#line-accents > *')
    const selectedStripe = document.querySelector(
      `#line-accents > :nth-child(${sectionIndex + 1})`
    )
    if (isIntersecting) {
      for (let stripe of allStripes) {
        if (stripe === selectedStripe) {
          stripe.classList.add('active')
        } else {
          stripe.classList.remove('active')
        }
      }
    } else if (sectionIndex === 0) {
      selectedStripe.classList.remove('active')
    }
  })

  const manageProjects = () => {
    const firstImgEl = document.getElementById('projects-img-1')
    const secondImgEl = document.getElementById('projects-img-2')
    const titleEl = document.getElementById('projects-title')
    const bodyEl = document.getElementById('projects-body')
    const diceEl = document.getElementById('dice-container')

    let unusedIndices = []
    const resetUnusedIndices = () =>
      (unusedIndices = [...Array(projects.length).keys()])
    resetUnusedIndices() // set unused indices to list of indices up to projects.length
    unusedIndices.shift() // remove index 0, since this is the initial index shown

    const newIndex = () => {
      if (unusedIndices.length === 0) resetUnusedIndices()

      const randIndex = Math.floor(Math.random() * unusedIndices.length)
      return unusedIndices.splice(randIndex, 1)
    }

    let index = newIndex()
    secondImgEl.src = projects[index].img.src
    secondImgEl.alt = projects[index].img.alt

    const setProjectInfo = (nextImgEl, currImgEl) => {
      // wait for dice to hit the computer
      setTimeout(() => {
        titleEl.innerText = projects[index].title
        bodyEl.innerHTML = projects[index].body

        index = newIndex()
        nextImgEl.classList.add('visible')
        currImgEl.classList.remove('visible')
        currImgEl.src = projects[index].img.src
        currImgEl.alt = projects[index].img.alt
      }, 400)
    }

    const triggerDiceRoll = () => {
      diceEl.classList.remove('animated')
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          diceEl.classList.add('animated')
        })
      })
    }

    let showFirstImg = false
    return () => {
      triggerDiceRoll()
      const nextImgEl = showFirstImg ? firstImgEl : secondImgEl
      const currImgEl = showFirstImg ? secondImgEl : firstImgEl
      setProjectInfo(nextImgEl, currImgEl)
      showFirstImg = !showFirstImg
    }
  }

  const nextProject = manageProjects()

  const clickListener = ({ target }) => {
    if (target.id === 'generate-random-project') {
      nextProject()
    }
  }
  document.addEventListener('click', clickListener)

  // cleanup
  return () => {
    document.removeEventListener('click', clickListener)
  }
}
