// @ts-check

import Element from './HTML/Element.js'
import Text from './HTML/Text.js'
import document from './HTML/document.js'

import { parseBoolean, parseMaxHeader } from './lib.js'

/** @type {string} */
const MD_ESCAPE_CHAR = '\\'

/** @type {string} */
const MD_CHARS = [
  '*',
  '[',
  '`',
  '!',
  '#',
  '~',
  '^',
].join('')

/** @type {RegExp} */
const REGEX_ESCAPE_CHAR =
  new RegExp(`\\${MD_ESCAPE_CHAR}([${MD_CHARS}])`, 'g')
/** @type {RegExp} */
const REGEX_REP_ESC_CHAR_LINK_TEXT =
  new RegExp(`\\${MD_ESCAPE_CHAR}\\]`, 'g')
/** @type {RegExp} */
const REGEX_CLOSING_LINK =
  new RegExp(`^((?:[^\\]]|\\${MD_ESCAPE_CHAR}])+?)]\\(([^)]+?)\\)`)

/**
 * @param {string} text
 * @returns {string}
 */
const removeEscapeChars = text =>
  text.replace(REGEX_ESCAPE_CHAR, (match, char) => char)

/** @type {RegExp} */
const REGEX_MD_TEXT =
  new RegExp(`[${MD_CHARS}]`)

/**
 * Reads text attributes and assigns them to an Element.
 *
 * @param {Element} element
 * @param {string} attributesText
 * @returns {void}
 */
const setHTMLAttributes = (element, attributesText) => {
  let cursor = 0

  while (cursor < attributesText.length) {
    const attr = attributesText.substring(cursor)
    const match = /^([^=]+)=(?:"(.+?)"|([^;]+))?/
      .exec(attr)

    if (match == null) {
      return
    }

    const attrName = match[1]
    const attrValue = match[2] || match[3]

    element.setAttribute(attrName, attrValue)
    cursor += (match[0].length + 1)
  }
}

/**
 * @typedef {Object} ParserOptions
 * @property {boolean} [allowHeader=true]
 * @property {boolean} [allowHeaderFormat=false]
 * @property {number} [maxHeader=3]
 * @property {boolean} [allowLink=true]
 * @property {boolean} [allowImage=true]
 * @property {boolean} [allowHTMLAttributes=false]
 * @property {boolean} [allowCode=true]
 * @property {boolean} [allowMultilineCode=true]
 * @property {boolean} [allowUnorderedList=true]
 * @property {boolean} [allowUnorderedNestedList=true]
 * @property {boolean} [allowOrderedList=true]
 * @property {boolean} [allowOrderedNestedList=true]
 * @property {boolean} [allowHorizontalLine=true]
 * @property {boolean} [allowQuote=true]
 * @property {boolean} [allowFootnote=true]
 * @property {function(Element): undefined} [onHeader]
 * @property {function(Element): undefined} [onLink]
 * @property {function(Element): undefined} [onImage]
 * @property {function(Element): undefined} [onAudio]
 * @property {function(Element): undefined} [onVideo]
 * @property {function(Element): undefined} [onCode]
 * @property {function(Element, string): undefined} [onMultilineCode]
 * @property {function(Element): undefined} [onUnorderedList]
 * @property {function(Element): undefined} [onOrderedList]
 * @property {function(Element): undefined} [onHorizontalLine]
 * @property {function(Element): undefined} [onQuote]
 * @property {function(Element, string): undefined} [onReference]
 */

/**
 * @param {string} markdownText Markdown text
 * @param {ParserOptions} [opt] Parser options
 * @returns {Element} HTML Text
 */
