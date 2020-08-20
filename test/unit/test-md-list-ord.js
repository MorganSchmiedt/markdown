'use strict'
/* eslint-disable prefer-arrow-callback */

const {
  parse,
  parseToHtml,
  inlineHtml,
  test,
} = require('../test-lib.js')

test('Ordered List', function (t) {
  const input = `
    1. First list number
    2. Second list number
    3. Third list number`
  const output = inlineHtml`
    <ol>
      <li>First list number</li>
      <li>Second list number</li>
      <li>Third list number</li>
    </ol>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Ordered List with newlines', function (t) {
  const input = `
    1. First item
       Following first item
    2. Second item
       Following second item`
  const output = inlineHtml`
    <ol>
      <li>First item<br>Following first item</li>
      <li>Second item<br>Following second item</li>
    </ol>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Ordered List with newlines (> 3 spaces)', function (t) {
  const input = `
    1. First item
        Following first item
    2. Second item
         Following second item`
  const output = inlineHtml`
    <ol>
      <li>First item<br>Following first item</li>
      <li>Second item<br>Following second item</li>
    </ol>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Ordered List with newlines (2 spaces only)', function (t) {
  const input = `
    1. First item
      Following first item`
  const output = inlineHtml`
    <ol>
      <li>First item</li>
    </ol>
    <p>  Following first item</p>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Ordered List with callback not at EOF', function (t) {
  const input = `
    Some text
    1. List 1, Item 1
    2. List 1, Item 2
    Not at the end of the file`

  const opt = {
    onOrderedList: (node, level) => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'OL', 'Tagname is valid')
      t.equal(node.children.length, 2, 'Number of children is valid')
      t.equal(level, 1, 'Level is valid')
    },
  }

  t.plan(4)
  parse(input, opt)
})

test('Ordered List with callback at EOF', function (t) {
  const input = `
    Some text
    1. List 1, Item 1
    2. List 1, Item 2 at the end of the file`

  const opt = {
    onOrderedList: (node, level) => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'OL', 'Tagname is valid')
      t.equal(node.children.length, 2, 'Number of children is valid')
      t.equal(level, 1, 'Level is valid')
    },
  }

  t.plan(4)
  parse(input, opt)
})

test('Ordered List with newline in first item and callback', function (t) {
  const input = `
    Some text
    1. List 1, Item 1
       Following Item 1
    2. List 1, Item 2`

  const opt = {
    onOrderedList: (node, level) => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'OL', 'Tagname is valid')
      t.equal(node.children.length, 2, 'Number of children is valid')
      t.equal(level, 1, 'Level is valid')
      t.equal(node.firstChild.textContent, 'List 1, Item 1Following Item 1', 'TextContent is valid')
    },
  }

  t.plan(5)
  parse(input, opt)
})

test('Ordered List with newline in last item and callback', function (t) {
  const input = `
    Some text
    1. List 1, Item 1
    2. List 1, Item 2
       Following Item 2`

  const opt = {
    onOrderedList: (node, level) => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'OL', 'Tagname is valid')
      t.equal(node.children.length, 2, 'Number of children is valid')
      t.equal(level, 1, 'Level is valid')
      t.equal(node.lastChild.textContent, 'List 1, Item 2Following Item 2', 'TextContent is valid')
    },
  }

  t.plan(5)
  parse(input, opt)
})

test('Ordered list with allowOrderedList flag to false', function (t) {
  const input = `
    1. First list item
    2. Second list item
    3. Third list item`
  const output = inlineHtml`
    <p>1. First list item<br>2. Second list item<br>3. Third list item</p>`
  const opt = {
    allowOrderedList: false,
  }

  t.equal(parseToHtml(input, opt), output, 'Output is valid')
  t.end()
})
