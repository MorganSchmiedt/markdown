// @ts-check
import test from 'node:test'
import assert from 'node:assert'
import { parse, parseToHtml } from '../test-lib.js'
/** @import { ParserOptions } from '../../src/markdown.js' */

test('Link', () => {
  const input = 'This is a [link](https://example.com)'
  const output = '<p>This is a <a href="https://example.com">link</a></p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Link with brackets on the same line', () => {
  const input = 'some [...] word [link](example.com)'
  const output = '<p>some [...] word <a href="example.com">link</a></p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Link with brackets on the same line', () => {
  const input = 'some [link](example.com) (...)'
  const output = '<p>some <a href="example.com">link</a> (...)</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Link with a closing bracket inside', () => {
  const input = 'see [[1\\]](#ref1) (...)'
  const output = '<p>see <a href="#ref1">[1]</a> (...)</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Link with callback', (t, done) => {
  const input = 'This is a [link](https://example.com)'
  /** @type {ParserOptions} */
  const opt = {
    onLink: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'A', 'Tagname is valid')
      assert.strictEqual(node.getAttribute('href'), 'https://example.com', 'href attribute is valid')
      assert.strictEqual(node.textContent, 'link', 'Content is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Link in italic', () => {
  const input = 'This is *a [link](https://example.com) in italic*'
  const output = '<p>This is <em>a <a href="https://example.com">link</a> in italic</em></p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Link with allowLink flag to false', () => {
  const input = 'This is a [link](https://example.com)'
  const output = '<p>This is a [link](https://example.com)</p>'
  const opt = {
    allowLink: false,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})
