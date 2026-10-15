HUB.guide({
  id: 'react-fiber', area: 'React', title: 'React Fiber, Virtual DOM and reconciliation', level: 'Intermediate → Senior', time: '45 min',
  intro: 'How React actually updates the screen: elements and the virtual DOM, the diffing rules, Fiber nodes, render vs commit phases, priorities (lanes) and concurrent rendering.',
  related: 'fiber reconciliation virtual DOM rendering',
  prereq: ['Components, props and state', 'What the DOM is and why touching it is costly', 'Keys in lists'],
  concepts: [
    { h: 'Elements and the virtual DOM', lv: 'Easy', html: `<p>JSX creates <b>React elements</b>: plain objects like <code>{ type: 'h1', props: { children: 'Hi' } }</code>. The tree of elements describing the UI is often called the <b>virtual DOM</b>. Building objects is cheap; touching the real DOM (layout, paint) is expensive, so React compares trees first and changes only what's needed.</p>`,
      code: `const el = <h1 className="title">Hi</h1>
// ≈ { type: 'h1', props: { className: 'title', children: 'Hi' }, key: null }` },
    { h: 'Reconciliation: the diffing rules', lv: 'Easy', html: `<p>On every update React compares the new element tree with the previous one using two heuristics that make it O(n): <b>1) different type → throw away the old subtree and build a new one</b> (state is lost); <b>2) same type → keep the DOM node/component instance and update props</b>, then recurse into children. Lists are matched by <code>key</code>.</p>`,
      code: `// type changes from <div> to <section>: the whole subtree (and its state) is recreated
{isEditing ? <div><Form /></div> : <section><Form /></section>}
// same position, same type: Form keeps its state
{isEditing ? <Form mode="edit" /> : <Form mode="view" />}` },
    { h: 'Why keys matter', lv: 'Medium', html: `<p>Keys tell React which child is which between renders. Stable ids keep the right state with the right item when you insert, delete or reorder. Index keys break when the order changes (inputs show the wrong values). Changing a key on purpose resets a component.</p>` },
    { h: 'What Fiber is', lv: 'Medium', html: `<p>Fiber (React 16+) is the reconciliation engine. Each component/element becomes a <b>fiber</b>: a JavaScript object that is a <b>unit of work</b>, linked to its parent (<code>return</code>), first <code>child</code> and next <code>sibling</code>. Because the tree is a linked list of work units, React can <b>pause</b> work, do something more urgent, then <b>resume</b> or <b>throw away</b> unfinished work. The old "stack reconciler" had to finish the whole tree recursively without stopping.</p>`,
      code: `// simplified fiber
{ type: Counter, key: null, stateNode: null,
  child: fiberOfButton, sibling: null, return: fiberOfApp,
  memoizedProps: {...}, memoizedState: hooksList,
  flags: Update, lanes: DefaultLane, alternate: currentFiber }` },
    { h: 'Two phases: render and commit', lv: 'Medium', html: `<p><b>Render phase</b> (interruptible): React calls your components, builds a <i>work-in-progress</i> fiber tree and marks what changed. It must be pure, which is why StrictMode double-calls components. <b>Commit phase</b> (synchronous, can't be interrupted): React applies DOM mutations, runs <code>useLayoutEffect</code>, the browser paints, then <code>useEffect</code> runs. Double buffering: the <code>current</code> tree and the <code>workInProgress</code> tree swap after commit.</p>` },
    { h: 'Priorities, lanes and concurrent rendering', lv: 'Hard', html: `<p>Updates get a priority (<b>lanes</b>): typing and clicks are urgent; <code>startTransition</code> updates are not. With concurrent rendering (React 18+), React can render a transition in the background, interrupt it for a keystroke, and keep the old UI visible. This powers <code>useTransition</code>, <code>useDeferredValue</code>, Suspense, streaming SSR and selective hydration.</p>`,
      code: `const [isPending, startTransition] = useTransition()
function onSearch(text) {
  setQuery(text)                                   // urgent: input stays responsive
  startTransition(() => setResults(filter(text)))  // can be interrupted
}` },
    { h: 'Batching and scheduling', lv: 'Hard', html: `<p>React batches multiple state updates into one render (automatically everywhere since React 18, including timeouts and promises). The scheduler splits rendering into small chunks and yields to the browser so the main thread stays responsive. <code>flushSync</code> forces a synchronous update when you really need it.</p>` },
  ],
  mistakes: ['Saying the virtual DOM makes React "fast" by itself (it avoids unnecessary DOM work; your render cost still matters)', 'Index keys in lists that reorder', 'Changing an element type or key by accident and losing state', 'Side effects during render (the render phase can run more than once)', 'Thinking a re-render always updates the DOM'],
  qa: [
    { q: 'What is React Fiber?', a: 'The reconciliation engine introduced in React 16. Each element becomes a fiber node (a unit of work) in a linked tree, so React can split rendering into chunks, pause, prioritise (lanes), resume or discard work. It enables concurrent features like transitions, Suspense and streaming SSR.' },
    { q: 'What is the difference between the virtual DOM and Fiber?', a: 'The virtual DOM is the element tree describing what the UI should be. Fiber is the internal data structure and algorithm React uses to compare trees and schedule the work of applying changes.' },
    { q: 'What happens in the render phase vs the commit phase?', a: 'Render: call components, build the work-in-progress tree, compute changes; pure and interruptible. Commit: apply DOM changes, run layout effects, paint, then passive effects; synchronous.' },
    { q: 'How does reconciliation decide what to update?', a: 'Different element type → replace the subtree. Same type → update props and recurse. Children lists are matched by key. These heuristics give O(n) diffing.' },
  ],
  scenarios: [
    { q: 'A form inside a tab loses what the user typed when switching layouts.', a: 'The wrapper element type changed (div → section) or the key changed, so React unmounted the subtree. Keep the same type/position, or lift the state up.' },
    { q: 'Typing in a search box lags because a huge list re-renders on each key.', a: 'Mark the list update as a transition (or use useDeferredValue) so Fiber renders it at lower priority and keeps the input responsive; virtualize the list too.' },
  ],
  exercises: [
    { lv: 'Medium', task: 'A list uses <code>key={index}</code> and has an input per row. Delete the first row: what goes wrong, and how do you fix it?', hint: 'Keys identify rows between renders.',
      solution: `{items.map(item => <Row key={item.id} item={item} />)}`, explain: 'With index keys, row 2 becomes key 0 and inherits row 1\'s DOM input and state, so values appear in the wrong rows. Stable ids keep state attached to the right item.' },
  ],
  followups: [
    { q: 'Why must render be pure in concurrent React?', a: 'The render phase can be paused, restarted or thrown away and run more than once; side effects there would run unpredictably.' },
    { q: 'What is double buffering in Fiber?', a: 'React keeps the current tree on screen and builds a work-in-progress copy (alternate); on commit, the pointer swaps, so the UI never shows half-finished work.' },
  ],
  summary: ['JSX → elements (virtual DOM)', 'Diff: different type = replace; same type = update; lists by key', 'Fiber = unit of work in a linked tree', 'Render phase (pure, interruptible) → commit phase (sync)', 'Lanes/priorities → transitions, Suspense, streaming', 'Batching since React 18'],
  quiz: [
    { q: 'What happens when an element changes from <div> to <span> in the same position?', options: ['Props are updated', 'The old subtree is destroyed and recreated', 'Nothing', 'Only text changes'], answer: 1, why: 'Different type means React replaces the subtree and its state.' },
    { q: 'Which phase can React interrupt?', options: ['Commit', 'Render', 'Both', 'Neither'], answer: 1, why: 'Only the render phase is interruptible; commit is synchronous.' },
    { q: 'What does Fiber enable?', options: ['CSS-in-JS', 'Pausing and prioritising rendering work', 'Server databases', 'Type checking'], answer: 1, why: 'Fiber makes rendering incremental and prioritised.' },
  ],
});

