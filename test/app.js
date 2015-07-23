// to see how it looks, run one of:
//    npm run demo
//    npm run demo -- --verbose

console.log('Start!')
console.log(JSON.stringify({ name: 'app', url: 'foo/bar', elapsed: '32ms', type: 'bundle' }))
console.log(JSON.stringify({ name: 'app', url: 'foo/bar', type: 'bundle' }))
console.log({})
console.log(null)
console.log(undefined)
console.log(false)
console.log('fancy %d format %s', 25, 'foo')
console.log(function () {})
console.log(function Klass () {})
console.log()
console.log('message')
console.log(JSON.stringify({ level: 'warn', name: 'app', message: 'msg' }))
console.log(JSON.stringify({ level: 'debug', name: 'app', message: 'msg' }))
