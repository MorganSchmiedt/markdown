# Changelog

## 5.3.1 - 2023-08-27

**🌟 New**
- Escaped closing brackets are supported in links.


## 5.2.2 - 2023-08-24

**🐛 Bugfix**
- Headers no longer start with extra `#` when `allowHeaderFormat` is on.

## 5.2.1 - 2023-08-24

**🌟 New**
- Formatted text is supported in headers (behind `allowHeaderFormat` flag).
- `allowHeaderFormat` parser option is added.

## 5.1.3 - 2021-06-06

**🐛 Bugfix**
- An empty text is added when a footnote is missing.

## 5.1.2 - 2021-06-04

**🐛 Bugfix**
- A paragraph can contain brackets before a link.

## 5.1.1 - 2021-05-27

**🐛 Bugfix**
- Several bold/italic words can be added to a single line.

## 5.1.0 - 2021-05-20

**🌟 New**
- `Element.removeChild`, `Element.remove` are added.

## 5.0.0 - 2021-05-05

**🌟 New**
- A caption can be added to image/video/audio tags.

**⚠ Breaking changes**
- Images : The text in brackets refers to the image alt text.
- Audios and Videos : The text in brackets is no longer used.

## 4.1.1 - 2021-03-02

**🌟 New**
- A footnote can be referenced more than once.

## 4.1.0 - 2021-02-19

**🌟 New**
- `<audio>` elements added.

## 4.0.1 - 2020-12-21

**🐛 Bugfix**
- `Element.removeAttribute` no longer makes `outerHTML` crash.


## 4.0.0 - 2020-12-20

**🌟 New**
- `allowHTMLAttributes` option is added.
- HTML Attributes can be added to images by appending `{attrValue=AttrName}`.

**⚠ Breaking changes**
- `allowImageStyle` option is removed.

## 3.2.2 - 2020-10-18

**🌟 New**
- A Null value or an empty string can be passed to `Element.textContent`.


## 3.2.1 - 2020-10-18

**🔧 Changes**
- An empty line `>_` within a quote creates a new paragraph.


## 3.2.0 - 2020-09-10

**🔧 Changes**
- Footnotes are now embedded in a `ol` tag.


## 3.1.0 - 2020-09-02

**🌟 New**
- `Element.prepend`, `Element.append` are added.

**🔧 Changes**
- Bold/Italic texts can not start/end with a space.


## 3.0.0 - 2020-08-28

**🌟 New**
- Add `Text` class to create Text Elements.
- Backticks (`` ` ``) can now be escaped in multiline codes.
- Footnotes are implemented.
- `allowFootnote` option is added and defaults to false.
- `Element.childNodes` is added.

**⚠ Breaking changes**
- `allowReference` is removed.
- `Element.children` no longer returns Texts. 


## 2.0.0 - 2020-08-21

**🌟 New**
- Unordered and ordered nested lists are supported.
- Line breaks in (un)ordered lists and nested lists are supported.
- Space-only lines are considered empty.
- `allowUnorderedNestedList`, `allowOrderedNestedList`, `allowReference` options are added.
- `Element.id`, `Element.className`,  `Element.hasAttribute`, `Element.getAttribute`, `Element.setAttribute` and `Element.removeAttribute`, `Element.attributes`, `Element.innerHTML`, `Element.outerHTML` are added.

**⚠ Breaking changes**
- `allowFootnote` becomes `allowReference`.
- `onFootnote` becomes `onReference`.
- `Element.attr` becomes `Element.attributes`.
- `Element.toHtml()` becomes `Element.innerHTML`.
- `Element.tagName` property is now read-only and returns the tag name in uppercase.
- `Element.textContent` returns non-only the text of the Element, but also the text of its descendants.
- Hoziontal lines must now have a blank line before and after the dashes.
- A single newline adds a `<br>` tag to the last paragraph.
- Two newlines creates a paragraph.
- `brOnBlankLine` option is removed.
- Ordered Lists now starts with a number and a period.
- Superscript texts no longer ends with a circumflex.

**🔧 Changes**
- Void HTML elements no longer have a trailing slash.
- Only special characters are now converted to alphanumeric values.
- Escape characters are now removed in the parsed element.
- Blockquotes text lines are now embedded in a `<p>` tag.
- `<video>` HTML tags have now a `controls` attribute by default.


## 1.0.0 - 2020-08-13
- Initial version