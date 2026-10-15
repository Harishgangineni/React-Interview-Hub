HUB.guide({
  id: 'this-binding', area: 'JavaScript', title: 'this, call, apply and bind', level: 'Beginner → Senior', time: '30 min',
  intro: 'How JavaScript decides what this means, the four binding rules, arrow functions, losing this in callbacks, and call/apply/bind with polyfills.',
  related: 'this call apply bind arrow function',
  prereq: ['Functions and objects', 'Closures'],
  concepts: [
    { h: 'The call site decides', lv: 'Easy', html: `<p><code>this</code> is set when a function is <b>called</b>, not where it is written. Ask "how was this function called?"</p>` },
    { h: 'The four rules (in priority order)', lv: 'Medium', html: `<p>1) <code>new</code> → the new object. 2) Explicit <code>call/apply/bind</code> → the given object. 3) Method call <code>obj.fn()</code> → <code>obj</code>. 4) Plain call <code>fn()</code> → <code>undefined</code> in strict mode/modules (<code>window</code> in sloppy scripts).</p>`,
      code: `const user = { name: 'Asha', hi() { return this.name } }
user.hi()                 // 'Asha'  (method call)
const f = user.hi; f()    // undefined in strict mode (plain call — "this" was lost)
f.call({ name: 'Ravi' })  // 'Ravi'  (explicit)` },
    { h: 'Arrow functions', lv: 'Medium', html: `<p>Arrows have no own <code>this</code>; they use the surrounding scope's. Great for callbacks inside methods; bad as object methods that need <code>this</code>.</p>`,
      code: `const timer = { s: 0, start() { setInterval(() => this.s++, 1000) } }   // arrow keeps timer as this` },
    { h: 'call, apply, bind', lv: 'Easy', html: `<p><code>call(thisArg, a, b)</code> and <code>apply(thisArg, [a, b])</code> invoke now; <code>bind(thisArg, a)</code> returns a new function with this (and leading args) fixed. bind is permanent: you can't re-bind a bound function.</p>` },
    { h: 'Losing this in callbacks and classes', lv: 'Hard', html: `<p>Passing <code>obj.method</code> as a callback detaches it. Fix with arrow wrappers, <code>bind</code>, or class fields with arrows (common in old React class components).</p>`,
      code: `class Counter { count = 0; increment = () => { this.count++ } }   // safe to pass as onClick` },
    { h: 'Polyfill for bind', lv: 'Hard', html: `<p>Shows you understand closures and apply.</p>`,
      code: `Function.prototype.myBind = function (ctx, ...pre) { const fn = this; return function (...args) { return fn.apply(ctx, [...pre, ...args]) } }` },
  ],
  mistakes: ['Using arrow functions as object methods that need this', 'Passing methods as callbacks without binding', 'Expecting this inside a nested normal function to be the outer object', 'Trying to re-bind a bound function'],
  qa: [
    { q: 'How does this work in JavaScript?', a: 'It depends on how a function is called: new → new object; call/apply/bind → given value; method call → the object; plain call → undefined (strict). Arrow functions inherit this lexically.' },
    { q: 'Difference between call, apply and bind?', a: 'call and apply invoke immediately (arguments listed vs as an array); bind returns a new function with this fixed for later.' },
  ],
  scenarios: [{ q: 'A class method used as an event listener throws "Cannot read properties of undefined".', a: 'this was lost when passing the method. Use an arrow class field or bind in the constructor.' }],
  exercises: [{ lv: 'Medium', task: 'Predict: <code>const o = { n: 1, f() { return () =&gt; this.n } }; const g = o.f(); g()</code>', hint: 'Arrow captures this from f.', solution: `// 1`, explain: 'The arrow was created inside f called as o.f(), so its this is o.' }],
  followups: [{ q: 'What is this inside a setTimeout callback?', a: 'For a normal function, undefined in strict mode (window in sloppy scripts); for an arrow, the surrounding this.' }],
  summary: ['Call site decides', 'new > explicit > method > plain', 'Arrows inherit this', 'call/apply invoke; bind returns', 'Callbacks lose this; bind or arrow'],
  quiz: [{ q: 'const f = obj.method; f() — this is?', options: ['obj', 'undefined (strict)', 'f', 'the class'], answer: 1, why: 'A plain call has no object.' }],
});

