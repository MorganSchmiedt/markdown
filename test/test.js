'use strict'
/* eslint-env node, es6 */
/* eslint-disable prefer-arrow-callback */

const test = require('tape')
const parser = require('../src/markdown.js')
const parse = (input, opt) => parser.parse(input, opt).toHtml()

const trimI = text =>
  text[0]
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')

const trimO = text =>
  text[0]
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('')

test('Text', function (t) {
  const input = 'My name is James Bond'
  const output = '<p>My name is James Bond</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Header', function (t) {
  const input = '# Title 1'
  const output = '<h1>Title 1</h1>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Header without leading space', function (t) {
  const input = '#Title 1'
  const output = '<p>#Title 1</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Header with callback', function (t) {
  const input = '# Title 1'
  const opt = {
    onHeader: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'h1', 'Tagname is valid')
      t.equal(node.firstChild, 'Title 1', 'Content is valid')
      t.end()
    },
  }

  parse(input, opt)
})

test('Header lvl 2', function (t) {
  const input = '## Sub-title 2'
  const output = '<h2>Sub-title 2</h2>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Header lvl 2 without leading space', function (t) {
  const input = '##Sub-title 2'
  const output = '<p>##Sub-title 2</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Header lvl 2 with callback', function (t) {
  const input = '## Sub-title 2'
  const opt = {
    onHeader: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'h2', 'Tagname is valid')
      t.equal(node.firstChild, 'Sub-title 2', 'Content is valid')
      t.end()
    },
  }

  parse(input, opt)
})

test('Header lvl 3', function (t) {
  const input = '### Sub sub title 3'
  const output = '<h3>Sub sub title 3</h3>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Header lvl 3 without leading space', function (t) {
  const input = '###Sub sub title 3'
  const output = '<p>###Sub sub title 3</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Header lvl 3 with callback', function (t) {
  const input = '### Sub sub title 3'
  const opt = {
    onHeader: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'h3', 'Tagname is valid')
      t.equal(node.firstChild, 'Sub sub title 3', 'Content is valid')
      t.end()
    },
  }

  parse(input, opt)
})

test('Header with allowHeader flag to false', function (t) {
  const input = trimI`
    # Title
    ## Sub-title
    ### Sub-sub-title`
  const output = trimO`
    <p># Title</p>
    <p>## Sub-title</p>
    <p>### Sub-sub-title</p>`
  const opt = {
    allowHeader: false,
  }

  t.equal(parse(input, opt), output, 'Output is valid')
  t.end()
})

test('Header with maxHeaderLevel to 2', function (t) {
  const input = trimI`
    # Title
    ## Sub-title
    ### Sub-sub-title`
  const output = trimO`
    <h1>Title</h1>
    <h2>Sub-title</h2>
    <p>### Sub-sub-title</p>`
  const opt = {
    maxHeader: 2,
  }

  t.equal(parse(input, opt), output, 'Output is valid')
  t.end()
})

test('Italic', function (t) {
  const input = 'An *italic* text'
  const output = '<p>An <em>italic</em> text</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Bold', function (t) {
  const input = 'A **bold** text'
  const output = '<p>A <strong>bold</strong> text</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Bold-italic', function (t) {
  const input = 'A ***bold-italic*** text'
  const output = '<p>A <strong><em>bold-italic</em></strong> text</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Strikethrough', function (t) {
  const input = 'A ~~strikethrough~~ text'
  const output = '<p>A <s>strikethrough</s> text</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Superscript', function (t) {
  const input = 'A ^superscript^ text'
  const output = '<p>A <sup>superscript</sup> text</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Link', function (t) {
  const input = 'This is a [link](https://example.com)'
  const output = '<p>This is a <a href="https://example.com">link</a></p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Link with callback', function (t) {
  const input = 'This is a [link](https://example.com)'
  const opt = {
    onLink: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'a', 'Tagname is valid')
      t.equal(node.attr.href, 'https://example.com', 'Node.attr.href is valid')
      t.equal(node.firstChild, 'link', 'Content is valid')
      t.end()
    },
  }

  parse(input, opt)
})

test('Link in italic', function (t) {
  const input = 'This is *a [link](https://example.com) in italic*'
  const output = '<p>This is <em>a <a href="https://example.com">link</a> in italic</em></p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Link with allowLink flag to false', function (t) {
  const input = 'This is a [link](https://example.com)'
  const output = '<p>This is a [link](https://example.com)</p>'
  const opt = {
    allowLink: false,
  }

  t.equal(parse(input, opt), output, 'Output is valid')
  t.end()
})

test('Image as a figure', function (t) {
  const input = '![alt text](https://example.com/image)'
  const output = trimO`
    <figure>
      <img src="https://example.com/image" alt="" />
      <figcaption>alt text</figcaption>
    </figure>`

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Image as a figure can NOT be styled by default', function (t) {
  const input = '![alt text](https://example.com/image;height:100px)'
  const output = trimO`
    <figure>
      <img src="https://example.com/image" alt="" />
      <figcaption>alt text</figcaption>
    </figure>`

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Image as a figure CAN be styled if allowImageStyle is true', function (t) {
  const input = '![alt text](https://example.com/image;height:100px)'
  const output = trimO`
    <figure style="height:100px">
      <img src="https://example.com/image" alt="" />
      <figcaption>alt text</figcaption>
    </figure>`
  const opt = {
    allowImageStyle: true,
  }

  t.equal(parse(input, opt), output, 'Output is valid')
  t.end()
})

test('Image as a figure with callback', function (t) {
  const input = '![alt text](https://example.com/image;height:100px)'
  const opt = {
    onImage: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'img', 'Tagname is valid')
      t.equal(node.firstChild, undefined, 'firstChild is undefined')
      t.end()
    },
  }

  parse(input, opt)
})

test('Image inline', function (t) {
  const input = 'This is an inline ![alt text](https://example.com/image)'
  const output = '<p>This is an inline <img src="https://example.com/image" alt="alt text" /></p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Image with style and default flag', function (t) {
  const input = 'This is an inline ![alt text](https://example.com/image){height: 100px}'
  const output = '<p>This is an inline <img src="https://example.com/image" alt="alt text" /></p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Image with style and allowImageStyle to true', function (t) {
  const input = 'This is an inline ![alt text](https://example.com/image){height: 100px; width: 50px} with style'
  const output = '<p>This is an inline <img src="https://example.com/image" alt="alt text" style="height: 100px; width: 50px" /> with style</p>'
  const opt = {
    allowImageStyle: true,
  }

  t.equal(parse(input, opt), output, 'Output is valid')
  t.end()
})

test('Image inline with callback', function (t) {
  const input = 'This is an inline ![alt text](https://example.com/image)'
  const opt = {
    onImage: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'img', 'Tagname is valid')
      t.equal(node.firstChild, undefined, 'firstChild is undefined')
      t.end()
    },
  }

  parse(input, opt)
})

test('Video', function (t) {
  const input = '![alt text](https://example.com/video.mp4)'
  const output = trimO`
    <figure>
      <video>
        <source src="https://example.com/video.mp4" type="video/mp4" />
      </video>
      <figcaption>alt text</figcaption>
    </figure>`

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Video with callback', function (t) {
  const input = '![alt text](https://example.com/video.mp4)'
  const opt = {
    onVideo: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'video', 'Tagname is valid')
      t.end()
    },
  }

  parse(input, opt)
})

test('Unordered List', function (t) {
  const input = trimI`
    - First list item
    - Second list item
    - Third list item`
  const output = trimO`
    <ul>
      <li>First list item</li>
      <li>Second list item</li>
      <li>Third list item</li>
    </ul>`

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Unordered List with complex texts', function (t) {
  const input = trimI`
    - *Italic* item
    - Item **bold**
    - Item ~~strikethrough~~
    - ^superscript^
    - [Link](url)`

  const output = trimO`
    <ul>
      <li><em>Italic</em> item</li>
      <li>Item <strong>bold</strong></li>
      <li>Item <s>strikethrough</s></li>
      <li><sup>superscript</sup></li>
      <li><a href="url">Link</a></li>
    </ul>`

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Unordered List with callback', function (t) {
  const input = trimI`
    Some text
    - List 1, Item 1
    - List 1, Item 2
    Not at the end of the file`

  const opt = {
    onUnorderedList: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'ul', 'Tagname is valid')
      t.equal(node.children.length, 2, 'Number of children is valid')
    },
  }

  parse(input, opt)

  const input2 = trimI`
    Some text
    - List 1, Item 1
    - List 1, Item 2 at the end of the file`

  const opt2 = {
    onUnorderedList: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'ul', 'Tagname is valid')
      t.equal(node.children.length, 2, 'Number of children is valid')
      t.end()
    },
  }

  parse(input2, opt2)
})

