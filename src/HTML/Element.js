'use strict'

const HTML_ENTITY = require('./Entity.js')
const Text = require('./Text.js')

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

class Element {
  constructor(tagName) {
    this._tagName = tagName.toUpperCase()
    this._attributes = {}
    this._children = []
  }

  appendChild(node) {
    node.parentNode = this

    this._children.push(node)
  }

  append(...nodes) {
    this._children.push(...nodes.map(node => {
      if (typeof node === 'string') {
        return new Text(node)
      }

      return node
    }))
  }

  prepend(...nodes) {
    this._children.splice(0, 0, ...nodes.map(node => {
      if (typeof node === 'string') {
        return new Text(node)
      }

      return node
    }))
  }

  hasAttribute(attributeName) {
    return this._attributes[attributeName] !== undefined
  }

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

  getAttribute(attributeName) {
    return this._attributes[attributeName] || null
  }

  removeAttribute(attributeName) {
    delete this._attributes[attributeName]
  }

  get attributes() {
    return this._attributes
  }

  // https://dom.spec.whatwg.org/#dom-element-tagname
  get tagName() {
    return this._tagName
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

  set textContent(value) {
    if (value == null
    || value.length === 0) {
      this._children = []
    } else {
      this._children = [new Text(value)]
    }
  }

  get children() {
    return this._children
      .filter(node => node.constructor.name === 'Element')
  }

  get childNodes() {
    return this._children
  }

  get firstChild() {
    return this._children[0]
  }

  get lastChild() {
    return this._children[this._children.length - 1]
  }

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

  set className(value) {
    this.setAttribute('class', value)
  }

  get className() {
    return this.getAttribute('class')
  }

  get id() {
    return this.getAttribute('id')
  }

  set id(value) {
    this.setAttribute('id', value)
  }

  _attach() {
    for (const child of this._children) {
      if (child._attach) {
        child._attach(child)
      }
    }

    if (this.onAttach) {
      this.onAttach(this)
    }
  }
}

module.exports = Element
