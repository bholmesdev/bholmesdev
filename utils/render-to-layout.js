const { readFile } = require('fs').promises
const { existsSync, lstatSync } = require('fs')
const path = require('path')
const frontMatter = require('front-matter')
const pug = require('pug')
const joinTrimSlashes = require('./join-trim-slashes')

const toLayoutStylePath = (layoutAttr) =>
  path.join(
    '/_layouts',
    layoutAttr === 'index' ? '' : layoutAttr,
    '__styles.css'
  )

module.exports = (inputDir) => {
  /**
   * Uses a relative path to a layout file / dir
   * and loads the raw content of the file asynchronously
   * @param {string} layoutRelativePath path to layout file (or dir) relative to /src/layout
   * @return {string} The string output of the determined layout file
   */
  const resolveLayout = async (layoutRelativePath = '') => {
    let layoutAbsolutePath = path.resolve(
      inputDir,
      '_layouts',
      layoutRelativePath
    )
    if (
      existsSync(layoutAbsolutePath) &&
      lstatSync(layoutAbsolutePath).isDirectory()
    ) {
      layoutAbsolutePath = path.resolve(layoutAbsolutePath, 'index.pug')
    } else if (!layoutAbsolutePath.endsWith('.pug')) {
      layoutAbsolutePath += '.pug'
    }
    return await readFile(layoutAbsolutePath)
  }

  /**
   * Renders a given template to the layout specified in its frontmatter.
   * Layouts can inherit other layouts, so this function will recursively
   * Walk through each layout's frontmatter until it hits the index layout
   *
   * @param {string} layoutPath path to layout file (or dir) relative to /src/layout
   * @param {object} meta object of metadata keys provided by frontmatter
   * @param {string} pageAttr either the route name or layout name to be passed as the [data-page] attr
   * @param {string} markup HTML markup to render with layout
   * @return {string} The HTML markup rendered within all specified layouts
   */
  const renderWithLayout = async (
    layoutPath = '',
    meta = {},
    pageAttr = '',
    markup = ''
  ) => {
    if (!layoutPath) return markup
    let rawLayout = ''
    try {
      rawLayout = await resolveLayout(layoutPath)
    } catch (e) {
      console.log(`Oop! We couldn't find this layout: ${layoutPath}`, e)
      return markup
    }
    const {
      attributes: { layout = 'index', ...layoutMeta },
      body,
    } = frontMatter(rawLayout.toString())
    const slinkitMeta = {
      slinkit: {
        ...meta.slinkit,
        styles:
          `<link rel="stylesheet" href=${toLayoutStylePath(layoutPath)}>` +
          meta.slinkit.styles,
        page: pageAttr,
      },
    }
    const markupWithLayout = pug.render(body, {
      ...meta,
      ...slinkitMeta,
      content: markup,
    })
    return await renderWithLayout(
      // if we already rendered the index layout,
      // don't recursively render the index layout *again* (infinite loop!)
      layoutPath.startsWith('index') && layout === 'index' ? '' : layout,
      { ...layoutMeta, ...meta, ...slinkitMeta },
      joinTrimSlashes('_layouts', layoutPath),
      markupWithLayout
    )
  }

  return async (filePath = '', pageAttr = '', props) => {
    const template = await readFile(filePath)
    const {
      attributes: { layout, ...meta },
      body,
    } = frontMatter(template.toString())

    const fileExt = path.extname(filePath)
    let markup = ''
    if (fileExt === '.pug') {
      markup = pug.render(body, props)
    }
    if (fileExt === '.md') {
      const renderMd = require('./render-md')
      markup = renderMd(body)
    }

    const html = renderWithLayout(
      layout ?? 'index',
      { ...props, ...meta },
      joinTrimSlashes(pageAttr),
      markup
    )

    return html
  }
}