test('Unordered list with allowUnorderedList flag to false', function (t) {
  const input = trimI`
    - First list item
    - Second list item
    - Third list item`
  const output = trimO`
    <p>- First list item</p>
    <p>- Second list item</p>
    <p>- Third list item</p>`
  const opt = {
    allowUnorderedList: false,
  }

  t.equal(parse(input, opt), output, 'Output is valid')
  t.end()
})

test('Ordered List', function (t) {
  const input = trimI`
    + First list number
    + Second list number
    + Third list number`
  const output = trimO`
    <ol>
      <li>First list number</li>
      <li>Second list number</li>
      <li>Third list number</li>
    </ol>`

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Ordered List with callback', function (t) {
  const input = trimI`
    Some text
    + List 1, Item 1
    + List 1, Item 2
    Not at the end of the file`

  const opt = {
    onOrderedList: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'ol', 'Tagname is valid')
      t.equal(node.children.length, 2, 'Number of children is valid')
    },
  }

  parse(input, opt)

  const input2 = trimI`
    Some text
    + List 1, Item 1
    + List 1, Item 2 at the end of the file`

  const opt2 = {
    onOrderedList: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'ol', 'Tagname is valid')
      t.equal(node.children.length, 2, 'Number of children is valid')
      t.end()
    },
  }

  parse(input2, opt2)
})

