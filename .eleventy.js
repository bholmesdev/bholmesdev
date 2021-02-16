const input = 'src'
const output = 'build'
const { rollup } = require('rollup')
const cssPrefixer = require('postcss-prefix-selector')
const cssClean = require('postcss-clean')
const postcss = require('postcss')
const { promisify } = require('util')
const sassCompiler = require('sass')
const sassRender = promisify(sassCompiler.render)
const path = require('path')
const chalk = require('chalk')
const virtual = require('@rollup/plugin-virtual')
const { stringify } = require('javascript-stringify')
const yaml = require('js-yaml')
const joinTrimSlashes = require('./utils/join-trim-slashes')
const dotenv = require('dotenv')
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
  dotenv.config()
  /*
    We're processing templates by hand instead of using 11ty
    This is mainly for page transitions and style scoping, since we need
    to apply unique HTML identifiers to *each layout file* our templates use
  */
  eleventyConfig.templateFormats = ['md', 'pug', 'scss', 'mjs', 'html']
  eleventyConfig.addPassthroughCopy('assets')

  eleventyConfig.addExtension('pug', templateExtensionConfig)
  eleventyConfig.addExtension('md', templateExtensionConfig)

  eleventyConfig.addDataExtension('yaml', (contents) => yaml.safeLoad(contents))

  eleventyConfig.addExtension('mjs', {
    read: false,
    getData: (inputPath) => {
      const { relativePath, fileName } = matchPathProperties(inputPath, 'mjs')
      let resolvedPathWithFolder = ''
      if (fileName === '_main') {
        resolvedPathWithFolder = path.resolve(relativePath, '__main.mjs')
      } else if (fileName === 'index') {
        resolvedPathWithFolder = path.resolve(relativePath, '__client.mjs')
      } else {
        resolvedPathWithFolder = path.resolve(
          relativePath,
          fileName,
          '__client.mjs'
        )
      }
      return {
        dynamicPermalink: false,
        permalink: resolvedPathWithFolder,
      }
    },
    outputFileExtension: 'mps',
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
            file: data.page.outputPath.replace('__client.mjs', '__data.mjs'),
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

      const postCssPlugins = []
      if (process.env.ENV === 'prod') {
        // minify CSS for production builds
        postCssPlugins.push(cssClean())
      }
      if (dataPageAttr !== '_layouts') {
        // append the data-page attribute for everything *except* global _layout styles
        postCssPlugins.push(
          cssPrefixer({ prefix: `[data-page="${dataPageAttr}"]` })
        )
      }

      if (!postCssPlugins.length) return css
      else {
        const postCSSOutput = await postcss(postCssPlugins).process(css)
        return postCSSOutput.css
      }
    },
  })

  return {
    dir: { input, output },
  }
}
