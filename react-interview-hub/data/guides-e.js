HUB.guide({
  id: 'react-patterns', area: 'React', title: 'Component patterns: composition, custom hooks, HOCs, render props, compound components', level: 'Intermediate → Senior', time: '45 min',
  intro: 'How experienced developers structure reusable React code: composition with children, container/presentational split, custom hooks, HOCs, render props and compound components, and when to pick each.',
  related: 'higher-order component render props custom hooks composition',
  prereq: ['Props and children', 'Hooks basics', 'Context basics'],
  concepts: [
    { h: 'Composition with children and slots', lv: 'Easy', html: `<p>React favours composition over inheritance: pass elements as <code>children</code> or named props ("slots") so components stay generic.</p>`,
      code: `function Card({ title, actions, children }) {
  return <section className="card"><header>{title}{actions}</header>{children}</section>
}
<Card title="Orders" actions={<button>Export</button>}><OrdersTable /></Card>` },
    { h: 'Presentational vs container', lv: 'Easy', html: `<p>Presentational components render from props (easy to test and reuse in Storybook); containers fetch data and hold state. With hooks, the "container" is often a custom hook.</p>` },
    { h: 'Custom hooks', lv: 'Medium', html: `<p>Extract stateful logic into a <code>useXxx</code> function. Each caller gets its own state; logic is shared, not state.</p>`,
      code: `function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = useCallback(() => setOn(v => !v), [])
  return [on, toggle]
}` },
    { h: 'Higher-order components (HOC)', lv: 'Medium', html: `<p>A function that takes a component and returns an enhanced one (auth guard, analytics). Still found in libraries and older code; hooks replace most uses.</p>`,
      code: `const withLoading = Comp => ({ loading, ...props }) => (loading ? <Spinner /> : <Comp {...props} />)` },
    { h: 'Render props', lv: 'Medium', html: `<p>A component takes a function and calls it to render, sharing internal data: <code>&lt;DataTable renderRow={row =&gt; ...} /&gt;</code>. Useful when the component owns markup but the caller customises parts.</p>` },
    { h: 'Compound components', lv: 'Hard', html: `<p>A parent shares state with its children through context, giving a flexible API like native <code>&lt;select&gt;&lt;option&gt;</code> (Tabs, Accordion, Menu).</p>`,
      code: `const TabsCtx = createContext(null)
function Tabs({ children, defaultValue }) { const [v, setV] = useState(defaultValue); return <TabsCtx value={{ v, setV }}>{children}</TabsCtx> }
Tabs.Tab = function Tab({ value, children }) { const { v, setV } = useContext(TabsCtx); return <button role="tab" aria-selected={v === value} onClick={() => setV(value)}>{children}</button> }
Tabs.Panel = function Panel({ value, children }) { const { v } = useContext(TabsCtx); return v === value ? <div role="tabpanel">{children}</div> : null }` },
    { h: 'Controlled vs uncontrolled component APIs', lv: 'Hard', html: `<p>Reusable components often support both: <code>value</code>/<code>onChange</code> (controlled by parent) or <code>defaultValue</code> (internal state). Pick one per instance; never switch between them.</p>` },
  ],
  mistakes: ['Prop explosion (20 boolean props) instead of composition', 'HOCs created inside render (remount every time)', 'Custom hooks that secretly share module-level state', 'Deep inheritance hierarchies of components', 'Over-abstracting before there are three real uses'],
  qa: [
    { q: 'What are higher-order components?', a: 'Functions that take a component and return a new one with added behaviour (auth, logging, data). Hooks replaced most HOCs, but they appear in libraries and legacy code.' },
    { q: 'What is the composition pattern in React?', a: 'Building UIs by combining components and passing elements as children or props instead of inheriting; it keeps components flexible and reusable.' },
    { q: 'Custom hooks vs HOCs vs render props?', a: 'All share logic. Custom hooks are the default today (no wrapper components, explicit inputs/outputs). HOCs wrap components; render props share data through a function child.' },
  ],
  scenarios: [{ q: 'A Button component has grown to 25 props.', a: 'Split variants into composition (Button + Icon children), use a variant enum instead of many booleans, and move rare behaviour to wrappers.' }],
  exercises: [{ lv: 'Medium', task: 'Write <code>useLocalStorage(key, initial)</code> that syncs state to localStorage.', hint: 'Lazy initial state + effect.',
    solution: `function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { const saved = localStorage.getItem(key); return saved !== null ? JSON.parse(saved) : initial } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }, [key, value])
  return [value, setValue]
}`, explain: 'Reads once on mount, writes whenever the value changes, and tolerates storage being unavailable.' }],
  followups: [{ q: 'How do you design a reusable component library API?', a: 'Composition first, consistent prop naming, variants as enums, forward refs/ref props, accessible by default, controlled and uncontrolled modes, documented in Storybook.' }],
  summary: ['Composition over inheritance', 'Custom hooks share logic, not state', 'HOC = component in, component out', 'Render props = function child', 'Compound components share state via context'],
  quiz: [
    { q: 'Do two components using the same custom hook share state?', options: ['Yes', 'No, each gets its own', 'Only in StrictMode', 'Only with memo'], answer: 1, why: 'Hooks share logic; each call has its own state.' },
    { q: 'Which pattern gives an API like <Tabs.Tab> and <Tabs.Panel>?', options: ['HOC', 'Compound components', 'Portals', 'Fragments'], answer: 1, why: 'Children share parent state through context.' },
  ],
});

