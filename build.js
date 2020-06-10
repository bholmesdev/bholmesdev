const filesystem = require('fs')
const path = require('path')
const { rollup } = require('rollup')
const babel = require('rollup-plugin-babel')
const scss = require('rollup-plugin-scss')
const commonjs = require('@rollup/plugin-commonjs')
const livereload = require('livereload')
const pageLayout = require('./src/routes/_layout/renderer')
const { writeFile } = require('./src/utils/fsPromisified')
const { routeRenderer } = require('./src/routes')
require('dotenv').config()

const liveReloadPort = 35729

const addLiveReloadScript = {
  name: 'livereload',
  outro: () => {
    return `document.write('<script src="http://localhost:${liveReloadPort}/livereload.js?snipver=1"></script>');`
  },
}

const consoleLogGreen = (text) => {
  console.log('\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m')
}

const bundleHTML = async () => {
  const routes = await routeRenderer()
  routes.forEach(async ({ routeName, meta }) => {
    await writeFile(
      `public/${routeName}.html`,
      pageLayout(routeName, meta, routes)
    )
  })
}

const bundleJS = async () => {
  let plugins = [
    babel(),
    commonjs(),
    scss({
      output: async (styles) => {
        await writeFile('public/styles.css', styles)
      },
    }),
  ]
  if (process.env.MODE === 'dev') {
    plugins = [...plugins, addLiveReloadScript]
  }

  const bundle = await rollup({
    input: 'src/routes/_layout/script.js',
    plugins,
  })
  await bundle.write({
    entryFileNames: 'bundle.js',
    dir: 'public',
    format: 'esm',
  })
}

// Build script
;(async () => {
  if (!filesystem.existsSync(__dirname + '/public/')) {
    filesystem.mkdirSync('public')
  }
  await Promise.all([bundleHTML(), bundleJS()])
  consoleLogGreen('Built successfully!')

  if (process.env.MODE === 'dev') {
    filesystem.watch(
      __dirname + '/src',
      { recursive: true },
      async (event, filePath) => {
        process.stdout.write('\r\x1b[K')
        process.stdout.write('Rebuilding...')

        const fileExtension = path.extname(filePath)
        if (fileExtension === '.pug') {
          await bundleHTML()
        } else {
          await bundleJS()
        }

        process.stdout.write('\r\x1b[K')
        process.stdout.write(`\r\x1b[KRebuilt changes to ${filePath}`)
      }
    )
  }

  if (process.env.MODE === 'dev') {
    const server = livereload.createServer({ port: liveReloadPort }, () =>
      consoleLogGreen('Live reload enabled')
    )
    server.watch(__dirname + '/public')
  }
})()