test('Ordered list with allowOrderedList flag to false', function (t) {
  const input = trimI`
    + First list item
    + Second list item
    + Third list item`
  const output = trimO`
    <p>+ First list item</p>
    <p>+ Second list item</p>
    <p>+ Third list item</p>`
  const opt = {
    allowOrderedList: false,
  }

  t.equal(parse(input, opt), output, 'Output is valid')
  t.end()
})

test('Horizontal line', function (t) {
  const input = trimI`
    Pre line text
    ---
    Post line text`
  const output = trimO`
    <p>Pre line text</p>
    <hr />
    <p>Post line text</p>`

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Horizontal line with callback', function (t) {
  const input = trimI`
    Pre line text
    ---
    Post line text`
  const opt = {
    onHorizontalLine: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'hr', 'Tagname is valid')
      t.equal(node.firstChild, undefined, 'firstChild is undefined')
      t.end()
    },
  }

  parse(input, opt)
})

test('Horizontal line with allowHorizontalLine flag to false', function (t) {
  const input = trimI`
    Pre line text
    ---
    Post line text`
  const output = trimO`
    <p>Pre line text</p>
    <p>---</p>
    <p>Post line text</p>`
  const opt = {
    allowHorizontalLine: false,
  }

  t.equal(parse(input, opt), output, 'Output is valid')
  t.end()
})

test('Quote', function (t) {
  const input = trimI`
    > Blockquote line 1
    > Blockquote line2`
  const output = trimO`
    <blockquote>
      <p>Blockquote line 1</p>
      <p>Blockquote line2</p>
    </blockquote>`

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Quote with callback', function (t) {
  const input = trimI`
    > Blockquote line 1
    > Blockquote line2`
  const opt = {
    onQuote: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'blockquote', 'Tagname is valid')
      t.notEqual(node.children, null, 'Node has child(en)')
      t.equal(node.children.length, 2, 'Node has 2 children')
      t.end()
    },
  }

  parse(input, opt)
})

test('Quote with allowQuote flag to false', function (t) {
  const input = trimI`
    > Blockquote line 1
    > Blockquote line 2`
  const output = trimO`
    <p>&gt; Blockquote line 1</p>
    <p>&gt; Blockquote line 2</p>`
  const opt = {
    allowQuote: false,
  }

  t.equal(parse(input, opt), output, 'Output is valid')
  t.end()
})

test('Code', function (t) {
  const input = 'A `code` text'
  const output = '<p>A <code>code</code> text</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Code with callback', function (t) {
  const input = 'A `keyword` text'

  const opt = {
    onCode: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'code', 'Tagname is valid')
      t.equal(node.firstChild, 'keyword', 'Tagname is valid')
      t.end()
    },
  }

  parse(input, opt)
})

