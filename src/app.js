import { average, maximum, median, minimum, mode, range, standardDeviation, summary } from './statistics.js'

/**
 * A small array of numbers for testing purposes.
 */
const array = [5, 1, 1, 1, 3, -2, 2, 5, 7, 4, 5, 16]

/**
 * A large array of 500,000 numbers generated using a chaotic formula to ensure
 * a wide distribution of values, including duplicates for testing the mode function.
 */
const largeArray = Object.freeze(
  Array.from({ length: 500_000 }, (_, i) => {
    const chaoticIndex = (i * 15485863) % 500_000
    return (chaoticIndex % 100) + (chaoticIndex % 3 === 0 ? 50 : 0)
  })
)

/**
 * Formats a string with ANSI red color codes.
 *
 * @param {string} text - The text to format.
 * @returns {string} The formatted red string.
 */
const red = (text) => `\x1b[31m${text}\x1b[0m`

/**
 * Runs a statistical function and logs its results.
 *
 * @param {string} label - The label for the statistical function.
 * @param {() => void} callback - The function to execute.
 */
const runStatisticalFunction = (label, callback) => {
  console.log(`\n${label}\n${'='.repeat(label.length)}`)
  try {
    callback()
  } catch (err) {
    console.error(red(`ERROR: ${err.message}`))
  }
}

/**
 * Main function to execute the statistical functions and log their results.
 */
const main = () => {
  runStatisticalFunction('Medelvärde (average)', () => {
    console.log(average(array))
    console.log(average(largeArray))
  })

  runStatisticalFunction('Maxvärde (maximum)', () => {
    console.log(maximum(array))
    console.log(maximum(largeArray))
  })

  runStatisticalFunction('Median (median)', () => {
    console.log(median(array))
    console.log(median(largeArray))
  })

  runStatisticalFunction('Minvärde (minimum)', () => {
    console.log(minimum(array))
    console.log(minimum(largeArray))
  })

  runStatisticalFunction('Typvärde (mode)', () => {
    console.log(mode(array))
    console.log(mode([1]))
    console.log(mode([1, 1, 1]))
    console.log(mode([1, 2, 1, 2]))
    console.log(mode(largeArray))
  })

  runStatisticalFunction('Variationsbredd (range)', () => {
    console.log(range(array))
    console.log(range(largeArray))
  })

  runStatisticalFunction('Standardavvikelse (standardDeviation)', () => {
    console.log(standardDeviation(array))
    console.log(standardDeviation(largeArray))
  })

  runStatisticalFunction('Sammanfattning (summary)', () => {
    console.log(summary(array))
    console.log(summary(largeArray))
  })
}

// Starting point of the application.
main()
