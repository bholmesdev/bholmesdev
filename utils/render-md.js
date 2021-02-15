const md = require('markdown-it')()
const attrs = require('markdown-it-attrs')
const prism = require('markdown-it-prism')
const container = require('markdown-it-container')

module.exports = (filePath) => {
  md.use(prism).use(attrs).use(container, 'highlight')
  return md.render(filePath)
}
