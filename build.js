const filesystem = require('fs')
const path = require('path')
const { rollup } = require('rollup')
const babel = require('rollup-plugin-babel')
const livereload = require('livereload')
const { mdFileToHtmlString } = require('./utils/mdHelpers')
const pageLayout = require('./src/pageLayout')
const { appendFile, writeFile, readFile } = require('./utils/fsPromisified')
require('dotenv').config()

const liveReloadPort = 35729

const routesDir = __dirname + '/src/routes'

const addLiveReloadScript = {
  name: 'livereload',
  outro: () => {
    return `document.write('<script src="http://localhost:${liveReloadPort}/livereload.js?snipver=1"></script>');`
  },
}

const consoleLogGreen = (text) => {
  console.log('\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m')
}

const bundleHTML = async (routeNames) => {
  const pages = []
  for (let routeName of routeNames) {
    let html = ''
    const basePath = `${routesDir}/${routeName}`
    if (filesystem.existsSync(basePath + '/renderer.js')) {
      const renderer = require(basePath + '/renderer.js')
      html = await renderer(basePath)
    } else {
      html = await mdFileToHtmlString(basePath + '/page.md')
    }
    pages.push({ routeName, html })
  }
  for (let routeName of routeNames) {
    writeFile(`public/${routeName}.html`, pageLayout(pages, routeName))
  }
}

const bundleCSS = async (routeNames) => {
  const globalCssString = await readFile(__dirname + '/src/global.css')
  writeFile('public/styles.css', globalCssString)
  for (let routeName of routeNames) {
    const cssString = await readFile(
      `${routesDir}/${routeName}/styles.css`,
      'utf8'
    )
    appendFile('public/styles.css', cssString)
  }
}

const bundleJS = async () => {
  let plugins = [babel()]
  if (process.env.MODE === 'dev') {
    plugins = [...plugins, addLiveReloadScript]
  }

  const bundle = await rollup({
    input: 'src/pageScript.js',
    plugins,
  })
  await bundle.write({
    entryFileNames: 'bundle.js',
    dir: 'public',
    format: 'esm',
  })
}

// Build script
;(() => {
  if (!filesystem.existsSync(__dirname + '/public/')) {
    filesystem.mkdirSync('public')
  }
  filesystem.readdir(routesDir, async (err, files) => {
    const routeDirs = files.filter((fileName) =>
      filesystem.statSync(routesDir + '/' + fileName).isDirectory()
    )
    await Promise.all([bundleHTML(routeDirs), bundleCSS(routeDirs), bundleJS()])
    consoleLogGreen('Built successfully!')

    if (process.env.MODE === 'dev') {
      filesystem.watch(
        __dirname + '/src',
        { recursive: true },
        async (event, filePath) => {
          process.stdout.write('\r\x1b[K')
          process.stdout.write('Rebuilding...')

          const fileExtension = path.extname(filePath)
          if (fileExtension === '.css') {
            await bundleCSS(routeDirs)
          } else if (fileExtension === '.js') {
            await bundleJS()
          } else if (fileExtension === '.md') {
            await bundleHTML(routeDirs)
          } else {
            return
          }

          process.stdout.write('\r\x1b[K')
          process.stdout.write(`\r\x1b[KRebuilt changes to ${filePath}`)
        }
      )
    }
  })
  if (process.env.MODE === 'dev') {
    const server = livereload.createServer({ port: liveReloadPort }, () =>
      consoleLogGreen('Live reload enabled')
    )
    server.watch(__dirname + '/public')
  }
})()
