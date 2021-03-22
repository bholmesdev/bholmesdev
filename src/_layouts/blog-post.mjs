import { getCSSVariable } from '../_includes/css-helpers'

export default () => {
  const initialMaxWidth = getCSSVariable('--content-max-width')
  console.log(initialMaxWidth)
  document.body.style.setProperty('--content-max-width', '920px')

  return () => {
    document.body.style.setProperty('--content-max-width', initialMaxWidth)
  }
}
