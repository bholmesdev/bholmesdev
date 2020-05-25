const html2Text = require('html-to-text')
const { md } = require('./mdHelpers')

const avgWPMForAdults = 265

module.exports = (mdString) => {
  const html = md.render(mdString)

  const text = html2Text.fromString(html, {
    ignoreImage: true,
  })
  const minutes2Read = text.split(' ').length / avgWPMForAdults
  return Math.ceil(minutes2Read)
}
