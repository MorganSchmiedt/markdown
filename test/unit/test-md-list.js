// @ts-check
import test from 'node:test'
import assert from 'node:assert'
import { parse, parseToHtml, inlineHtml } from '../test-lib.js'
/** @import { ParserOptions } from '../../src/markdown.js' */

test('Unordered List', () => {
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

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Unordered List with extra LF between items', () => {
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

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Unordered List with complex texts', () => {
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

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Unordered List with 2-space-LF', () => {
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

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Unordered List with LF between item contents', () => {
  const input = `
    - Item 1
      Item 1.1

      Item 1.2
    - Item 2`

  const output = inlineHtml`
    <ul>
      <li>
        Item 1
        <br>
        Item 1.1
        <br>
        Item 1.2
      </li>
      <li>Item 2</li>
    </ul>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Unordered List with LF (1 space only)', () => {
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

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Unordered List with LF (> 2 spaces)', () => {
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

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Unordered List with 2 LF', () => {
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

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

// eslint-disable-next-line prefer-arrow-callback
test('Unordered List not at EOF with callback', function (t, done) {
  const input = `
    Some text
    - List 1, Item 1
    - List 1, Item 2
    Not at the end of the file`

  /** @type {ParserOptions} */
  const opt = {
    onUnorderedList: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'UL', 'Tagname is valid')
      assert.strictEqual(node.children.length, 2, 'Number of children is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Unordered List at EOF with callback', (t, done) => {
  const input = `
    Some text
    - List 1, Item 1
    - List 1, Item 2 at the end of the file`

  /** @type {ParserOptions} */
  const opt = {
    onUnorderedList: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'UL', 'Tagname is valid')
      assert.strictEqual(node.children.length, 2, 'Number of children is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Unordered List with extra LF between items and callback', (t, done) => {
  const input = `
    - First list item

    - Second list item

    - Third list item`

  /** @type {ParserOptions} */
  const opt = {
    onUnorderedList: node => {
      assert.strictEqual(node.children.length, 3, 'Number of children is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Unordered List with extra LF between items, callback, and allowUnorderedNestedList to false', (t, done) => {
  const input = `
    - First list item

    - Second list item

    - Third list item`

  /** @type {ParserOptions} */
  const opt = {
    allowUnorderedNestedList: false,
    onUnorderedList: node => {
      assert.strictEqual(node.children.length, 3, 'Number of children is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Unordered List with LF and callback', (t, done) => {
  const input = `
    Some text
    - List 1, Item 1
      Following Item 1
    - List 1, Item 2 at the end of the file`

  /** @type {ParserOptions} */
  const opt = {
    onUnorderedList: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'UL', 'Tagname is valid')
      assert.strictEqual(node.children.length, 2, 'Number of children is valid')
      assert.strictEqual(node.firstChild.textContent, 'List 1, Item 1Following Item 1', 'Content is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Unordered List with 1-space-LF and callback', (t, done) => {
  const input = `
    - Item 1
     Not Line 2`

  /** @type {ParserOptions} */
  const opt = {
    onUnorderedList: node => {
      assert.strictEqual(node.firstChild.textContent, 'Item 1', 'Content is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Unordered List with 3-space-LF and callback', (t, done) => {
  const input = `
    - Item 1
       Line 2
        Line 3`

  /** @type {ParserOptions} */
  const opt = {
    onUnorderedList: node => {
      assert.strictEqual(node.firstChild.textContent, 'Item 1Line 2Line 3', 'Content is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Unordered List with newlines in the last item and callback', (t, done) => {
  const input = `
    Some text
    - List 1, Item 1
    - List 1, Item 2
      Following Item 2`

  /** @type {ParserOptions} */
  const opt = {
    onUnorderedList: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'UL', 'Tagname is valid')
      assert.strictEqual(node.children.length, 2, 'Number of children is valid')
      assert.strictEqual(node.lastChild?.textContent, 'List 1, Item 2Following Item 2', 'Content is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Unordered List with extra LF between item content and callback', (t, done) => {
  const input = `
    - First list item
      Line 2

      Line 3
    - Second list item`

  /** @type {ParserOptions} */
  const opt = {
    onUnorderedList: node => {
      assert.strictEqual(node.children.length, 2, 'Number of children is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Unordered list with allowUnorderedList flag to false', (t, done) => {
  const input = `
    - First list item
    - Second list item
    - Third list item`
  const output = inlineHtml`
    <p>- First list item<br>- Second list item<br>- Third list item</p>`

  /** @type {ParserOptions} */
  const opt = {
    allowUnorderedList: false,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
  done()
})
