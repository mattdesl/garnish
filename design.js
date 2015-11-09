var color = require('chalk')

var tick = 0
console.log(color.dim(time()), color.dim('info '), 'Server connted to', color.bold('http://localhost:9966/'))
console.log(color.dim(time()), color.dim('info '), 'LiveReload running on port 35729')
console.log(color.dim(time()), color.dim('info '), 'This is a message from a different module', color.magenta('(my-app)'))
console.log(color.dim(time()), color.yellow('warn '), 'No configuration found; using defaults')
console.log(color.dim(time()), color.red('error'), 'Could not find foo.bar')
console.log(color.dim(time()), color.dim('            '), color.yellow('1402ms'), color.dim('  1.4MB'), color.bold('/static/js.js'), color.dim('(bundle)'))
console.log(color.dim(time()), color.dim('← GET                      '), color.bold('/'))
console.log(color.dim(time()), color.dim('→ GET '), color.green(' 200   '), color.dim('14ms   '), color.dim('498B'), color.bold('/'), color.dim('(generated)'))
console.log(color.dim(time()), color.dim('← POST                     '), color.bold('/blah.png'))
console.log(color.dim(time()), color.dim('→ POST'), color.green(' 200    '), color.dim('1ms   '), color.dim(' 10B'), color.bold('/blah.png'))
console.log(color.dim(time()), color.dim('← GET                      '), color.bold('/oh-no.json'))
console.log(color.dim(time()), color.dim('→ GET '), color.red(' 500    '), color.dim('1ms   '), color.dim('  1B'), color.bold('/oh-no.json'))
console.log(color.dim(time()), color.dim('             '), color.dim('102ms'), color.dim('  1.4MB'), color.bold('/static/js.js'), color.dim('(bundle)'))

// →
// ←

function time () {
  var t = (tick++)
  if (t >= 10) return '[00' + t + ']'
  return '[000' + t + ']'
}

// 0001 Server connected to http://localhost:9966/
// 0001 LiveReload running on port 31424
// 0001 bundled in  1.4s     1.4MB /bundle.js
// 0002 GET   200   14ms      498B /index.html (generated)
// 0002 GET   200   14ms      498B /favicon.ico (generated)
// 0003 POST  500    1ms       10B /oh-no.json
