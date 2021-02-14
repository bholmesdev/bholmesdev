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

const matchPathProperties = (path = '', fileExtension = '') => {
  const [_, relativePath, fileName] = path.match(
    new RegExp(`.*\/${input}(.*\/|\/)(.*).${fileExtension}`)
  )
  return { relativePath, fileName }
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPairedShortcode(
    'size',
    (content, size) => `<span style="font-size: ${size}">${content}</span>`
  )

  /*
    We're processing templates by hand instead of using 11ty
    This is mainly for page transitions and style scoping, since we need
    to apply unique HTML identifiers to *each layout file* our templates use
  */
  eleventyConfig.templateFormats = ['md', 'pug', 'scss', 'mjs']

  eleventyConfig.addExtension('mjs', {
    read: false,
    getData: () => {}, // TODO: pass data as a prop to client scripts
    outputFileExtension: 'js',
    compile: (_, inputPath) => async ({ page: { outputPath } }) => {
      const { relativePath, fileName } = matchPathProperties(inputPath, 'mjs')

      /* Runs your JS through a bundler called RollupJS.
      Check out https://rollupjs.org for a quick guide,
      and where to find any plugins you might want */
      const bundle = await rollup({
        input: inputPath,
      })
      await bundle.write({
        entryFileNames: `${fileName}.js`,
        dir: `${__dirname}/${output}${relativePath}`,
        format: 'esm',
      })
      console.log(chalk.green(`🔨 Built ${outputPath} from ${inputPath}`))
    },
  })

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
    outputFileExtension: 'css',
    getData: () => {},
    compile: (_, inputPath) => async () => {
      const { css } = await sassRender({ file: inputPath })
      const { relativePath } = matchPathProperties(inputPath, 'css')
      return postcss()
        .use(
          cssPrefixer({
            prefix: `[data-page="${relativePath}"]`,
          })
        )
        .process(css).css
    },
  })

  return {
    dir: { input, output },
  }
}
