# Node.js Markdown to HTML Parser

> Opinionated Markdown parser

This markdown parser supports: italic text, bold text, headers, links, images, inline codes, multiline codes, unordered lists, ordered lists, horizontal lines,  quotes and footnotes.


## Usage

`parse(markdownText[, options]).toHtml()`

```javascript
const parser = require('deskeen-markdown')
const output = parser.parse('some markdown text').toHtml()

// output === '<p>some markdown text</p>'
```

## Learn more

- [Parser options](#parser-options)
- [Element object](#element-object)
- [Supported Markdown syntax](#supported-markdown-syntax)
  - [Italic text](#italic-text)
  - [Bold text](#bold-text)
  - [Bold-italic text](#bold-italic-text)
  - [Header](#header)
  - [Link](#link)
  - [Image](#image)
  - [Unordered list](#unordered-list)
  - [Ordered list](#ordered-list)
  - [Horizontal Line](#horizontal-line)
  - [Code](#code)
  - [Multiline Code](#multiline-code)
  - [Quote](#quote)
  - [Footnote](#footnote)
- [Examples](#examples)
  - [Add an identifier to headers](#add-an-identifier-to-headers)
  - [Open external links in a new tab](#open-external-links-in-a-new-tab)
  - [Add a base URL to images with a relative link](#add-a-base-url-to-images-with-a-relative-link)
  - [Add a CSS Class to inline codes](#add-a-css-class-to-inline-codes)
  - [Pretty print JSON objects](#pretty-print-json-objects)


## Parser options

An option object can be passed to the parser.

Available options are:
- `allowHeader`: Whether headers are allowed. Defaults to `true`.
- `allowLink`: Whether links are allowed. Defaults to `true`.
- `allowImage`: Whether images are allowed. Defaults to `true`.
- `allowImageStyle`: Whether inline image styles are allowed. Defaults to `false`.
- `allowCode`: Whether inline codes are allowed. Defaults to `true`.
- `allowMultilineCode`: Whether multiline codes are allowed. Defaults to `true`.
- `allowUnorderedList`: Whether unordered lists are allowed. Defaults to `true`.
- `allowOrderedList`: Whether unordered lists are allowed. Defaults to `true`.
- `allowHorizontalLine`: Whether unordered lists are allowed. Defaults to `true`.
- `allowQuote`: Whether quotes are allowed. Defaults to `true`.
- `allowFootnote`: Whether footnotes are allowed. Defaults to `true`.
- `brOnBlankLine`: Whether to add a `<br />` tag on empty line. Defaults to `false`.

Callback functions can be added to the options as well. Callbacks allow to edit the output element (e.g. add custom attributes).

Available callbacks are:

- `onHeader`: Function called when a header is parsed.
- `onLink`: Function called when a link is parsed.
- `onImage`: Function called when an image is parsed.
- `onVideo`: Function called when a video is parsed.
- `onCode`: Function called when an inline code is parsed.
- `onMultilineCode`: Function called when a multiline code is parsed. Second argument is the (optional) language name.
- `onUnorderedList`: Function called when a unordered list is parsed.
- `onOrderedList`: Function called when an Ordered list is parsed.
- `onHozizontalLine`: Function called when a horizontal line is parsed.
- `onQuote`: Function called when a quote is parsed.
- `onFootnote`: Function called when a footnote is parsed.
- `onHorizontalLine`: Function called when a horizontal line is parsed.

The first argument of the callback functions is always the parsed element:

```javascript
function onXXX(element) {
 // Your logic here
 // e.g.: element.attr.class = ...
}
```


## Element object

The parser returns a custom Element object. 

Its properties are:
- `tagName`: Tag name. *String*
- `attr`: Element attributes. *Object*
- `children`: List of children. *Array*
- `firstChild`: Returns the first child. Can be null. *Custom Element*
- `lastChild`: Returns the last child. Can be null. *Custom Element*
- `toHtml`: Generate HTML output. *Function* 


## Supported Markdown syntax

### Italic text

Italic text is surrounded by a single star (`*`).

*Example*
```
This is an *italic text*
```

*Output*
```html
<p>This is an <em>italic text</em></p>
```


### Bold text

Bold text is surrounded by two stars (`**`).

*Example*
```
This is an **italic text**
```

*Output*
```html
<p>This is an <strong>italic text</strong></p>
```


### Bold-italic text

Bold-italic text is surrounded by three stars (`***`).

*Example*
```
This is a ***bold and italic text***
```

*Output*
```html
<p>This is a <strong><em>bold and italic text</em></strong></p>
```


### Header

Header starts with one, two, or three hashes (`#`).

*Example*
```
# Title
## Sub-title
### Sub-sub-title
```

*Output*
```html
<h1>Title</h1>
<h2>Sub-title</h2>
<h3>Sub-sub-title</h3>
```


### Link

Link is made up of two parts. The text surrounded by square brackets (`[]`) and an URL surrounded by round brackets (`( )`). e.g. `[Link](url)`

*Example*
```
This is a [link](https://deskeen.fr)
```

*Output*
```html
<p>This is a <a href="https://deskeen.fr">link</a></p>
```


### Image

Image starts with an exclamation mark (`!`) followed by the alt-text, surrounded by square brackets (`[]`), followed by the URL surrounded by round brackets (`( )`). e.g. `![Alternative image text](image_url)`

Images set on a separate line and inline images have different HTML output.

An CSS style can be added to the image by adding a semicolon (`;`) and the style next to the URL. `allowImageStyle` flag must be turned on.

*Example of inline image*
```
This is a ![some alt text](https://example.com/some_image.png)
```

*Output*
```html
<p>This is a <img src="https://example.com/some_image.png" alt="some alt text" /></p>
```

*Example of autonomous image*
```
![Image only on a line](https://example.com/some_image.png)
```

*Output*
```html
<figure>
  <img src="https://example.com/some_image.png" alt="" />
  <figcaption>Image only on a line</figcaption>
</figure>
```

*Example of image with inline style*
```
![Image with inline style](https://example.com/some_image.png;height:100px)
```

*Output*
```html
<figure style="height:100px">
  <img src="https://example.com/some_image.png" alt="" />
  <figcaption>Image with inline style</figcaption>
</figure>
```


## Unordered list

Unordered list items start with a dash (`-`) followed by a space.

*Example*
```
- Item 1
- Item 2
- Item 3
```

*Output*
```html
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```


## Ordered list

Ordered list items start with a plus sign (`+`) followed by a space.

*Example*
```
+ Item 1
+ Item 2
+ Item 3
```

*Output*
```html
<ol>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ol>
```


## Horizontal Line

Horizontal line is shown with three dashes (`---`).

*Example*
```
Above horizontal line
---
Below horizontal line
```

*Output*
```html
<p>Above horizontal line</p>
<hr />
<p>Below horizontal line</p>
```


## Code

Technical text is surrounded by a single backtick (`\``)

*Example*
```
This is `some technical term`
```

*Output*
```html
<p>This is <code>some technical term</code></p>
```


## Multiline Code

Multiline code-text is surrounded by three backticks (`\``) on separate lines.

The language name of the code can be added to the opening backtick tag. It is not added to the output HTML but it is passed to the `onMultilineCode` callback. See example further down.

*Example*
```
\`\`\`
Some code line 1
Some code line 2
Some code line 3
\`\`\`
```

*Output*
```html
<pre><code>Some code line 1
Some code line 2
Some code line 3</code></pre>
```

*Example2*
```
\`\`\`javascript
console.log('Hello World!')
\`\`\`
```

*Output*
```html
<pre><code>console.log('Hello World!')</code></pre>
```


## Quote

A quote starts with a "Greater Than" sign (`>`).

*Example*
```
> Quote Line 1
> Quote Line 2
> Quote Line 3
```

*Output*
```html
<blockquote>
  <p>Quote Line 1</p>
  <p>Quote Line 2</p>
  <p>Quote Line 3</p>
</blockquote>
```

## Footnote

A footnote is made up of: An opening square bracket (`[`), a circumflex sign (`^`), the footnote number and a closing square brackets (`]`). e.g. `[^1]`

*Example*
```
My first footnote[^1].
A second one[^2].
```

*Output*
```html
<p>My first footnote<a href="#footnote1"><sup>1</sup></a>.</p>
<p>A second one<a href="#footnote2"><sup>2</sup></a>.</p>
```


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

*Output*
```html
<h1 id="title-1">Title 1</h1>
```


### Open external links in a new tab

```javascript
parseMarkdown('See this [page](https:/example.com)!', {
  onLink: element => {
    // element.attr.href === 'http:/example.com'

    if (element.attr.href.startsWith('https://MY_SITE.com') === false) {
      element.attr.target = '_blank'
    }
  }
}).toHtml()
```

*Output*
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

*Output*
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

*Output*
```html
<p>This is body html tag: <code class="some-class"><body></code></p>
```


### Pretty print JSON objects

```javascript
const markdownText = '```json\n{"some_property":"foo","some_other_property":"bar"}\n```'

parseMarkdown(markdownText, {
  onMultilineCode: (element, language) => {
    if (language === 'json') {
      // element is a <pre> element that includes the <code> element
      const codeElement = element.firstChild
      const jsonObj = JSON.parse(codeElement.textContent)
      codeElement.textContent = JSON.stringify(jsonObj, null, 2)
    }
  }
}).toHtml()
```

*Output*
```html
<pre><code>{
  "some_property": "foo",
  "some_other_property": "bar"
}</code></pre>
```