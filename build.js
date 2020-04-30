const filesystem = require('fs')
const { rollup } = require('rollup')
const livereload = require('livereload')
const babel = require('rollup-plugin-babel')
const readMdFile = require('./readMdFile')
const pageTemplate = require('./routes/pageTemplate')

const liveReloadPort = 35729

const addLiveReloadScript = {
  name: 'livereload',
  banner: () => {
    return `document.write('<script src="http://localhost:${liveReloadPort}/livereload.js?snipver=1"></script>')`
  },
}

const consoleLogGreen = text => {
  console.log('\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m')
}

const renderPage = (routeName, useCustomRenderer) =>
  new Promise(async resolve => {
    let htmlString = ''
    const routePath = `./routes/${routeName}/`
    if (useCustomRenderer) {
      const render = require(routePath + 'renderer.js')
      htmlString = render()
    } else {
      const markdown = await readMdFile(routePath + 'page.md')
      htmlString = pageTemplate(markdown, routeName)
    }
    const stream = filesystem.createWriteStream(`public/${routeName}.html`)

    stream.once('open', () => {
      stream.end(htmlString)
      resolve()
    })
  })

const bundlePage = routeName =>
  new Promise(async resolve => {
    const bundle = await rollup({
      input: {
        [routeName]: `routes/${routeName}/script.js`,
      },
      plugins:
        process.env.MODE === 'dev' ? [addLiveReloadScript, babel()] : [babel()],
    })
    await bundle.write({
      entryFileNames: '[name].js',
      dir: 'public',
      format: 'esm',
    })
    resolve()
  })

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
              await Promise.all([
                bundlePage(routeName),
                renderPage(routeName, hasCustomRenderer),
              ])
              console.log(`Rebuilt changes to ${fileName}`)
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
