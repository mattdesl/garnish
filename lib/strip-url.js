var urlLib = require('url')

module.exports = stripUrl
function stripUrl (url) {
  if (!url) return ''
  var obj = urlLib.parse(url)
  obj.pathname = (obj.pathname || '').replace(/\/$/, '')
  obj.search = ''
  obj.hash = ''
  obj.query = ''
  return urlLib.format(obj) || '/'
}
