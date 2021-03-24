const md = require('markdown-it')()
const attrs = require('markdown-it-attrs')
const prism = require('markdown-it-prism')
const headingAnchors = require('markdown-it-anchor')
const container = require('markdown-it-container')

module.exports = (filePath) => {
  md.use(prism)
    .use(attrs)
    .use(container, 'highlight')
    .use(headingAnchors, {
      slugify: (s) =>
        'link-' +
        s
          .toLowerCase()
          .replace(/\s+/g, '-') // Replace spaces with -
          .replace(/[^\w\-]+/g, '') // Remove all non-word chars
          .replace(/\-\-+/g, '-') // Replace multiple - with single -
          .replace(/^-+/, '') // Trim - from start of text
          .replace(/-+$/, ''),
    })
  return md.render(filePath)
}
