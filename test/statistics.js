import { describe, expect, test } from 'vitest'
import { average, maximum, median, minimum, mode, range, standardDeviation, summary } from '../src/statistics.js'

// ------------------------------------------------------------------------------
//  Helpers
// ------------------------------------------------------------------------------

const ERROR_MESSAGE_NOT_AN_ARRAY = 'The passed argument is not an array.'
const ERROR_MESSAGE_NO_ELEMENTS = 'The passed array contains no elements.'
const ERROR_MESSAGE_ONLY_VALID_NUMBERS = 'The passed array may only contain valid numbers.'

const LENGTH_LARGE_ARRAY = 500_000
const LARGE_ARRAY = Object.freeze(
  Array.from({ length: LENGTH_LARGE_ARRAY }, (_, i) => {
    const chaoticIndex = (i * 15485863) % LENGTH_LARGE_ARRAY
    return (chaoticIndex % 100) + (chaoticIndex % 3 === 0 ? 50 : 0)
  })
)

const BASE_TEST_CASES = [
  // Positive numbers.
  { input: [4, 2, 6, 1, 3, 7, 5, 3] },
  { input: [4, 8, 2, 3, 5] },
  // Negative numbers.
  { input: [-1, -2, -3, -4, -5] },
  { input: [-10, -20, -30, -40, -50, -60] },
  // Mixed numbers.
  { input: [1, -1, 2, -2, 3, -3, 4] },
  { input: [-5, 5, -10, 10, -15, 15] },
  // Zero values.
  { input: [0, 1, 2, 3, 4, 5] },
  { input: [0, 0, 0, 0, 0] },
  // Positive floating point numbers.
  { input: [1.5, 2.5, 3.5, 4.5, 5.5] },
  { input: [1.2, 3.4, 5.6, 7.8] },
  // Negative floating point numbers.
  { input: [-1.5, -2.5, -3.5, -4.5, -5.5] },
  { input: [-1.2, -3.4, -5.6, -7.8] },
  // One element.
  { input: [42] },
  { input: [-42] },
  { input: [0] },
  { input: [1.2] },
  { input: [-1.2] },
  // Large array.
  { input: LARGE_ARRAY },
]

/**
 * Tests the argument (exceptions and side effects).
 *
 * @param {function(): void} func - The function to test.
 */
const testArgument = (func) => {
  describe('exceptions', () => {
    test(`passing anything but an array should throw TypeError with the custom message '${ERROR_MESSAGE_NOT_AN_ARRAY}'`, () =>
      testArgumentNotAnArray(func))

    test(`passing an empty array should throw Error with the custom message '${ERROR_MESSAGE_NO_ELEMENTS}'`, () =>
      testArgumentNotAnEmptyArray(func))

    test(`passing an array containing a value that is not of the type number should throw TypeError with the custom message '${ERROR_MESSAGE_ONLY_VALID_NUMBERS}'`, () =>
      testArgumentArrayNotJustNumbers(func))

    test(`passing an array containing the value Number.NaN should throw TypeError with the custom message '${ERROR_MESSAGE_ONLY_VALID_NUMBERS}'`, () =>
      testArgumentArrayWithNaN(func))

    test(`passing a large array (${LARGE_ARRAY.length} elements) should not throw an exception`, () => {
      expect(() => {
        func(LARGE_ARRAY)
      }).not.toThrowError()
    })
  })

  describe('side effects', () => {
    test('passing [4, 2, 6, 1, 3, 7, 5, 3] should return a value and not modify the argument', () =>
      testNotModifyArgument(func))
  })
}

/**
 * Tests if the specified function handles an argument
 * that is not an array correctly.
 *
 * @param {function(): void} func - The function to test.
 */
const testArgumentNotAnArray = (func) => {
  const invalidArguments = [1, 'not an array', false, undefined, {}, null]

  invalidArguments.forEach((arg) => {
    // Vitest kontrollerar att felet är en TypeError samt matchar felmeddelandet
    expect(() => func(arg)).toThrow(TypeError)
    expect(() => func(arg)).toThrow(ERROR_MESSAGE_NOT_AN_ARRAY)
  })
}

/**
 * Tests if the specified function handles an argument
 * that is an empty array correctly.
 *
 * @param {function(): void} func - The function to test.
 */
