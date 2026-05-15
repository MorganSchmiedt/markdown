// @ts-check

import Element from './Element.js'
import Text from './Text.js'

export default {
  /**
   * @param {string} tagName
   */
  createElement: tagName => new Element(tagName),

  /**
   * @param {string} text
   */
  createTextNode: text => new Text(text),
}
