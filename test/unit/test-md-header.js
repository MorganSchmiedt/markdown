'use strict'
/* eslint-disable prefer-arrow-callback */

const {
  parse,
  parseToHtml,
  inlineHtml,
  test,
} = require('../test-lib.js')

test('Header', function (t) {
  const input = '# Title 1'
  const output = '<h1>Title 1</h1>'

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Header without leading space', function (t) {
  const input = '#Title 1'
  const output = '<p>#Title 1</p>'

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Header with callback', function (t) {
  const input = '# Title 1'
  const opt = {
    onHeader: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'H1', 'Tagname is valid')
      t.equal(node.textContent, 'Title 1', 'Content is valid')
      t.end()
    },
  }

  parse(input, opt)
})

test('Header lvl 2', function (t) {
  const input = '## Sub-title 2'
  const output = '<h2>Sub-title 2</h2>'

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Header lvl 2 without leading space', function (t) {
  const input = '##Sub-title 2'
  const output = '<p>##Sub-title 2</p>'

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Header lvl 2 with callback', function (t) {
  const input = '## Sub-title 2'
  const opt = {
    onHeader: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'H2', 'Tagname is valid')
      t.equal(node.textContent, 'Sub-title 2', 'Content is valid')
      t.end()
    },
  }

  parse(input, opt)
})

test('Header lvl 3', function (t) {
  const input = '### Sub sub title 3'
  const output = '<h3>Sub sub title 3</h3>'

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Header lvl 3 without leading space', function (t) {
  const input = '###Sub sub title 3'
  const output = '<p>###Sub sub title 3</p>'

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Header lvl 3 with callback', function (t) {
  const input = '### Sub sub title 3'
  const opt = {
    onHeader: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'H3', 'Tagname is valid')
      t.equal(node.textContent, 'Sub sub title 3', 'Content is valid')
      t.end()
    },
  }

  parse(input, opt)
})

test('Header with bold text', function (t) {
  const input = '# A **bold** text'
  const opt = {
    allowHeaderFormat: true,
  }

  const output = '<h1>A <strong>bold</strong> text</h1>'

  t.equal(parseToHtml(input, opt), output, 'Output is valid')
  t.end()
})

test('Header with link', function (t) {
  const input = '# A [link](https://example.com)'
  const opt = {
    allowHeaderFormat: true,
  }

  const output = '<h1>A <a href="https://example.com">link</a></h1>'

  t.equal(parseToHtml(input, opt), output, 'Output is valid')
  t.end()
})

test('Header with allowHeader flag to false', function (t) {
  const input = `
    # Title
    ## Sub-title
    ### Sub-sub-title`
  const output = inlineHtml`
    <p># Title<br>## Sub-title<br>### Sub-sub-title</p>`
  const opt = {
    allowHeader: false,
  }

  t.equal(parseToHtml(input, opt), output, 'Output is valid')
  t.end()
})

test('Header with maxHeaderLevel to 2', function (t) {
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

  t.equal(parseToHtml(input, opt), output, 'Output is valid')
  t.end()
})

test('Header with item before and after', function (t) {
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

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})