HUB.guide({
  id: 'suspense-errors', area: 'React', title: 'Code splitting, Suspense, error boundaries and loading UX', level: 'Intermediate → Senior', time: '40 min',
  intro: 'Load code on demand with lazy and dynamic import, show loading states with Suspense, catch crashes with error boundaries, and design good loading, error and empty states.',
  related: 'lazy Suspense code splitting error boundary',
  prereq: ['ES modules and dynamic import()', 'Components and state'],
  concepts: [
    { h: 'Code splitting with lazy', lv: 'Easy', html: `<p><code>React.lazy(() =&gt; import('./Page'))</code> creates a component whose code is a separate chunk, loaded on first render. Split by route first, then heavy widgets (charts, editors).</p>`,
      code: `const Reports = lazy(() => import('./pages/Reports'))
<Suspense fallback={<PageSkeleton />}><Reports /></Suspense>` },
    { h: 'Suspense boundaries', lv: 'Medium', html: `<p><code>&lt;Suspense&gt;</code> shows a fallback while anything inside is waiting (lazy code, <code>use(promise)</code>, <code>useSuspenseQuery</code>, streamed server content). Place boundaries where a loading state makes sense; nested boundaries reveal UI progressively.</p>` },
    { h: 'Transitions keep old UI visible', lv: 'Medium', html: `<p>Navigations wrapped in <code>startTransition</code> keep showing the current screen instead of flashing the fallback while the next one loads.</p>` },
    { h: 'Error boundaries', lv: 'Medium', html: `<p>Class components with <code>getDerivedStateFromError</code>/<code>componentDidCatch</code> (or <code>react-error-boundary</code>) catch render/lifecycle errors in children and show a fallback. They don't catch event handler, async or SSR errors.</p>`,
      code: `import { ErrorBoundary } from 'react-error-boundary'
<ErrorBoundary FallbackComponent={({ error, resetErrorBoundary }) => (
  <div role="alert"><p>Something went wrong: {error.message}</p><button onClick={resetErrorBoundary}>Try again</button></div>
)} onError={logToSentry}>
  <Dashboard />
</ErrorBoundary>` },
    { h: 'Loading, error, empty, success', lv: 'Easy', html: `<p>Every data view needs four states. Skeletons for layout-stable loading, friendly error messages with retry, helpful empty states ("No orders yet. Create one."), and success.</p>` },
    { h: 'Chunk load failures after deploys', lv: 'Hard', html: `<p>Users on an old version may request deleted chunk files. Catch the import error (Vite emits <code>vite:preloadError</code>) and reload, or keep old assets for a while.</p>` },
  ],
  mistakes: ['One Suspense boundary around the whole app (everything flashes)', 'lazy components without Suspense', 'Expecting error boundaries to catch async errors', 'Spinners that cause layout shift instead of skeletons', 'Forgetting empty states'],
  qa: [
    { q: 'What are React.lazy and Suspense?', a: 'lazy defines a code-split component loaded with dynamic import; Suspense shows a fallback while it (or Suspense-enabled data) loads.' },
    { q: 'What do error boundaries catch and not catch?', a: 'They catch errors during rendering, lifecycle methods and constructors of children. Not: event handlers, async callbacks, server rendering or errors in the boundary itself.' },
  ],
  scenarios: [{ q: 'After every deployment some users see a white screen.', a: 'They load a chunk that no longer exists. Add an error boundary with a reload option, handle preload errors by reloading, and keep previous assets available temporarily.' }],
  exercises: [{ lv: 'Medium', task: 'Lazy-load a <code>Chart</code> only when the user opens the "Analytics" tab.', hint: 'lazy at module level, render inside Suspense conditionally.',
    solution: `const Chart = lazy(() => import('./Chart'))
function Analytics({ open }) {
  return open ? <Suspense fallback={<div className="skeleton" style={{ height: 320 }} />}><Chart /></Suspense> : null
}`, explain: 'The chart bundle is downloaded only when the tab opens; the fixed-height skeleton avoids layout shift.' }],
  followups: [{ q: 'How do you prefetch a lazy route?', a: 'Call the same import() on hover/focus (or use the router\'s prefetch), so the chunk is cached before navigation.' }],
  summary: ['lazy + Suspense = code splitting', 'Boundaries where loading makes sense', 'Transitions avoid fallback flashes', 'Error boundaries catch render errors only', 'Design loading, error, empty, success'],
  quiz: [
    { q: 'Does an error boundary catch an error thrown in onClick?', options: ['Yes', 'No'], answer: 1, why: 'Event handler errors must be handled with try/catch.' },
    { q: 'What must wrap a lazy component?', options: ['Fragment', 'Suspense', 'StrictMode', 'Profiler'], answer: 1, why: 'Suspense provides the fallback while the chunk loads.' },
  ],
});

