// @ts-check
import { parse } from './test-lib.js'

const input = `
  ![alt text](https://example.com/image){style=height:100px}`

const element = parse(input, {
  allowHTMLAttributes: true,
})

console.log(element.innerHTML)
