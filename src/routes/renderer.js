const pug = require('pug')
const routes = require('./routes')

const defaultRenderer = (path) => () => pug.renderFile(path + '/page.pug')

module.exports = async () => {
  const routeList = routes.reduce(
    (
      list,
      { routeName, routeDirName = routeName, meta, customRenderer = false }
    ) => {
      if (customRenderer) {
        var renderer = require(`${__dirname}/${routeDirName}/renderer`)
      } else {
        var renderer = defaultRenderer(__dirname + '/' + routeDirName)
      }
      return [...list, { routeName, meta, renderer }]
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
}