HUB.guide({
  id: 'rendering-strategies', area: 'React', title: 'CSR vs SSR vs SSG vs ISR, hydration and Server Components', level: 'Intermediate → Senior', time: '55 min',
  intro: 'Where and when HTML is produced: client-side rendering, server-side rendering, static generation, incremental regeneration, hydration, streaming and React Server Components, with when to use each.',
  related: 'SSR CSR SSG hydration server components',
  prereq: ['How a browser loads a page (HTML, JS, CSS)', 'React components and effects', 'Basic idea of a server and CDN'],
  concepts: [
    { h: 'CSR: client-side rendering', lv: 'Easy', html: `<p>The server sends an almost empty <code>index.html</code> and a JS bundle; the browser downloads and runs React, which fetches data and renders everything. <b>Pros</b>: simple static hosting, rich interactivity, cheap servers. <b>Cons</b>: blank screen until JS loads, worse SEO and slower first paint on weak devices.</p>`,
      code: `<!-- what the browser first receives in CSR -->
<body><div id="root"></div><script src="/assets/index-a1b2.js"></script></body>` },
    { h: 'SSR: server-side rendering', lv: 'Easy', html: `<p>On <b>every request</b> the server runs React, fetches data and sends ready HTML, so users see content quickly and crawlers read it. Then the client downloads JS and <b>hydrates</b>. <b>Cons</b>: needs a server, adds time-to-first-byte (TTFB), and the page isn't interactive until hydration finishes.</p>` },
    { h: 'SSG and ISR', lv: 'Medium', html: `<p><b>SSG</b> renders pages to HTML at <b>build time</b> and serves them from a CDN: fastest and cheapest, but data is only as fresh as the last build. <b>ISR</b> (Incremental Static Regeneration, Next.js) re-generates a static page in the background after a time (<code>revalidate</code>) or on demand, mixing static speed with fresher data.</p>`,
      code: `// Next.js App Router: regenerate this page at most once per hour
export const revalidate = 3600
export default async function Page() { const posts = await getPosts(); return <PostList posts={posts} /> }` },
    { h: 'Hydration', lv: 'Medium', html: `<p>Hydration attaches event handlers and state to server HTML instead of re-creating the DOM. The first client render must match the server HTML exactly; differences (dates, <code>window</code> checks, random ids, invalid nesting) cause <b>hydration mismatch</b> errors. Use <code>useId</code>, move browser-only values into effects.</p>`,
      code: `import { hydrateRoot } from 'react-dom/client'
hydrateRoot(document.getElementById('root'), <App />)` },
    { h: 'Streaming SSR and selective hydration', lv: 'Hard', html: `<p>React 18+ can stream HTML in chunks: the shell arrives first, slow parts wrapped in <code>&lt;Suspense&gt;</code> stream in when ready. Hydration happens per Suspense boundary, prioritising what the user interacts with. Result: faster first paint without waiting for the slowest data.</p>`,
      code: `<Layout>
  <Header />
  <Suspense fallback={<FeedSkeleton />}><Feed /></Suspense>   {/* streams later */}
</Layout>` },
    { h: 'React Server Components (RSC)', lv: 'Hard', html: `<p>Server Components run only on the server (at build or request time), can be <code>async</code> and read data directly, and send a serialized result, <b>not their JavaScript</b>, to the browser. Client Components (<code>'use client'</code>) handle state, effects and events. RSC reduces bundle size and removes client-side data waterfalls. They need a framework (Next.js App Router, React Router/Waku support).</p>`,
      code: `// Server Component (default in Next.js app/)
export default async function ProductPage({ params }) {
  const product = await db.product.find(params.id)     // runs on the server
  return <><h1>{product.name}</h1><AddToCart id={product.id} /></>
}
// AddToCart.jsx
'use client'
export function AddToCart({ id }) { const [n, setN] = useState(1); /* ... */ }` },
    { h: 'Choosing a strategy', lv: 'Medium', html: `<p>Public, content-heavy, SEO-critical pages → SSG/ISR or SSR. Personalised pages that must be fast on first load → SSR with streaming. Dashboards behind login → CSR is fine. Most real apps mix strategies per route. Measure TTFB, LCP and INP to decide.</p>` },
  ],
  mistakes: ['Thinking SSR automatically makes a page fast (TTFB, hydration cost and large bundles still matter)', 'Using window/localStorage/Date during render in SSR', 'Fetching sequentially on the server (waterfalls)', 'Marking everything "use client" and losing RSC benefits', 'Caching personalised SSR responses on a shared CDN'],
  qa: [
    { q: 'What is the difference between CSR and SSR?', a: 'CSR renders in the browser after downloading JS (simple hosting, slower first paint, weaker SEO). SSR renders HTML on the server per request (fast first content, better SEO, needs a server, adds hydration cost).' },
    { q: 'What is hydration and what causes hydration errors?', a: 'Attaching React to server-rendered HTML. Errors happen when the first client render differs from the server HTML: browser-only APIs during render, time/locale differences, random values, invalid HTML nesting, extensions.' },
    { q: 'SSR vs SSG vs ISR?', a: 'SSR: HTML per request (fresh, slower, costs a server). SSG: HTML at build time (fastest, can be stale). ISR: static pages regenerated after an interval or on demand.' },
    { q: 'What are React Server Components?', a: 'Components that run only on the server, can access data directly, and ship no JS to the client. Client components handle interactivity. Used through frameworks like Next.js.' },
  ],
  scenarios: [
    { q: 'A marketing site built with CSR ranks poorly and shows a blank screen on slow phones.', a: 'Move public pages to SSG/ISR (or SSR) so HTML arrives ready; keep interactive parts as client components; optimise the LCP image.' },
    { q: 'A page is slow even after SSR.', a: 'Measure TTFB vs LCP vs INP: parallelise and cache server data, stream with Suspense, reduce client JS with Server Components and code splitting.' },
  ],
  exercises: [
    { lv: 'Medium', task: 'This component causes a hydration mismatch: <code>&lt;p&gt;Now: {new Date().toLocaleTimeString()}&lt;/p&gt;</code>. Fix it.', hint: 'Render the same thing on both sides first.',
      solution: `function Clock() {
  const [time, setTime] = useState(null)
  useEffect(() => {
    setTime(new Date().toLocaleTimeString())
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000)
    return () => clearInterval(id)
  }, [])
  return <p>Now: {time ?? '--:--'}</p>
}`, explain: 'Server and first client render both output the placeholder; the real time is set after hydration in an effect.' },
  ],
  followups: [
    { q: 'What is TTFB vs FCP vs LCP?', a: 'TTFB: time until the first byte of the response. FCP: first content painted. LCP: largest content element painted (main Core Web Vital for loading).' },
    { q: 'How does streaming improve SSR?', a: 'The server sends the shell immediately and streams slower sections as they resolve, instead of waiting for all data before sending anything.' },
  ],
  summary: ['CSR: browser renders; SSR: server per request', 'SSG: build time; ISR: regenerate later', 'Hydration must match server HTML', 'Streaming + Suspense = faster first paint', 'RSC: server-only components, no JS shipped', 'Mix strategies per route; measure TTFB/LCP/INP'],
  quiz: [
    { q: 'Which renders HTML at build time?', options: ['CSR', 'SSR', 'SSG', 'Hydration'], answer: 2, why: 'Static Site Generation renders during the build.' },
    { q: 'What does hydration do?', options: ['Fetches data', 'Attaches React event handlers/state to server HTML', 'Compresses images', 'Minifies JS'], answer: 1, why: 'It makes server HTML interactive.' },
    { q: 'Can a Server Component use useState?', options: ['Yes', 'No', 'Only with Redux', 'Only in production'], answer: 1, why: 'State and effects belong to Client Components.' },
  ],
});

