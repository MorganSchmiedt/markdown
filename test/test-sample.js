'use strict'
/* eslint-env node, es6 */
/* eslint-disable */

const parser = require('../src/markdown-node.js')
const parse = (input, opt) => parser.parse(input, opt).toHtml()

const trimI = text =>
  text[0]
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')

const input = '```json\n{"some_property":"foo","some_other_property":"bar"}\n```'

const output = parse(input, {
  onMultilineCode: (element, language) => {
    if (language === 'json') {
      // element is a <pre> element that includes the <code> element
      const codeElement = element.firstChild
      const jsonObj = JSON.parse(codeElement.textContent)
      codeElement.textContent = JSON.stringify(jsonObj, null, 2)
    }
  }
})

console.log(output)