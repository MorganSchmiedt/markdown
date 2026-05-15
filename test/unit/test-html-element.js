// @ts-check
import test from 'node:test'
import assert from 'node:assert'
import { parser, parse, parseToHtml } from '../test-lib.js'
/** @import { ParserOptions } from '../../src/markdown.js' */

const Element = parser.Element
const Text = parser.Text

test('Element tagName', () => {
  const element = new Element('p')

  assert.strictEqual(element.tagName, 'P', 'tagName is uppercase')
})

test('Element.hasAttribute', () => {
  const element = new Element('p')

  assert.strictEqual(typeof element.hasAttribute, 'function', 'hasAttribute is a function')
  assert.strictEqual(element.hasAttribute('test'), false, 'hasAttribute is valid when false')

  element.setAttribute('test', 'value')

  assert.strictEqual(element.hasAttribute('test'), true, 'hasAttribute is valid when true')
})

test('Element.setAttribute/getAttribute', () => {
  const element = new Element('p')

  assert.strictEqual(typeof element.getAttribute, 'function', 'getAttribute is a function')
  assert.strictEqual(typeof element.setAttribute, 'function', 'setAttribute is a function')

  assert.throws(() => {
    // @ts-ignore
    element.setAttribute()
  }, TypeError, 'setAttribute throws when 0 argument')

  assert.throws(() => {
    element.setAttribute('test')
  }, TypeError, 'setAttribute throws when 1 argument')

  element.setAttribute('test', undefined)
  assert.strictEqual(element.getAttribute('test'), 'undefined', 'setAttribute works with undefined')

  element.setAttribute('test', null)
  assert.strictEqual(element.getAttribute('test'), 'null', 'setAttribute works with null')

  element.setAttribute('test', 1)
  assert.strictEqual(element.getAttribute('test'), '1', 'setAttribute works with a number')

  element.setAttribute('test', true)
  assert.strictEqual(element.getAttribute('test'), 'true', 'setAttribute works with a boolean')
})

test('Element.setAttribute with HTML special chars in attribute name', () => {
  const element = new Element('p')

  try {
    element.setAttribute('<', 'value')
  } catch (err) {
    assert.notEqual(err, null, '_<_ throws')
  }

  try {
    element.setAttribute('>', 'value')
  } catch (err) {
    assert.notEqual(err, null, '_>_ throws')
  }

  try {
    element.setAttribute('&', 'value')
  } catch (err) {
    assert.notEqual(err, null, '_&_ throws')
  }

  try {
    element.setAttribute('"', 'value')
  } catch (err) {
    assert.notEqual(err, null, '_"_ throws')
  }

  try {
    element.setAttribute('\'', 'value')
  } catch (err) {
    assert.notEqual(err, null, '_\'_ throws')
  }
})

test('Element.removeAttribute', () => {
  const element = new Element('p')

  assert.strictEqual(typeof element.removeAttribute, 'function', 'removeAttribute is a function')

  element.setAttribute('test', 'value')

  const output = element.removeAttribute('test')

  assert.strictEqual(output, undefined, 'removeAttribute returns the right value')
  assert.strictEqual(element.hasAttribute('test'), false, 'removeAttribute works')
  assert.strictEqual(element.outerHTML, '<p></p>', 'outerHTML works')
})

test('Element.textContent with one element', () => {
  const element = new Element('p')
  element.textContent = 'Some text'

  assert.strictEqual(element.textContent, 'Some text', 'textContent is valid')
})

test('Element.textContent sets to null', () => {
  const element = new Element('div')
  element.setAttribute('foo', 'bar')
  element.append(new Element('p'))
  element.append(new Element('p'))
  element.textContent = null

  assert.strictEqual(element.outerHTML, '<div foo="bar"></div>', 'textContent is valid')
})

test('Element.textContent sets to empty string', () => {
  const element = new Element('div')
  element.setAttribute('foo', 'bar')
  element.append(new Element('p'))
  element.append(new Element('p'))
  element.textContent = ''

  assert.strictEqual(element.outerHTML, '<div foo="bar"></div>', 'textContent is valid')
})