HUB.guide({
  id: 'state-hooks', area: 'React', title: 'State in React: useState, useReducer, batching and immutability', level: 'Beginner → Senior', time: '45 min',
  intro: 'How component state works: snapshots, updater functions, batching, immutable updates of objects and arrays, useReducer, lifting state up and where state should live.',
  related: 'useState useReducer state update batching',
  prereq: ['Components and props', 'Spread syntax and array methods'],
  concepts: [
    { h: 'State is a snapshot', lv: 'Easy', html: `<p><code>useState</code> returns the value for <b>this render</b> and a setter. Calling the setter schedules a re-render; the variable doesn't change until the next render.</p>`,
      code: `const [count, setCount] = useState(0)
function handle() { setCount(count + 1); console.log(count) }   // logs the OLD value` },
    { h: 'Updater functions', lv: 'Easy', html: `<p>When the next value depends on the previous one, pass a function. Three <code>setCount(count + 1)</code> calls add 1; three <code>setCount(c =&gt; c + 1)</code> add 3.</p>` },
    { h: 'Batching', lv: 'Medium', html: `<p>React groups state updates from the same event (and, since React 18, from timeouts and promises) into one render. Fewer renders, consistent UI.</p>` },
    { h: 'Updating objects and arrays immutably', lv: 'Medium', html: `<p>Never mutate state; create new objects/arrays so React sees a new reference. Copy every level you change; Immer helps for deep data.</p>`,
      code: `setUser(u => ({ ...u, address: { ...u.address, city: 'Hyderabad' } }))
setTodos(t => [...t, newTodo])                                // add
setTodos(t => t.filter(x => x.id !== id))                     // remove
setTodos(t => t.map(x => (x.id === id ? { ...x, done: !x.done } : x)))   // update` },
    { h: 'Lazy initial state', lv: 'Medium', html: `<p>Pass a function to compute expensive initial state once: <code>useState(() =&gt; JSON.parse(localStorage.getItem('cart')) ?? [])</code>.</p>` },
    { h: 'useReducer for related, complex state', lv: 'Medium', html: `<p>Centralise transitions in a pure reducer; dispatch describes what happened. Easier to test and reason about when many fields change together.</p>`,
      code: `function reducer(state, action) {
  switch (action.type) {
    case 'fetch': return { ...state, status: 'loading', error: null }
    case 'success': return { status: 'success', data: action.data, error: null }
    case 'failure': return { ...state, status: 'error', error: action.error }
    default: throw new Error('Unknown action')
  }
}
const [state, dispatch] = useReducer(reducer, { status: 'idle', data: null, error: null })` },
    { h: 'Where state should live', lv: 'Hard', html: `<p>Keep state as low as possible; lift it to the closest common parent when siblings need it; derive values instead of storing duplicates; reset with <code>key</code>; server data in a query cache; URL state (filters, page) in the URL; global client state in Context/Zustand/Redux.</p>` },
  ],
  mistakes: ['Mutating state (push, direct assignment)', 'Expecting state to change right after calling the setter', 'Storing derived data (fullName, totals) in state', 'Copying props into state and never syncing', 'One giant state object for unrelated values'],
  qa: [
    { q: 'Why does console.log show the old value after setState?', a: 'State is a snapshot for the current render; the setter schedules a new render where the new value will be available.' },
    { q: 'When do you use the updater function form?', a: 'When the next state depends on the previous state, especially with multiple updates in one event or in async callbacks.' },
    { q: 'useState vs useReducer?', a: 'useState for simple independent values; useReducer when several fields change together, transitions are complex, or you want testable logic and a stable dispatch.' },
  ],
  scenarios: [{ q: 'Clicking "+3" only increases the counter by 1.', a: 'Three setCount(count + 1) calls read the same snapshot. Use setCount(c => c + 1).' }],
  exercises: [
    { lv: 'Medium', task: 'Write a cart reducer with add (increase qty if present), remove and clear actions.', hint: 'Use map/filter and return new arrays.',
      solution: `function cart(state, action) {
  switch (action.type) {
    case 'add': {
      const found = state.find(i => i.id === action.item.id)
      return found ? state.map(i => (i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i)) : [...state, { ...action.item, qty: 1 }]
    }
    case 'remove': return state.filter(i => i.id !== action.id)
    case 'clear': return []
    default: return state
  }
}`, explain: 'Every branch returns a new array, so React detects the change; the reducer is pure and easy to unit test.' },
  ],
  followups: [
    { q: 'Does setState with the same value re-render?', a: 'React bails out if the new value is identical (Object.is); it may still render the component once before bailing out.' },
    { q: 'How do you reset a component\'s state when a prop changes?', a: 'Give it a key based on that prop (key={userId}) so React remounts it.' },
  ],
  summary: ['State = snapshot per render', 'Updater function for previous-based updates', 'Automatic batching (React 18)', 'Immutable updates: new objects/arrays', 'useReducer for complex related state', 'Derive, don\'t duplicate; reset with key'],
  quiz: [
    { q: 'Three setCount(c => c + 1) calls from 0 give?', options: ['1', '3', '0', 'Error'], answer: 1, why: 'Each updater receives the latest pending value.' },
    { q: 'Which update is correct?', options: ['todos.push(t); setTodos(todos)', 'setTodos([...todos, t])', 'todos[0] = t', 'setTodos(todos)'], answer: 1, why: 'Create a new array.' },
  ],
});

