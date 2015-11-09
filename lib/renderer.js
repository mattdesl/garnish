var chalk = require('chalk')
var stripUrl = require('url-trim')
var now = require('right-now')
var levels = require('./levels')
var padLeft = require('pad-left')
var padRight = require('pad-right')
var prettyBytes = require('pretty-bytes')
var prettyMs = require('pretty-ms')

var paddings = {
  level: 6,
  method: 6,
  contentLength: 8,
  statusCode: 3,
  elapsed: 7
}

var leftAligns = ['level', 'method']

var ansiStyles = Object.keys(chalk.styles)
var pool = [ 'magenta', 'cyan', 'blue', 'green', 'yellow' ]
var keys = [
  'time',
  'level',
  'message',
  'method',
  'statusCode',
  'elapsed',
  'contentLength',
  'url',
  'type',
  'name'
]

var startTime = now()

module.exports.isStyleObject = function (data) {
  // skip false/undefined/etc
  if (typeof data !== 'object' || !data) {
    return false
  }
  // ensure we have something worth styling
  return keys.some(function (key) {
    return data.hasOwnProperty(key)
  })
}

module.exports.create = function (defaultName) {
  var poolCount = 0
  var poolIndex = {}

  return function render (data) {
    var level = data.level
    var name = data.name

    if (name && name !== defaultName && !poolIndex[name]) {
      poolIndex[name] = pool[poolCount % pool.length]
      poolCount++
    }

    // some default colors
    var defaultColors = {
      level: levels.color(level) || 'yellow',
      name: name ? poolIndex[name] : null,
      time: 'dim',
      statusCode: data.statusCode >= 400 ? 'red' : 'green',
      contentLength: 'dim',
      elapsed: 'dim',
      url: 'bold',
      method: 'dim',
      type: 'dim'
    }

    // possible user overrides
    var colors = data.colors || {}

    if (typeof data.message === 'object') {
      data.message = destructureMessage(data.message)
    }

    // if HTTP, don't log level or 'static'
    if (data.method || data.statusCode || data.contentLength) {
      if (data.level === 'info' || data.level === 'debug') {
        data.level = ''
        level = ''
      }
    }
    
    // clean up the messages a little
    if (level) {
      data.level = levels.stringify(level)
    }

    // ignore 'static' field since it's assumed
    if (data.type === 'static') data.type = ''

    if (name) {
      data.name = name === defaultName ? '' : ('(' + name + ')')
    }

    if (data.url) data.url = stripUrl(data.url)
    if (data.type) data.type = '(' + data.type + ')'

    var line = []
    var timeOff = String(Math.round((now() - startTime) / 1000) % 10000)
    data.time = '[' + padLeft(timeOff, 4, '0') + ']'
    
    if (!data.method && !data.statusCode) {
      var emptySpace = paddings.method + paddings.statusCode + 1
      if (!data.message) {
        data.message = padLeft('', emptySpace, ' ')
      }
    }

    // render each of our valid keys
    keys.forEach(function (key) {
      var value = data[key]

      // skip empty data
      if (!value) return

      // compact formatting
      if (key === 'elapsed') value = fixElapsed(value)
      if (key === 'contentLength') value = fixSize(value)

      // pad to length
      if (key in paddings) {
        var padFn = leftAligns.indexOf(key) >= 0 ? padRight : padLeft
        value = padFn.call(padFn, value, paddings[key], ' ')
      }

      // colorize chunk
      var newColor = getColor(key, colors, defaultColors)

      if (newColor) {
        value = chalk[newColor](value)
      }

      line.push(value)
    })
    return line.join(' ')
  }
}

function fixElapsed (time) {
  if (typeof time === 'string' && /s$/i.test(time)) {
    return time
  }
  if (/infinity/i.test(time)) return time
  var ms = parseInt(time, 10)
  return ms > 9999 ? prettyMs(ms) : (ms + 'ms')
}

function fixSize (size) {
  if (typeof size === 'string' && /s$/i.test(size)) {
    return size
  }
  if (/infinity/i.test(size)) return size
  var bytes = parseInt(size, 10)
  return bytes > 9999
    ? prettyBytes(bytes)
      .replace(/ /, '')
    : (bytes + 'B')
}

function getColor (key, colors, defaultColors) {
  // try to apply user style
  var newColor = colors[key]

  // use default if style is invalid
  if (ansiStyles.indexOf(newColor) === -1) {
    newColor = null
  }
  return newColor || defaultColors[key]
}

// destructure a message onto an object if the message
// is an object.
// obj -> str
function destructureMessage (msg) {
  const keys = Object.keys(msg)
  var i = 0
  var j = keys.length
  var res = ''
  for (; i < j; i++) {
    var key = keys[i]
    var val = msg[key]
    res += key + '=' + val
    if (i !== j - 1) res += ', '
  }
  return res
}
