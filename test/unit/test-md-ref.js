// @ts-check
import test from 'node:test'
import assert from 'node:assert'
import { parse, parseToHtml, inlineHtml } from '../test-lib.js'
/** @import { ParserOptions } from '../../src/markdown.js' */

test('Reference with a single ref', () => {
  const input = `
    See reference[^1]

    [^1]: some text`

  const output = inlineHtml`
    <p>See reference<a href="#reference1"><sup>1</sup></a></p>
    <section>
      <ol>
        <li id="reference1">some text</li>
      </ol>
    </section>`

  const opt = {
    allowFootnote: true,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Reference with 2 refs', () => {
  const input = `
    See this[^1] and that[^2]

    [^1]: ref one
    [^2]: ref two`

  const output = inlineHtml`
    <p>See this<a href="#reference1"><sup>1</sup></a> and that<a href="#reference2"><sup>2</sup></a></p>
    <section>
      <ol>
        <li id="reference1">ref one</li>
        <li id="reference2">ref two</li>
      </ol>
    </section>`

  const opt = {
    allowFootnote: true,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Reference with 2 refs not in order', () => {
  const input = `
    See this[^1] and that[^2]
    [^2]: ref two
    [^1]: ref one`

  const output = inlineHtml`
    <p>See this<a href="#reference1"><sup>1</sup></a> and that<a href="#reference2"><sup>2</sup></a></p>
    <section>
      <ol>
        <li id="reference1">ref one</li>
        <li id="reference2">ref two</li>
      </ol>
    </section>`

  const opt = {
    allowFootnote: true,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Reference with two ids below text', () => {
  const input = `
    See this[^one] and that[^two]

    [^one]: ref one
    [^two]: ref two`

  const output = inlineHtml`
    <p>See this<a href="#reference1"><sup>1</sup></a> and that<a href="#reference2"><sup>2</sup></a></p>
    <section>
      <ol>
        <li id="reference1">ref one</li>
        <li id="reference2">ref two</li>
      </ol>
    </section>`

  const opt = {
    allowFootnote: true,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Reference with two ids above text', () => {
  const input = `
    [^one]: ref one
    [^two]: ref two

    See this[^one] and that[^two]`

  const output = inlineHtml`
    <p>See this<a href="#reference1"><sup>1</sup></a> and that<a href="#reference2"><sup>2</sup></a></p>
    <section>
      <ol>
        <li id="reference1">ref one</li>
        <li id="reference2">ref two</li>
      </ol>
    </section>`

  const opt = {
    allowFootnote: true,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Reference with two ids in between text lines', () => {
  const input = `
    See this[^one]
    [^one]: ref one

    And that[^two]
    [^two]: ref two`

  const output = inlineHtml`
    <p>See this<a href="#reference1"><sup>1</sup></a></p>
    <p>And that<a href="#reference2"><sup>2</sup></a></p>
    <section>
      <ol>
        <li id="reference1">ref one</li>
        <li id="reference2">ref two</li>
      </ol>
    </section>`

  const opt = {
    allowFootnote: true,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Reference with missing ref key', () => {
  const input = `
    See this[^one] and that

    [^one]: ref one
    [^two]: ref two`

  const output = inlineHtml`
    <p>See this<a href="#reference1"><sup>1</sup></a> and that</p>
    <section>
      <ol>
        <li id="reference1">ref one</li>
      </ol>
    </section>`

  const opt = {
    allowFootnote: true,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Reference with missing ref text', () => {
  const input = `
    See this[^one] and that[^two]

    [^one]: ref one`

  const output = inlineHtml`
    <p>See this<a href="#reference1"><sup>1</sup></a> and that<a href="#reference2"><sup>2</sup></a></p>
    <section>
      <ol>
        <li id="reference1">ref one</li>
        <li id="reference2"></li>
      </ol>
    </section>`

  const opt = {
    allowFootnote: true,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Reference with two ids', () => {
  const input = `
    See this[^one] and that[^one]

    [^one]: ref one`

  const output = inlineHtml`
    <p>See this<a href="#reference1"><sup>1</sup></a> and that<a href="#reference1"><sup>1</sup></a></p>
    <section>
      <ol>
        <li id="reference1">ref one</li>
      </ol>
    </section>`

  const opt = {
    allowFootnote: true,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Reference with two notes', () => {
  const input = `
    See this[^one]

    [^one]: ref one
    [^one]: ref two`

  const output = inlineHtml`
    <p>See this<a href="#reference1"><sup>1</sup></a></p>
    <section>
      <ol>
        <li id="reference1">ref two</li>
      </ol>
    </section>`

  const opt = {
    allowFootnote: true,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Reference with complex texts', () => {
  const input = `
    See reference[^1]

    [^1]: some *italic* and **bold** and a [link](address)`

  const output = inlineHtml`
    <p>See reference<a href="#reference1"><sup>1</sup></a></p>
    <section>
      <ol>
        <li id="reference1">some <em>italic</em> and <strong>bold</strong> and a <a href="address">link</a></li>
      </ol>
    </section>`

  const opt = {
    allowFootnote: true,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})

test('Reference with callback', (t, done) => {
  const input = `
    See reference[^1]

    [^1]: some text`

  /** @type {ParserOptions} */
  const opt = {
    allowFootnote: true,
    onReference: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'A', 'Tagname is valid')
      assert.notEqual(node.firstChild, '1', 'firstChild is there')
      done()
    },
  }

  parse(input, opt)
})

test('Reference with allowFootnote to false', () => {
  const input = `
    See reference[^1]

    [^1]: some text`

  const output = inlineHtml`
    <p>See reference[<sup>1</sup>]</p>
    <p>[<sup>1</sup>]: some text</p>`

  /** @type {ParserOptions} */
  const opt = {
    allowFootnote: false,
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'Output is valid')
})
