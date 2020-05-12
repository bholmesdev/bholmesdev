/**
 * @typedef {Object} Page
 * @param {string} routeName - the route URL for the page, used for clientside routing
 * @param {string} html - the HTML string for a particular page
 */

/**
 *
 * @param {Page[]} pages - list of HTML pages to insert into the doc HTML
 * @param {string} currRouteName - the route name for the page being generated. Used to hide other pages in HTML
 */
module.exports = (pages, currRouteName) => `
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <title>Ben Holmes</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://use.typekit.net/liz3dnm.css">
  </head>
  <body>
    <nav>
      <a href="/" class="active">Me</a>
      <a href="/projects">Projects</a>
      <a href="/contact">Contact</a>
      <div id="dashed-line" />
    </nav>
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
