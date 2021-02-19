'use strict'
/* eslint-disable prefer-arrow-callback */

const {
  parse,
  parseToHtml,
  inlineHtml,
  test,
} = require('../test-lib.js')

test('Audio', function (t) {
  const input = '![alt text](https://example.com/sound.mp3)'
  const output = inlineHtml`
    <figure>
      <audio controls="">
        <source src="https://example.com/sound.mp3" type="audio/mpeg">
      </audio>
      <figcaption>alt text</figcaption>
    </figure>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Audio with callback', function (t) {
  const input = '![alt text](https://example.com/sound.mp3)'
  const opt = {
    onAudio: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'AUDIO', 'Tagname is valid')
      t.end()
    },
  }

  parse(input, opt)
})
