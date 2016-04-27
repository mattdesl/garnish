var test = require('tape')

var through = require('through2')
var strip = require('strip-ansi')
var xtend = require('xtend')
var garnish = require('../')

// does not test colors, just ensures messages are not lost
test('should handle streams', function (t) {
  t.plan(4)
  run(t, null, 'null')
  run(t, 0, '0')
  run(t, 2, '2')
  run(t, false, 'false')
})

// test non stylables
test('should handle non stylables', function (t) {
  t.plan(6)
  run(t, 'some string', JSON.stringify('some string'), 'handles strings')
  run(t, { foo: 'bar' }, JSON.stringify({ foo: 'bar' }), 'handles strings')
  run(t, '1', JSON.stringify('1'))

  t.test('should handle ignore levels', function (t) {
    t.plan(1)
    var input = { name: 'app', level: 'warn' }
    var msg = 'should ignore level'
    var opt = { level: 'error' }
    ignored(t, input, msg, opt)
  })

  var input1 = { name: 'app', message: 'foobar', level: 'debug' }
  var expected1 = '[0000] debug foobar (app)'
  run(t, input1, expected1, 'should not ignore default debug')

  var input0 = { name: 'app', level: 'debug' }
  var expected0 = '[0000] (app)'
  run(t, input0, expected0, 'prints with debug level')
})

test('test url and type', function (t) {
  t.plan(2)
  var input0 = { url: '/home', type: 'static' }
  run(t, input0, '[0000] /home (static)')

  var input1 = { url: '/home', type: 'static', name: 'app' }
  run(t, input1, '[0000] /home (static) (app)')
})

test('test url and type + elapsed', function (t) {
  t.plan(4)
  var base = { type: 'static', elapsed: 'infinity', name: 'app' }

  var input1 = xtend(base, { url: '/home' })
  var expected1 = '[0000] infinity /home (static) (app)'
  run(t, input1, expected1)

  var input2 = xtend(base, { url: '/home?blah=24#foo' })
  var expected2 = '[0000] infinity /home (static) (app)'
  run(t, input2, expected2, 'strips hash and query')

  var input3 = xtend(base, { url: 'http://localhost:9966/home?blah=24#foo' })
  var expected3 = '[0000] infinity http://localhost:9966/home (static) (app)'
  run(t, input3, expected3, 'does not strip host or port')

  var input4 = xtend(base, { url: 'http://localhost:9966/' })
  var expected4 = '[0000] infinity http://localhost:9966/ (static) (app)'
  run(t, input4, expected4, 'does not strip host or port')
})

test('levels appear on msg and default name is hidden', function (t) {
  t.plan(2)

  var input0 = { name: 'myApp', message: 'hello world', level: 'info' }
  var expected0 = '[0000] info  hello world'
  var opts0 = { name: 'myApp' }
  run(t, input0, expected0, 'test level + message', opts0)

  // test everything
  var input1 = {
    name: 'myApp',
    url: '/home',
    type: 'generated',
    statusCode: '200',
    contentLength: '12b',
    elapsed: '24ms'
  }
  var expected1 = '[0000] 24ms         12B 200 /home (generated)'
  var opts1 = { name: 'myApp' }
  run(t, input1, expected1, 'test all fields', opts1)
})

function ignored (t, input, msg, opt) {
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

function run (t, input, expected, msg, opt) {
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
