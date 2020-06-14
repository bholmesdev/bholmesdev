export default (event) => {
  const target = event.target

  if (
    target.tagName === 'A' &&
    target.origin === location.origin &&
    target.hash
  ) {
    event.preventDefault()
    const el = document.querySelector(target.hash)
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
