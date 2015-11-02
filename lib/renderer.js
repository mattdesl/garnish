var chalk = require('chalk')
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
  'contentLength',
  'elapsed',
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

    if (typeof data.message === 'object') {
      data.message = destructureMessage(data.message)
    }

    // clean up the messages a little
    data.level = levels.stringify(level)
    if (name) data.name = name + ':'
    if (data.url) data.url = stripUrl(data.url)
    if (data.type) data.type = '(' + data.type + ')'

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
