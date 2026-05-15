// @ts-check
import test from 'node:test'
import assert from 'node:assert'
import { parse, parseToHtml, inlineHtml } from '../test-lib.js'
/** @import { ParserOptions } from '../../src/markdown.js' */

test('Header', () => {
  const input = '# Title 1'
  const output = '<h1>Title 1</h1>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Header without leading space', () => {
  const input = '#Title 1'
  const output = '<p>#Title 1</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Header with callback', (t, done) => {
  const input = '# Title 1'
  /** @type {ParserOptions} */
  const opt = {
    onHeader: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'H1', 'Tagname is valid')
      assert.strictEqual(node.textContent, 'Title 1', 'Content is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Header lvl 2', () => {
  const input = '## Sub-title 2'
  const output = '<h2>Sub-title 2</h2>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Header lvl 2 without leading space', () => {
  const input = '##Sub-title 2'
  const output = '<p>##Sub-title 2</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Header lvl 2 with callback', () => {
  const input = '## Sub-title 2'
  /** @type {ParserOptions} */
  const opt = {
    onHeader: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'H2', 'Tagname is valid')
      assert.strictEqual(node.textContent, 'Sub-title 2', 'Content is valid')
    },
  }

  parse(input, opt)
})

test('Header lvl 3', () => {
  const input = '### Sub sub title 3'
  const output = '<h3>Sub sub title 3</h3>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Header lvl 3 without leading space', () => {
  const input = '###Sub sub title 3'
  const output = '<p>###Sub sub title 3</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Header lvl 3 with callback', (t, done) => {
  const input = '### Sub sub title 3'
  /** @type {ParserOptions} */
  const opt = {
    onHeader: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'H3', 'Tagname is valid')
      assert.strictEqual(node.textContent, 'Sub sub title 3', 'Content is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Headers (allowHeaderFormat on)', () => {
  const input = '# Title 1\n## Title 2\n### Test 3'
  const opt = {
    allowHeaderFormat: true,
  }

  const output = '<h1>Title 1</h1><h2>Title 2</h2><h3>Test 3</h3>'

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Header with bold text (allowHeaderFormat on)', () => {
  const input = '# A **bold** text'
  const opt = {
    allowHeaderFormat: true,
  }

  const output = '<h1>A <strong>bold</strong> text</h1>'

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Header with link (allowHeaderFormat on)', () => {
  const input = '# A [link](https://example.com)'
  const opt = {
    allowHeaderFormat: true,
  }

  const output = '<h1>A <a href="https://example.com">link</a></h1>'

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Header with allowHeader flag to false', () => {
  const input = `
    # Title
    ## Sub-title
    ### Sub-sub-title`
  const output = inlineHtml`
    <p># Title<br>## Sub-title<br>### Sub-sub-title</p>`
  const opt = {
    allowHeader: false,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Header with maxHeaderLevel to 2', () => {
  const input = `
    # Title
    ## Sub-title
    ### Sub-sub-title`
  const output = inlineHtml`
    <h1>Title</h1>
    <h2>Sub-title</h2>
    <p>### Sub-sub-title</p>`
  const opt = {
    maxHeader: 2,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Header with item before and after', () => {
  const input = `
    1. List before
    ## Header
    1. List after`
  const output = inlineHtml`
    <ol>
      <li>List before</li>
    </ol>
    <h2>Header</h2>
    <ol>
      <li>List after</li>
    </ol>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})
