HUB.guide({
  id: 'zustand', title: 'Zustand: state management from basic to advanced', level: 'Intermediate → Senior', time: '45 min',
  intro: 'A tiny global store with hooks: create, select, update, middleware, slices, testing and when to choose it over Context or Redux Toolkit.',
  related: 'zustand global state context redux',
  prereq: ['useState and props', 'Why prop drilling hurts', 'Immutability (spread, new references)', 'Basic idea of Context and Redux'],
  concepts: [
    { h: 'What Zustand is', lv: 'Easy', html: `<p>A small (~1 KB) state library. You create a <b>store hook</b> with <code>create</code>; components call the hook with a <b>selector</b> and re-render only when the selected value changes. No Provider, no actions/reducers boilerplate, works with plain JavaScript.</p>` },
    { h: 'Create a store and read from it', lv: 'Easy', html: `<p>The store is state plus functions that call <code>set</code>. Always select the smallest piece you need.</p>`,
      code: `import { create } from 'zustand'

export const useCounter = create(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}))

function Counter() {
  const count = useCounter(s => s.count)            // re-renders only when count changes
  const increment = useCounter(s => s.increment)
  return <button onClick={increment}>{count}</button>
}` },
    { h: 'set, get and immutable updates', lv: 'Easy', html: `<p><code>set</code> <b>shallow-merges</b> the object you return into state (only top level). For nested data, copy each level you change. <code>get()</code> reads current state inside actions, useful for async actions.</p>`,
      code: `const useCart = create((set, get) => ({
  items: [],
  add: item => set(s => ({ items: [...s.items, item] })),
  remove: id => set(s => ({ items: s.items.filter(i => i.id !== id) })),
  total: () => get().items.reduce((t, i) => t + i.price * i.qty, 0),
}))` },
    { h: 'Selecting several values without extra renders', lv: 'Medium', html: `<p>A selector that returns a new object every time (<code>s =&gt; ({ a: s.a, b: s.b })</code>) would re-render on every store change. Use <code>useShallow</code> (v5) to compare shallowly, or select values separately.</p>`,
      code: `import { useShallow } from 'zustand/react/shallow'
const { items, add } = useCart(useShallow(s => ({ items: s.items, add: s.add })))` },
    { h: 'Async actions', lv: 'Medium', html: `<p>Actions can be async; set loading/error state yourself. For server data, prefer TanStack Query and keep Zustand for client state.</p>`,
      code: `const useUser = create(set => ({
  user: null, status: 'idle', error: null,
  load: async id => {
    set({ status: 'loading', error: null })
    try { const user = await api.getUser(id); set({ user, status: 'success' }) }
    catch (e) { set({ error: e.message, status: 'error' }) }
  },
}))` },
    { h: 'Middleware: persist, devtools, immer', lv: 'Medium', html: `<p><code>persist</code> saves to localStorage (choose fields with <code>partialize</code>, version with <code>version</code>/<code>migrate</code>); <code>devtools</code> connects to Redux DevTools; <code>immer</code> lets you write mutating updates.</p>`,
      code: `import { persist, devtools } from 'zustand/middleware'
export const useSettings = create(devtools(persist(
  set => ({ theme: 'light', setTheme: theme => set({ theme }) }),
  { name: 'settings', partialize: s => ({ theme: s.theme }) },
)))` },
    { h: 'Using the store outside React', lv: 'Medium', html: `<p>The hook is also a store object: <code>useStore.getState()</code>, <code>useStore.setState()</code>, <code>useStore.subscribe()</code>. Handy in Axios interceptors (read the token) or utility modules.</p>`,
      code: `api.interceptors.request.use(cfg => {
  const token = useAuth.getState().token
  if (token) cfg.headers.Authorization = 'Bearer ' + token
  return cfg
})` },
    { h: 'Slices pattern for large apps', lv: 'Hard', html: `<p>Split a big store into slice creators combined into one store, or create several small independent stores per feature (often simpler).</p>`,
      code: `const createAuthSlice = set => ({ user: null, login: user => set({ user }) })
const createCartSlice = set => ({ items: [], add: i => set(s => ({ items: [...s.items, i] })) })
export const useApp = create((...a) => ({ ...createAuthSlice(...a), ...createCartSlice(...a) }))` },
    { h: 'SSR and per-request stores', lv: 'Hard', html: `<p>A module-level store is shared across requests on a server, which can leak one user's data to another. In Next.js, create the store per request (with <code>createStore</code> from <code>zustand/vanilla</code>) inside a client provider and read it with <code>useStore</code> from context.</p>` },
  ],
  mistakes: [
    'Selecting the whole store (<code>useStore()</code>) so every change re-renders the component.',
    'Returning a new object/array from a selector without <code>useShallow</code>.',
    'Mutating state (<code>s.items.push(x)</code>) without the immer middleware: the reference does not change, so nothing re-renders.',
    'Putting server data and its loading/caching logic in Zustand instead of TanStack Query.',
    'Persisting sensitive data (tokens) to localStorage.',
    'Module-level stores in SSR leaking state between users.',
  ],
  qa: [
    { q: 'What is Zustand and why use it?', a: 'A minimal hook-based global store. You get global state with very little code, selective subscriptions (only components using the changed slice re-render), no provider, middleware for persistence and devtools, and it works outside React.' },
    { q: 'Zustand vs Context vs Redux Toolkit?', a: '<b>Context</b> passes values down; every consumer re-renders on change, so it suits low-frequency values (theme, auth). <b>Zustand</b>: lightweight store with selector-based subscriptions, good for small/medium apps and app-wide client state. <b>Redux Toolkit</b>: more structure (actions, reducers, middleware, DevTools time travel, RTK Query), good for large teams and complex flows. Server data: TanStack Query or RTK Query in all cases.' },
    { q: 'How does Zustand avoid unnecessary re-renders?', a: 'Components subscribe through a selector; after each <code>set</code>, Zustand runs the selector and compares the result with <code>Object.is</code> (or shallow with useShallow). Only components whose selected value changed re-render. React 18+ <code>useSyncExternalStore</code> keeps this consistent with concurrent rendering.' },
    { q: 'How do you persist a Zustand store?', a: 'Wrap the creator in <code>persist</code> with a <code>name</code>; choose storage (localStorage default, sessionStorage, IndexedDB via createJSONStorage); persist only needed fields with <code>partialize</code>; handle schema changes with <code>version</code> and <code>migrate</code>; check <code>hasHydrated</code> if UI depends on restored state.' },
    { q: 'How do you test components that use Zustand?', a: 'Reset the store between tests (store <code>setState(initialState, true)</code> in <code>beforeEach</code>, or the official reset pattern with a mock), render the component with RTL and assert on UI. Store logic can be tested directly with <code>getState()</code> and actions.' },
  ],
  scenarios: [
    { q: 'The whole page re-renders whenever the cart changes.', a: 'Components call <code>useCart()</code> without a selector or select objects. Fix: select specific values (<code>useCart(s =&gt; s.items.length)</code>) and use <code>useShallow</code> for multiple values. Verify with the React Profiler.' },
    { q: 'After logout, the next user briefly sees the previous user\'s data.', a: 'Persisted or in-memory stores were not reset. Add a <code>reset</code> action per store (or a root reset) called on logout, clear persisted storage (<code>useStore.persist.clearStorage()</code>), and clear the query cache too.' },
  ],
  exercises: [
    { lv: 'Easy', task: 'Build a <code>useTodos</code> store with <code>add</code>, <code>toggle</code> and <code>remove</code>, and a component showing remaining count.', hint: 'Use functional <code>set</code> and create new arrays with map/filter.',
      solution: `const useTodos = create(set => ({
  todos: [],
  add: text => set(s => ({ todos: [...s.todos, { id: crypto.randomUUID(), text, done: false }] })),
  toggle: id => set(s => ({ todos: s.todos.map(t => (t.id === id ? { ...t, done: !t.done } : t)) })),
  remove: id => set(s => ({ todos: s.todos.filter(t => t.id !== id) })),
}))
function Remaining() {
  const left = useTodos(s => s.todos.filter(t => !t.done).length)   // number → stable comparison
  return <p>{left} left</p>
}`, explain: 'Selecting a number means the component re-renders only when the count changes, not on every edit.' },
    { lv: 'Medium', task: 'Persist a theme store to localStorage and apply the theme to <code>document.documentElement</code>.', hint: 'Use the persist middleware and subscribe to changes.',
      solution: `const useTheme = create(persist(set => ({ theme: 'light', toggle: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })) }), { name: 'theme' }))
useTheme.subscribe(s => { document.documentElement.dataset.theme = s.theme })`, explain: '<code>subscribe</code> runs outside React, so the DOM attribute stays in sync even before components mount.' },
  ],
  followups: [
    { q: 'Why does Zustand not need a Provider?', a: 'The store lives in a module-level closure and components subscribe to it directly with useSyncExternalStore. You only need context when you want separate store instances (SSR, tests, multiple widgets).' },
    { q: 'When would you not use Zustand?', a: 'When state is local to one component, when Context with rare updates is enough, or when the team needs Redux Toolkit conventions, DevTools-heavy debugging and RTK Query integration at large scale.' },
  ],
  summary: ['create(set => ({ state, actions })) returns a hook', 'Always use selectors; useShallow for several values', 'set shallow-merges; copy nested objects', 'persist / devtools / immer middleware', 'getState/setState/subscribe outside React', 'Server data → TanStack Query; client state → Zustand', 'SSR: store per request'],
  quiz: [
    { q: 'What re-renders when a Zustand store changes?', options: ['Every component in the app', 'Only components whose selected value changed', 'Only the component that called set', 'Nothing until you call forceUpdate'], answer: 1, why: 'Zustand compares each subscriber\'s selected value and re-renders only those that changed.' },
    { q: 'Which selector causes a re-render on every store change?', options: ['s => s.count', 's => s.items.length', 's => ({ a: s.a, b: s.b })', 's => s.add'], answer: 2, why: 'It returns a new object each time; wrap it with useShallow.' },
    { q: 'What does set({ user }) do with other keys in state?', options: ['Deletes them', 'Keeps them (shallow merge)', 'Deep merges them', 'Throws an error'], answer: 1, why: 'set merges at the top level unless you pass replace = true.' },
    { q: 'Best place for API data with caching and refetching?', options: ['Zustand', 'TanStack Query', 'localStorage', 'useRef'], answer: 1, why: 'Server state belongs in a server-state cache.' },
  ],
});