HUB.guide({
  id: 'react-19', area: 'React', title: 'React 19: Actions, use(), new hooks and the React Compiler', level: 'Intermediate → Senior', time: '40 min',
  intro: 'What changed in React 19 and 19.2 and how to use it: Actions and form actions, useActionState, useOptimistic, useFormStatus, use(), ref as a prop, metadata, Activity, useEffectEvent and the Compiler.',
  related: 'React 19 actions useOptimistic useActionState',
  prereq: ['Hooks and forms', 'Promises', 'Suspense basics'],
  concepts: [
    { h: 'Actions', lv: 'Medium', html: `<p>Async functions used in transitions or as <code>&lt;form action&gt;</code>. React tracks pending state, handles errors through boundaries, supports optimistic updates and resets uncontrolled forms on success.</p>` },
    { h: 'useActionState', lv: 'Medium', html: `<p>Returns state from the last action, a wrapped action and a pending flag.</p>`,
      code: `const [error, submit, isPending] = useActionState(async (prev, formData) => {
  const res = await saveName(formData.get('name'))
  return res.ok ? null : res.error
}, null)
<form action={submit}><input name="name" /><button disabled={isPending}>Save</button>{error && <p role="alert">{error}</p>}</form>` },
    { h: 'useOptimistic and useFormStatus', lv: 'Medium', html: `<p><code>useOptimistic</code> shows a temporary value during an action and reverts automatically if it fails. <code>useFormStatus</code> lets a button inside a form read <code>pending</code> without props.</p>` },
    { h: 'use()', lv: 'Hard', html: `<p>Reads a promise (suspends until resolved) or a context; unlike hooks it can be called in conditions. Create promises outside render (server component, loader, cache).</p>` },
    { h: 'Quality-of-life changes', lv: 'Easy', html: `<p><code>ref</code> as a normal prop (no forwardRef), <code>&lt;Context&gt;</code> as provider, ref cleanup functions, <code>&lt;title&gt;</code>/<code>&lt;meta&gt;</code> anywhere, stylesheet/preload APIs, better hydration error diffs. Removed: <code>ReactDOM.render</code>, string refs, propTypes checks, defaultProps on functions.</p>` },
    { h: 'React 19.2: Activity and useEffectEvent', lv: 'Hard', html: `<p><code>&lt;Activity mode="hidden"&gt;</code> hides UI while keeping state; <code>useEffectEvent</code> reads latest values in effects without re-subscribing.</p>` },
    { h: 'React Compiler', lv: 'Hard', html: `<p>Build-time automatic memoization (1.0 in Oct 2025): removes most manual useMemo/useCallback/memo when code follows the Rules of React.</p>` },
  ],
  mistakes: ['Creating promises inside client render for use()', 'Using defaultProps on function components (removed)', 'Using useFormStatus outside a form', 'Assuming the Compiler fixes impure components'],
  qa: [
    { q: 'What is new in React 19?', a: 'Actions with useActionState, useOptimistic, useFormStatus, the use API, Server Components and Server Functions stable, ref as a prop, Context as provider, document metadata, resource preloading, better hydration errors; 19.2 added Activity and useEffectEvent. The Compiler reached 1.0 in Oct 2025.' },
    { q: 'What problem does useOptimistic solve?', a: 'Showing the expected result immediately while an async action runs, with automatic rollback to real state when the action finishes or fails.' },
  ],
  scenarios: [{ q: 'A like button feels slow on poor networks.', a: 'Use useOptimistic (or a query library optimistic update) to show the new count immediately and roll back if the request fails.' }],
  exercises: [{ lv: 'Medium', task: 'Write a SubmitButton that shows "Saving…" while its parent form action is pending.', hint: 'useFormStatus from react-dom.',
    solution: `import { useFormStatus } from 'react-dom'
function SubmitButton({ children }) {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Saving…' : children}</button>
}`, explain: 'It reads the nearest parent form\'s status, so no props are needed.' }],
  followups: [{ q: 'How do you migrate an app to React 19?', a: 'Upgrade to 18.3 first and fix warnings, run the official codemods, replace ReactDOM.render, string refs, defaultProps on functions and legacy context, then adopt new APIs gradually.' }],
  summary: ['Actions + form action', 'useActionState, useOptimistic, useFormStatus', 'use(promise | context)', 'ref as prop, Context as provider', 'Activity, useEffectEvent (19.2)', 'Compiler = auto memoization'],
  quiz: [
    { q: 'Which hook gives pending state to a button inside a form?', options: ['useTransition', 'useFormStatus', 'useId', 'useRef'], answer: 1, why: 'useFormStatus reads the parent form.' },
    { q: 'Do you need forwardRef in React 19 function components?', options: ['Yes always', 'No, ref is a prop', 'Only for inputs'], answer: 1, why: 'ref is passed as a normal prop.' },
  ],
});