const testArgumentNotAnEmptyArray = (func) => {
  expect(() => func([])).toThrow(Error)
  expect(() => func([])).toThrow(ERROR_MESSAGE_NO_ELEMENTS)
}

/**
 * Tests if the specified function handles an argument
 * that is an array containing a value that is not of type number correctly.
 *
 * @param {function(): void} func - The function to test.
 */
const testArgumentArrayNotJustNumbers = (func) => {
  expect(() => func([1, 2, 3, '4'])).toThrow(Error)
  expect(() => func([1, 2, 3, '4'])).toThrow(ERROR_MESSAGE_ONLY_VALID_NUMBERS)
}

/**
 * Tests if the specified function handles an argument
 * that is an array containing the value Number.NaN.
 *
 * @param {function(): void} func - The function to test.
 */
const testArgumentArrayWithNaN = (func) => {
  expect(() => func([1, 2, 3, Number.NaN])).toThrow(Error)
  expect(() => func([1, 2, 3, Number.NaN])).toThrow(ERROR_MESSAGE_ONLY_VALID_NUMBERS)
}

/**
 * Tests if the specified function returns a value
 * without changing the argument.
 *
 * @param {function(): void} func - The function to test.
 */
const testNotModifyArgument = (func) => {
  const arg = [4, 2, 6, 1, 3, 7, 5, 3]
  const res = func(arg)

  switch (func.name) {
    case 'mode':
      // Check that the result is an array.
      expect(Array.isArray(res)).toBe(true)
      break

    case 'summary':
      // Check that the result is an object and not null.
      expect(res).toBeTypeOf('object')
      expect(res).not.toBeNull()
      break

    default:
      // Check that the result is a number and not NaN.
      expect(res).toBeTypeOf('number')
      expect(res).not.toBeNaN()
      break
  }

  // Verify that the argument has not been modified.
  expect(arg).toEqual([4, 2, 6, 1, 3, 7, 5, 3])
}

/**
 * Tests if the specified function returns the expected value.
 *
 * @param {function(): void} func - The function to test.
 * @param {number[]} testCases - The test cases.
 */
function expectToBe(func, testCases) {
  for (const testCase of testCases) {
    const arrStr =
      testCase.input.length < 10
        ? `[${testCase.input.join(', ')}]`
        : `[${testCase.input.slice(0, 10).join(', ')}, ...<large array>]`

    test(`passing ${arrStr} should return ${Array.isArray(testCase.expected) ? `[${testCase.expected.join(', ')}]` : testCase.expected}`, () => {
      expect(func(testCase.input)).toBe(testCase.expected)
    })
  }
}

// ------------------------------------------------------------------------------
//  average
// ------------------------------------------------------------------------------
describe('average', () => {
  describe('argument', () => testArgument(average))

  describe('return value', () => {
    const testCases = structuredClone(BASE_TEST_CASES)
    testCases[0].expected = 3.875
    testCases[1].expected = 4.4
    testCases[2].expected = -3
    testCases[3].expected = -35
    testCases[4].expected = 0.5714
    testCases[5].expected = 0
    testCases[6].expected = 2.5
    testCases[7].expected = 0
    testCases[8].expected = 3.5
    testCases[9].expected = 4.5
    testCases[10].expected = -3.5
    testCases[11].expected = -4.5
    testCases[12].expected = 42
    testCases[13].expected = -42
    testCases[14].expected = 0
    testCases[15].expected = 1.2
    testCases[16].expected = -1.2
    testCases[17].expected = 66.1667

    expectToBe(average, testCases.slice(0, 4))
    test(`passing [${testCases[4].input}] should return ~${testCases[4].expected}`, () => {
      expect(average(testCases[4].input)).toBeCloseTo(testCases[4].expected)
    })
    expectToBe(average, testCases.slice(5))
  })
})

// ------------------------------------------------------------------------------
//  maximum
// ------------------------------------------------------------------------------
describe('maximum', () => {
  describe('argument', () => testArgument(maximum))

  describe('return value', () => {
    const testCases = structuredClone(BASE_TEST_CASES)
    testCases[0].expected = 7
    testCases[1].expected = 8
    testCases[2].expected = -1
    testCases[3].expected = -10
    testCases[4].expected = 4
    testCases[5].expected = 15
    testCases[6].expected = 5
    testCases[7].expected = 0
    testCases[8].expected = 5.5
    testCases[9].expected = 7.8
    testCases[10].expected = -1.5
    testCases[11].expected = -1.2
    testCases[12].expected = 42
    testCases[13].expected = -42
    testCases[14].expected = 0
    testCases[15].expected = 1.2
    testCases[16].expected = -1.2
    testCases[17].expected = 149

    expectToBe(maximum, testCases)
  })
})

