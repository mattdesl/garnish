var test = require('tape')

var garnish = require('../')
var through = require('through2')
var strip = require('strip-ansi')

// does not test colors, just ensures messages are not lost
test('should handle streams', function (t) {
  run(null, 'null')
  run(0, '0')
  run(2, '2')
  run(false, 'false')

  // test non stylables
  run('some string', JSON.stringify('some string'), 'handles strings')
  run({ foo: 'bar' }, JSON.stringify({ foo: 'bar' }), 'handles strings')
  run('1', JSON.stringify('1'))

  ignored({ name: 'app', level: 'warn' }, 'should ignore level', { level: 'error' })
  ignored({ name: 'app', message: 'foobar' }, 'should ignore default debug')

  run({ name: 'app', level: 'debug' }, 'debug app:', 'prints with verbose', { verbose: true })
  run({ name: 'app', level: 'debug' }, 'debug app:', 'prints with debug level', { level: 'debug' })

  // test valid JSON
  run({ name: 'foo', level: 'info' }, 'info foo:', 'shows app name and level')
  run({ name: 'foo' }, 'info foo:', 'defaults to level info')
  run({ message: 'bar', name: 'foo' }, 'info foo: bar', 'defaults to level info')

  // test url and type
  run({ url: '/home', type: 'static' }, 'info /home (static)')
  run({ url: '/home', type: 'static', name: 'app' }, 'info app: /home (static)')

  // // test url and type + elapsed
  run({ url: '/home', type: 'static', elapsed: 'infinity', name: 'app' }, 'info app: /home infinity (static)')
  run({ url: '/home?blah=24#foo', type: 'static', elapsed: 'infinity', name: 'app' }, 'info app: /home infinity (static)', 'strips hash and query')
  run({ url: 'http://localhost:9966/home?blah=24#foo', type: 'static', elapsed: 'infinity', name: 'app' }, 'info app: http://localhost:9966/home infinity (static)', 'does not strip host or port')

  // test everything
  run({
    name: 'http',
    url: '/home',
    type: 'http',
    statusCode: '200',
    contentLength: '12b',
    elapsed: '24ms'
  }, 'info http: /home 200 12b 24ms (http)')
  t.end()

  function ignored (input, msg, opt) {
    var val = true
    var stream = garnish(opt)
    var stdin = through()
    stdin
      .pipe(stream)
      .pipe(through(function (buf) {
        var len = strip(buf.toString()).trim().length
        if (len > 0) {
          val = false
        }
      }))
    stdin.write(JSON.stringify(input))
    stdin.end()
    t.ok(val, msg || 'ignored')
  }

  function run (input, expected, msg, opt) {
    var stream = garnish(opt)
    var stdin = through()
    stdin
      .pipe(stream)
      .pipe(through(function (body) {
        t.deepEqual(strip(body.toString()).trim(), expected, msg)
      }))
    stdin.write(JSON.stringify(input))
    stdin.end()
  }
})
