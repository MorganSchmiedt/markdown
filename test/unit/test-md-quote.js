'use strict'
/* eslint-disable prefer-arrow-callback */

const {
  parse,
  parseToHtml,
  inlineHtml,
  test,
} = require('../test-lib.js')

test('Quote', function (t) {
  const input = `
    > Blockquote line 1
    > Blockquote line2`
  const output = inlineHtml`
    <blockquote>
      <p>Blockquote line 1</p>
      <p>Blockquote line2</p>
    </blockquote>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Quote with callback', function (t) {
  const input = `
    > Blockquote line 1
    > Blockquote line2`
  const opt = {
    onQuote: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'BLOCKQUOTE', 'Tagname is valid')
      t.notEqual(node.children, null, 'Node has child(en)')
      t.equal(node.children.length, 2, 'Node has 2 children')
      t.end()
    },
  }

  parse(input, opt)
})

test('Quote with allowQuote flag to false', function (t) {
  const input = `
    > Blockquote line 1
    > Blockquote line 2`
  const output = inlineHtml`
    <p>&gt; Blockquote line 1<br>&gt; Blockquote line 2</p>`
  const opt = {
    allowQuote: false,
  }

  t.equal(parseToHtml(input, opt), output, 'Output is valid')
  t.end()
})