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

test('Ordered List with extra LF between items', function (t) {
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

test('Ordered List with complex texts', function (t) {
  const input = `
    1. *Italic* item
    2. Item **bold**
    3. Item ~~strikethrough~~
    4. ^superscript
    5. [Link](url)`

  const output = inlineHtml`
    <ol>
      <li><em>Italic</em> item</li>
      <li>Item <strong>bold</strong></li>
      <li>Item <s>strikethrough</s></li>
      <li><sup>superscript</sup></li>
      <li><a href="url">Link</a></li>
    </ol>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Ordered List with wrong numbers', function (t) {
  const input = `
    1. *Italic* item
    1. Item **bold**
    5. Item ~~strikethrough~~
    3. ^superscript
    2. [Link](url)`

  const output = inlineHtml`
    <ol>
      <li><em>Italic</em> item</li>
      <li>Item <strong>bold</strong></li>
      <li>Item <s>strikethrough</s></li>
      <li><sup>superscript</sup></li>
      <li><a href="url">Link</a></li>
    </ol>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Ordered List with 3-space-LF', function (t) {
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

test('Ordered List with LF between item contents', function (t) {
  const input = `
    1. Item 1
       Item 1.1

       Item 1.2
    2. Item 2
       Item 2.1`
  const output = inlineHtml`
    <ol>
      <li>Item 1<br>Item 1.1<br>Item 1.2</li>
      <li>Item 2<br>Item 2.1</li>
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

test('Ordered List not at EOF with callback', function (t) {
  const input = `
    Some text
    1. List 1, Item 1
    2. List 1, Item 2
    Not at the end of the file`

  const opt = {
    onOrderedList: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'OL', 'Tagname is valid')
      t.equal(node.children.length, 2, 'Number of children is valid')
    },
  }

  t.plan(3)
  parse(input, opt)
})

test('Ordered List at EOF with callback', function (t) {
  const input = `
    Some text
    1. List 1, Item 1
    2. List 1, Item 2 at the end of the file`

  const opt = {
    onOrderedList: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'OL', 'Tagname is valid')
      t.equal(node.children.length, 2, 'Number of children is valid')
    },
  }

  t.plan(3)
  parse(input, opt)
})

test('Ordered List with extra LF between items and callback', function (t) {
  const input = `
    1. First list item

    2. Second list item

    3. Third list item`

  const opt = {
    onOrderedList: node => {
      t.equal(node.children.length, 3, 'Number of children is valid')
    },
  }

  t.plan(1)
  parse(input, opt)
})

test('Ordered List with extra LF between items, callback, and allowOrderedNestedList to false', function (t) {
  const input = `
    1. First list item

    2. Second list item

    3. Third list item`

  const opt = {
    allowOrderedNestedList: false,
    onOrderedList: node => {
      t.equal(node.children.length, 3, 'Number of children is valid')
    },
  }

  t.plan(1)
  parse(input, opt)
})

test('Ordered List with newline in first item and callback', function (t) {
  const input = `
    Some text
    1. List 1, Item 1
       Following Item 1
    2. List 1, Item 2`

  const opt = {
    onOrderedList: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'OL', 'Tagname is valid')
      t.equal(node.children.length, 2, 'Number of children is valid')
      t.equal(node.firstChild.textContent, 'List 1, Item 1Following Item 1', 'TextContent is valid')
    },
  }

  t.plan(4)
  parse(input, opt)
})

test('Ordered List with newline in last item and callback', function (t) {
  const input = `
    Some text
    1. List 1, Item 1
    2. List 1, Item 2
       Following Item 2`

  const opt = {
    onOrderedList: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'OL', 'Tagname is valid')
      t.equal(node.children.length, 2, 'Number of children is valid')
      t.equal(node.lastChild.textContent, 'List 1, Item 2Following Item 2', 'TextContent is valid')
    },
  }

  t.plan(4)
  parse(input, opt)
})

test('Ordered List with 2-space-LF and callback', function (t) {
  const input = `
    1. Item 1
      Not Line 2`

  const opt = {
    onOrderedList: node => {
      t.equal(node.firstChild.textContent, 'Item 1', 'Content is valid')
    },
  }

  t.plan(1)
  parse(input, opt)
  t.end()
})

test('Ordered List with 4-space-LF and callback', function (t) {
  const input = `
    1. Item 1
        Line 2
          Line 3`

  const opt = {
    onOrderedList: node => {
      t.equal(node.firstChild.textContent, 'Item 1Line 2Line 3', 'Content is valid')
    },
  }

  t.plan(1)
  parse(input, opt)
  t.end()
})

test('Ordered List with extra LF between item content and callback', function (t) {
  const input = `
    1. First list item
       Line 2

       Line 3
    2. Second list item`

  const opt = {
    onOrderedList: node => {
      t.equal(node.children.length, 2, 'Number of children is valid')
    },
  }

  t.plan(1)
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
