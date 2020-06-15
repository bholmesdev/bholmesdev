import projects from '../project-list'
import { setSectionObserver } from '../../utils/navSections'
import scrollIntoView from '../../utils/scrollIntoView'

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

  function VideoEl(elementId) {
    this.el = document.getElementById(elementId)
    this.source = document.querySelector(`#${elementId} > source:first-of-type`)
    this.backupSource = document.querySelector(
      `#${elementId} > source:nth-of-type(2)`
    )
  }

  const manageProjects = () => {
    const firstVid = new VideoEl('projects-1')
    const secondVid = new VideoEl('projects-2')
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

    const setUpVideoEl = (video, index) => {
      video.source.src = projects[index].videoSrc
      video.backupSource.src = projects[index].backupVideoSrc
      video.el.poster = projects[index].img.src
      video.el.load()
    }

    let index = newIndex()
    setUpVideoEl(secondVid, index)

    const setProjectInfo = (nextVid, currVid) => {
      // wait for dice to hit the computer
      setTimeout(() => {
        titleEl.innerText = projects[index].title
        bodyEl.innerHTML = projects[index].body

        index = newIndex()
        nextVid.el.classList.add('visible')
        currVid.el.classList.remove('visible')
        setUpVideoEl(currVid, index)
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

    let showFirst = false
    return () => {
      triggerDiceRoll()
      const nextVid = showFirst ? firstVid : secondVid
      const currVid = showFirst ? secondVid : firstVid
      setProjectInfo(nextVid, currVid)
      showFirst = !showFirst
    }
  }

  const nextProject = manageProjects()

  const clickListener = (event) => {
    if (event.target.id === 'generate-random-project') {
      nextProject()
    }
    scrollIntoView(event)
  }
  document.addEventListener('click', clickListener)

  // cleanup
  return () => {
    document.removeEventListener('click', clickListener)
  }
}
