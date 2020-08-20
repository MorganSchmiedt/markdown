'use strict'
/* eslint-disable prefer-arrow-callback */

const {
  parse,
  parseToHtml,
  test,
} = require('../test-lib.js')

test('Reference', function (t) {
  const input = 'See reference[^1]'
  const output = '<p>See reference<a href="#reference1"><sup>1</sup></a></p>'

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Reference with callback', function (t) {
  const input = 'See reference[^1]'
  const opt = {
    allowReference: true,
    onReference: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'A', 'Tagname is valid')
      t.notEqual(node.firstChild, '1', 'firstChild is there')
      t.end()
    },
  }

  parse(input, opt)
})

test('Reference with allowReference to false', function (t) {
  const input = 'See reference[^1]'
  const output = '<p>See reference[<sup>1</sup>]</p>'
  const opt = {
    allowReference: false,
  }

  t.equal(parseToHtml(input, opt), output, 'Output is valid')
  t.end()
})
