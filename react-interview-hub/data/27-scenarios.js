/* Production scenarios. src says where each one comes from:
   'Original practice scenario' = written for this hub (hypothetical, not a claim that a company asked it).
   'Commonly discussed' = recurring topic in 2026 interview-prep sources (see the Sources list on the Study page). */
(function () {
  const S = (q, k, a, src, sc) => ({ lv: 'Scenario', q, k, a, src, sc });
  HUB.add({
    id: 'scenarios', title: 'Real-time production scenarios', short: 'Scenarios',
    blurb: 'Debugging and design questions in interview format: context, root causes, debugging steps, fix, code, trade-offs, prevention and follow-ups. Practise them one at a time in the Voice coach (Interview me → Scenarios).',
    items: [
S(`An API is being called twice. How would you investigate?`,
  `The helper went to the shop twice for the same toy. Find out who sent them the second time.`,
  `First I'd check whether it's development-only: React StrictMode intentionally mounts components twice, so effects run twice in dev. Then I look at the Network tab's initiator stack, check effect dependencies for objects or functions recreated each render, components mounted in two places, and parent re-mounts caused by changing keys. The fix is to move fetching into a cache library like TanStack Query (dedupes requests) or add proper cleanup with AbortController, and to stabilise dependencies.`,
  'Commonly discussed',
  { ctx: `The Network tab shows two identical GET requests on page load, or one per keystroke/render.`,
    causes: ['StrictMode double mount in development (expected)', 'Effect dependency is an object/array/function recreated every render', 'Component rendered twice (duplicate in layout, two routes) or remounted because its key changes', 'Two components fetching the same data independently', 'Form submit plus button onClick both firing', 'Retry logic in both Axios interceptor and React Query'],
    debug: ['Reproduce in a production build to rule out StrictMode', 'Network tab → Initiator column to see the call stack', 'React DevTools: highlight renders, check if the component mounts twice', 'Log effect runs with dependency values', 'Search the codebase for other callers of the endpoint'],
    fix: `Use a server-state cache (TanStack Query/RTK Query) so identical requests share one cache entry and in-flight requests are deduplicated; stabilise dependencies (primitives, useMemo); add cleanup that aborts stale requests.`,
    code: `useEffect(() => {
  const ctrl = new AbortController()
  getUser(userId, { signal: ctrl.signal }).then(setUser).catch(e => { if (e.name !== 'AbortError') setError(e) })
  return () => ctrl.abort()          // StrictMode's second run aborts the first request
}, [userId])                          // primitive dependency, not an object

// Better: const { data } = useQuery({ queryKey: ['user', userId], queryFn: ({ signal }) => getUser(userId, { signal }) })`,
    alt: `Disabling StrictMode hides the symptom and is not a fix. A module-level "in-flight" map also dedupes but re-implements a cache.`,
    prevent: `Lint rule react-hooks/exhaustive-deps, fetch through a shared query layer, and an E2E check counting requests on key pages.`,
    follow: ['Why does StrictMode run effects twice?', 'How does TanStack Query deduplicate requests?', 'Is a duplicate GET harmful? What about a duplicate POST?'] }),
S(`A React dashboard becomes slow when thousands of records load. What do you do?`,
  `Too many toys on the table at once, and the helper redraws all of them each time one changes.`,
  `I'd measure first with the React Profiler and the Performance panel to see whether the cost is rendering, data processing or the DOM size. Usually the fixes are: paginate or virtualize the list so only visible rows are in the DOM, memoize expensive derived data, keep row components stable with React.memo and stable props, move filtering/sorting to the server or a Web Worker for heavy work, and avoid putting fast-changing state high in the tree.`,
  'Commonly discussed',
  { ctx: `Typing in a filter box lags; scrolling stutters; INP is poor; memory grows.`,
    causes: ['Rendering thousands of DOM rows', 'Re-sorting/filtering on every render', 'State lifted too high: every keystroke re-renders the whole table', 'Unstable props break React.memo', 'Heavy cells (charts, tooltips) per row'],
    debug: ['React DevTools Profiler: which components render and why', 'Performance panel: long tasks, layout/paint cost', 'Count DOM nodes', 'Check Web Vitals INP in production RUM'],
    fix: `Virtualize (TanStack Virtual / react-window), server-side pagination and filtering, useMemo for derived rows, React.memo rows with stable callbacks, useDeferredValue for the filter text, keep input state local.`,
    code: `const deferredQuery = useDeferredValue(query)
const visibleRows = useMemo(() => rows.filter(r => r.name.includes(deferredQuery)), [rows, deferredQuery])
const virtualizer = useVirtualizer({ count: visibleRows.length, getScrollElement: () => parentRef.current, estimateSize: () => 40 })`,
    alt: `Infinite scroll vs numbered pages (pages are better for tables users scan). Web Workers for heavy aggregation. Canvas/grid libraries (AG Grid) for spreadsheet-like needs.`,
    prevent: `Performance budgets, Profiler checks on PRs touching tables, RUM monitoring of INP.`,
    follow: ['How does virtualization work?', 'When does React.memo make things worse?', 'What is useDeferredValue vs debounce?'] }),
S(`A search field sends too many API requests. How do you fix it?`,
  `Don't ask the shop after every letter; wait until the kid stops typing, and cancel old questions.`,
  `Debounce the input (about 300 ms) so we only search after the user pauses, skip empty or too-short queries, cancel the previous request with AbortController so stale responses can't overwrite new ones, and cache results by query key with TanStack Query so repeated searches are instant. On the server side, rate limiting protects the API.`,
  'Commonly discussed',
  { ctx: `Every keystroke fires a request; the API returns 429; results flicker.`,
    causes: ['Fetching in onChange or in an effect on every character', 'No cancellation', 'No caching of previous queries'],
    debug: ['Network tab while typing', 'Check for 429 responses', 'Check result order versus input'],
    fix: `Debounced value + query keyed by the debounced term + abort signal + keepPreviousData to avoid flicker.`,
    code: `function useDebounce(value, delay = 300) {
  const [v, setV] = useState(value)
  useEffect(() => { const t = setTimeout(() => setV(value), delay); return () => clearTimeout(t) }, [value, delay])
  return v
}
const term = useDebounce(input.trim())
const { data } = useQuery({
  queryKey: ['search', term],
  queryFn: ({ signal }) => searchApi(term, { signal }),
  enabled: term.length >= 2,
  placeholderData: keepPreviousData,
})`,
    alt: `Throttle (regular updates while typing) for live suggestions; search on Enter for expensive searches.`,
    prevent: `Shared useDebounce hook, lint review of effects, API rate limits and monitoring.`,
    follow: ['Debounce vs throttle?', 'How do you avoid race conditions?', 'How would you test the debounce?'] }),
S(`Multiple requests return in the wrong order and the UI shows old results. How do you fix it?`,
  `You asked twice, and the first answer arrived last and covered the newest one.`,
  `This is a race condition. The fix is to make sure only the latest request can update state: abort the previous request in the effect cleanup, or ignore responses whose request id/term no longer matches. Libraries like TanStack Query key results by the query parameters, so an old response can't overwrite the current query.`,
  'Commonly discussed',
  { ctx: `Typing "react" shows results for "rea" because that slower response arrived last.`,
    causes: ['No cancellation or ignore flag', 'Shared state written by multiple in-flight requests'],
    debug: ['Throttle network in DevTools to reproduce', 'Log request id and response order'],
    fix: `AbortController per request, or an "ignore" flag in cleanup; or query-key based caching.`,
    code: `useEffect(() => {
  let ignore = false
  fetchResults(term).then(r => { if (!ignore) setResults(r) })
  return () => { ignore = true }
}, [term])`,
    alt: `Sequence numbers (latest wins), switchMap in RxJS, createAsyncThunk with requestId checks.`,
    prevent: `Test with delayed mocked responses (MSW delay), code review of effects.`,
    follow: ['Ignore flag vs AbortController?', 'How does Redux Toolkit help here?'] }),
S(`A component displays stale data after navigation. Why, and how do you fix it?`,
  `You came back to the room and saw yesterday's toys, because nobody checked the shop again.`,
  `Common causes are state initialised from props only once (useState(props.x)), a component reused by the router so it doesn't remount when the id changes, missing effect dependencies, or a cache that's never invalidated after a mutation. I fix it by deriving from props instead of copying, keying the component by id, correcting dependencies, and invalidating the relevant queries after mutations.`,
  'Original practice scenario',
  { ctx: `Going from /users/1 to /users/2 still shows user 1; after editing, the list shows the old name.`,
    causes: ['useState initialised from props and never updated', 'Same component instance reused across params', 'Effect missing userId dependency', 'No invalidation after mutation', 'staleTime too long'],
    debug: ['Check React DevTools props vs state', 'Inspect query cache in React Query DevTools', 'Verify effect dependencies'],
    fix: `Use props directly or key the component; query keys include the id; invalidate after mutations.`,
    code: `<UserForm key={userId} user={user} />   // resets local form state when the id changes
useQuery({ queryKey: ['user', userId], queryFn: () => getUser(userId) })
useMutation({ mutationFn: saveUser, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }) })`,
    alt: `setQueryData with the server response for instant updates.`,
    prevent: `Lint exhaustive-deps, query key factories, E2E test navigating between ids.`,
    follow: ['Why is copying props into state an anti-pattern?', 'staleTime vs gcTime?'] }),
S(`A component re-renders even though its visible data has not changed. How do you investigate?`,
  `The brick keeps redrawing the same picture because someone keeps handing it "new-looking" instructions.`,
  `Re-renders happen when state changes, the parent re-renders, or a consumed context changes. I use the Profiler's "why did this render" to find the cause, then fix the source: move state down, split context, pass stable props (memoized objects and callbacks) to memoized children, or let the React Compiler handle memoization. I only optimise when renders are actually expensive.`,
  'Commonly discussed',
  { ctx: `A chart or list re-renders on every keystroke elsewhere in the page.`,
    causes: ['Parent re-renders and child is not memoized', 'Inline objects/functions as props', 'Large context value changing often', 'Selector returning new objects (Redux)'],
    debug: ['React DevTools → Profiler → "Record why each component rendered"', 'Highlight updates when components render', 'Check context consumers'],
    fix: `Colocate state, React.memo + useMemo/useCallback, split contexts, memoized selectors, React Compiler.`,
    code: `const Chart = memo(function Chart({ points, onSelect }) { /* ... */ })
const points = useMemo(() => toPoints(data), [data])
const onSelect = useCallback(id => setSelected(id), [])
<Chart points={points} onSelect={onSelect} />`,
    alt: `Composition (pass children) so the expensive child isn't re-created by the parent.`,
    prevent: `React Compiler, Profiler checks in performance reviews.`,
    follow: ['Does a re-render always update the DOM?', 'When does memo hurt performance?'] }),
S(`A memory leak appears after navigating between pages. How do you find and fix it?`,
  `Toys keep running in rooms you've already left.`,
  `Typical leaks in React are effects without cleanup: intervals, event listeners, subscriptions, WebSockets, observers, or async callbacks holding large data. I reproduce by navigating back and forth, take heap snapshots in Chrome DevTools, compare retained objects and detached DOM nodes, then add cleanup functions, abort requests and unsubscribe on unmount.`,
  'Commonly discussed',
  { ctx: `Memory grows each navigation; timers fire for unmounted components; app slows over time.`,
    causes: ['setInterval/addEventListener without cleanup', 'WebSocket or store subscriptions not closed', 'Global caches growing forever', 'Closures holding large arrays', 'Third-party widgets not destroyed'],
    debug: ['Memory panel: heap snapshots before/after N navigations, compare', 'Look for detached DOM nodes', 'Performance monitor: JS heap and listener count'],
    fix: `Return cleanup from every effect that subscribes; abort fetches; destroy third-party instances; bound caches (LRU, WeakMap).`,
    code: `useEffect(() => {
  const id = setInterval(poll, 5000)
  const onResize = () => setWidth(innerWidth)
  window.addEventListener('resize', onResize)
  const socket = new WebSocket(url)
  return () => { clearInterval(id); window.removeEventListener('resize', onResize); socket.close() }
}, [url])`,
    alt: `Move subscriptions into a store/listener middleware that manages lifecycle centrally.`,
    prevent: `StrictMode (exposes missing cleanup), code review checklist, periodic memory profiling.`,
    follow: ['What is a detached DOM node?', 'How does StrictMode help find leaks?'] }),
S(`A user sees another company's data in a multi-tenant application. What happened and what do you do?`,
  `A visitor saw another family's toys because the shelves weren't labelled by family.`,
  `First treat it as a security incident: the backend must enforce tenant isolation on every query, so I'd check the API's authorization (object-level checks using the tenant from the token, never from client input). On the frontend, typical causes are caches not scoped by tenant, state not cleared on logout or tenant switch, or CDN caching of personalised responses. Fix both layers: server-side tenant checks, tenant id in query keys, clear caches on switch/logout, and Cache-Control: private/no-store for user data.`,
  'Original practice scenario',
  { ctx: `After switching organisation (or after another user logged in on the same browser) the old company's data appears.`,
    causes: ['API trusts a tenantId from the client', 'React Query/Redux cache not cleared on tenant switch/logout', 'Query keys missing tenantId', 'Shared CDN cache of authenticated responses', 'Service worker caching API responses'],
    debug: ['Reproduce with two accounts', 'Inspect cache keys and stored state', 'Check response headers and CDN rules', 'Audit backend authorization logs'],
    fix: `Server: enforce tenant scoping from the auth token. Client: include tenantId in keys, queryClient.clear() / reset store on switch and logout, no caching of private responses.`,
    code: `function switchTenant(id) {
  queryClient.clear()
  store.dispatch(resetAll())
  setActiveTenant(id)
}
useQuery({ queryKey: ['tenant', tenantId, 'invoices'], queryFn: () => getInvoices(tenantId) })`,
    alt: `Separate subdomains per tenant to isolate storage and cookies.`,
    prevent: `Automated tests with two tenants, security reviews, OWASP API Top 10 (broken object level authorization).`,
    follow: ['Why is frontend filtering not a security control?', 'What is IDOR / BOLA?'] }),
S(`A token expires while multiple API requests are running. How do you handle it?`,
  `Ten letters come back saying "wristband expired"; get one new wristband, then resend all ten.`,
  `In the API client's response interceptor, on the first 401 I start a single refresh request and store its promise; other failed requests wait on the same promise, then all retry with the new token. A retry flag prevents loops, and if refresh fails I log the user out and clear caches. Sending ten refresh calls at once can break refresh-token rotation and log the user out.`,
  'Commonly discussed',
  { ctx: `Dashboard loads 8 widgets right as the access token expires; some fail, user is logged out randomly.`,
    causes: ['Each 401 triggers its own refresh', 'Refresh token rotation invalidates parallel refreshes', 'No retry of the original request'],
    debug: ['Network tab: multiple /auth/refresh calls', 'Check server logs for refresh token reuse detection'],
    fix: `Single-flight refresh with a shared promise and _retry guard.`,
    code: `let refreshing = null
api.interceptors.response.use(r => r, async err => {
  const original = err.config
  if (err.response?.status === 401 && !original._retry) {
    original._retry = true
    refreshing ??= refreshToken().finally(() => { refreshing = null })
    try { await refreshing; return api(original) } catch { logout(); throw err }
  }
  throw err
})`,
    alt: `Proactive refresh before expiry (timer based on exp), or cookie sessions handled by a BFF.`,
    prevent: `Tests with MSW returning 401 for parallel requests; monitoring of forced logouts.`,
    follow: ['Where do you store tokens?', 'What is refresh token rotation?'] }),
S(`A file upload fails halfway through. How would you design a reliable upload?`,
  `A big parcel got lost halfway; send it in small boxes so you only resend the missing ones.`,
  `For large files I'd use chunked or resumable uploads: upload directly to storage with pre-signed URLs (often multipart), track progress per chunk, retry failed chunks with backoff, allow pause/resume and cancel, and validate type and size before starting. The UI shows progress, errors and a retry button, and the server verifies and assembles the file.`,
  'Original practice scenario',
  { ctx: `Large uploads on slow networks fail near the end and restart from zero.`,
    causes: ['Single huge request with timeouts', 'Proxy/body size limits', 'Network drop with no resume', 'Token expiry mid-upload'],
    debug: ['Network tab: failure point, status code', 'Server/proxy limits (413)', 'Upload on throttled network'],
    fix: `Pre-signed multipart upload (e.g. S3), per-part retry, resume using uploaded part list, progress UI.`,
    code: `await api.post(url, formData, {
  onUploadProgress: e => setProgress(Math.round((e.loaded * 100) / (e.total ?? 1))),
  signal: ctrl.signal,
})`,
    alt: `tus protocol libraries for resumable uploads; background upload with service worker.`,
    prevent: `Client-side size/type checks, tests on throttled networks, monitoring failure rates.`,
    follow: ['How do pre-signed URLs work?', 'How do you show accurate progress?'] }),
S(`A large PDF makes the application unresponsive. What do you do?`,
  `Reading a giant book all at once freezes the helper; read a few pages at a time in another room.`,
  `Rendering a big PDF on the main thread blocks the UI. I'd render lazily, page by page (only visible pages, virtualized), use PDF.js with its worker so parsing happens off the main thread, render thumbnails at low resolution, stream/range-request the file, and for very large documents consider server-side conversion to images or pre-split pages.`,
  'Original practice scenario',
  { ctx: `Opening a 300-page signed contract freezes the tab; memory spikes.`,
    causes: ['All pages rendered at once to canvas', 'Parsing on main thread', 'High-resolution rendering', 'Whole file loaded before display'],
    debug: ['Performance panel long tasks', 'Memory panel', 'Count canvases'],
    fix: `PDF.js worker, virtualized page list with IntersectionObserver, render-on-demand, cleanup of page objects when out of view.`,
    code: `pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl
const doc = await pdfjsLib.getDocument({ url, rangeChunkSize: 65536 }).promise
// render only pages near the viewport; call page.cleanup() when they leave`,
    alt: `Server-side rendering to images, or the browser's built-in PDF viewer in an iframe for read-only viewing.`,
    prevent: `Test with large fixtures, performance budgets.`,
    follow: ['What are Web Workers?', 'How does IntersectionObserver help?'] }),
S(`A production deployment breaks an existing feature. How do you respond and prevent it?`,
  `A new toy broke an old one; put the old toy back first, then find out why.`,
  `First reduce impact: roll back or turn off the feature flag, and communicate. Then investigate with error monitoring (Sentry with source maps), logs and the release diff; reproduce in staging; write a failing test; fix and redeploy. Prevention: automated tests on critical paths, preview deployments, feature flags, canary releases, and a post-incident review without blame.`,
  'Commonly discussed',
  { ctx: `After a release, checkout or login fails for some users.`,
    causes: ['Untested change or dependency upgrade', 'API contract change between frontend and backend', 'Environment/config difference', 'Cached old JS chunks referencing removed files'],
    debug: ['Error tracking by release version', 'Compare release diff', 'Check browser/device segment', 'Check for chunk load errors'],
    fix: `Rollback/feature flag, hotfix with test, handle ChunkLoadError by reloading.`,
    code: `window.addEventListener('vite:preloadError', () => window.location.reload())`,
    alt: `Blue/green deployment, canary rollout by percentage.`,
    prevent: `CI with unit + E2E smoke tests, contract tests, staged rollouts, release checklist.`,
    follow: ['How do source maps help?', 'What would you put in the post-mortem?'] }),
S(`A Playwright test passes locally but fails in CI. How do you debug it?`,
  `The robot passes on your computer but fails on the school computer; find what's different there.`,
  `I'd open the CI trace (trace viewer on retry), screenshots and video to see the real failure. Common causes are timing (fixed waits instead of web-first assertions), test data shared between parallel workers, different viewport/locale/timezone, slower CI machines, missing environment variables, and order-dependent tests. Fixes: auto-waiting assertions, isolated data per test, consistent config, and no hard sleeps.`,
  'Commonly discussed',
  { ctx: `Test is green locally, red or flaky in GitHub Actions.`,
    causes: ['page.waitForTimeout instead of expect(...).toBeVisible()', 'Shared accounts/data across workers', 'Different screen size, fonts, timezone, locale', 'Real network/third-party calls', 'Tests depending on order'],
    debug: ['trace: "on-first-retry" and open the trace', 'Run with --workers=1 to test isolation', 'Run in the same Docker image as CI', 'Compare env vars'],
    fix: `Web-first assertions, per-test data via API fixtures, mock third parties with page.route, pin viewport/locale/timezone in config.`,
    code: `// playwright.config.js
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  use: { trace: 'on-first-retry', locale: 'en-IN', timezoneId: 'Asia/Kolkata', viewport: { width: 1280, height: 800 } },
})
// test
await page.getByRole('button', { name: 'Save' }).click()
await expect(page.getByText('Saved')).toBeVisible()   // auto-waits`,
    alt: `Quarantine flaky tests temporarily with tracking, not silently.`,
    prevent: `Lint rules against waitForTimeout, test data factories, run tests in parallel locally too.`,
    follow: ['How do fixtures work?', 'How do you handle authentication in Playwright tests?'] }),
S(`A page remains slow even after implementing SSR. Why?`,
  `The sandwich arrives ready, but you still can't eat it until the batteries are installed.`,
  `SSR improves first paint but not everything: the server may be slow (waterfall data fetching, no caching), the HTML may be huge, and the page may be non-interactive until a large JavaScript bundle hydrates. I'd measure TTFB, LCP and INP separately, then parallelise and cache server data, stream with Suspense, reduce client JS (Server Components, code splitting), and optimise images and fonts.`,
  'Commonly discussed',
  { ctx: `Lighthouse shows slow TTFB or poor INP; page looks ready but clicks don't respond.`,
    causes: ['Sequential data fetching on the server', 'No caching/CDN', 'Large hydration bundle', 'Heavy third-party scripts', 'Unoptimised LCP image'],
    debug: ['Measure TTFB vs LCP vs INP', 'Server timing headers', 'Bundle analyzer', 'Performance panel for hydration cost'],
    fix: `Parallel fetches, caching/ISR, streaming + Suspense boundaries, Server Components, lazy client components, priority LCP image.`,
    code: `const [user, orders] = await Promise.all([getUser(id), getOrders(id)])   // instead of sequential awaits`,
    alt: `SSG/ISR for content that doesn't change per request.`,
    prevent: `Performance budgets and RUM per route.`,
    follow: ['What is hydration?', 'What is streaming SSR?'] }),
S(`A React application has hydration errors. How do you fix them?`,
  `The picture drawn in the kitchen doesn't match the one drawn at home, so React complains.`,
  `Hydration errors mean the server HTML differs from the first client render. Typical causes: using window, localStorage, Date.now(), Math.random() or locale formatting during render; invalid HTML nesting (div inside p); browser extensions changing the DOM. Fix by rendering the same output on both sides, moving browser-only values into effects (two-pass rendering), using useId for ids, and formatting dates consistently (fixed timezone).`,
  'Commonly discussed',
  { ctx: `Console shows "Hydration failed because the server rendered HTML didn't match the client".`,
    causes: ['typeof window checks in render', 'Dates/times rendered in different time zones', 'Random ids', 'Invalid nesting', 'Extensions'],
    debug: ['React 19 shows a diff of mismatched content', 'Check the component named in the error'],
    fix: `useEffect to set client-only state, useId, consistent formatting, valid HTML; suppressHydrationWarning only for unavoidable cases like timestamps.`,
    code: `function LocalTime({ iso }) {
  const [text, setText] = useState(null)
  useEffect(() => setText(new Date(iso).toLocaleString()), [iso])
  return <time dateTime={iso}>{text ?? iso}</time>
}`,
    alt: `Render client-only components with dynamic import and ssr: false (Next.js).`,
    prevent: `Lint for window usage in render, test pages in a different timezone.`,
    follow: ['What is selective hydration?', 'Why use useId?'] }),
S(`A release introduces a major performance regression. How do you find and fix it?`,
  `The app got slower after the update; compare before and after to find the new heavy toy.`,
  `I'd confirm with RUM data per release and reproduce with Lighthouse/Performance panel on both versions. Then compare bundle sizes (bundle analyzer), dependency changes, and Profiler recordings to find new expensive renders or effects. Fix the cause, add a performance budget to CI so the same regression fails the build next time.`,
  'Original practice scenario',
  { ctx: `LCP or INP got worse right after a release.`,
    causes: ['Large new dependency or lost code splitting', 'New effect causing re-render loops', 'Unoptimised images', 'Synchronous third-party script'],
    debug: ['Compare bundle analyzer reports', 'Git bisect on a reproducible metric', 'Profiler and Performance panel'],
    fix: `Lazy-load heavy modules, remove/replace dependencies, fix render loops, optimise assets.`,
    code: `const ReportEditor = lazy(() => import('./ReportEditor'))`,
    alt: `Revert first if impact is large, then fix forward.`,
    prevent: `Lighthouse CI budgets, size-limit checks on bundles, RUM alerts.`,
    follow: ['Which Core Web Vital would this affect?', 'How do you set a performance budget?'] }),
S(`A component goes into an infinite render loop. What are the common causes?`,
  `The brick keeps changing its own instructions, so it redraws forever.`,
  `Usually state is set during render, an effect sets state that is also in its own dependency list, or an effect depends on an object/function recreated every render. I'd check the effects and handlers: call setState only in events/effects with correct dependencies, derive values instead of storing them, and stabilise object dependencies.`,
  'Commonly discussed',
  { ctx: `"Too many re-renders" or "Maximum update depth exceeded" errors; CPU spikes.`,
    causes: ['setState called directly in render', 'onClick={setOpen(true)} instead of onClick={() => setOpen(true)}', 'Effect updates state it depends on', 'Object/array dependency recreated each render'],
    debug: ['Read the error stack for the component', 'Log effect runs', 'Profiler'],
    fix: `Move setState into handlers/effects, use functional updates, derive state, stabilise dependencies.`,
    code: `// ❌ <button onClick={setOpen(true)}>   → calls on every render
<button onClick={() => setOpen(true)}>Open</button>
// ❌ useEffect(() => setFilters({ ...filters }), [filters])`,
    alt: `useMemo for derived values instead of effect + state.`,
    prevent: `exhaustive-deps lint, code review, React Compiler diagnostics.`,
    follow: ['When should you not use useEffect?'] }),
S(`A timer or polling component keeps running after it should stop. How do you build it correctly?`,
  `Alarm clocks must be switched off when you leave the room or press stop.`,
  `Store the interval id in a ref, start and stop it explicitly, always clear it in the effect cleanup, and use functional state updates so the callback doesn't read stale state. For data polling prefer React Query's refetchInterval, which stops automatically when the component unmounts.`,
  'Commonly discussed',
  { ctx: `A stopwatch keeps counting after unmount, speeds up after restart, or shows stale values. (React timer exercises are reported in 2026 interview guides.)`,
    causes: ['No clearInterval in cleanup', 'Starting a new interval without clearing the old one', 'Stale closure reading old state'],
    debug: ['Log interval ids', 'Check behaviour on restart and unmount'],
    fix: `Ref for the id, cleanup, functional updates.`,
    code: `function Stopwatch() {
  const [ms, setMs] = useState(0), [running, setRunning] = useState(false)
  useEffect(() => {
    if (!running) return
    const start = Date.now() - ms
    const id = setInterval(() => setMs(Date.now() - start), 50)
    return () => clearInterval(id)
  }, [running])   // eslint-disable-line react-hooks/exhaustive-deps
  return <>{(ms / 1000).toFixed(2)}s
    <button onClick={() => setRunning(r => !r)}>{running ? 'Stop' : 'Start'}</button>
    <button onClick={() => { setRunning(false); setMs(0) }}>Reset</button></>
}`,
    alt: `requestAnimationFrame for smooth visual updates.`,
    prevent: `Test unmount and restart paths with fake timers.`,
    follow: ['Why compute from Date.now() instead of counting ticks?', 'How would you test this with fake timers?'] }),
S(`A shopping cart must persist across navigation, sync with the server, support optimistic updates and work offline. How would you design it?`,
  `A basket that remembers everything, shows changes immediately, and catches up with the shop when the road opens.`,
  `I'd treat the server as the source of truth with a client cache: React Query (or RTK Query) for the cart, optimistic updates with rollback on add/remove, a persisted cache (localStorage/IndexedDB) for reloads, and an offline queue of mutations that replays when the browser comes back online, with conflict handling (server prices and stock win). Totals are derived, never stored, and checkout is never optimistic.`,
  'Commonly discussed',
  { ctx: `This style of question is reported as a 2026 state-management interview prompt in frontend interview guides.`,
    causes: ['Design question, no bug'],
    debug: ['Clarify requirements: guest vs logged-in carts, multi-device sync, stock rules'],
    fix: `Server cart + client cache + optimistic mutations + persisted queue + reconciliation.`,
    code: `useMutation({
  mutationFn: addToCart,
  onMutate: async item => {
    await queryClient.cancelQueries({ queryKey: ['cart'] })
    const prev = queryClient.getQueryData(['cart'])
    queryClient.setQueryData(['cart'], c => ({ ...c, items: [...c.items, item] }))
    return { prev }
  },
  onError: (_e, _v, ctx) => queryClient.setQueryData(['cart'], ctx.prev),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  networkMode: 'offlineFirst',
})`,
    alt: `Zustand/Redux with persist for guest carts, merged into the server cart on login.`,
    prevent: `Tests for offline/online transitions and price changes.`,
    follow: ['How do you merge a guest cart after login?', 'What if the price changed while offline?'] }),
    ],
  });
})();
