const { htmlToText } = require('html-to-text')

const avgWPMForAdults = 265

module.exports = (html) => {
  const text = htmlToText(html, {
    ignoreImage: true,
  })
  const minutesToRead = text.split(' ').length / avgWPMForAdults
  return Math.ceil(minutesToRead)
}
