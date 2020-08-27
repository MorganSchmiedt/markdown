'use strict'
/* eslint-disable prefer-arrow-callback */

const {
  parser,
  test,
} = require('../test-lib.js')

const Text = parser.Text

test('Text with normal text', function (t) {
  const element = new Text('some text')

  t.equal(element.textContent, 'some text', 'textContent is valid')
  t.equal(element.outerHTML, 'some text', 'outerHTML is valid')
  t.end()
})

test('Text with forbidden char', function (t) {
  const element = new Text('&<>')

  t.equal(element.textContent, '&<>', 'textContent is valid')
  t.equal(element.outerHTML, '&amp;&lt;&gt;', 'outerHTML is valid')
  t.end()
})

test('Text with number', function (t) {
  const element = new Text(1000)

  t.equal(element.textContent, '1000', 'textContent is valid')
  t.equal(element.outerHTML, '1000', 'outerHTML is valid')
  t.end()
})
