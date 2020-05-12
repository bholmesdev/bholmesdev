const filesystem = require('fs')
const showdown = require('showdown')

module.exports = (path) =>
  new Promise((resolve, reject) => {
    filesystem.readFile(path, 'utf8', (error, data) => {
      if (error) {
        reject(error)
        return
      }
      const mdConverter = new showdown.Converter()
      const html = mdConverter.makeHtml(data)
      resolve(html)
    })
  })
