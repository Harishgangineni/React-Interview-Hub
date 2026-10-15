/* Coding round: JavaScript utilities, React machine-coding tasks and output puzzles. Written for this hub. */
(function () {
  const C = (lv, q, k, a, c, t) => ({ lv, q, k, a, c, t });
  HUB.add({
    id: 'coding', title: 'Coding round: utilities, React builds, output puzzles', short: 'Coding round',
    blurb: 'Machine-coding practice: write JavaScript utilities from scratch, build common React components, and predict tricky outputs. Try each one before opening the answer.',
    items: [
// ---------- JavaScript utilities ----------
C('Medium', `Utility: implement groupBy(array, keyFn).`,
  `Sort toys into labelled boxes: all red toys in one box, all blue in another.`,
  `Reduce into an object whose keys come from <code>keyFn</code>. Native alternative: <code>Object.groupBy</code> (ES2024). Use a Map if keys aren't strings. O(n).`,
  `function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn]
    ;(acc[key] ??= []).push(item)
    return acc
  }, {})
}
groupBy([{ n: 'a', t: 'x' }, { n: 'b', t: 'y' }, { n: 'c', t: 'x' }], 't')
// { x: [{n:'a',t:'x'}, {n:'c',t:'x'}], y: [{n:'b',t:'y'}] }`),
C('Medium', `Utility: remove duplicate objects from an array by a key (uniqueBy).`,
  `Keep the first toy with each name tag and throw away later copies.`,
  `Track seen keys in a Set and keep only first occurrences; O(n). For primitives, <code>[...new Set(arr)]</code> is enough.`,
  `function uniqueBy(arr, key) {
  const seen = new Set()
  return arr.filter(item => {
    const k = typeof key === 'function' ? key(item) : item[key]
    if (seen.has(k)) return false
    seen.add(k); return true
  })
}
uniqueBy([{ id: 1 }, { id: 2 }, { id: 1 }], 'id')   // [{id:1}, {id:2}]`),
C('Medium', `Utility: debounce with leading option and cancel.`,
  `Wait until the typing stops; optionally answer the very first poke right away too.`,
  `Reset a timer on every call; with <code>leading</code> run immediately on the first call of a burst; expose <code>cancel</code> for cleanup in React effects.`,
  `function debounce(fn, wait, { leading = false } = {}) {
  let timer = null
  function debounced(...args) {
    const callNow = leading && timer === null
    clearTimeout(timer)
    timer = setTimeout(() => { timer = null; if (!leading) fn.apply(this, args) }, wait)
    if (callNow) fn.apply(this, args)
  }
  debounced.cancel = () => { clearTimeout(timer); timer = null }
  return debounced
}`),
C('Medium', `Utility: throttle that also runs the last call (trailing).`,
  `At most one turn every second, but don't forget the very last request.`,
  `Run immediately if enough time passed; otherwise schedule one trailing call with the latest arguments.`,
  `function throttle(fn, wait) {
  let last = 0, timer = null, lastArgs
  return function (...args) {
    const now = Date.now(), remaining = wait - (now - last)
    lastArgs = args
    if (remaining <= 0) {
      clearTimeout(timer); timer = null; last = now; fn.apply(this, args)
    } else if (!timer) {
      timer = setTimeout(() => { last = Date.now(); timer = null; fn.apply(this, lastArgs) }, remaining)
    }
  }
}`),
C('Easy', `Utility: memoize and once.`,
  `Write down answers so you never work them out twice; or allow something to happen only once.`,
  `Cache results by a key built from arguments (JSON or a custom resolver); <code>once</code> stores the first result.`,
  `function memoize(fn, resolver = (...a) => JSON.stringify(a)) {
  const cache = new Map()
  return function (...args) {
    const key = resolver(...args)
    if (!cache.has(key)) cache.set(key, fn.apply(this, args))
    return cache.get(key)
  }
}
function once(fn) { let done = false, r; return (...a) => (done ? r : ((done = true), (r = fn(...a)))) }`),
C('Medium', `Utility: compose and pipe.`,
  `A conveyor belt of little machines: each one's output goes into the next.`,
  `<code>pipe</code> runs functions left to right, <code>compose</code> right to left, using reduce.`,
  `const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)
const slug = pipe(s => s.trim(), s => s.toLowerCase(), s => s.replace(/\\s+/g, '-'))
slug('  Hello World ')   // 'hello-world'`),
C('Medium', `Utility: deep equality check (isEqual).`,
  `Check two toy boxes have exactly the same toys, all the way down.`,
  `Compare primitives with <code>Object.is</code>; for objects/arrays compare type, key sets and values recursively. (Handles plain objects, arrays, Dates; not cycles.)`,
  `function isEqual(a, b) {
  if (Object.is(a, b)) return true
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const ka = Object.keys(a), kb = Object.keys(b)
  if (ka.length !== kb.length) return false
  return ka.every(k => Object.hasOwn(b, k) && isEqual(a[k], b[k]))
}
isEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })   // true`),
C('Medium', `Utility: get(obj, 'a.b[0].c', defaultValue).`,
  `Follow a treasure map path through boxes inside boxes, and give a backup prize if the path is broken.`,
  `Turn the path into keys (handle bracket indexes), walk with optional access, return the default for <code>undefined</code>.`,
  `function get(obj, path, def) {
  const keys = Array.isArray(path) ? path : path.replace(/\\[(\\w+)\\]/g, '.$1').split('.').filter(Boolean)
  let cur = obj
  for (const k of keys) { cur = cur?.[k]; if (cur === undefined) return def }
  return cur
}
get({ user: { tags: [{ name: 'js' }] } }, 'user.tags[0].name')   // 'js'
get({}, 'a.b.c', 'none')                                          // 'none'`),
C('Easy', `Utility: chunk an array into groups of size n.`,
  `Put toys into bags of 3.`,
  `Slice in steps of n. O(n).`,
  `const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n))
chunk([1, 2, 3, 4, 5], 2)   // [[1,2],[3,4],[5]]`),
C('Hard', `Utility: Promise.allSettled and Promise.any polyfills.`,
  `Wait for all helpers and note who succeeded or failed; or take the first helper who succeeds.`,
  `allSettled never rejects: map each promise to a status object. any resolves with the first fulfilment and rejects with an AggregateError if all reject.`,
  `const allSettled = ps => Promise.all(ps.map(p => Promise.resolve(p).then(
  value => ({ status: 'fulfilled', value }), reason => ({ status: 'rejected', reason }))))

function any(ps) {
  return new Promise((resolve, reject) => {
    const errors = []; let rejected = 0
    if (!ps.length) return reject(new AggregateError([], 'All promises were rejected'))
    ps.forEach((p, i) => Promise.resolve(p).then(resolve, e => {
      errors[i] = e
      if (++rejected === ps.length) reject(new AggregateError(errors, 'All promises were rejected'))
    }))
  })
}`),
C('Hard', `Utility: run async tasks with a concurrency limit.`,
  `Only 2 helpers can go to the shop at the same time; when one returns, the next one leaves.`,
  `Start up to <code>limit</code> workers that each take the next task index until none remain; keep results in order. Used for upload queues and API rate limits.`,
  `async function runWithLimit(tasks, limit) {
  const results = new Array(tasks.length)
  let next = 0
  async function worker() {
    while (next < tasks.length) { const i = next++; results[i] = await tasks[i]() }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker))
  return results
}
// runWithLimit(urls.map(u => () => fetch(u)), 3)`),
C('Medium', `Utility: a tiny EventEmitter (on, off, once, emit).`,
  `A walkie-talkie: people subscribe to a channel and hear every message sent on it.`,
  `Store a Map from event name to a Set of listeners. once wraps the listener and removes itself.`,
  `class EventEmitter {
  #events = new Map()
  on(e, fn) { if (!this.#events.has(e)) this.#events.set(e, new Set()); this.#events.get(e).add(fn); return () => this.off(e, fn) }
  off(e, fn) { this.#events.get(e)?.delete(fn) }
  once(e, fn) { const w = (...a) => { this.off(e, w); fn(...a) }; return this.on(e, w) }
  emit(e, ...args) { [...(this.#events.get(e) ?? [])].forEach(fn => fn(...args)) }
}`),
C('Easy', `Utility: classNames helper (like clsx).`,
  `Glue together the paint labels that are switched on.`,
  `Accept strings, arrays and objects of booleans; keep truthy names.`,
  `function cx(...args) {
  return args.flatMap(a => (Array.isArray(a) ? cx(...a) : a && typeof a === 'object' ? Object.keys(a).filter(k => a[k]) : a ? [a] : [])).join(' ')
}
cx('btn', { active: true, disabled: false }, ['lg'])   // 'btn active lg'`),
// ---------- React machine coding ----------
C('Easy', `React build: a counter with increment, decrement (not below 0) and reset.`,
  `A number with three buttons.`,
  `useState with functional updates; guard the minimum; disable the button at 0 for good UX.`,
  `function Counter({ min = 0 }) {
  const [n, setN] = useState(min)
  return <div>
    <button onClick={() => setN(c => Math.max(min, c - 1))} disabled={n === min} aria-label="Decrease">−</button>
    <output aria-live="polite">{n}</output>
    <button onClick={() => setN(c => c + 1)} aria-label="Increase">+</button>
    <button onClick={() => setN(min)}>Reset</button>
  </div>
}`),
C('Medium', `React build: todo list with add, toggle, delete and filter (all/active/done).`,
  `A list of jobs you can add, tick off, remove and filter.`,
  `Keep todos and filter in state; derive the visible list (don't store it); immutable updates; stable ids; form submit for Enter support.`,
  `function Todos() {
  const [todos, setTodos] = useState([]), [filter, setFilter] = useState('all'), [text, setText] = useState('')
  const visible = todos.filter(t => (filter === 'all' ? true : filter === 'done' ? t.done : !t.done))
  function add(e) {
    e.preventDefault(); if (!text.trim()) return
    setTodos(ts => [...ts, { id: crypto.randomUUID(), text: text.trim(), done: false }]); setText('')
  }
  return <>
    <form onSubmit={add}><label>New todo <input value={text} onChange={e => setText(e.target.value)} /></label><button>Add</button></form>
    {['all', 'active', 'done'].map(f => <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>)}
    <ul>{visible.map(t => <li key={t.id}>
      <label><input type="checkbox" checked={t.done} onChange={() => setTodos(ts => ts.map(x => (x.id === t.id ? { ...x, done: !x.done } : x)))} /> {t.text}</label>
      <button onClick={() => setTodos(ts => ts.filter(x => x.id !== t.id))} aria-label={'Delete ' + t.text}>×</button>
    </li>)}</ul>
    {!todos.length && <p>No todos yet.</p>}
  </>
}`),
C('Medium', `React build: debounced search with loading, error, empty states and cancellation.`,
  `Wait until typing stops, then ask the shop; ignore old answers.`,
  `Debounce the term, abort the previous request in effect cleanup, render all four states. (In production, TanStack Query with the term in the key.)`,
  `function Search() {
  const [q, setQ] = useState(''), [state, setState] = useState({ status: 'idle', items: [] })
  useEffect(() => {
    const term = q.trim()
    if (term.length < 2) { setState({ status: 'idle', items: [] }); return }
    const ctrl = new AbortController()
    const t = setTimeout(() => {
      setState(s => ({ ...s, status: 'loading' }))
      fetch('/api/search?q=' + encodeURIComponent(term), { signal: ctrl.signal })
        .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json() })
        .then(items => setState({ status: 'success', items }))
        .catch(e => { if (e.name !== 'AbortError') setState({ status: 'error', items: [] }) })
    }, 300)
    return () => { clearTimeout(t); ctrl.abort() }
  }, [q])
  return <>
    <input type="search" value={q} onChange={e => setQ(e.target.value)} aria-label="Search" />
    {state.status === 'loading' && <p>Searching…</p>}
    {state.status === 'error' && <p role="alert">Something went wrong.</p>}
    {state.status === 'success' && !state.items.length && <p>No results for “{q}”.</p>}
    <ul>{state.items.map(i => <li key={i.id}>{i.name}</li>)}</ul>
  </>
}`),
C('Medium', `React build: useFetch and usePrevious custom hooks.`,
  `Reusable stickers: one fetches data safely, one remembers the last value.`,
  `useFetch aborts on url change and exposes data/error/loading; usePrevious stores the previous render's value in a ref.`,
  `function useFetch(url) {
  const [s, setS] = useState({ data: null, error: null, loading: true })
  useEffect(() => {
    const c = new AbortController(); setS(p => ({ ...p, loading: true }))
    fetch(url, { signal: c.signal }).then(r => { if (!r.ok) throw new Error(r.status); return r.json() })
      .then(data => setS({ data, error: null, loading: false }))
      .catch(error => { if (error.name !== 'AbortError') setS({ data: null, error, loading: false }) })
    return () => c.abort()
  }, [url])
  return s
}
function usePrevious(value) {
  const ref = useRef()
  useEffect(() => { ref.current = value }, [value])
  return ref.current
}`),
C('Medium', `React build: pagination with page numbers, Previous and Next.`,
  `Show 10 toys per page with buttons to move between pages.`,
  `Compute total pages, slice (or request) the current page, disable buttons at the edges, keep page in the URL in real apps.`,
  `function Paginated({ items, pageSize = 10 }) {
  const [page, setPage] = useState(1)
  const pages = Math.max(1, Math.ceil(items.length / pageSize))
  const visible = items.slice((page - 1) * pageSize, page * pageSize)
  return <>
    <ul>{visible.map(i => <li key={i.id}>{i.name}</li>)}</ul>
    <nav aria-label="Pagination">
      <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Previous</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map(n =>
        <button key={n} aria-current={n === page ? 'page' : undefined} onClick={() => setPage(n)}>{n}</button>)}
      <button onClick={() => setPage(p => p + 1)} disabled={page === pages}>Next</button>
    </nav>
  </>
}`),
C('Hard', `React build: infinite scroll with IntersectionObserver.`,
  `When you reach the bottom of the list, quietly fetch the next page.`,
  `Observe a sentinel element; load the next page when it becomes visible, guarding against double loads and stopping when there is no more data.`,
  `function Feed() {
  const [items, setItems] = useState([]), [page, setPage] = useState(1), [hasMore, setHasMore] = useState(true), [loading, setLoading] = useState(false)
  const sentinel = useRef(null)
  useEffect(() => {
    let ignore = false; setLoading(true)
    fetchPage(page).then(res => { if (!ignore) { setItems(i => [...i, ...res.items]); setHasMore(res.hasMore); setLoading(false) } })
    return () => { ignore = true }
  }, [page])
  useEffect(() => {
    const el = sentinel.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && hasMore && !loading) setPage(p => p + 1) }, { rootMargin: '200px' })
    io.observe(el); return () => io.disconnect()
  }, [hasMore, loading])
  return <>{items.map(i => <Post key={i.id} post={i} />)}<div ref={sentinel} />{loading && <p>Loading…</p>}{!hasMore && <p>You're all caught up.</p>}</>
}`),
C('Medium', `React build: accessible tabs.`,
  `Buttons on top; only the chosen page shows below.`,
  `Track the active tab; use role="tablist"/"tab"/"tabpanel", aria-selected, aria-controls, and arrow-key navigation.`,
  `function Tabs({ tabs }) {
  const [active, setActive] = useState(0)
  function onKey(e) {
    if (e.key === 'ArrowRight') setActive(i => (i + 1) % tabs.length)
    if (e.key === 'ArrowLeft') setActive(i => (i - 1 + tabs.length) % tabs.length)
  }
  return <>
    <div role="tablist" onKeyDown={onKey}>
      {tabs.map((t, i) => <button key={t.label} role="tab" id={'tab-' + i} aria-selected={i === active} aria-controls={'panel-' + i} tabIndex={i === active ? 0 : -1} onClick={() => setActive(i)}>{t.label}</button>)}
    </div>
    <div role="tabpanel" id={'panel-' + active} aria-labelledby={'tab-' + active}>{tabs[active].content}</div>
  </>
}`),
C('Medium', `React build: accordion (one or many open).`,
  `Folding sections: tap a title to open or close its content.`,
  `Store open ids in a Set (or a single id for one-at-a-time); use button + aria-expanded + aria-controls. Native <code>&lt;details&gt;</code> is a simple alternative.`,
  `function Accordion({ items, multiple = false }) {
  const [open, setOpen] = useState(new Set())
  const toggle = id => setOpen(prev => {
    const next = new Set(multiple ? prev : [])
    prev.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  return items.map(it => <div key={it.id}>
    <h3><button aria-expanded={open.has(it.id)} aria-controls={'acc-' + it.id} onClick={() => toggle(it.id)}>{it.title}</button></h3>
    <div id={'acc-' + it.id} hidden={!open.has(it.id)}>{it.body}</div>
  </div>)
}`),
C('Hard', `React build: autocomplete with keyboard navigation.`,
  `As you type, suggestions appear; arrows move, Enter picks, Escape closes.`,
  `Filter or fetch suggestions (debounced), track the highlighted index, handle ArrowUp/Down/Enter/Escape, close on blur, and use combobox ARIA roles.`,
  `function Autocomplete({ options, onSelect }) {
  const [q, setQ] = useState(''), [open, setOpen] = useState(false), [hi, setHi] = useState(0)
  const matches = useMemo(() => options.filter(o => o.toLowerCase().includes(q.toLowerCase())).slice(0, 8), [options, q])
  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setHi(i => Math.min(matches.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi(i => Math.max(0, i - 1)) }
    else if (e.key === 'Enter' && open && matches[hi]) { choose(matches[hi]) }
    else if (e.key === 'Escape') setOpen(false)
  }
  function choose(v) { setQ(v); setOpen(false); onSelect?.(v) }
  return <div className="ac">
    <input role="combobox" aria-expanded={open} aria-controls="ac-list" aria-activedescendant={open ? 'ac-' + hi : undefined}
      value={q} onChange={e => { setQ(e.target.value); setOpen(true); setHi(0) }} onKeyDown={onKey} onBlur={() => setTimeout(() => setOpen(false), 100)} />
    {open && matches.length > 0 && <ul id="ac-list" role="listbox">
      {matches.map((m, i) => <li key={m} id={'ac-' + i} role="option" aria-selected={i === hi} onMouseDown={() => choose(m)}>{m}</li>)}
    </ul>}
  </div>
}`),
C('Medium', `React build: star rating component.`,
  `Five stars: hover to preview, click to choose.`,
  `Track value and hover value; render buttons with aria-labels; support keyboard via native buttons (or radio inputs for best semantics).`,
  `function StarRating({ value, onChange, max = 5 }) {
  const [hover, setHover] = useState(0)
  return <div role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
    {Array.from({ length: max }, (_, i) => i + 1).map(n =>
      <button key={n} role="radio" aria-checked={value === n} aria-label={n + ' star' + (n > 1 ? 's' : '')}
        onMouseEnter={() => setHover(n)} onClick={() => onChange(n)}>{n <= (hover || value) ? '★' : '☆'}</button>)}
  </div>
}`),
C('Hard', `React build: OTP input (6 boxes, auto-advance, paste support).`,
  `Six little boxes for a code; typing jumps to the next box, backspace goes back.`,
  `Array of refs; on input keep the last digit and focus next; on Backspace in an empty box focus previous; handle paste by spreading digits.`,
  `function OtpInput({ length = 6, onComplete }) {
  const [vals, setVals] = useState(Array(length).fill('')), refs = useRef([])
  function setAt(i, v) {
    const next = [...vals]; next[i] = v; setVals(next)
    if (next.every(Boolean)) onComplete?.(next.join(''))
  }
  return <div onPaste={e => {
    const digits = e.clipboardData.getData('text').replace(/\\D/g, '').slice(0, length).split('')
    if (digits.length) { e.preventDefault(); const next = [...vals]; digits.forEach((d, i) => (next[i] = d)); setVals(next); refs.current[Math.min(digits.length, length - 1)]?.focus(); if (next.every(Boolean)) onComplete?.(next.join('')) }
  }}>
    {vals.map((v, i) => <input key={i} ref={el => (refs.current[i] = el)} value={v} inputMode="numeric" maxLength={1} aria-label={'Digit ' + (i + 1)}
      onChange={e => { const d = e.target.value.replace(/\\D/g, '').slice(-1); setAt(i, d); if (d && i < length - 1) refs.current[i + 1].focus() }}
      onKeyDown={e => { if (e.key === 'Backspace' && !v && i > 0) refs.current[i - 1].focus() }} />)}
  </div>
}`),
C('Hard', `React build: nested file explorer (recursive tree).`,
  `Folders that open to show more folders and files inside.`,
  `A recursive component renders a node and, if it's an open folder, maps its children to the same component. Keep open state per folder; use role="tree"/"treeitem" with aria-expanded.`,
  `function TreeNode({ node }) {
  const [open, setOpen] = useState(false)
  if (!node.children) return <li role="treeitem">📄 {node.name}</li>
  return <li role="treeitem" aria-expanded={open}>
    <button onClick={() => setOpen(o => !o)}>{open ? '📂' : '📁'} {node.name}</button>
    {open && <ul role="group">{node.children.map(c => <TreeNode key={c.name} node={c} />)}</ul>}
  </li>
}
const Explorer = ({ root }) => <ul role="tree"><TreeNode node={root} /></ul>`),
// ---------- Output puzzles ----------
C('Medium', `Output: console.log(1); setTimeout(() => console.log(2)); Promise.resolve().then(() => console.log(3)); console.log(4)`,
  `Normal work first, then urgent notes (promises), then alarms (timers).`,
  `Prints <b>1 4 3 2</b>: synchronous code first, then the microtask (promise), then the macrotask (timer).`),
C('Hard', `Output: async function a(){ console.log('a1'); await b(); console.log('a2') } async function b(){ console.log('b') } console.log('s'); a(); console.log('e')`,
  `The async recipe starts right away, pauses at await, and finishes after the normal work.`,
  `Prints <b>s a1 b e a2</b>. An async function runs synchronously until its first await; the rest continues as a microtask after the current synchronous code.`),
C('Medium', `Output: console.log(typeof null, typeof NaN, typeof [], typeof function(){})`,
  `Some labels are surprising: "nothing" is called an object, and "not a number" is a number.`,
  `Prints <b>object number object function</b>. typeof null is a historical bug; NaN is a numeric value; arrays are objects (use Array.isArray).`),
C('Medium', `Output: console.log([] + [], [] + {}, 1 + '2', '3' - 1, true + 1, [1, 2] + [3])`,
  `+ with a word glues things together; − always does maths.`,
  `Prints <b>"" "[object Object]" "12" 2 2 "1,23"</b>. + converts objects to primitives (arrays join with commas) and concatenates if either side is a string; − converts to numbers.`),
C('Medium', `Output: console.log(0.1 + 0.2 === 0.3, NaN === NaN, Object.is(NaN, NaN), [] == false, null == 0)`,
  `Computers store some decimals slightly wrong, and some "equal" checks behave oddly.`,
  `Prints <b>false false true true false</b>. Floating point makes 0.1 + 0.2 = 0.30000000000000004; NaN is never === itself but Object.is says true; [] == false coerces both to 0; null only loosely equals undefined.`,
  `Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON   // true — compare floats with a tolerance`),
C('Medium', `Output: const a = { x: 1 }; const b = a; b.x = 2; const c = { ...a }; c.x = 3; console.log(a.x, b.x, c.x)`,
  `Two names for the same box share changes; a copied box doesn't.`,
  `Prints <b>2 2 3</b>. a and b reference the same object; c is a shallow copy.`),
C('Hard', `Output: const obj = { name: 'A', regular() { return this.name }, arrow: () => this?.name }; console.log(obj.regular(), obj.arrow())`,
  `A normal method asks "who called me?"; an arrow just looks outside.`,
  `Prints <b>A undefined</b> (in a module or strict script). The regular method's this is obj; the arrow's this comes from the surrounding scope (module top level: undefined).`),
C('Medium', `Output: console.log(foo()); console.log(bar); function foo(){ return 'foo' } var bar = 'bar'`,
  `The recipe is ready early; the var box exists early but is still empty.`,
  `Prints <b>foo</b> then <b>undefined</b>. Function declarations are fully hoisted; var is hoisted and initialised to undefined. With let it would throw a ReferenceError (TDZ).`),
C('Hard', `Output: Promise.resolve(1).then(x => { throw new Error('x') }).catch(e => 2).then(v => console.log(v)).finally(() => console.log('done'))`,
  `An error jumps to the nearest "catch"; after catching, the chain carries on normally.`,
  `Prints <b>2</b> then <b>done</b>. The throw rejects, catch returns 2 (recovering the chain), then logs it; finally always runs.`),
C('Medium', `Output: const arr = [1, 2, 3]; arr[10] = 11; console.log(arr.length, arr.filter(Boolean).length, arr.map(x => x * 2).length)`,
  `Putting a toy on shelf 10 makes the shelf longer, with empty gaps in between.`,
  `Prints <b>11 4 11</b>. Assigning index 10 makes length 11 with holes; filter skips holes (4 values); map keeps holes so length stays 11.`),
    ],
  });
})();
