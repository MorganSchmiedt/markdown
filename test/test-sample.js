'use strict'
/* eslint-disable no-console */

const {
  parse,
} = require('./test-lib.js')

const input = `
  - Item 1
    - Item 1.1
      Item 1.1 suite
    - Item 1.2`

const element = parse(input, {
  // Parser options here
})

console.log(element.innerHTML)
