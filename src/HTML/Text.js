'use strict'

const HTML_ENTITY = require('./Entity.js')

class Text {
  constructor(text) {
    this.data = text
  }

  get textContent() {
    return this.data
  }

  get outerHTML() {
    return this.data.replace(/[&<>]/g, char => HTML_ENTITY[char])
  }
}

module.exports = Text
