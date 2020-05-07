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
