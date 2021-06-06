'use strict'

const Element = require('./HTML/Element.js')
const Text = require('./HTML/Text.js')
const document = require('./HTML/document.js')

const {
  parseBoolean,
  parseMaxHeader,
} = require('./lib.js')

const MD_ESCAPE_CHAR = '\\'

const MD_CHARS = [
  '*',
  '[',
  '`',
  '!',
  '#',
  '~',
  '^',
].join('')

const REGEX_ESCAPE_CHAR =
  new RegExp(`\\${MD_ESCAPE_CHAR}([${MD_CHARS}])`, 'g')

const removeEscapeChars = text =>
  text.replace(REGEX_ESCAPE_CHAR, (match, char) => char)

const REGEX_MD_TEXT =
  new RegExp(`[${MD_CHARS}]`)

const isSpace = text => /^\s$/.test(text)

const setHTMLAttributes = (node, attrs) => {
  let cursor = 0

  while (cursor < attrs.length) {
    const attr = attrs.substring(cursor)
    const match = /^([^=]+)=(?:"(.+?)"|([^;]+))?/
      .exec(attr)

    if (match == null) {
      return
    }

    const attrName = match[1]
    const attrValue = match[2] || match[3]

    node.setAttribute(attrName, attrValue)
    cursor += (match[0].length + 1)
  }
}

/**
 * @param {string} markdownText Markdown text
 * @param {object} opt Parser options
 * @param {boolean} [opt.allowHeader=true]
 * @param {boolean} [opt.allowLink=true]
 * @param {boolean} [opt.allowImage=true]
 * @param {boolean} [opt.allowHTMLAttributes=false]
 * @param {boolean} [opt.allowCode=true]
 * @param {boolean} [opt.allowMultilineCode=true]
 * @param {boolean} [opt.allowUnorderedList=true]
 * @param {boolean} [opt.allowNestedUnorderedList=true]
 * @param {boolean} [opt.allowOrderedList=true]
 * @param {boolean} [opt.allowNestedOrderedList=true]
 * @param {boolean} [opt.allowHorizontalLine=true]
 * @param {boolean} [opt.allowQuote=true]
 * @param {boolean} [opt.allowFootnote=true]
 * @param {function} [opt.onHeader]
 * @param {function} [opt.onLink]
 * @param {function} [opt.onImage]
 * @param {function} [opt.onAudio]
 * @param {function} [opt.onVideo]
 * @param {function} [opt.onCode]
 * @param {function} [opt.onMultilineCode]
 * @param {function} [opt.onUnorderedList]
 * @param {function} [opt.onOrderedList]
 * @param {function} [opt.onHorizontalLine]
 * @param {function} [opt.onQuote]
 * @param {function} [opt.onReference]
 */
