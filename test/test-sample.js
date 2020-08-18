'use strict'
/* eslint-env node, es6 */
/* eslint-disable no-console */

const parser = require('../src/markdown.js')
const parse = (input, opt) => parser.parse(input, opt)

const trimInput = text => {
  if (text[0] !== '\n') {
    return text
  }

  const md = text.substr(1)
  const trimLeftCount = md.length - md.trimStart().length

  return md
    .split('\n')
    .map(line => line.substr(trimLeftCount).trimEnd())
    .join('\n')
}

const input = trimInput`
  // Some markdown
  // ...`

const element = parse(input, {
  // Some options
})

console.log(element.innerHTML)
