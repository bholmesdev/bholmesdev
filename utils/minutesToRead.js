const html2Text = require('html-to-text')
const showdown = require('showdown')

const avgWPMForAdults = 265

module.exports = (mdString) => {
  const mdConverter = new showdown.Converter()
  const html = mdConverter.makeHtml(mdString)

  const text = html2Text.fromString(html, {
    ignoreImage: true,
  })
  const minutes2Read = text.split(' ').length / avgWPMForAdults
  return Math.ceil(minutes2Read)
}
