import { getCSSVariable } from '../_includes/css-helpers'

export default () => {
  const initialMaxWidth = getCSSVariable('--content-max-width')
  document.body.style.setProperty('--content-max-width', '920px')

  let twitterScript = null
  let codepenScript = null

  if (document.querySelector('blockquote.twitter-tweet') != null) {
    twitterScript = document.createElement('script')
    twitterScript.src = 'https://platform.twitter.com/widgets.js'
    twitterScript.async = true
    document.body.appendChild(twitterScript)
  }

  if (document.querySelector('p.codepen') != null) {
    codepenScript = document.createElement('script')
    codepenScript.src = 'https://cpwebassets.codepen.io/assets/embed/ei.js'
    codepenScript.async = true
    document.body.appendChild(codepenScript)
  }

  return () => {
    document.body.style.setProperty('--content-max-width', initialMaxWidth)
    if (twitterScript) {
      document.body.removeChild(twitterScript)
    }
    if (codepenScript) {
      document.body.removeChild(codepenScript)
    }
  }
}
