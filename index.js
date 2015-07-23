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

var poolCount = 0
var poolIndex = {}
var pool = [
    'magenta'
  , 'cyan'
  , 'blue'
  , 'green'
  , 'yellow'
]

var levels = Object.keys(colors)

module.exports = function garnish(opt) {
    opt = opt||{}
    var loggerLevel = opt.level || 'info'
    var verbose = opt.verbose
    
    var out = through2()
    var parse = split(parseJSON)
        .on('data', onData)
    var dup = duplexer(parse, out)
    return dup

    function parseJSON(data) {
        try {
          data = JSON.parse(data)
        } catch(e) { }
        // null/false/undefined/etc
        if (typeof data !== 'object' || data == null)
            data = String(data)
        return data
    }

    function onData(data) {        
        var str = write(data)
        if (str)
            out.push(str+" \n")
    }

    function write(data) {
        //print null/undefined/string/etc without any styling
        if (typeof data === 'string') {
            return data
        }

        var level = data.level || 'info'
        if (!verbose && !succeed(loggerLevel, level))
            return null
        

        var line = []
        var name = data.name ? data.name.replace(/\:[-:a-z0-9]{8,}$/g, '') : ''
        
        var nameColor = poolIndex[name] || (
          poolIndex[name] = pool[poolCount++ % pool.length]
        )

        var levelColor = colors[level] || 'yellow'
        var type = ['(',data.type,')'].join('')
        var url = chalk.bold(data.url||'')

        line.push(chalk[levelColor](pad(level, padLen)))

        if (name)
            line.push(chalk[nameColor](name + ':'))
        
        if (data.message)
            line.push(chalk.gray(data.message))
        else if (data.url && data.elapsed && data.type)
            line.push([url, chalk.magenta(type), chalk.green(data.elapsed)].join(' '))
        else if (data.url && data.type)
            line.push([url, chalk.dim(type)].join(' '))
    
        return line.join(' ')
    }
}

function succeed(logLevel, msgLevel) {
    var levelIdx = levels.indexOf(logLevel)
    var msgIdx = levels.indexOf(msgLevel)
    if (msgIdx===-1 || levelIdx===-1) return true
    return msgIdx >= levelIdx
}

function pad(str, len) {
  str = String(str)
  while (str.length < len) {
    str = ' ' + str
  }
  return str
}
