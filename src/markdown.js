/* eslint-env node */

class Element {
  constructor(tagName, attr) {
    this.tagName = tagName
    this.attr = attr || {}
    this.children = []
  }

  appendChild(node) {
    if (typeof node !== 'string') {
      node.parentNode = this
    }

    this.children.push(node)
  }

  get textContent() {
    return this.children[0]
  }

  set textContent(value) {
    this.children = [value]
  }

  get firstChild() {
    return this.children[0]
  }

  get lastChild() {
    return this.children[this.children.length - 1]
  }

  toHtml() {
    let html = ''

    if (this.tagName != null) {
      html += `<${this.tagName}`

      if (this.attr != null) {
        for (const attrName of Object.keys(this.attr)) {
          html += ` ${attrName}="${this.attr[attrName]}"`
        }
      }

      if (this.children.length === 0) {
        html += ' /'
      }

      html += '>'
    }

    for (const child of this.children) {
      if (typeof child === 'string') {
        html += child
      } else {
        html += child.toHtml()
      }
    }

    if (this.tagName != null) {
      if (this.children.length) {
        html += `</${this.tagName}>`
      }
    }

    return html
  }
}

module.exports.Element = Element

const parseBoolean = (value, defaultValue) =>
  typeof value === 'boolean'
    ? value
    : defaultValue

/**
 * @param {string} markdownText Markdown text
 * @param {object} opt Parser options
 * @param {boolean} [opt.brOnBlankLine=false]
 * @param {boolean} [opt.allowHeader=true]
 * @param {boolean} [opt.allowLink=true]
 * @param {boolean} [opt.allowImage=true]
 * @param {boolean} [opt.allowImageStyle=false]
 * @param {boolean} [opt.allowCode=true]
 * @param {boolean} [opt.allowMultilineCode=true]
 * @param {boolean} [opt.allowUnorderedList=true]
 * @param {boolean} [opt.allowOrderedList=true]
 * @param {boolean} [opt.allowHorizontalLine=true]
 * @param {boolean} [opt.allowQuote=true]
 * @param {boolean} [opt.allowFootnote=true]
 * @param {function} [opt.onHeader]
 * @param {function} [opt.onLink]
 * @param {function} [opt.onImage]
 * @param {function} [opt.onVideo]
 * @param {function} [opt.onCode]
 * @param {function} [opt.onMultilineCode]
 * @param {function} [opt.onUnorderedList]
 * @param {function} [opt.onOrderedList]
 * @param {function} [opt.onHorizontalLine]
 * @param {function} [opt.onQuote]
 * @param {function} [opt.onFootnote]
 */
