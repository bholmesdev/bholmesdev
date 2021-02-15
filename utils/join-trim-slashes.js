const { join } = require('path')

module.exports = (...pathsToJoin) =>
  join(...pathsToJoin).replace(/^\/|\/$/g, '')
