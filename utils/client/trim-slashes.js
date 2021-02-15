/**
 * Uses regex to remove slashes from the start and end of a given url
 * @param {string} url An relative or absolute url to trim slashes from
 * @return {string} The url with slashes trimmed
 */
export default function trimSlashes(url = '') {
  return url.replace(/^\/+|\/+$/g, '')
}
