var test = require('tape')

var garnish = require('../')
var through = require('through2')
var strip = require('strip-ansi')

//does not test colors, just ensures messages are not lost
test('should handle streams', function(t) {

    ignored(undefined, 'ignore undefined')
    // ignored({ name: 'app', level: 'debug' })
    // ignored({ name: 'app', level: 'warn' }, { level: 'error' })

    // run({ name: 'app', level: 'debug' }, 'debug app:', 'prints with verbose', { verbose: true })
    // run({ name: 'app', level: 'debug' }, 'debug app:', 'prints with debug level', { level: 'debug' })

    // //test non JSON
    // run('some string', 'some string', 'handles strings')
    // run('1', '1')

    // //test valid JSON
    // run({ name: 'foo', level: 'info' }, 'info foo:', 'shows app name and level')
    // run({ name: 'foo' }, 'info foo:', 'defaults to level info')
    // run({ message: 'bar', name: 'foo' }, 'info foo: bar', 'defaults to level info')

    // //test url and type
    // run({ url: '/home', type: 'static' }, 'info /home (static)')
    // run({ url: '/home', type: 'static', name: 'app' }, 'info app: /home (static)')

    // //test url and type + elapsed
    // run({ url: '/home', type: 'static', elapsed: 'infinity', name: 'app' }, 'info app: /home (static) infinity')

    t.end()

    function ignored(input, msg, opt) {
        var stream = garnish(opt)
        var stdin = through()
        stdin
            .pipe(stream)
            .pipe(through(function(buf) {
                var len = strip(buf.toString()).trim().length
                t.ok(len===0, msg || 'ignored')
            }))
        stdin.write(JSON.stringify(null))
        // stdin.write(typeof input === 'string' ? input : JSON.stringify(input))
        stdin.end()
    }

    function run(input, expected, msg, opt) {
        var stream = garnish(opt)
        var stdin = through()
        stdin
            .pipe(stream)
            .pipe(through(function(body) {
                t.deepEqual(strip(body.toString()).trim(), expected, msg)
            }))
        stdin.write(typeof input === 'string' ? input : JSON.stringify(input))
        stdin.end()
    }
})