HUB.guide({
  id: 'prototypes-classes', area: 'JavaScript', title: 'Prototypes, inheritance and classes', level: 'Intermediate → Senior', time: '35 min',
  intro: 'How objects inherit through the prototype chain, constructor functions, ES6 classes, extends/super, private fields, static members, and composition vs inheritance.',
  related: 'prototype inheritance class extends',
  prereq: ['Objects', 'this keyword'],
  concepts: [
    { h: 'The prototype chain', lv: 'Easy', html: `<p>Every object has a hidden link (<code>[[Prototype]]</code>). If a property isn't found on the object, JavaScript looks at its prototype, then that prototype's prototype, up to <code>null</code>.</p>`,
      code: `const animal = { speak() { return 'sound' } }
const dog = Object.create(animal); dog.speak()   // 'sound' (found on prototype)
Object.getPrototypeOf(dog) === animal           // true` },
    { h: 'Constructor functions', lv: 'Medium', html: `<p>Methods on <code>Fn.prototype</code> are shared by all instances created with <code>new</code>, saving memory.</p>`,
      code: `function Person(name) { this.name = name }
Person.prototype.greet = function () { return 'Hi ' + this.name }
new Person('Asha').greet()` },
    { h: 'Classes are syntax over prototypes', lv: 'Easy', html: `<p><code>class</code>, <code>constructor</code>, methods (on the prototype), <code>extends</code> and <code>super</code>; plus static members, getters/setters and private <code>#fields</code>.</p>`,
      code: `class Animal { constructor(name) { this.name = name } speak() { return this.name + ' makes a sound' } }
class Dog extends Animal { speak() { return super.speak() + ' (woof)' } }
class Account { #balance = 0; deposit(n) { this.#balance += n }; get balance() { return this.#balance } }` },
    { h: 'new step by step', lv: 'Hard', html: `<p><code>new F()</code>: create an object linked to <code>F.prototype</code>, call F with this = that object, return it (unless F returns another object).</p>` },
    { h: 'Composition over inheritance', lv: 'Hard', html: `<p>Deep hierarchies are brittle; prefer composing small objects/functions. React follows this: no component inheritance, composition and hooks instead.</p>` },
  ],
  mistakes: ['Confusing __proto__ (instance link) with prototype (property of constructor functions)', 'Calling this before super() in a subclass constructor', 'Putting methods inside the constructor (copied per instance)', 'Deep inheritance trees'],
  qa: [
    { q: 'What is prototypal inheritance?', a: 'Objects inherit properties by delegating lookups along the prototype chain to other objects; classes are syntax over this mechanism.' },
    { q: 'Ways to create objects?', a: 'Object literals, constructor functions with new, classes, Object.create(proto), factory functions, Object.assign/spread, Object.fromEntries.' },
  ],
  scenarios: [{ q: 'A library object shows a method in console but hasOwnProperty returns false.', a: 'The method lives on the prototype, not the instance; use "in" or Object.hasOwn appropriately.' }],
  exercises: [{ lv: 'Medium', task: 'Implement a simple <code>myNew(Fn, ...args)</code>.', hint: 'Object.create + apply.',
    solution: `function myNew(Fn, ...args) {
  const obj = Object.create(Fn.prototype)
  const result = Fn.apply(obj, args)
  return result !== null && typeof result === 'object' ? result : obj
}`, explain: 'Mirrors what new does: link prototype, run constructor, return the object.' }],
  followups: [{ q: 'Are classes hoisted?', a: 'Class declarations are hoisted but in the temporal dead zone, so using them before the declaration throws.' }],
  summary: ['Lookup walks the prototype chain', 'Shared methods live on prototype', 'class = sugar; extends/super', '#private fields, static, getters', 'Prefer composition'],
  quiz: [{ q: 'Where are class methods stored?', options: ['On each instance', 'On the class prototype', 'In a global', 'Nowhere'], answer: 1, why: 'Methods are shared via the prototype.' }],
});

