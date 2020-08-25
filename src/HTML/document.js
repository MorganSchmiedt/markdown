'use strict'

const Element = require('./Element.js')
const Text = require('./Text.js')

const document = {
  createElement: tagName => new Element(tagName),
  createTextNode: text => new Text(text),
}

module.exports = document
