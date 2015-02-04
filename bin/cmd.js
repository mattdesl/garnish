#!/usr/bin/env node
var garnish = require('../')

process.stdin
    .pipe(garnish())
    .pipe(process.stdout)