// ------------------------------------------------------------------------------
//  median
// ------------------------------------------------------------------------------
describe('median', () => {
  describe('argument', () => testArgument(median))

  describe('return value', () => {
    const testCases = structuredClone(BASE_TEST_CASES)
    testCases[0].expected = 3.5
    testCases[1].expected = 4
    testCases[2].expected = -3
    testCases[3].expected = -35
    testCases[4].expected = 1
    testCases[5].expected = 0
    testCases[6].expected = 2.5
    testCases[7].expected = 0
    testCases[8].expected = 3.5
    testCases[9].expected = 4.5
    testCases[10].expected = -3.5
    testCases[11].expected = -4.5
    testCases[12].expected = 42
    testCases[13].expected = -42
    testCases[14].expected = 0
    testCases[15].expected = 1.2
    testCases[16].expected = -1.2
    testCases[17].expected = 66

    expectToBe(median, testCases)
  })
})

// ------------------------------------------------------------------------------
//  minimum
// ------------------------------------------------------------------------------
describe('minimum', () => {
  describe('argument', () => testArgument(minimum))

  describe('return value', () => {
    const testCases = structuredClone(BASE_TEST_CASES)
    testCases[0].expected = 1
    testCases[1].expected = 2
    testCases[2].expected = -5
    testCases[3].expected = -60
    testCases[4].expected = -3
    testCases[5].expected = -15
    testCases[6].expected = 0
    testCases[7].expected = 0
    testCases[8].expected = 1.5
    testCases[9].expected = 1.2
    testCases[10].expected = -5.5
    testCases[11].expected = -7.8
    testCases[12].expected = 42
    testCases[13].expected = -42
    testCases[14].expected = 0
    testCases[15].expected = 1.2
    testCases[16].expected = -1.2
    testCases[17].expected = 0

    expectToBe(minimum, testCases)
  })
})

// ------------------------------------------------------------------------------
//  mode
// ------------------------------------------------------------------------------
describe('mode', () => {
  describe('argument', () => testArgument(mode))

  describe('return value', () => {
    const testCases = [
      // Positive values, single mode.
      { input: [1, 2, 3, 1, 4], expected: [1] },
      // Negative values, single mode.
      { input: [-3, -1, -3, -2, -10, -1, -3], expected: [-3] },
      // Positive values, multiple modes.
      { input: [9, 1, 4, 3, 4, 9], expected: [4, 9] },
      // Positive values, multiple modes.
      { input: [4, 8, 2, 3, 5, 2, 8, 1, 1, 10, 10], expected: [1, 2, 8, 10] },
      // Mixed values, multiple modes.
      { input: [-2, 5, 1, 1, 5, 5, 2, -2, 2, -2], expected: [-2, 5] },
      // Positive values, single mode.
      { input: [5, 1, 5, 1, 5], expected: [5] },
      // Positive floating point values, single mode.
      { input: [5.3, 5.3, 1.9, 1.9, 5.3], expected: [5.3] },
      // Mixed values, multiple modes.
      {
        input: [3, 5, 2, -5, 9, 2, -5, 5, 10, 4, 1, 0, -1, 9, 0],
        expected: [-5, 0, 2, 5, 9],
      },
      // Positive value, without any mode.
      { input: [42], expected: undefined },
      // All the same positive values, without any mode.
      { input: [1, 1, 1, 1, 1], expected: undefined },
      // Positive values occurs once, without any mode.
      { input: [1, 2, 3, 4, 5], expected: undefined },
      // Positive values occurs three times each, without any mode.
      { input: [5, 1, 1, 5, 5, 1], expected: undefined },
      // Large array.
      {
        input: Object.freeze(Array.from({ length: 200_000 }, () => 42)),
        expected: undefined,
      },
    ]

    for (const testCase of testCases) {
      const arrStr =
        testCase.input.length < 10
          ? `[${testCase.input.join(', ')}]`
          : `[${testCase.input.slice(0, 10).join(', ')}, ...<large array>]`

      test(`passing ${arrStr} should return ${Array.isArray(testCase.expected) ? `[${testCase.expected.join(', ')}]` : testCase.expected}`, () => {
        expect(mode(testCase.input)).toEqual(testCase.expected)
      })
    }
  })
})

