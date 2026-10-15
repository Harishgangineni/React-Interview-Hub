/* From React_AI.pdf (127-page infographic series). Topics already covered elsewhere on the site are not repeated here. */
HUB.add({
  id: 'reactvisual', title: 'React: visual notes extras', short: 'React extras',
  blurb: 'Topics from your React infographic notes that the other sections did not cover yet: history, structure, styling, communication, forms, Fiber, Zustand and performance.',
  items: [
{ q: `What are the advantages and disadvantages of React?`,
  k: `Good: reusable bricks, fast updates, a huge community. Not so good: it changes often and you must pick extra tools yourself.`,
  a: `<b>Advantages</b>: component-based and reusable, declarative UI, efficient updates via reconciliation, one-way data flow, huge ecosystem and community, React Native for mobile, strong tooling (DevTools, TypeScript), works with any backend. <b>Disadvantages</b>: only the view layer, so routing, data and state need extra libraries or a framework; fast-moving ecosystem; JSX and hooks rules have a learning curve; SEO needs SSR/SSG for client-rendered apps; easy to over-render without care.` },
{ q: `What is the history of React?`,
  k: `A Facebook engineer made it to build the News Feed; then it was shared with everyone.`,
  a: `Created by Jordan Walke at Facebook (inspired by XHP), first used on the News Feed in 2011 and Instagram in 2012, open-sourced in May 2013. Milestones: React Native (2015), Fiber rewrite in React 16 (2017), Hooks in 16.8 (2019), concurrent rendering in 18 (2022), React 19 with Actions and Server Components (Dec 2024), React Compiler 1.0 (Oct 2025). Maintained by Meta and the community; in October 2025 Meta announced React is moving to the new React Foundation under the Linux Foundation.` },
{ q: `How should you organise a React project folder structure?`,
  k: `Give everything a labelled shelf so anyone can find it.`,
  a: `Typical Vite app: <code>public/</code> static files; <code>src/</code> with <code>assets/</code>, <code>components/</code> (reusable UI), <code>pages/</code> or <code>routes/</code>, <code>hooks/</code>, <code>context/</code>, <code>store/</code> or <code>redux/</code>, <code>services/</code> (API calls), <code>utils/</code>, <code>constants/</code>, <code>styles/</code>, <code>App.jsx</code>, <code>main.jsx</code>; plus <code>.env</code>, <code>vite.config.js</code>, <code>package.json</code>. For larger apps group by <b>feature</b> (<code>features/cart/{components,hooks,api,slice}</code>) so related code lives together. Benefits: scalable, maintainable, easier collaboration and onboarding.`,
  c: `src/
  app/            store, router, providers
  features/
    auth/         components, hooks, authSlice.ts, authApi.ts
    cart/
  components/     shared UI (Button, Modal)
  hooks/          shared hooks
  services/       api client
  utils/  constants/  styles/
  main.tsx` },
{ q: `How do you create a React component without JSX?`,
  k: `JSX is a shortcut; underneath, React builds the same thing with a plain function call.`,
  a: `JSX compiles to function calls, so you can call them yourself: <code>React.createElement(type, props, ...children)</code> (or the newer <code>jsx()</code> from <code>react/jsx-runtime</code>). Useful to understand what JSX is, and occasionally in environments without a build step.`,
  c: `import { createElement as h } from 'react'
function Hello({ name }) {
  return h('div', { className: 'card' }, h('h1', null, 'Hello ', name))
}
// same as: <div className="card"><h1>Hello {name}</h1></div>` },
{ q: `What are stateless and stateful components?`,
  k: `A stateless brick only shows what it's told; a stateful brick also remembers things.`,
  a: `<b>Stateless</b> (presentational) components render purely from props: simple, reusable, easy to test. <b>Stateful</b> (container) components own state (useState/useReducer, or class state) and logic, then pass data down. Hooks made the line softer, but the split still guides design: keep state as low as possible and most components stateless.`,
  c: `const Greeting = ({ name }) => <p>Hello {name}</p>           // stateless
function Counter() { const [n, setN] = useState(0); return <button onClick={() => setN(n + 1)}>{n}</button> }  // stateful` },
{ q: `What are the ways to style (use CSS in) React?`,
  k: `Many ways to paint bricks: a paint pot, private paint, paint written in the code, or ready-made paint classes.`,
  a: `Plain CSS / global stylesheets; <b>CSS Modules</b> (<code>Button.module.css</code>, locally scoped classes); <b>inline styles</b> (<code>style={{ color: 'red' }}</code>, objects, no pseudo-classes/media queries); utility CSS like <b>Tailwind</b>; preprocessors (Sass); runtime CSS-in-JS (styled-components, Emotion: now in decline, styled-components in maintenance mode); zero-runtime CSS-in-JS (vanilla-extract, Panda, StyleX); component libraries (MUI, Ant Design, Chakra, shadcn/ui). Use <code>className</code>, and conditionally join classes with <code>clsx</code>.`,
  c: `import styles from './Button.module.css'
<button className={clsx(styles.btn, primary && styles.primary)}>Save</button>` },
{ q: `How do parent and child components communicate (parent → child, child → parent, siblings)?`,
  k: `Parents pass notes down; children call a phone number the parent gave them; siblings talk through their parent.`,
  a: `<b>Parent → child</b>: props. <b>Child → parent</b>: the parent passes a callback prop the child calls with data. <b>Siblings</b>: lift state up to the common parent. <b>Distant components</b>: Context, a state library (Redux/Zustand), or a server cache. Imperative access (rare): refs with <code>useImperativeHandle</code>.`,
  c: `function Parent() {
  const [msg, setMsg] = useState('')
  return <><Child title="Hi" onSend={setMsg} /><p>{msg}</p></>
}
function Child({ title, onSend }) {
  return <button onClick={() => onSend('from child')}>{title}</button>
}` },
{ q: `How do you handle form validation and submission in React?`,
  k: `Check every box is filled correctly before sending the letter, and show friendly messages if not.`,
  a: `Controlled inputs with state, validate on change/blur/submit, show errors next to fields, prevent default submit, disable the button while submitting, handle server errors. Use native constraints (<code>required</code>, <code>type="email"</code>, <code>pattern</code>) for basics; for real apps use React Hook Form + zod; in React 19, form Actions with <code>useActionState</code>. Accessibility: label every input, <code>aria-invalid</code>, <code>role="alert"</code> for errors.`,
  c: `function Signup() {
  const [email, setEmail] = useState(''), [error, setError] = useState('')
  function onSubmit(e) {
    e.preventDefault()
    if (!/^\\S+@\\S+\\.\\S+$/.test(email)) return setError('Enter a valid email')
    setError(''); register(email)
  }
  return <form onSubmit={onSubmit} noValidate>
    <label htmlFor="email">Email</label>
    <input id="email" value={email} onChange={e => setEmail(e.target.value)} aria-invalid={!!error} />
    {error && <p role="alert">{error}</p>}
    <button>Sign up</button>
  </form>
}` },
{ q: `What is React Fiber?`,
  k: `Fiber lets React pause a big drawing job, do something urgent like your typing, then continue.`,
  a: `Fiber is React's reconciliation engine since React 16. Each element becomes a <b>fiber</b> node (a unit of work) in a linked tree, so rendering can be split into chunks, paused, prioritised (lanes), resumed or thrown away. Work happens in two phases: <b>render</b> (interruptible, builds the work-in-progress tree) and <b>commit</b> (synchronous DOM updates). It enables concurrent features: transitions, Suspense, streaming SSR, selective hydration.`,
  t: `Order to explain: Virtual DOM (what React compares) → Reconciliation (how it diffs) → Fiber (the engine that schedules that work).` },
{ q: `What is Zustand?`,
  k: `A tiny, simple cupboard for shared toys, with much less setup than Redux.`,
  a: `A small (~1 KB) state management library: create a store with a hook, select slices to subscribe, update with <code>set</code>. No providers or boilerplate, works outside React, supports middleware (persist, devtools, immer). Good for app-wide client state in small to medium apps; Redux Toolkit when you need strict structure, DevTools-heavy workflows and RTK Query integration.`,
  c: `import { create } from 'zustand'
const useCart = create(set => ({
  items: [],
  add: item => set(s => ({ items: [...s.items, item] })),
}))
const count = useCart(s => s.items.length)   // re-renders only when count changes` },
{ q: `What is the difference between Fetch API and Axios?`,
  k: `fetch comes built into the browser; Axios is a helper you add, with extra conveniences.`,
  a: `<b>fetch</b>: built-in, promise-based, no dependency; you must call <code>res.json()</code>, check <code>res.ok</code> (it doesn't reject on 404/500), set JSON headers yourself, and use AbortController/<code>AbortSignal.timeout</code>. <b>Axios</b>: auto JSON, rejects on non-2xx, instances with baseURL, interceptors, upload/download progress, timeouts, works in Node and older browsers. Either works under TanStack/RTK Query.`,
  c: `// fetch
const res = await fetch('/api/toys', { signal })
if (!res.ok) throw new Error('HTTP ' + res.status)
const toys = await res.json()
// axios
const { data: toys2 } = await api.get('/toys', { signal })` },
{ q: `How do you handle errors in React with try/catch and async code?`,
  k: `try/catch catches problems in your own jobs; a safety net (error boundary) catches broken drawings.`,
  a: `Use <code>try/catch</code> (or <code>.catch</code>) in event handlers and async functions: set an error state and show a message. Error boundaries only catch errors thrown during rendering, lifecycle and constructors, <b>not</b> in event handlers, timeouts or async callbacks. To send an async error to a boundary, store it in state and throw during render, or use <code>useErrorBoundary().showBoundary</code> from react-error-boundary. Data libraries expose <code>error</code> states and <code>throwOnError</code>.`,
  c: `async function handleSave() {
  setStatus('saving')
  try { await saveProfile(form); setStatus('saved') }
  catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong'); setStatus('error') }
}` },
{ q: `What are the key ways to improve React application performance?`,
  k: `Redraw less, load less, and carry lighter pictures.`,
  a: `Checklist from the notes, with the "why": <code>React.memo</code> (skip re-rendering unchanged children), <code>useCallback</code>/<code>useMemo</code> (stable functions and cached calculations, or let the React Compiler do it), code splitting with <code>React.lazy</code> + Suspense, virtualize long lists (TanStack Virtual, react-window), optimise images (WebP/AVIF, sizes, lazy loading), lightweight libraries and named imports, avoid unnecessary state updates and object/array recreation, debounce/throttle events, production builds, and measure with React DevTools Profiler and Lighthouse/Web Vitals.` },
{ q: `What is BrowserRouter vs HashRouter, and why are clean URLs better?`,
  k: `BrowserRouter makes neat addresses like /toys; HashRouter uses /#/toys, which works even without server help.`,
  a: `<code>BrowserRouter</code> uses the History API for clean URLs (<code>/products/3</code>): better for SEO and sharing, but the server must return <code>index.html</code> for all routes (SPA fallback). <code>HashRouter</code> keeps routes after <code>#</code>, which the server never sees, so it works on any static host without configuration (this hub uses hash routes for that reason).` },
  ],
});
