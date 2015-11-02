#!/usr/bin/env node
var stdout = require('stdout-stream')
var garnish = require('../')
var argv = require('minimist')(process.argv.slice(2))

argv.level = argv.level || argv.l
argv.bunyan = argv.bunyan || argv.b
process.stdin.resume()
process.stdin.setEncoding('utf8')
process.stdin
  .pipe(garnish(argv))
  .pipe(stdout)
