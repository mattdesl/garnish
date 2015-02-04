var ndjson = require('ndjson')
var chalk = require('chalk')
var through2 = require('through2')
var duplexer = require('duplexer')

module.exports = function garnish() {
    var out = through2()
    var parse = require('ndjson').parse()
        .on('data', function(obj) {
            out.push(write(obj)+" \n")
        })
    var dup = duplexer(parse, out)
    return dup
}

function write(data) {
    var type = ['(',data.type,')'].join('')
    var url = chalk.bold(data.url)
    
    if (data.elapsed) {
        return [url, chalk.green(data.elapsed), chalk.magenta(data.command||'')].join(' ')
    } else {
        return [url, chalk.dim(type)].join(' ')
    }
}
