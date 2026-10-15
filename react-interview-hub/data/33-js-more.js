/* More JS utilities and deep dives from LinkedIn question lists the user pasted. Written and tested for this hub. Appended to keep ids stable. */
(function () {
  const sec = id => HUB.sections.find(s => s.id === id).items;
  const C = (lv, q, k, a, c, t) => ({ lv, q, k, a, c, t });
  sec('coding').push(
C('Medium', `React build: a reusable useDebounce hook from scratch.`,
  `Hand back the value only after it has stopped changing for a moment.`,
  `Keep the debounced value in state; on each change start a timer that sets it after the delay; clear the timer in cleanup so only the last change wins. Use it with search inputs: <code>const term = useDebounce(input, 300)</code>, then fetch on <code>term</code>.`,
  `function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)          // new keystroke cancels the previous timer
  }, [value, delay])
  return debounced
}`),
C('Medium', `Utility: Promise.race polyfill (and a timeout helper built on it).`,
  `Several helpers run; whoever finishes first, success or failure, decides the result.`,
  `Return a promise that settles with the first input to settle. Common use: add a timeout to a request.`,
  `function race(promises) {
  return new Promise((resolve, reject) => { for (const p of promises) Promise.resolve(p).then(resolve, reject) })
}
const withTimeout = (p, ms) => race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout')), ms))])`),
C('Medium', `Utility: implement setInterval using setTimeout, plus clearAllTimeouts.`,
  `Set the next alarm each time the current one rings; keep a list so you can switch them all off.`,
  `A recursive setTimeout schedules the next run after each run (no overlap). To clear everything, track ids in a Set by wrapping setTimeout.`,
  `function mySetInterval(fn, ms) {
  const handle = { id: null, active: true }
  const tick = () => { if (!handle.active) return; fn(); handle.id = setTimeout(tick, ms) }
  handle.id = setTimeout(tick, ms)
  return () => { handle.active = false; clearTimeout(handle.id) }   // returns a "clear" function
}
const timeouts = new Set()
function trackedTimeout(fn, ms) { const id = setTimeout(() => { timeouts.delete(id); fn() }, ms); timeouts.add(id); return id }
function clearAllTimeouts() { timeouts.forEach(clearTimeout); timeouts.clear() }`),
C('Medium', `Utility: flatten a nested object into dot paths ({a:{b:1}} → {"a.b":1}).`,
  `Write every deep label as one long address.`,
  `Recursively walk plain objects, joining keys with a dot; arrays can use indexes. Useful for forms, query strings and diffing.`,
  `function flattenObject(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? prefix + '.' + k : k
    if (v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)) flattenObject(v, key, out)
    else out[key] = v
  }
  return out
}
flattenObject({ user: { name: 'Asha', address: { city: 'Hyderabad' } }, active: true })
// { 'user.name': 'Asha', 'user.address.city': 'Hyderabad', active: true }`),
C('Easy', `Utility: sort an array of objects by multiple keys (e.g. city asc, then age desc).`,
  `Sort by the first rule; when two are tied, use the next rule.`,
  `One comparator that loops through the sort keys and returns the first non-zero comparison. Use <code>localeCompare</code> for strings; <code>toSorted</code> to avoid mutating.`,
  `function sortBy(arr, keys) {   // keys: [['city', 'asc'], ['age', 'desc']]
  return arr.toSorted((a, b) => {
    for (const [k, dir] of keys) {
      const x = a[k], y = b[k]
      const cmp = typeof x === 'string' ? x.localeCompare(y) : x - y
      if (cmp) return dir === 'desc' ? -cmp : cmp
    }
    return 0
  })
}`),
C('Medium', `Utility: run N callback-based async tasks in series.`,
  `Do the jobs one after another; start the next only when the previous one says "done".`,
  `Each task takes a callback <code>(err, result)</code>. Run task i, then call the next from its callback; stop on the first error. (Promise version: a for...of loop with await.)`,
  `function runSeries(tasks, done) {
  const results = []
  function next(i) {
    if (i === tasks.length) return done(null, results)
    tasks[i]((err, res) => { if (err) return done(err); results.push(res); next(i + 1) })
  }
  next(0)
}
// Promise version
async function runSeriesAsync(tasks) { const out = []; for (const t of tasks) out.push(await t()); return out }`),
C('Hard', `Utility: infinite currying, sum(1)(2)(3)() → 6.`,
  `Keep collecting numbers until someone calls with empty brackets.`,
  `Return a function that keeps a running total; when called with no argument, return the total. Variant: support <code>sum(1, 2)(3)()</code> by summing all arguments.`,
  `function sum(...a) {
  let total = a.reduce((x, y) => x + y, 0)
  return function next(...b) {
    if (!b.length) return total
    total += b.reduce((x, y) => x + y, 0)
    return next
  }
}
sum(1)(2)(3)()     // 6
sum(1, 2)(3, 4)()  // 10`),
C('Medium', `Utility: deepFreeze an object (Object.freeze is shallow).`,
  `Lock the box and every box inside it.`,
  `Object.freeze only freezes the top level; nested objects stay mutable. Recursively freeze each object property (skip already-frozen values to handle shared references).`,
  `function deepFreeze(obj) {
  Object.values(obj).forEach(v => { if (v && typeof v === 'object' && !Object.isFrozen(v)) deepFreeze(v) })
  return Object.freeze(obj)
}`),
C('Medium', `Utility: convert a flat array with parentId into a tree.`,
  `Hang each item under its parent, like putting folders inside folders.`,
  `One pass to index nodes by id (with an empty children array), a second pass to attach each node to its parent or to the roots. O(n). Used for menus, comments and org charts.`,
  `function toTree(items) {
  const byId = new Map(items.map(i => [i.id, { ...i, children: [] }])), roots = []
  for (const node of byId.values()) {
    const parent = node.parentId != null ? byId.get(node.parentId) : null
    parent ? parent.children.push(node) : roots.push(node)
  }
  return roots
}`),
C('Hard', `Implement a basic useState using closures (how hooks remember state).`,
  `React keeps a list of boxes for each component and hands them out in the same order every render.`,
  `React stores hook state on the component's fiber in an ordered list; each <code>useState</code> call reads the slot at its position. That's why hooks must be called in the same order (no hooks in conditions). A tiny version with a module-level array and index shows the idea.`,
  `let hooks = [], index = 0
function useMyState(initial) {
  const i = index++
  if (!(i in hooks)) hooks[i] = typeof initial === 'function' ? initial() : initial
  const setState = v => { hooks[i] = typeof v === 'function' ? v(hooks[i]) : v; rerender() }
  return [hooks[i], setState]
}
function rerender() { index = 0; Component() }   // a real renderer would re-run the component
function Component() { const [n, setN] = useMyState(0); return { n, inc: () => setN(c => c + 1) } }`),
C('Hard', `Implement a simplified virtual DOM: create elements and render them to the real DOM.`,
  `Describe the page as plain objects first, then build the real page from that description.`,
  `<code>h(type, props, ...children)</code> returns a plain object (like JSX output). <code>render(vnode)</code> creates DOM nodes recursively, setting attributes and event listeners. A real implementation adds diffing (compare old and new trees, patch only changes) and keys.`,
  `const h = (type, props, ...children) => ({ type, props: props || {}, children: children.flat() })
function render(v) {
  if (typeof v === 'string' || typeof v === 'number') return document.createTextNode(String(v))
  const el = document.createElement(v.type)
  for (const [k, val] of Object.entries(v.props)) {
    if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), val); else el.setAttribute(k, val)
  }
  v.children.forEach(c => el.appendChild(render(c)))
  return el
}
document.body.appendChild(render(h('ul', { class: 'list' }, h('li', null, 'One'), h('li', null, 'Two'))))`),
C('Medium', `Lazy-load images with IntersectionObserver (and the native way).`,
  `Only fetch a picture when it's about to scroll into view.`,
  `Modern browsers support <code>loading="lazy"</code> on img/iframe, which is the first choice (never for the LCP image). For custom behaviour, put the real URL in <code>data-src</code> and swap it when the observer reports the image near the viewport.`,
  `const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return
  const img = e.target; img.src = img.dataset.src; io.unobserve(img)
}), { rootMargin: '200px' })
document.querySelectorAll('img[data-src]').forEach(img => io.observe(img))
// native: <img src="photo.webp" loading="lazy" width="400" height="300" alt="...">`),
C('Hard', `React build: drag-and-drop to reorder a list (HTML5 drag events).`,
  `Pick up an item, drop it in a new spot, and the list order changes.`,
  `Track the dragged index; on drop, remove it from the old position and insert at the new one (immutably). Add keyboard alternatives (move up/down buttons) for accessibility; libraries like dnd-kit handle touch and accessibility in production.`,
  `function SortableList({ initial }) {
  const [items, setItems] = useState(initial), [dragIndex, setDragIndex] = useState(null)
  function move(from, to) { setItems(list => { const next = [...list]; const [it] = next.splice(from, 1); next.splice(to, 0, it); return next }) }
  return <ul>{items.map((item, i) => (
    <li key={item.id} draggable onDragStart={() => setDragIndex(i)} onDragOver={e => e.preventDefault()}
      onDrop={() => { if (dragIndex !== null && dragIndex !== i) move(dragIndex, i); setDragIndex(null) }}>
      {item.label}
      <button onClick={() => i > 0 && move(i, i - 1)} aria-label={'Move ' + item.label + ' up'}>↑</button>
      <button onClick={() => i < items.length - 1 && move(i, i + 1)} aria-label={'Move ' + item.label + ' down'}>↓</button>
    </li>))}</ul>
}`),
C('Medium', `Utility: retry a failing async function with exponential backoff.`,
  `If the shop says "try later", wait a bit, then a bit longer each time, and give up after a few tries.`,
  `Loop up to <code>retries</code> times; on failure wait <code>base × 2^attempt</code> plus random jitter (so many clients don't retry at the same moment); don't retry errors that won't succeed (4xx except 408/429); honour <code>Retry-After</code> when present; re-throw after the last attempt. Combine with AbortSignal so the user can cancel.`,
  `const sleep = ms => new Promise(r => setTimeout(r, ms))
async function retry(fn, { retries = 3, base = 300, shouldRetry = err => !(err.status >= 400 && err.status < 500 && ![408, 429].includes(err.status)) } = {}) {
  for (let attempt = 0; ; attempt++) {
    try { return await fn(attempt) }
    catch (err) {
      if (attempt >= retries || !shouldRetry(err)) throw err
      await sleep(base * 2 ** attempt + Math.random() * base)   // backoff + jitter
    }
  }
}
// retry(() => apiFetch('/orders'), { retries: 4 })`),
  );

  sec('javascript').push(
{ lv: 'Medium', q: `Closures deep dive: do they capture values or references, when are they created, and how do you free closure memory?`,
  k: `A closure keeps a live window onto the outer variables, not a photo; the window stays open while someone still holds the function.`,
  a: `A closure is created when a function is <b>created</b>, and it keeps a reference to its outer <b>variables</b> (the environment), not a copy of their values, so it sees later updates and can modify them. Not every nested function matters: only variables actually referenced are kept alive (engines optimise the rest). <b>Scope</b> is where a variable is visible; a <b>closure</b> is what a function remembers after the outer function returned. <b>Memory:</b> closed-over data stays alive as long as the function is reachable (event listeners, timers, caches, global references). Free it by removing listeners, clearing timers, setting long-lived references to <code>null</code>, bounding caches (or WeakMap), and not capturing large objects you don't need.`,
  c: `function counter() { let n = 0; return { inc: () => ++n, get: () => n } }
const c = counter(); c.inc(); c.inc(); c.get()   // 2 — both functions share the same live n

let handler = makeHandler(bigData)               // closure keeps bigData alive
button.addEventListener('click', handler)
button.removeEventListener('click', handler); handler = null   // now bigData can be collected` },
{ lv: 'Medium', q: `Hoisting edge cases: function vs variable with the same name, function expressions, duplicate declarations.`,
  k: `Recipes are fully ready early; var boxes exist but are empty; arrow and expression recipes aren't ready until their line.`,
  a: `Function declarations are hoisted with their body; <code>var</code> is hoisted as <code>undefined</code>; <code>let/const/class</code> are hoisted into the TDZ. If a function and a <code>var</code> share a name, the function wins at hoisting time, but a later assignment overwrites it. Two function declarations with the same name: the last one wins. Function expressions and arrow functions behave like their variable: calling a <code>var</code>-declared one early gives <b>TypeError: not a function</b>; a <code>let/const</code> one gives <b>ReferenceError</b>. A local <code>var</code> shadows a global and starts as <code>undefined</code> (classic IIFE trap). <code>var</code> inside an <code>if</code> block is still function-scoped.`,
  c: `console.log(typeof a)   // 'function' — function wins during hoisting
var a = 1
function a() {}
console.log(typeof a)   // 'number' — the assignment ran

greet()                  // TypeError: greet is not a function (var greet is undefined)
var greet = function () {}

var x = 'global'
;(function () { console.log(x); var x = 'local' })()   // undefined (local var hoisted)` },
{ lv: 'Medium', q: `When do you use Promise.all, allSettled, race and any in real projects?`,
  k: `all: need every helper; allSettled: want every report; race: whoever finishes first; any: first one who succeeds.`,
  a: `<b>Promise.all</b>: you need every result and one failure should fail the whole operation (dashboard required data, checkout steps); fails fast. <b>Promise.allSettled</b>: you want every outcome regardless of failures (bulk uploads, analytics, showing partial results with per-item errors). <b>Promise.race</b>: the first to settle wins, success or failure (timeouts for fetch, cancelling slow work). <b>Promise.any</b>: the first <i>success</i> wins and errors are ignored unless all fail (backup APIs/CDN mirrors, "use whichever API returns first"); rejects with AggregateError if all fail. Remember the losing requests keep running: abort them with AbortController.`,
  c: `// EY-style question: same dashboard data from several APIs, use whichever succeeds first
const controllers = urls.map(() => new AbortController())
const data = await Promise.any(urls.map((u, i) => fetch(u, { signal: controllers[i].signal }).then(r => { if (!r.ok) throw r; return r.json() })))
controllers.forEach(c => c.abort())   // stop the slower ones` },
{ lv: 'Medium', q: `How does JavaScript allocate memory and how does garbage collection work?`,
  k: `JavaScript gives out boxes automatically and later throws away boxes that nobody can reach anymore.`,
  a: `Primitives and references are held in stack frames/registers for running functions; objects, arrays and closures live on the <b>heap</b>. Memory is freed automatically by a <b>garbage collector</b> using <b>reachability</b>: starting from roots (global object, current call stack), anything reachable is kept; unreachable objects are collected (mark-and-sweep; V8 uses generational collection: short-lived objects in a young generation collected often, long-lived ones promoted). GC isn't instant or predictable, and it can't free memory you still reference: leaks come from forgotten listeners/timers, growing caches or global arrays, detached DOM nodes still referenced, and closures holding large data. Diagnose with DevTools Memory heap snapshots and allocation timelines; use WeakMap/WeakRef for caches tied to object lifetimes.` },
{ lv: 'Medium', q: `What are pure functions and the main principles of functional programming? Give a real use case.`,
  k: `A pure recipe always makes the same dish from the same ingredients and doesn't mess up the kitchen.`,
  a: `A <b>pure function</b> returns the same output for the same input and has no side effects (no mutation of inputs, no network/DOM/global changes). Principles: purity, <b>immutability</b>, <b>first-class and higher-order functions</b> (map/filter/reduce, callbacks), <b>composition</b> (pipe/compose), declarative code, avoiding shared mutable state. In React: reducers, selectors, formatters (price, dates), validation functions and components' render logic should be pure; side effects go in event handlers/effects. Benefits: easy to test, cache (memoize) and reason about.`,
  c: `const calcTotal = items => items.reduce((t, i) => t + i.price * i.qty, 0)            // pure
const formatINR = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)
// impure: function addItem(item) { cart.push(item); localStorage.setItem('cart', JSON.stringify(cart)) }` },
{ lv: 'Hard', q: `Why can JSON.parse(JSON.stringify(obj)) fail for deep cloning, and what should you use instead?`,
  k: `Copying by turning things into text loses anything that can't be written as text.`,
  a: `It drops <code>undefined</code>, functions and symbols; turns <code>Date</code> into strings, <code>Map</code>/<code>Set</code> into <code>{}</code>, <code>NaN</code>/<code>Infinity</code> into <code>null</code>; loses prototypes/class instances; throws on circular references and BigInt. Use <b>structuredClone</b> (handles Dates, Maps, Sets, typed arrays, circular refs; not functions/DOM/class prototypes), a library (lodash <code>cloneDeep</code>), or, in React, copy only the path you change.`,
  c: `const original = { d: new Date(), m: new Map([[1, 'a']]), u: undefined }
JSON.parse(JSON.stringify(original))   // { d: '2026-…' }  — Map and undefined lost, Date now a string
structuredClone(original)              // real Date, real Map, u kept` },
{ lv: 'Hard', q: `Why can a long Promise chain or microtask loop block rendering?`,
  k: `Urgent notes are handled before the screen can be redrawn, so an endless pile of urgent notes freezes the screen.`,
  a: `The event loop drains <b>all</b> microtasks (promise callbacks, queueMicrotask) before it can render or take the next task. If microtasks keep scheduling more microtasks, or a chain does heavy synchronous work in each step, the browser never gets a chance to paint or handle input (UI jank, poor INP). Async/await doesn't make CPU work non-blocking. Fix: break heavy work into chunks that yield with <code>setTimeout</code>/<code>scheduler.yield()</code>, move it to a Web Worker, or reduce the work.` },
{ lv: 'Medium', q: `How do you control tab order (tabIndex), and can you override toString on String.prototype?`,
  k: `Tab order follows the page order; only use tabIndex 0 or -1. Changing built-in tools is possible but a bad idea.`,
  a: `<b>tabIndex:</b> native interactive elements are focusable in DOM order. <code>tabIndex="0"</code> adds a custom element to the natural order; <code>tabIndex="-1"</code> makes it focusable only by script (e.g. focusing a dialog or heading); positive values force a custom order and should be avoided (confusing and hard to maintain). Fix order by fixing DOM order. <b>Overriding String.prototype.toString:</b> possible (<code>String.prototype.toString = function () { … }</code>), but modifying built-in prototypes ("monkey patching") breaks expectations, can conflict with libraries and future standards, so only do it in a sandboxed demo. Polyfills that add missing standard methods are the acceptable exception, guarded with an existence check.` },
{ lv: 'Medium', q: `What is recursion? Write a recursive function with a real use case, and when can recursion be dangerous?`,
  k: `A function that solves a big problem by calling itself on a smaller piece, until the piece is tiny.`,
  a: `A recursive function calls itself with a smaller input and has a <b>base case</b> that stops it. Natural for tree-shaped data: nested menus and comments, file explorers, flattening arrays, deep cloning, traversing the DOM or a JSON config. <b>Dangers:</b> every call adds a stack frame, so very deep data causes <code>RangeError: Maximum call stack size exceeded</code>; missing base cases loop forever; repeated sub-problems can be slow (memoize). JavaScript engines generally don't do tail-call optimisation, so for very deep or unknown depth, convert to an iterative loop with an explicit stack.`,
  c: `// Sum all prices in a nested category tree
function totalPrice(node) {
  const own = (node.items || []).reduce((t, i) => t + i.price, 0)
  return own + (node.children || []).reduce((t, c) => t + totalPrice(c), 0)   // base case: no children
}
// Iterative version for very deep trees
function totalPriceIter(root) {
  let sum = 0; const stack = [root]
  while (stack.length) { const n = stack.pop(); sum += (n.items || []).reduce((t, i) => t + i.price, 0); stack.push(...(n.children || [])) }
  return sum
}` },
  );
})();
