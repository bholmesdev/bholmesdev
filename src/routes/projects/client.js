export default () => {
  let clickCount = 0

  const clickPrintListener = () => {
    clickCount++
    console.log(`Clicked ${clickCount} times!`)
  }

  document.addEventListener('click', clickPrintListener)

  //cleanup
  return () => {
    document.removeEventListener('click', clickPrintListener)
  }
}
