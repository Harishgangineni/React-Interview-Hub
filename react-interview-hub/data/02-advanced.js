HUB.add({
  id: 'advanced', title: 'Advanced React', short: 'Advanced',
  blurb: 'Context, hooks, code splitting, SSR and SSG, patterns, data fetching and performance.',
  items: [
{ q: `What is the context API in React?`,
  k: `Context is a loudspeaker: the grown-up says something once and every child in the house can hear it, no passing notes hand to hand.`,
  a: `Context lets a component provide a value that any descendant can read without passing props through every level (prop drilling). Good for low-frequency, app-wide values: theme, locale, current user, feature flags. Every consumer re-renders when the value changes, so it is not a performance-tuned state manager.`,
  t: `Split contexts by how often they change, and memoize the provider value.` },
{ q: `How do you use the context API?`,
  k: `Make a loudspeaker, put it at the top of the house, and let kids listen with useContext.`,
  a: `Create the context, wrap a subtree in a provider, read it with <code>useContext</code> (or <code>use(Context)</code> in React 19, which can be called conditionally). React 19 also lets you render <code>&lt;ThemeContext value={...}&gt;</code> directly instead of <code>.Provider</code>. Wrap the hook in a custom hook that throws when used outside the provider.`,
  c: `const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const value = useMemo(() => ({ theme, setTheme }), [theme])
  return <ThemeContext value={value}>{children}</ThemeContext>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}` },
{ q: `What are React hooks?`,
  k: `Hooks are magic stickers that give a simple recipe-brick superpowers: memory, timers, and remembering things.`,
  a: `Functions starting with <code>use</code> that let function components use React features: state (<code>useState</code>, <code>useReducer</code>), effects (<code>useEffect</code>, <code>useLayoutEffect</code>), context, refs, memoization, transitions (<code>useTransition</code>, <code>useDeferredValue</code>), ids (<code>useId</code>), external stores (<code>useSyncExternalStore</code>), and in React 19 <code>useActionState</code>, <code>useOptimistic</code>, <code>useFormStatus</code> and <code>use</code>. <b>Rules</b>: call them only at the top level of components or custom hooks, never in loops or conditions (except <code>use</code>), because React tracks hooks by call order.` },
{ q: `What is the use of useState hook?`,
  k: `useState gives a brick a memory box and a button to change what's inside.`,
  a: `<code>useState(initial)</code> returns the current value and a setter. Setting a new value schedules a re-render. Pass a function as the initial value for expensive setup (lazy init). Use the updater form when the next value depends on the previous. React skips the render if the new value is identical (<code>Object.is</code>).`,
  c: `const [items, setItems] = useState(() => loadFromStorage())
setItems(prev => [...prev, newItem])` },
{ q: `What is the use of useEffect hook?`,
  k: `useEffect is for jobs outside the drawing: "after you draw the page, also start the timer".`,
  a: `<code>useEffect</code> synchronises a component with an external system (subscriptions, timers, DOM APIs, analytics, non-React widgets) after the browser paints. The dependency array says when to re-sync; the returned function cleans up before the next run and on unmount. In StrictMode dev, effects run twice on mount to reveal missing cleanup.`,
  c: `useEffect(() => {
  const conn = createConnection(roomId)
  conn.connect()
  return () => conn.disconnect()
}, [roomId])`,
  t: `"You might not need an effect": don't use effects to derive data or to respond to events. Data fetching belongs in TanStack Query, a framework loader, or use().` },
{ q: `How do you create custom hooks in React?`,
  k: `You take a trick you use in many bricks and put it in its own sticker so every brick can use it.`,
  a: `A custom hook is a function whose name starts with <code>use</code> and that calls other hooks. It shares stateful <b>logic</b>, not state: each component calling it gets its own state. Return what callers need (values, callbacks, an object). Good hooks are small, named after what they do, and documented with their dependencies.`,
  c: `function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : initial
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)) }, [key, value])
  return [value, setValue]
}` },
{ q: `What is the use of useContext hook?`,
  k: `It's how a child listens to the loudspeaker.`,
  a: `<code>useContext(MyContext)</code> returns the value from the nearest provider above, or the default value if none. The component re-renders whenever that value changes (identity check). In React 19, <code>use(MyContext)</code> does the same and can be called inside conditions.` },
{ q: `What is the use of useReducer hook?`,
  k: `Instead of changing the memory box yourself, you send a message like "add a toy" and a rule book decides what the box should now hold.`,
  a: `<code>useReducer(reducer, initialState)</code> manages state through actions and a pure reducer <code>(state, action) =&gt; newState</code>. Prefer it when state has several related fields, when next state depends on the previous in complex ways, or when you want transitions to be testable outside the component. <code>dispatch</code> is stable, so it is cheap to pass down.`,
  c: `function reducer(state, action) {
  switch (action.type) {
    case 'added': return [...state, action.todo]
    case 'removed': return state.filter(t => t.id !== action.id)
    default: throw new Error('Unknown action ' + action.type)
  }
}
const [todos, dispatch] = useReducer(reducer, [])
dispatch({ type: 'added', todo })` },
{ q: `How do you use the useMemo hook?`,
  k: `If counting all the stars takes a long time, write the answer down and only count again when the sky changes.`,
  a: `<code>useMemo(() =&gt; compute(a, b), [a, b])</code> caches a computed value between renders until a dependency changes. Use it for expensive calculations, or to keep an object/array reference stable for a memoized child or an effect dependency. It is a performance hint, not a guarantee.`,
  c: `const visible = useMemo(() => todos.filter(t => matches(t, query)), [todos, query])`,
  u: `With the React Compiler (1.0, Oct 2025) most manual useMemo/useCallback can be removed.` },
{ q: `What is the use of useCallback hook?`,
  k: `It keeps the same instruction card instead of writing a new identical card every time, so a picky child doesn't think something changed.`,
  a: `<code>useCallback(fn, deps)</code> returns the same function reference until a dependency changes. It only helps when identity matters: passing callbacks to a <code>React.memo</code> child, or using the function in another hook's dependency array. <code>useCallback(fn, d)</code> equals <code>useMemo(() =&gt; fn, d)</code>.`,
  c: `const handleSelect = useCallback(id => setSelected(id), [])
<MemoList items={items} onSelect={handleSelect} />` },
{ q: `What is the use of useRef hook?`,
  k: `A secret pocket: you can put something in it and change it any time, and nobody redraws the picture.`,
  a: `<code>useRef(initial)</code> returns a stable object <code>{ current }</code> that persists for the component's lifetime. Uses: DOM access, storing timer or request ids, previous values, latest callback, instance flags. Changing <code>.current</code> doesn't re-render. Don't read or write refs during render (except lazy init), because it makes rendering impure.` },
{ q: `How do you handle side effects in React?`,
  k: `Side effects are jobs that touch the outside world, like phoning the shop. You do them after drawing, and you hang up when you leave.`,
  a: `Keep render pure. Put work triggered by a <b>user action</b> in event handlers. Put synchronisation with external systems in <code>useEffect</code> with correct deps and cleanup. Use <code>useLayoutEffect</code> only for DOM measurement before paint. For data, prefer TanStack Query, a framework loader, Server Components, or React 19 Actions over hand-rolled effects. For subscriptions to external stores, use <code>useSyncExternalStore</code>.` },
{ q: `What is React.lazy?`,
  k: `Don't bring every toy to the park. Bring the big ones only when someone wants to play with them.`,
  a: `<code>React.lazy(() =&gt; import('./Page'))</code> defines a component whose code is loaded on first render, producing a separate bundle chunk. It must be rendered inside a <code>&lt;Suspense&gt;</code> boundary that shows a fallback while loading. The import must resolve to a module with a default export.`,
  c: `const Settings = lazy(() => import('./Settings'))
<Suspense fallback={<Spinner />}><Settings /></Suspense>` },
{ q: `What is React.Suspense?`,
  k: `Suspense is a curtain: while the show isn't ready, you see "Loading..." and then the curtain opens.`,
  a: `<code>&lt;Suspense fallback={...}&gt;</code> shows a fallback while something inside is not ready: lazy code, data read with <code>use(promise)</code> or <code>useSuspenseQuery</code>, or streamed server content. Boundaries can nest to reveal UI progressively, and transitions keep old UI visible instead of flashing the fallback.` },
{ q: `How do you implement code splitting in React?`,
  k: `Cut the big storybook into chapters and only fetch the chapter you're reading.`,
  a: `Use dynamic <code>import()</code>, which bundlers (Vite, Webpack, Rspack) turn into separate chunks. In React: <code>lazy</code> + <code>Suspense</code>, usually per route. Frameworks split by route automatically. Also split heavy libraries used in one place (charts, editors) and prefetch likely next chunks on hover.`,
  c: `const routes = [
  { path: '/', Component: lazy(() => import('./Home')) },
  { path: '/reports', Component: lazy(() => import('./Reports')) },
]` },
{ q: `What is server-side rendering (SSR) in React?`,
  k: `The cook finishes the sandwich in the kitchen, so you can see it right away; then it becomes "live" when you pick it up.`,
  a: `SSR renders components to HTML on the server per request, so users see content before JavaScript loads and crawlers get real HTML. The client then <b>hydrates</b> it to attach interactivity. React 18+ streams HTML (<code>renderToPipeableStream</code>) with Suspense boundaries, and React Server Components let some components run only on the server and ship no JS.` },
{ q: `How do you implement SSR in React?`,
  k: `Use a kitchen (framework) that already knows how to make sandwiches ahead.`,
  a: `Practically, with a framework: Next.js App Router (server components and streaming by default) or React Router framework mode with loaders. By hand: render with <code>renderToPipeableStream</code> on Node, send HTML, and call <code>hydrateRoot</code> on the client with the same tree and data.`,
  c: `// server
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/client.js'],
  onShellReady() { res.setHeader('content-type', 'text/html'); pipe(res) },
})
// client
hydrateRoot(document.getElementById('root'), <App />)` },
{ q: `What is static site generation (SSG) in React?`,
  k: `You print all the pages before anyone visits, like a printed book. Super fast to hand out.`,
  a: `SSG renders pages to HTML at <b>build time</b> and serves them from a CDN. Fast, cheap and robust, ideal for docs, blogs and marketing pages. Data that changes needs a rebuild or incremental regeneration (Next.js ISR / revalidate).` },
{ q: `How do you implement SSG in React?`,
  k: `Ask the printer to make every page in advance.`,
  a: `Next.js App Router: pages are static by default when they use no dynamic data; use <code>generateStaticParams</code> for dynamic routes and <code>export const revalidate = 3600</code> for ISR. Astro, Gatsby and React Router <code>prerender</code> also generate static HTML.`,
  c: `// app/blog/[slug]/page.jsx
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(p => ({ slug: p.slug }))
}` },
{ q: `What is hydration in React?`,
  k: `The server sends a picture of the toy; hydration puts batteries in it so it moves.`,
  a: `Hydration attaches React's event handlers and state to server-rendered HTML instead of recreating the DOM. The client must render the same output as the server, otherwise you get <b>hydration mismatch</b> errors (common causes: dates, random ids, <code>window</code> checks during render). Use <code>useId</code> for ids and move browser-only values into effects. React 18+ hydrates selectively and React 19 gives better mismatch diffs.` },
{ q: `What is the use of React.PureComponent?`,
  k: `A class brick that only redraws if its instructions actually changed.`,
  a: `<code>PureComponent</code> is a class base that implements <code>shouldComponentUpdate</code> with a shallow comparison of props and state. It skips renders when nothing changed by reference. It breaks if you mutate objects (same reference, so no update). Function equivalent: <code>React.memo</code>.` },
{ q: `What is the difference between React.PureComponent and React.Component?`,
  k: `Component always redraws when asked; PureComponent first checks if anything changed.`,
  a: `<code>Component</code> re-renders whenever its parent renders or setState is called (unless you write <code>shouldComponentUpdate</code>). <code>PureComponent</code> adds a shallow props/state comparison. Use Pure when props are immutable and rendering is costly; avoid it when props include new objects or functions each render, because the check always fails and only adds cost.` },
{ q: `How do you implement higher-order components (HOC) in React?`,
  k: `An HOC is a gift wrapper: you put a brick inside and get back a brick with extra powers.`,
  a: `An HOC is a function that takes a component and returns a new component with added behaviour (auth checks, logging, data injection). Forward props, copy a readable <code>displayName</code>, and don't create HOCs inside render. Hooks replaced most HOCs, but they remain in older codebases and libraries.`,
  c: `function withAuth(Component) {
  function Wrapped(props) {
    const user = useUser()
    if (!user) return <Navigate to="/login" />
    return <Component {...props} user={user} />
  }
  Wrapped.displayName = 'withAuth(' + (Component.displayName || Component.name) + ')'
  return Wrapped
}` },
{ q: `What are render props?`,
  k: `Instead of telling a brick what to draw, you hand it a crayon-function and it draws using your crayon.`,
  a: `A pattern where a component takes a function prop (often <code>children</code>) and calls it to decide what to render, sharing its internal state with the caller. Used for reusable behaviour (mouse position, toggles, virtualized rows). Custom hooks replace most uses, but render props still fit components that own markup, such as list renderers.`,
  c: `<DataTable rows={rows} renderRow={row => <Row key={row.id} {...row} />} />` },
{ q: `What is the use of React.memo?`,
  k: `React.memo is a sign on the brick: "Only redraw me if my instructions change."`,
  a: `<code>React.memo(Component, areEqual?)</code> skips re-rendering a function component when its props are shallowly equal to last time. Effective only when props are stable (primitives, memoized objects and callbacks). It does not stop re-renders caused by its own state or context.`,
  c: `const Row = memo(function Row({ item, onSelect }) { ... })` },
{ q: `How do you handle asynchronous data fetching in React?`,
  k: `You send a helper to the shop. While they're away you show "loading", then the toys, or "sorry" if the shop was closed.`,
  a: `Best options in 2026: <ul><li><b>TanStack Query</b> (or SWR, RTK Query) for client apps: cache, dedupe, retries, refetching.</li><li><b>Framework data</b>: Server Components (async components), Next.js fetch caching, React Router loaders.</li><li><b>React 19 <code>use(promise)</code></b> with Suspense for promises created outside render.</li></ul> A raw <code>useEffect</code> fetch must handle loading, errors, race conditions (AbortController or ignore flag) and cleanup.`,
  c: `useEffect(() => {
  const ctrl = new AbortController()
  fetch('/api/toys?q=' + q, { signal: ctrl.signal })
    .then(r => r.json()).then(setToys)
    .catch(e => { if (e.name !== 'AbortError') setError(e) })
  return () => ctrl.abort()
}, [q])` },
{ q: `What is the use of the Suspense component with data fetching?`,
  k: `The curtain also works for waiting on toys from the shop, not just for code.`,
  a: `With Suspense-enabled sources (<code>use(promise)</code>, <code>useSuspenseQuery</code>, Relay, server components), a component "suspends" until data is ready and the nearest <code>&lt;Suspense&gt;</code> shows the fallback. Benefits: no loading branches in every component, coordinated reveal, streaming SSR. Pair with an error boundary for failures, and start requests early (in a loader or parent) to avoid waterfalls.`,
  c: `function Profile({ userPromise }) {
  const user = use(userPromise)
  return <h1>{user.name}</h1>
}
<Suspense fallback={<Skeleton />}><Profile userPromise={fetchUser(id)} /></Suspense>` },
{ q: `How do you manage global state in a React application?`,
  k: `Some things belong to the whole house: the house rules go on the fridge where everyone can see them.`,
  a: `First classify state: <b>server state</b> → TanStack Query / RTK Query; <b>URL state</b> (filters, page) → the router; <b>form state</b> → React Hook Form; <b>truly global client state</b> → Context for rare changes, or Zustand, Redux Toolkit, Jotai for frequent updates. Keep most state local and lift only when needed.`,
  t: `The senior answer is "it depends on the kind of state", not "use Redux".` },
{ q: `What are some common performance optimization techniques in React?`,
  k: `Redraw less, carry less, and don't wait in line twice.`,
  a: `<ul><li>Profile first (React DevTools Profiler, Web Vitals: LCP, INP, CLS).</li><li>Fewer re-renders: colocate state, split contexts, memo/useMemo/useCallback or React Compiler.</li><li>Less JS: lazy routes, dynamic imports, analyse bundles.</li><li>Lists: virtualization, stable keys.</li><li>Input responsiveness: <code>useTransition</code>, <code>useDeferredValue</code>, debounce.</li><li>Data: caching, prefetching, parallel requests, avoiding waterfalls.</li><li>Rendering: SSR/SSG, streaming, Server Components.</li><li>Assets: responsive images, font loading, compression.</li></ul>` },
{ q: `What is the difference between client-side and server-side rendering in React?`,
  k: `Client-side: you get a kit and build the toy yourself. Server-side: the toy arrives built.`,
  a: `<b>CSR</b>: server sends a near-empty HTML shell and a JS bundle; the browser renders everything. Simple hosting, rich interactivity, but slower first paint and weaker SEO. <b>SSR</b>: server sends ready HTML, then the client hydrates. Faster first content and better SEO, but needs a server and has hydration costs. Modern apps mix them per route, plus SSG and streaming.` },
  ],
});