HUB.guide({
  id: 'forms', area: 'React', title: 'Forms in React: controlled, uncontrolled, validation and React Hook Form', level: 'Beginner → Senior', time: '45 min',
  intro: 'Build forms that are correct, fast and accessible: controlled vs uncontrolled inputs, validation strategies, React Hook Form with zod, server errors, dynamic fields and React 19 form actions.',
  related: 'form validation controlled uncontrolled React Hook Form',
  prereq: ['State and events', 'HTML form elements and labels'],
  concepts: [
    { h: 'Controlled inputs', lv: 'Easy', html: `<p>Value in React state + <code>onChange</code>. Easy to validate and transform live; one render per keystroke.</p>`,
      code: `const [email, setEmail] = useState('')
<input value={email} onChange={e => setEmail(e.target.value)} />` },
    { h: 'Uncontrolled inputs', lv: 'Easy', html: `<p>The DOM keeps the value; read it on submit with <code>FormData</code> or refs. Less code and fewer renders. File inputs are always uncontrolled.</p>`,
      code: `function onSubmit(e) { e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget)); save(data) }` },
    { h: 'Validation strategy', lv: 'Medium', html: `<p>Validate on submit first, then on blur or change after the first error; show errors next to fields; disable submit while sending; always validate again on the server. Use native constraints for basics.</p>` },
    { h: 'React Hook Form + zod', lv: 'Medium', html: `<p>Uncontrolled by default (minimal re-renders), schema validation, typed data, easy error handling.</p>`,
      code: `const schema = z.object({ email: z.string().email('Enter a valid email'), age: z.coerce.number().min(18) })
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })
<form onSubmit={handleSubmit(save)} noValidate>
  <label htmlFor="email">Email</label>
  <input id="email" {...register('email')} aria-invalid={!!errors.email} />
  {errors.email && <p role="alert">{errors.email.message}</p>}
  <button disabled={isSubmitting}>Save</button>
</form>` },
    { h: 'Server errors and dynamic fields', lv: 'Hard', html: `<p>Map 422 field errors to inputs with <code>setError</code>; use <code>useFieldArray</code> for repeating groups; <code>watch</code>/<code>useWatch</code> for dependent fields.</p>` },
    { h: 'Accessibility', lv: 'Medium', html: `<p>Every input has a <code>&lt;label&gt;</code>; errors linked with <code>aria-describedby</code> and announced (<code>role="alert"</code>); focus the first invalid field on submit; don't rely on colour alone.</p>` },
  ],
  mistakes: ['Switching an input between controlled and uncontrolled', 'Validating only on the client', 'Inputs without labels', 'Putting every keystroke in global state', 'No pending state, causing double submits'],
  qa: [
    { q: 'Controlled vs uncontrolled components?', a: 'Controlled: value in React state with onChange, good for live validation and dependent UI. Uncontrolled: DOM holds the value, read on submit; simpler and faster for large forms.' },
    { q: 'Why React Hook Form?', a: 'Minimal re-renders (uncontrolled), built-in validation and schema resolvers, field arrays, TypeScript support and a small API.' },
  ],
  scenarios: [{ q: 'A large form lags while typing.', a: 'Every keystroke re-renders the whole form. Switch to React Hook Form or isolate field state, and subscribe narrowly with useWatch.' }],
  exercises: [{ lv: 'Easy', task: 'Build a login form that disables the button and shows a server error message on failure.', hint: 'Track status and error in state.',
    solution: `function Login() {
  const [status, setStatus] = useState('idle'), [error, setError] = useState('')
  async function onSubmit(e) {
    e.preventDefault(); setStatus('submitting'); setError('')
    try { await login(Object.fromEntries(new FormData(e.currentTarget))); setStatus('done') }
    catch (err) { setError(err.message); setStatus('idle') }
  }
  return <form onSubmit={onSubmit}>
    <label>Email <input name="email" type="email" required /></label>
    <label>Password <input name="password" type="password" required /></label>
    {error && <p role="alert">{error}</p>}
    <button disabled={status === 'submitting'}>{status === 'submitting' ? 'Signing in…' : 'Sign in'}</button>
  </form>
}`, explain: 'Uncontrolled inputs + FormData keep it simple; the status prevents double submits.' }],
  followups: [{ q: 'How do React 19 form actions change forms?', a: 'You can pass an async function to <form action>, read FormData directly, and use useActionState/useFormStatus for results and pending state.' }],
  summary: ['Controlled = state; uncontrolled = DOM/FormData', 'Validate on submit, then blur/change; server too', 'RHF + zod for real apps', 'Map server errors to fields', 'Labels, aria-invalid, role="alert"'],
  quiz: [
    { q: 'Which input is always uncontrolled?', options: ['text', 'checkbox', 'file', 'select'], answer: 2, why: 'Its value can only be set by the user.' },
    { q: 'Where must validation also happen?', options: ['Only CSS', 'On the server', 'In localStorage', 'Nowhere else'], answer: 1, why: 'Client validation can be bypassed.' },
  ],
});

