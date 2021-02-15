const fetch = require('node-fetch')
const minutesToRead = require('../utils/minutes-to-read')

function Image(src, alt) {
  this.src = src || ''
  this.alt = alt || ''
}

function BlogPost(article) {
  this.title = article.title || ''
  this.url = article.url || ''
  this.coverImage = new Image(article.cover_image)
  this.minRead = article.body_markdown
    ? minutesToRead(article.body_markdown)
    : 0
  this.minReadIcon = getMinReadIcon(this.minRead)
}

const getMinReadIcon = (minRead) => {
  const icon = new Image()
  const getSrc = (size) => `/assets/icons/coffee-cup-${size}.svg`

  if (minRead <= 4) {
    icon.src = getSrc('smol')
    icon.alt = 'Small coffee cup'
  } else if (minRead <= 9) {
    icon.src = getSrc('meed')
    icon.alt = 'Medium coffee cup'
  } else {
    icon.src = getSrc('thicc')
    icon.alt = 'Large coffee cup'
  }
  return icon
}

module.exports = async () => {
  let blogPosts = []
  try {
    const res = await fetch(
      'https://dev.to/api/articles/me/published?per_page=5',
      {
        method: 'GET',
        headers: {
          'api-key': process.env.DEVTO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    )
    const articles = await res.json()
    if (!articles || articles.length !== 5) {
      throw 'API did not return expected amount of articles.'
    }

    blogPosts = articles.map((article) => new BlogPost(article))
  } catch (e) {
    console.error(e)
    const emptyBlogPost = new BlogPost({})
    blogPosts = [emptyBlogPost]
  }

  return {
    headline: blogPosts[0],
    blogPosts: blogPosts.slice(1),
  }
}
