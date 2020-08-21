'use strict'
/* eslint-disable no-console */

const {
  parse,
} = require('./test-lib.js')

const input = `
  ...Markdown texte here...`

const element = parse(input, {
  // Parser options here
})

console.log(element.innerHTML)
