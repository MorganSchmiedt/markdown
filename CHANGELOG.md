# Changelog

## 2.0.0beta - TBD

**🌟 New**
- Unordered and ordered nested lists are supported.
- Space-only lines are considered empty.
- `allowNestedList`, `allowReference`, `allowFootnote` options are added.
- `Element.hasAttribute`, `Element.getAttribute`, `Element.setAttribute` and `Element.removeAttribute`, `Element.attributes` are added.
- `Element.innerHTML`, `Element.outerHTML` are added.
- `Element.className` is added.

**⚠ Breaking changes**
- `allowFootnote` becomes `allowReference`.
- `onFootnote` becomes `onReference`.
- `Element.attr` becomes `Element.attributes`.
- `Element.toHtml()` becomes `Element.innerHTML`.
- `Element.tagName` property is now read-only.
- `Element.tagName` now returns the tag name in uppercase.
- `Element.textContent` returns non-only the text of the Element, but also the text of its descendants.

**🔧 Changes**
- Void HTML elements no longer have a trailing slash.
- Only special characters are now converted to alphanumeric values.
- Escape characters are now removed in the parsed element.


## 1.0.0 - 2020-08-13
- Initial version