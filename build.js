const filesystem = require('fs')
const path = require('path')
const { promisify } = require('util')
const { rollup } = require('rollup')
const multi = require('@rollup/plugin-multi-entry')
const babel = require('rollup-plugin-babel')
const livereload = require('livereload')
const readMdFile = require('./utils/readMdFile')
const pageLayout = require('./pageLayout')

const liveReloadPort = 35729

const writeFile = promisify(filesystem.writeFile)
const readFile = promisify(filesystem.readFile)

const addLiveReloadScript = {
  name: 'livereload',
  outro: () => {
    return `document.write('<script src="http://localhost:${liveReloadPort}/livereload.js?snipver=1"></script>');`
  },
}

const consoleLogGreen = (text) => {
  console.log('\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m')
}

const bundleHTML = (routeNames) =>
  new Promise(async (resolve, reject) => {
    try {
      const pages = []
      for (let routeName of routeNames) {
        const html = await readMdFile(`routes/${routeName}/page.md`)
        pages.push({ routeName, html })
      }
      for (let routeName of routeNames) {
        writeFile(`public/${routeName}.html`, pageLayout(pages, routeName))
      }
      resolve()
    } catch (e) {
      reject(e)
    }
  })

const bundleCSS = (routeNames) =>
  new Promise(async (resolve, reject) => {
    try {
      let cssString = await readFile('./global.css')
      for (let routeName of routeNames) {
        cssString += await readFile(`./routes/${routeName}/styles.css`, 'utf8')
      }
      writeFile('public/styles.css', cssString)
      resolve()
    } catch (e) {
      reject(e)
    }
  })

const bundleJS = (routeNames) =>
  new Promise(async (resolve, reject) => {
    try {
      let plugins = [babel(), multi()]
      if (process.env.MODE === 'dev') {
        plugins = [...plugins, addLiveReloadScript]
      }

      const input = [
        ...routeNames.map((routeName) => `routes/${routeName}/script.js`),
        'routes/routingScript.js',
      ]

      const bundle = await rollup({ input, plugins })
      await bundle.write({
        entryFileNames: 'bundle.js',
        dir: 'public',
        format: 'iife',
      })
      resolve()
    } catch (e) {
      reject(e)
    }
  })

// Build script
;(() => {
  if (!filesystem.existsSync(__dirname + '/public/')) {
    filesystem.mkdirSync('public')
  }
  filesystem.readdir(__dirname + '/routes/', async (err, files) => {
    files = files.filter((fileName) =>
      filesystem.statSync(__dirname + '/routes/' + fileName).isDirectory()
    )
    await Promise.all([bundleHTML(files), bundleCSS(files), bundleJS(files)])

    filesystem.watch(
      __dirname + '/routes',
      { recursive: true },
      async (event, filePath) => {
        process.stdout.write('\r\x1b[K')
        process.stdout.write('Rebuilding...')

        const fileName = path.basename(filePath)
        const fileExtension = path.extname(fileName)
        if (fileExtension === '.css') {
          await bundleCSS(files)
        } else if (fileExtension === '.js') {
          await bundleJS(files)
        } else if (fileName === 'page.md') {
          await bundleHTML(files)
        } else {
          return
        }

        process.stdout.write('\r\x1b[K')
        process.stdout.write(`\r\x1b[KRebuilt changes to ${fileName}`)
      }
    )
    consoleLogGreen('Built successfully!')
  })
  if (process.env.MODE === 'dev') {
    const server = livereload.createServer({ port: liveReloadPort }, () =>
      consoleLogGreen('Live reload enabled')
    )
    server.watch(__dirname + '/public')
  }
})()
