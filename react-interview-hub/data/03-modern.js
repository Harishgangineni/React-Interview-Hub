HUB.add({
  id: 'modern', title: 'React 19 and 2026 updates', short: 'React 19',
  blurb: 'Added for 2026: Actions, use(), Server Components, the React Compiler and what changed.',
  items: [
{ q: `What is new in React 19?`,
  k: `React got new tools so forms and loading feel easier, and a robot helper (the Compiler) that saves work automatically.`,
  a: `<ul><li><b>Actions</b>: async functions in transitions and <code>&lt;form action&gt;</code>, with pending state and errors handled for you.</li><li>New hooks: <code>useActionState</code>, <code>useOptimistic</code>, <code>useFormStatus</code> (react-dom), and the <code>use</code> API for promises and context.</li><li><b>Server Components</b> and Server Functions are stable.</li><li><code>ref</code> as a prop (forwardRef no longer needed), ref cleanup functions.</li><li><code>&lt;Context&gt;</code> as provider, document metadata (<code>&lt;title&gt;</code>, <code>&lt;meta&gt;</code>) rendered anywhere, stylesheet and script support, resource preloading APIs.</li><li>Better hydration error messages. 19.2 added <code>&lt;Activity&gt;</code> and <code>useEffectEvent</code>.</li></ul>`,
  u: `Removed in 19: ReactDOM.render, hydrate, string refs, propTypes checks, defaultProps on function components, legacy context.` },
{ q: `What are React Actions?`,
  k: `An Action is a "do this job" button that also knows when it's busy and when something went wrong.`,
  a: `By convention, functions that use async transitions are called Actions. React tracks their pending state, applies optimistic updates, handles errors through boundaries, and resets forms after success. You pass them to <code>&lt;form action={fn}&gt;</code>, <code>startTransition(async () =&gt; ...)</code>, or <code>useActionState</code>.`,
  c: `function UpdateName() {
  const [error, submit, isPending] = useActionState(async (prev, formData) => {
    const err = await updateName(formData.get('name'))
    return err ?? null
  }, null)
  return <form action={submit}>
    <input name="name" />
    <button disabled={isPending}>Save</button>
    {error && <p>{error}</p>}
  </form>
}` },
{ q: `What is useActionState?`,
  k: `It remembers what happened after you pressed the form button: "done", "busy" or "oops".`,
  a: `<code>const [state, formAction, isPending] = useActionState(action, initialState)</code>. The action receives the previous state and the form data and returns the next state, typically errors or a success message. Works with Server Functions and progressive enhancement (forms work before JS loads when used with a framework).` },
{ q: `What is useOptimistic?`,
  k: `It shows the new toy on the shelf right away while the shop is still saying yes.`,
  a: `<code>const [optimistic, addOptimistic] = useOptimistic(state, updateFn)</code> shows a temporary value while an async Action is running. When the Action finishes, React drops the optimistic value and shows the real state, so a failure rolls back automatically.`,
  c: `const [optimisticTodos, addTodo] = useOptimistic(todos, (cur, t) => [...cur, { ...t, sending: true }])
async function action(formData) {
  const todo = { text: formData.get('text') }
  addTodo(todo)
  await saveTodo(todo)
}` },
{ q: `What is useFormStatus?`,
  k: `A button can peek at its form and ask, "are we sending right now?"`,
  a: `<code>useFormStatus()</code> from <code>react-dom</code> returns <code>{ pending, data, method, action }</code> for the parent <code>&lt;form&gt;</code>. It must be called in a component rendered inside the form, so design-system buttons can show a spinner without prop drilling.`,
  c: `function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>
}` },
{ q: `What is the use() API?`,
  k: `use is a "wait for it" word: give it a promise and the brick waits behind the curtain until the answer arrives.`,
  a: `<code>use(resource)</code> reads a promise (suspending until it resolves) or a context. Unlike hooks it can be called inside conditions and loops. Don't create the promise during render in a client component (it would be recreated every render); create it in a server component, loader, or cache, and pass it down.` },
{ q: `What are React Server Components?`,
  k: `Some bricks are built in the factory and arrive finished; they never need batteries in your house, so your bag is lighter.`,
  a: `RSCs render on the server (at build or request time) and send a serialized result, not their JavaScript, to the client. They can be <code>async</code> and read databases or files directly. They cannot use state, effects or browser APIs. Client components are marked with <code>'use client'</code> and are where interactivity lives. Server Functions (<code>'use server'</code>) let the client call server code. Used via frameworks such as Next.js App Router.`,
  c: `// Server Component (default in Next.js app/)
export default async function Page() {
  const toys = await db.toy.findMany()
  return <ToyList toys={toys} />   // ToyList can be a client component
}`,
  t: `'use client' marks a boundary; everything imported below it becomes client code.` },
{ q: `What is the React Compiler?`,
  k: `A robot that reads your bricks and adds "don't redraw if nothing changed" signs for you.`,
  a: `A build-time tool (stable 1.0, October 2025) that automatically memoizes components and values, so you rarely need <code>useMemo</code>, <code>useCallback</code> or <code>React.memo</code>. It relies on code following the Rules of React (pure render, immutable props/state, hook rules). Enable via the Babel plugin or framework config, and use the ESLint plugin to find code it can't optimise.` },
{ q: `What is the Activity component (React 19.2)?`,
  k: `Instead of throwing a toy away when you hide it, you put it under a blanket, so it's ready exactly as you left it.`,
  a: `<code>&lt;Activity mode="visible" | "hidden"&gt;</code> hides part of the UI while keeping its state, and unmounts its effects while hidden. Useful for tabs, back-navigation and pre-rendering likely next screens at low priority.` },
{ q: `What is useEffectEvent?`,
  k: `A note you can always read the newest version of, without restarting the whole job.`,
  a: `<code>useEffectEvent(fn)</code> (stable in 19.2) creates a function you call from inside an effect that always sees the latest props and state, but is not a dependency. It separates "what triggers re-syncing" from "what values I read when something happens", fixing many stale-closure and over-firing effects.`,
  c: `const onConnected = useEffectEvent(() => showToast('Connected', theme))
useEffect(() => {
  const c = connect(roomId)
  c.on('connected', onConnected)
  return () => c.disconnect()
}, [roomId])   // theme changes no longer reconnect` },
{ q: `What are useTransition and useDeferredValue?`,
  k: `Some jobs are urgent (typing the letter), some can wait a moment (redrawing a huge list). These tools tell React which is which.`,
  a: `<code>useTransition</code> marks a state update as non-urgent: React keeps the UI responsive and can interrupt the render; <code>isPending</code> shows progress. <code>useDeferredValue(value)</code> gives a lagging copy of a value so expensive children re-render with lower priority. Both rely on concurrent rendering; neither debounces network calls.`,
  c: `const [isPending, startTransition] = useTransition()
function onTab(tab) { startTransition(() => setTab(tab)) }

const deferredQuery = useDeferredValue(query)
<Results query={deferredQuery} />` },
{ q: `What is StrictMode and why do effects run twice?`,
  k: `A practice mode that does things twice on purpose, to catch you if you forgot to clean up.`,
  a: `<code>&lt;StrictMode&gt;</code> enables development-only checks: it double-invokes render functions, state initialisers and reducers, and mounts, unmounts and re-mounts components so effects run setup → cleanup → setup. This exposes impure rendering and missing cleanup. Production behaviour is unchanged.` },
{ q: `What is useSyncExternalStore?`,
  k: `A safe straw for drinking from a cup that isn't React's.`,
  a: `<code>useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)</code> subscribes to an external store (browser APIs, Redux, Zustand) in a way that is consistent with concurrent rendering (no tearing). Libraries use it internally; you use it for things like online status or matchMedia.`,
  c: `const isOnline = useSyncExternalStore(
  cb => { addEventListener('online', cb); addEventListener('offline', cb)
          return () => { removeEventListener('online', cb); removeEventListener('offline', cb) } },
  () => navigator.onLine,
  () => true
)` },
{ q: `What is useId?`,
  k: `It gives each brick a name tag that is the same on the server and in your browser.`,
  a: `<code>useId()</code> generates a unique, stable id that matches between server and client rendering. Use it to connect labels and inputs or ARIA attributes. Don't use it for list keys.`,
  c: `const id = useId()
<label htmlFor={id}>Email</label><input id={id} />` },
{ q: `What is a portal?`,
  k: `A magic door that lets a brick show up somewhere else in the house, like a pop-up on top of everything.`,
  a: `<code>createPortal(children, domNode)</code> renders children into a different DOM node (e.g. <code>document.body</code>) while keeping them in the same React tree, so context and event bubbling still follow the React parents. Used for modals, tooltips, toasts. Also consider the native <code>&lt;dialog&gt;</code> element and the Popover API.` },
{ q: `Which React tools are outdated in 2026, and what replaced them?`,
  k: `Some old toys were put away and newer, safer ones took their place.`,
  a: `<ul><li>Create React App → Vite or a framework (CRA deprecated Feb 2025).</li><li>Enzyme → React Testing Library (Enzyme never supported React 18+).</li><li>Class lifecycle methods → hooks.</li><li><code>forwardRef</code> → ref as a prop (19).</li><li><code>defaultProps</code> on functions, <code>propTypes</code> → default params, TypeScript.</li><li><code>ReactDOM.render</code> → <code>createRoot</code>.</li><li>React Router v5 APIs (<code>Switch</code>, <code>useHistory</code>, <code>Redirect</code>, <code>withRouter</code>) → v6/v7 (<code>Routes</code>, <code>useNavigate</code>, <code>Navigate</code>, hooks).</li><li>Hand-written Redux → Redux Toolkit; Redux data fetching → RTK Query or TanStack Query.</li><li>Runtime CSS-in-JS (styled-components in maintenance since March 2025) → Tailwind, CSS Modules, or zero-runtime CSS-in-JS.</li><li>Storybook Knobs → Controls; Storysource → built into Docs.</li><li>Webpack for new apps → Vite (or Rspack for Webpack-compatible speed).</li></ul>` },
{ q: `What are the Rules of React?`,
  k: `Three house rules: draw the same picture for the same instructions, don't scribble on things you were given, and use hooks only at the top.`,
  a: `<ul><li>Components and hooks must be <b>pure</b> during render (idempotent, no side effects).</li><li>Props, state and hook return values are <b>immutable</b>; values passed to JSX shouldn't be mutated afterwards.</li><li>Call hooks only at the top level and only from components or hooks.</li><li>React calls components; you don't call them as functions.</li></ul> The React Compiler and ESLint plugin enforce these.` },
{ q: `How do you explain the React rendering process?`,
  k: `Something changes, React redraws the picture in its head, compares it with the old one, then only fixes the different parts on the real wall.`,
  a: `<b>Trigger</b> (initial render or a state update) → <b>Render</b> (React calls components to build a new element tree; pure, can be paused in concurrent mode) → <b>Commit</b> (React applies the minimal DOM changes, runs layout effects, then the browser paints, then passive effects run). A component re-renders when its state changes, its parent re-renders, or a context it uses changes. Re-render does not mean DOM update.` },
  ],
});
