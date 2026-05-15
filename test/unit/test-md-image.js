// @ts-check
import test from 'node:test'
import assert from 'node:assert'
import { parse, parseToHtml, inlineHtml } from '../test-lib.js'
/** @import { ParserOptions } from '../../src/markdown.js' */

test('Image on its own line with an alt text', () => {
  const input = '![alt text](https://example.com/image)'
  const output = inlineHtml`
    <figure>
      <img src="https://example.com/image" alt="alt text">
    </figure>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Image on its own line with an empty alt text', () => {
  const input = '![](https://example.com/image)'
  const output = inlineHtml`
    <figure>
      <img src="https://example.com/image" alt="">
    </figure>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Image on its own line with an alt text and a title', () => {
  const input = '![alt text](https://example.com/image "My image title")'
  const output = inlineHtml`
    <figure>
      <img src="https://example.com/image" alt="alt text">
      <figcaption>My image title</figcaption>
    </figure>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Image on its own line with an empty alt text and a title', () => {
  const input = '![alt text](https://example.com/image "My image title")'
  const output = inlineHtml`
    <figure>
      <img src="https://example.com/image" alt="alt text">
      <figcaption>My image title</figcaption>
    </figure>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Image on its own line with an empty title', () => {
  const input = '![](https://example.com/image "")'
  const output = inlineHtml`
    <figure>
      <img src="https://example.com/image" alt="">
      <figcaption></figcaption>
    </figure>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Image on its own line surrounded by elements', () => {
  const input = `
    - List 1
    ![alt text](https://example.com/image)
    - List 2`

  const output = inlineHtml`
    <ul>
      <li>List 1</li>
    </ul>
    <figure>
      <img src="https://example.com/image" alt="alt text">
    </figure>
    <ul>
      <li>List 2</li>
    </ul>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Image on its own line can NOT have html attr by default', () => {
  const input = '![alt text](https://example.com/image){style=height:100px}'
  const output = inlineHtml`
    <figure>
      <img src="https://example.com/image" alt="alt text">
    </figure>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Image on its own line CAN have html attr if allowHTMLAttributes is true', () => {
  const input = '![alt text](https://example.com/image){style=height:100px}'
  const output = inlineHtml`
    <figure style="height:100px">
      <img src="https://example.com/image" alt="alt text">
    </figure>`
  const opt = {
    allowHTMLAttributes: true,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Image on its own line with callback', (t, done) => {
  const input = '![alt text](https://example.com/image)'
  /** @type {ParserOptions} */
  const opt = {
    onImage: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'IMG', 'Tagname is valid')
      done()
    },
  }

  parse(input, opt)
})

test('Image inline', () => {
  const input = 'This is an inline ![alt text](https://example.com/image)'
  const output = '<p>This is an inline <img src="https://example.com/image" alt="alt text"></p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Image inline at the beginning of line', () => {
  const input = '![alt text](https://example.com/image) was inlined'
  const output = '<p><img src="https://example.com/image" alt="alt text"> was inlined</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Image with style and default allowHTMLAttributes', () => {
  const input = 'This is an inline ![alt text](https://example.com/image){style=height: 100px}'
  const output = '<p>This is an inline <img src="https://example.com/image" alt="alt text"></p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Image with style and allowHTMLAttributes to true', () => {
  const input = 'This is an inline ![alt text](https://example.com/image){style="height: 100px; width: 50px"} with style'
  const output = '<p>This is an inline <img src="https://example.com/image" alt="alt text" style="height: 100px; width: 50px"> with style</p>'
  const opt = {
    allowHTMLAttributes: true,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Image inline with callback', (t, done) => {
  const input = 'This is an inline ![alt text](https://example.com/image)'
  /** @type {ParserOptions} */
  const opt = {
    onImage: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'IMG', 'Tagname is valid')
      done()
    },
  }

  parse(input, opt)
})