HUB.guide({
  id: 'context-api', area: 'React', title: 'Context API: sharing state without prop drilling', level: 'Beginner → Senior', time: '35 min',
  intro: 'When and how to use Context, the provider pattern with custom hooks, performance pitfalls, splitting contexts, useReducer + Context, and when to choose a store instead.',
  related: 'context useContext prop drilling provider',
  prereq: ['Props and state', 'Prop drilling problem', 'useMemo basics'],
  concepts: [
    { h: 'The problem: prop drilling', lv: 'Easy', html: `<p>Passing a value through many components that don't use it just to reach a deep child. Context makes a value available to any descendant.</p>` },
    { h: 'Create, provide, consume', lv: 'Easy', html: `<p>React 19 lets you render the context itself as the provider and read it with <code>useContext</code> or <code>use</code>.</p>`,
      code: `const ThemeContext = createContext('light')
function App() { return <ThemeContext value="dark"><Page /></ThemeContext> }   // React 19 (<ThemeContext.Provider> before)
function Button() { const theme = useContext(ThemeContext); return <button className={theme}>OK</button> }` },
    { h: 'Provider component + custom hook pattern', lv: 'Medium', html: `<p>Wrap state and actions in a provider, memoize the value, and expose a hook that throws when used outside the provider.</p>`,
      code: `const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const value = useMemo(() => ({ user, login: setUser, logout: () => setUser(null) }), [user])
  return <AuthContext value={value}>{children}</AuthContext>
}
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}` },
    { h: 'Performance: every consumer re-renders', lv: 'Medium', html: `<p>When the value changes (by reference), every component using that context re-renders. Memoize the value, split state and actions into separate contexts, and keep fast-changing values out of broad contexts.</p>` },
    { h: 'useReducer + Context', lv: 'Hard', html: `<p>A lightweight Redux-like pattern: one context for state, one for <code>dispatch</code> (stable), so components that only dispatch never re-render on state changes.</p>` },
    { h: 'Context vs state libraries', lv: 'Hard', html: `<p>Context is dependency injection, not a state manager: no selectors, middleware or devtools. For frequently updated global state use Zustand or Redux Toolkit; for server data use TanStack Query.</p>` },
  ],
  mistakes: ['Putting everything in one giant context', 'Passing a new object as value every render', 'Using context for fast-changing values like mouse position', 'Forgetting the provider and getting default values silently', 'Using context for server data caching'],
  qa: [
    { q: 'What is the Context API?', a: 'A way to provide a value at one level of the tree and read it anywhere below without passing props through every level.' },
    { q: 'What are the downsides of Context?', a: 'All consumers re-render when the value changes; no built-in selectors, middleware or devtools; overusing it hides data dependencies.' },
    { q: 'Context vs Redux?', a: 'Context passes values (good for theme, locale, auth). Redux manages complex, frequently updated state with selectors, middleware and DevTools.' },
  ],
  scenarios: [{ q: 'Typing in a search box re-renders the whole app.', a: 'The search text lives in a top-level context. Move it into local state or a separate small context, or a store with selectors.' }],
  exercises: [
    { lv: 'Medium', task: 'Split a TodoContext into TodosStateContext and TodosDispatchContext using useReducer.', hint: 'dispatch from useReducer is stable.',
      solution: `const TodosState = createContext(null), TodosDispatch = createContext(null)
export function TodosProvider({ children }) {
  const [todos, dispatch] = useReducer(todosReducer, [])
  return <TodosState value={todos}><TodosDispatch value={dispatch}>{children}</TodosDispatch></TodosState>
}
export const useTodos = () => useContext(TodosState)
export const useTodosDispatch = () => useContext(TodosDispatch)`, explain: 'Components that only dispatch (like an AddTodo button) don\'t re-render when the todos list changes.' },
  ],
  followups: [{ q: 'Can a component read multiple contexts?', a: 'Yes; call useContext for each. Nest providers or compose them in an AppProviders component.' }],
  summary: ['Context solves prop drilling', 'Provider component + custom hook that throws', 'Memoize value; split state/dispatch', 'All consumers re-render on change', 'Not a full state manager'],
  quiz: [
    { q: 'What happens to consumers when the context value changes?', options: ['Nothing', 'They re-render', 'Only the provider re-renders', 'The page reloads'], answer: 1, why: 'Every consumer of that context re-renders.' },
    { q: 'Good use of context?', options: ['Mouse position updates', 'Theme and current user', 'Every API response', 'Form keystrokes app-wide'], answer: 1, why: 'Low-frequency, widely needed values.' },
  ],
});
