'use strict'
/* eslint-env node, es6 */
/* eslint-disable */

const parser = require('../src/markdown.js')
const parse = (input, opt) => parser.parse(input, opt).toHtml()

const trimI = text =>
  text[0]
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')

const input = trimI`
  // Some markdown
  // ...`

const html = parse(input, {
  // Some options
})

console.log(html)