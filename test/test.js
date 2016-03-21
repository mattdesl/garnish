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

  const expected = '[0000] debug foobar (app)'
  run({ name: 'app', message: 'foobar', level: 'debug' }, expected, 'should not ignore default debug')

  const expected0 = '[0000] (app)'
  run({ name: 'app', level: 'debug' }, expected0, 'prints with debug level')

  // test valid JSON
  // run({ name: 'foo', level: 'info' }, '[0000] ', 'shows app name and level')
  // run({ name: 'foo' }, 'info foo:', 'defaults to level info')
  // run({ message: 'bar', name: 'foo' }, 'info foo: bar', 'defaults to level info')

  // test url and type
  run({ url: '/home', type: 'static' }, '[0000] /home (static)')
  run({ url: '/home', type: 'static', name: 'app' }, '[0000] /home (static) (app)')

  // // test url and type + elapsed
  const expected1 = '[0000] infinity /home (static) (app)'
  run({ url: '/home', type: 'static', elapsed: 'infinity', name: 'app' }, expected1)

  const expected2 = '[0000] infinity /home (static) (app)'
  run({ url: '/home?blah=24#foo', type: 'static', elapsed: 'infinity', name: 'app' }, expected2, 'strips hash and query')

  const expected3 = '[0000] infinity http://localhost:9966/home (static) (app)'
  run({ url: 'http://localhost:9966/home?blah=24#foo', type: 'static', elapsed: 'infinity', name: 'app' }, expected3, 'does not strip host or port')

  const expected4 = '[0000] infinity http://localhost:9966/ (static) (app)'
  run({ url: 'http://localhost:9966/', type: 'static', elapsed: 'infinity', name: 'app' }, expected4, 'does not strip host or port')

  // level only appears on message
  // also, default name is hidden
  run({
    name: 'myApp',
    message: 'hello world',
    level: 'info'
  }, '[0000] info  hello world', 'test level + message', { name: 'myApp' })

  // test everything
  run({
    name: 'myApp',
    url: '/home',
    type: 'generated',
    statusCode: '200',
    contentLength: '12b',
    elapsed: '24ms'
  }, '[0000] 24ms         12B 200 /home (generated)', 'test all fields', { name: 'myApp' })
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
