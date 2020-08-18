'use strict'
/* eslint-env node, es6 */
/* eslint-disable no-console */

const parser = require('../src/markdown.js')

const trimInput = param => {
  const text = typeof param === 'string'
    ? param
    : param[0]

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

const parse = (input, opt) => parser.parse(trimInput(input), opt)

const input = `
  // Some markdown
  // ...`

const element = parse(input, {
  // Some options
})

console.log(element.innerHTML)