const parse = (markdownText, opt) => {
  const allowHeader = parseBoolean(opt?.allowHeader, true)
  const allowHeaderFormat = parseBoolean(opt?.allowHeaderFormat, false)
  const allowLink = parseBoolean(opt?.allowLink, true)
  const allowImage = parseBoolean(opt?.allowImage, true)
  const allowCode = parseBoolean(opt?.allowCode, true)
  const allowMultilineCode = parseBoolean(opt?.allowMultilineCode, true)
  const allowUnorderedList = parseBoolean(opt?.allowUnorderedList, true)
  const allowUnordNestedList = parseBoolean(opt?.allowUnorderedNestedList, true)
  const allowOrderedList = parseBoolean(opt?.allowOrderedList, true)
  const allowOrdNestedList = parseBoolean(opt?.allowOrderedNestedList, true)
  const allowHorizontalLine = parseBoolean(opt?.allowHorizontalLine, true)
  const allowQuote = parseBoolean(opt?.allowQuote, true)
  const allowFootnote = parseBoolean(opt?.allowFootnote, false)
  const allowHTMLAttributes = parseBoolean(opt?.allowHTMLAttributes, false)
  const maxHeader = parseMaxHeader(opt?.maxHeader, 3)

  const body = new Element('div')

  let cursor = 0

  const text = `${markdownText}\n`
  const textSize = text.length

  /** @type {null|Element} */
  let currentNode = null
  /** @type {null|Element} */
  let targetNode = null
  /** @type {number} */
  let lastFlushCursor
  /** @type {number} */
  let lineCursor
  /** @type {string} */
  let lineText

  /**
   * Footnotes
   * @type {Object<string, string>}
   * */
  const fnNote = {}
  /** @type {Set<string>} */
  const fnIdList = new Set()
  /** @type {Map<string, number>} */
  const fnIdNb = new Map()

  const flushBody = () => {
    if (currentNode != null) {
      body.appendChild(currentNode)
      body.lastChildElement?._attach()
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

  /**
   * Returns n-th character of the processed line
   * @param {number} n
   * @returns {string}
   */
  const next = n => lineText[lineCursor + n]

  while (cursor < textSize) {
    /** @type {string} */
    const restText = text.substring(cursor)
    /** @type {number} */
    const EOLIndex = restText.indexOf('\n')
    lineText = restText.substring(0, EOLIndex)
    /** @type {number} */
    let ffCursor = EOLIndex + 1
    /** @type {boolean} */
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

      /** @type {string} */
      const firstChar = lineText[0]

      if (firstChar === MD_ESCAPE_CHAR) {
        lineCursor = 1
      } else if (allowHeader
      && firstChar === '#') {
        /** @type {number} */
        let headerLevel = 1

        while (headerLevel < maxHeader
        && next(headerLevel) === '#') {
          headerLevel += 1
        }

        if (next(headerLevel) === ' ') {
          flushBody()
          /** @type {string} */
          const headerText = lineText.substring(lineText.indexOf(' ') + 1)
          /** @type {Element} */
          const headerNode = document.createElement(`H${headerLevel}`)
          headerNode.onAttach = opt?.onHeader

          if (allowHeaderFormat) {
            lineCursor = headerLevel + 1
            lastFlushCursor = lineCursor
            targetNode = headerNode
            caseFound = true
          } else {
            headerNode.textContent = headerText
            parseLine = false
            flushBody()
          }

          currentNode = headerNode
        }
      } else if (firstChar === '!') {
        if (next(1) === '['
        && allowImage) {
          /** @type {string} */
          const restLineText = lineText.substring(lineCursor + 1)
          /** @type {null|RegExpExecArray} */
          const endMatch = /^\[(.*?)]\((.+?)(?:\s"(.*)")?\)(?:{(.+?)})?$/
            .exec(restLineText)

          if (endMatch != null) {
            flushBody()
            /** @type {string} */
            const altText = endMatch[1]
            /** @type {string} */
            const url = endMatch[2]
            /** @type {string} */
            const title = endMatch[3]
            /** @type {string} */
            const attrs = endMatch[4]

            /** @type {Element} */
            const figureNode = document.createElement('FIGURE')

            if (allowHTMLAttributes
            && attrs != null) {
              setHTMLAttributes(figureNode, attrs)
            }

            if (url.endsWith('.mp3')) {
              /** @type {Element} */
              const sourceNode = document.createElement('SOURCE')
              sourceNode.setAttribute('src', url)
              sourceNode.setAttribute('type', 'audio/mpeg')

              /** @type {Element} */
              const audioNode = document.createElement('AUDIO')
              audioNode.appendChild(sourceNode)
              audioNode.setAttribute('controls', '')
              audioNode.onAttach = opt?.onAudio

              figureNode.appendChild(audioNode)
            } else if (url.endsWith('.mp4')) {
              /** @type {Element} */
              const sourceNode = document.createElement('SOURCE')
              sourceNode.setAttribute('src', url)
              sourceNode.setAttribute('type', 'video/mp4')

              /** @type {Element} */
              const videoNode = document.createElement('VIDEO')
              videoNode.appendChild(sourceNode)
              videoNode.setAttribute('controls', '')
              videoNode.onAttach = opt?.onVideo

              figureNode.appendChild(videoNode)
            } else {
              /** @type {Element} */
              const imageNode = document.createElement('IMG')
              imageNode.setAttribute('src', url)
              imageNode.setAttribute('alt', altText)
              imageNode.onAttach = opt?.onImage

              figureNode.appendChild(imageNode)
            }

            if (title != null) {
              /** @type {Element} */
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
          /** @type {Element} */
          const hrNode = document.createElement('HR')
          hrNode.onAttach = opt?.onHorizontalLine

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
            /** @type {Element} */
            const listNode = document.createElement('UL')
            listNode.onAttach = opt?.onUnorderedList
            listNode.appendChild(document.createElement('LI'))

            currentNode = listNode
          } else {
            currentNode.appendChild(document.createElement('LI'))
          }

          targetNode = currentNode.lastChildElement
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
            listNode.onAttach = opt?.onOrderedList
            listNode.appendChild(document.createElement('LI'))

            currentNode = listNode
          } else {
            currentNode.appendChild(document.createElement('LI'))
          }

          targetNode = currentNode.lastChildElement
          lineCursor = syntaxSize
          lastFlushCursor = lineCursor
          caseFound = true
        }
      } else if (firstChar === ' '
      && next(1) === ' ') {
        /** @type {null|RegExpExecArray} */
        const itemMatch = /^([ ]{2,})((- )|(\d+\. ))?/
          .exec(lineText)

        if (itemMatch == null) {
          throw new Error('Unexpected error')
        }

        /** @type {number} */
        const syntaxSize = itemMatch[0].length
        /** @type {number} */
        const spaceCount = itemMatch[1].length
        /** @type {boolean} */
        const isNewItem = itemMatch[2] != null
        /** @type {string} */
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
            && currentNode?.tagName === 'UL'
            && spaceCount >= 2)
        || (allowOrdNestedList
            && currentNode?.tagName === 'OL'
            && spaceCount >= 3))) {
          /** @type {number} */
          let listLevel = 0
          /** @type {null|Element} */
          let i = targetNode

          while (i != null) {
            if (i.tagName === 'UL'
            || i.tagName === 'OL') {
              listLevel += 1
            }

            i = i.parentNode
          }

          /** @type {null|Element} */
          const parentNode = targetNode.parentNode
          /** @type {null|Element} */
          const lastItemNode = parentNode.lastChildElement

          if (listLevel === 2
          && targetNode.parentNode.tagName === newListTag) {
            parentNode.appendChild(document.createElement('LI'))

            targetNode = parentNode.lastChildElement
          } else if (lastItemNode != null) {
            const listNode = document.createElement(newListTag)
            listNode.onAttach = newListTag === 'UL'
              ? opt?.onUnorderedList
              : opt?.onOrderedList
            listNode.appendChild(document.createElement('LI'))

            lastItemNode.appendChild(listNode)

            targetNode = lastItemNode.lastChildElement?.lastChildElement ?? null
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
            /** @type {Element} */
            const pNode = document.createElement('P')

            /** @type {Element} */
            const quoteNode = document.createElement('BLOCKQUOTE')
            quoteNode.onAttach = opt?.onQuote
            quoteNode.appendChild(pNode)

            currentNode = quoteNode
            targetNode = pNode
          } else if (currentNode.tagName === 'BLOCKQUOTE'
          && lineText.trim().length === 1) {
            /** @type {Element} */
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
        /** @type {null|RegExpExecArray} */
        const match = /^```(\w*)\n((.|\n(?!```))+)\n```/
          .exec(text.substring(cursor))

        if (match != null) {
          flushBody()

          /** @type {number} */
          const matchSize = match[0].length
          /** @type {string} */
          const languageName = match[1]
          /** @type {string} */
          const codeContent = match[2]

          /** @type {Element} */
          const codeNode = document.createElement('CODE')
          codeNode.textContent = codeContent.replace(/\\`/g, '`')

          /** @type {Element} */
          const preNode = document.createElement('PRE')
          preNode.appendChild(codeNode)

          /**
           * @param {Element} node
           * */
          preNode.onAttach = node => {
            if (typeof opt?.onMultilineCode === 'function') {
              opt.onMultilineCode(node, languageName)
            }
          }

          currentNode = preNode
          flushBody()
          ffCursor = matchSize
          parseLine = false
        }
      } else if (allowFootnote
      && firstChar === '[') {
        /** @type {null|RegExpExecArray} */
        const match = /^\[\^([\d\w]+)\]: (.+)/.exec(lineText)

        if (match != null) {
          flushBody()

          /** @type {string} */
          const ref = match[1]
          /** @type {string} */
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

        /** @type {undefined|number} */
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

              if (targetNode?._ffOnTextEnd != null) {
                lineCursor += targetNode._ffOnTextEnd
                lastFlushCursor += targetNode._ffOnTextEnd
              }

              while (targetNode?._upOnTextEnd) {
                targetNode = targetNode.parentNode
              }

              targetNode = targetNode?.parentNode ?? null
              lineCursorMax = undefined
            }
          } else {
            /** @type {string} */
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
                /** @type {string} */
                const remainingText = lineText.substring(lineCursor)
                /** @type {null|RegExpExecArray} */
                const match = /^(\*{1,3})(?!\s|\*)(.+?)(?<!\s|\*)(\1)(?!\*)/
                  .exec(remainingText)

                if (match) {
                  const syntaxOpen = match[1]
                  const syntaxSize = syntaxOpen.length
                  const content = match[2]
                  const endTagIndex = syntaxSize + content.length

                  flush()
                  lineCursorMax = lineCursor + endTagIndex

                  if (syntaxOpen === '*') {
                    const emNode = document.createElement('EM')
                    emNode._ffOnTextEnd = syntaxSize

                    targetNode.appendChild(emNode)
                    targetNode = emNode
                  } else if (syntaxOpen === '**') {
                    const strongNode = document.createElement('STRONG')
                    strongNode._ffOnTextEnd = syntaxSize

                    targetNode.appendChild(strongNode)
                    targetNode = strongNode
                  } else {
                    const emNode = document.createElement('EM')
                    emNode._ffOnTextEnd = syntaxSize
                    emNode._upOnTextEnd = true

                    const strongNode = document.createElement('STRONG')
                    strongNode.appendChild(emNode)

                    targetNode.appendChild(strongNode)
                    targetNode = emNode
                  }

                  lastFlushCursor += syntaxSize

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
                  sNode._ffOnTextEnd = syntaxSize

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
                /** @type {null|RegExpExecArray} */
                const refMatch = /\^([\d\w]+)]/.exec(restLineText)

                if (refMatch != null) {
                  flush()

                  /** @type {string} */
                  const id = refMatch[1]

                  /** @type {undefined|number} */
                  let refNb

                  if (fnIdList.has(id) === false) {
                    fnIdList.add(id)
                    refNb = fnIdList.size
                    fnIdNb.set(id, refNb)
                  } else {
                    refNb = fnIdNb.get(id)
                  }

                  if (refNb == null) {
                    throw new Error()
                  }

                  /** @type {Element} */
                  const supNode = document.createElement('SUP')
                  supNode.textContent = refNb.toString()

                  const linkNode = document.createElement('A')
                  linkNode.setAttribute('href', `#reference${refNb}`)
                  linkNode.appendChild(supNode)
                  /**
                   * @param {Element} node
                   */
                  linkNode.onAttach = node => {
                    if (typeof opt?.onReference === 'function') {
                      opt.onReference(node, id)
                    }
                  }

                  targetNode.appendChild(linkNode)

                  ff = (1 + refMatch[0].length)
                  lastFlushCursor += ff
                }
              } else if (allowLink) {
                const endMatch = REGEX_CLOSING_LINK.exec(restLineText)

                if (endMatch) {
                  flush()

                  const title = endMatch[1]
                    .replace(REGEX_REP_ESC_CHAR_LINK_TEXT, ']')
                  const url = endMatch[2]

                  const linkNode = document.createElement('A')
                  linkNode.setAttribute('href', url)
                  linkNode.textContent = title
                  linkNode.onAttach = opt?.onLink

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
                  imageNode.onAttach = opt?.onImage
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
                codeNode.onAttach = opt?.onCode

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
        /** @type {Element} */
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

        /** @type {null|Element} */
        const contentNode = contentParsed?.firstChildElement

        if (contentNode != null) {
          // childNodes is theoretically a live NodeList
          for (const node of Array.from(contentNode.childNodes)) {
            itemNode.appendChild(node)
          }
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

export { Element, Text, parse }

export default { Element, Text, parse }
