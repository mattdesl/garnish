var test = require('tape')
var path = require('path')
var exec = require('npm-execspawn')
var concat = require('concat-stream')
var kill = require('tree-kill')

var cliPath = path.resolve(__dirname, '../', 'bin', 'cmd.js')
var appPath = path.join(__dirname, 'app.js')

test('should handle messages and log level', function(t) {
    t.plan(1)
    var proc = exec('node '+appPath+' | '+cliPath, { cwd: __dirname, env: process.env })
    proc.stdout.pipe(concat(function (data) {
        t.equal(data.toString(), "message \n warn app: msg \n", 'correct messages')
        kill(proc.pid)
    }))
})

test('should print debug logs', function(t) {
    t.plan(1)
    var proc = exec('node '+appPath+' | '+cliPath+' --level debug', { cwd: __dirname, env: process.env })
    proc.stdout.pipe(concat(function (data) {
        t.equal(data.toString(), 
            "message \n warn app: msg \ndebug app: msg \n", 
            'correct messages')
        kill(proc.pid)
    }))
})

test('should print debug logs', function(t) {
    t.plan(1)
    var proc = exec('node '+appPath+' | '+cliPath+' -v --level warn', { cwd: __dirname, env: process.env })
    proc.stdout.pipe(concat(function (data) {
        t.equal(data.toString(), 
            "message \n warn app: msg \ndebug app: msg \n", 
            'correct messages')
        kill(proc.pid)
    }))
})