HUB.guide({
  id: 'react-router', area: 'React', title: 'React Router v7: routes, layouts, data loading and protection', level: 'Beginner → Senior', time: '40 min',
  intro: 'Client-side routing done right: route config, nested layouts with Outlet, params and search params, navigation, loaders and actions, protected routes, lazy routes and 404s.',
  related: 'React Router route navigate useParams',
  prereq: ['Components', 'URLs, paths and query strings'],
  concepts: [
    { h: 'Setup and route objects', lv: 'Easy', html: `<p>Create a router with route objects and render <code>RouterProvider</code>. Import from <code>react-router</code> in v7.</p>`,
      code: `const router = createBrowserRouter([
  { path: '/', Component: Layout, children: [
    { index: true, Component: Home },
    { path: 'users/:id', Component: UserPage, loader: ({ params }) => getUser(params.id) },
    { path: '*', Component: NotFound },
  ] },
])
createRoot(root).render(<RouterProvider router={router} />)` },
    { h: 'Layouts with Outlet', lv: 'Easy', html: `<p>Parent routes render shared layout and an <code>&lt;Outlet /&gt;</code> where the child appears.</p>` },
    { h: 'Params, search params and navigation', lv: 'Medium', html: `<p><code>useParams()</code> for <code>/users/:id</code>; <code>useSearchParams()</code> for filters (shareable URLs); <code>&lt;Link&gt;</code>/<code>&lt;NavLink&gt;</code> and <code>useNavigate()</code> for navigation; <code>replace</code> to avoid history entries.</p>` },
    { h: 'Loaders and actions', lv: 'Medium', html: `<p>Loaders fetch data before the route renders (no effect waterfalls); actions handle form submissions; <code>useLoaderData</code>, <code>useNavigation</code> for pending UI, <code>useFetcher</code> for in-place mutations.</p>` },
    { h: 'Protected routes', lv: 'Medium', html: `<p>A layout route that checks auth and redirects, or a loader that throws <code>redirect('/login')</code>. Real protection is on the server.</p>`,
      code: `function RequireAuth() {
  const { user } = useAuth(), location = useLocation()
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}` },
    { h: 'Lazy routes and framework mode', lv: 'Hard', html: `<p>Route <code>lazy</code> splits code per route. Framework mode (formerly Remix) adds SSR, pre-rendering and type generation. Hosting a BrowserRouter SPA needs an SPA fallback to index.html.</p>` },
  ],
  mistakes: ['Using v5 APIs (Switch, useHistory, Redirect) in new code', 'Keeping filters in state instead of the URL', 'Fetching in effects inside every route (waterfalls)', 'No 404 route', 'Forgetting server rewrites for BrowserRouter'],
  qa: [
    { q: 'How do nested routes work?', a: 'Child routes render inside the parent layout\'s <Outlet />, so shared UI (nav, sidebar) stays mounted.' },
    { q: 'useNavigate vs Link?', a: 'Link for user-clickable navigation (accessible anchor); useNavigate for programmatic navigation after actions.' },
  ],
  scenarios: [{ q: 'Refreshing /dashboard on the live server gives 404.', a: 'The server looks for a file at that path. Configure an SPA fallback (all routes → index.html) or use HashRouter.' }],
  exercises: [{ lv: 'Medium', task: 'Keep a product list\'s category and page in the URL.', hint: 'useSearchParams.',
    solution: `function Products() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? 'all', page = Number(params.get('page') ?? 1)
  const { data } = useQuery({ queryKey: ['products', category, page], queryFn: () => getProducts({ category, page }) })
  return <>
    <select value={category} onChange={e => setParams({ category: e.target.value, page: '1' })}>{/* options */}</select>
    <button onClick={() => setParams({ category, page: String(page + 1) })}>Next</button>
  </>
}`, explain: 'The URL becomes the source of truth: shareable, bookmarkable and preserved on refresh.' }],
  followups: [{ q: 'v5 → v6/v7 changes?', a: 'Switch → Routes, useHistory → useNavigate, Redirect → Navigate/redirect, nested routes with Outlet, relative paths, data APIs.' }],
  summary: ['createBrowserRouter + RouterProvider', 'Layouts with Outlet', 'useParams, useSearchParams, useNavigate', 'Loaders/actions avoid waterfalls', 'Protected layout routes; server enforces', 'SPA fallback when hosting'],
  quiz: [{ q: 'Where does a child route render?', options: ['In <Outlet />', 'At the bottom of body', 'In a portal', 'Nowhere'], answer: 0, why: 'Outlet marks the child position.' }],
});

