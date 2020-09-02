'use strict'
/* eslint-disable prefer-arrow-callback */

const {
  parser,
  parse,
  parseToHtml,
  test,
} = require('../test-lib.js')

const Element = parser.Element

test('Element tagName', function (t) {
  const element = new Element('p')

  t.equal(element.tagName, 'P', 'tagName is uppercase')
  t.end()
})

test('Element.hasAttribute', function (t) {
  const element = new Element('p')

  t.equal(typeof element.hasAttribute, 'function', 'hasAttribute is a function')
  t.equal(element.hasAttribute('test'), false, 'hasAttribute is valid when false')

  element.setAttribute('test', 'value')

  t.equal(element.hasAttribute('test'), true, 'hasAttribute is valid when true')
  t.end()
})

test('Element.setAttribute/getAttribute', function (t) {
  const element = new Element('p')

  t.equal(typeof element.getAttribute, 'function', 'getAttribute is a function')
  t.equal(typeof element.setAttribute, 'function', 'setAttribute is a function')

  t.throws(() => {
    element.setAttribute()
  }, TypeError, 'setAttribute throws when 0 argument')

  t.throws(() => {
    element.setAttribute('test')
  }, TypeError, 'setAttribute throws when 1 argument')

  element.setAttribute('test', undefined)
  t.equal(element.getAttribute('test'), 'undefined', 'setAttribute works with undefined')

  element.setAttribute('test', null)
  t.equal(element.getAttribute('test'), 'null', 'setAttribute works with null')

  element.setAttribute('test', 1)
  t.equal(element.getAttribute('test'), '1', 'setAttribute works with a number')

  element.setAttribute('test', true)
  t.equal(element.getAttribute('test'), 'true', 'setAttribute works with a boolean')
  t.end()
})

test('Element.setAttribute with HTML special chars in attribute name', function (t) {
  const element = new Element('p')

  try {
    element.setAttribute('<', 'value')
  } catch (err) {
    t.notLooseEqual(err, null, '_<_ throws')
  }

  try {
    element.setAttribute('>', 'value')
  } catch (err) {
    t.notLooseEqual(err, null, '_>_ throws')
  }

  try {
    element.setAttribute('&', 'value')
  } catch (err) {
    t.notLooseEqual(err, null, '_&_ throws')
  }

  try {
    element.setAttribute('"', 'value')
  } catch (err) {
    t.notLooseEqual(err, null, '_"_ throws')
  }

  try {
    element.setAttribute('\'', 'value')
  } catch (err) {
    t.notLooseEqual(err, null, '_\'_ throws')
  }

  t.end()
})

test('Element.removeAttribute', function (t) {
  const element = new Element('p')

  t.equal(typeof element.removeAttribute, 'function', 'removeAttribute is a function')

  element.setAttribute('test', 'value')

  const output = element.removeAttribute('test')

  t.equal(output, undefined, 'removeAttribute returns the right value')
  t.equal(element.hasAttribute('test'), false, 'removeAttribute works')
  t.end()
})

test('Element.textContent with one element', function (t) {
  const element = new Element('p')
  element.textContent = 'Some text'

  t.equal(element.textContent, 'Some text', 'textContent is valid')
  t.end()
})

test('Element.textContent with multiple element', function (t) {
  const item1Node = new Element('li')
  item1Node.textContent = 'Item 1'

  const item2Node = new Element('li')
  item2Node.textContent = 'Item 2'

  const element = new Element('ul')
  element.appendChild(item1Node)
  element.appendChild(item2Node)

  const output = 'Item 1Item 2'

  t.equal(element.textContent, output, 'textContent is valid')
  t.end()
})

test('Element.textContent with embedded element', function (t) {
  const input = 'Text with *italic*'
  const textContent = 'Text with italic'
  const element = parse(input)

  t.equal(element.textContent, textContent, 'textContent is valid')
  t.end()
})

