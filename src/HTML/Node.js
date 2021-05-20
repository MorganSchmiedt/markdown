'use strict'

const Text = require('./Text.js')

class Node {
  constructor() {
    this._children = []
    this._parentNode = null
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

  appendChild(node) {
    if (node._parentNode != null) {
      node._parentNode.removeChild(node)
    }
    node._parentNode = this

    this._children.push(node)
  }

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
}

module.exports = Node