const parse = (markdownText, opt = {}) => {
  const allowHeader = parseBoolean(opt.allowHeader, true)
  const allowLink = parseBoolean(opt.allowLink, true)
  const allowImage = parseBoolean(opt.allowImage, true)
  const allowCode = parseBoolean(opt.allowCode, true)
  const allowMultilineCode = parseBoolean(opt.allowMultilineCode, true)
  const allowUnorderedList = parseBoolean(opt.allowUnorderedList, true)
  const allowUnordNestedList = parseBoolean(opt.allowUnorderedNestedList, true)
  const allowOrderedList = parseBoolean(opt.allowOrderedList, true)
  const allowOrdNestedList = parseBoolean(opt.allowOrderedNestedList, true)
  const allowHorizontalLine = parseBoolean(opt.allowHorizontalLine, true)
  const allowQuote = parseBoolean(opt.allowQuote, true)
  const allowFootnote = parseBoolean(opt.allowFootnote, false)
  const allowHTMLAttributes = parseBoolean(opt.allowHTMLAttributes, false)
  const maxHeader = parseMaxHeader(opt.maxHeader, 3)

  const body = new Element('div')

  let cursor = 0

  const text = `${markdownText}\n`
  const textSize = text.length

  let currentNode
  let targetNode
  let lastFlushCursor
  let lineCursor
  let lineText
  const fnNote = {}
  const fnIdList = new Set()
  const fnIdNb = new Map()

  const flushBody = () => {
    if (currentNode != null) {
      body.appendChild(currentNode)
      body.lastChild._attach()
      currentNode = null
      targetNode = null
    }
  }

  const flush = () => {
    if (targetNode == null) {
      currentNode = document.createElement('P')
      targetNode = currentNode
    }

    if (lastFlushCursor < lineCursor) {
      const text =
        removeEscapeChars(lineText.substring(lastFlushCursor, lineCursor))

      targetNode.appendChild(document.createTextNode(text))

      lastFlushCursor = lineCursor
    }
  }

  const next = n => lineText[lineCursor + n]

  while (cursor < textSize) {
    const restText = text.substring(cursor)
    const EOLIndex = restText.indexOf('\n')
    lineText = restText.substring(0, EOLIndex)
    // const nextRestText = restText.substring(EOLIndex + 1)
    let ffCursor = EOLIndex + 1
    let caseFound = false

    if (lineText.trim().length === 0) {
      if (currentNode != null
      && currentNode.tagName === 'P') {
        flushBody()
      }
    } else {
      lineCursor = 0
      lastFlushCursor = 0

      let parseLine = true

      const firstChar = lineText[0]

      if (firstChar === MD_ESCAPE_CHAR) {
        lineCursor = 1
      } else if (allowHeader
      && firstChar === '#') {
        let headerLevel = 1

        while (headerLevel < maxHeader
        && next(headerLevel) === '#') {
          headerLevel += 1
        }

        if (next(headerLevel) === ' ') {
          flushBody()
          const headerText = lineText.substring(lineText.indexOf(' ') + 1)
          const headerNode = document.createElement(`H${headerLevel}`)
          headerNode.textContent = headerText
          headerNode.onAttach = opt.onHeader

          currentNode = headerNode
          parseLine = false
          flushBody()
        }
      } else if (firstChar === '!') {
        if (next(1) === '['
        && allowImage) {
          const restLineText = lineText.substring(lineCursor + 1)
          const endMatch = /^\[(.*?)]\((.+?)(?:\s"(.*)")?\)(?:{(.+?)})?$/
            .exec(restLineText)

          if (endMatch) {
            flushBody()
            const altText = endMatch[1]
            const url = endMatch[2]
            const title = endMatch[3]
            const attrs = endMatch[4]

            const figureNode = document.createElement('FIGURE')

            if (allowHTMLAttributes
            && attrs != null) {
              setHTMLAttributes(figureNode, attrs)
            }

            if (url.endsWith('.mp3')) {
              const sourceNode = document.createElement('SOURCE')
              sourceNode.setAttribute('src', url)
              sourceNode.setAttribute('type', 'audio/mpeg')

              const audioNode = document.createElement('AUDIO')
              audioNode.appendChild(sourceNode)
              audioNode.setAttribute('controls', '')
              audioNode.onAttach = opt.onAudio

              figureNode.appendChild(audioNode)
            } else if (url.endsWith('.mp4')) {
              const sourceNode = document.createElement('SOURCE')
              sourceNode.setAttribute('src', url)
              sourceNode.setAttribute('type', 'video/mp4')

              const videoNode = document.createElement('VIDEO')
              videoNode.appendChild(sourceNode)
              videoNode.setAttribute('controls', '')
              videoNode.onAttach = opt.onVideo

              figureNode.appendChild(videoNode)
            } else {
              const imageNode = document.createElement('IMG')
              imageNode.setAttribute('src', url)
              imageNode.setAttribute('alt', altText)
              imageNode.onAttach = opt.onImage

              figureNode.appendChild(imageNode)
            }

            if (title != null) {
              const captionNode = document.createElement('FIGCAPTION')
              captionNode.textContent = title

              figureNode.appendChild(captionNode)
            }

            currentNode = figureNode
            parseLine = false
            flushBody()
          }
        }
      } else if (firstChar === '-') {
        if (allowHorizontalLine
        && lineText === '---'
        && text[cursor - 2] === '\n'
        && text[cursor - 1] === '\n'
        && text[cursor + 3] === '\n'
        && text[cursor + 4] === '\n') {
          flushBody()
          const hrNode = document.createElement('HR')
          hrNode.onAttach = opt.onHorizontalLine

          currentNode = hrNode
          parseLine = false
          flushBody()
        } else if (allowUnorderedList
        && next(1) === ' ') {
          if (currentNode != null
          && currentNode.tagName !== 'UL') {
            flushBody()
          }

          if (currentNode == null) {
            const listNode = document.createElement('UL')
            listNode.onAttach = opt.onUnorderedList
            listNode.appendChild(document.createElement('LI'))

            currentNode = listNode
          } else {
            currentNode.appendChild(document.createElement('LI'))
          }

          targetNode = currentNode.lastChild
          lineCursor = 2
          lastFlushCursor = lineCursor
          caseFound = true
        }
      } else if (allowOrderedList
      && Number.isInteger(parseInt(firstChar, 10))) {
        const match = /^([0-9]+)\. /.exec(lineText)

        if (match) {
          const syntaxSize = match[0].length

          if (currentNode != null
          && currentNode.tagName !== 'OL') {
            flushBody()
          }

          if (currentNode == null) {
            const listNode = document.createElement('OL')
            listNode.onAttach = opt.onOrderedList
            listNode.appendChild(document.createElement('LI'))

            currentNode = listNode
          } else {
            currentNode.appendChild(document.createElement('LI'))
          }

          targetNode = currentNode.lastChild
          lineCursor = syntaxSize
          lastFlushCursor = lineCursor
          caseFound = true
        }
      } else if (firstChar === ' '
      && next(1) === ' ') {
        const itemMatch = /^([ ]{2,})((- )|(\d+\. ))?/
          .exec(lineText)

        const syntaxSize = itemMatch[0].length
        const spaceCount = itemMatch[1].length
        const isNewItem = itemMatch[2] != null
        const newListTag = itemMatch[2] === '- '
          ? 'UL'
          : 'OL'

        if (isNewItem === false
        && targetNode != null
        && targetNode.parentNode != null
        && targetNode.parentNode.tagName === 'UL'
        && spaceCount >= 2) {
          if (targetNode.tagName === 'LI') {
            targetNode.appendChild(document.createElement('BR'))
          }

          lineCursor += syntaxSize
          lastFlushCursor += syntaxSize
          caseFound = true
        } else if (isNewItem === false
        && targetNode != null
        && targetNode.parentNode != null
        && targetNode.parentNode.tagName === 'OL'
        && spaceCount >= 3) {
          if (targetNode.tagName === 'LI') {
            targetNode.appendChild(document.createElement('BR'))
          }

          lineCursor += syntaxSize
          lastFlushCursor += syntaxSize
          caseFound = true
        }

        if (isNewItem
        && targetNode != null
        && targetNode.parentNode != null
        && ((allowUnordNestedList
            && currentNode.tagName === 'UL'
            && spaceCount >= 2)
        || (allowOrdNestedList
            && currentNode.tagName === 'OL'
            && spaceCount >= 3))) {
          let listLevel = 0
          let i = targetNode

          while (i != null) {
            if (i.tagName === 'UL'
            || i.tagName === 'OL') {
              listLevel += 1
            }

            i = i.parentNode
          }

          const parentNode = targetNode.parentNode
          const lastItemNode = parentNode.lastChild

          if (listLevel === 2
          && targetNode.parentNode.tagName === newListTag) {
            parentNode.appendChild(document.createElement('LI'))

            targetNode = parentNode.lastChild
          } else {
            const listNode = document.createElement(newListTag)
            listNode.onAttach = newListTag === 'UL'
              ? opt.onUnorderedList
              : opt.onOrderedList
            listNode.appendChild(document.createElement('LI'))

            lastItemNode.appendChild(listNode)

            targetNode = lastItemNode.lastChild.lastChild
          }

          lineCursor = syntaxSize
          lastFlushCursor = lineCursor
          caseFound = true
        }
      } else if (allowQuote
      && firstChar === '>') {
        if (next(1) === ' ') {
          if (currentNode == null
          || currentNode.tagName !== 'BLOCKQUOTE') {
            flushBody()
          }

          if (currentNode == null) {
            const pNode = document.createElement('P')

            const quoteNode = document.createElement('BLOCKQUOTE')
            quoteNode.onAttach = opt.onQuote
            quoteNode.appendChild(pNode)

            currentNode = quoteNode
            targetNode = pNode
          } else if (currentNode.tagName === 'BLOCKQUOTE'
          && lineText.trim().length === 1) {
            const pNode = document.createElement('P')

            currentNode.appendChild(pNode)
            targetNode = pNode
          }

          lineCursor = 2
          lastFlushCursor = lineCursor
          caseFound = true
        }
      } else if (allowMultilineCode
      && lineText.startsWith('```')) {
        const match = /^```(\w*)\n((.|\n(?!```))+)\n```/
          .exec(text.substring(cursor))

        if (match) {
          flushBody()

          const matchSize = match[0].length
          const languageName = match[1]
          const codeContent = match[2]

          const codeNode = document.createElement('CODE')
          codeNode.textContent = codeContent.replace(/\\`/g, '`')

          const preNode = document.createElement('PRE')
          preNode.appendChild(codeNode)
          preNode.onAttach = opt.onMultilineCode != null
            ? node => opt.onMultilineCode(node, languageName)
            : undefined

          currentNode = preNode
          flushBody()
          ffCursor = matchSize
          parseLine = false
        }
      } else if (allowFootnote
      && firstChar === '[') {
        const match = /^\[\^([\d\w]+)\]: (.+)/.exec(lineText)

        if (match) {
          flushBody()

          const ref = match[1]
          const text = match[2]

          fnNote[ref] = text
          parseLine = false
        }
      }

      if (parseLine) {
        if (caseFound === false
        && currentNode != null
        && currentNode.tagName !== 'P') {
          flushBody()
        }

        if (targetNode != null
        && targetNode.tagName === 'P'
        && targetNode.firstChild != null) {
          targetNode.appendChild(document.createElement('BR'))
        }

        let lineCursorMax

        while (lineCursor <= EOLIndex) {
          let ff = 0

          const match = REGEX_MD_TEXT.exec(
            lineText.substring(lineCursor, lineCursorMax))

          if (match == null) {
            if (lineCursorMax == null) {
              lineCursor = lineText.length
              flush()
              break
            } else {
              lineCursor = lineCursorMax
              flush()
              lineCursor += targetNode.ffOnTextEnd
              lastFlushCursor += targetNode.ffOnTextEnd

              while (targetNode.upOnTextEnd) {
                targetNode = targetNode.parentNode
              }

              targetNode = targetNode.parentNode
              lineCursorMax = undefined
            }
          } else {
            const char = match[0]

            ff = 1
            lineCursor += match.index

            if (next(-1) === MD_ESCAPE_CHAR) {
              // Do nothing
            } else if (char === '*') {
              // Can not have an em/strong tags in another em/strong tags
              if (targetNode == null
              || (targetNode.tagName !== 'EM'
                && targetNode.tagName !== 'STRONG')) {
                const remainingText = lineText.substring(lineCursor)
                const match = /^(\*{1,3})(.*?\S)(\*{1,3})/
                  .exec(remainingText)

                if (match) {
                  const syntaxOpen = match[1]
                  const syntaxSize = syntaxOpen.length
                  const content = match[2]
                  const syntaxClose = match[3]
                  const firstContentChar = content[0]

                  if (syntaxOpen === syntaxClose
                  && isSpace(firstContentChar) === false) {
                    const endTagIndex = syntaxSize + content.length

                    flush()
                    lineCursorMax = lineCursor + endTagIndex

                    if (syntaxOpen === '*') {
                      const emNode = document.createElement('EM')
                      emNode.ffOnTextEnd = syntaxSize

                      targetNode.appendChild(emNode)
                      targetNode = emNode
                    } else if (syntaxOpen === '**') {
                      const strongNode = document.createElement('STRONG')
                      strongNode.ffOnTextEnd = syntaxSize

                      targetNode.appendChild(strongNode)
                      targetNode = strongNode
                    } else {
                      const emNode = document.createElement('EM')
                      emNode.ffOnTextEnd = syntaxSize
                      emNode.upOnTextEnd = true

                      const strongNode = document.createElement('STRONG')
                      strongNode.appendChild(emNode)

                      targetNode.appendChild(strongNode)
                      targetNode = emNode
                    }

                    lastFlushCursor += syntaxSize
                  }

                  ff = syntaxSize
                }
              }
            } else if (char === '~') {
              if (next(1) === '~') {
                const syntax = '~~'
                const syntaxSize = syntax.length
                const fromIndex = lineCursor + syntaxSize
                const endTagIndex =
                  lineText.substring(fromIndex).indexOf(syntax)

                if (endTagIndex > 0) {
                  flush()
                  lineCursorMax = fromIndex + endTagIndex

                  const sNode = document.createElement('S')
                  sNode.ffOnTextEnd = syntaxSize

                  targetNode.appendChild(sNode)
                  targetNode = sNode

                  ff = syntaxSize
                  lastFlushCursor += syntaxSize
                }
              }
            } else if (char === '^') {
              const syntaxSize = 1
              const remainingText = lineText.substring(lineCursor + syntaxSize)
              const regex = remainingText[0] === '('
                ? /^\((.+?)\)/
                : /^(\w+)/
              const match = regex.exec(remainingText)

              if (match) {
                flush()

                const matchSize = match[0].length
                const content = match[1]

                const supNode = document.createElement('SUP')
                supNode.textContent = content

                targetNode.appendChild(supNode)

                ff = syntaxSize + matchSize
                lastFlushCursor += ff
              }
            } else if (char === '[') {
              const restLineText = lineText.substring(lineCursor + 1)

              if (allowFootnote
              && next(1) === '^') {
                const refMatch = /\^([\d\w]+)]/.exec(restLineText)

                if (refMatch) {
                  flush()

                  const id = refMatch[1]
                  let refNb

                  if (fnIdList.has(id) === false) {
                    fnIdList.add(id)
                    refNb = fnIdList.size
                    fnIdNb.set(id, refNb)
                  } else {
                    refNb = fnIdNb.get(id)
                  }

                  const supNode = document.createElement('SUP')
                  supNode.textContent = refNb

                  const linkNode = document.createElement('A')
                  linkNode.setAttribute('href', `#reference${refNb}`)
                  linkNode.appendChild(supNode)
                  linkNode.onAttach = opt.onReference != null
                    ? node => opt.onReference(node, id)
                    : undefined

                  targetNode.appendChild(linkNode)

                  ff = (1 + refMatch[0].length)
                  lastFlushCursor += ff
                }
              } else if (allowLink) {
                const endMatch = /^([^\]]+?)]\(([^)]+?)\)/.exec(restLineText)

                if (endMatch) {
                  flush()

                  const title = endMatch[1]
                  const url = endMatch[2]

                  const linkNode = document.createElement('A')
                  linkNode.setAttribute('href', url)
                  linkNode.textContent = title
                  linkNode.onAttach = opt.onLink

                  targetNode.appendChild(linkNode)

                  ff = (1 + endMatch[0].length)
                  lastFlushCursor += ff
                }
              }
            } else if (char === '!'
            && next(1) === '[') {
              if (allowImage) {
                const restLineText = lineText.substring(lineCursor + 1)
                const endMatch = /^\[(.+?)]\(([^;)]+)\)(?:{(.+?)})?/
                  .exec(restLineText)

                if (endMatch) {
                  flush()

                  const syntaxSize = 1 + endMatch[0].length
                  const altText = endMatch[1]
                  const url = endMatch[2]
                  const attrs = endMatch[3]

                  const imageNode = document.createElement('IMG')
                  imageNode.onAttach = opt.onImage
                  imageNode.setAttribute('src', url)
                  imageNode.setAttribute('alt', altText)

                  if (allowHTMLAttributes
                  && attrs != null) {
                    setHTMLAttributes(imageNode, attrs)
                  }

                  targetNode.appendChild(imageNode)

                  ff = syntaxSize
                  lastFlushCursor += ff
                }
              }
            } else if (allowCode
            && char === '`') {
              const restLineText = lineText.substring(lineCursor + 1)
              const endTagIndex = restLineText.indexOf('`')

              if (endTagIndex > 0) {
                flush()

                const content = restLineText.substring(0, endTagIndex)
                const codeNode = document.createElement('CODE')
                codeNode.textContent = content
                codeNode.onAttach = opt.onCode

                targetNode.appendChild(codeNode)

                ff = (1 + endTagIndex + 1)
                lastFlushCursor += ff
              }
            }
          }

          lineCursor += ff
        }
      }
    }

    cursor += ffCursor
  }

  if (currentNode) {
    flushBody()
  }

  if (allowFootnote) {
    const listNode = document.createElement('ol')

    let refNb = 1

    for (const ref of fnIdList.keys()) {
      const itemNode = document.createElement('li')
      itemNode.id = `reference${refNb}`

      const refValue = fnNote[ref]

      if (refValue != null) {
        const contentParsed = parse(refValue, Object.assign({}, opt, {
          allowHeader: false,
          allowImage: false,
          allowMultilineCode: false,
          allowUnorderedList: false,
          allowOrderedList: false,
          allowHorizontalLine: false,
          allowQuote: false,
          allowFootnote: false,
        }))

        const contentNode = contentParsed.firstChild

        // childNodes is theoretically a live NodeList
        for (const node of Array.from(contentNode.childNodes)) {
          itemNode.appendChild(node)
        }
      }

      listNode.appendChild(itemNode)
      refNb += 1
    }

    if (listNode.children.length > 0) {
      const footerNode = document.createElement('section')
      footerNode.appendChild(listNode)

      body.appendChild(footerNode)
    }
  }

  return body
}

module.exports.Element = Element
module.exports.Text = Text
module.exports.parse = parse
