const routes = [
  {
    routeName: 'index',
    routeDirName: 'me',
    meta: {
      title: 'My Story',
    },
  },
  {
    routeName: 'projects',
    meta: {
      title: 'My Projects',
    },
  },
]

const pug = require('pug')
const { exists } = require('../utils/fsPromisified')
const defaultRenderer = (path) => () => pug.renderFile(path + '/index.pug')

module.exports = {
  routeRenderer: async () => {
    return await routes.reduce(
      async (list, { routeName, routeDirName = routeName, meta }) => {
        const jsRendererPath = `${__dirname}/${routeDirName}/index.js`
        const jsRendererExists = await exists(jsRendererPath)
        if (jsRendererExists) {
          var renderer = require(jsRendererPath)
        } else {
          var renderer = defaultRenderer(__dirname + '/' + routeDirName)
        }
        return [...(await list), { routeName, meta, html: await renderer() }]
      },
      []
    )
  },
}
