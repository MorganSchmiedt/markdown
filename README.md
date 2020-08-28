# Node.js Markdown to HTML Parser
<a href="README.md"><img src="./img/gb.svg" height="16px"></a>
<a href="README.fr.md"><img src="./img/fr.svg" height="16px"></a>

This Markdown-to-HTML parser uses a custom, lightweight, Markdown syntax.

It allows to create: italic, bold, strikethrough and superscript texts, headers, links, images, videos, inline codes, multiline codes, unordered lists, ordered lists, nested lists, horizontal lines, quotes and references.

A browser module is also available here: [@deskeen/markdown-browser](https://github.com/deskeen/markdown-browser)


## Usage

```javascript
const parser = require('@deskeen/markdown')
const html = parser.parse('some markdown text').innerHTML

// html === '<p>some markdown text</p>'
```

## Learn more

- [Installation](#installation)
- [Parser options](#parser-options)
- [Element object](#element-object)
- [Markdown syntax cheatsheet](#markdown-syntax-cheatsheet)
- [Markdown syntax](#markdown-syntax)
  - [Italic text](#italic-text)
  - [Bold text](#bold-text)
  - [Bold-italic text](#bold-italic-text)
  - [Strikethrough text](#strikethrough-text)
  - [Superscript text](#superscript-text)
  - [Paragraph](#paragraph)
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
- [Differences with other Markdown syntaxes](#differences-with-other-markdown-syntaxes)
- [Unsupported syntaxes](#unsupported-syntaxes)
- [Examples](#examples)
  - [Add an identifier to headers](#add-an-identifier-to-headers)
  - [Open external links in a new tab](#open-external-links-in-a-new-tab)
  - [Add a base URL to images with a relative link](#add-a-base-url-to-images-with-a-relative-link)
  - [Add a CSS Class to inline codes](#add-a-css-class-to-inline-codes)
  - [Pretty print JSON objects](#pretty-print-json-objects)
- [Other ressources](#other-ressources)
- [FAQ](#faq)
- [Contact](#contact)
- [Licence](#licence)


## Installation

This package can be added to your [Node.js](https://nodejs.org/en/) dependencies by running:

```
npm install @deskeen/markdown
```

To import the parser to your JavaScript code, use: 

```javascript
const parser = require('@deskeen/markdown')
```

To parse a text and transform it into HTML, use:

```javascript
const htmlCode = parser.parse('some markdown text').innerHTML
```

The parser has been tested with Node.js v10+ but it may be working with older Node.js versions too.


## Parser options

`const element = parse(markdownText[, options])`

An option object can be passed to the parser.

Available options are:
- `allowHeader`: Whether headers are allowed. Defaults to `true`.
- `allowLink`: Whether links are allowed. Defaults to `true`.
- `allowImage`: Whether images are allowed. Defaults to `true`.
- `allowImageStyle`: Whether inline image styles are allowed. Defaults to `false`.
- `allowCode`: Whether inline codes are allowed. Defaults to `true`.
- `allowMultilineCode`: Whether multiline codes are allowed. Defaults to `true`.
- `allowUnorderedList`: Whether unordered lists are allowed. Defaults to `true`.
- `allowUnorderedNestedList`: Whether unordered nested lists are allowed. Defaults to `true`.
- `allowOrderedList`: Whether ordered lists are allowed. Defaults to `true`.
- `allowOrderedNestedList`: Whether ordered nested lists are allowed. Defaults to `true`.
- `allowHorizontalLine`: Whether horizontal lines are allowed. Defaults to `true`.
- `allowQuote`: Whether quotes are allowed. Defaults to `true`.
- `allowReference`: Whether references are allowed. Defaults to `true`.
- `maxHeader`: Max header level. Number from 1 to 6 included. e.g. 2 means authorized header tags are `<h1>` and `<h2>`. Defaults to 6.

Callback functions can be passed to the options as well. They allow to edit the output [element](#element-object) (e.g. add custom attributes).

Available callbacks are:
- `onHeader`: Function called when a header is parsed.
- `onLink`: Function called when a link is parsed.
- `onImage`: Function called when an image is parsed.
- `onVideo`: Function called when a video is parsed.
- `onCode`: Function called when an inline code is parsed.
- `onMultilineCode`: Function called when a multiline code is parsed. The second argument is the (optional) language name.
- `onUnorderedList`: Function called when a unordered list is parsed.
- `onOrderedList`: Function called when an ordered list is parsed.
- `onHorizontalLine`: Function called when a horizontal line is parsed.
- `onQuote`: Function called when a quote is parsed.
- `onReference`: Function called when a reference is parsed. The second argument contains the reference.

The first argument of the callbacks is always the parsed [element](#element-object):

```javascript
function onXXX(element) {
 // Your logic here
 // e.g.: element.className = 'css-class'
}
```


## Element object

The parser returns a custom `Element` that is similar to a DOM Element in the browser.

Available properties are:
- `tagName`: Tag name of the element. [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName)
- `id`: id attribute of the element. [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/id)
- `className`: Class attribute of the element. [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName)
- `attributes`: Element attributes. [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes)
- `children`: List of children. [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children)
- `firstChild`: First child. [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Node/firstChild)
- `lastChild`: Last child. [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Node/lastChild)
- `parentNode`: Parent of the element. [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode)
- `textContent`: Text of the element and its descendants. [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
- `hasAttribute(attrName)`: Returns whether the element has the specified attribute. [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute)
- `setAttribute(attrName, attrValue)`: Adds an attribute to the element.( [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute)
- `getAttribute(attrName)`: Returns an element attribute. [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute)
- `removeAttribute(attrName)`: Removes an element attribute. [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute)
- `innerHTML`: Returns the HTML markup of the elements contained in the element. [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
- `outerHTML`: Returns the HTML markup of the element and its descendants.( [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/outerHTML)

New elements can be created by using the `Element` class and text can be created using the `Text` class:

```javascript
const { Element, Text } = require('@deskeen/markdown')

const myDivElement = new Element('div')
const myText = new Text('Some text')
```


## Markdown syntax cheatsheet

| Type                                      | Markdown syntax              |
| ----------------------------------------- | ---------------------------- |
| [Italic text](#italic-text)               | `*Italic text*`              |
| [Bold text](#bold-text)                   | `**Bold text**`              |
| [Bold-italic text](#bold-italic-text)     | `***Bold-italic text***`     |
| [Strikethrough text](#strikethrough-text) | `~~Strikethrough text~~`     |
| [Superscript text](#superscript-text)     | `^Superscript`               |
| [Header](#header)                         | `# Header`                   |
| [Link](#link)                             | `[Link text](link_url)`      |
| [Image](#image) and [Video](#video)       | `![Caption](image_url)`      |
| [Unordered list](#unordered-list)         | `- List item`                |
| [Unordered nested list](#unordered-list)  | 2 spaces                     |
| [Ordered list](#ordered-list)             | `+ Ordered list item`        |
| [Ordered nested list](#ordered-list)      | 3 spaces                     |
| [Horizontal Line](#horizontal-line)       | `\n\n---\n\n`                |
| [Inline Code](#code)                      | `` `Code text` ``            |
| [Multiline Code](#code)                   | ```` ```\nCode text\n``` ````|
| [Quote](#quote)                           | `> Quote`                    |
| [Reference](#reference)                   | `Reference[^1]`              |
| [Escape character](#escape-character)     | `\# Header not parsed`       |


## Markdown syntax

### Italic text

An italic text is surrounded by a star (`*`).

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

A superscript text starts with a circumflex (`^`) and ends with a space or a newline. A superscript text that contains spaces can be surrounded by parenthesis (`( )`)

*Example*
```
This is a ^superscript text
```

```html
<p>This is a <sup>superscript</sup> text</p>
```

*Example with parenthesis*
```
This is a ^(superscript text) 
```

```html
<p>This is a <sup>superscript text</sup></p>
```


## Paragraph

A single newline adds the line of text to the previous paragraph. Two newlines create a new paragraph.

*Example with a single newline*
```
First line of text.
Second line of text.
```

```html
<p>First line of text.<br>Second line of text.</p>
```

*Example of a paragraph*
```
First line of text.

Second line of text.
```

```html
<p>First line of text.</p>
<p>Second line of text.</p>
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

A link is made up of two parts. The text in square brackets (`[]`), followed by an URL in round brackets (`( )`). i.e. `[Link](url)`

*Example*
```
This is a [link](https://example.com)
```

```html
<p>This is a <a href="https://example.com">link</a></p>
```


### Image

An image starts with an exclamation mark (`!`) followed by the caption in square brackets (`[]`), followed by the URL in round brackets (`( )`). i.e. `![caption](image_url)`

CSS instructions can be added to the end in curly brackets (`{ }`). The instructions must be separated by a semicolon (`;`). The parser option  `allowImageStyle` must also be turned on.

*Example of an inline image*
```
This is an ![inline image](https://example.com/some_image.png)
```

```html
<p>This is an <img src="https://example.com/some_image.png" alt="inline image"></p>
```

*Example of an image on a single line*
```
![Image only on a line](https://example.com/some_image.png)
```

```html
<figure>
  <img src="https://example.com/some_image.png" alt="">
  <figcaption>Image only on a line</figcaption>
</figure>
```

*Example of an image with inline style*
```
![Image with inline style](https://example.com/some_image.png){height: 100px; width: 100px}
```

```html
<figure style="height: 100px; width: 100px">
  <img src="https://example.com/some_image.png" alt="">
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
  <video controls="">
    <source src="https://example.com/some_video.mp4" type="video/mp4">
  </video>
  <figcaption>my caption</figcaption>
</figure>
```


## Unordered list

Unordered list items start with a dash (`-`) followed by a space.

Newlines can be inserted within a list item by starting the line with two spaces.

Nested list items start with at least two spaces, followed by a dash and  another space. Only one unordered nested list is allowed.

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

*Example with a newline within an item*
```
- Item 1
  Following Item 1
- Item 2
```

```html
<ul>
  <li>Item 1<br>Following Item 1</li>
  <li>Item 2</li>
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

Ordered list items start with a number, followed by a period (`.`), and a space.

Newlines can be inserted within a list item by starting the line with three spaces.

Nested list items start with at least three spaces, followed by a number and a space. Only one ordered nested list is allowed.

*Example*
```
1. Item 1
2. Item 2
3. Item 3
```

```html
<ol>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ol>
```

*Example with a newline within an item*
```
1. Item 1
   Following Item 1
2. Item 2
```

```html
<ol>
  <li>Item 1<br>Following Item 1</li>
  <li>Item 2</li>
</ol>
```

*Example with nested list*
```
1. Item 1
   1. Item 1.1
   2. Item 1.2
2. Item 2
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

The numbers of the ordered list items are not taken into account. The list is rendered the same way whether the numbers are in order, or not.

*Example with numbers not in order*
```
5. Item 1
1. Item 2
2. Item 3
1. Item 4
```

```html
<ol>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
  <li>Item 4</li>
</ol>
```


## Horizontal Line

A Horizontal line starts with an empty line, followed by three dashes (`---`), followed by another empty line.

*Example*
```
Above horizontal line

---

Below horizontal line
```

```html
<p>Above horizontal line</p>
<hr>
<p>Below horizontal line</p>
```


## Code

A code text is surrounded by a single backtick (`\``)

*Example*
```
This is `some technical term`
```

```html
<p>This is <code>some technical term</code></p>
```


## Multiline Code

A multiline code is surrounded by three backticks (`\``) set on separate lines.

The language name of the code can be added to the opening backticks. It is not included in the output HTML but it is passed to the `onMultilineCode` callback. See example further down.

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
  <p>
    Quote Line 1
    <br>
    Quote Line 2
    <br>
    Quote Line 3
  </p>
</blockquote>
```

## Reference

A reference is made up of: An opening square bracket (`[`), a circumflex (`^`), an identifier (a number or a text) and a closing square brackets (`]`). e.g. `[^1]`

The identifier must not contain spaces, tabs, or newlines. It is only used to link the reference with the footnote. The HTML output will be numbered sequentially.

*Example*
```
This is the fist reference[^1].

And the second one[^two].

[1]: First footnote.
[two]: Second footnote.
```

```html
<p>This is the fist reference<a href="#reference1"><sup>1</sup></a>.</p>
<p>And the second one<a href="#reference2"><sup>2</sup></a>.</p>
<section>
  <p><sup id="reference1">1</sup>First footnote.</p>
  <p><sup id="reference2">2</sup>Second footnote.</p>
</section>
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


### Compatibility with other popular Markdown

A tick (☑) means that the syntax should work on the platform.

|              |  Syntax  |   GitHub  | Reddit |  GitLab | CommonMark|
| ------------ |:---------|:----------|:-------|:--------|:----------|
| Italic       | `*`      | ☑        | ☑      | ☑       | ☑        |
| Bold         | `**`     | ☑        | ☑      | ☑       | ☑        |
| Bold-italic  | `***`    | ☑        | ☑      | ☑       | ⚠ N/A    |
| Strikethrough| `~~`     | ☑        | ☑      | ☑       | ⚠ N/A    |
| Newline      | `\n`     | ☑        | ☑      | ⚠ Space | ⚠ Space  |
| Paragraph    | `\n\n`   | ☑        | ☑      | ☑       | ☑        |
| Header       | `#`      | ☑        | ☑      | ☑       | ☑        |
| Link         | `[]()`   | ☑        | ☑      | ☑       | ☑        |
| Image        | `![]()`  | ☑        | ☑      | ☑       | ☑        |
| Un. list     | `-`      | ☑        | ☑      | ☑       | ☑        |
| Un. list \\n | 2 spaces | ☑        | ☑      | ☑       | ⚠ `\n`   |
| Un. nested   | 2 spaces | ☑        | ☑      | ☑       | ☑        |
| Ord. list    | `1.`     | ☑        | ☑      | ☑       | ☑        |
| Ord. list \\n| 3 spaces | ☑        | ☑      | ☑       | ⚠ `\n`   |
| Ord. nested  | 3 spaces | ☑        | ☑      | ☑       | ☑        |
| Horiz. Line  | `\n---\n`| ☑        | ☑      | ☑       | ☑        |
| Code         | `` ` ``  | ☑        | ☑      | ☑       | ☑        |
| MultiCode |```` ``` ````| ☑        | ☑      | ☑       | ☑        |
| Quote        | `>`      | ☑        | ☑      | ☑       | ☑        |
| Escape char  | `\`      | ☑        | ☑      | ☑       | ☑        |
| Superscript  | `^`      | ⚠ HTML   | ☑      | ⚠ HTML  | ⚠ N/A    |
| Subscript    | N/A      | ⚠ HTML   | ☑ N/A  | ⚠ HTML  | ⚠ N/A    |
| Reference    | `[^1]`   | ⚠ N/A    | ⚠ N/A  | ⚠ Diff. | ⚠ N/A    |
| HTML         | N/A      | ⚠ Av.    | ☑ N/A  | ⚠ Av.   | ⚠ Av.    |

Source: [GitHub Markdown](https://guides.github.com/features/mastering-markdown/), [Reddit Markdown](https://www.reddit.com/wiki/markdown), [GitLab Markdown](https://docs.gitlab.com/ee/user/markdown.html), [CommonMark](https://spec.commonmark.org/0.29/)


## Unsupported syntaxes

The following syntaxes are **NOT** supported:

- Italic, bold and italic-bold texts with one, two and three underscores.
- Headers with dashes/equal signs underneath.
- Unordered Lists with a plus sign or a star.
- More than one nested list.
- Horizontal lines with with stars or underscores.
- Image titles and link titles.
- Links with less-than and greater-than signs.
- HTML code.


## Examples

### Add an identifier to headers

```javascript
parseMarkdown('# Title 1', {
  onHeader: element => {
    // node.textContent === 'Title 1'

    element.id = element.textContent.replace(/ /g, '-').toLowerCase()
  }
}).innerHTML
```

```html
<h1 id="title-1">Title 1</h1>
```


### Open external links in a new tab

```javascript
parseMarkdown('See [this page](https:/example.com)!', {
  onLink: element => {
    // element.getAttribute('href') === 'http:/example.com'
    const href = element.getAttribute('href')

    if (href.startsWith('https://MY_SITE.com') === false) {
      element.setAttribute('target', '_blank')
    }
  }
}).innerHTML
```

```html
<p>See <a href="https:/example.com" target="_blank">this page</a>!</p>
```

### Add a base URL to images with a relative link

```javascript
parseMarkdown('![Beautiful image](beautiful_image.png)', {
  onImage: element => {
    // element.getAttribute('src') === 'beautiful_image.png'

    if (element.hasAttribute('src')) {
      const src = element.getAttribute('src')

      if (src.startsWith('http') === false) {
        element.setAttribute('src', 'https://example.com/' + src)
      }
    }
  }
}).innerHTML
```

```html
<figure>
  <img src="https://example.com/beautiful_image.png" alt="">
  <figcaption>Beautiful image</figcaption>
</figure>
```

### Add a CSS Class to inline codes

```javascript
parseMarkdown('This is body html tag: `<body>`', {
  onCode: element => {
    element.className = 'some-class'
  }
}).innerHTML
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
}).innerHTML
```

```html
<pre><code>{
  "some_property": "foo",
  "some_other_property": "bar"
}</code></pre>
```


## Other ressources

- Original Markdown: https://daringfireball.net/projects/markdown/
- CommonMark: https://commonmark.org/


## FAQ

### What can I do if I have a problem?

You can [raise an issue](https://github.com/deskeen/markdown/issues/new) and ask for help.


### What can I do to help?

You can:
- Have a look at the issues and see if you can help someone.
- Have a look at the code and see if you can improve it.
- Translate this README in your language.
- Star this repo.


## Contact

You can reach me at {my_firstname}@{my_name}.fr


## Licence

MIT Licence - Copyright (c) Morgan Schmiedt