test('Element.textContent with multiple element', () => {
  const item1Node = new Element('li')
  item1Node.textContent = 'Item 1'

  const item2Node = new Element('li')
  item2Node.textContent = 'Item 2'

  const element = new Element('ul')
  element.appendChild(item1Node)
  element.appendChild(item2Node)

  const output = 'Item 1Item 2'

  assert.strictEqual(element.textContent, output, 'textContent is valid')
})

test('Element.textContent with embedded element', () => {
  const input = 'Text with *italic*'
  const textContent = 'Text with italic'
  const element = parse(input)

  assert.strictEqual(element.textContent, textContent, 'textContent is valid')
})

test('Element.textContent with an image', () => {
  const input = '![alt text](image_url)'
  const textContent = ''
  const element = parse(input)

  assert.strictEqual(element.textContent, textContent, '')
})

test('Element.textContent with an image and a caption', () => {
  const input = '![alt text](image_url "caption")'
  const textContent = 'caption'
  const element = parse(input)

  assert.strictEqual(element.textContent, textContent, 'caption')
})

test('Element.textContent with void element', () => {
  const input = 'Pre-img![caption](link)Post img'
  const textContent = 'Pre-imgPost img'
  const element = parse(input)

  assert.strictEqual(element.textContent, textContent, 'textContent is valid')
})

test('Element.innerHTML, Element.outerHTML', () => {
  const input = 'This is a text'
  const element = parse(input)
  const innerHtmlOutput = '<p>This is a text</p>'
  const outerHtmlOutput = '<div><p>This is a text</p></div>'

  assert.strictEqual(element.innerHTML, innerHtmlOutput, 'innerHTML output is valid')
  assert.strictEqual(element.outerHTML, outerHtmlOutput, 'outerHTML output is valid')
})

