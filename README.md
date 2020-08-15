# Node.js Markdown to HTML Parser
<a href="README.md"><img src="./img/gb.svg" height="16px"></a>
<a href="README.fr.md"><img src="./img/fr.svg" height="16px"></a>

This Markdown-to-HTML parser uses a custom, lightweight, Markdown syntax.

It allows to create: italic, bold, strikethrough and superscript texts, headers, links, images, videos, inline codes, multiline codes, unordered lists, ordered lists, nested lists, horizontal lines, quotes and references.


## Usage

```javascript
const parser = require('@deskeen/markdown')
const html = parser.parse('some markdown text').toHtml()

// html === '<p>some markdown text</p>'
```

## Learn more

- [Installation](#installation)
- [Parser options](#parser-options)
- [Element object](#element-object)
- [Markdown syntax cheat sheet](#markdown-syntax-cheat-sheet)
- [Markdown syntax](#markdown-syntax)
  - [Italic text](#italic-text)
  - [Bold text](#bold-text)
  - [Bold-italic text](#bold-italic-text)
  - [Strikethrough text](#strikethrough-text)
  - [Superscript text](#superscript-text)
  - [Header](#header)
  - [Link](#link)
  - [Image](#image)
  - [Video](#video)
  - [Unordered list](#unordered-list)
  - [Ordered list](#ordered-list)
  - [Horizontal Line](#horizontal-line)
  - [Code](#code)
  - [Multiline Code](#multiline-code)
  - [Quote](#quote)
  - [Reference](#reference)
  - [Escape character](#escape-character)
  - [Newline](#newline)
- [Differences with standard Markdown syntax](#differences-with-standard-Markdown-syntax)
- [Examples](#examples)
  - [Add an identifier to headers](#add-an-identifier-to-headers)
  - [Open external links in a new tab](#open-external-links-in-a-new-tab)
  - [Add a base URL to images with a relative link](#add-a-base-url-to-images-with-a-relative-link)
  - [Add a CSS Class to inline codes](#add-a-css-class-to-inline-codes)
  - [Pretty print JSON objects](#pretty-print-json-objects)
- [Contact](#contact)
- [Licence](#licence)


## Installation

This package can be added to your [Node.js](https://nodejs.org/en/) dependencies by running:

```
npm install @deskeen/markdown`
```

To import the parser to your JavaScript code, use: 

```javascript
const parser = require('@deskeen/markdown')
```

To parse a text and transform it into HTML code, use:

```javascript
const htmlCode = parser.parse('some markdown text').toHtml()
```

The parser has been tested on Node.js v10+ but it may be working on previous Node.js versions too.


## Parser options

`parse(markdownText[, options]).toHtml()`

An option object can be passed to the parser.

Available options are:
- `allowHeader`: Whether headers are allowed. Defaults to `true`.
- `allowLink`: Whether links are allowed. Defaults to `true`.
- `allowImage`: Whether images are allowed. Defaults to `true`.
- `allowImageStyle`: Whether inline image styles are allowed. Defaults to `false`.
- `allowCode`: Whether inline codes are allowed. Defaults to `true`.
- `allowMultilineCode`: Whether multiline codes are allowed. Defaults to `true`.
- `allowUnorderedList`: Whether unordered lists are allowed. Defaults to `true`.
- `allowOrderedList`: Whether ordered lists are allowed. Defaults to `true`.
- `allowNestedList`: Whether nested lists are allowed. Defaults to `true`.
- `allowHorizontalLine`: Whether horizontal lines are allowed. Defaults to `true`.
- `allowQuote`: Whether quotes are allowed. Defaults to `true`.
- `allowReference`: Whether references are allowed. Defaults to `true`.
- `brOnBlankLine`: Whether to add a `<br />` tag on empty line. Defaults to `false`.
- `maxHeader`: Max header level. Number from 1 to 6 included. e.g. 2 means authorized header tags are `<h1>` and `<h2>`. Defaults to 6.

Callback functions can be passed to the options as well. They allow to edit the output [element](#element-object) (e.g. add custom attributes).

Available callbacks are:
- `onHeader`: Function called when a header is parsed.
- `onLink`: Function called when a link is parsed.
- `onImage`: Function called when an image is parsed.
- `onVideo`: Function called when a video is parsed.
- `onCode`: Function called when an inline code is parsed.
- `onMultilineCode`: Function called when a multiline code is parsed. Second argument is the (optional) language name.
- `onUnorderedList`: Function called when a unordered list is parsed. Second argument is the list level. `1` for top level lists and `2` for nested lists.
- `onOrderedList`: Function called when an ordered list is parsed. Second argument is the list level. `1` for top level lists and `2` for nested lists.
- `onHorizontalLine`: Function called when a horizontal line is parsed.
- `onQuote`: Function called when a quote is parsed.
- `onReference`: Function called when a reference is parsed.

The first argument of the callbacks is always the parsed [element](#element-object):

```javascript
function onXXX(element) {
 // Your logic here
 // e.g.: element.attr.class = ...
}
```


## Element object

The parser returns a custom `Element` object. 

Its properties are:
- `tagName`: Tag name. *String*
- `attr`: Element attributes. *Object*
- `children`: List of children. *Array*
- `firstChild`: First child. Can be null. *Element*
- `lastChild`: Last child. Can be null. *Element*
- `textContent`: Element text. *String*
- `toHtml()`: Returns HTML output. *String* 


## Markdown syntax cheat sheet

| Type                                      | Markdown syntax              |
| ----------------------------------------- | ---------------------------- |
| [Italic text](#italic-text)               | `*Italic text*`              |
| [Bold text](#bold-text)                   | `**Bold text**`              |
| [Bold-italic text](#bold-italic-text)     | `***Bold-italic text***`     |
| [Strikethrough text](#strikethrough-text) | `~~Strikethrough text~~`     |
| [Superscript text](#superscript-text)     | `^Superscript text^`         |
| [Header](#header)                         | `# Header`                   |
| [Link](#link)                             | `[Link text](link_url)`      |
| [Image](#image) and [Video](#video)       | `![Caption](image_url)`      |
| [Unordered list](#unordered-list)         | `- List item`                |
| [Unoredered nested list](#unordered-list) | <code>&nbsp;&nbsp;- Nested list item</code> |
| [Ordered list](#ordered-list)             | `+ Ordered list item`        |
| [Ordered nested list](#ordered-list)      | <code>&nbsp;&nbsp;+ Nested list item</code> |
| [Horizontal Line](#horizontal-line)       | `---`                        |
| [Code](#code)                             | `` `Code text` ``            |
| [Quote](#quote)                           | `> Quote`                    |
| [Reference](#reference)                   | `Reference[^1]`               |
| [Escape character](#escape-character)     | `\# Header not parsed`       |


## Markdown syntax

### Italic text

An italic text is surrounded by a single star (`*`).

*Example*
```
This is an *italic text*
```

```html
<p>This is an <em>italic text</em></p>
```


### Bold text

A bold text is surrounded by two stars (`**`).

*Example*
```
This is an **italic text**
```

```html
<p>This is an <strong>italic text</strong></p>
```


### Bold-italic text

A bold and italic text is surrounded by three stars (`***`).

*Example*
```
This is a ***bold and italic text***
```

```html
<p>This is a <strong><em>bold and italic text</em></strong></p>
```

### Strikethrough text

A strikethrough text is surrounded by two tildes (`~~`).

*Example*
```
This is a ~~strikethrough text~~
```

```html
<p>This is a <s>strikethrough text</s></p>
```


### Superscript text

A superscript text is surrounded by a circumflex (`^`).

*Example*
```
This is a ^superscript text^
```

```html
<p>This is a <sup>superscript text</sup></p>
```


### Header

A header starts with one to six hashes (`#`) followed by a space.

*Example*
```
# Title level 1
## Title level 2
### Title level 3
#### Title level 4
##### Title level 5
###### Title level 6
```

```html
<h1>Title level 1</h1>
<h2>Title level 2</h2>
<h3>Title level 3</h3>
<h4>Title level 4</h4>
<h5>Title level 5</h5>
<h6>Title level 6</h6>
```


### Link

A link is made up of two parts. The text surrounded by square brackets (`[]`) followed by an URL surrounded by round brackets (`( )`). i.e. `[Link](url)`

*Example*
```
This is a [link](https://example.com)
```

```html
<p>This is a <a href="https://example.com">link</a></p>
```


### Image

An image starts with an exclamation mark (`!`) followed by the caption surrounded by square brackets (`[]`), followed by the URL surrounded by round brackets (`( )`). i.e. `![caption](image_url)`

CSS instructions can be added to the end, surrounded by curly brackets (`{ }`). Instructions are separated by a semicolon (`;`). Parser flag  `allowImageStyle` must be turned on to make it work.

Images set on a separate line and inline images have different HTML outputs.

*Example of an inline image*
```
This is an ![inline image](https://example.com/some_image.png)
```

```html
<p>This is an <img src="https://example.com/some_image.png" alt="inline image" /></p>
```

*Example of an image on a single line*
```
![Image only on a line](https://example.com/some_image.png)
```

```html
<figure>
  <img src="https://example.com/some_image.png" alt="" />
  <figcaption>Image only on a line</figcaption>
</figure>
```

*Example of an image with inline style*
```
![Image with inline style](https://example.com/some_image.png){height: 100px; width: 100px}
```

```html
<figure style="height: 100px; width: 100px">
  <img src="https://example.com/some_image.png" alt="" />
  <figcaption>Image with inline style</figcaption>
</figure>
```


## Video

Videos work the same way as images, i.e. `![caption][video_url]`.

*Example*

```
![my caption][https://example.com/some_video.mp4]
```

```html
<figure>
  <video>
    <source src="https://example.com/some_video.mp4" type="video/mp4" />
  </video>
  <figcaption>my caption</figcaption>
</figure>
```


## Unordered list

Unordered list items start with a dash (`-`) followed by a space.

Nested list items start with at least one space, followed by a dash and a space.

*Example*
```
- Item 1
- Item 2
- Item 3
```

```html
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

*Example with nested list*
```
- Item 1
  - Item 1.1
  - Item 1.2
- Item 2
```

```html
<ul>
  <li>
    Item 1
    <ul>
      <li>Item 1.1</li>
      <li>Item 1.2</li>
    </ul>
  </li>
  <li>Item 2</li>
</ul>
```


## Ordered list

Ordered list items start with a plus sign (`+`) followed by a space.

Nested list items start with at least one space, followed by a plus sign and a space.

*Example*
```
+ Item 1
+ Item 2
+ Item 3
```

```html
<ol>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ol>
```

*Example with nested list*
```
+ Item 1
  + Item 1.1
  + Item 1.2
+ Item 2
```

```html
<ol>
  <li>
    Item 1
    <ol>
      <li>Item 1.1</li>
      <li>Item 1.2</li>
    </ol>
  </li>
  <li>Item 2</li>
  </ol>
```

## Horizontal Line

A Horizontal line is shown with three dashes (`---`).

*Example*
```
Above horizontal line
---
Below horizontal line
```

```html
<p>Above horizontal line</p>
<hr />
<p>Below horizontal line</p>
```


## Code

A technical text is surrounded by a single backtick (`\``)

*Example*
```
This is `some technical term`
```

```html
<p>This is <code>some technical term</code></p>
```


## Multiline Code

A multiline code is surrounded by three backticks (`\``) set on separate lines.

The language name of the code can be added to the opening backticks. It is shown in the output HTML but it is passed to the `onMultilineCode` callback. See example further down.

*Example*
```
\`\`\`
Some code line 1
Some code line 2
Some code line 3
\`\`\`
```

```html
<pre><code>Some code line 1
Some code line 2
Some code line 3</code></pre>
```

*Example with language name*
```
\`\`\`javascript
console.log('Hello World!')
\`\`\`
```

```html
<pre><code>console.log('Hello World!')</code></pre>
```


## Quote

A quote starts with a "greater than" sign (`>`).

*Example*
```
> Quote Line 1
> Quote Line 2
> Quote Line 3
```

```html
<blockquote>
  <p>Quote Line 1</p>
  <p>Quote Line 2</p>
  <p>Quote Line 3</p>
</blockquote>
```

## Reference

A reference is made up of: An opening square bracket (`[`), a circumflex (`^`), a reference number and a closing square brackets (`]`). e.g. `[^1]`

*Example*
```
This is the fist reference[^1].
And the second one[^2].
```

```html
<p>This is the fist reference<a href="#reference1"><sup>1</sup></a>.</p>
<p>And the second one<a href="#reference2"><sup>2</sup></a>.</p>
```

## Escape character

The escape character is a backslash (`\`). It can be used to tell the parser not to interpret Markdown syntax characters, i.e. `*`, `[`, `` ` ``, `!`, `#`, `~`, `^` and `\`.

*Example*
```
This \*bold text\* is not converted into html.
```

```html
<p>This *bold text* is not converted into html.</p>
```

*Example 2*
```
This backslash \ is not removed because it is not followed by a special character.
```

```html
<p>This backslash \ is not removed because it is not followed by a special character.</p>
```


## Newline

Newlines are ignored unless `brOnBlankLine` is true.

*Example*
```
Some text followed by two newlines.


Some more text.
```

```html
<p>Some text followed by two newlines.</p>
<p>Some more text.</p>
```

*Same Example with brOnBlankLine to true*

```html
<p>Some text followed by two newlines.</p>
<br />
<p>Some more text.</p>
```


## Differences with standard Markdown syntax

- Italic, bold and italic-bold texts with one, two and three underscore characters are not supported.
- Headers with underneath dashes/equal signs are not supported.
- Unordered Lists start with a dash, not a plus sign or a star.
- Ordered Lists start with a plus sign, not a number.
- New lines are not supported in lists.
- Escaping code with two backticks is not supported.
- Horizontal lines with stars or underscores are not supported.
- Image titles and Link titles are not supported.
- Links in between less-than and greater-than characters are not supported.
- HTML tags are not allowed.
- Strikethrough, superscript texts, videos, and references are supported.
- Images on a single line are embedded in a `figure` HTML tag.


## Examples

### Add an identifier to headers

```javascript
parseMarkdown('# Title 1', {
  onHeader: element => {
    // node.attr === { }
    // node.firstChild === 'Title 1'
    element.attr.id = element.firstChild.replace(/ /g, '-').toLowerCase()
  }
}).toHtml()
```

```html
<h1 id="title-1">Title 1</h1>
```


### Open external links in a new tab

```javascript
parseMarkdown('See [this page](https:/example.com)!', {
  onLink: element => {
    // element.attr.href === 'http:/example.com'

    if (element.attr.href.startsWith('https://MY_SITE.com') === false) {
      element.attr.target = '_blank'
    }
  }
}).toHtml()
```

```html
<p>See <a href="https:/example.com" target="_blank">this page</a>!</p>
```

### Add a base URL to images with a relative link

```javascript
parseMarkdown('![Beautiful image](beautiful_image.png)', {
  onImage: element => {
    // element.attr.src === 'beautiful_image.png'

    if (element.attr.src != null
    && element.attr.src.startsWith('http') === false) {
      element.attr.src = 'https://example.com/' + element.attr.src
    }
  }
}).toHtml()
```

```html
<figure>
  <img src="https://example.com/beautiful_image.png" alt="" />
  <figcaption>Beautiful image</figcaption>
</figure>
```

### Add a CSS Class to inline codes

```javascript
parseMarkdown('This is body html tag: `<body>`', {
  onCode: element => {
    element.attr.class = 'some-class'
  }
}).toHtml()
```

```html
<p>This is body html tag: <code class="some-class"><body></code></p>
```


### Pretty print JSON objects

```javascript
const markdownText = '```json\n{"some_property":"foo","some_other_property":"bar"}\n```'

parseMarkdown(markdownText, {
  onMultilineCode: (element, language) => {
    if (language === 'json') {
      // element is a <pre> tag that includes the <code> tag
      const codeElement = element.firstChild
      const codeText = codeElement.textContent
      const jsonObject = JSON.parse(codeText)

      codeElement.textContent = JSON.stringify(jsonObject, null, 2)
    }
  }
}).toHtml()
```

```html
<pre><code>{
  "some_property": "foo",
  "some_other_property": "bar"
}</code></pre>
```

## Contact

You can reach me at [my_firstname]@[my_name].fr


## Licence

MIT Licence - Copyright (c) Morgan Schmiedt