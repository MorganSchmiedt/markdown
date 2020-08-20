'use strict'
/* eslint-disable prefer-arrow-callback */

const {
  parser,
  test,
} = require('../test-lib.js')

test('Module Exports', function (t) {
  t.equal(typeof parser.Element, 'function', 'Element is there')
  t.equal(typeof parser.parse, 'function', 'parse is there')
  t.end()
})