test('Code with allowCode flag to false', function (t) {
  const input = 'A `code` text'
  const output = '<p>A `code` text</p>'
  const opt = {
    allowCode: false,
  }

  t.equal(parse(input, opt), output, 'Output is valid')
  t.end()
})

test('Multiline code', function (t) {
  const input = trimI`
    \`\`\`
    Multiline code 1
    Multiline code 2
    \`\`\``
  const output = '<pre><code>Multiline code 1\nMultiline code 2</code></pre>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Multiline code with language name', function (t) {
  const input = trimI`
    \`\`\`javascript
    Multiline code 1
    Multiline code 2
    \`\`\``
  const output = '<pre><code>Multiline code 1\nMultiline code 2</code></pre>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Multiline code with callback', function (t) {
  const input = trimI`
    \`\`\`javascript
    Multiline code 1
    Multiline code 2
    \`\`\``

  const opt = {
    onMultilineCode: (node, language) => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'pre', 'Tagname is valid')
      t.equal(language, 'javascript', 'language is valid')
      t.end()
    },
  }

  parse(input, opt)
})

test('Multiline Code with allowMultilineCode flag to false', function (t) {
  const input = trimI`
    \`\`\`javascript
    Multiline code 1
    Multiline code 2
    \`\`\``
  const output = trimO`
    <p>\`\`\`javascript</p>
    <p>Multiline code 1</p>
    <p>Multiline code 2</p>
    <p>\`\`\`</p>`
  const opt = {
    allowMultilineCode: false,
  }

  t.equal(parse(input, opt), output, 'Output is valid')
  t.end()
})


test('br are NOT added on blank lines by default', function (t) {
  const input = 'Line 1\n\nLine 2'
  const output = '<p>Line 1</p><p>Line 2</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('br ARE added on blank lines if brOnBlankLine is true', function (t) {
  const input = 'Line 1\n\nLine 2'
  const output = '<p>Line 1</p><br /><p>Line 2</p>'
  const opt = {
    brOnBlankLine: true,
  }

  t.equal(parse(input, opt), output, 'Output is valid')
  t.end()
})

test('Footnotes', function (t) {
  const input = 'See footnote[^1]'
  const output = '<p>See footnote<a href="#footnote1"><sup>1</sup></a></p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Footnotes with callback', function (t) {
  const input = 'See footnote[^1]'
  const opt = {
    allowFootnote: true,
    onFootnote: node => {
      t.notEqual(node, null, 'Parameter is populated')
      t.equal(node.tagName, 'a', 'Tagname is valid')
      t.notEqual(node.firstChild, '1', 'firstChild is there')
      t.end()
    },
  }

  parse(input, opt)
})

test('Footnotes with allowFootnote to false', function (t) {
  const input = 'See footnote[^1]'
  const output = '<p>See footnote[^1]</p>'
  const opt = {
    allowFootnote: false,
  }

  t.equal(parse(input, opt), output, 'Output is valid')
  t.end()
})

test('Escape HTML special chars', function (t) {
  const input = '<script>Evil code &"\'👿</script>'
  const output = '<p>&lt;script&gt;Evil code &amp;&quot;&#x27;👿&lt;/script&gt;</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Escape "*"', function (t) {
  const input = 'Some \\*text*'
  const output = '<p>Some *text*</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Escape "["', function (t) {
  const input = 'This is a \\[link](https://example.com)'
  const output = '<p>This is a [link](https://example.com)</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Escape "`"', function (t) {
  const input = 'A \\`code` text'
  const output = '<p>A `code` text</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Escape "!"', function (t) {
  const input = '\\![link](https://example.com)'
  const output = '<p>!<a href="https://example.com">link</a></p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Escape "#"', function (t) {
  const input = '\\# Title escaped'
  const output = '<p># Title escaped</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Escape "~"', function (t) {
  const input = 'A \\~~strikethrough~~ text'
  const output = '<p>A ~~strikethrough~~ text</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Escape "^"', function (t) {
  const input = 'A \\^superscript^ text'
  const output = '<p>A ^superscript^ text</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Escape "\\"', function (t) {
  const input = 'A backslash: \\'
  const output = '<p>A backslash: \\</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})

test('Keep escaped char if not followed by a special char', function (t) {
  const input = 'Useless \\, backslash'
  const output = '<p>Useless \\, backslash</p>'

  t.equal(parse(input), output, 'Output is valid')
  t.end()
})