// ------------------------------------------------------------------------------
//  range
// ------------------------------------------------------------------------------
describe('range', () => {
  describe('argument', () => testArgument(range))

  describe('return value', () => {
    const testCases = structuredClone(BASE_TEST_CASES)
    testCases[0].expected = 6
    testCases[1].expected = 6
    testCases[2].expected = 4
    testCases[3].expected = 50
    testCases[4].expected = 7
    testCases[5].expected = 30
    testCases[6].expected = 5
    testCases[7].expected = 0
    testCases[8].expected = 4
    testCases[9].expected = 6.6
    testCases[10].expected = 4
    testCases[11].expected = 6.6
    testCases[12].expected = 0
    testCases[13].expected = 0
    testCases[14].expected = 0
    testCases[15].expected = 0
    testCases[16].expected = 0
    testCases[17].expected = 149

    expectToBe(range, testCases)
  })
})

// ------------------------------------------------------------------------------
//  standardDeviation
// ------------------------------------------------------------------------------
describe('standardDeviation', () => {
  describe('argument', () => testArgument(standardDeviation))

  describe('return value', () => {
    const testCases = structuredClone(BASE_TEST_CASES)
    testCases[0].expected = 1.8998
    testCases[1].expected = 2.0591
    testCases[2].expected = 1.4142
    testCases[3].expected = 17.0783
    testCases[4].expected = 2.4411
    testCases[5].expected = 10.8012
    testCases[6].expected = 1.7078
    testCases[7].expected = 0
    testCases[8].expected = 1.4142
    testCases[9].expected = 2.4597
    testCases[10].expected = 1.4142
    testCases[11].expected = 2.4597
    testCases[12].expected = 0
    testCases[13].expected = 0
    testCases[14].expected = 0
    testCases[15].expected = 0
    testCases[16].expected = 0
    testCases[17].expected = 37.2667

    for (const testCase of testCases) {
      const arrStr =
        testCase.input.length < 10
          ? `[${testCase.input.join(', ')}]`
          : `[${testCase.input.slice(0, 10).join(', ')}, ...<large array>]`

      test(`passing ${arrStr} should return ${testCase.expected}`, () => {
        expect(standardDeviation(testCase.input)).toBeCloseTo(testCase.expected, 4)
      })
    }
  })
})

// ------------------------------------------------------------------------------
//  summary
// ------------------------------------------------------------------------------
describe('summary', () => {
  describe('argument', () => testArgument(summary))

  describe('return value', () => {
    test('passing [0] should return an object with the properties average, maximum, median, minimum, mode, range, standardDeviation', () => {
      const result = summary([0])
      expect(Object.keys(result).length).toBe(7)
      expect(result)
        .toHaveProperty('average')
        .toHaveProperty('maximum')
        .toHaveProperty('median')
        .toHaveProperty('minimum')
        .toHaveProperty('mode')
        .toHaveProperty('range')
        .toHaveProperty('standardDeviation')
    })

    test('passing [42] should return {average: 42, maximum: 42, median: 42, minimum: 42, mode: undefined, range: 0, standardDeviation: 0}', () => {
      expect(summary([42])).toEqual({
        average: 42,
        maximum: 42,
        median: 42,
        minimum: 42,
        mode: undefined,
        range: 0,
        standardDeviation: 0,
      })
    })

    const input = [4, 2, 6, 1, 3, 7, 5, 3]
    test(`passing [${input.join(', ')}] should return {average: 3.875, max: 7, median: 3.5, min: 1, mode: [3], range: 6, standardDeviation: 1.8998}`, () => {
      // Get the summary and round standard deviation to 4 decimals.
      const result = summary(input)
      result.standardDeviation = Math.round(result.standardDeviation * 10_000 + Number.EPSILON) / 10_000

      expect(result).toEqual({
        average: 3.875,
        maximum: 7,
        median: 3.5,
        minimum: 1,
        mode: [3],
        range: 6,
        standardDeviation: 1.8998,
      })
    })
  })
})