HUB.guide({
  id: 'redux-toolkit', area: 'State & data', title: 'Redux Toolkit and RTK Query from basic to advanced', level: 'Intermediate → Senior', time: '55 min',
  intro: 'Modern Redux: store setup, slices, selectors, thunks, entity adapters, listener middleware, RTK Query caching and invalidation, typed hooks and large-app structure.',
  related: 'Redux Toolkit createSlice RTK Query',
  prereq: ['Immutability', 'Reducers (useReducer)', 'Context vs global state'],
  concepts: [
    { h: 'Why Redux and the data flow', lv: 'Easy', html: `<p>One store for global client state; UI dispatches actions → reducers compute new state → subscribed components re-render. Predictable and debuggable (DevTools, time travel).</p>` },
    { h: 'configureStore and createSlice', lv: 'Easy', html: `<p>A slice holds state, reducers ("mutating" code via Immer) and generated actions.</p>`,
      code: `const cartSlice = createSlice({
  name: 'cart', initialState: { items: [] },
  reducers: {
    added(state, action) { state.items.push(action.payload) },
    removed(state, action) { state.items = state.items.filter(i => i.id !== action.payload) },
  },
})
export const { added, removed } = cartSlice.actions
export const store = configureStore({ reducer: { cart: cartSlice.reducer } })
// <Provider store={store}><App /></Provider>` },
    { h: 'Reading and writing from components', lv: 'Easy', html: `<p><code>useSelector</code> reads the smallest piece needed; <code>useDispatch</code> sends actions. Memoize derived data with <code>createSelector</code>.</p>` },
    { h: 'Async: createAsyncThunk', lv: 'Medium', html: `<p>Dispatches pending/fulfilled/rejected; handle in <code>extraReducers</code>. Use for non-cache async workflows.</p>` },
    { h: 'RTK Query for server data', lv: 'Medium', html: `<p>Endpoints generate hooks with caching, deduplication, polling and tag-based invalidation.</p>`,
      code: `export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), tagTypes: ['Order'],
  endpoints: b => ({
    getOrders: b.query({ query: () => 'orders', providesTags: ['Order'] }),
    addOrder: b.mutation({ query: body => ({ url: 'orders', method: 'POST', body }), invalidatesTags: ['Order'] }),
  }),
})
export const { useGetOrdersQuery, useAddOrderMutation } = api` },
    { h: 'Normalization and entity adapters', lv: 'Hard', html: `<p>Store collections as <code>{ ids, entities }</code> with <code>createEntityAdapter</code> for O(1) lookups and targeted updates.</p>` },
    { h: 'Listener middleware and large apps', lv: 'Hard', html: `<p>Listener middleware for reactive side effects (autosave, debounce, websockets). Large apps: feature folders, <code>combineSlices().inject</code> for lazy slices, <code>injectEndpoints</code>, typed hooks with <code>withTypes</code>.</p>` },
  ],
  mistakes: ['Mutating state outside Immer', 'Storing server cache by hand in slices', 'Selectors returning new arrays each call', 'Non-serializable values in state', 'Putting every form keystroke in Redux'],
  qa: [
    { q: 'Redux vs Redux Toolkit?', a: 'RTK is the official way to write Redux: configureStore, createSlice with Immer, createAsyncThunk, entity adapters, listener middleware and RTK Query, with far less boilerplate.' },
    { q: 'RTK Query vs createAsyncThunk?', a: 'RTK Query for fetching and caching server data with invalidation; thunks for custom async workflows that aren\'t cache-shaped.' },
  ],
  scenarios: [{ q: 'After adding an order, the list does not update.', a: 'The mutation doesn\'t invalidate the tag the list provides. Add invalidatesTags: ["Order"] (or patch the cache).' }],
  exercises: [{ lv: 'Medium', task: 'Write a memoized selector for the cart total.', hint: 'createSelector with an input selector.',
    solution: `const selectItems = state => state.cart.items
export const selectTotal = createSelector([selectItems], items => items.reduce((t, i) => t + i.price * i.qty, 0))`, explain: 'Recomputes only when items changes; components get a stable value.' }],
  followups: [{ q: 'When would you not use Redux?', a: 'Small apps, mostly local state, or when server data is the main concern (TanStack Query) and little global client state remains.' }],
  summary: ['configureStore + createSlice', 'useSelector small, createSelector for derived', 'Thunks for workflows', 'RTK Query for server data + tags', 'Normalize with entity adapters', 'Listener middleware; lazy slices'],
  quiz: [{ q: 'What lets RTK reducers "mutate" safely?', options: ['Immer', 'Reselect', 'Thunk', 'DevTools'], answer: 0, why: 'Immer produces immutable updates from draft mutations.' }],
});
