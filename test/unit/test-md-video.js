// @ts-check
import test from 'node:test'
import assert from 'node:assert'
import { parse, parseToHtml, inlineHtml } from '../test-lib.js'
/** @import { ParserOptions } from '../../src/markdown.js' */

test('Video', () => {
  const input = '![](https://example.com/video.mp4 "caption")'
  const output = inlineHtml`
    <figure>
      <video controls="">
        <source src="https://example.com/video.mp4" type="video/mp4">
      </video>
      <figcaption>caption</figcaption>
    </figure>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Video with callback', (t, done) => {
  const input = '![](https://example.com/video.mp4)'
  /** @type {ParserOptions} */
  const opt = {
    onVideo: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'VIDEO', 'Tagname is valid')
      done()
    },
  }

  parse(input, opt)
})
