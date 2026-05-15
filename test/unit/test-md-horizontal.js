// @ts-check
import test from 'node:test'
import assert from 'node:assert'
import { parse, parseToHtml, inlineHtml } from '../test-lib.js'
/** @import { ParserOptions } from '../../src/markdown.js' */

test('Horizontal line', () => {
  const input = `
    Pre line text

    ---

    Post line text`

  const output = inlineHtml`
    <p>Pre line text</p>
    <hr>
    <p>Post line text</p>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Horizontal line without pre-newline', () => {
  const input = `
    Pre line text
    ---

    Post line text`

  const output = inlineHtml`
    <p>Pre line text<br>---</p>
    <p>Post line text</p>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Horizontal line without pre-newline', () => {
  const input = `
    Pre line text

    ---
    Post line text`

  const output = inlineHtml`
    <p>Pre line text</p>
    <p>---<br>Post line text</p>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Horizontal line with list before/after', () => {
  const input = `
    - List 1

    ---

    - List 2`

  const output = inlineHtml`
    <ul>
      <li>List 1</li>
    </ul>
    <hr>
    <ul>
      <li>List 2</li>
    </ul>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Horizontal line with callback', (t, done) => {
  const input = `
    Pre line text

    ---

    Post line text`

  /** @type {ParserOptions} */
  const opt = {
    onHorizontalLine: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'HR', 'Tagname is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Horizontal line with allowHorizontalLine flag to false', () => {
  const input = `
    Pre line text

    ---

    Post line text`

  const output = inlineHtml`
    <p>Pre line text</p>
    <p>---</p>
    <p>Post line text</p>`
  const opt = {
    allowHorizontalLine: false,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})
