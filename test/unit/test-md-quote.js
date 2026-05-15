// @ts-check
import test from 'node:test'
import assert from 'node:assert'
import { parse, parseToHtml, inlineHtml } from '../test-lib.js'
/** @import { ParserOptions } from '../../src/markdown.js' */

test('Quote', () => {
  const input = `
    > Blockquote line 1
    > Blockquote line 2`
  const output = inlineHtml`
    <blockquote>
      <p>
        Blockquote line 1
        <br>
        Blockquote line 2
      </p>
    </blockquote>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Quote with two lines', () => {
  const input = '> Blockquote line 1\n> \n> Blockquote line 2'
  const output = inlineHtml`
    <blockquote>
      <p>
        Blockquote line 1
      </p>
      <p>
        Blockquote line 2
      </p>
    </blockquote>`

  assert.strictEqual(parse(input).innerHTML, output, 'Output is valid')
})

test('Quote with text before and after', () => {
  const input = `
    Some text
    > Blockquote line 1
    > Blockquote line 2
    Some more text`
  const output = inlineHtml`
    <p>Some text</p>
    <blockquote>
      <p>
        Blockquote line 1
        <br>
        Blockquote line 2
      </p>
    </blockquote>
    <p>Some more text</p>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Quote with list before and after', () => {
  const input = `
    - List 1
    > Blockquote line 1
    > Blockquote line 2
    - List 2`
  const output = inlineHtml`
    <ul>
      <li>List 1</li>
    </ul>
    <blockquote>
      <p>
        Blockquote line 1
        <br>
        Blockquote line 2
      </p>
    </blockquote>
    <ul>
      <li>List 2</li>
    </ul>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Quote with callback', (t, done) => {
  const input = `
    > Blockquote line 1
    > Blockquote line 2`

  /** @type {ParserOptions} */
  const opt = {
    onQuote: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'BLOCKQUOTE', 'Tagname is valid')
      assert.notEqual(node.children, null, 'Node has child(en)')
      assert.strictEqual(node.children.length, 1, 'Blockquote has 1 children')
      done()
    },
  }

  parse(input, opt)
})

test('Quote with allowQuote flag to false', () => {
  const input = `
    > Blockquote line 1
    > Blockquote line 2`
  const output = inlineHtml`
    <p>&gt; Blockquote line 1<br>&gt; Blockquote line 2</p>`
  const opt = {
    allowQuote: false,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})
