var chalk = require('chalk')
var stripUrl = require('url-trim')
var padLeft = require('pad-left')
var padRight = require('pad-right')
var prettyBytes = require('prettier-bytes')
var prettyMs = require('pretty-ms')
var eol = require('os').EOL

var startTime = Date.now()

exports.renderError = function (data) {
  var line = renderTime() + ' '
  line += renderName(data.name) + eol
  line += chalk.red(data.err.stack) + eol
  return line
}

exports.renderObject = function (data) {
  var line = renderTime() + ' '
  line += renderLevel(data.level, data.message)
  line += renderName(data.name)
  line += destructureMessage(data.message)
  return line
}

exports.render = function render (data) {
  if (!data.message) data.level = ''

  var line = []
  line.push(renderTime())
  if (data.level) line.push(renderLevel(data.level, data.message))
  if (data.elapsed) line.push(renderElapsed(data.elapsed))
  if (data.contentLength) line.push(renderContentLength(data.contentLength))
  if (data.message) line.push(data.message)
  if (data.method) line.push(renderMethod(data.method))
  if (data.statusCode) line.push(renderStatusCode(data.statusCode))
  if (data.url) line.push(renderUrl(data.url))
  if (data.type) line.push(renderType(data.type))
  if (data.name) line.push(renderName(data.name))

  return line.join(' ')
}

function renderTime () {
  var offset = String(Math.round((Date.now() - startTime) / 1000) % 10000)
  var msg = '[' + padLeft(offset, 4, '0') + ']'
  return chalk.dim(msg)
}

function renderLevel (level, message) {
  if (!message) level = ''
  var msg = padRight(level, 5, ' ')
  if (level === 'debug') return chalk.cyan(msg)
  if (level === 'info') return chalk.dim(msg)
  if (level === 'warn') return chalk.yellow(msg)
  if (level === 'error') return chalk.red(msg)
}

function renderElapsed (elapsed) {
  var msg = fixElapsed(elapsed)
  return chalk.dim(padRight(msg, 7, ' '))

  function fixElapsed (time) {
    if (typeof time === 'string' && /s$/i.test(time)) {
      return time
    }
    if (/infinity/i.test(time)) return time
    var ms = parseInt(time, 10)
    return ms > 9999 ? prettyMs(ms) : (ms + 'ms')
  }
}

function renderContentLength (length) {
  var msg = fixSize(length)
  return chalk.dim(padLeft(msg, 8, ' '))

  function fixSize (size) {
    if (typeof size === 'string' && /s$/i.test(size)) return size
    if (/infinity/i.test(size)) return size
    var bytes = parseInt(size, 10)
    return bytes > 9999
      ? prettyBytes(bytes).replace(/ /, '')
      : (bytes + 'B')
  }
}

function renderMethod (method) {
  return chalk.dim(padLeft(method, 6, ' '))
}

function renderStatusCode (statusCode) {
  var color = statusCode >= 400 ? 'red' : 'green'
  return chalk[color](padRight(statusCode, 3, ' '))
}

function renderUrl (url) {
  var msg = stripUrl(url)
  return chalk.bold(msg)
}

function renderType (type) {
  var msg = ('(' + type + ')')
  return chalk.dim(msg)
}

function renderName (name) {
  var msg = ('(' + name + ')')
  return chalk.magenta(msg)
}

// destructure a message onto an object if the message is an object.
// obj -> str
function destructureMessage (msg) {
  const keys = Object.keys(msg)
  var res = ''
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var val = msg[key]
    if (i !== 0) res += eol
    res += chalk.blue('  "' + key + '"')
    res += ': '
    res += chalk.green('"' + val + '"')
  }
  return res
}