HUB.guide({
  id: 'arrays-objects', area: 'JavaScript', title: 'Arrays, objects, destructuring and immutability', level: 'Beginner → Senior', time: '40 min',
  intro: 'The everyday toolkit: array methods (map, filter, reduce, find, sort), destructuring, spread/rest, optional chaining, immutable updates, and shallow vs deep copies.',
  related: 'map filter reduce spread destructuring deep copy shallow copy',
  prereq: ['Variables and functions', 'Arrow functions'],
  concepts: [
    { h: 'Transform with map, filter, reduce', lv: 'Easy', html: `<p>map changes each item, filter keeps some, reduce folds to one value; none mutate the original.</p>`,
      code: `const orders = [{ total: 200, paid: true }, { total: 50, paid: false }]
const paidTotal = orders.filter(o => o.paid).map(o => o.total).reduce((a, b) => a + b, 0)   // 200` },
    { h: 'Find and test', lv: 'Easy', html: `<p><code>find</code>/<code>findIndex</code>/<code>findLast</code>, <code>some</code>/<code>every</code>, <code>includes</code>. Use <code>for...of</code> when you need to break early.</p>` },
    { h: 'Mutating vs non-mutating', lv: 'Medium', html: `<p>Mutating: push, pop, shift, unshift, splice, sort, reverse. Non-mutating copies: <code>toSorted</code>, <code>toReversed</code>, <code>toSpliced</code>, <code>with</code>, slice, concat, spread. In React state always use non-mutating forms. Numeric sort needs a comparator.</p>`,
      code: `const sorted = scores.toSorted((a, b) => a - b)   // original unchanged` },
    { h: 'Destructuring, spread and rest', lv: 'Easy', html: `<p>Pull values out by name/position with defaults; spread to copy/merge; rest to collect the remainder.</p>`,
      code: `const { name, role = 'user', ...rest } = user
const [first, ...others] = list
const merged = { ...defaults, ...options }` },
    { h: 'Optional chaining and nullish coalescing', lv: 'Easy', html: `<p><code>a?.b?.c</code> stops at null/undefined; <code>x ?? fallback</code> keeps 0 and ''.</p>` },
    { h: 'Shallow vs deep copy', lv: 'Medium', html: `<p>Spread/Object.assign copy one level; nested objects stay shared. <code>structuredClone</code> deep-copies (not functions/DOM). In React, copy only the path you change.</p>`,
      code: `const copy = { ...state }; copy.user.name = 'X'   // ❌ also changes state.user
const next = { ...state, user: { ...state.user, name: 'X' } }   // ✅` },
    { h: 'Grouping and lookups', lv: 'Hard', html: `<p><code>Object.groupBy(items, i =&gt; i.category)</code>, <code>Map</code> for id lookups, <code>Set</code> for uniqueness; convert lists to maps for O(1) access in large data.</p>` },
  ],
  mistakes: ['arr.sort() on numbers without a comparator', 'Mutating state arrays with push/splice', 'Assuming spread makes deep copies', 'Using || when 0 or "" are valid values', 'async callbacks in forEach'],
  qa: [
    { q: 'map vs forEach?', a: 'map returns a new array of transformed values; forEach returns undefined and is for side effects.' },
    { q: 'Shallow vs deep copy?', a: 'Shallow copies the top level and shares nested references; deep copies everything (structuredClone).' },
  ],
  scenarios: [{ q: 'Sorting a table column changes the order in another component too.', a: 'sort() mutated the shared array. Use toSorted() or [...arr].sort().' }],
  exercises: [{ lv: 'Medium', task: 'Group orders by status into an object of arrays without Object.groupBy.', hint: 'reduce with an accumulator object.',
    solution: `const byStatus = orders.reduce((acc, o) => { (acc[o.status] ??= []).push(o); return acc }, {})`, explain: 'The accumulator is created fresh, so mutating it inside reduce is fine.' }],
  followups: [{ q: 'When would you use a Map instead of an object?', a: 'Non-string keys, frequent add/remove, guaranteed insertion order and size, no prototype keys.' }],
  summary: ['map / filter / reduce / find / some / every', 'toSorted & friends don\'t mutate', 'Destructure, spread, rest', '?. and ??', 'Spread = shallow; structuredClone = deep'],
  quiz: [{ q: '[10, 1, 5].sort() returns?', options: ['[1, 5, 10]', '[1, 10, 5]', '[10, 5, 1]', 'Error'], answer: 1, why: 'Default sort compares strings.' }],
});