module.exports.parse = (markdownText, opt = {}) => {
  const allowHeader = parseBoolean(opt.allowHeader, true)
  const allowLink = parseBoolean(opt.allowLink, true)
  const allowImage = parseBoolean(opt.allowImage, true)
  const allowImageStyle = parseBoolean(opt.allowImageStyle, false)
  const allowCode = parseBoolean(opt.allowCode, true)
  const allowMultilineCode = parseBoolean(opt.allowMultilineCode, true)
  const allowUnorderedList = parseBoolean(opt.allowUnorderedList, true)
  const allowOrderedList = parseBoolean(opt.allowOrderedList, true)
  const allowHorizontalLine = parseBoolean(opt.allowHorizontalLine, true)
  const allowQuote = parseBoolean(opt.allowQuote, true)
  const allowFootnote = parseBoolean(opt.allowFootnote, true)
  const brOnBlankLine = parseBoolean(opt.brOnBlankLine, false)

  const body = new Element()

  let cursor = 0

  const text = `${markdownText}\n`
  const textSize = text.length

  while (cursor < textSize) {
    const restText = text.substring(cursor)
    const EOLIndex = restText.indexOf('\n')
    const lineText = restText.substring(0, EOLIndex)
    const nextRestText = restText.substring(EOLIndex + 1)

    if (lineText.length === 0) {
      if (brOnBlankLine) {
        body.appendChild(new Element('br'))
      }
    } else {
      let lineCursor = 0
      let lastFlushCursor = 0
      const next = n => lineText[lineCursor + n]

      let currentLine
      let outerTagName
      let parseLine = true
      let onLineEnd

      const flush = node => {
        if (currentLine == null) {
          currentLine = new Element('p')
        }

        if (lastFlushCursor < lineCursor) {
          currentLine.appendChild(lineText.substring(
            lastFlushCursor, lineCursor))

          lastFlushCursor = lineCursor
        }

        if (node != null) {
          currentLine.appendChild(node)
        }
      }

      const firstChar = lineText[0]

      if (allowHeader
      && firstChar === '#') {
        let i = 1

        while (i < 3 && next(i) === '#') {
          i += 1
        }

        if (next(i) === ' ') {
          const headerText = lineText.substring(lineText.indexOf(' ') + 1)
          const headerNode = new Element(`h${i}`)
          headerNode.textContent = headerText

          if (opt.onHeader) {
            opt.onHeader(headerNode)
          }

          currentLine = headerNode
          parseLine = false
        }
      } else if (firstChar === '!') {
        if (next(1) === '['
        && allowImage) {
          const restLineText = lineText.substring(lineCursor + 1)
          const endMatch = /^\[([^\]]+)]\(([^;)]+)(;([^)]+))?\)/
            .exec(restLineText)

          if (endMatch) {
            const title = endMatch[1]
            const url = endMatch[2]
            const style = endMatch[4]

            const figureNode = new Element('figure')

            if (allowImageStyle
            && style != null) {
              figureNode.attr.style = style
            }

            const isVideo = url.endsWith('.mp4')

            if (isVideo) {
              const sourceNode = new Element('source', {
                src: url,
                type: 'video/mp4',
              })

              const videoNode = new Element('video')

              videoNode.appendChild(sourceNode)

              if (opt.onVideo) {
                opt.onVideo(videoNode)
              }

              figureNode.appendChild(videoNode)
            } else {
              const imageNode = new Element('img', {
                src: url,
                alt: '',
              })

              if (opt.onImage) {
                opt.onImage(imageNode, title, url)
              }

              figureNode.appendChild(imageNode)
            }

            const captionNode = new Element('figcaption')
            captionNode.textContent = title

            figureNode.appendChild(captionNode)

            currentLine = figureNode
            parseLine = false
          }
        }
      } else if (firstChar === '-') {
        if (allowHorizontalLine
        && lineText === '---') {
          const hrNode = new Element('hr')

          if (opt.onHorizontalLine) {
            opt.onHorizontalLine(hrNode)
          }

          currentLine = hrNode
          parseLine = false
        } else if (allowUnorderedList
        && next(1) === ' ') {
          outerTagName = 'ul'
          currentLine = new Element('li')
          lineCursor = 2
          lastFlushCursor = lineCursor

          if (opt.onUnorderedList
          && nextRestText.startsWith('- ') === false) {
            onLineEnd = body => opt.onUnorderedList(body.lastChild)
          }
        }
      } else if (allowOrderedList
      && firstChar === '+') {
        if (next(1) === ' ') {
          outerTagName = 'ol'
          currentLine = new Element('li')
          lineCursor = 2
          lastFlushCursor = lineCursor

          if (opt.onOrderedList
          && nextRestText.startsWith('+ ') === false) {
            onLineEnd = body => opt.onOrderedList(body.lastChild)
          }
        }
      } else if (allowQuote
      && firstChar === '>') {
        if (next(1) === ' ') {
          outerTagName = 'blockquote'
          lineCursor = 2
          lastFlushCursor = lineCursor

          if (opt.onQuote
          && nextRestText.startsWith('> ') === false) {
            onLineEnd = body => opt.onQuote(body.lastChild)
          }
        }
      } else if (allowMultilineCode
      && lineText.startsWith('```')) {
        const remainingText = text.substring(cursor + lineText.length + 1)
        const endTagIndex = remainingText.indexOf('```')

        if (endTagIndex > 0) {
          const content = remainingText.substring(0, endTagIndex - 1)
          const codeNode = new Element('code')
          codeNode.textContent = content

          const preNode = new Element('pre')
          preNode.appendChild(codeNode)

          if (opt.onMultilineCode) {
            const language = text.substring(3, lineText.length)
            opt.onMultilineCode(preNode, language)
          }

          currentLine = preNode
          cursor += (lineText.length + 1 + endTagIndex)
          parseLine = false
        }
      }

      let lineCursorMax

      while (parseLine === true
      && lineCursor <= EOLIndex) {
        let ff = 0

        const match = /[*[`!]/.exec(
          lineText.substring(lineCursor, lineCursorMax))

        if (match == null) {
          if (lineCursorMax == null) {
            lineCursor = lineText.length
            flush()
            break
          } else {
            lineCursor = lineCursorMax
            flush()
            lineCursor += currentLine.ffOnFlush
            lastFlushCursor += currentLine.ffOnFlush
            currentLine = currentLine.parentNode
            lineCursorMax = undefined
          }
        } else {
          const char = match[0]

          ff = 1
          lineCursor += match.index

          if (char === '*') {
            if (next(1) === '*') {
              const tagSize = 2
              const fromIndex = lineCursor + tagSize
              const endTagIndex = lineText.substring(fromIndex).indexOf('**')

              if (endTagIndex > 0) {
                flush()
                lineCursorMax = fromIndex + endTagIndex

                const strongNode = new Element('strong')
                strongNode.ffOnFlush = tagSize

                currentLine.appendChild(strongNode)
                currentLine = strongNode

                ff = tagSize
                lastFlushCursor += tagSize
              }
            } else {
              const charSize = 1
              const fromIndex = lineCursor + charSize
              const endTagIndex = lineText.substring(fromIndex).indexOf('*')

              if (endTagIndex > 0) {
                flush()
                lineCursorMax = fromIndex + endTagIndex

                const emNode = new Element('em')
                emNode.ffOnFlush = charSize

                currentLine.appendChild(emNode)
                currentLine = emNode

                ff = charSize
                lastFlushCursor += charSize
              }
            }
          } else if (char === '[') {
            const restLineText = lineText.substring(lineCursor + 1)

            if (allowFootnote
            && next(1) === '^') {
              const footnoteMatch = /\^(\d+)]/.exec(restLineText)

              if (footnoteMatch) {
                const noteNb = footnoteMatch[1]

                const supNode = new Element('sup')
                supNode.textContent = noteNb

                const linkNode = new Element('a', {
                  href: `#footnote${noteNb}`,
                })
                linkNode.appendChild(supNode)

                if (opt.onFootnote) {
                  opt.onFootnote(linkNode)
                }

                flush(linkNode)

                ff = (1 + footnoteMatch[0].length)
                lastFlushCursor += ff
              }
            } else if (allowLink) {
              const endMatch = /([^\]]+)]\(([^)]+)\)/.exec(restLineText)

              if (endMatch) {
                const title = endMatch[1]
                const url = endMatch[2]

                const linkNode = new Element('a', {
                  href: url,
                })
                linkNode.textContent = title

                if (opt.onLink) {
                  opt.onLink(linkNode)
                }

                flush(linkNode)

                ff = (1 + endMatch[0].length)
                lastFlushCursor += ff
              }
            }
          } else if (char === '!'
          && next(1) === '[') {
            if (allowImage) {
              const restLineText = lineText.substring(lineCursor + 1)
              const endMatch = /^\[([^\]]+)]\(([^;)]+)(;([^)]+))?\)/
                .exec(restLineText)

              if (endMatch) {
                const title = endMatch[1]
                const url = endMatch[2]
                const style = endMatch[4]

                const imageNode = new Element('img', {
                  src: url,
                  alt: title,
                })

                if (allowImageStyle
                && style != null) {
                  imageNode.attr.style = style
                }

                if (opt.onImage) {
                  opt.onImage(imageNode, title, url)
                }

                flush(imageNode)

                ff = (1 + endMatch[0].length)
                lastFlushCursor += ff
              }
            }
          } else if (allowCode
          && char === '`') {
            const restLineText = lineText.substring(lineCursor + 1)
            const endTagIndex = restLineText.indexOf('`')

            if (endTagIndex > 0) {
              const content = restLineText.substring(0, endTagIndex)
              const codeNode = new Element('code')
              codeNode.textContent = content

              if (opt.onCode) {
                opt.onCode(codeNode)
              }

              flush(codeNode)

              ff = (1 + endTagIndex + 1)
              lastFlushCursor += ff
            }
          }
        }

        lineCursor += ff
      }

      if (outerTagName != null) {
        const lastChild = body.lastChild

        if (lastChild != null
        && lastChild.tagName === outerTagName) {
          lastChild.appendChild(currentLine)
        } else {
          const outerNode = new Element(outerTagName)
          outerNode.appendChild(currentLine)

          body.appendChild(outerNode)
        }
      } else {
        body.appendChild(currentLine)
      }

      currentLine = null

      if (onLineEnd) {
        onLineEnd(body)
      }
    }

    cursor += (EOLIndex + 1)
  }

  return body
}
