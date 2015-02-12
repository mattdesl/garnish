#!/usr/bin/env node
var garnish = require('../')
var argv = require('minimist')(process.argv.slice(2))

argv.level = argv.level || argv.l
process.stdin
    .pipe(garnish(argv))
    .pipe(process.stdout)