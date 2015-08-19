var chalk = require('chalk')
var through2 = require('through2')
var duplexer = require('duplexer')
var split = require('split2')

var colors = {
  debug: 'cyan',
  info: 'blue',
  warn: 'yellow',
  error: 'red'
}

var padLen = Object.keys(colors).reduce(function (prev, a) {
  return Math.max(prev, a.length)
}, 0)

var pool = [ 'magenta', 'cyan', 'blue', 'green', 'yellow' ]
var keys = [ 'level', 'message', 'url', 'elapsed', 'type', 'name' ]

var levels = Object.keys(colors)

module.exports = function garnish (opt) {
  opt = opt || {}
  var loggerLevel = opt.level || 'info'
  var verbose = opt.verbose
  var poolCount = 0
  var poolIndex = {}

  var out = through2()
  var parse = split()
    .on('data', onData)
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
    var level = data.level || 'info'
    if (!verbose && !succeed(loggerLevel, level)) {
      return null
    }

    var line = []
    var name = data.name ? data.name.replace(/\:[-:a-z0-9]{8,}$/g, '') : ''

    if (!poolIndex[name]) {
      poolIndex[name] = pool[poolCount % pool.length]
      poolCount++
    }

    var nameColor = poolIndex[name]

    var levelColor = colors[level] || 'yellow'
    var type = ['(', data.type, ')'].join('')
    var url = chalk.bold(data.url || '')

    line.push(chalk[levelColor](pad(level, padLen)))

    if (name) {
      line.push(chalk[nameColor](name + ':'))
    }

    if (data.message) {
      line.push(data.message)
    } else if (data.url && data.elapsed && data.type) {
      line.push([url, chalk.magenta(type), chalk.green(data.elapsed)].join(' '))
    } else if (data.url && data.type) {
      line.push([url, chalk.dim(type)].join(' '))
    }

    return line.join(' ')
  }
}

function isStyleObject (data) {
  // skip false/undefined/etc
  if (typeof data !== 'object' || !data) {
    return false
  }
  // ensure we have something worth styling
  return keys.some(function (key) {
    return data.hasOwnProperty(key)
  })
}

function parseData (data) {
  try {
    var json = JSON.parse(data)
    return isStyleObject(json) ? json : null
  } catch (e) {
    return null
  }
}

function succeed (logLevel, msgLevel) {
  var levelIdx = levels.indexOf(logLevel)
  var msgIdx = levels.indexOf(msgLevel)
  if (msgIdx === -1 || levelIdx === -1) return true
  return msgIdx >= levelIdx
}

function pad (str, len) {
  str = String(str)
  while (str.length < len) {
    str = ' ' + str
  }
  return str
}
