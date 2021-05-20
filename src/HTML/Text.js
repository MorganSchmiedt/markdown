'use strict'

const HTML_ENTITY = require('./Entity.js')

class Text {
  constructor(text) {
    this._symbol = Symbol()
    this._data = text.toString()
    this._parentNode = null
  }

  get outerHTML() {
    return this._data.replace(/[&<>]/g, char => HTML_ENTITY[char])
  }

  get parentNode() {
    return this._parentNode
  }

  get textContent() {
    return this._data
  }
}

module.exports = Text
