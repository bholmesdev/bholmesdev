const pug = require('pug')

/**
 * @typedef {Object} Page
 * @param {string} routeName - the route URL for the page, used for clientside routing
 * @param {string} html - the HTML string for a particular page
 */

/**
 * @param {string} routeName - the route name for the page being generated.
 *        Used to hide HTML blocks for other routes loaded from allPages
 * @param {Object} meta - any attributes to include in the document <head>
 * @param {Page[]} allPages - list of HTML pages to insert into the doc HTML
 */
module.exports = (routeName, meta, pages) => {
  const routeUrl = routeName === 'index' ? '' : '/ ' + routeName
  return pug.renderFile(__dirname + '/layout.pug', {
    routeName,
    routeUrl,
    meta,
    pages,
  })
}
