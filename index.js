var split = require('split2')
var eol = require('os').EOL

var renderer = require('./render')

module.exports = garnish

function garnish () {
  return split(parse)

  function parse (line) {
    try {
      var obj = JSON.parse(line)
      if (!obj) return line + eol
    } catch (e) {
      return line + eol
    }

    // handle log levels
    if (!obj.level) return line + eol
    if (typeof obj.level === 'number') toBunyan(obj)

    // don't log incoming http requests
    if (obj.name === 'http' && obj.message === 'request') return

    // errors should be formatted differently
    if (typeof obj.err === 'object') return renderer.renderError(obj) + eol

    // message objects should be multilined
    if (typeof obj.message === 'object') {
      return renderer.renderObject(obj) + eol
    }

    // render as usual
    return renderer.render(obj) + eol
  }
}

// mutate a bole log to bunyan log
// obj -> null
function toBunyan (obj) {
  if (obj.msg && !obj.message) {
    obj.message = obj.msg
    delete obj.msg
  }

  if (typeof obj.level === 'number') {
    if (obj.level === 20) obj.level = 'debug'
    if (obj.level === 30) obj.level = 'info'
    if (obj.level === 40) obj.level = 'warn'
    if (obj.level === 50) obj.level = 'error'
  }
}
