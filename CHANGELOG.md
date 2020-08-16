# Changelog

## 2.0.0beta - TBD

**🌟 New**
- Unordered and ordered nested lists are supported.
- `allowNestedList` option is added.
- Space-only lines are considered empty.
- `Element.hasAttribute`, `Element.getAttribute`, `Element.setAttribute` and `Element.removeAttribute` are available.

**⚠ Breaking changes**
- `allowFootnote` becomes `allowReference`
- `onFootnote` becomes `onReference`
- `Element.attr` becomes `Element.attributes`
- `Element.tagName` returns the tag name in uppercase.

**🔧 Changes**
- Void HTML elements no longer have a trailing slash.
- Only special characters are converted to alphanumeric values.


## 1.0.0 - 2020-08-13
- Initial version