HUB.guide({
  id: 'portals', title: 'React Portals: modals, tooltips and focus management', level: 'Intermediate → Senior', time: '35 min',
  intro: 'Render outside the parent DOM node while staying in the React tree: how portals work, events, context, accessible modals, stacking and SSR.',
  related: 'portal createPortal modal dialog',
  prereq: ['Components and props', 'useRef and useEffect', 'CSS position, z-index and overflow', 'Event bubbling'],
  concepts: [
    { h: 'What a portal is', lv: 'Easy', html: `<p><code>createPortal(children, domNode)</code> renders children into a different DOM node (often <code>document.body</code>) instead of inside the parent's DOM element. In the React tree it is still a child of the component that rendered it.</p>`,
      code: `import { createPortal } from 'react-dom'
function Modal({ children }) {
  return createPortal(<div className="modal">{children}</div>, document.body)
}` },
    { h: 'Why we need portals', lv: 'Easy', html: `<p>Parents with <code>overflow: hidden</code>, <code>transform</code>, or their own stacking context (z-index) clip or trap absolutely positioned children. Modals, tooltips, dropdowns, toasts and context menus must escape that, so they render at the top of the document.</p>` },
    { h: 'Events and context still follow the React tree', lv: 'Medium', html: `<p>A click inside a portal <b>bubbles to React ancestors</b> (the component that rendered the portal), not to DOM ancestors. Context from providers above the portal's owner is available inside it. This surprises people: a click in a modal can trigger an <code>onClick</code> on a parent card. Stop it with <code>e.stopPropagation()</code> where needed.</p>` },
    { h: 'A reusable portal container', lv: 'Medium', html: `<p>Render into a dedicated element, created once. Guard for the browser (SSR has no <code>document</code>).</p>`,
      code: `function Portal({ children }) {
  const [el, setEl] = useState(null)
  useEffect(() => {
    const node = document.createElement('div')
    node.className = 'portal-root'
    document.body.appendChild(node)
    setEl(node)
    return () => node.remove()
  }, [])
  return el ? createPortal(children, el) : null
}` },
    { h: 'An accessible modal', lv: 'Hard', html: `<p>A portal only moves the DOM; accessibility is your job: <code>role="dialog"</code>, <code>aria-modal="true"</code>, a label, move focus into the dialog, trap Tab inside, close on Escape, return focus to the trigger on close, make the background inert, and lock body scroll. The native <code>&lt;dialog&gt;</code> element with <code>showModal()</code> gives focus trapping, Escape and top-layer rendering for free.</p>`,
      code: `function Dialog({ open, onClose, title, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return createPortal(
    <dialog ref={ref} onClose={onClose} aria-labelledby="dlg-title">
      <h2 id="dlg-title">{title}</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </dialog>,
    document.body,
  )
}` },
    { h: 'Positioning tooltips and dropdowns', lv: 'Hard', html: `<p>Measure the trigger with <code>getBoundingClientRect()</code> in <code>useLayoutEffect</code> (to avoid flicker), position the portal content with fixed coordinates, and update on scroll/resize. Libraries like Floating UI handle flipping and collision detection. The CSS Popover API and anchor positioning are emerging native options.</p>` },
    { h: 'Portals with SSR and Next.js', lv: 'Hard', html: `<p><code>document</code> doesn't exist on the server. Render the portal only after mount (state flag set in an effect) or use a framework's client-only component. Mismatched rendering causes hydration errors.</p>` },
  ],
  mistakes: [
    'Thinking a portal fixes accessibility: you still need focus management, Escape, labels and aria attributes.',
    'Forgetting that events bubble through the React tree, so parent onClick handlers fire.',
    'Accessing document during render in SSR.',
    'Creating a new container element on every render instead of once.',
    'Not removing containers or event listeners on unmount.',
    'Fighting z-index wars instead of using the native dialog top layer.',
  ],
  qa: [
    { q: 'What are React portals and when do you use them?', a: 'A way to render children into a DOM node outside the parent hierarchy while keeping them in the React tree. Used for modals, tooltips, popovers, dropdowns and toasts that must escape overflow/stacking contexts.' },
    { q: 'How does event bubbling work with portals?', a: 'Synthetic events bubble through the React component tree, so an event inside a portal reaches the React parent that rendered it, even though the DOM node lives elsewhere. Native DOM listeners on DOM ancestors do not see it.' },
    { q: 'Does context work inside a portal?', a: 'Yes. A portal is part of the React tree, so it reads context from providers above the component that created it.' },
    { q: 'How do you make a portal modal accessible?', a: 'role="dialog" + aria-modal + aria-labelledby, initial focus inside, focus trap, Escape to close, restore focus to the trigger, inert/aria-hidden background, scroll lock. Or use the native dialog element with showModal().' },
  ],
  scenarios: [
    { q: 'Clicking inside a modal also triggers the card it was opened from.', a: 'The click bubbles through the React tree to the card\'s onClick. Stop propagation at the modal root or move the modal outside the clickable card in the component tree.', c: `<div className="modal" onClick={e => e.stopPropagation()}>...</div>` },
    { q: 'A dropdown is cut off inside a scrollable table.', a: 'The table container has overflow hidden/auto. Render the dropdown menu in a portal positioned from the trigger\'s bounding rect (or use Floating UI), and reposition on scroll.' },
  ],
  exercises: [
    { lv: 'Medium', task: 'Build a <code>Modal</code> that renders in a portal, closes on Escape and on backdrop click, and returns focus to the button that opened it.', hint: 'Save <code>document.activeElement</code> when opening; add a keydown listener in an effect.',
      solution: `function Modal({ open, onClose, children }) {
  const panel = useRef(null)
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement
    panel.current?.focus()
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); previous?.focus() }
  }, [open, onClose])
  if (!open) return null
  return createPortal(
    <div className="backdrop" onClick={onClose}>
      <div role="dialog" aria-modal="true" tabIndex={-1} ref={panel} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body,
  )
}`, explain: 'Cleanup removes the listener and restores focus. stopPropagation on the panel prevents backdrop clicks from closing it when clicking inside.' },
  ],
  followups: [
    { q: 'Portal vs native dialog element?', a: 'dialog with showModal() renders in the browser top layer (no z-index issues), traps focus and handles Escape natively; portals give full control and work with any markup. Many teams now combine both.' },
    { q: 'How would you test a portal modal?', a: 'RTL screen queries search document.body, so getByRole("dialog") works. Test opening, Escape closing, focus moving inside and returning to the trigger with userEvent.' },
  ],
  summary: ['createPortal(children, domNode)', 'Escapes overflow/z-index; stays in the React tree', 'Events bubble to React parents; context works', 'Accessibility is still your job (or use dialog)', 'Guard document for SSR; create the container once'],
  quiz: [
    { q: 'Where does a click inside a portal bubble to?', options: ['Only DOM ancestors of the portal node', 'React ancestors of the component that rendered the portal', 'Nowhere', 'Only document.body'], answer: 1, why: 'React synthetic events follow the React tree.' },
    { q: 'Can a portal read context from above its owner?', options: ['Yes', 'No', 'Only in class components', 'Only with forwardRef'], answer: 0, why: 'Portals are part of the React tree.' },
    { q: 'What does a portal NOT do automatically?', options: ['Render outside the parent DOM node', 'Keep React context', 'Trap focus and handle Escape', 'Keep event bubbling through React'], answer: 2, why: 'Focus management and keyboard handling are your responsibility.' },
  ],
});

