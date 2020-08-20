'use strict'
/* eslint-disable prefer-arrow-callback */

const {
  parse,
  parseToHtml,
  inlineHtml,
  test,
} = require('../test-lib.js')

test('Unordered List', function (t) {
  const input = `
    - First list item
    - Second list item
    - Third list item`
  const output = inlineHtml`
    <ul>
      <li>First list item</li>
      <li>Second list item</li>
      <li>Third list item</li>
    </ul>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Unordered List with complex texts', function (t) {
  const input = `
    - *Italic* item
    - Item **bold**
    - Item ~~strikethrough~~
    - ^superscript
    - [Link](url)`

  const output = inlineHtml`
    <ul>
      <li><em>Italic</em> item</li>
      <li>Item <strong>bold</strong></li>
      <li>Item <s>strikethrough</s></li>
      <li><sup>superscript</sup></li>
      <li><a href="url">Link</a></li>
    </ul>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Unordered List with LF (2 spaces)', function (t) {
  const input = `
    - Item 1
      Following Item 1
    - Item 2`

  const output = inlineHtml`
    <ul>
      <li>
        Item 1
        <br>
        Following Item 1
      </li>
      <li>Item 2</li>
    </ul>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Unordered List with LF (1 space only)', function (t) {
  const input = `
    - Item 1
     Following Item 1`

  const output = inlineHtml`
    <ul>
      <li>
        Item 1
      </li>
    </ul>
    <p> Following Item 1</p>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Unordered List with LF (> 2 spaces)', function (t) {
  const input = `
    - Item 1
       Following Item 1
        Following again`

  const output = inlineHtml`
    <ul>
      <li>
        Item 1
        <br>
        Following Item 1
        <br>
        Following again
      </li>
    </ul>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Unordered List with 2 LF', function (t) {
  const input = `
    - Item 1
      Following Item 1
       Following again Item 1
    - Item 2`

  const output = inlineHtml`
    <ul>
      <li>
        Item 1
        <br>
        Following Item 1
        <br>
        Following again Item 1
      </li>
      <li>Item 2</li>
    </ul>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Unordered List Cb: Not at EOF with', function (t) {
  const input = `
    Some text
    - List 1, Item 1
    - List 1, Item 2
    Not at the end of the file`

  const opt = {
    onUnorderedList: (node, level) => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'UL', 'Tagname is valid')
      t.equal(node.children.length, 2, 'Number of children is valid')
      t.equal(level, 1, 'Level is valid')
    },
  }

  t.plan(4)
  parse(input, opt)
})

test('Unordered List at EOF with callback', function (t) {
  const input = `
    Some text
    - List 1, Item 1
    - List 1, Item 2 at the end of the file`

  const opt = {
    onUnorderedList: (node, level) => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'UL', 'Tagname is valid')
      t.equal(node.children.length, 2, 'Number of children is valid')
      t.equal(level, 1, 'Level is valid')
    },
  }

  t.plan(4)
  parse(input, opt)
})

test('Unordered List with newlines and callback', function (t) {
  const input = `
    Some text
    - List 1, Item 1
      Following Item 1
    - List 1, Item 2 at the end of the file`

  const opt = {
    onUnorderedList: (node, level) => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'UL', 'Tagname is valid')
      t.equal(node.children.length, 2, 'Number of children is valid')
      t.equal(level, 1, 'Level is valid')
      t.equal(node.firstChild.textContent, 'List 1, Item 1Following Item 1', 'Content is valid')
    },
  }

  t.plan(5)
  parse(input, opt)
})

test('Unordered List with newlines in the last item and callback', function (t) {
  const input = `
    Some text
    - List 1, Item 1
    - List 1, Item 2
      Following Item 2`

  const opt = {
    onUnorderedList: (node, level) => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'UL', 'Tagname is valid')
      t.equal(node.children.length, 2, 'Number of children is valid')
      t.equal(level, 1, 'Level is valid')
      t.equal(node.lastChild.textContent, 'List 1, Item 2Following Item 2', 'Content is valid')
    },
  }

  t.plan(5)
  parse(input, opt)
})

test('Unordered list with allowUnorderedList flag to false', function (t) {
  const input = `
    - First list item
    - Second list item
    - Third list item`
  const output = inlineHtml`
    <p>- First list item<br>- Second list item<br>- Third list item</p>`
  const opt = {
    allowUnorderedList: false,
  }

  t.equal(parseToHtml(input, opt), output, 'Output is valid')
  t.end()
})
