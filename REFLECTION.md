# Reflection and AI collaboration log: Assignment A2

## 1. AI collaboration log

I used ChatGPT Work Mode to inspect the assignment brief and supplied starter files, implement `src/statistics.js`, and check the result against the included tests and lint rules. The implementation in this submission was generated with AI assistance. I need to review it and understand each design choice before submitting it as my own work.

### Prompt that produced a useful result

> “Din uppgift är att slutföra implementationen av modulen `statistics.js` …” (the assignment brief, with the supplied source and test files).

The detailed requirements helped shape a shared input validator, a one-pass Welford calculation for the mean and population standard deviation, and a median function that sorts a copy. The implementation also avoids spreading a large array into `Math.max`, which can exceed JavaScript's argument limit.

### Prompt that was incomplete and how I corrected it

My first message included the submission procedure and assignment PDF, but not the project files or an explicit request to implement the code. ChatGPT could only point out that the source files were missing. I corrected this by attaching the starter files and asking for the implementation and GitLab submission. This shows that a precise task and the relevant code context are needed for useful AI assistance.

## 2. Algorithm and performance analysis

### How the median is calculated

`median` copies the input with spread syntax, sorts that copy numerically with a comparison function, then selects the middle item. For an even number of elements it returns the average of the two middle items. The original array is not changed. The sorting step takes O(n log n) time and the copy takes O(n) additional memory.

### Scaling to larger arrays

Growing the input from 500,000 to 50,000,000 values multiplies the number of values by 100. With an O(n log n) sort, the comparison work grows by roughly 135 times for these sizes, subject to the JavaScript engine and input order. A packed array of 50 million double values uses roughly 400 MB for its element storage; the copied array for sorting needs roughly another 400 MB, before object and sorting overhead. The input itself and the copy must both fit in memory, so the larger case can require well over 800 MB. An external or selection-based algorithm could reduce memory or expected work if the data scale required it, but the current implementation favors clear exact median calculation for the assignment's 500,000-element input.

## 3. Source criticism and defensive validation

### JavaScript coercion and type checks

`typeof value === 'number'` accepts `NaN`, even though this assignment explicitly rejects it. The global `isNaN()` coerces its argument before checking it: for example, `isNaN(null)` and `isNaN(false)` are both false, so a check based only on `!isNaN(value)` can accept non-number values. `Number.isNaN()` avoids that coercion, but must be paired with a strict type check.

### Validation used in the implementation

Every exported function calls the shared validator. It checks that the argument is an array, rejects an empty array, then checks every element with `typeof value === 'number'` and `!Number.isNaN(value)`. This rejects values such as `null`, `true`, strings, and `NaN`, with the required error type and message. The functions do not catch these errors, and the median sorts a copy so none of the functions mutate their input.

---

This document records the AI-assisted work in this session. In this workspace, `npm run test:run` passed all 344 supplied tests, `npm run lint` passed, and `npm run format:check` passed. I must still personally review the implementation and update this reflection with any additional tools, prompts, corrections, or checks from my own review. The supplied files did not include Git repository history, so I could not create or verify the required sequence of 15 commits in this workspace.
