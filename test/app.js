// to see how it looks, run one of:
//    npm run demo
//    npm run demo -- --verbose

console.log('Start!')
console.log(JSON.stringify({ name: 'app', url: '/foo/bar', elapsed: '32ms', type: 'bundle' }))
console.log(JSON.stringify({ name: 'app', url: '/foo/bar', type: 'bundle' }))
console.log(JSON.stringify({
  name: 'app', url: '/foo/bar', type: 'static',
  statusCode: 404, contentLength: 1220
}))
console.log(JSON.stringify({
  name: 'app:12345678', url: '/foo/bar', type: 'bundle',
  elapsed: '325ms', message: 'hello world',
  colors: {
    message: 'blue',
    elapsed: 'yellow',
    name: 'green',
    level: 'gray',
    type: 'blue'
  }
}))
console.log({})
var obj = new Buffer([])
console.log(obj)
console.log({ foobar: 'blah' })
process.stdout.write(String({ foo: 'foo' }) + '\n')
process.stdout.write(Buffer('somebuffer') + '\n')
console.log(null)
console.log(undefined)
console.log(false)
console.log(true)
console.log('fancy %d format %s', 25, 'foo')
console.log(function () {})
console.log(function Klass () {})
console.log()
console.log(JSON.stringify({ name: 'foo', level: 'info' }))
console.log('message')
console.log(JSON.stringify({ level: 'warn', name: 'app', message: 'msg' }))
console.log(JSON.stringify({ level: 'debug', name: 'app', message: 'msg' }))
