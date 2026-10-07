/**
 * Represents statistical summary.
 *
 * @typedef {object} StatisticalSummary
 * @property {number} average - The average value.
 * @property {number} maximum - The maximum value.
 * @property {number} median - The median value.
 * @property {number} minimum - The minimum value.
 * @property {number[]|undefined} mode - The mode value.
 * @property {number} range - The range value.
 * @property {number} standardDeviation - The standard deviation value.
 */

const NOT_ARRAY_MESSAGE = 'The passed argument is not an array.'
const EMPTY_ARRAY_MESSAGE = 'The passed array contains no elements.'
const INVALID_NUMBER_MESSAGE = 'The passed array may only contain valid numbers.'

/**
 * Validates that the argument is a non-empty array of numbers other than NaN.
 *
 * @param {number[]} numbers - The data to validate.
 * @throws {TypeError} If the argument is not an array or contains an invalid number.
 * @throws {Error} If the array is empty.
 */
function validateNumbers(numbers) {
  if (!Array.isArray(numbers)) {
    throw new TypeError(NOT_ARRAY_MESSAGE)
  }

  if (numbers.length === 0) {
    throw new Error(EMPTY_ARRAY_MESSAGE)
  }

  for (const number of numbers) {
    if (typeof number !== 'number' || Number.isNaN(number)) {
      throw new TypeError(INVALID_NUMBER_MESSAGE)
    }
  }
}

/**
 * Returns the median from a validated set without modifying the input array.
 *
 * @param {number[]} numbers - A validated set of numbers.
 * @returns {number} The median value.
 */
function getMedian(numbers) {
  const sortedNumbers = [...numbers].sort((a, b) => a - b)
  const middleIndex = Math.floor(sortedNumbers.length / 2)

  if (sortedNumbers.length % 2 === 1) {
    return sortedNumbers[middleIndex]
  }

  return sortedNumbers[middleIndex - 1] / 2 + sortedNumbers[middleIndex] / 2
}

/**
 * Returns the mode values from a validated set, or undefined if all values occur equally often.
 *
 * @param {number[]} numbers - A validated set of numbers.
 * @returns {number[]|undefined} The mode values, sorted in ascending order.
 */
function getMode(numbers) {
  const frequencies = new Map()
  let highestFrequency = 0
  let allFrequenciesEqual = true

  for (const number of numbers) {
    const frequency = (frequencies.get(number) ?? 0) + 1
    frequencies.set(number, frequency)
    highestFrequency = Math.max(highestFrequency, frequency)
  }

  const firstFrequency = frequencies.values().next().value
  for (const frequency of frequencies.values()) {
    if (frequency !== firstFrequency) {
      allFrequenciesEqual = false
      break
    }
  }

  if (allFrequenciesEqual) {
    return undefined
  }

  return [...frequencies]
    .filter(([, frequency]) => frequency === highestFrequency)
    .map(([number]) => number)
    .sort((a, b) => a - b)
}

/**
 * Calculates the population standard deviation using Welford's one-pass algorithm.
 *
 * @param {number[]} numbers - A validated set of numbers.
 * @returns {{average: number, standardDeviation: number}} The mean and population standard deviation.
 */
function getMoments(numbers) {
  let average = 0
  let sumOfSquaredDifferences = 0
  let sum = 0
  let compensation = 0

  numbers.forEach((number, index) => {
    const difference = number - average
    average += difference / (index + 1)
    sumOfSquaredDifferences += difference * (number - average)

    const adjustedNumber = number - compensation
    const nextSum = sum + adjustedNumber
    compensation = nextSum - sum - adjustedNumber
    sum = nextSum
  })

  return {
    average: sum / numbers.length,
    standardDeviation: Math.sqrt(sumOfSquaredDifferences / numbers.length),
  }
}

/**
 * Returns the average value in a set of numbers.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @throws {TypeError} If the argument is not an array or contains an invalid number.
 * @throws {Error} If the array is empty.
 * @returns {number} The average value.
 */