HUB.guide({
  id: 'dom-events', area: 'JavaScript', title: 'DOM, events, bubbling and delegation', level: 'Beginner → Senior', time: '35 min',
  intro: 'Selecting and changing elements, the event flow (capture, target, bubble), delegation, preventDefault vs stopPropagation, and how React\'s event system relates.',
  related: 'DOM event bubbling delegation propagation',
  prereq: ['HTML structure', 'Functions and callbacks'],
  concepts: [
    { h: 'Select and change', lv: 'Easy', html: `<p>querySelector/querySelectorAll; textContent (safe) vs innerHTML (XSS risk); classList; setAttribute; append/remove.</p>`,
      code: `const btn = document.querySelector('#save')
btn.textContent = 'Saving…'; btn.classList.add('busy'); btn.disabled = true` },
    { h: 'Listening to events', lv: 'Easy', html: `<p><code>addEventListener(type, handler, options)</code>; remove with the same function reference; options <code>{ once, passive, capture, signal }</code>.</p>` },
    { h: 'Capture, target, bubble', lv: 'Medium', html: `<p>Events travel window → target (capture), fire on the target, then bubble back up. Listeners run in the bubble phase by default.</p>` },
    { h: 'Event delegation', lv: 'Medium', html: `<p>One listener on a parent handles events from many (and future) children via <code>e.target.closest()</code>.</p>`,
      code: `list.addEventListener('click', e => {
  const item = e.target.closest('[data-id]')
  if (item) select(item.dataset.id)
})` },
    { h: 'preventDefault vs stopPropagation', lv: 'Medium', html: `<p>preventDefault stops the browser's default action (submit, navigation). stopPropagation stops travel to other elements. They're independent.</p>` },
    { h: 'React events', lv: 'Hard', html: `<p>React attaches listeners at the root container and dispatches synthetic events through the React tree (portals included). <code>onClickCapture</code> for capture. Native listeners in effects need cleanup.</p>` },
    { h: 'Performance', lv: 'Hard', html: `<p>Batch DOM reads then writes to avoid layout thrashing; passive listeners for scroll/touch; debounce/throttle frequent events; requestAnimationFrame for visual updates.</p>` },
  ],
  mistakes: ['innerHTML with user input', 'Removing a listener with a different function reference', 'stopPropagation everywhere (breaks delegation/analytics)', 'Reading layout inside loops that also write'],
  qa: [
    { q: 'What is event bubbling and delegation?', a: 'Bubbling: events travel from the target up through ancestors. Delegation: one ancestor listener handles events for many children using event.target.' },
    { q: 'preventDefault vs stopPropagation?', a: 'preventDefault cancels the browser default; stopPropagation stops the event reaching other elements.' },
  ],
  scenarios: [{ q: 'A dropdown closes immediately when clicking inside it.', a: 'A document click listener (close on outside click) also receives the inside click. Check if event.target is inside the menu (menu.contains(e.target)) before closing.' }],
  exercises: [{ lv: 'Medium', task: 'Close a menu on outside click and Escape, with cleanup, in React.', hint: 'Ref + document listeners in an effect.',
    solution: `function useDismiss(ref, onClose) {
  useEffect(() => {
    const onDown = e => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey) }
  }, [ref, onClose])
}`, explain: 'contains() ignores clicks inside; cleanup removes both listeners.' }],
  followups: [{ q: 'Which events don\'t bubble?', a: 'focus/blur (use focusin/focusout), mouseenter/mouseleave, load and some media events.' }],
  summary: ['textContent over innerHTML', 'Capture → target → bubble', 'Delegation with closest()', 'preventDefault ≠ stopPropagation', 'Batch reads/writes; passive listeners'],
  quiz: [{ q: 'Which stops a form from reloading the page?', options: ['stopPropagation', 'preventDefault', 'return true', 'blur()'], answer: 1, why: 'It cancels the default submit action.' }],
});

