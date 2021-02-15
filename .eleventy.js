const input = 'src'
const output = 'build'
const { rollup } = require('rollup')
const cssPrefixer = require('postcss-prefix-selector')
const postcss = require('postcss')
const { promisify } = require('util')
const sassCompiler = require('sass')
const sassRender = promisify(sassCompiler.render)
const path = require('path')
const chalk = require('chalk')
const virtual = require('@rollup/plugin-virtual')
const { stringify } = require('javascript-stringify')
const joinTrimSlashes = require('./utils/join-trim-slashes')
const renderToLayout = require('./utils/render-to-layout')(
  path.resolve(__dirname, input)
)

const matchPathProperties = (path = '', fileExtension = '', useOutput) => {
  const [_, relativePath, fileName] = path.match(
    new RegExp(
      `.*${useOutput ? output : './' + input}(.*\/|\/)(.*).${fileExtension}`
    )
  )
  return { relativePath, fileName }
}

const templateExtensionConfig = {
  read: false, // don't process the file's contents. That's our job!
  getData: () => {},
  compile: (_, inputPath) => (data) => {
    const { relativePath } = matchPathProperties(data.page.outputPath, '', true)
    const pageData = {
      ...data,
      slinkit: {
        styles: `<link rel="stylesheet" href="${path.join(
          relativePath,
          '__styles.css'
        )}">`,
      },
    }
    if (inputPath.startsWith(`./${input}/_layouts`)) {
      return
    } else {
      return renderToLayout(inputPath, data.page.url, pageData)
    }
  },
}

module.exports = function (eleventyConfig) {
  /*
    We're processing templates by hand instead of using 11ty
    This is mainly for page transitions and style scoping, since we need
    to apply unique HTML identifiers to *each layout file* our templates use
  */
  eleventyConfig.templateFormats = ['md', 'pug', 'scss', 'mjs', 'html']

  eleventyConfig.addExtension('pug', templateExtensionConfig)
  eleventyConfig.addExtension('md', templateExtensionConfig)

  eleventyConfig.addExtension('mjs', {
    read: false,
    getData: (inputPath) => {
      const { relativePath, fileName } = matchPathProperties(inputPath, 'mjs')
      let resolvedPathWithFolder = ''
      if (fileName === '_main') {
        resolvedPathWithFolder = path.resolve(relativePath, '__main.js')
      } else if (fileName === 'index') {
        resolvedPathWithFolder = path.resolve(relativePath, '__client.js')
      } else {
        resolvedPathWithFolder = path.resolve(
          relativePath,
          fileName,
          '__client.js'
        )
      }
      return {
        dynamicPermalink: false,
        permalink: resolvedPathWithFolder,
      }
    },
    outputFileExtension: 'js',
    compile: (_, inputPath) => async (data) => {
      /* Runs your JS through a bundler called RollupJS.
      Check out https://rollupjs.org for a quick guide,
      and where to find any plugins you might want */
      const bundle = await rollup({
        input: inputPath,
      })
      const { output } = await bundle.generate({ format: 'esm' })
      if (output?.length && output[0]?.code) {
        const { fileName } = matchPathProperties(inputPath, 'mjs')
        if (fileName !== '_main') {
          const dataBundle = await rollup({
            input: '__data',
            plugins: [
              virtual({
                __data: `export default ${stringify({
                  ...data,
                  collections: undefined,
                })}`,
              }),
            ],
          })
          await dataBundle.write({
            file: data.page.outputPath.replace('__client.js', '__data.js'),
            format: 'esm',
          })
        }
        return output[0].code
      } else {
        console.log(
          chalk.red(`There was a problem generating JS for ${inputPath}`)
        )
        return
      }
    },
  })

  eleventyConfig.addExtension('scss', {
    read: false,
    outputFileExtension: 'css',
    getData: (inputPath) => {
      let { relativePath, fileName } = matchPathProperties(inputPath, 'scss')
      const pathWithFolder =
        fileName === 'index'
          ? relativePath
          : path.resolve(relativePath, fileName)
      return {
        dynamicPermalink: false,
        permalink: path.resolve(pathWithFolder, '__styles.css'),
      }
    },
    compile: (_, inputPath) => async ({ page: { outputPath } }) => {
      const { css } = await sassRender({ file: inputPath })
      const { relativePath } = matchPathProperties(outputPath, 'css', true)
      const dataPageAttr = joinTrimSlashes(relativePath)

      return postcss()
        .use(
          cssPrefixer({
            prefix: dataPageAttr ? `[data-page="${dataPageAttr}"]` : '',
          })
        )
        .process(css).css
    },
  })

  return {
    dir: { input, output },
  }
}
