var through2 = require('through2')
var duplexer = require('duplexer')
var split = require('split2')
var levels = require('./lib/levels')
var renderer = require('./lib/renderer')

module.exports = function garnish (opt) {
  opt = opt || {}
  var loggerLevel = opt.level || 'info'
  var verbose = opt.verbose
  var render = renderer.create()

  var out = through2()
  var parse = split().on('data', onData)
  var dup = duplexer(parse, out)
  return dup

  function onData (data) {
    // see if we should style it
    var style = parseData(data)
    if (style) {
      data = write(style)
      // if skipping certain log levels
      if (!data) {
        return
      }
    }

    out.push(data + '\n')
  }

  function write (data) {
    // level defaults to 'info'
    data.level = data.level || 'info'

    // allow user to filter to a specific level
    if (!verbose && !levels.valid(loggerLevel, data.level)) {
      return null
    }
    
    return render(data)
  }
}

function parseData (data) {
  try {
    var json = JSON.parse(data)
    return renderer.isStyleObject(json) ? json : null
  } catch (e) {
    return null
  }
}