HUB.guide({
  id: 'html-semantics-a11y', area: 'HTML', title: 'Semantic HTML, forms, accessibility (WCAG) and SEO basics', level: 'Beginner → Senior', time: '45 min',
  intro: 'Write HTML that works for everyone: landmarks and headings, semantic elements, accessible forms, images, buttons vs links, ARIA rules, keyboard and focus, and how semantics help SEO.',
  related: 'semantic HTML accessibility aria label',
  prereq: ['Basic HTML tags and attributes'],
  concepts: [
    { h: 'Semantic structure and landmarks', lv: 'Easy', html: `<p><code>header</code>, <code>nav</code>, <code>main</code> (one), <code>section</code>, <code>article</code>, <code>aside</code>, <code>footer</code>; one <code>h1</code>, headings in order. Screen-reader users jump between landmarks and headings.</p>`,
      code: `<header><nav aria-label="Main">…</nav></header>
<main><h1>Orders</h1><section aria-labelledby="recent"><h2 id="recent">Recent</h2>…</section></main>
<footer>…</footer>` },
    { h: 'Buttons vs links', lv: 'Easy', html: `<p>Links navigate (<code>&lt;a href&gt;</code>); buttons act (<code>&lt;button type="button"&gt;</code>). A clickable div isn't focusable or announced; don't do it.</p>` },
    { h: 'Accessible forms', lv: 'Medium', html: `<p>Every input has a visible <code>&lt;label for&gt;</code>; group radios in <code>fieldset</code>/<code>legend</code>; right <code>type</code> and <code>autocomplete</code>; errors linked with <code>aria-describedby</code>.</p>`,
      code: `<label for="email">Email</label>
<input id="email" type="email" autocomplete="email" aria-describedby="email-err" aria-invalid="true">
<p id="email-err">Enter a valid email</p>` },
    { h: 'Images and media', lv: 'Easy', html: `<p>Meaningful <code>alt</code> text (empty <code>alt=""</code> for decorative images), captions for video, <code>width</code>/<code>height</code> to prevent layout shift.</p>` },
    { h: 'ARIA: first rule is don\'t', lv: 'Medium', html: `<p>Use native elements first. ARIA only adds semantics, not behaviour: if you add <code>role="button"</code> you must also add keyboard support. Common useful ARIA: <code>aria-label</code>, <code>aria-expanded</code>, <code>aria-current</code>, <code>aria-live</code>.</p>` },
    { h: 'Keyboard and focus', lv: 'Medium', html: `<p>Everything reachable with Tab in logical order; visible focus styles (<code>:focus-visible</code>); skip link; focus management in modals and route changes; no keyboard traps.</p>` },
    { h: 'WCAG basics and SEO', lv: 'Hard', html: `<p>WCAG 2.2 AA: contrast 4.5:1 text (3:1 large), text resizable, not colour-only meaning, target size, reduced motion. Semantics also help SEO: titles, meta description, headings, descriptive links, structured data.</p>` },
  ],
  mistakes: ['div/span with onClick instead of button', 'Placeholder used as label', 'Missing alt or alt="image"', 'Removing focus outlines', 'Skipping heading levels for styling'],
  qa: [
    { q: 'What are semantic tags and why use them?', a: 'Elements that describe meaning (header, nav, main, article, button). They improve accessibility, SEO and readability, and give built-in behaviour.' },
    { q: 'How do you make a React app accessible?', a: 'Semantic HTML, labels, keyboard support and visible focus, focus management for dialogs and routes, ARIA only when needed, contrast, alt text, testing with axe, keyboard and a screen reader.' },
  ],
  scenarios: [{ q: 'A custom dropdown can\'t be used with a keyboard.', a: 'It\'s built from divs. Use a native select or an accessible primitive (React Aria/Radix) with proper roles, aria-expanded, arrow-key support and focus management.' }],
  exercises: [{ lv: 'Easy', task: 'Fix: <code>&lt;div onclick="save()"&gt;Save&lt;/div&gt;</code> and <code>&lt;input placeholder="Email"&gt;</code>.', hint: 'Native elements and labels.',
    solution: `<button type="button" onclick="save()">Save</button>
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email">`, explain: 'A button is focusable and announced; the label is read by screen readers and enlarges the click target.' }],
  followups: [{ q: 'How do you test accessibility?', a: 'Automated (axe, Lighthouse, eslint-plugin-jsx-a11y, jest-axe), keyboard-only walkthroughs, screen readers (NVDA, VoiceOver), and contrast checkers.' }],
  summary: ['Landmarks + ordered headings', 'Links navigate, buttons act', 'Labels for every input', 'alt text; dimensions on images', 'Native first, ARIA second', 'Keyboard, focus, contrast (WCAG AA)'],
  quiz: [{ q: 'Minimum contrast for normal text in WCAG AA?', options: ['2:1', '3:1', '4.5:1', '7:1'], answer: 2, why: '4.5:1 for normal text; 3:1 for large text.' }],
});

