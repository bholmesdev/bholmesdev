const filesystem = require('fs')
const { promisify } = require('util')
const { rollup } = require('rollup')
const livereload = require('livereload')
const babel = require('rollup-plugin-babel')
const readMdFile = require('./readMdFile')
const pageTemplate = require('./routes/pageTemplate')

const liveReloadPort = 35729

const writeFile = promisify(filesystem.writeFile)
const copyFile = promisify(filesystem.copyFile)

const addLiveReloadScript = {
  name: 'livereload',
  outro: () => {
    return `document.write('<script src="http://localhost:${liveReloadPort}/livereload.js?snipver=1"></script>');`
  },
}

const consoleLogGreen = (text) => {
  console.log('\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m')
}

const renderPage = (routeName, useCustomRenderer) =>
  new Promise(async (resolve, reject) => {
    let htmlString = ''
    const routePath = `./routes/${routeName}/`
    if (useCustomRenderer) {
      const render = require(routePath + 'renderer.js')
      htmlString = render()
    } else {
      const markdown = await readMdFile(routePath + 'page.md')
      htmlString = pageTemplate(markdown, routeName)
    }
    try {
      await Promise.all([
        writeFile(`public/${routeName}.html`, htmlString),
        copyFile(routePath + 'styles.css', `public/${routeName}.css`),
      ])
      resolve()
    } catch (err) {
      reject(err)
    }
  })

const bundlePage = (routeName) =>
  new Promise(async (resolve) => {
    let plugins = [babel()]
    if (process.env.MODE === 'dev') {
      plugins = [...plugins, addLiveReloadScript]
    }

    const bundle = await rollup({
      input: {
        [routeName]: `routes/${routeName}/script.js`,
      },
      plugins,
    })
    await bundle.write({
      entryFileNames: '[name].js',
      dir: 'public',
      format: 'iife',
    })
    resolve()
  })

// Build script
;(() => {
  if (!filesystem.existsSync('public/')) {
    filesystem.mkdirSync('public')
  }
  filesystem.readdir('routes/', async (err, files) => {
    let asyncTasks = []
    for (let routeName of files) {
      const routePath = `./routes/${routeName}`
      if (filesystem.statSync(routePath).isDirectory()) {
        const routeFiles = filesystem.readdirSync(routePath)
        const hasCustomRenderer = routeFiles.includes('renderer.js')
        asyncTasks = [
          ...asyncTasks,
          bundlePage(routeName),
          renderPage(routeName, hasCustomRenderer),
        ]

        if (process.env.MODE === 'dev') {
          filesystem.watch(
            routePath,
            { recursive: true },
            async (event, fileName) => {
              process.stdout.write('\r\x1b[K')
              process.stdout.write('Rebuilding...')
              await Promise.all([
                bundlePage(routeName),
                renderPage(routeName, hasCustomRenderer),
              ])
              process.stdout.write('\r\x1b[K')
              process.stdout.write(`\r\x1b[KRebuilt changes to ${fileName}`)
            }
          )
        }
      }
    }
    await Promise.all(asyncTasks)
    consoleLogGreen('Built successfully!')
  })
  if (process.env.MODE === 'dev') {
    const server = livereload.createServer({ port: liveReloadPort }, () =>
      consoleLogGreen('Live reload enabled')
    )
    server.watch(__dirname + '/public')
  }
})()
