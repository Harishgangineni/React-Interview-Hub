/* From Javascript_coding_Interview_questions.pdf and the programs/output questions in React_JS_Interview_Questions_.pdf, plus classic machine-coding questions */
HUB.add({
  id: 'jscoding', title: 'JavaScript coding and output questions', short: 'JS coding',
  blurb: 'Write-the-code and guess-the-output questions, with corrected versions of tricky snippets and polyfills.',
  items: [
{ q: `Reverse a string ("hello" → "olleh").`,
  k: `Break the word into letter blocks, line them up backwards, and glue them together again.`,
  a: `<code>split('')</code> makes an array of characters, <code>reverse()</code> flips it, <code>join('')</code> makes a string. Say in the interview: "split → reverse → join". For emoji or accented text use <code>[...str]</code> (splits by code point, not UTF-16 unit). Manual loop shows you know the logic.`,
  c: `function reverseString(str) {
  return [...str].reverse().join('')
}
reverseString('hello') // 'olleh'

// without built-ins
function reverseLoop(str) {
  let out = ''
  for (let i = str.length - 1; i >= 0; i--) out += str[i]
  return out
}` },
{ q: `Remove duplicates from an array ([1,2,2,3,4,4,5] → [1,2,3,4,5]).`,
  k: `Pour the toys into a magic bag that refuses to hold two of the same, then pour them back out.`,
  a: `<code>Set</code> stores unique values; spread turns it back into an array (O(n)). Alternatives: <code>filter</code> with <code>indexOf</code> (O(n²)), or a loop with a seen object. Order is preserved.`,
  c: `const unique = [...new Set([1, 2, 2, 3, 4, 4, 5])]   // [1, 2, 3, 4, 5]

// interview-style without Set
const arr = [1, 2, 3, 4, 1, 2]
const out = []
for (const n of arr) if (!out.includes(n)) out.push(n)

// filter version
arr.filter((item, index) => arr.indexOf(item) === index)`,
  t: `Your PDF's second version uses arr[dup] inside filter, where dup is already the value, not an index. Use the filter version above instead.` },
{ q: `Find the largest number in an array.`,
  k: `Look at every number and remember the biggest one you have seen so far.`,
  a: `<code>Math.max(...arr)</code> spreads the array into arguments. For very large arrays (hundreds of thousands) spreading can overflow the call stack, so use <code>reduce</code> or a loop. Empty array → <code>-Infinity</code>.`,
  c: `const arr = [10, 25, 5, 90, 40]
Math.max(...arr)                                   // 90
arr.reduce((max, n) => (n > max ? n : max), -Infinity)  // safe for huge arrays` },
{ q: `Check if a string is a palindrome ("madam" → true).`,
  k: `A palindrome reads the same forwards and backwards, like "madam" or "racecar".`,
  a: `Reverse and compare, or compare characters from both ends with two pointers (O(n) time, O(1) extra space). For sentences, normalise first: lowercase and remove non-alphanumerics.`,
  c: `const isPalindrome = str => str === [...str].reverse().join('')

function isPalindromeTwoPointer(s) {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '')
  let l = 0, r = s.length - 1
  while (l < r) if (s[l++] !== s[r--]) return false
  return true
}
isPalindromeTwoPointer('A man, a plan, a canal: Panama') // true` },
{ q: `Count character occurrences in a string ("hello" → { h:1, e:1, l:2, o:1 }).`,
  k: `Go through the letters and keep a tally for each one.`,
  a: `Loop through characters and increment a count in an object or Map; initialise to 1 if missing. One pass, O(n).`,
  c: `function countChars(str) {
  const result = {}
  for (const ch of str) result[ch] = (result[ch] || 0) + 1
  return result
}
countChars('hello') // { h: 1, e: 1, l: 2, o: 1 }` },
{ q: `Find the second largest number ([10,20,30,40] → 30).`,
  k: `Find the biggest, then the biggest of the rest that's not the same.`,
  a: `Short version: dedupe with Set, sort descending, take index 1 (O(n log n)). Better: one pass keeping <code>first</code> and <code>second</code> (O(n)). Return a message or <code>null</code> when fewer than two distinct values.`,
  c: `const second = [...new Set(arr)].sort((a, b) => b - a)[1]

function secondLargest(arr) {
  let first = -Infinity, second = -Infinity
  for (const n of arr) {
    if (n > first) { second = first; first = n }
    else if (n > second && n < first) second = n
  }
  return second === -Infinity ? null : second
}
secondLargest([10, 20, 30, 40]) // 30` },
{ q: `Find duplicate elements in an array ([1,2,3,2,4,1] → [2,1]).`,
  k: `If a toy has been seen before, put it on the "twins" list.`,
  a: `<code>filter</code> where <code>indexOf(item) !== index</code> finds repeats, then a Set removes repeated repeats (O(n²)). O(n) version: track seen and duplicates in two Sets.`,
  c: `const arr = [1, 2, 3, 2, 4, 1]
const dups = [...new Set(arr.filter((item, i) => arr.indexOf(item) !== i))]  // [2, 1]

function findDuplicates(arr) {
  const seen = new Set(), dup = new Set()
  for (const n of arr) seen.has(n) ? dup.add(n) : seen.add(n)
  return [...dup]
}` },
{ q: `Find the missing number in 1..n ([1,2,3,5], n = 5 → 4).`,
  k: `Add up what the numbers should total, subtract what they actually total, and the difference is the missing one.`,
  a: `Expected sum of 1..n is <code>n(n+1)/2</code>; subtract the actual sum. Works for exactly one missing number. XOR approach avoids overflow in other languages. For several missing numbers, use a Set.`,
  c: `function missingNumber(arr, n) {
  const expected = (n * (n + 1)) / 2
  const actual = arr.reduce((a, b) => a + b, 0)
  return expected - actual
}
missingNumber([1, 2, 3, 5], 5) // 4` },
{ q: `Sort an array without using sort() (bubble sort).`,
  k: `Compare neighbours and swap them if they're in the wrong order; repeat until nothing swaps.`,
  a: `Bubble sort is O(n²), fine for small arrays and for showing logic. Add an early exit when no swaps happen. Mention you'd use <code>sort((a,b) =&gt; a-b)</code> (TimSort, O(n log n), stable) in real code, and could implement merge or quick sort if asked.`,
  c: `function bubbleSort(input) {
  const arr = [...input]   // don't mutate the caller's array
  for (let i = 0; i < arr.length; i++) {
    let swapped = false
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) { [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; swapped = true }
    }
    if (!swapped) break
  }
  return arr
}
bubbleSort([5, 2, 8, 1]) // [1, 2, 5, 8]`,
  t: `Your PDF's "ascending" sort uses arr[i] < arr[j] for the swap, which actually sorts in descending order. Use > for ascending.` },
{ q: `Count the vowels in a string ("javascript" → 3).`,
  k: `Look for a, e, i, o, u and count them.`,
  a: `Regex <code>/[aeiou]/gi</code> with <code>match</code>; <code>match</code> returns null when none are found, so use <code>?.length ?? 0</code>.`,
  c: `const countVowels = str => str.match(/[aeiou]/gi)?.length ?? 0
countVowels('javascript') // 3` },
{ q: `Count how many times each element occurs in an array ([1,1,2,3,1,4]).`,
  k: `Make a tally sheet: every time you see a number, add one mark next to it.`,
  a: `Loop with an object or Map counter, or <code>reduce</code>. Map keeps number keys as numbers. <code>Object.groupBy</code> is an alternative for grouping.`,
  c: `const arr = [1, 1, 2, 3, 1, 4]
const count = arr.reduce((acc, n) => { acc[n] = (acc[n] || 0) + 1; return acc }, {})
// { 1: 3, 2: 1, 3: 1, 4: 1 }`,
  t: `The comment in your PDF says 3: 2, but 3 appears once in [1,1,2,3,1,4].` },
{ q: `Output: const firstname = fun(); let name = 'vivek'; function fun() { return \`my name is \${name}\` }`,
  k: `The recipe is ready early, but it uses a box that hasn't been made yet, so it breaks.`,
  a: `<b>ReferenceError: Cannot access 'name' before initialization.</b> <code>fun</code> is a function declaration, so it's fully hoisted and callable. But it reads <code>name</code>, a <code>let</code> still in the temporal dead zone at the moment <code>fun()</code> runs. With <code>var name</code> it would print "my name is undefined".`,
  c: `const firstname = fun()
let name = 'vivek'
function fun() { return \`my name is \${name} malviya\` }
console.log(firstname)
// ReferenceError: Cannot access 'name' before initialization` },
{ q: `Output: for loop with setTimeout using let vs var.`,
  k: `With let, each round gets its own box, so you see 0 to 4. With var, everyone shares one box, which says 5 by the time the alarms ring.`,
  a: `<code>let</code> creates a new binding per iteration, so callbacks log <b>0 1 2 3 4</b> (one per second). <code>var</code> is function-scoped: one shared <code>i</code>, which is 5 when the callbacks run, so it logs <b>5 5 5 5 5</b>. Fixes for var: an IIFE, passing <code>i</code> as the third setTimeout argument, or using let.`,
  c: `for (let i = 0; i < 5; i++) setTimeout(() => console.log(i), i * 1000) // 0 1 2 3 4
for (var i = 0; i < 5; i++) setTimeout(() => console.log(i), i * 1000) // 5 5 5 5 5
for (var j = 0; j < 5; j++) setTimeout(k => console.log(k), j * 1000, j) // fixed: 0..4` },
{ q: `Output: var num = 4; function outer() { var num = 2; function inner() { num++; var num = 3; console.log(num) } inner() } outer()`,
  k: `Inside inner there's a new box called num that starts empty, so adding to it gives "not a number", and then it's set to 3.`,
  a: `Logs <b>3</b>. Inside <code>inner</code>, <code>var num</code> is hoisted to the top of inner as <code>undefined</code>, shadowing outer's <code>num</code>. <code>num++</code> makes it <code>NaN</code>, then <code>num = 3</code>, so the log shows 3. Outer variables are untouched.`,
  c: `var num = 4
function outer() {
  var num = 2
  function inner() {
    num++          // local num is undefined → NaN
    var num = 3    // hoisted declaration, assignment happens here
    console.log('num', num)  // num 3
  }
  inner()
}
outer()` },
{ q: `Output: function sayHi() { return (() => 0)() } — what is typeof sayHi()?`,
  k: `The recipe immediately runs a tiny recipe that gives back 0.`,
  a: `<code>sayHi()</code> returns <b>0</b> because the arrow function is invoked immediately (IIFE). <code>typeof sayHi()</code> is <b>"number"</b>.` },
{ q: `Output: objects used as object keys (a[b] = 123; a[c] = 456).`,
  k: `Every toy box gets the same label "[object Object]", so the second note overwrites the first.`,
  a: `Object keys are converted to strings. Both <code>b</code> and <code>c</code> become <code>"[object Object]"</code>, so <code>a[c] = 456</code> overwrites the same key. <code>console.log(a[b])</code> and <code>a[c]</code> both print <b>456</b>. Use a <code>Map</code> to key by object identity.`,
  c: `const a = {}
const b = { key: 'b' }, c = { key: 'c' }
a[b] = 123
a[c] = 456
console.log(a[b]) // 456
console.log(Object.keys(a)) // ['[object Object]']` },
{ q: `Write mul(2)(4)(6) = 48 (currying with normal and arrow functions).`,
  k: `Each call takes one number and gives back a helper waiting for the next number.`,
  a: `Return nested functions that close over earlier arguments. Arrow version is the same in one line.`,
  c: `function mul(a) {
  return function (b) {
    return function (c) { return a * b * c }
  }
}
const mulArrow = a => b => c => a * b * c
mul(2)(4)(6)       // 48
mulArrow(2)(4)(6)  // 48`,
  t: `Your PDF defines the arrow version as call but logs mul(2)(4)(6); name and call must match.` },
{ q: `Write a function returning a Promise that resolves if the value is less than 5 and rejects otherwise.`,
  k: `Make a promise: if the number is small, say "yes"; if not, say "no".`,
  a: `Create the promise with <code>resolve</code>/<code>reject</code>, and always handle rejection with <code>.catch</code> or try/catch.`,
  c: `function checkValue(a) {
  return new Promise((resolve, reject) => {
    if (a < 5) resolve(\`number is \${a}\`)
    else reject(new Error(\`\${a} is not less than 5\`))
  })
}
checkValue(3).then(console.log).catch(e => console.error(e.message))
// async/await
try { console.log(await checkValue(7)) } catch (e) { console.error(e.message) }`,
  t: `The PDF's version checks a < 7 though the question says 5, and never handles the rejection.` },
{ q: `Multiply two numbers without using the * operator.`,
  k: `Multiplying is just adding the same number many times.`,
  a: `Repeated addition in a loop (handle 0 and negative numbers). Mention alternatives: <code>a / (1 / b)</code>, or bit shifting (Russian peasant multiplication) for O(log b).`,
  c: `function multiply(a, b) {
  const negative = (a < 0) !== (b < 0)
  a = Math.abs(a); b = Math.abs(b)
  let result = 0
  for (let i = 0; i < b; i++) result += a
  return negative ? -result : result
}
multiply(5, 3)  // 15
multiply(5, 0)  // 0  (the PDF version returns 5 here)` },
{ q: `Write a polyfill for Array.prototype.map.`,
  k: `Build your own "change every toy" machine.`,
  a: `Loop over the array, call the callback with <code>(value, index, array)</code> and <code>thisArg</code>, collect results in a new array, skip holes.`,
  c: `Array.prototype.myMap = function (cb, thisArg) {
  if (typeof cb !== 'function') throw new TypeError(cb + ' is not a function')
  const result = new Array(this.length)
  for (let i = 0; i < this.length; i++) {
    if (i in this) result[i] = cb.call(thisArg, this[i], i, this)
  }
  return result
}
[2, 3, 4, 5].myMap(n => n * 5) // [10, 15, 20, 25]` },
{ q: `Write a polyfill for Array.prototype.filter.`,
  k: `Build your own "keep only some toys" machine.`,
  a: `Push the <b>original element</b> when the callback returns truthy.`,
  c: `Array.prototype.myFilter = function (cb, thisArg) {
  const result = []
  for (let i = 0; i < this.length; i++) {
    if (i in this && cb.call(thisArg, this[i], i, this)) result.push(this[i])
  }
  return result
}
[2, 3, 4, 5].myFilter(n => n > 2) // [3, 4, 5]`,
  t: `The PDF version pushes cb(this[i]) (true/false) instead of this[i], and then tests the native filter instead of myFilter.` },
{ q: `Write a polyfill for Array.prototype.reduce.`,
  k: `Build your own "squash all toys into one answer" machine.`,
  a: `Start the accumulator with the initial value, or the first element if none was given (throw on an empty array with no initial value). Call the callback with <code>(acc, current, index, array)</code>.`,
  c: `Array.prototype.myReduce = function (cb, initialValue) {
  let i = 0
  let acc = initialValue
  if (arguments.length < 2) {
    if (this.length === 0) throw new TypeError('Reduce of empty array with no initial value')
    acc = this[0]; i = 1
  }
  for (; i < this.length; i++) acc = cb(acc, this[i], i, this)
  return acc
}
[2, 3, 4, 5].myReduce((sum, n) => sum + n, 0) // 14`,
  t: `The PDF version calls cb(this[i], i, this), never passing the accumulator, and uses an undeclared i.` },
{ q: `Write a polyfill for Function.prototype.bind.`,
  k: `Make a copy of a recipe that always knows who it's cooking for.`,
  a: `Return a function that calls the original with the bound <code>this</code> and the combined arguments.`,
  c: `Function.prototype.myBind = function (thisArg, ...preset) {
  const fn = this
  return function (...later) { return fn.apply(thisArg, [...preset, ...later]) }
}
function greet(g) { return g + ', ' + this.name }
greet.myBind({ name: 'Asha' })('Hi') // 'Hi, Asha'` },
{ q: `Write a polyfill for Promise.all.`,
  k: `Wait for all your helpers; if any one says "no", the whole answer is "no".`,
  a: `Return a promise; resolve with results in input order when all settle successfully; reject on the first failure. Handle empty input and non-promise values (<code>Promise.resolve</code>).`,
  c: `function promiseAll(items) {
  return new Promise((resolve, reject) => {
    const results = []; let done = 0
    if (items.length === 0) return resolve(results)
    items.forEach((item, i) => {
      Promise.resolve(item).then(value => {
        results[i] = value
        if (++done === items.length) resolve(results)
      }, reject)
    })
  })
}` },
{ q: `Implement debounce and throttle.`,
  k: `Debounce waits for quiet; throttle allows one go per time slot.`,
  a: `Debounce clears and restarts a timer on every call. Throttle ignores calls until the wait has passed. Preserve <code>this</code> and arguments, and offer <code>cancel</code> for React effect cleanup.`,
  c: `function debounce(fn, wait) {
  let t
  const d = function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait) }
  d.cancel = () => clearTimeout(t)
  return d
}
function throttle(fn, wait) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= wait) { last = now; fn.apply(this, args) }
  }
}` },
{ q: `Flatten a nested array ([1,[2,[3,[4]]]] → [1,2,3,4]).`,
  k: `Open all the boxes inside boxes and put every toy on one shelf.`,
  a: `Built-in: <code>arr.flat(Infinity)</code>. Recursive version with reduce, or an iterative stack to avoid deep recursion.`,
  c: `const flatten = arr => arr.reduce((acc, x) => acc.concat(Array.isArray(x) ? flatten(x) : x), [])
flatten([1, [2, [3, [4]]]])  // [1, 2, 3, 4]
[1, [2, [3, [4]]]].flat(Infinity)` },
{ q: `Write a deep clone function.`,
  k: `Copy the box and every box inside it, so changing the copy never changes the original.`,
  a: `Prefer <code>structuredClone</code>. Hand-written version: handle primitives, arrays, plain objects, Dates, and cycles with a WeakMap.`,
  c: `function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value
  if (value instanceof Date) return new Date(value)
  if (seen.has(value)) return seen.get(value)
  const copy = Array.isArray(value) ? [] : {}
  seen.set(value, copy)
  for (const key of Object.keys(value)) copy[key] = deepClone(value[key], seen)
  return copy
}` },
{ q: `Group anagrams or check whether two strings are anagrams in JavaScript.`,
  k: `Two words are anagrams if they use exactly the same letters, like "listen" and "silent".`,
  a: `Same length and same character counts. Count with an object (O(n)) or compare sorted strings (O(n log n)). See the DSA section for group anagrams.`,
  c: `function isAnagram(s, t) {
  if (s.length !== t.length) return false
  const count = {}
  for (const ch of s) count[ch] = (count[ch] || 0) + 1
  for (const ch of t) { if (!count[ch]) return false; count[ch]-- }
  return true
}
isAnagram('listen', 'silent') // true` },
  ],
});
