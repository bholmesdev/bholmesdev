const pug = require('pug')
const minutesToRead = require('../../utils/minutesToRead')
const fetch = require('node-fetch')

function Image(src, alt) {
  this.src = src || ''
  this.alt = alt || ''
}

function BlogPost(article) {
  this.title = article.title
  this.url = article.url
  this.coverImage = new Image(article.cover_image)
  this.minRead = minutesToRead(article.body_markdown)
  this.minReadIcon = getMinReadIcon(this.minRead)
}

const getMinReadIcon = (minRead) => {
  const icon = new Image()
  const getSrc = (size) => `/static/icons/coffee-cup-${size}.svg`

  if (minRead <= 3) {
    icon.src = getSrc('small')
    icon.alt = 'Small coffee cup'
  } else if (minRead <= 9) {
    icon.src = getSrc('med')
    icon.alt = 'Medium coffee cup'
  } else {
    icon.src = getSrc('large')
    icon.alt = 'Large coffee cup'
  }
  return icon
}

module.exports = async () => {
  try {
    const res = await fetch(
      'https://dev.to/api/articles/me/published?per_page=4',
      {
        method: 'GET',
        headers: {
          'api-key': process.env.DEVTO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    )
    const articles = await res.json()
    if (!articles || articles.length !== 4) {
      throw 'API did not return expected amount of articles.'
    }

    const blogPosts = articles.map((article) => new BlogPost(article))

    const html = pug.renderFile(__dirname + '/page.pug', {
      headline: blogPosts[0],
      blogPosts: blogPosts.slice(1),
    })

    return html
  } catch (e) {
    console.error(e)
    return e
  }
}
