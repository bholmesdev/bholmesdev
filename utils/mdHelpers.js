const showdown = require('showdown')
const { readFile } = require('./fsPromisified')
const { JSDOM } = require('jsdom')

exports.mdFileToHtmlString = async (path) => {
  const data = await readFile(path, 'utf8')
  const mdConverter = new showdown.Converter()
  return mdConverter.makeHtml(data)
}

exports.mdFileToJSDOM = async (path) => {
  const html = await exports.mdFileToHtmlString(path)
  const dom = new JSDOM(html)
  const { document } = dom.window
  return { dom, document }
}
