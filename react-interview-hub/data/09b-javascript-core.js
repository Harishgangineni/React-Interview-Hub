/* Added from: JavascriptCompleteNotes.pdf, Javascript_InterviewQa.pdf (Top 20 + bonus), and the JavaScript list in React_JS_Interview_Questions_.pdf */
(function () {
  const sec = HUB.sections.find(s => s.id === 'javascript');
  sec.title = 'JavaScript fundamentals';
  sec.short = 'JavaScript';
  sec.blurb = 'Everything from your JS notes and question lists: types, scope, this, async, DOM, OOP, storage, ES6+.';
  sec.items.push(
{ q: `What is JavaScript?`,
  k: `JavaScript is what makes a web page move and react when you click, like batteries in a toy.`,
  a: `A high-level, dynamically typed, single-threaded language with first-class functions, standardised as <b>ECMAScript</b>. It runs in browsers (with access to the DOM and Web APIs) and on servers through Node.js, Deno or Bun. Engines such as V8 JIT-compile it, so "interpreted" is only half true today. With HTML (structure) and CSS (style) it is one of the three core web technologies.`,
  c: `console.log("Hello, JavaScript!") // Hello, JavaScript!` },
{ q: `What is ECMAScript, and how is it related to JavaScript?`,
  k: `ECMAScript is the rule book; JavaScript is the game everyone plays using that rule book.`,
  a: `ECMAScript (ECMA-262) is the language specification maintained by TC39. JavaScript is its most popular implementation. ES5 (2009), then the big ES6/ES2015 release (let/const, arrow functions, classes, modules, promises), then yearly releases (ES2016…ES2025). New features go through proposal stages 0–4 before landing.` },
{ q: `What is the difference between Java and JavaScript?`,
  k: `Car and carpet: the names sound alike, but they are completely different things.`,
  a: `Java is a statically typed, class-based, compiled-to-bytecode language running on the JVM, used for backends, Android and enterprise apps. JavaScript is dynamically typed, prototype-based, runs in browsers and Node, and is event-driven. The similar name was a 1995 marketing decision.` },
{ q: `What are the data types in JavaScript?`,
  k: `Some boxes hold one simple thing (a number, a word); other boxes hold collections of things.`,
  a: `<b>Primitives</b> (immutable, copied by value): string, number, boolean, undefined, null, bigint, symbol. <b>Reference type</b>: object, which includes arrays, functions, dates, regexes, Map and Set (copied by reference). <code>typeof null</code> returns "object" because of a historical bug; <code>typeof</code> a function returns "function"; use <code>Array.isArray</code> for arrays.`,
  c: `typeof "Hi"      // "string"
typeof 10n       // "bigint"
typeof Symbol()  // "symbol"
typeof null      // "object"  (legacy bug)
typeof []        // "object"
typeof function(){} // "function"` },
{ q: `What is the difference between primitive and reference types?`,
  k: `A primitive is a photocopy you can scribble on safely. A reference is the house address: two people with the same address visit the same house.`,
  a: `Assigning a primitive copies the value. Assigning an object copies the reference, so both variables point to the same object and a mutation through one is visible through the other. That's why React needs new objects for state updates, and why comparing objects with <code>===</code> compares identity, not content.`,
  c: `let a = 5; let b = a; b++        // a is still 5
const u = { n: 1 }; const v = u; v.n = 2   // u.n is now 2` },
{ q: `What is the difference between null and undefined?`,
  k: `undefined: the box exists but nobody put anything in it. null: someone put a note in it saying "empty on purpose".`,
  a: `<code>undefined</code> is the default for declared but unassigned variables, missing properties, missing arguments and functions with no return. <code>null</code> is assigned deliberately to mean "no value". <code>null == undefined</code> is true, <code>===</code> is false. <code>typeof undefined</code> is "undefined", <code>typeof null</code> is "object". Default parameters and <code>??</code> treat both as missing.` },
{ q: `What are truthy and falsy values?`,
  k: `In a yes/no question, only a few things count as "no": false, zero, empty words, nothing and not-a-number. Everything else is "yes".`,
  a: `Falsy: <code>false</code>, <code>0</code>, <code>-0</code>, <code>0n</code>, <code>""</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>. Everything else is truthy, including <code>"0"</code>, <code>"false"</code>, <code>[]</code>, <code>{}</code> and functions.`,
  t: `In React, {count &amp;&amp; &lt;Badge/&gt;} renders 0 when count is 0 because 0 is falsy but still renderable.` },
{ q: `What is type coercion (implicit vs explicit conversion)?`,
  k: `Sometimes JavaScript quietly changes a word into a number (or back) to finish a sum. Sometimes you ask it to.`,
  a: `Implicit coercion happens with operators: <code>+</code> with a string concatenates; other arithmetic converts to numbers; <code>==</code> converts before comparing. Explicit conversion uses <code>Number()</code>, <code>String()</code>, <code>Boolean()</code>, <code>parseInt()</code>. Prefer explicit conversion and <code>===</code>.`,
  c: `5 + "5"      // "55"
"5" - 2      // 3
true + 1     // 2
false == 0   // true
null == undefined // true
Number("123") // 123   Boolean(0) // false` },
{ q: `What are the main JavaScript operators?`,
  k: `Signs that do jobs: add, compare, choose, and give default answers.`,
  a: `Arithmetic (<code>+ - * / % ** ++ --</code>), comparison (<code>== === != !== &gt; &lt; &gt;= &lt;=</code>), logical (<code>&amp;&amp; || !</code>, short-circuiting), assignment (<code>= += -= ??= ||= &amp;&amp;=</code>), ternary (<code>cond ? a : b</code>), nullish coalescing (<code>??</code>), optional chaining (<code>?.</code>), spread/rest (<code>...</code>), <code>typeof</code>, <code>instanceof</code>, <code>in</code>, <code>delete</code>.`,
  c: `const result = age >= 18 ? 'Adult' : 'Minor'
user.name ||= 'Guest'   // assign if falsy
config.retries ??= 3    // assign if null/undefined` },
{ q: `What is the difference between let and const?`,
  k: `let is a box you can refill; const is a box with the lid glued on (but the toys inside an object can still move).`,
  a: `Both are block-scoped, hoisted into the temporal dead zone, and can't be redeclared in the same scope. <code>let</code> can be reassigned; <code>const</code> can't. <code>const</code> doesn't make objects immutable: <code>const arr = []; arr.push(1)</code> is fine. Use <code>Object.freeze</code> for shallow immutability.` },
{ q: `What is the temporal dead zone (TDZ)?`,
  k: `The box exists from the start of the room, but you're not allowed to open it until the line where it's made.`,
  a: `<code>let</code>, <code>const</code> and <code>class</code> declarations are hoisted, but reading them before the declaration line throws a <code>ReferenceError</code>. The span from the start of the scope to the declaration is the TDZ. It catches use-before-define bugs that <code>var</code> silently turns into <code>undefined</code>.`,
  c: `console.log(a) // undefined   (var)
var a = 10
console.log(b) // ReferenceError (TDZ)
let b = 20` },
{ q: `What is scope, lexical scope and the scope chain?`,
  k: `Rooms inside rooms: if you can't find a toy in your room, you look in the bigger room outside, then the whole house.`,
  a: `Scope decides where a variable is visible: global, function, block (<code>let</code>/<code>const</code>), and module. JavaScript uses <b>lexical scope</b>: visibility is set by where code is written, not where it's called. To resolve a name, the engine walks the <b>scope chain</b> outward until the global scope; if not found, ReferenceError.` },
{ q: `What is an execution context and the call stack?`,
  k: `Each time a job starts, JavaScript makes a fresh worksheet and puts it on a pile; the top worksheet is the one being worked on.`,
  a: `An execution context holds a variable environment, lexical environment (scope chain) and <code>this</code>. It's created in two phases: <b>creation</b> (memory for declarations: <code>var</code> = undefined, functions fully, let/const in TDZ) and <b>execution</b>. There's one global context, plus one per function call, pushed onto the <b>call stack</b> (LIFO). Too deep recursion → "Maximum call stack size exceeded".` },
{ q: `Explain the event loop, call stack, callback (task) queue and microtask queue.`,
  k: `One cook, a pile of tickets. Urgent sticky notes (promises) always get done before the next normal ticket (timers).`,
  a: `Synchronous code runs on the call stack. Async work is handed to Web APIs (timers, network, DOM events). When it completes, its callback is queued: promise reactions, <code>queueMicrotask</code> and MutationObserver go to the <b>microtask queue</b>; setTimeout, setInterval, I/O and events go to the <b>macrotask (callback) queue</b>. When the stack is empty, the event loop runs <b>all</b> microtasks, may render, then takes <b>one</b> macrotask, and repeats.`,
  c: `console.log('A')
setTimeout(() => console.log('B'), 0)
Promise.resolve().then(() => console.log('C'))
console.log('D')
// A D C B` },
{ q: `What is the difference between setTimeout and setInterval?`,
  k: `setTimeout: an alarm that rings once. setInterval: an alarm that rings again and again.`,
  a: `<code>setTimeout(fn, ms)</code> runs once after at least ms; <code>setInterval(fn, ms)</code> repeats every ms. Both return an id for <code>clearTimeout</code>/<code>clearInterval</code>. The delay is a minimum, not a guarantee (the stack must be free; nested timers clamp to 4 ms; background tabs throttle). For precise repeated async work, prefer recursive setTimeout so calls never overlap. In React, always clear them in effect cleanup.` },
{ q: `What is a callback function, and what is callback hell?`,
  k: `You give a friend a job and say "call me when you're done". Callback hell is when every friend gives another friend a job, and the list of phone calls becomes a messy staircase.`,
  a: `A callback is a function passed to another function to be called later (array methods, events, timers, Node APIs). Nesting async callbacks creates "callback hell" (pyramid of doom) with scattered error handling and inversion of control. Promises and async/await flatten the flow and centralise errors.`,
  c: `function process(num, callback) { callback(num * 2) }
process(5, result => console.log('Result is:', result)) // 10` },
{ q: `What is the difference between a promise and a callback?`,
  k: `A callback is giving your phone number; a promise is getting a receipt you can check any time.`,
  a: `With callbacks you hand control to another function and hope it calls you once, correctly. A Promise is an object representing the eventual result: it settles exactly once, is composable (<code>then</code> chains, <code>Promise.all/allSettled/race/any</code>), propagates errors to one <code>catch</code>, and works with <code>async/await</code>.` },
{ q: `What is the difference between async/await and promises?`,
  k: `Same promise, but async/await lets you write the waiting steps like a normal list.`,
  a: `<code>async/await</code> is syntax on top of promises: an async function always returns a promise; <code>await</code> pauses that function (not the thread) until the promise settles. Benefits: linear code, <code>try/catch</code> for errors, easier debugging. Watch out for accidental sequential awaits: run independent work with <code>Promise.all</code>.`,
  c: `async function getData() {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    return await res.json()
  } catch (err) { console.error(err) }
}` },
{ q: `What is the Fetch API?`,
  k: `fetch is how the page sends a letter to a server and gets a reply.`,
  a: `A promise-based Web API for HTTP requests. <code>fetch()</code> only rejects on network failure, not on 404/500, so check <code>res.ok</code>. Parse with <code>res.json()</code>/<code>text()</code>; send JSON with a body plus <code>Content-Type</code> header; cancel with <code>AbortController</code>; cookies need <code>credentials: 'include'</code> cross-origin.` },
{ q: `What are arrow functions, and how are they different from normal functions?`,
  k: `A shorter way to write a recipe, and it borrows "this" from the room it was written in.`,
  a: `Concise syntax with implicit return for single expressions. They have no own <code>this</code>, <code>arguments</code>, <code>super</code> or <code>prototype</code>; they can't be used with <code>new</code>; <code>this</code> is lexically inherited. Great for callbacks; avoid them as object methods that need <code>this</code>.`,
  c: `const add = (a, b) => a + b
const obj = { name: 'Asha', hi() { setTimeout(() => console.log(this.name)) } }
obj.hi() // 'Asha' (arrow keeps outer this)` },
{ q: `What are the different types of functions in JavaScript?`,
  k: `Many shapes of recipes: named, nameless, short arrow ones, ones that run right away, ones that pause, and ones that wait.`,
  a: `Function declaration (hoisted), function expression (named or anonymous), arrow function, IIFE (immediately invoked), constructor function (with <code>new</code>), class methods, generator functions (<code>function*</code>), async functions, async generators, higher-order functions, callbacks, pure vs impure functions.`,
  c: `function add(a, b) { return a + b }                 // declaration
const mul = function (a, b) { return a * b }         // expression
const sq = x => x * x                                // arrow
;(function () { console.log('IIFE') })()             // IIFE
function* ids() { yield 1; yield 2 }                 // generator
async function load() { return await fetch(url) }    // async` },
{ q: `What are default parameters, rest parameters and the spread operator?`,
  k: `Default: a normal choice if nobody tells you. Rest: scoop leftovers into a bag. Spread: pour a bag out.`,
  a: `<b>Default parameters</b> apply when an argument is <code>undefined</code>. <b>Rest</b> (<code>...args</code>) collects remaining arguments into a real array and must be last. <b>Spread</b> expands arrays/iterables into arguments or elements and copies/merges objects (shallow).`,
  c: `function createUser(name = 'User', ...roles) { return { name, roles } }
createUser('Jane', 'admin', 'editor') // { name: 'Jane', roles: ['admin','editor'] }
const merged = [...[1, 2], ...[3, 4]]            // [1,2,3,4]
const obj2 = { ...{ a: 1, b: 2 }, c: 3 }        // { a:1, b:2, c:3 }
Math.max(...[10, 25, 5])                        // 25` },
{ q: `What is a higher-order function?`,
  k: `A recipe that takes another recipe as an ingredient, or gives you a new recipe back.`,
  a: `A function that takes a function as an argument or returns a function. Examples: <code>map</code>, <code>filter</code>, <code>reduce</code>, <code>forEach</code>, <code>sort</code>, <code>setTimeout</code>, function factories, middleware, HOCs, debounce/throttle wrappers.`,
  c: `function operation(a, b, fn) { return fn(a, b) }
operation(5, 3, (x, y) => x + y) // 8` },
{ q: `What is the difference between map() and forEach()?`,
  k: `map makes a new list of changed toys; forEach just visits each toy.`,
  a: `<code>map</code> returns a new array of the same length with transformed values (chainable, use for rendering lists). <code>forEach</code> returns <code>undefined</code> and is for side effects. Neither can be stopped early (use <code>for...of</code>, <code>some</code> or <code>every</code>). Neither awaits async callbacks.` },
{ q: `What are the most important array methods?`,
  k: `Tools for lists: add, remove, find, change, squash, and sort.`,
  a: `Mutating: <code>push</code>, <code>pop</code>, <code>shift</code>, <code>unshift</code>, <code>splice</code>, <code>sort</code>, <code>reverse</code>, <code>fill</code>. Non-mutating: <code>map</code>, <code>filter</code>, <code>reduce</code>, <code>find</code>, <code>findIndex</code>, <code>findLast</code>, <code>some</code>, <code>every</code>, <code>includes</code>, <code>indexOf</code>, <code>slice</code>, <code>concat</code>, <code>flat</code>, <code>flatMap</code>, <code>join</code>, <code>at</code>, and the copying versions <code>toSorted</code>, <code>toReversed</code>, <code>toSpliced</code>, <code>with</code>. Static: <code>Array.from</code>, <code>Array.of</code>, <code>Array.isArray</code>.`,
  c: `const nums = [3, 1, 4, 2]
nums.sort()                 // default sort compares as STRINGS
nums.sort((a, b) => a - b)  // numeric: [1, 2, 3, 4]
nums.slice(1, 3)            // copy part: [2, 3]
nums.splice(1, 2)           // remove 2 items from index 1 (mutates)`,
  t: `Classic trap: [10, 1, 5].sort() gives [1, 10, 5]. Always pass a comparator for numbers.` },
{ q: `What is the difference between slice() and splice()?`,
  k: `slice photocopies a piece; splice cuts the real list.`,
  a: `<code>slice(start, end)</code> returns a shallow copy of a portion and doesn't change the original. <code>splice(start, deleteCount, ...items)</code> removes and/or inserts in place and returns the removed items. Non-mutating alternative: <code>toSpliced</code>.` },
{ q: `What are the most important string methods?`,
  k: `Tools for words: measure them, change case, cut, search and split.`,
  a: `Strings are immutable; methods return new strings: <code>length</code>, <code>toUpperCase/toLowerCase</code>, <code>trim/trimStart/trimEnd</code>, <code>slice</code>, <code>substring</code>, <code>replace/replaceAll</code>, <code>includes</code>, <code>startsWith/endsWith</code>, <code>indexOf</code>, <code>split</code>, <code>padStart/padEnd</code>, <code>repeat</code>, <code>at</code>, <code>localeCompare</code>. Template literals for interpolation and multi-line strings.`,
  c: `const text = ' Hello JavaScript '
text.trim().toUpperCase()     // 'HELLO JAVASCRIPT'
text.includes('Java')          // true
\`Hi \${name}, you are \${age}\`  // template literal` },
{ q: `What are template literals?`,
  k: `Strings with holes where you can drop in values, written between backticks.`,
  a: `Backtick strings supporting interpolation <code>\${expr}</code>, multi-line text and tagged templates (a function processes the parts; used by styled-components and GraphQL tags).` },
{ q: `What is destructuring?`,
  k: `Taking toys out of a box by their names, in one go.`,
  a: `Syntax to unpack values from arrays (by position) and objects (by key), with defaults, renaming, nested patterns and rest. Used heavily for props, hook returns and function parameters.`,
  c: `const { name, age = 18, city: location } = user
const [first, second, ...rest] = [10, 20, 30, 40]
function Card({ title, onClose }) { /* props destructured */ }` },
{ q: `What is the difference between for...in and for...of?`,
  k: `for...in gives you the labels (keys); for...of gives you the toys (values).`,
  a: `<code>for...in</code> iterates enumerable string keys of an object, including inherited ones; avoid it for arrays. <code>for...of</code> iterates values of iterables (arrays, strings, Map, Set, generators). For objects use <code>Object.keys/values/entries</code> with for...of. <code>break</code> exits a loop; <code>continue</code> skips to the next iteration.`,
  c: `for (const key in { a: 1, b: 2 }) console.log(key)   // a b
for (const val of [10, 20]) console.log(val)          // 10 20
for (const [k, v] of Object.entries(user)) console.log(k, v)` },
{ q: `How many ways can you create an object in JavaScript?`,
  k: `Write it directly, use a stamp (class), copy from a parent object, or use a factory.`,
  a: `Object literal <code>{}</code>; <code>new Object()</code>; constructor function with <code>new</code>; ES6 <code>class</code>; <code>Object.create(proto)</code> (also <code>Object.create(null)</code> for a prototype-less map); factory functions; <code>Object.assign</code>/spread from other objects; <code>Object.fromEntries</code>; <code>structuredClone</code>; JSON.parse.`,
  c: `const a = { name: 'A' }
function Person(n) { this.name = n }; const b = new Person('B')
class User { constructor(n) { this.name = n } }; const c = new User('C')
const d = Object.create(a)
const e = Object.fromEntries([['name', 'E']])` },
{ q: `What are the useful Object methods (keys, values, entries, assign, freeze, seal)?`,
  k: `Tools to list a box's labels, its toys, both together, copy toys in, or lock the box.`,
  a: `<code>Object.keys/values/entries</code> list own enumerable keys, values, pairs. <code>Object.assign(target, ...src)</code> shallow-copies props. <code>Object.freeze</code> prevents add/delete/change (shallow). <code>Object.seal</code> prevents add/delete but allows changing existing props. <code>Object.hasOwn(obj, key)</code> (preferred over <code>hasOwnProperty</code>), <code>Object.groupBy</code>, <code>Object.fromEntries</code>.` },
{ q: `What is the difference between Object.seal and Object.freeze?`,
  k: `Sealed box: you can swap toys but not add or remove any. Frozen box: nothing can change at all.`,
  a: `Both make the object non-extensible and properties non-configurable. <b>seal</b> keeps existing properties writable; <b>freeze</b> also makes them read-only. Both are shallow (nested objects stay mutable). In strict mode violations throw; otherwise they fail silently. Check with <code>Object.isSealed/isFrozen</code>.`,
  c: `const u = Object.seal({ name: 'John' })
u.name = 'Mike'  // allowed
u.age = 25       // ignored
const f = Object.freeze({ name: 'John' })
f.name = 'Alice' // ignored` },
{ q: `What is optional chaining (?.) and nullish coalescing (??)?`,
  k: `?. means "only look inside if it's there"; ?? means "if it's empty, use this instead".`,
  a: `<code>a?.b</code>, <code>a?.[key]</code>, <code>fn?.()</code> short-circuit to <code>undefined</code> when the left side is null/undefined, avoiding "Cannot read properties of undefined". <code>x ?? y</code> returns y only for null/undefined, so 0, '' and false are kept (unlike <code>||</code>).`,
  c: `user.address?.zip?.code   // undefined, no crash
const count = 0
count ?? 100   // 0
count || 100   // 100` },
{ q: `What is the difference between Map and Set (and Map vs object)?`,
  k: `A Map is a labelled box where the label can be anything; a Set is a bag that never keeps two of the same toy.`,
  a: `<b>Map</b>: key/value pairs with any key type (objects too), keeps insertion order, has <code>size</code>, is iterable, and is optimised for frequent adds/removes. Plain objects only have string/symbol keys and inherit prototype keys. <b>Set</b>: unique values of any type; <code>add</code>, <code>has</code>, <code>delete</code>; ES2025 adds <code>union</code>, <code>intersection</code>, <code>difference</code>.`,
  c: `const m = new Map([[{ id: 1 }, 'obj key']])
const unique = [...new Set([1, 2, 2, 3])]  // [1, 2, 3]` },
{ q: `What are WeakMap and WeakSet?`,
  k: `Boxes that don't hold toys tightly: if nobody else wants a toy anymore, it can be thrown away.`,
  a: `Collections whose keys (WeakMap) or values (WeakSet) must be objects and are held <b>weakly</b>, so they don't prevent garbage collection. Not iterable, no <code>size</code>. Use for private data per object, caching computed data for DOM nodes, or tracking visited objects without memory leaks.` },
{ q: `What is Symbol and BigInt?`,
  k: `Symbol: a name tag nobody else can copy. BigInt: numbers too big for normal numbers.`,
  a: `<code>Symbol('desc')</code> creates a unique, immutable value used as non-colliding object keys and well-known protocol hooks (<code>Symbol.iterator</code>). <code>BigInt</code> (<code>123n</code>, <code>BigInt(x)</code>) represents integers beyond <code>Number.MAX_SAFE_INTEGER</code> (2^53 − 1); you can't mix BigInt and Number in arithmetic without converting.` },
{ q: `What are the useful Number, Math and Date methods?`,
  k: `Helpers for rounding, finding biggest and smallest, random numbers, and reading the calendar.`,
  a: `Number: <code>toFixed</code> (returns a string), <code>toPrecision</code>, <code>Number.isInteger</code>, <code>Number.isNaN</code> (stricter than global isNaN), <code>parseFloat</code>. Math: <code>round</code>, <code>floor</code>, <code>ceil</code>, <code>trunc</code>, <code>abs</code>, <code>max/min</code>, <code>random</code>, <code>PI</code>. Date months are 0-indexed (0 = January); use <code>Intl.DateTimeFormat</code> for display and consider time zones. Floating point: <code>0.1 + 0.2 !== 0.3</code>.` },
{ q: `What is JSON.stringify() and JSON.parse() used for?`,
  k: `stringify turns a toy box into a letter; parse turns the letter back into a toy box.`,
  a: `<code>JSON.stringify(value, replacer?, space?)</code> serialises to a JSON string (drops functions, undefined and symbols; Dates become strings; throws on circular refs). <code>JSON.parse(text, reviver?)</code> builds values from JSON. Used for APIs, localStorage and (not ideal) deep cloning; prefer <code>structuredClone</code> for cloning.` },
{ q: `What is the difference between localStorage, sessionStorage and cookies?`,
  k: `localStorage: a diary that stays. sessionStorage: a notepad thrown away when the tab closes. Cookies: notes the browser automatically shows the server every time.`,
  a: `<b>localStorage</b>: ~5 MB, per origin, persists until cleared, shared across tabs. <b>sessionStorage</b>: per tab, cleared when the tab closes. Both are synchronous, string-only and readable by any script (XSS risk). <b>Cookies</b>: ~4 KB, sent automatically with every request to the domain, have expiry, <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code> flags; HttpOnly cookies can't be read by JS, which makes them the right place for session/refresh tokens.` },
{ q: `What is the DOM?`,
  k: `The DOM is the page turned into a family tree of boxes that JavaScript can read and change.`,
  a: `The Document Object Model is a tree of node objects representing the HTML document, with an API to select, read, create, modify and remove elements and handle events. The BOM (Browser Object Model) is the rest of the browser environment: <code>window</code>, <code>location</code>, <code>history</code>, <code>navigator</code>, <code>screen</code>.` },
{ q: `How do you select and change elements in the DOM?`,
  k: `Find the box, then change its words, colours or labels.`,
  a: `Select: <code>getElementById</code>, <code>querySelector</code> (first match), <code>querySelectorAll</code> (static NodeList), <code>getElementsByClassName</code> (live). Change: <code>textContent</code> (safe), <code>innerHTML</code> (XSS risk with user input), <code>setAttribute</code>, <code>classList.add/remove/toggle</code>, <code>style</code>, <code>append</code>/<code>remove</code>. Batch DOM writes to avoid layout thrashing.`,
  c: `const box = document.querySelector('.box')
box.textContent = 'Hello'
box.classList.add('active')
box.setAttribute('data-id', '123')` },
{ q: `What is event delegation?`,
  k: `Instead of giving every kid a whistle, the teacher listens once for the whole class.`,
  a: `Attaching one listener to a common ancestor and using <code>event.target</code> (often with <code>closest()</code>) to handle events from many children, including ones added later. Fewer listeners, less memory, works for dynamic lists. Relies on bubbling, so it doesn't work for non-bubbling events like <code>focus</code> (use <code>focusin</code>).`,
  c: `document.getElementById('list').addEventListener('click', e => {
  const li = e.target.closest('li')
  if (li) console.log('Item clicked:', li.textContent)
})` },
{ q: `How do you stop event propagation, and what is preventDefault?`,
  k: `stopPropagation: "don't pass this message up". preventDefault: "don't do your usual thing" (like a form reloading the page).`,
  a: `<code>e.stopPropagation()</code> stops the event travelling further in capture/bubble phases; <code>e.stopImmediatePropagation()</code> also stops other listeners on the same element. <code>e.preventDefault()</code> cancels the browser default (form submit, link navigation, checkbox toggle). They're independent. Overusing stopPropagation breaks delegation and analytics.` },
{ q: `What is a MutationObserver?`,
  k: `A watcher that tells you whenever boxes on the page are added, removed or changed.`,
  a: `A Web API that asynchronously (as microtasks) reports DOM changes: child list changes, attribute changes and text changes, configured with <code>observe(target, { childList, attributes, subtree, characterData })</code>. Used for third-party widget integration, auto-instrumentation and reacting to DOM you don't control. Siblings: IntersectionObserver (visibility), ResizeObserver (size).`,
  c: `const obs = new MutationObserver(list => list.forEach(m => console.log(m.type)))
obs.observe(document.body, { childList: true, subtree: true })
// later: obs.disconnect()` },
{ q: `What is the difference between call, apply and bind?`,
  k: `All three tell a function who "this" is. call and apply do it right now (one takes a list, one takes a bag); bind gives you a new function for later.`,
  a: `<code>fn.call(thisArg, a, b)</code> invokes immediately with arguments listed; <code>fn.apply(thisArg, [a, b])</code> invokes immediately with an array; <code>fn.bind(thisArg, a)</code> returns a new function with <code>this</code> (and optionally leading args) fixed. Use cases: borrowing methods, partial application, fixing <code>this</code> for callbacks.`,
  c: `function greet(greeting) { return greeting + ', ' + this.name }
const user = { name: 'Asha' }
greet.call(user, 'Hi')     // 'Hi, Asha'
greet.apply(user, ['Hey']) // 'Hey, Asha'
const g = greet.bind(user); g('Hello') // 'Hello, Asha'` },
{ q: `What are classes, constructors and inheritance in JavaScript?`,
  k: `A class is a cookie cutter; each cookie is an object. A child cutter can copy the parent's shape and add sprinkles.`,
  a: `<code>class</code> is syntax over prototypes. <code>constructor</code> runs on <code>new</code>. <code>extends</code> sets up prototype inheritance; <code>super()</code> must be called before using <code>this</code> in a subclass constructor; <code>super.method()</code> calls the parent's version. Also static members, getters/setters, and private <code>#fields</code>.`,
  c: `class Animal { speak() { return 'Animal speaks' } }
class Dog extends Animal {
  constructor(name) { super(); this.name = name }
  speak() { return super.speak() + ' — Woof!' }
}
new Dog('Rex').speak()` },
{ q: `What are the four pillars of OOP in JavaScript?`,
  k: `Keep secrets inside (encapsulation), copy from parents (inheritance), same word different action (polymorphism), and hide the hard parts (abstraction).`,
  a: `<b>Encapsulation</b>: bundle data and methods; private <code>#fields</code> and closures hide state. <b>Inheritance</b>: <code>extends</code>/prototype chain. <b>Polymorphism</b>: subclasses override methods so the same call behaves differently. <b>Abstraction</b>: expose a simple API and hide implementation. In React, composition is preferred over inheritance.`,
  c: `class BankAccount {
  #balance = 0
  deposit(amount) { if (amount > 0) this.#balance += amount }
  getBalance() { return this.#balance }
}` },
{ q: `What is prototypal inheritance?`,
  k: `If a toy doesn't know a trick, it asks its parent, then its grandparent, up the family line.`,
  a: `Every object has an internal <code>[[Prototype]]</code> link (<code>Object.getPrototypeOf</code>). Property lookup walks this chain until found or <code>null</code>. Methods defined on <code>Constructor.prototype</code> are shared by all instances, saving memory. <code>class</code> uses this under the hood.`,
  c: `function Person(name) { this.name = name }
Person.prototype.greet = function () { return 'Hello ' + this.name }
new Person('Alice').greet() // shared method from the prototype` },
{ q: `How does the "this" keyword work in different contexts?`,
  k: `"this" means "who is calling me right now", and the answer changes depending on how you were called.`,
  a: `Global scope: <code>globalThis</code> (window in browsers; undefined inside modules' functions in strict mode). Method call <code>obj.fn()</code>: obj. Plain call: undefined in strict mode (window in sloppy mode). <code>new</code>: the new instance. <code>call/apply/bind</code>: the given value. Arrow functions: inherit from the surrounding scope. DOM event handler (non-arrow): the element the listener is attached to (<code>currentTarget</code>).` },
{ q: `What are generator functions and iterators?`,
  k: `A generator is a storyteller who can pause after each sentence and continue when you say "next".`,
  a: `An iterator is an object with <code>next()</code> returning <code>{ value, done }</code>; iterables implement <code>[Symbol.iterator]</code>. Generators (<code>function*</code>) create iterators: <code>yield</code> pauses and returns a value, <code>next(arg)</code> resumes. Used for lazy sequences, infinite streams, custom iteration, and (historically) Redux-Saga.`,
  c: `function* ids() { let id = 1; while (true) yield id++ }
const gen = ids()
gen.next().value // 1
gen.next().value // 2` },
{ q: `What is function currying?`,
  k: `Instead of giving all ingredients at once, you give one, get a helper back, then give the next.`,
  a: `Transforming <code>f(a, b, c)</code> into <code>f(a)(b)(c)</code>. Enables partial application and reusable specialised functions (event handler factories, Redux middleware <code>store =&gt; next =&gt; action</code>). A generic <code>curry</code> collects args until <code>fn.length</code> is reached.`,
  c: `const curry = fn => function curried(...args) {
  return args.length >= fn.length ? fn(...args) : (...more) => curried(...args, ...more)
}
const add3 = curry((a, b, c) => a + b + c)
add3(1)(2)(3) // 6` },
{ q: `What is memoization in JavaScript?`,
  k: `Write down answers to hard sums so you never have to work them out twice.`,
  a: `Caching results of a pure function by its arguments so repeated calls return instantly. Key by a serialised argument list or use a Map/WeakMap. Trade memory for speed; only for pure, expensive, repeatedly called functions.`,
  c: `function memoize(fn) {
  const cache = new Map()
  return function (...args) {
    const key = JSON.stringify(args)
    if (!cache.has(key)) cache.set(key, fn.apply(this, args))
    return cache.get(key)
  }
}` },
{ q: `What are throttling and debouncing?`,
  k: `Debounce: wait until the kid stops talking, then answer once. Throttle: answer at most once every few seconds.`,
  a: `Both limit how often a function runs during bursts of events. <b>Debounce</b> runs once after N ms of silence (search box, autosave, resize end). <b>Throttle</b> runs at most once per N ms (scroll, mousemove, drag). See the X vs Y section for implementations.`,
  c: `const debounce = (fn, delay) => {
  let timer
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay) }
}` },
{ q: `What is the difference between deep copy and shallow copy?`,
  k: `Shallow copy: a new box but the same toys inside. Deep copy: a new box with brand-new copies of every toy.`,
  a: `Shallow copy (<code>{...obj}</code>, <code>Object.assign</code>, <code>slice</code>) copies top-level values; nested objects stay shared. Deep copy duplicates everything: <code>structuredClone(obj)</code> (handles Dates, Maps, Sets, cycles; not functions/DOM nodes), JSON round-trip (loses Dates, undefined, functions), or a library/recursive clone.`,
  c: `const original = { a: 1, nested: { b: 2 } }
const shallow = { ...original }; shallow.nested.b = 99   // original.nested.b is 99 too
const deep = structuredClone(original); deep.nested.b = 5 // original unchanged` },
{ q: `How do you handle errors in JavaScript (try/catch/finally, throw, custom errors)?`,
  k: `try: attempt the job. catch: what to do if it breaks. finally: clean up no matter what.`,
  a: `Wrap risky code in <code>try</code>; <code>catch (err)</code> handles it; <code>finally</code> always runs. <code>throw new Error(msg)</code> raises errors; extend <code>Error</code> for custom types and set <code>name</code>; use <code>{ cause }</code> to chain. For promises use <code>.catch</code> or try/catch with await. Log to a monitoring tool (e.g. Sentry); don't expose stack traces to users.`,
  c: `class ValidationError extends Error {
  constructor(msg) { super(msg); this.name = 'ValidationError' }
}
try { if (age < 18) throw new ValidationError('Age must be 18+') }
catch (e) { if (e instanceof ValidationError) showError(e.message); else throw e }
finally { setLoading(false) }` },
{ q: `What are the useful console methods and how do you debug with DevTools?`,
  k: `console prints notes for you; DevTools lets you pause the program and look inside.`,
  a: `<code>console.log/info/warn/error</code>, <code>console.table</code>, <code>console.group/groupEnd</code>, <code>console.assert</code>, <code>console.time/timeEnd</code>, <code>console.trace</code>. In DevTools: breakpoints (line, conditional, DOM, XHR, event listener), <code>debugger</code> statement, watch expressions, call stack, Network and Performance panels, React DevTools. Remove noisy logs before production.` },
{ q: `What is TypeScript?`,
  k: `TypeScript is JavaScript with labels on every box, so mistakes are caught before the program runs.`,
  a: `A typed superset of JavaScript by Microsoft that compiles to JavaScript. Adds static types, interfaces, generics, enums, and type inference; catches errors at build time and powers editor autocomplete and refactoring. Types are erased at runtime, so validate external data separately (zod).` },
{ q: `What are JavaScript best practices for clean code?`,
  k: `Use clear names, keep jobs small, don't repeat yourself, and keep secrets safe.`,
  a: `Use <code>const</code> by default, <code>let</code> when needed, never <code>var</code>; <code>===</code>; small single-purpose functions; camelCase variables, PascalCase classes, UPPER_SNAKE_CASE constants, <code>is/has</code> booleans; ES modules and feature folders; separate business logic from UI; ESLint + Prettier; tests for important logic; avoid globals, <code>eval</code> and <code>innerHTML</code> with user input; validate and sanitise input; handle errors.` },
  );
})();
