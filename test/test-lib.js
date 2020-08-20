'use strict'

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

const inlineHtml = text =>
  text[0]
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('')

const parser = require('../src/markdown.js')

const parse = (input, opt) =>
  parser.parse(trimInput(input), opt)

const parseToHtml = (input, opt) =>
  parse(input, opt).innerHTML

const test = require('tape')

module.exports = {
  parser,
  parse,
  parseToHtml,
  inlineHtml,
  test,
}
