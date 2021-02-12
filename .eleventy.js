const input = 'src'
const output = 'build'
const {
  default: dynamicImportVariables,
} = require('@rollup/plugin-dynamic-import-vars')
const { rollup } = require('rollup')
const { readdir, unlink, writeFile } = require('fs/promises')
const cssPrefixer = require('postcss-prefix-selector')
const postcss = require('postcss')
const { promisify } = require('util')
const sassCompiler = require('sass')
const sassRender = promisify(sassCompiler.render)
const path = require('path')
const chalk = require('chalk')
const renderToLayout = require('./utils/render-to-layout')(
  path.resolve(__dirname, input)
)

const cleanSplitFiles = async () => {
  try {
    const buildFiles = await readdir(output)
    const splitFiles = buildFiles.filter((file) => file.startsWith('client-'))
    await Promise.all(splitFiles.map((file) => unlink(`${output}/${file}`)))
  } catch (e) {
    console.error(
      'There was a problem cleaning client.js files from the build dir'
    )
    console.error(e)
  }
}

/* Runs your JS through a bundler called RollupJS.
Check out https://rollupjs.org for a quick guide,
and where to find any plugins you might want */
const bundleJS = async () => {
  await cleanSplitFiles()
  const bundle = await rollup({
    input: 'main.js',
    plugins: [dynamicImportVariables()],
  })
  await bundle.write({
    entryFileNames: 'not-a-react-bundle.js',
    dir: output,
    format: 'es',
  })
  console.log(chalk.green('🔨 Built your scripts'))
}

const processCSS = async (queue = []) => {
  await Promise.all(
    queue.map(({ outputPath, css }) => writeFile(outputPath, css))
  )
  console.log(chalk.green('💅 Built your styles'))
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPairedShortcode(
    'size',
    (content, size) => `<span style="font-size: ${size}">${content}</span>`
  )

  eleventyConfig.addWatchTarget(`**/client.js`)
  eleventyConfig.on('beforeWatch', (changedFiles = []) => {
    const clientScriptsChanged = changedFiles.filter((file) =>
      file.endsWith('client.js')
    )
    if (clientScriptsChanged.length) {
      bundleJS()
    }
  })

  let cssBuildQueue = []
  let firstBuild = true
  eleventyConfig.on('afterBuild', async () => {
    await processCSS(cssBuildQueue)
    cssBuildQueue = []

    // afterBuild fires *every time* a file is changed
    // with this flag, bundleJS only fires on the initial build
    // we use the 'beforeWatch' event for future bundling
    if (!firstBuild) return
    firstBuild = false
    bundleJS()
  })

  /*
    We're processing templates by hand instead of using 11ty
    This is mainly for page transitions and style scoping, since we need
    to apply unique HTML identifiers to *each layout file* our templates use
  */
  eleventyConfig.templateFormats = ['md', 'pug', 'scss']

  eleventyConfig.addExtension('pug', {
    read: false, // don't process the file's contents. That's our job!
    getData: () => {}, // pipe data into that data object below (empty for now)
    compile: (_, inputPath) => (data) =>
      renderToLayout(inputPath, data.page.url, data),
  })

  eleventyConfig.addExtension('md', {
    read: false,
    getData: () => {},
    compile: (_, inputPath) => (data) =>
      renderToLayout(inputPath, data.page.url, data),
  })

  eleventyConfig.addExtension('scss', {
    read: false,
    getData: () => {},
    compile: (_, inputPath) => async () => {
      const { css } = await sassRender({ file: inputPath })
      const [_, relativePath, fileName] = inputPath.match(
        new RegExp(`.*\/${input}(.*\/|\/)(.*).scss`)
      )
      cssBuildQueue.push({
        outputPath: `${__dirname}/${output}${relativePath}${fileName}.css`,
        css: postcss()
          .use(
            cssPrefixer({
              prefix: `[data-page="${relativePath}"]`,
            })
          )
          .process(css).css,
      })
    },
  })

  return {
    dir: { input, output },
  }
}
