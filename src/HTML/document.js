'use strict'
/* eslint-env node, es6 */

const Element = require('./Element.js')

const document = {
  createElement: tagName => new Element(tagName),
  createTextNode: text => text,
}

module.exports = document
