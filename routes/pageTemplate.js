module.exports = (pageContent, routeName) => `
<html lang="en-US">
  <head>
    <title>Ben Holmes</title>
    <link rel="stylesheet" href="global.css">
    <link rel="stylesheet" href="${routeName}.css">
    <link rel="stylesheet" href="https://use.typekit.net/liz3dnm.css">
  </head>
  <body>
    ${pageContent}
  </body>
  <script src="${routeName}.js"></script>
</html>
`
