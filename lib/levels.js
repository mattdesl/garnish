var colors = {
  debug: 'cyan',
  info: 'blue',
  warn: 'yellow',
  error: 'red'
}

var padLen = Object.keys(colors).reduce(function (prev, a) {
  return Math.max(prev, a.length)
}, 0)

var levels = Object.keys(colors)

// whether the message level is valid for the given logger
module.exports.valid = function (logLevel, msgLevel) {
  var levelIdx = levels.indexOf(logLevel)
  var msgIdx = levels.indexOf(msgLevel)
  if (msgIdx === -1 || levelIdx === -1) return true
  return msgIdx >= levelIdx
}

// stringify with padding
module.exports.stringify = function (level) {
  return pad(level, padLen)
}

// get a level's default color
module.exports.color = function (level) {
  return colors[level]
}

function pad (str, len) {
  str = String(str)
  while (str.length < len) {
    str = ' ' + str
  }
  return str
}