HUB.guide({
  id: 'css-cascade-box', area: 'CSS', title: 'CSS fundamentals: cascade, specificity, box model, positioning and stacking', level: 'Beginner → Senior', time: '45 min',
  intro: 'Why styles apply (cascade, specificity, inheritance), how boxes are sized, display types, position values, z-index and stacking contexts, plus modern features like custom properties and :has().',
  related: 'CSS specificity box model position z-index',
  prereq: ['HTML structure', 'CSS syntax'],
  concepts: [
    { h: 'The cascade and specificity', lv: 'Easy', html: `<p>When rules conflict: importance → origin/layers → specificity → order. Specificity counts (ids, classes/attributes/pseudo-classes, elements): <code>#a</code> beats <code>.b.c</code> beats <code>div p</code>. Inline styles beat stylesheets; <code>!important</code> overrides (avoid).</p>` },
    { h: 'Inheritance', lv: 'Easy', html: `<p>Text properties (color, font, line-height) inherit; box properties (margin, border, padding) don't. Use <code>inherit</code>, <code>initial</code>, <code>unset</code> to control.</p>` },
    { h: 'Box model and box-sizing', lv: 'Easy', html: `<p>content + padding + border + margin. <code>box-sizing: border-box</code> makes width include padding and border, which is easier to reason about.</p>`,
      code: `*, *::before, *::after { box-sizing: border-box; }` },
    { h: 'Display types', lv: 'Medium', html: `<p>block, inline, inline-block, flex, grid, none. Inline elements ignore width/height and vertical margins.</p>` },
    { h: 'Position', lv: 'Medium', html: `<p>static (default), relative (offset from itself), absolute (relative to nearest positioned ancestor), fixed (viewport), sticky (scrolls then sticks within its container).</p>`,
      code: `.card { position: relative; } .badge { position: absolute; top: 8px; right: 8px; }
.header { position: sticky; top: 0; }` },
    { h: 'z-index and stacking contexts', lv: 'Hard', html: `<p>z-index only compares elements within the same stacking context. New contexts are created by positioned elements with z-index, <code>opacity &lt; 1</code>, <code>transform</code>, <code>filter</code>, <code>isolation: isolate</code>. That's why a modal with z-index 9999 can still appear under something: it's trapped in a parent's context (portals/top layer fix it).</p>` },
    { h: 'Modern CSS', lv: 'Hard', html: `<p>Custom properties (<code>--brand</code>), <code>:has()</code> parent selector, <code>:is()</code>/<code>:where()</code>, cascade layers (<code>@layer</code>), container queries, native nesting, <code>clamp()</code>.</p>`,
      code: `:root { --brand: #0E7C9B; }
.field:has(input:invalid) label { color: crimson; }` },
  ],
  mistakes: ['Escalating specificity or !important wars', 'Forgetting border-box', 'Absolute children without a positioned parent', 'Raising z-index instead of fixing the stacking context', 'Margin collapse surprises between blocks'],
  qa: [
    { q: 'How is specificity calculated?', a: 'Compare (id count, class/attribute/pseudo-class count, element/pseudo-element count) left to right; inline styles win over stylesheets; !important overrides; equal specificity → later rule wins.' },
    { q: 'What are the position values?', a: 'static, relative, absolute, fixed, sticky (see concepts for behaviour).' },
  ],
  scenarios: [{ q: 'A dropdown appears behind the next card even with z-index: 9999.', a: 'The dropdown sits inside a parent that creates a stacking context (transform/opacity). Remove that, raise the parent context, or render the dropdown in a portal.' }],
  exercises: [{ lv: 'Easy', task: 'Which wins: <code>#nav a</code> (red) or <code>.menu .link.active</code> (blue)?', hint: 'Count ids first.', solution: `/* #nav a wins → red (1 id beats 3 classes) */`, explain: 'Specificity (1,0,1) vs (0,3,0): any id beats any number of classes.' }],
  followups: [{ q: 'What is margin collapsing?', a: 'Vertical margins of adjacent blocks combine into the larger one; it doesn\'t happen in flex/grid containers or with padding/border between them.' }],
  summary: ['Cascade → specificity → order', 'Text inherits; box doesn\'t', 'border-box everywhere', 'relative/absolute/fixed/sticky', 'z-index works within stacking contexts', 'Custom properties, :has(), layers'],
  quiz: [{ q: 'Which creates a new stacking context?', options: ['color: red', 'transform: translateX(0)', 'margin: 0', 'display: block'], answer: 1, why: 'transform (and opacity < 1, filter, isolation) create contexts.' }],
});

