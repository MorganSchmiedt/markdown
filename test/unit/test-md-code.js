'use strict'
/* eslint-disable prefer-arrow-callback */

const {
  parse,
  parseToHtml,
  inlineHtml,
  test,
} = require('../test-lib.js')

test('Code', function (t) {
  const input = 'A `code` text'
  const output = '<p>A <code>code</code> text</p>'

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Code with callback', function (t) {
  const input = 'A `keyword` text'

  const opt = {
    onCode: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'CODE', 'Tagname is valid')
      t.equal(node.textContent, 'keyword', 'Tagname is valid')
      t.end()
    },
  }

  parse(input, opt)
})

test('Code with allowCode flag to false', function (t) {
  const input = 'A `code` text'
  const output = '<p>A `code` text</p>'
  const opt = {
    allowCode: false,
  }

  t.equal(parseToHtml(input, opt), output, 'Output is valid')
  t.end()
})

test('Multiline code', function (t) {
  const input = `
    \`\`\`
    Multiline code 1
    Multiline code 2
    \`\`\``
  const output = '<pre><code>Multiline code 1\nMultiline code 2</code></pre>'

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Multiline code with language name', function (t) {
  const input = `
    Some text before
    \`\`\`javascript
    Multiline code 1
    Multiline code 2
    \`\`\`
    Some more text`
  const output = '<p>Some text before</p><pre><code>Multiline code 1\nMultiline code 2</code></pre><p>Some more text</p>'

  t.equal(parse(input).innerHTML, output, 'Output is valid')
  t.end()
})

test('Multiline code with callback', function (t) {
  const input = `
    This is some multicode with language
    name:
    \`\`\`javascript
    Multiline code 1
    Multiline code 2
    \`\`\`
    Some more text`

  const opt = {
    onMultilineCode: (node, language) => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'PRE', 'Tagname is valid')
      t.equal(language, 'javascript', 'language is valid')
      t.end()
    },
  }

  parse(input, opt)
})

test('Multiline Code with allowMultilineCode flag to false', function (t) {
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

  t.equal(parseToHtml(input, opt), output, 'Output is valid')
  t.end()
})
