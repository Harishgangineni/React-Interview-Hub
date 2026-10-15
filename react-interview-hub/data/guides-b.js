HUB.guide({
  id: 'performance', title: 'React performance: re-renders, memoization, lists and Web Vitals', level: 'Intermediate → Senior', time: '60 min',
  intro: 'Find and fix slow React apps: what triggers renders, profiling, memo and the React Compiler, virtualization, code splitting, network and Core Web Vitals.',
  related: 'performance optimize re-render memo virtualization code splitting',
  prereq: ['Components, props and state', 'useMemo / useCallback basics', 'Browser DevTools', 'Bundlers (Vite/Webpack)'],
  concepts: [
    { h: 'What triggers a re-render', lv: 'Easy', html: `<p>A component re-renders when its <b>state</b> changes, its <b>parent</b> re-renders, or a <b>context</b> it reads changes. Re-rendering is not the same as updating the DOM; React commits only differences. Renders are usually cheap; slow renders are what matter.</p>` },
    { h: 'Measure first', lv: 'Easy', html: `<p>React DevTools <b>Profiler</b> (what rendered, why, how long), Chrome <b>Performance</b> panel (long tasks, layout, paint), <b>Lighthouse</b> and real-user <b>Core Web Vitals</b>: LCP (loading), INP (responsiveness), CLS (visual stability). Optimise the biggest measured problem.</p>` },
    { h: 'Keep state close to where it is used', lv: 'Medium', html: `<p>Lifting fast-changing state (input text, hover) to the top re-renders everything below. Move it down, or pass expensive parts as <code>children</code> so they aren't re-created.</p>`,
      code: `// The slow tree is created by the parent, so typing doesn't re-render it
function SearchLayout({ children }) {
  const [q, setQ] = useState('')
  return <><input value={q} onChange={e => setQ(e.target.value)} />{children}</>
}
<SearchLayout><ExpensiveDashboard /></SearchLayout>` },
    { h: 'React.memo, useMemo, useCallback', lv: 'Medium', html: `<p><code>memo</code> skips a child when props are shallowly equal; <code>useMemo</code> caches expensive values and stable object references; <code>useCallback</code> keeps function identity. They work together; memoizing everything adds cost and complexity. The <b>React Compiler</b> (1.0, Oct 2025) can insert memoization automatically.</p>` },
    { h: 'Context performance', lv: 'Medium', html: `<p>Every consumer re-renders when the context value changes. Memoize the value, split contexts by update frequency (state vs dispatch), or use a store with selectors (Zustand, Redux) for hot state.</p>` },
    { h: 'Large lists and tables', lv: 'Medium', html: `<p>Render only what is visible (virtualization with TanStack Virtual/react-window), paginate on the server, use stable keys, and keep row components memoized.</p>` },
    { h: 'Responsive input: transitions and deferred values', lv: 'Hard', html: `<p><code>useTransition</code> marks expensive updates as non-urgent; <code>useDeferredValue</code> renders a lagging copy so typing stays smooth. They improve INP without dropping work. Debounce is still the right tool for network calls.</p>` },
    { h: 'Ship less JavaScript', lv: 'Hard', html: `<p>Route-level <code>React.lazy</code> + Suspense, dynamic import for heavy libraries, bundle analysis (rollup-plugin-visualizer), tree-shakeable imports, replace heavy dependencies, Server Components to keep code on the server.</p>`,
      code: `const Reports = lazy(() => import('./Reports'))
<Suspense fallback={<Spinner />}><Reports /></Suspense>` },
    { h: 'Network and assets', lv: 'Hard', html: `<p>Cache server data (TanStack Query), avoid waterfalls (parallel requests, prefetch on hover/route), compress and size images (WebP/AVIF, srcset, lazy loading, priority for the LCP image), preload key fonts, CDN caching, HTTP caching headers.</p>` },
  ],
  mistakes: ['Optimising without measuring', 'Wrapping everything in useMemo/useCallback', 'Inline objects/functions passed to memoized children', 'Index keys in reorderable lists', 'Rendering thousands of rows', 'Giant context values', 'Debouncing renders instead of using transitions (or vice versa for network)', 'Ignoring bundle size and images'],
  qa: [
    { q: 'How do you optimise a slow React app?', a: 'Measure (Profiler, Performance panel, Web Vitals), then fix the biggest cause: colocate state, memoize expensive parts or enable the React Compiler, virtualize long lists, code-split routes and heavy libraries, cache and parallelise data fetching, optimise images and fonts, and use transitions for heavy updates.' },
    { q: 'When does React.memo make performance worse?', a: 'When props change on every render anyway (new objects/functions), the shallow comparison is wasted work; when the component is cheap to render; and when it adds complexity that hides real issues.' },
    { q: 'What are Core Web Vitals?', a: '<b>LCP</b> (Largest Contentful Paint, loading, good ≤ 2.5 s), <b>INP</b> (Interaction to Next Paint, responsiveness, good ≤ 200 ms), <b>CLS</b> (Cumulative Layout Shift, visual stability, good ≤ 0.1). Measure in the field with the web-vitals library or RUM.' },
  ],
  scenarios: [
    { q: 'Typing in a filter freezes a 5,000-row table.', a: 'Profile; keep input state local; filter with useMemo on a deferred value; virtualize rows; move heavy filtering server-side if data is large.' },
    { q: 'LCP is slow on the landing page.', a: 'Find the LCP element; serve a properly sized, compressed image with fetchpriority="high" and no lazy loading; reduce render-blocking CSS/JS; SSR/SSG the above-the-fold content; use a CDN.' },
  ],
  exercises: [
    { lv: 'Medium', task: 'A parent passes <code>onSelect={id => setSelected(id)}</code> and <code>style={{ color: "red" }}</code> to a memoized <code>Row</code>. Why does Row still re-render, and how do you fix it?', hint: 'Look at reference identity.',
      solution: `const onSelect = useCallback(id => setSelected(id), [])
const rowStyle = useMemo(() => ({ color: 'red' }), [])   // or a module-level constant
<Row onSelect={onSelect} style={rowStyle} />`, explain: 'Inline functions and objects are new every render, so memo\'s shallow comparison fails. Stable references let memo skip the render.' },
  ],
  followups: [
    { q: 'What does the React Compiler change?', a: 'It analyses components at build time and adds memoization automatically, so most manual useMemo/useCallback/memo becomes unnecessary, provided code follows the Rules of React.' },
    { q: 'How do you prevent performance regressions?', a: 'Performance budgets in CI (Lighthouse CI, size-limit), RUM dashboards by release, Profiler checks in code review for hot paths.' },
  ],
  summary: ['Render triggers: state, parent, context', 'Measure: Profiler, Performance panel, Web Vitals', 'Colocate state; pass children', 'memo + stable props, or React Compiler', 'Virtualize lists; paginate', 'Transitions/deferred values for heavy updates', 'Code-split; analyse bundles', 'LCP / INP / CLS'],
  quiz: [
    { q: 'Which does NOT cause a component to re-render?', options: ['Its state changes', 'Its parent re-renders', 'A context it reads changes', 'A ref.current value changes'], answer: 3, why: 'Mutating a ref does not trigger a render.' },
    { q: 'Which metric measures responsiveness to clicks and typing?', options: ['LCP', 'CLS', 'INP', 'TTFB'], answer: 2, why: 'Interaction to Next Paint replaced FID in 2024.' },
    { q: 'Best fix for rendering 10,000 rows?', options: ['useMemo on each row', 'Virtualization', 'useLayoutEffect', 'More context providers'], answer: 1, why: 'Only visible rows should be in the DOM.' },
  ],
});

