'use strict'

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

const HTML_CHAR_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
}

const HTML_CONTENT_ESCAPE_CHARS = '&<>'
const HTML_ATTR_VALUE_ESCAPE_CHARS = '&"'

const HTML_CONTENT_ESCAPE_REGEX =
  new RegExp(`[${HTML_CONTENT_ESCAPE_CHARS}]`, 'g')

const HTML_ATTR_VALUE_ESCAPE_REGEX =
  new RegExp(`[${HTML_ATTR_VALUE_ESCAPE_CHARS}]`, 'g')

const replaceHtmlCharsInContent = text =>
  text.replace(HTML_CONTENT_ESCAPE_REGEX, char => HTML_CHAR_MAP[char])

const replaceHtmlCharsInAttrValue = text =>
  text.replace(HTML_ATTR_VALUE_ESCAPE_REGEX, char => HTML_CHAR_MAP[char])

const HTML_FORBIDDEN_CHARS_ATTR_NAME = '<>&"\''

const hasForbiddenCharInAttrName = text =>
  new RegExp(`[${HTML_FORBIDDEN_CHARS_ATTR_NAME}]`, 'g').exec(text) != null

class Element {
  constructor(tagName) {
    this._tagName = tagName.toUpperCase()
    this._attributes = {}
    this._children = []
  }

  appendChild(node) {
    if (typeof node !== 'string') {
      node.parentNode = this
    }

    this._children.push(node)
  }

  hasAttribute(attributeName) {
    return this._attributes[attributeName] !== undefined
  }

  setAttribute(attributeName, attributeValue) {
    if (arguments.length < 2) {
      throw new TypeError(`Element.setAttribute: At least 2 arguments required, but only ${arguments.length} passed`)
    }

    if (hasForbiddenCharInAttrName(attributeName)) {
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
    this._attributes[attributeName] = undefined
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
      if (typeof child === 'string') {
        output += child
      } else {
        output += child.textContent
      }
    }

    return output
  }

  set textContent(value) {
    this._children = [value]
  }

  get children() {
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
      const attrValueHtml = replaceHtmlCharsInAttrValue(attrValue)

      html += ` ${attrName}="${attrValueHtml}"`
    }

    html += '>'

    if (isVoidElement) {
      return html
    }

    for (const child of this._children) {
      if (typeof child === 'string') {
        html += replaceHtmlCharsInContent(child)
      } else {
        html += child.outerHTML
      }
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
      if (typeof child === 'string') {
        html += replaceHtmlCharsInContent(child)
      } else {
        html += child.outerHTML
      }
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
      if (typeof child !== 'string') {
        child._attach(child)
      }
    }

    if (this.onAttach) {
      this.onAttach(this)
    }
  }
}

module.exports = Element
