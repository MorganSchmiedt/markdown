// @ts-check
import test from 'node:test'
import assert from 'node:assert'
import { parser } from '../test-lib.js'
/** @import { ParserOptions } from '../../src/markdown.js' */


const Text = parser.Text

test('Text with normal text', () => {
  const element = new Text('some text')

  assert.strictEqual(element.textContent, 'some text', 'textContent is valid')
  assert.strictEqual(element.outerHTML, 'some text', 'outerHTML is valid')
})

test('Text with forbidden char', () => {
  const element = new Text('&<>')

  assert.strictEqual(element.textContent, '&<>', 'textContent is valid')
  assert.strictEqual(element.outerHTML, '&amp;&lt;&gt;', 'outerHTML is valid')
})

test('Text with number', () => {
  const element = new Text(1000)

  assert.strictEqual(element.textContent, '1000', 'textContent is valid')
  assert.strictEqual(element.outerHTML, '1000', 'outerHTML is valid')
})
