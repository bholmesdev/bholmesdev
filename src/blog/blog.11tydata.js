const {
  toMinuteRead,
  toFormattedDate,
  toSortedPosts,
} = require('../../utils/formatters')

module.exports = async () => {
  // provide minuteRead function to blog-post layout
  return {
    toMinuteRead,
    toFormattedDate,
    toSortedPosts,
    tags: 'blogPost',
  }
}
