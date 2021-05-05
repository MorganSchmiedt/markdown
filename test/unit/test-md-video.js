'use strict'
/* eslint-disable prefer-arrow-callback */

const {
  parse,
  parseToHtml,
  inlineHtml,
  test,
} = require('../test-lib.js')

test('Video', function (t) {
  const input = '![](https://example.com/video.mp4 "caption")'
  const output = inlineHtml`
    <figure>
      <video controls="">
        <source src="https://example.com/video.mp4" type="video/mp4">
      </video>
      <figcaption>caption</figcaption>
    </figure>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Video with callback', function (t) {
  const input = '![](https://example.com/video.mp4)'
  const opt = {
    onVideo: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'VIDEO', 'Tagname is valid')
      t.end()
    },
  }

  parse(input, opt)
})
