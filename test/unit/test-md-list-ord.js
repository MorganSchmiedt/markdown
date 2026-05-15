// @ts-check
import test from 'node:test'
import assert from 'node:assert'
import { parse, parseToHtml, inlineHtml } from '../test-lib.js'
/** @import { ParserOptions } from '../../src/markdown.js' */

test('Ordered List', () => {
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

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Ordered List with extra LF between items', () => {
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

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Ordered List with complex texts', () => {
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

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Ordered List with wrong numbers', () => {
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

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Ordered List with 3-space-LF', () => {
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

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Ordered List with LF between item contents', () => {
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

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Ordered List with newlines (2 spaces only)', () => {
  const input = `
    1. First item
      Following first item`
  const output = inlineHtml`
    <ol>
      <li>First item</li>
    </ol>
    <p>  Following first item</p>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Ordered List with newlines (> 3 spaces)', () => {
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

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Ordered List not at EOF with callback', (t, done) => {
  const input = `
    Some text
    1. List 1, Item 1
    2. List 1, Item 2
    Not at the end of the file`

  /** @type {ParserOptions} */
  const opt = {
    onOrderedList: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'OL', 'Tagname is valid')
      assert.strictEqual(node.children.length, 2, 'Number of children is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Ordered List at EOF with callback', (t, done) => {
  const input = `
    Some text
    1. List 1, Item 1
    2. List 1, Item 2 at the end of the file`

  /** @type {ParserOptions} */
  const opt = {
    onOrderedList: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'OL', 'Tagname is valid')
      assert.strictEqual(node.children.length, 2, 'Number of children is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Ordered List with extra LF between items and callback', (t, done) => {
  const input = `
    1. First list item

    2. Second list item

    3. Third list item`

  /** @type {ParserOptions} */
  const opt = {
    onOrderedList: node => {
      assert.strictEqual(node.children.length, 3, 'Number of children is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Ordered List with extra LF between items, callback, and allowOrderedNestedList to false', (t, done) => {
  const input = `
    1. First list item

    2. Second list item

    3. Third list item`

  /** @type {ParserOptions} */
  const opt = {
    allowOrderedNestedList: false,
    onOrderedList: node => {
      assert.strictEqual(node.children.length, 3, 'Number of children is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Ordered List with newline in first item and callback', (t, done) => {
  const input = `
    Some text
    1. List 1, Item 1
       Following Item 1
    2. List 1, Item 2`

  /** @type {ParserOptions} */
  const opt = {
    onOrderedList: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'OL', 'Tagname is valid')
      assert.strictEqual(node.children.length, 2, 'Number of children is valid')
      assert.strictEqual(node.firstChild.textContent, 'List 1, Item 1Following Item 1', 'TextContent is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Ordered List with newline in last item and callback', (t, done) => {
  const input = `
    Some text
    1. List 1, Item 1
    2. List 1, Item 2
       Following Item 2`

  /** @type {ParserOptions} */
  const opt = {
    onOrderedList: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'OL', 'Tagname is valid')
      assert.strictEqual(node.children.length, 2, 'Number of children is valid')
      assert.strictEqual(node.lastChild?.textContent, 'List 1, Item 2Following Item 2', 'TextContent is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Ordered List with 2-space-LF and callback', (t, done) => {
  const input = `
    1. Item 1
      Not Line 2`

  /** @type {ParserOptions} */
  const opt = {
    onOrderedList: node => {
      assert.strictEqual(node.firstChild.textContent, 'Item 1', 'Content is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Ordered List with 4-space-LF and callback', (t, done) => {
  const input = `
    1. Item 1
        Line 2
          Line 3`

  /** @type {ParserOptions} */
  const opt = {
    onOrderedList: node => {
      assert.strictEqual(node.firstChild.textContent, 'Item 1Line 2Line 3', 'Content is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Ordered List with extra LF between item content and callback', (t, done) => {
  const input = `
    1. First list item
       Line 2

       Line 3
    2. Second list item`

  /** @type {ParserOptions} */
  const opt = {
    onOrderedList: node => {
      assert.strictEqual(node.children.length, 2, 'Number of children is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Ordered list with allowOrderedList flag to false', () => {
  const input = `
    1. First list item
    2. Second list item
    3. Third list item`
  const output = inlineHtml`
    <p>1. First list item<br>2. Second list item<br>3. Third list item</p>`
  const opt = {
    allowOrderedList: false,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})
