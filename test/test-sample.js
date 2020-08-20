'use strict'
/* eslint-disable no-console */

const {
  parse,
} = require('./test-lib.js')

const input = `
  Markdown text here`

const element = parse(input, {
  // Parser options here
})

console.log(element.innerHTML)