export function average(numbers) {
  validateNumbers(numbers)
  return getMoments(numbers).average
}

/**
 * Returns the maximum value in a set of numbers.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @throws {TypeError} If the argument is not an array or contains an invalid number.
 * @throws {Error} If the array is empty.
 * @returns {number} The maximum value.
 */
export function maximum(numbers) {
  validateNumbers(numbers)
  return numbers.reduce((max, number) => (number > max ? number : max), numbers[0])
}

/**
 * Returns the median value in a set of numbers.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @throws {TypeError} If the argument is not an array or contains an invalid number.
 * @throws {Error} If the array is empty.
 * @returns {number} The median value.
 */
export function median(numbers) {
  validateNumbers(numbers)
  return getMedian(numbers)
}

/**
 * Returns the minimum value in a set of numbers.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @throws {TypeError} If the argument is not an array or contains an invalid number.
 * @throws {Error} If the array is empty.
 * @returns {number} The minimum value.
 */
export function minimum(numbers) {
  validateNumbers(numbers)
  return numbers.reduce((min, number) => (number < min ? number : min), numbers[0])
}

/**
 * Returns the mode value or values in a set of numbers.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @throws {TypeError} If the argument is not an array or contains an invalid number.
 * @throws {Error} If the array is empty.
 * @returns {number[]|undefined} The mode values, or undefined if all values occur equally often.
 */
export function mode(numbers) {
  validateNumbers(numbers)
  return getMode(numbers)
}

/**
 * Returns the difference between the maximum and minimum values.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @throws {TypeError} If the argument is not an array or contains an invalid number.
 * @throws {Error} If the array is empty.
 * @returns {number} The range value.
 */
export function range(numbers) {
  validateNumbers(numbers)

  let min = numbers[0]
  let max = numbers[0]
  for (const number of numbers) {
    min = Math.min(min, number)
    max = Math.max(max, number)
  }

  return max - min
}

/**
 * Returns the population standard deviation of a set of numbers.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @throws {TypeError} If the argument is not an array or contains an invalid number.
 * @throws {Error} If the array is empty.
 * @returns {number} The population standard deviation.
 */
export function standardDeviation(numbers) {
  validateNumbers(numbers)
  return getMoments(numbers).standardDeviation
}

/**
 * Returns several descriptive statistics from a set of numbers.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @throws {TypeError} If the argument is not an array or contains an invalid number.
 * @throws {Error} If the array is empty.
 * @returns {StatisticalSummary} An object containing descriptive statistics.
 */
export function summary(numbers) {
  validateNumbers(numbers)

  let min = numbers[0]
  let max = numbers[0]
  let mean = 0
  let sumOfSquaredDifferences = 0
  let sum = 0
  let compensation = 0
  const frequencies = new Map()
  let highestFrequency = 0

  numbers.forEach((number, index) => {
    min = Math.min(min, number)
    max = Math.max(max, number)

    const difference = number - mean
    mean += difference / (index + 1)
    sumOfSquaredDifferences += difference * (number - mean)

    const adjustedNumber = number - compensation
    const nextSum = sum + adjustedNumber
    compensation = nextSum - sum - adjustedNumber
    sum = nextSum

    const frequency = (frequencies.get(number) ?? 0) + 1
    frequencies.set(number, frequency)
    highestFrequency = Math.max(highestFrequency, frequency)
  })

  const firstFrequency = frequencies.values().next().value
  let allFrequenciesEqual = true
  for (const frequency of frequencies.values()) {
    if (frequency !== firstFrequency) {
      allFrequenciesEqual = false
      break
    }
  }
  const modeValues = allFrequenciesEqual
    ? undefined
    : [...frequencies]
        .filter(([, frequency]) => frequency === highestFrequency)
        .map(([number]) => number)
        .sort((a, b) => a - b)

  return {
    average: sum / numbers.length,
    maximum: max,
    median: getMedian(numbers),
    minimum: min,
    mode: modeValues,
    range: max - min,
    standardDeviation: Math.sqrt(sumOfSquaredDifferences / numbers.length),
  }
}
