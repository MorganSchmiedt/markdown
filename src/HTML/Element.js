'use strict'

const HTML_ENTITY = require('./Entity.js')
const Node = require('./Node.js')
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

class Element extends Node {
  constructor(tagName) {
    super()
    this._symbol = Symbol()
    this._tagName = tagName.toUpperCase()
    this._attributes = {}
  }

  get attributes() {
    return this._attributes
  }

  get children() {
    return this._children
      .filter(node => node.constructor.name === 'Element')
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

  append(...nodes) {
    for (const node of nodes) {
      if (typeof node === 'string') {
        this.appendChild(new Text(node))
      } else {
        this.appendChild(node)
      }
    }
  }

  getAttribute(attributeName) {
    return this._attributes[attributeName] || null
  }

  hasAttribute(attributeName) {
    return this._attributes[attributeName] !== undefined
  }

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

  removeAttribute(attributeName) {
    delete this._attributes[attributeName]
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

  // Custom
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