HUB.guide({
  id: 'tanstack-query', title: 'TanStack Query: server state from basic to advanced', level: 'Intermediate → Senior', time: '60 min',
  intro: 'Queries, keys, caching, staleTime vs gcTime, mutations, invalidation, optimistic updates, pagination, infinite scroll, errors and testing.',
  related: 'React Query useQuery staleTime invalidation mutation',
  prereq: ['Promises and async/await', 'fetch or Axios', 'useEffect basics (and its problems for fetching)', 'Server state vs client state'],
  concepts: [
    { h: 'Why a server-state library', lv: 'Easy', html: `<p>Server data is a remote snapshot that goes stale. Hand-written effects miss caching, deduplication, retries, cancellation and refetching. TanStack Query manages all of that by <b>query key</b>.</p>` },
    { h: 'Setup and first query', lv: 'Easy', html: `<p>Create one QueryClient, wrap the app, call <code>useQuery</code> with a key and a function.</p>`,
      code: `const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } })
<QueryClientProvider client={queryClient}><App /></QueryClientProvider>

const { data, isLoading, error } = useQuery({
  queryKey: ['users', page],
  queryFn: ({ signal }) => api.get('/users', { params: { page }, signal }).then(r => r.data),
})` },
    { h: 'Query keys', lv: 'Easy', html: `<p>The key is the cache address and must include every variable the function uses. Same key = shared data and one request. Use a key factory to avoid typos.</p>` },
    { h: 'staleTime vs gcTime, and refetch triggers', lv: 'Medium', html: `<p><code>staleTime</code> (default 0): how long data counts as fresh. <code>gcTime</code> (default 5 min): how long unused data stays in memory. Stale data refetches only on a <b>trigger</b>: mount, window focus, reconnect, interval or invalidation.</p>` },
    { h: 'Mutations and invalidation', lv: 'Medium', html: `<p><code>useMutation</code> changes data; afterwards invalidate the affected keys (or write the response with <code>setQueryData</code>). Return the invalidate promise so the button stays pending until fresh data arrives.</p>`,
      code: `const qc = useQueryClient()
const save = useMutation({
  mutationFn: user => api.put('/users/' + user.id, user),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
})` },
    { h: 'Status flags', lv: 'Medium', html: `<p><code>isPending</code> (no data yet), <code>isFetching</code> (request running, including background), <code>isLoading</code> (first load), <code>isError</code>, <code>isPlaceholderData</code>. Big spinner on isLoading, small indicator on background isFetching.</p>` },
    { h: 'Pagination and infinite scroll', lv: 'Hard', html: `<p>Pagination: page in the key + <code>placeholderData: keepPreviousData</code>. Infinite: <code>useInfiniteQuery</code> with <code>initialPageParam</code> and <code>getNextPageParam</code>.</p>` },
    { h: 'Optimistic updates', lv: 'Hard', html: `<p>onMutate: cancel queries, snapshot, write the optimistic value, return the snapshot; onError: restore; onSettled: invalidate. Or render <code>mutation.variables</code> while pending.</p>` },
    { h: 'Errors, retries, auth and logout', lv: 'Hard', html: `<p>Default 3 retries with backoff; skip retries for 4xx. Global error toasts via <code>QueryCache({ onError })</code>. On logout call <code>queryClient.clear()</code>. Per-request client on the server for SSR.</p>` },
  ],
  mistakes: ['Keys missing variables', 'Creating QueryClient inside a component', 'Copying query data into useState', 'staleTime 0 everywhere causing refetch storms', 'Spinner on isPending for disabled queries', 'Not invalidating after mutations', 'Invalidating instead of clearing on logout'],
  qa: [
    { q: 'What problem does TanStack Query solve?', a: 'Managing server state: caching, deduplication, background refetching, retries, cancellation, pagination and mutations, replacing fragile useEffect + useState fetching.' },
    { q: 'staleTime vs gcTime?', a: 'staleTime decides when to refetch on a trigger; gcTime decides when to delete unused cache entries.' },
    { q: 'How do you avoid race conditions in search?', a: 'Put the search term in the query key and pass the signal to fetch; each term has its own cache entry, and abandoned requests are cancelled.' },
  ],
  scenarios: [
    { q: 'After saving a user, the list still shows the old name.', a: 'The mutation does not invalidate the list key. Invalidate <code>["users"]</code> (prefix matches lists and details) or update the cache with the response.' },
    { q: 'The dashboard refetches every time the tab gains focus and hits rate limits.', a: 'Raise staleTime for data that changes slowly instead of disabling focus refetching; keep refetchOnWindowFocus for freshness.' },
  ],
  exercises: [
    { lv: 'Medium', task: 'Write a <code>useProducts(page)</code> hook with pagination that keeps old data while loading, and prefetches the next page.', hint: 'keepPreviousData + queryClient.prefetchQuery.',
      solution: `function useProducts(page) {
  const qc = useQueryClient()
  const query = useQuery({
    queryKey: ['products', page],
    queryFn: ({ signal }) => getProducts(page, signal),
    placeholderData: keepPreviousData,
  })
  useEffect(() => {
    if (query.data?.hasMore) qc.prefetchQuery({ queryKey: ['products', page + 1], queryFn: ({ signal }) => getProducts(page + 1, signal) })
  }, [query.data, page, qc])
  return query
}`, explain: 'Old data stays visible (dim it with isPlaceholderData) and the next page is already cached when the user clicks Next.' },
  ],
  followups: [
    { q: 'TanStack Query vs RTK Query?', a: 'Similar features. RTK Query integrates with the Redux store and DevTools; TanStack Query is independent and very flexible. Choose RTK Query if the app is built around Redux Toolkit.' },
    { q: 'How do you test components using useQuery?', a: 'New QueryClient per test with retry: false, wrap in the provider, mock the network with MSW, assert loading → data and error states.' },
  ],
  summary: ['Server state ≠ client state', 'Key = cache address with all variables', 'staleTime = fresh; gcTime = keep in memory', 'Refetch needs stale + trigger', 'Mutations invalidate keys', 'keepPreviousData; useInfiniteQuery', 'Optimistic: snapshot → write → rollback → invalidate', 'Logout: queryClient.clear()'],
  quiz: [
    { q: 'Default staleTime?', options: ['0', '5 minutes', 'Infinity', '30 seconds'], answer: 0, why: 'Data is stale immediately unless you set staleTime.' },
    { q: 'What happens to a query with no observers after gcTime?', options: ['It refetches', 'It is removed from the cache', 'It becomes stale', 'Nothing'], answer: 1, why: 'gcTime controls garbage collection of inactive queries.' },
    { q: 'Right call on logout?', options: ['invalidateQueries()', 'queryClient.clear()', 'refetchQueries()', 'Nothing'], answer: 1, why: 'Invalidate would show the old user\'s data while refetching.' },
  ],
});

