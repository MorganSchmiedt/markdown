// @ts-check

import HTML_ENTITY from './Entity.js'
import Text from './Text.js'

// https://html.spec.whatwg.org/multipage/syntax.html#void-elements
const VOID_TAGS = new Set([
  'AREA',
  'BASE',
  'BR',
  'COL',
  'EMBED',
  'HR',
  'IMG',
  'INPUT',
  'LINK',
  'META',
  'PARAM',
  'SOURCE',
  'TRACK',
  'WBR'
])

export default class Element {
  /** @private */
  /** @type {Array<Element|Text>} */
  _children

  /** @public */
  /** @type {null|Element} */
  _parentNode

  /** @public */
  /** @type {Symbol} */
  _symbol

  /** @type {Object<string, string>} */
  _attributes

  /** @type {undefined|null|number} */
  _ffOnTextEnd
  /** @type {undefined|null|boolean} */
  _upOnTextEnd

  /** @type {void|null|Function} */
  onAttach

  /**
   * @constructor
   * @param {string} tagName
   */
  constructor(tagName) {
    this._children = []
    this._parentNode = null
    this._symbol = Symbol()
    this._tagName = tagName.toUpperCase()
    this._attributes = {}
    this.onAttach = null
  }

  get childNodes() {
    return this._children
  }

  get firstChild() {
    return this._children[0]
  }

  /**
   * @returns {null|Element|Text}
   */
  get lastChild() {
    return this._children[this._children.length - 1]
  }

  /**
   * @returns {null|Element}
   */
  get firstChildElement() {
    for (const child of this._children) {
      if (child instanceof Element) {
        return child
      }
    }
    return null
  }

  /**
 * @returns {null|Element}
 */
  get lastChildElement() {
    /** @type {number} */
    const childrenLength = this._children.length

    for (let i = 0; i < childrenLength ; i += 1) {
      const child = this._children[childrenLength - i - 1]

      if (child instanceof Element) {
        return child
      }
    }

    return null
  }

  /**
   * @returns {null|Element}
   */
  get parentNode() {
    return this._parentNode
  }

  // https://dom.spec.whatwg.org/#dom-node-textcontent
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
  get textContent() {
    let output = ''

    for (const child of this._children) {
      output += child.textContent
    }

    return output
  }

  /**
   * @param {null|string} value
   */
  set textContent(value) {
    for (const child of this._children) {
      child._parentNode = null
    }
    this._children = []

    if (value == null) {
      return
    }

    const text = value.toString()

    if (text.length > 0) {
      this.appendChild(new Text(text))
    }
  }

  /**
   * @param {Element|Text} node
   */
  appendChild(node) {
    if (node._parentNode != null) {
      node._parentNode.removeChild(node)
    }
    node._parentNode = this

    this._children.push(node)
  }

  /**
   * @param {Element|Text} childNode
   */
  removeChild(childNode) {
    if (childNode == null) {
      throw new TypeError('Node.removeChild: At least 1 argument required, but only 0 passed')
    }

    if (childNode._parentNode == null
    || childNode._parentNode._symbol !== this._symbol) {
      throw new Error('Node.removeChild: The node to be removed is not a child of this node')
    }

    for (let i = 0; i < this._children.length; i += 1) {
      if (this._children[i]._symbol === childNode._symbol) {
        const removeChild = this._children[i]
        removeChild._parentNode = null

        this._children.splice(i, 1)

        return childNode
      }
    }
  }

  get attributes() {
    return this._attributes
  }

  get children() {
    return this._children
      .filter(node => node.constructor.name === 'Element')
  }

  /**
   * @param {string} value
   */
  set className(value) {
    this.setAttribute('class', value)
  }

  /**
   * @returns {null|string}
   */
  get className() {
    return this.getAttribute('class')
  }

  /**
   * @returns {null|string}
   */
  get id() {
    return this.getAttribute('id')
  }

  /**
   * @param {string} value
   */
  set id(value) {
    this.setAttribute('id', value)
  }

  get innerHTML() {
    const isVoidElement = VOID_TAGS.has(this.tagName)

    if (isVoidElement) {
      return ''
    }

    let html = ''

    for (const child of this._children) {
      html += child.outerHTML
    }

    return html
  }

  /**
   * @returns {string}
   */
  get outerHTML() {
    const isVoidElement = VOID_TAGS.has(this.tagName)
    const tagName = this.tagName.toLowerCase()

    let html = ''

    // https://html.spec.whatwg.org/multipage/syntax.html#start-tags
    html += `<${tagName}`

    const attrList = Object.keys(this._attributes)

    for (const attrName of attrList) {
      const attrValue = this._attributes[attrName]
      const attrValueHtml = attrValue.replace(
        /[&"]/g, char => HTML_ENTITY[char])

      html += ` ${attrName}="${attrValueHtml}"`
    }

    html += '>'

    if (isVoidElement) {
      return html
    }

    for (const child of this._children) {
      html += child.outerHTML
    }

    html += `</${tagName}>`

    return html
  }

  // https://dom.spec.whatwg.org/#dom-element-tagname
  get tagName() {
    return this._tagName
  }

  /**
   * @param {Array<string|Element>} nodes
   */
  append(...nodes) {
    for (const node of nodes) {
      if (typeof node === 'string') {
        this.appendChild(new Text(node))
      } else {
        this.appendChild(node)
      }
    }
  }

  /**
   * @param {string} attributeName
   * @returns {null|string}
   */
  getAttribute(attributeName) {
    return this._attributes[attributeName] ?? null
  }

  /**
   * @param {string} attributeName
   * @returns {boolean}
   */
  hasAttribute(attributeName) {
    return this._attributes[attributeName] !== undefined
  }

  /**
   * @param {Array<string|Element>} nodes
   */
  prepend(...nodes) {
    this._children.splice(0, 0, ...nodes.map(node => {
      if (typeof node === 'string') {
        return new Text(node)
      }

      return node
    }))
  }

  remove() {
    if (this._parentNode == null) {
      return
    }

    return this._parentNode.removeChild(this)
  }

  /**
   * @param {string} attributeName
   */
  removeAttribute(attributeName) {
    delete this._attributes[attributeName]
  }

  /**
   * @param {string} attributeName
   * @param {void|null|string|number|boolean|object} attributeValue
   */
  setAttribute(attributeName, attributeValue) {
    if (arguments.length < 2) {
      throw new TypeError(`Element.setAttribute: At least 2 arguments required, but only ${arguments.length} passed`)
    }

    const hasForbiddenCharInAttrName = /[<>&"']/.exec(attributeName) != null

    if (hasForbiddenCharInAttrName) {
      throw new Error('String contains an invalid character')
    }

    let attrValueText

    if (attributeValue === undefined) {
      attrValueText = 'undefined'
    } else if (attributeValue === null) {
      attrValueText = 'null'
    } else {
      attrValueText = attributeValue.toString()
    }

    this._attributes[attributeName] = attrValueText
  }

  /**
   * Custom function : Runs a callback when Element is mounted
   * @returns {void}
   */
  _attach() {
    for (const child of this._children) {
      if (child instanceof Element
      && child._attach != null) {
        child._attach()
      }
    }

    if (this.onAttach) {
      this.onAttach(this)
    }
  }
}