HUB.guide({
  id: 'css-flex-grid', area: 'CSS', title: 'Flexbox and CSS Grid', level: 'Beginner → Senior', time: '40 min',
  intro: 'Lay out anything: flex for one dimension, grid for two, alignment, wrapping, gap, sizing with fr/minmax/auto-fill, named areas, and common layouts.',
  related: 'flexbox grid layout',
  prereq: ['Box model', 'Display property'],
  concepts: [
    { h: 'Flexbox basics', lv: 'Easy', html: `<p>A one-dimensional layout along the main axis (<code>flex-direction</code>). <code>justify-content</code> aligns on the main axis, <code>align-items</code> on the cross axis, <code>gap</code> spaces items.</p>`,
      code: `.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }` },
    { h: 'Flex item sizing', lv: 'Medium', html: `<p><code>flex: grow shrink basis</code>. <code>flex: 1</code> shares space equally; <code>flex: none</code> keeps size; <code>min-width: 0</code> lets content shrink (long text/code overflow fix).</p>` },
    { h: 'Grid basics', lv: 'Easy', html: `<p>Two dimensions: define columns/rows, place items, use <code>fr</code> units.</p>`,
      code: `.layout { display: grid; grid-template-columns: 240px 1fr; gap: 24px; }` },
    { h: 'Responsive grids without media queries', lv: 'Medium', html: `<p><code>repeat(auto-fill, minmax(240px, 1fr))</code> makes as many columns as fit.</p>`,
      code: `.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }` },
    { h: 'Named areas', lv: 'Medium', html: `<p>Readable page layouts.</p>`,
      code: `.page { display: grid; grid-template-areas: "header header" "side main" "footer footer"; grid-template-columns: 220px 1fr; }
header { grid-area: header } aside { grid-area: side } main { grid-area: main } footer { grid-area: footer }` },
    { h: 'Centering and alignment', lv: 'Easy', html: `<p><code>display: grid; place-items: center</code> centres anything; flex with <code>justify-content</code> + <code>align-items: center</code> also works.</p>` },
    { h: 'Flex or grid?', lv: 'Hard', html: `<p>Flex for components in a line (nav, toolbars, chips); grid for page layouts and 2D card grids. Subgrid aligns nested items to the parent grid.</p>` },
  ],
  mistakes: ['Using flex for 2D grids and fighting alignment', 'Forgetting min-width: 0 so long content overflows', 'Margins instead of gap', 'Fixed widths that break on mobile'],
  qa: [{ q: 'Flexbox vs Grid?', a: 'Flexbox lays out items in one dimension driven by content; Grid lays out rows and columns together driven by the layout. Use both together.' }],
  scenarios: [{ q: 'A code block inside a grid column makes the whole page scroll sideways.', a: 'Grid/flex items default to min-width: auto. Set min-width: 0 (or minmax(0, 1fr) columns) and overflow-x: auto on the code block.' }],
  exercises: [{ lv: 'Easy', task: 'Make a header with a logo left and nav right that wraps nicely on small screens.', hint: 'flex + space-between + wrap.',
    solution: `.header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }`, explain: 'Space-between pushes items apart; wrap and gap handle narrow screens without media queries.' }],
  followups: [{ q: 'What does auto-fill vs auto-fit do?', a: 'Both create as many tracks as fit; auto-fit collapses empty tracks so items stretch, auto-fill keeps empty tracks.' }],
  summary: ['Flex = 1D; Grid = 2D', 'justify (main) / align (cross)', 'flex: 1; min-width: 0', 'repeat(auto-fill, minmax(...))', 'Named areas for pages', 'place-items: center'],
  quiz: [{ q: 'Which centres a child both ways?', options: ['display:grid; place-items:center', 'text-align:center', 'float:center', 'margin:auto only'], answer: 0, why: 'Grid place-items centres on both axes.' }],
});

