const { readFile } = require('fs').promises
const { existsSync, lstatSync } = require('fs')
const path = require('path')
const frontMatter = require('front-matter')
const renderPug = require('../utils/render-pug')
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

  const _readFrontMatter = async (layoutPath = '', meta = {}) => {
    if (!layoutPath) return meta
    let rawLayout = ''
    try {
      rawLayout = await resolveLayout(layoutPath)
    } catch (e) {
      console.log(`Oop! We couldn't find this layout: ${layoutPath}`, e)
      return meta
    }
    const {
      attributes: { layout = 'index', ...layoutMeta },
    } = frontMatter(rawLayout.toString())
    const slinkitMeta = {
      slinkit: {
        ...meta.slinkit,
        styles:
          `<link rel="stylesheet" href=${toLayoutStylePath(layoutPath)}>` +
          (meta.slinkit?.styles ?? ''),
      },
    }
    return await _readFrontMatter(
      layoutPath.startsWith('index') && layout === 'index' ? '' : layout,
      { ...layoutMeta, ...meta, ...slinkitMeta }
    )
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
  const _renderToLayout = async (
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
      attributes: { layout = 'index' },
      body,
    } = frontMatter(rawLayout.toString())

    const markupWithLayout = await renderPug(body, {
      ...meta,
      slinkit: {
        ...meta.slinkit,
        page: pageAttr,
      },
      layout,
      content: markup,
      basedir: path.join(inputDir, '_includes'),
      filename: path.join(inputDir, '_includes', 'index'),
    })
    return await _renderToLayout(
      // if we already rendered the index layout,
      // don't recursively render the index layout *again* (infinite loop!)
      layoutPath.startsWith('index') && layout === 'index' ? '' : layout,
      { ...meta, layout },
      joinTrimSlashes('_layouts', layoutPath),
      markupWithLayout
    )
  }

  return {
    readFrontMatter: async (filePath = '', extraMeta = {}) => {
      const template = await readFile(filePath)
      const {
        attributes: { layout, ...meta },
      } = frontMatter(template.toString())

      return _readFrontMatter(layout ?? 'index', { ...extraMeta, ...meta })
    },
    renderToLayout: async (filePath = '', meta = {}) => {
      const template = await readFile(filePath)
      const {
        attributes: { layout },
        body,
      } = frontMatter(template.toString())

      const fileExt = path.extname(filePath)
      let markup = ''
      if (fileExt === '.pug') {
        markup = await renderPug(body, {
          ...meta,
          basedir: path.join(inputDir, '_includes'),
          filename: path.join(inputDir, '_includes', 'index'),
        })
      }
      if (fileExt === '.md') {
        const renderMd = require('./render-md')
        markup = await renderMd(body)
      }

      const html = _renderToLayout(
        layout ?? 'index',
        meta,
        joinTrimSlashes(meta.page.url),
        markup
      )

      return html
    },
  }
}
