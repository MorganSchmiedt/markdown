// @ts-check
import test from 'node:test'
import assert from 'node:assert'
import { parser } from '../test-lib.js'

test('Module Exports', () => {
  assert.strictEqual(typeof parser.Element, 'function', 'Element is there')
  assert.strictEqual(typeof parser.Text, 'function', 'Text is there')
  assert.strictEqual(typeof parser.parse, 'function', 'parse is there')
})