HUB.guide({
  id: 'css-responsive', area: 'CSS', title: 'Responsive design: units, media and container queries, images', level: 'Beginner → Senior', time: '35 min',
  intro: 'Build layouts that work from phones to wide screens: viewport meta, mobile-first CSS, rem/em/%/vw, clamp(), media and container queries, responsive images and touch targets.',
  related: 'responsive media query rem em breakpoints',
  prereq: ['Flexbox and Grid basics'],
  concepts: [
    { h: 'Viewport meta and mobile first', lv: 'Easy', html: `<p><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code>, then write base styles for small screens and add <code>min-width</code> media queries.</p>`,
      code: `.grid { display: grid; gap: 16px; }
@media (min-width: 768px) { .grid { grid-template-columns: repeat(3, 1fr); } }` },
    { h: 'Units', lv: 'Medium', html: `<p>px fixed; <b>rem</b> relative to root font size (respects user settings, best for type/spacing); em relative to the element's font size (compounds); % of parent; vw/vh of viewport (dvh on mobile).</p>` },
    { h: 'Fluid type with clamp()', lv: 'Medium', html: `<p>Smoothly scale between a minimum and maximum.</p>`,
      code: `h1 { font-size: clamp(2rem, 5vw, 4rem); }` },
    { h: 'Container queries', lv: 'Hard', html: `<p>Style a component based on its container's width, not the viewport, so it adapts wherever it's placed.</p>`,
      code: `.card-wrap { container-type: inline-size; }
@container (min-width: 420px) { .card { display: grid; grid-template-columns: 120px 1fr; } }` },
    { h: 'Responsive images', lv: 'Medium', html: `<p><code>max-width: 100%</code>, <code>srcset</code> + <code>sizes</code>, <code>&lt;picture&gt;</code> for art direction/formats, <code>loading="lazy"</code> below the fold, width/height to avoid CLS.</p>`,
      code: `<img src="hero-800.webp" srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1600.webp 1600w" sizes="(min-width: 960px) 50vw, 100vw" width="800" height="500" alt="Dashboard preview">` },
    { h: 'Breakpoints and touch', lv: 'Easy', html: `<p>Choose breakpoints where content breaks (common: 640, 768, 1024, 1280). Touch targets ~44px; don't rely on hover; respect <code>prefers-reduced-motion</code> and <code>prefers-color-scheme</code>.</p>` },
  ],
  mistakes: ['Missing viewport meta', 'Desktop-first overrides everywhere', 'Fixed px widths', 'Images without dimensions (layout shift)', 'Tiny tap targets'],
  qa: [{ q: 'px vs em vs rem?', a: 'px is fixed; em is relative to the element\'s font size and compounds when nested; rem is relative to the root font size, consistent and accessible.' }, { q: 'How do you make a site responsive?', a: 'Viewport meta, mobile-first CSS, fluid layouts (flex/grid, %, fr), media and container queries, rem and clamp() for type, responsive images, touch-friendly targets, testing on real devices.' }],
  scenarios: [{ q: 'A card looks great in the main column but breaks in the sidebar.', a: 'It uses viewport media queries; switch to container queries so it adapts to its own width.' }],
  exercises: [{ lv: 'Easy', task: 'Make a three-column card grid that becomes one column on phones without media queries.', hint: 'auto-fill + minmax.',
    solution: `.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 16px; }`, explain: 'min(100%, 280px) prevents overflow on very small screens.' }],
  followups: [{ q: 'Media queries vs container queries?', a: 'Media queries react to the viewport; container queries to a parent container, ideal for reusable components.' }],
  summary: ['Viewport meta + mobile first', 'rem for type/spacing; clamp()', 'Container queries for components', 'srcset/sizes + dimensions', 'Content-driven breakpoints; 44px targets'],
  quiz: [{ q: 'Which unit respects the user\'s browser font size setting best?', options: ['px', 'rem', 'vw', 'cm'], answer: 1, why: 'rem scales with the root font size.' }],
});
