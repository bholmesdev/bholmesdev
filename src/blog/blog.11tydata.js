const minuteRead = require('../../utils/minute-read')

module.exports = async () => {
  // provide minuteRead function to blog-post layout
  return {
    minuteRead,
  }
}
