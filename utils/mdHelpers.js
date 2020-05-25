const { readFile } = require('./fsPromisified')
const { JSDOM } = require('jsdom')
const md = require('markdown-it')({
  html: true,
})
const pug = require('pug')

exports.md = md

exports.pugToHtmlString = async (path) => {
  return pug.renderFile(path)
}

exports.mdFileToHtmlString = async (path) => {
  const data = await readFile(path, 'utf8')
  return md.render(data)
}

exports.mdFileToJSDOM = async (path) => {
  const html = await exports.mdFileToHtmlString(path)
  const dom = new JSDOM(html)
  const { document } = dom.window
  return { dom, document }
}
