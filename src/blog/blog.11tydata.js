const { toMinuteRead, toFormattedDate } = require('../../utils/formatters')

module.exports = async () => {
  // provide minuteRead function to blog-post layout
  return {
    toMinuteRead,
    toFormattedDate,
    tags: 'blogPost',
  }
}
