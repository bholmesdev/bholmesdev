const fs = require('fs')
const path = require('path')
const { rollup } = require('rollup')
const babel = require('rollup-plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const livereload = require('livereload')
const pageLayout = require('./src/routes/_layout')
const { writeFile, readDir } = require('./src/utils/fsPromisified')
const { routes, routeRenderer } = require('./src/routes')

const sassCompiler = require('node-sass')
const { promisify } = require('util')
const sassRender = promisify(sassCompiler.render)
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
  const renderedRoutes = await routeRenderer()
  renderedRoutes.forEach(async ({ routeName, meta }) => {
    await writeFile(
      `public/${routeName}.html`,
      pageLayout(routeName, meta, renderedRoutes)
    )
  })
}

const bundleCSS = async () => {
  let sassFiles = []
  const routeDirs = [
    '_layout',
    ...routes.map(({ routeName, routeDirName = routeName }) => routeDirName),
  ]
  await Promise.all(
    routeDirs.map(async (routeDirName) => {
      const routeDirPath = `${__dirname}/src/routes/${routeDirName}`
      const files = await readDir(routeDirPath)
      for (let file of files) {
        const extension = path.extname(file)
        if (extension === '.scss') {
          sassFiles = [...sassFiles, `${routeDirPath}/${file}`]
        }
      }
    })
  )

  const buffer = Buffer.concat(
    await Promise.all(
      sassFiles.map(async (file) => {
        const { css } = await sassRender({ file })
        return css
      })
    )
  )
  await writeFile(__dirname + '/public/styles.css', buffer)
}

const bundleJS = async () => {
  let plugins = [babel(), commonjs()]
  if (process.env.MODE === 'dev') {
    plugins = [...plugins, addLiveReloadScript]
  }

  const bundle = await rollup({
    input: 'src/routes/_layout/client.js',
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
  if (!fs.existsSync(__dirname + '/public/')) {
    fs.mkdirSync('public')
  }

  await Promise.all([bundleHTML(), bundleCSS(), bundleJS()])

  consoleLogGreen('Built successfully!')

  if (process.env.MODE === 'dev') {
    fs.watch(
      __dirname + '/src',
      { recursive: true },
      async (event, filePath) => {
        process.stdout.write('\r\x1b[K')
        process.stdout.write('Rebuilding...')

        const fileExtension = path.extname(filePath)
        if (fileExtension === '.pug') {
          await bundleHTML()
        } else if (fileExtension === '.scss') {
          await bundleCSS()
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
