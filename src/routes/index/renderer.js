const minutesToRead = require('../../../utils/minutesToRead')
const fetch = require('node-fetch')

const blogPost = (title, minRead, imgSrc, imgAlt) => `
  <div class="me-blog-post__min-read-container">
    <img class="me-blog-post__icon" src=${imgSrc} alt=${imgAlt}
    <dd class="me-blog-post__min-read">${minRead} min</dd>
  </div>
  <dt class="me-blog-post__title">${title}</dt>
`

module.exports = async (routePath) => {
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
  for (let article of articles) {
    console.log(article.title, minutesToRead(article.body_markdown))
  }
  return dom.serialize()
}