test('Element.textContent with image', function (t) {
  const input = '![Caption](image_url)'
  const textContent = 'Caption'
  const element = parse(input)

  t.equal(element.textContent, textContent, 'textContent is valid')
  t.end()
})

test('Element.textContent with void element', function (t) {
  const input = 'Pre-img![caption](link)Post img'
  const textContent = 'Pre-imgPost img'
  const element = parse(input)

  t.equal(element.textContent, textContent, 'textContent is valid')
  t.end()
})

test('Element.innerHTML, Element.outerHTML', function (t) {
  const input = 'This is a text'
  const element = parse(input)
  const innerHtmlOutput = '<p>This is a text</p>'
  const outerHtmlOutput = '<div><p>This is a text</p></div>'

  t.equal(element.innerHTML, innerHtmlOutput, 'innerHTML output is valid')
  t.equal(element.outerHTML, outerHtmlOutput, 'outerHTML output is valid')
  t.end()
})

test('Escape HTML special chars in attribute value', function (t) {
  const input = 'My evil image ![<>&"\'](some_url)'
  const output = '<p>My evil image <img src="some_url" alt="<>&amp;&quot;\'"></p>'

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Escape HTML special chars in content', function (t) {
  const input = '<>&"\''
  const output = '<p>&lt;&gt;&amp;"\'</p>'

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Element.id get/set', function (t) {
  const input = '# Title'
  const output = '<h1 id="some-id">Title</h1>'
  const opt = {
    onHeader: headerNode => {
      headerNode.id = 'some-id'

      t.equal(headerNode.id, 'some-id', 'Element.id output is valid')
      t.equal(headerNode.getAttribute('id'), 'some-id', 'Element.getAttribute("id") output is valid')
    },
  }

  t.equal(parseToHtml(input, opt), output, 'output is valid output is valid')
  t.end()
})

test('Element.className get/set', function (t) {
  const input = '# Title'
  const output = '<h1 class="some-class">Title</h1>'
  const opt = {
    onHeader: headerNode => {
      headerNode.className = 'some-class'

      t.equal(headerNode.className, 'some-class', 'Element.className output is valid')
      t.equal(headerNode.getAttribute('class'), 'some-class', 'Element.hasAttribute("class") output is valid')
    },
  }

  t.equal(parseToHtml(input, opt), output, 'output is valid output is valid')
  t.end()
})

test('Element.prepend', function (t) {
  const el1 = 'Text 1'

  const el2 = new Element('p')
  el2.textContent = 'Text 2'

  const el3 = 'Text 3'

  const el = new Element('div')
  el.textContent = 'Text 4'
  el.prepend(el1, el2, el3)

  t.equal(el.childNodes.length, 4, 'Number of childNodes is valid')
  t.equal(el.firstChild.textContent, 'Text 1', 'First child text is valid')
  t.equal(el.childNodes[1].tagName, 'P', '2nd child tagName is valid')
  t.equal(el.childNodes[1].textContent, 'Text 2', '2nd child text is valid')
  t.equal(el.childNodes[2].textContent, 'Text 3', '3rd child text is valid')
  t.equal(el.lastChild.textContent, 'Text 4', 'Original child is last')
  t.end()
})

test('Element.append', function (t) {
  const el2 = new Element('p')
  el2.textContent = 'Text 2'

  const el3 = 'Text 3'

  const el4 = 'Text 4'

  const el = new Element('div')
  el.textContent = 'Text 1'
  el.append(el2, el3, el4)

  t.equal(el.childNodes.length, 4, 'Number of childNodes is valid')
  t.equal(el.firstChild.textContent, 'Text 1', 'First child text is valid')
  t.equal(el.childNodes[1].tagName, 'P', '2nd child tagName is valid')
  t.equal(el.childNodes[1].textContent, 'Text 2', '2nd child text is valid')
  t.equal(el.childNodes[2].textContent, 'Text 3', '3rd child text is valid')
  t.equal(el.lastChild.textContent, 'Text 4', 'Original child is last')
  t.end()
})
