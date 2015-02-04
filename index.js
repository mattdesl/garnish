var ndjson = require('ndjson')
var chalk = require('chalk')
var through2 = require('through2')
var duplexer = require('duplexer')

module.exports = function garnish() {
    var out = through2()
    var parse = require('ndjson').parse({ strict: false })
        .on('data', function(obj) {
            out.push(write(obj)+" \n")
        })
    var dup = duplexer(parse, out)
    return dup
}

function write(data) {
    if (typeof data === 'string' || !data)
        return data
    if (data.message)
        return chalk.gray(data.message)
    if (!data.type || !data.url)
        return chalk.gray(data)

    var type = ['(',data.type,')'].join('')
    var url = chalk.bold(data.url)
    
    if (data.elapsed) {
        return [url, chalk.magenta(data.type), chalk.green(data.elapsed)].join(' ')
    } else {
        return [url, chalk.dim(type)].join(' ')
    }
}
