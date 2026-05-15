// @ts-check
import test from 'node:test'
import assert from 'node:assert'
import { parse, parseToHtml, inlineHtml } from '../test-lib.js'
/** @import { ParserOptions } from '../../src/markdown.js' */


test('Code', () => {
  const input = 'A `code` text'
  const output = '<p>A <code>code</code> text</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Code with callback', (t, done) => {
  const input = 'A `keyword` text'

  /** @type {ParserOptions} */
  const opt = {
    onCode: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'CODE', 'Tagname is valid')
      assert.strictEqual(node.textContent, 'keyword', 'Tagname is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Code with allowCode flag to false', () => {
  const input = 'A `code` text'
  const output = '<p>A `code` text</p>'
  const opt = {
    allowCode: false,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Multiline code', () => {
  const input = `
    \`\`\`
    Multiline code 1
    Multiline code 2
    \`\`\``
  const output = '<pre><code>Multiline code 1\nMultiline code 2</code></pre>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Multiline code with language name', () => {
  const input = `
    Some text before
    \`\`\`javascript
    Multiline code 1
    Multiline code 2
    \`\`\`
    Some more text`
  const output = '<p>Some text before</p><pre><code>Multiline code 1\nMultiline code 2</code></pre><p>Some more text</p>'

  assert.strictEqual(parse(input).innerHTML, output, 'Output is valid')
})

test('Multiline code twice', () => {
  const input = `
    Once:
    \`\`\`
    Multiline code 1
    \`\`\`
    Twice:
    \`\`\`
    Multiline code 2
    \`\`\``
  const output = inlineHtml`
    <p>Once:</p>
    <pre><code>Multiline code 1</code></pre>
    <p>Twice:</p>
    <pre><code>Multiline code 2</code></pre>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Multiline code with leading space', () => {
  const input = `
    Once:
    \`\`\`
      Line 1.1
      Line 1.2
    \`\`\`
    Twice:
    \`\`\`
      Line 2.1
      Line 2.2
    \`\`\``
  const output = '<p>Once:</p><pre><code>  Line 1.1\n  Line 1.2</code></pre><p>Twice:</p><pre><code>  Line 2.1\n  Line 2.2</code></pre>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Multiline code without EOF before end of syntax', () => {
  const input = `
    \`\`\`
    Multiline code 1
    Multiline code 2\`\`\``
  const output = inlineHtml`
    <p>
      \`\`\`
      <br>
      Multiline code 1
      <br>Multiline code 2\`\`\`
    </p>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Multiline code with callback', (t, done) => {
  const input = `
    This is some multicode with language
    name:
    \`\`\`javascript
    Multiline code 1
    Multiline code 2
    \`\`\`
    Some more text`

  /** @type {ParserOptions} */
  const opt = {
    onMultilineCode: (node, language) => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'PRE', 'Tagname is valid')
      assert.strictEqual(language, 'javascript', 'language is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Multiline Code with allowMultilineCode flag to false', () => {
  const input = `
    \`\`\`javascript
    Multiline code 1
    Multiline code 2
    \`\`\``
  const output = inlineHtml`
    <p>\`\`\`javascript<br>Multiline code 1<br>Multiline code 2<br>\`\`\`</p>`
  const opt = {
    allowMultilineCode: false,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})
