var split = require('split2')
var eol = require('os').EOL

var renderer = require('./lib/renderer')
var levels = require('./lib/levels')

module.exports = garnish

function garnish (opt) {
  opt = opt || {}

  var loggerLevel = opt.level || 'debug'
  var render = renderer.create()

  return split(parse)

  function parse (line) {
    try {
      var obj = JSON.parse(line)

      // check if we need to style it
      if (!renderer.isStyleObject(obj)) return line + eol
      obj.level = obj.level || 'info'

      // allow user to filter to a specific level
      if (!levels.valid(loggerLevel, obj.level)) return

      return render(obj) + eol
    } catch (e) {
      return line + eol
    }
  }
}
