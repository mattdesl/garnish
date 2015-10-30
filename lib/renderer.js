var chalk = require('chalk')
var prettyBytes = require('pretty-bytes')
var prettyMs = require('pretty-ms')
var stripUrl = require('url-trim')
var levels = require('./levels')

var ansiStyles = Object.keys(chalk.styles)
var pool = [ 'magenta', 'cyan', 'blue', 'green', 'yellow' ]
var keys = [
  'level',
  'name',
  'message',
  'url',
  'statusCode',
  'elapsed',
  'contentLength',
  'type'
]

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

module.exports.create = function () {
  var poolCount = 0
  var poolIndex = {}

  return function render (data) {
    var level = data.level
    var name = data.name

    if (name && !poolIndex[name]) {
      poolIndex[name] = pool[poolCount % pool.length]
      poolCount++
    }

    // some default colors
    var defaultColors = {
      level: levels.color(level) || 'yellow',
      name: name ? poolIndex[name] : null,
      url: 'bold',
      statusCode: data.statusCode >= 400 ? 'red' : 'green',
      contentLength: 'dim',
      elapsed: 'green',
      type: 'dim'
    }

    // possible user overrides
    var colors = data.colors || {}

    // clean up the messages a little
    data.level = levels.stringify(level)
    if (name) data.name = name + ':'
    if (data.url) data.url = stripUrl(data.url)
    if (data.type) data.type = '(' + data.type + ')'
    if (data.elapsed) data.elapsed = prettyTime(data.elapsed)
    if (data.contentLength) data.contentLength = prettySize(data.contentLength)

    var line = []
    // render each of our valid keys
    keys.forEach(function (key) {
      var value = data[key]

      // skip empty data
      if (!value) return

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

function getColor (key, colors, defaultColors) {
  // try to apply user style
  var newColor = colors[key]

  // use default if style is invalid
  if (ansiStyles.indexOf(newColor) === -1) {
    newColor = null
  }
  return newColor || defaultColors[key]
}

// prettyify elapsed time if a number is provided
// str -> str
function prettyTime (time) {
  if (typeof time === 'string' && /s$/i.test(time)) return time
  if (time === 'infinity') return time
  return prettyMs(Number(time))
}

// prettyify content length if a number is provided
// str -> str
function prettySize (size) {
  if (typeof size === 'string' && /b$/i.test(size)) return size
  if (size === 'infinity') return size
  return prettyBytes(Number(size)).replace(/ /, '').toLowerCase()
}
