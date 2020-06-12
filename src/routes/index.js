const routes = [
  {
    routeName: 'index',
    routeDirName: 'me',
    meta: {
      title: 'My Story',
    },
    renderer: true,
  },
  {
    routeName: 'projects',
    meta: {
      title: 'My Projects',
    },
  },
]

const pug = require('pug')
const defaultRenderer = (path) => () => pug.renderFile(path + '/page.pug')

module.exports = {
  routeRenderer: async () => {
    const routeList = routes.reduce(
      (
        list,
        { routeName, routeDirName = routeName, meta, renderer = false }
      ) => {
        if (renderer) {
          var rendererScript = require(`${__dirname}/${routeDirName}/renderer`)
        } else {
          var rendererScript = defaultRenderer(__dirname + '/' + routeDirName)
        }
        return [...list, { routeName, meta, renderer: rendererScript }]
      },
      []
    )

    return await Promise.all(
      routeList.map(async ({ routeName, meta, renderer }) => {
        return {
          routeName,
          meta,
          html: await renderer(),
        }
      })
    )
  },
}
