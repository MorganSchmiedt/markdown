// @ts-check

import parser from '../src/markdown.js'

/**
 * @param {string} text
 * @return {string}
 */
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

/**
 * @param {string|TemplateStringsArray} text
 * @return {string}
 */
const inlineHtml = text =>
  text[0]
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('')

/**
 * @param {string} input
 * @param {import('../src/markdown.js').ParserOptions} [opt]
 */
const parse = (input, opt) =>
  parser.parse(trimInput(input), opt)

/**
 * @param {string} input
 * @param {import('../src/markdown.js').ParserOptions} [opt]
 */
const parseToHtml = (input, opt) =>
  parse(input, opt).innerHTML

export {
  parser,
  parse,
  parseToHtml,
  inlineHtml,
}
