module.exports = (pageContent, scriptName) => `
<html lang="en-US">
  <head>
    <title>Ben Holmes</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    ${pageContent}
  </body>
  <script src="${scriptName}.js"></script>
</html>
`
