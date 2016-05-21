#!/usr/bin/env node

const fs = require('fs')
const program = require('commander')
    .version(require(__dirname + '/../../package.json').version)

const subcommands = {
    'bmp'        : 'version bumping',
    'generate'   : 'generate circle.yml',
    'update-npm' : 'update node modules',
    'release'    : 'release current version',
}

Object.keys(subcommands)
    .filter(function(sub) { return fs.existsSync(__dirname + '/nca-' + sub + '.js')})
    .forEach(function(sub) { program.command(sub, subcommands[sub]) })

program.parse(process.argv)