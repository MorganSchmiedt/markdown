// @ts-check

import HTML_ENTITY from './Entity.js'
/** @import Element from './Element.js' */

export default class Text {
  /** @public */
  /** @type {Symbol} */
  _symbol

  /** @private */
  /** @type {string} */
  #_data

  /** @public */
  /** @type {null|Element} */
  _parentNode

  /**
   * @constructor
   * @param {string|number} text
   */
  constructor(text) {
    this._symbol = Symbol()
    this.#_data = text.toString()
    this._parentNode = null
  }

  get outerHTML() {
    return this.#_data.replace(/[&<>]/g, char => HTML_ENTITY[char])
  }

  get parentNode() {
    return this._parentNode
  }

  get textContent() {
    return this.#_data
  }
}
