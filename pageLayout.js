/**
 * @param {Object[]} pages - list of HTML pages to insert into the doc HTML
 * @param {Object} page - information about a particular HTML page
 * @param {string} page.routeName - the route URL for the page, used for clientside routing
 * @param {string} page.html - the HTML string for a particular page
 * @param {string} currRouteName - the route name for the page being generated. Used to hide other pages in HTML
 */
module.exports = (pages, currRouteName) => `
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <title>Ben Holmes</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    ${pages.reduce((fullHtml, { routeName, html }) => {
      return (
        fullHtml +
        `<main 
          ${currRouteName !== routeName ? 'hidden' : ''}
          data-route="/${routeName === 'index' ? '' : routeName}">
          ${html}
        </main>`
      )
    }, '')}
  </body>
  <script src="bundle.js"></script>
</html>
`
