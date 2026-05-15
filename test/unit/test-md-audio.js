// @ts-check
import test from 'node:test'
import assert from 'node:assert'
import { parse, parseToHtml, inlineHtml } from '../test-lib.js'
/** @import { ParserOptions } from '../../src/markdown.js' */


test('Audio', () => {
  const input = '![](https://example.com/sound.mp3)'
  const output = inlineHtml`
    <figure>
      <audio controls="">
        <source src="https://example.com/sound.mp3" type="audio/mpeg">
      </audio>
    </figure>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Audio with a caption', () => {
  const input = '![](https://example.com/sound.mp3 "caption")'
  const output = inlineHtml`
    <figure>
      <audio controls="">
        <source src="https://example.com/sound.mp3" type="audio/mpeg">
      </audio>
      <figcaption>caption</figcaption>
    </figure>`

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Audio with callback', (t, done) => {
  const input = '![](https://example.com/sound.mp3)'
  /** @type {ParserOptions} */
  const opt = {
    onAudio: node => {
      assert.notEqual(node, null, 'Parameter is populated')
      assert.strictEqual(node.tagName, 'AUDIO', 'Tagname is valid')
      done()
    },
  }

  parse(input, opt)
})
