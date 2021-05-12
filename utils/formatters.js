const { htmlToText } = require('html-to-text')

const toFormattedDate = (dateString = '') =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

function Image(src, alt) {
  this.src = src || ''
  this.alt = alt || ''
}
const toMinReadIcon = (minRead) => {
  const icon = new Image()
  const getSrc = (size) => `/assets/icons/coffee-cup-${size}.svg`

  if (minRead <= 4) {
    icon.src = getSrc('smol')
    icon.alt = 'Small coffee cup'
  } else if (minRead <= 9) {
    icon.src = getSrc('meed')
    icon.alt = 'Medium coffee cup'
  } else {
    icon.src = getSrc('thicc')
    icon.alt = 'Large coffee cup'
  }
  return icon
}

const avgWPMForAdults = 265
const toMinuteRead = (html = '') => {
  const text = htmlToText(html, {
    ignoreImage: true,
  })
  const minutesToRead = text.split(' ').length / avgWPMForAdults
  return Math.ceil(minutesToRead)
}

module.exports = {
  toFormattedDate,
  toMinReadIcon,
  toMinuteRead,
}