HUB.guide({
  id: 'use-effect', title: 'useEffect: dependencies, cleanup, stale closures and race conditions', level: 'Intermediate → Senior', time: '50 min',
  intro: 'The most-asked hook: what effects are for, how dependencies and cleanup work, StrictMode double runs, stale closures, races, and when not to use an effect.',
  related: 'useEffect cleanup dependencies side effects',
  prereq: ['useState', 'Closures', 'Promises and async/await', 'Rendering: render phase vs commit phase'],
  concepts: [
    { h: 'What an effect is for', lv: 'Easy', html: `<p>Effects <b>synchronise a component with an external system</b> (network, timers, subscriptions, DOM APIs, third-party widgets) after React commits and the browser paints. Rendering stays pure; side effects go in effects or event handlers.</p>` },
    { h: 'Dependencies decide when it re-runs', lv: 'Easy', html: `<p>No array: after every render. <code>[]</code>: after mount only. <code>[a, b]</code>: when <code>a</code> or <code>b</code> changed (compared with <code>Object.is</code>). Include every reactive value used inside (props, state, functions defined in the component).</p>`,
      code: `useEffect(() => { document.title = \`\${count} new messages\` }, [count])` },
    { h: 'Cleanup', lv: 'Easy', html: `<p>Return a function to undo the effect. React runs it before the next run and on unmount: clear timers, remove listeners, close sockets, abort requests.</p>`,
      code: `useEffect(() => {
  const conn = createConnection(roomId)
  conn.connect()
  return () => conn.disconnect()
}, [roomId])` },
    { h: 'StrictMode runs effects twice in development', lv: 'Medium', html: `<p>React mounts, unmounts and re-mounts components in dev to check that cleanup is correct. If your app breaks or double-fetches visibly, the cleanup is missing. Production runs once.</p>` },
    { h: 'Fetching data safely (race conditions)', lv: 'Medium', html: `<p>If the dependency changes quickly, older requests can finish last. Abort the previous request or ignore stale responses. In real apps prefer TanStack Query, a framework loader, or Server Components.</p>`,
      code: `useEffect(() => {
  const ctrl = new AbortController()
  setStatus('loading')
  fetch('/api/users/' + id, { signal: ctrl.signal })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json() })
    .then(u => { setUser(u); setStatus('success') })
    .catch(e => { if (e.name !== 'AbortError') { setError(e); setStatus('error') } })
  return () => ctrl.abort()
}, [id])` },
    { h: 'Stale closures', lv: 'Hard', html: `<p>An effect "sees" the values from the render it was created in. An interval created once with <code>[]</code> always reads the first <code>count</code>. Fix with functional updates, correct dependencies, a ref for the latest value, or <code>useEffectEvent</code> (React 19.2) for non-reactive logic.</p>`,
      code: `// ❌ always logs 0 and sets 1
useEffect(() => { const id = setInterval(() => setCount(count + 1), 1000); return () => clearInterval(id) }, [])
// ✅ functional update
useEffect(() => { const id = setInterval(() => setCount(c => c + 1), 1000); return () => clearInterval(id) }, [])` },
    { h: 'Object and function dependencies', lv: 'Hard', html: `<p>Objects and functions created during render are new every time, so an effect depending on them runs every render. Move them inside the effect, depend on primitive fields, or memoize with <code>useMemo</code>/<code>useCallback</code>.</p>` },
    { h: 'You might not need an effect', lv: 'Hard', html: `<p>Don't use effects to: compute derived values (calculate during render or useMemo), reset state when a prop changes (use a <code>key</code>), respond to user events (do it in the handler), or chain state updates. Fewer effects means fewer bugs and renders.</p>`,
      code: `// ❌ const [fullName, setFullName] = useState(''); useEffect(() => setFullName(first + ' ' + last), [first, last])
const fullName = first + ' ' + last   // ✅ derive during render` },
    { h: 'useLayoutEffect and useEffectEvent', lv: 'Hard', html: `<p><code>useLayoutEffect</code> runs before paint, for measuring layout and avoiding flicker (blocks paint, use sparingly). <code>useEffectEvent</code> (stable in React 19.2) wraps logic that should read the latest props/state without making the effect re-run.</p>` },
  ],
  mistakes: [
    'Missing dependencies (stale values) or silencing the lint rule.',
    'Objects/functions in the dependency array causing infinite loops.',
    'No cleanup for timers, listeners and subscriptions (memory leaks).',
    'Making the effect callback itself async (it must return nothing or a cleanup function).',
    'Fetching without handling race conditions, loading and error states.',
    'Using effects for derived state or for logic that belongs in event handlers.',
  ],
  qa: [
    { q: 'What is useEffect used for?', a: 'Synchronising with external systems after render: subscriptions, timers, manual DOM work, logging, network when not using a data library. It runs after commit and paint; cleanup runs before the next run and on unmount.' },
    { q: 'How do you implement componentDidMount and componentWillUnmount with hooks?', a: 'useEffect with an empty dependency array; the returned function is the unmount cleanup.', c: `useEffect(() => { start(); return () => stop() }, [])` },
    { q: 'Why can\'t the effect function be async?', a: 'An async function returns a promise, but React expects undefined or a cleanup function. Define an async function inside and call it, and handle cancellation.' },
    { q: 'Why do effects run twice in development?', a: 'StrictMode intentionally mounts, unmounts and re-mounts to reveal missing cleanup. It does not happen in production.' },
    { q: 'How do you explain useEffect to a junior engineer?', a: 'Rendering describes what the screen should look like. Effects are for talking to things outside React after the screen updates. Ask: what external thing am I syncing with, when should it re-sync (dependencies), and how do I undo it (cleanup)? If there is no external system, you probably don\'t need an effect.' },
  ],
  scenarios: [
    { q: 'An effect runs in an infinite loop.', a: 'It sets state that is in its own dependencies, or depends on an object recreated every render. Derive instead of storing, use functional updates, or stabilise the dependency.' },
    { q: 'A chat reconnects every time the theme changes.', a: 'The effect reads <code>theme</code> for a notification, so theme is a dependency. Move that logic into <code>useEffectEvent</code> so only <code>roomId</code> triggers reconnection.' },
  ],
  exercises: [
    { lv: 'Medium', task: 'Write <code>useWindowWidth()</code> that returns the current window width and cleans up its listener.', hint: 'Initial state from window.innerWidth; add and remove a resize listener.',
      solution: `function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth)
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return width
}`, explain: 'The same function reference is passed to add and remove; the empty array means one subscription for the component lifetime.' },
    { lv: 'Hard', task: 'Write <code>useFetch(url)</code> returning <code>{ data, error, loading }</code> that is safe against race conditions.', hint: 'AbortController in cleanup; ignore AbortError.',
      solution: `function useFetch(url) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  useEffect(() => {
    const ctrl = new AbortController()
    setState(s => ({ ...s, loading: true, error: null }))
    fetch(url, { signal: ctrl.signal })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json() })
      .then(data => setState({ data, error: null, loading: false }))
      .catch(error => { if (error.name !== 'AbortError') setState({ data: null, error, loading: false }) })
    return () => ctrl.abort()
  }, [url])
  return state
}`, explain: 'Changing the url aborts the old request, so only the latest response updates state. In production code, TanStack Query adds caching, retries and dedupe.' },
  ],
  followups: [
    { q: 'useEffect vs useLayoutEffect?', a: 'useEffect runs after paint (non-blocking); useLayoutEffect runs before paint, for DOM measurement that must not flicker.' },
    { q: 'How would you avoid fetching in effects entirely?', a: 'TanStack Query / RTK Query, framework loaders (React Router), Server Components, or React 19 use() with a cached promise.' },
  ],
  summary: ['Effects sync with external systems after paint', 'Dependencies: every reactive value used inside', 'Always clean up subscriptions', 'StrictMode double-run = check your cleanup', 'Abort or ignore stale requests', 'Stale closure → functional update / ref / useEffectEvent', 'Derive during render; handle events in handlers'],
  quiz: [
    { q: 'When does useEffect run by default?', options: ['Before render', 'After React commits and the browser paints', 'Only on unmount', 'Synchronously during render'], answer: 1, why: 'Passive effects run after paint.' },
    { q: 'What does [] mean as the dependency array?', options: ['Run every render', 'Run once after mount (cleanup on unmount)', 'Never run', 'Run before paint'], answer: 1, why: 'No dependencies means no re-sync after the first run.' },
    { q: 'Which fixes a stale count inside setInterval created once?', options: ['setCount(count + 1)', 'setCount(c => c + 1)', 'Remove the cleanup', 'useLayoutEffect'], answer: 1, why: 'The functional update always gets the latest state.' },
    { q: 'Best tool to compute fullName from first and last?', options: ['useEffect + useState', 'Plain calculation during render', 'useRef', 'useLayoutEffect'], answer: 1, why: 'Derived values should be calculated, not synced.' },
  ],
});
