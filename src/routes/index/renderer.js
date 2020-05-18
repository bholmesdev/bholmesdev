const { mdFileToJSDOM } = require('../../../utils/mdHelpers')
const minutesToRead = require('../../../utils/minutesToRead')
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

const getBlogPostHTML = ({
  url,
  minReadIcon: { src, alt },
  minRead,
  title,
}) => `
  <a class="me-blog-post" href="${url}">
    <img class="me-blog-post__icon" src="${src}" alt="${alt}" />
    <dd class="me-blog-post__min-read">${minRead} min</dd>
    <dt class="me-blog-post__title">${title}</dt>
  </a>
`

const appendBlogPost = (blogPost, postsContainerEl) => {
  const html = getBlogPostHTML(blogPost)
  postsContainerEl.insertAdjacentHTML('beforeend', html)
}

const setupHeadlineBlogPost = (blogPost, document) => {
  const els = {
    link: document.querySelector('.me-headline-blog-post'),
    title: document.querySelector('.me-headline-blog-post__title'),
    img: document.querySelector('.me-headline-blog-post__img'),
    minRead: document.querySelector('.me-headline-blog-post__min-read'),
    minReadIcon: document.querySelector('.me-headline-blog-post__icon'),
  }

  els.link.href = blogPost.url
  els.title.innerHTML = blogPost.title
  els.img.src = blogPost.coverImage.src
  els.img.alt = blogPost.coverImage.alt
  const minReadText = document.createTextNode(blogPost.minRead + ' min read')
  els.minRead.appendChild(minReadText)
  els.minReadIcon.src = blogPost.minReadIcon.src
  els.minReadIcon.alt = blogPost.minReadIcon.alt
}

module.exports = async (routePath) => {
  const { dom, document } = await mdFileToJSDOM(routePath + '/page.md')

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

    const blogPosts = articles.map((article) => new BlogPost(article))

    const headlinePost = blogPosts[1]
    setupHeadlineBlogPost(headlinePost, document)

    const postsContainer = document.querySelector('.me-blog-posts')
    for (let blogPost of blogPosts.slice(2)) {
      appendBlogPost(blogPost, postsContainer)
    }
    return dom.serialize()
  } catch (e) {
    console.error(e)
    return dom.serialize()
  }
}
