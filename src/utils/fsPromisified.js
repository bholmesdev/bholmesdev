const { promisify } = require('util')
const fs = require('fs')

module.exports = {
  appendFile: promisify(fs.appendFile),
  writeFile: promisify(fs.writeFile),
  readFile: promisify(fs.readFile),
  readDir: promisify(fs.readdir),
  exists: promisify(fs.exists),
}