HUB.guide({
  id: 'rest-apis', title: 'REST APIs for frontend developers', level: 'Beginner → Senior', time: '45 min',
  intro: 'How REST works, methods, status codes, request/response, design best practices, security, CORS, testing, documentation and consuming APIs from React.',
  related: 'REST API HTTP methods status codes',
  prereq: ['How the web works (client, server, URL)', 'JSON', 'Promises and fetch'],
  concepts: [
    { h: 'API and REST basics', lv: 'Easy', html: `<p>An API is a contract between programs. REST is an architectural style where everything is a <b>resource</b> with a URI, manipulated with HTTP methods, exchanging representations (JSON). Requests are stateless.</p>` },
    { h: 'HTTP methods', lv: 'Easy', html: `<p>GET read, POST create, PUT replace, PATCH partial update, DELETE remove, OPTIONS allowed methods/CORS preflight, HEAD headers only. Safe: GET/HEAD/OPTIONS. Idempotent: those plus PUT and DELETE. POST isn't; PATCH isn't guaranteed.</p>` },
    { h: 'Status codes', lv: 'Easy', html: `<p>2xx success (200, 201, 204), 3xx redirect (301, 302, 304), 4xx client error (400, 401, 403, 404, 409, 422, 429), 5xx server error (500, 502, 503, 504). Map each to a UI behaviour.</p>` },
    { h: 'Request and response anatomy', lv: 'Medium', html: `<p>Request: method, URL, path params, query params, headers, body. Response: status line, headers, body. Path = which resource; query = filter/sort/page.</p>` },
    { h: 'Design best practices', lv: 'Medium', html: `<p>Plural nouns, nesting for ownership, query params for filtering/sorting/searching, pagination with metadata, versioning (/api/v1), consistent success and error formats (RFC 9457 problem details), meaningful status codes.</p>` },
    { h: 'Security and CORS', lv: 'Medium', html: `<p>HTTPS, authentication (JWT/Bearer, OAuth, sessions), authorization per resource, input validation, rate limiting (429), CORS configured on the server (preflight for non-simple requests), no secrets in front-end code.</p>` },
    { h: 'Consuming REST from React', lv: 'Hard', html: `<p>One API client, service functions with AbortSignal, TanStack Query for caching, normalised errors, all four UI states (loading, error, empty, success), token refresh in interceptors.</p>`,
      code: `function Users() {
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['users'], queryFn: ({ signal }) => getUsers({ signal }) })
  if (isLoading) return <Skeleton />
  if (error) return <ErrorBox message={error.message} onRetry={refetch} />
  if (!data.length) return <Empty text="No users yet" />
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}` },
    { h: 'Testing and documentation', lv: 'Hard', html: `<p>Postman/Insomnia, curl, automated API tests (Playwright request fixture), mocking with MSW in front-end tests, OpenAPI for docs, client generation and contract tests.</p>` },
  ],
  mistakes: ['Verbs in URLs (/getUsers)', 'Returning 200 for errors', 'GET requests that change data', 'Confusing 401 and 403', 'Fixing CORS in React instead of on the server', 'Secret API keys in VITE_ variables', 'Ignoring empty and error UI states'],
  qa: [
    { q: 'PUT vs PATCH?', a: 'PUT replaces the whole resource and is idempotent; PATCH sends only changes and is not guaranteed idempotent.' },
    { q: '401 vs 403?', a: '401: not authenticated (missing/expired credentials). 403: authenticated but not allowed.' },
    { q: 'What is idempotency and why does it matter?', a: 'Repeating the request gives the same result. Safe retries depend on it; make POST retry-safe with an Idempotency-Key.' },
  ],
  scenarios: [
    { q: 'CORS error when calling the API from localhost.', a: 'Configure Access-Control-Allow-Origin (and methods/headers/credentials) on the server, or use the Vite dev proxy in development.' },
    { q: 'Users double-click "Pay" and get charged twice.', a: 'Disable the button while pending, send an Idempotency-Key, and have the server return the original result for repeats.' },
  ],
  exercises: [
    { lv: 'Medium', task: 'Write <code>apiFetch(path, options)</code> that adds the base URL and JSON headers, throws an Error with the status for non-2xx, and returns parsed JSON (or null for 204).', hint: 'Check res.ok and res.status === 204.',
      solution: `export async function apiFetch(path, { body, headers, ...options } = {}) {
  const res = await fetch(import.meta.env.VITE_API_URL + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = new Error((await res.json().catch(() => ({}))).message || 'HTTP ' + res.status)
    err.status = res.status
    throw err
  }
  return res.status === 204 ? null : res.json()
}`, explain: 'fetch does not reject on HTTP errors, so the wrapper converts them into thrown errors with a status the UI and retry logic can use.' },
  ],
  followups: [
    { q: 'REST vs GraphQL?', a: 'REST: many endpoints, simple HTTP caching, possible over/under-fetching. GraphQL: one endpoint, client chooses fields, harder caching and cost control.' },
    { q: 'How do you handle pagination in the UI?', a: 'Offset for numbered tables, cursor for feeds; keep previous data while loading; show total pages from metadata; prefetch the next page.' },
  ],
  summary: ['Resources + URIs + HTTP methods + JSON', 'Safe vs idempotent', '2xx/3xx/4xx/5xx; 401 vs 403', 'Path = which; query = how', 'Nouns, plurals, versioning, consistent errors', 'CORS is a server fix', 'Four UI states for every request'],
  quiz: [
    { q: 'Which method is NOT idempotent?', options: ['GET', 'PUT', 'DELETE', 'POST'], answer: 3, why: 'Repeating POST can create duplicates.' },
    { q: 'Status for a successful create?', options: ['200', '201', '204', '302'], answer: 1, why: '201 Created, ideally with a Location header.' },
    { q: 'Where is a CORS error fixed?', options: ['In React state', 'On the API server', 'In localStorage', 'In the CSS'], answer: 1, why: 'The server must send the Access-Control-Allow-* headers.' },
  ],
});
