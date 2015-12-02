var stack = []
var garnish = require('../')

log({ message: 'Server connected to', url: 'http://localhost:9966/' })
log({ message: 'LiveReload running on port 35729' })
log({ message: 'From another app', name: 'my-app' })
log({ message: 'No configuration found', level: 'warn' })
log({ message: 'Got some stats', level: 'debug' })
log({ message: 'Could not find foo.bar', level: 'error' })
log({ elapsed: 4000, contentLength: 20523, url: '/static/bundle.js', type: 'bundle' })
log({ method: 'GET', statusCode: 200, elapsed: 1299, url: '/', contentLength: 1500200, type: 'static' })
stack.push('some error')
log({ method: 'GET', statusCode: 200, elapsed: 13298, url: '/static.js', contentLength: 1500200 })
log({ level: 'warn', method: 'DELETE', statusCode: 200, elapsed: 13298, url: '/bundle.js', contentLength: 1500200, type: 'generated' })
stack.push(JSON.stringify({ foo: 'bar' }))
log({ method: 'POST', statusCode: 200, elapsed: 14, url: '/static.js', contentLength: 14020 })
log({ elapsed: 4000, contentLength: 20523, url: '/static/bundle.js', type: 'bundle' })
log({ elapsed: 4000, statusCode: 300, message: 'foo bar some message', level: 'warn', contentLength: 20523, url: '/static/bundle.js', type: 'bundle' })

print()

function log (obj) {
  obj.time = new Date()
  if (!obj.name) obj.name = 'budo'
  if (!obj.level) obj.level = 'info'
  stack.push(JSON.stringify(obj))
}

function print () {
  var pretty = garnish({ name: 'budo' })
  pretty.pipe(process.stdout)

  var timer = setInterval(function () {
    if (stack.length > 0) {
      pretty.write(stack.shift() + '\n')
    } else {
      clearInterval(timer)
    }
  }, 50)
}
