// @ts-check

/**
 * @param {boolean|any} value
 * @param {boolean} defaultValue
 * @returns {boolean}
 */
export const parseBoolean = (value, defaultValue) =>
  typeof value === 'boolean'
    ? value
    : defaultValue

/**
 * @param {void|null|number} value
 * @param {number} defaultValue
 * @returns {number}
 */
export const parseMaxHeader = (value, defaultValue) => {
  if (value != null
  && Number.isSafeInteger(value)
  && value >= 1
  && value <= 6) {
    return value
  }

  return defaultValue
}

