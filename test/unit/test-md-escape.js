// @ts-check

import test from 'node:test'
import assert from 'node:assert'
import { parse, parseToHtml } from '../test-lib.js'
/** @import { ParserOptions } from '../../src/markdown.js' */


test('Escape characters are removed in parsed element', (t, done) => {
  const input = '- Some \\*text*'
  /** @type {ParserOptions} */
  const opt = {
    onUnorderedList: ulNode => {
      const liNode = ulNode.firstChild

      // @ts-ignore
      t.assert.strictEqual(liNode.textContent, 'Some *text*', 'textContent in callback is valid')
    },
  }

  t.plan(1)
  parse(input, opt)
  done()
})

test('Escape "*"', () => {
  const input = 'Some \\*text*'
  const output = '<p>Some *text*</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Escape "["', () => {
  const input = 'This is a \\[link](https://example.com)'
  const output = '<p>This is a [link](https://example.com)</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Escape "`"', () => {
  const input = 'A \\`code` text'
  const output = '<p>A `code` text</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Escape "`" in multiline codes', () => {
  const input = '```\nA \\` backquote\n```'
  const output = '<pre><code>A ` backquote</code></pre>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Escape "!"', () => {
  const input = '\\![link](https://example.com)'
  const output = '<p>!<a href="https://example.com">link</a></p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Escape "#"', () => {
  const input = '\\# Title escaped'
  const output = '<p># Title escaped</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Escape "~"', () => {
  const input = 'A \\~~strikethrough~~ text'
  const output = '<p>A ~~strikethrough~~ text</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Escape "^"', () => {
  const input = 'A \\^superscript text'
  const output = '<p>A ^superscript text</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Escape "\\"', () => {
  const input = 'A backslash: \\'
  const output = '<p>A backslash: \\</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Keep escaped char if not followed by a special char', () => {
  const input = 'Useless \\, backslash'
  const output = '<p>Useless \\, backslash</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})
