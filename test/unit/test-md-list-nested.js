'use strict'
/* eslint-disable prefer-arrow-callback */

const {
  parse,
  parseToHtml,
  inlineHtml,
  test,
} = require('../test-lib.js')

test('Unordered Nested List', function (t) {
  const input = `
    - Item 1
      - Item 1.1
    - Item 2
      - Item 2.1
      - Item 2.2
    Some text
    - Item 3
    - Item 4`

  const output = inlineHtml`
    <ul>
      <li>
        Item 1
        <ul>
          <li>Item 1.1</li>
        </ul>
      </li>
      <li>
        Item 2
        <ul>
          <li>Item 2.1</li>
          <li>Item 2.2</li>
        </ul>
      </li>
    </ul>
    <p>Some text</p>
    <ul>
      <li>Item 3</li>
      <li>Item 4</li>
    </ul>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Nested List with only 1 space', function (t) {
  const input = `
    - Item 1
     - Item 1.1`

  const output = inlineHtml`
    <ul>
      <li>Item 1</li>
    </ul>
    <p> - Item 1.1</p>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Ordered Nested List', function (t) {
  const input = `
    1. Item 1
       1. Item 1.1
    2. Item 2
       1. Item 2.1
       2. Item 2.2
    Some text
    3. Item 3
    4. Item 4`

  const output = inlineHtml`
    <ol>
      <li>
        Item 1
        <ol>
          <li>Item 1.1</li>
        </ol>
      </li>
      <li>
        Item 2
        <ol>
          <li>Item 2.1</li>
          <li>Item 2.2</li>
        </ol>
      </li>
    </ol>
    <p>Some text</p>
    <ol>
      <li>Item 3</li>
      <li>Item 4</li>
    </ol>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Nested Ord. List with only 2 spaces', function (t) {
  const input = `
    1. Item 1
      1. Item 1.1`

  const output = inlineHtml`
    <ol>
      <li>Item 1</li>
    </ol>
    <p>  1. Item 1.1</p>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Nested List with ordered in unordered', function (t) {
  const input = `
    - Item 1
      1. Item 1.1
      2. Item 1.2
    - Item 2`

  const output = inlineHtml`
    <ul>
      <li>
        Item 1
        <ol>
          <li>Item 1.1</li>
          <li>Item 1.2</li>
        </ol>
      </li>
      <li>Item 2</li>
    </ul>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Nested List with unordered in ordered', function (t) {
  const input = `
    1. Item 1
       - Item 1.1
       - Item 1.2
    2. Item 2`

  const output = inlineHtml`
    <ol>
      <li>
        Item 1
        <ul>
          <li>Item 1.1</li>
          <li>Item 1.2</li>
        </ul>
      </li>
      <li>Item 2</li>
    </ol>`

  t.equal(parseToHtml(input), output, 'Output is valid')
  t.end()
})

test('Nested unordered List with callback', function (t) {
  const input = `
    - Item 1
      - Item 1.1
      - Item 1.2
    - Item 2
    - Item 3`

  let level = 2

  const opt = {
    onUnorderedList: node => {
      if (level === 1) {
        t.equal(node.children.length, 3, 'Level 1: Number of children is valid')
      } else if (level === 2) {
        t.equal(node.children.length, 2, 'Level 2: Number of children is valid')
        level -= 1
      }
    },
  }

  t.plan(2)
  parse(input, opt)
})

test('Nested ordered List with callback', function (t) {
  const input = `
    1. Item 1
       1. Item 1.1
       2. Item 1.2`

  let level = 2

  const opt = {
    onOrderedList: node => {
      if (level === 1) {
        t.equal(node.children.length, 1, 'Level 1: Number of children is valid')
      } else {
        t.equal(node.children.length, 2, 'Level 2: Number of children is valid')
        level -= 1
      }
    },
  }

  t.plan(2)
  parse(input, opt)
})

test('Nested List with ordered in unordered and callback', function (t) {
  const input = `
    - Item 1
      1. Item 1.1
      2. Item 1.2
      3. Item 1.3
    - Item 2`

  const opt = {
    onUnorderedList: node => {
      t.equal(node.children.length, 2, 'Children count in unord list is valid')
    },
    onOrderedList: node => {
      t.equal(node.children.length, 3, 'Children count in ord list is valid')
    },
  }

  t.plan(2)
  parse(input, opt)
  t.end()
})

test('Unordered Nested List with allowUnorderedNestedList to false', function (t) {
  const input = `
    - Item 1
      - Item 1.1`

  const output = inlineHtml`
    <ul>
      <li>Item 1</li>
    </ul>
    <p>  - Item 1.1</p>`

  const opt = {
    allowUnorderedNestedList: false,
  }

  t.equal(parseToHtml(input, opt), output, 'Output is valid')
  t.end()
})

test('Ordered Nested List with allowOrderedNestedList to false', function (t) {
  const input = `
    1. Item 1
       1. Item 1.1`

  const output = inlineHtml`
    <ol>
      <li>Item 1</li>
    </ol>
    <p>   1. Item 1.1</p>`

  const opt = {
    allowOrderedNestedList: false,
  }

  t.equal(parseToHtml(input, opt), output, 'Output is valid')
  t.end()
})
