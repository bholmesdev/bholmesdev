const { promisify } = require('util')
const fs = require('fs')

module.exports = {
  appendFile: promisify(fs.appendFile),
  writeFile: promisify(fs.writeFile),
  readFile: promisify(fs.readFile),
  exists: promisify(fs.exists),
}
