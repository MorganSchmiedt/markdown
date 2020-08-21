# Changelog

## 2.0.0beta - TBD

**🌟 New**
- Unordered and ordered nested lists are supported.
- Space-only lines are considered empty.
- `allowUnorderedNestedList`, `allowOrderedNestedList`, `allowReference`, `allowFootnote` options are added.
- `Element.id`, `Element.className`,  `Element.hasAttribute`, `Element.getAttribute`, `Element.setAttribute` and `Element.removeAttribute`, `Element.attributes`, `Element.innerHTML`, `Element.outerHTML` are added.
- Line breaks in (un)ordered lists are supported.

**⚠ Breaking changes**
- `allowFootnote` becomes `allowReference`.
- `onFootnote` becomes `onReference`.
- `Element.attr` becomes `Element.attributes`.
- `Element.toHtml()` becomes `Element.innerHTML`.
- `Element.tagName` property is now read-only.
- `Element.tagName` now returns the tag name in uppercase.
- `Element.textContent` returns non-only the text of the Element, but also the text of its descendants.
- `<video>` HTML tags have now a `controls` attribute by default.
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


## 1.0.0 - 2020-08-13
- Initial version