test('Escape HTML special chars in attribute value', () => {
  const input = 'My evil image ![<>&"\'](some_url)'
  const output = '<p>My evil image <img src="some_url" alt="<>&amp;&quot;\'"></p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Escape HTML special chars in content', () => {
  const input = '<>&"\''
  const output = '<p>&lt;&gt;&amp;"\'</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Element.id get/set', () => {
  const input = '# Title'
  const output = '<h1 id="some-id">Title</h1>'
  /** @type {ParserOptions} */
  const opt = {
    onHeader: headerNode => {
      headerNode.id = 'some-id'

      assert.strictEqual(headerNode.id, 'some-id', 'Element.id output is valid')
      assert.strictEqual(headerNode.getAttribute('id'), 'some-id', 'Element.getAttribute("id") output is valid')
    },
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'output is valid output is valid')
})

test('Element.className get/set', () => {
  const input = '# Title'
  const output = '<h1 class="some-class">Title</h1>'
  /** @type {ParserOptions} */
  const opt = {
    onHeader: headerNode => {
      headerNode.className = 'some-class'

      assert.strictEqual(headerNode.className, 'some-class', 'Element.className output is valid')
      assert.strictEqual(headerNode.getAttribute('class'), 'some-class', 'Element.hasAttribute("class") output is valid')
    },
  }

  assert.strictEqual(parseToHtml(input, opt), output, 'output is valid output is valid')
})

test('Element.prepend', () => {
  const el1 = 'Text 1'

  const el2 = new Element('p')
  el2.textContent = 'Text 2'

  const el3 = 'Text 3'

  const el = new Element('div')
  el.textContent = 'Text 4'
  el.prepend(el1, el2, el3)

  assert.strictEqual(el.childNodes.length, 4, 'Number of childNodes is valid')
  assert.strictEqual(el.firstChild.textContent, 'Text 1', 'First child text is valid')
  // @ts-ignore
  assert.strictEqual(el.childNodes[1].tagName, 'P', '2nd child tagName is valid')
  assert.strictEqual(el.childNodes[1].textContent, 'Text 2', '2nd child text is valid')
  assert.strictEqual(el.childNodes[2].textContent, 'Text 3', '3rd child text is valid')
  assert.strictEqual(el.lastChild?.textContent, 'Text 4', 'Original child is last')
})

test('Element.append', () => {
  const el2 = new Element('p')
  el2.textContent = 'Text 2'

  const el3 = 'Text 3'

  const el4 = 'Text 4'

  const el = new Element('div')
  el.textContent = 'Text 1'
  el.append(el2, el3, el4)

  assert.strictEqual(el.childNodes.length, 4, 'Number of childNodes is valid')
  assert.strictEqual(el.firstChild.textContent, 'Text 1', 'First child text is valid')
  // @ts-ignore
  assert.strictEqual(el.childNodes[1].tagName, 'P', '2nd child tagName is valid')
  assert.strictEqual(el.childNodes[1].textContent, 'Text 2', '2nd child text is valid')
  assert.strictEqual(el.childNodes[2].textContent, 'Text 3', '3rd child text is valid')
  assert.strictEqual(el.lastChild?.textContent, 'Text 4', 'Original child is last')
})

test('Element.removeChild', () => {
  assert.throws(() => {
    // @ts-ignore
    new Element('p').removeChild()
  }, TypeError, 'Node.removeChild: At least 1 argument required, but only 0 passed')

  assert.throws(() => {
    new Element('p').removeChild(new Element('div'))
  }, Error, 'Node.removeChild: The node to be removed is not a child of this node')

  const el0 = new Element('div')
  el0.appendChild(new Element('p'))

  assert.throws(() => {
    el0.removeChild(new Element('p'))
  }, Error, 'Node.removeChild: The node to be removed is not a child of this node')

  const elChild1 = new Element('p')
  elChild1.textContent = 'Child 1'

  const elChild2 = new Element('p')
  elChild2.textContent = 'Child 2'

  const el = new Element('div')
  el.appendChild(elChild1)
  el.appendChild(elChild2)
  const removedChild = el.removeChild(elChild2)
  assert.strictEqual(el.childNodes.length, 1, 'Child is removed')
  assert.strictEqual(el.lastChild?.textContent, 'Child 1', 'Remaining child is valid')
  assert.strictEqual(elChild2.parentNode, null, 'Removed child parentNode is null')
  assert.strictEqual(removedChild?.textContent, 'Child 2', 'return value is valid')

  const textChild = new Text('Text 1')
  el.appendChild(textChild)
  assert.strictEqual(el.lastChild?.textContent, 'Text 1', 'Text Element added')
  el.removeChild(textChild)
  assert.strictEqual(el.lastChild?.textContent, 'Child 1', 'Text Element removed')
})

test('Element.remove', () => {
  assert.strictEqual(new Element('p').remove(), undefined, 'no return value if no parent')

  const elChild1 = new Element('p')
  elChild1.textContent = 'Child 1'

  const elChild2 = new Element('p')
  elChild2.textContent = 'Child 2'

  const el = new Element('div')
  el.appendChild(elChild1)
  el.appendChild(elChild2)
  const removedChild = elChild2.remove()
  assert.strictEqual(el.childNodes.length, 1, 'Child is removed')
  assert.strictEqual(el.firstChild.textContent, 'Child 1', 'Remaining child is valid')
  assert.strictEqual(elChild2.parentNode, null, 'Remaining child parentNode is null')
  assert.strictEqual(removedChild?.textContent, 'Child 2', 'return value is valid')
})

test('Element.lastChildElement', () => {
  const el1 = new Element('div')
  el1.textContent = 'Text 1'

  const container = new Element('div')
  container.appendChild(el1)
  container.appendChild(new Text('test'))

  assert.notEqual(container.lastChildElement, null, 'lastChildElement is not null')
  assert.strictEqual(container.lastChildElement?.textContent, 'Text 1', 'lastChildElement is valid')
})
