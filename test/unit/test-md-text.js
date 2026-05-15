// @ts-check
import test from 'node:test'
import assert from 'node:assert'
import { parseToHtml } from '../test-lib.js'
/** @import { ParserOptions } from '../../src/markdown.js' */

test('Text', () => {
  const input = 'My name is James Bond'
  const output = '<p>My name is James Bond</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Paragraph', () => {
  const input = 'Line 1\n\nLine 2'
  const output = '<p>Line 1</p><p>Line 2</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Paragraph with extra newlines', () => {
  const input = 'Line 1\n\n\n\nLine 2'
  const output = '<p>Line 1</p><p>Line 2</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Line of spaces are considered empty', () => {
  const input = 'Line 1\n  \nLine 2'
  const output = '<p>Line 1</p><p>Line 2</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Italic', () => {
  const input = 'An *italic* text'
  const output = '<p>An <em>italic</em> text</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Bold', () => {
  const input = 'A **bold** text'
  const output = '<p>A <strong>bold</strong> text</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Bold-italic', () => {
  const input = 'A ***bold-italic*** text'
  const output = '<p>A <strong><em>bold-italic</em></strong> text</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Emphasis with leading *', () => {
  const input = '(***) As per our study'
  const output = '<p>(***) As per our study</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Emphasis with preceding/following *', () => {
  const input = 'As per (**) and (***)'
  const output = '<p>As per (**) and (***)</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Emphasis with leading space', () => {
  const input = 'An * italic* text'
  const output = '<p>An * italic* text</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Emphasis with trailing space', () => {
  const input = 'An *italic * text'
  const output = '<p>An *italic * text</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('2 Emphasis on the same line', () => {
  const input = 'A *1* and a *2*.'
  const output = '<p>A <em>1</em> and a <em>2</em>.</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Emphasis with wrong end tag inside: space+*', () => {
  const input = 'An *italic *tes t* text'
  const output = '<p>An <em>italic *tes t</em> text</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Strikethrough', () => {
  const input = 'A ~~strikethrough~~ text'
  const output = '<p>A <s>strikethrough</s> text</p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Superscript without parenthesis', () => {
  const input = 'A formula x^2 + y^3 + z^10'
  const output = '<p>A formula x<sup>2</sup> + y<sup>3</sup> + z<sup>10</sup></p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})

test('Superscript with parenthesis', () => {
  const input = 'A formula x^(2) + y^(a - b)'
  const output = '<p>A formula x<sup>2</sup> + y<sup>a - b</sup></p>'

  assert.strictEqual(parseToHtml(input), output, 'Output is valid')
})
