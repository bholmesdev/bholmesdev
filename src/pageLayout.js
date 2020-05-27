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
module.exports = (routeName, meta, allPages) => `
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <title>${meta.title}</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://use.typekit.net/liz3dnm.css">
  </head>
  <body>
    <nav>
      <a href="/" class="active">Me</a>
      <a href="/projects">Projects</a>
      <a href="/contact">Contact</a>
      <div id="dashed-line-container">
        <div></div>
      </div>
    </nav>
    ${allPages.reduce((fullHtml, page) => {
      return (
        fullHtml +
        `<main 
          ${routeName === page.routeName ? '' : 'hidden'}
          data-route="${page.routeName}">
          ${page.html}
        </main>`
      )
    }, '')}
  </body>
  <script src="bundle.js"></script>
</html>
`
