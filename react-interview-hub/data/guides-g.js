HUB.guide({
  id: 'browser-rendering', area: 'Browser & performance', title: 'How browsers render: critical rendering path and Core Web Vitals', level: 'Intermediate → Senior', time: '40 min',
  intro: 'From URL to pixels: DNS and HTTP, parsing HTML/CSS into DOM and CSSOM, render tree, layout, paint, composite, render-blocking resources, and how LCP, INP and CLS are measured and improved.',
  related: 'critical rendering path Core Web Vitals LCP INP CLS',
  prereq: ['HTML/CSS/JS basics', 'HTTP basics'],
  concepts: [
    { h: 'From URL to first bytes', lv: 'Easy', html: `<p>DNS lookup → TCP + TLS handshake → HTTP request → server responds (TTFB). CDNs, HTTP/2-3, caching and preconnect shorten this.</p>` },
    { h: 'DOM, CSSOM and render tree', lv: 'Medium', html: `<p>The browser parses HTML into the DOM and CSS into the CSSOM, combines them into the render tree (visible nodes with styles), then runs <b>layout</b> (sizes/positions), <b>paint</b> (pixels) and <b>composite</b> (layers on the GPU).</p>` },
    { h: 'Render-blocking resources', lv: 'Medium', html: `<p>CSS blocks rendering; synchronous scripts block parsing. Use <code>defer</code>/<code>type="module"</code> scripts, inline critical CSS, preload key fonts/images, and avoid huge CSS.</p>`,
      code: `<link rel="preload" href="/fonts/brand.woff2" as="font" type="font/woff2" crossorigin>
<script src="/app.js" defer></script>` },
    { h: 'Reflow and repaint', lv: 'Hard', html: `<p>Changing geometry triggers layout (expensive); colour changes repaint; <code>transform</code>/<code>opacity</code> animations only composite (cheap). Avoid layout thrashing (read then write in batches).</p>` },
    { h: 'Core Web Vitals', lv: 'Medium', html: `<p><b>LCP</b> ≤ 2.5 s (largest image/text paint), <b>INP</b> ≤ 200 ms (responsiveness of interactions), <b>CLS</b> ≤ 0.1 (unexpected layout shifts). Measure field data with the <code>web-vitals</code> library / CrUX, lab data with Lighthouse.</p>`,
      code: `import { onLCP, onINP, onCLS } from 'web-vitals'
onLCP(sendToAnalytics); onINP(sendToAnalytics); onCLS(sendToAnalytics)` },
    { h: 'Fixing each metric', lv: 'Hard', html: `<p><b>LCP</b>: fast server/CDN, preload and prioritise the hero image (<code>fetchpriority="high"</code>), compress images, SSR/SSG. <b>INP</b>: less JS, break long tasks, transitions, avoid heavy handlers. <b>CLS</b>: dimensions on images/embeds, reserve space for ads/banners, <code>font-display</code> strategy.</p>` },
  ],
  mistakes: ['Lazy-loading the LCP image', 'Animating top/left instead of transform', 'Images without width/height', 'Huge third-party scripts loaded synchronously', 'Only checking Lighthouse, not real users'],
  qa: [
    { q: 'What happens when you type a URL and press Enter?', a: 'DNS → connection (TCP/TLS) → HTTP request → response → parse HTML (DOM) and CSS (CSSOM) → render tree → layout → paint → composite; scripts and resources load along the way.' },
    { q: 'What are Core Web Vitals?', a: 'LCP (loading), INP (responsiveness), CLS (visual stability), measured from real users; thresholds 2.5 s, 200 ms, 0.1.' },
  ],
  scenarios: [{ q: 'CLS is high because the page jumps when a banner appears.', a: 'Reserve space for the banner (min-height or aspect-ratio), give images dimensions, and avoid inserting content above existing content.' }],
  exercises: [{ lv: 'Easy', task: 'Write the ideal tag for an LCP hero image.', hint: 'Dimensions, priority, no lazy.',
    solution: `<img src="/hero.avif" width="1200" height="600" fetchpriority="high" alt="Product dashboard">`, explain: 'Known size prevents layout shift; high priority loads it early; lazy loading would delay it.' }],
  followups: [{ q: 'What replaced FID?', a: 'INP became a Core Web Vital in March 2024, measuring all interactions rather than only the first input delay.' }],
  summary: ['DNS → TLS → TTFB', 'DOM + CSSOM → render tree → layout → paint → composite', 'defer scripts; preload critical assets', 'Animate transform/opacity', 'LCP 2.5 s, INP 200 ms, CLS 0.1'],
  quiz: [{ q: 'Which is cheapest to animate?', options: ['width', 'top', 'transform', 'margin'], answer: 2, why: 'transform only needs compositing.' }],
});

HUB.guide({
  id: 'auth-frontend', area: 'APIs & security', title: 'Authentication in frontend apps: sessions, JWT, refresh tokens and OAuth', level: 'Intermediate → Senior', time: '50 min',
  intro: 'How login really works in React apps: authentication vs authorization, sessions vs JWT, access and refresh tokens, safe storage, Axios interceptors, protected routes, role-based UI, OAuth/OIDC with PKCE, and XSS/CSRF defences.',
  related: 'JWT refresh token OAuth authentication',
  prereq: ['HTTP, cookies and headers', 'Axios or fetch', 'React Router basics'],
  concepts: [
    { h: 'Authentication vs authorization', lv: 'Easy', html: `<p>Authentication: who are you (401 when missing/invalid). Authorization: what you may do (403 when not allowed). Always enforced on the server; the UI only hides what you can't do.</p>` },
    { h: 'Sessions vs JWT', lv: 'Medium', html: `<p>Sessions: server stores state, browser holds an HttpOnly cookie; easy revocation. JWT: signed token with claims, stateless verification; revocation needs short expiry and refresh tokens. Both are valid; choose by architecture.</p>` },
    { h: 'Access + refresh tokens and storage', lv: 'Medium', html: `<p>Short-lived access token (5–15 min) kept in memory; long-lived refresh token in an HttpOnly, Secure, SameSite cookie. Avoid tokens in localStorage (readable by any XSS). On reload, call <code>/auth/refresh</code>.</p>` },
    { h: 'Interceptors: attach and refresh once', lv: 'Hard', html: `<p>Attach the token on requests; on 401, refresh with a single shared promise, retry the original request, and log out if refresh fails.</p>`,
      code: `let refreshing = null
api.interceptors.response.use(r => r, async err => {
  const original = err.config
  if (err.response?.status === 401 && !original._retry) {
    original._retry = true
    refreshing ??= refresh().finally(() => { refreshing = null })
    await refreshing
    return api(original)
  }
  return Promise.reject(err)
})` },
    { h: 'Protected routes and role-based UI', lv: 'Medium', html: `<p>Guard routes (layout route or loader redirect) and show/hide actions by role or permission, but never trust it for security.</p>`,
      code: `function Can({ permission, children }) { const { user } = useAuth(); return user?.permissions.includes(permission) ? children : null }
<Can permission="invoice:delete"><DeleteButton /></Can>` },
    { h: 'OAuth 2.0 / OIDC with PKCE', lv: 'Hard', html: `<p>"Login with Google" uses OIDC over OAuth 2.0: redirect to the provider with a PKCE code challenge and state, receive a code, exchange it (with the verifier) for tokens. Use an auth library/provider (Auth0, Clerk, Cognito, Keycloak) rather than hand-rolling.</p>` },
    { h: 'XSS and CSRF', lv: 'Hard', html: `<p>XSS steals or uses tokens: React escapes output, avoid <code>dangerouslySetInnerHTML</code> (sanitize with DOMPurify), add CSP. CSRF abuses cookies: SameSite cookies, CSRF tokens, Origin checks.</p>` },
  ],
  mistakes: ['Tokens in localStorage', 'Every 401 triggering its own refresh', 'Trusting front-end role checks', 'Not clearing caches/stores on logout', 'Secrets in VITE_ env variables'],
  qa: [
    { q: 'Where should you store JWTs?', a: 'Access token in memory; refresh token in an HttpOnly, Secure, SameSite cookie. localStorage is readable by injected scripts.' },
    { q: 'What is the difference between 401 and 403?', a: '401: not authenticated (missing/expired credentials). 403: authenticated but not permitted.' },
    { q: 'How do you handle token expiry in a React app?', a: 'Interceptor detects 401, performs a single refresh shared by concurrent requests, retries originals, and logs out on refresh failure (clearing caches).' },
  ],
  scenarios: [{ q: 'After logout and login as another user, old data flashes.', a: 'Caches weren\'t cleared. On logout call queryClient.clear(), reset stores, clear persisted state.' }],
  exercises: [{ lv: 'Medium', task: 'Write an AuthProvider that restores the session on app start by calling /auth/refresh.', hint: 'Effect on mount, status state.',
    solution: `function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, status: 'checking' })
  useEffect(() => {
    api.post('/auth/refresh', null, { withCredentials: true })
      .then(r => { setToken(r.data.accessToken); setState({ user: r.data.user, status: 'authenticated' }) })
      .catch(() => setState({ user: null, status: 'anonymous' }))
  }, [])
  if (state.status === 'checking') return <FullPageSpinner />
  return <AuthContext value={state}>{children}</AuthContext>
}`, explain: 'The refresh cookie restores the session without storing tokens in localStorage.' }],
  followups: [{ q: 'What is PKCE?', a: 'A code verifier/challenge pair that proves the app exchanging the authorization code is the one that requested it, protecting public clients like SPAs.' }],
  summary: ['401 = who, 403 = what', 'Access in memory, refresh in HttpOnly cookie', 'Single-flight refresh in interceptor', 'UI guards ≠ security', 'OIDC + PKCE for social login', 'Defend XSS and CSRF; clear caches on logout'],
  quiz: [{ q: 'Best storage for a refresh token?', options: ['localStorage', 'sessionStorage', 'HttpOnly Secure SameSite cookie', 'Redux store'], answer: 2, why: 'JavaScript can\'t read HttpOnly cookies.' }],
});

HUB.guide({
  id: 'testing-rtl', area: 'Testing', title: 'Testing React: Vitest/Jest, React Testing Library and MSW', level: 'Intermediate → Senior', time: '45 min',
  intro: 'A practical testing strategy: what to test, queries by role, user-event, async UI, mocking the network with MSW, testing hooks, providers and accessibility, and keeping tests fast and reliable.',
  related: 'React Testing Library getByRole userEvent mock',
  prereq: ['Components and hooks', 'async/await'],
  concepts: [
    { h: 'Strategy: the testing trophy', lv: 'Easy', html: `<p>Static checks (lint, types) → unit tests for pure logic → <b>integration tests</b> of components with real children (most value) → a few E2E tests (Playwright) for critical flows. Test behaviour, not implementation.</p>` },
    { h: 'Render, query, interact, assert', lv: 'Easy', html: `<p>Query like a user: <code>getByRole</code> with name, <code>getByLabelText</code>, <code>getByText</code>; test ids last. Interact with <code>userEvent</code>.</p>`,
      code: `test('adds a todo', async () => {
  const user = userEvent.setup()
  render(<Todos />)
  await user.type(screen.getByLabelText(/new todo/i), 'Buy milk')
  await user.click(screen.getByRole('button', { name: /add/i }))
  expect(screen.getByRole('listitem')).toHaveTextContent('Buy milk')
})` },
    { h: 'getBy vs queryBy vs findBy', lv: 'Medium', html: `<p>getBy: must exist now (throws). queryBy: may not exist (returns null) for absence checks. findBy: waits for async appearance.</p>` },
    { h: 'Mock the network with MSW', lv: 'Medium', html: `<p>Intercept requests so real fetch/Axios code runs; test loading, success, error and empty states.</p>`,
      code: `const server = setupServer(http.get('/api/users', () => HttpResponse.json([{ id: 1, name: 'Asha' }])))
beforeAll(() => server.listen()); afterEach(() => server.resetHandlers()); afterAll(() => server.close())
test('shows error', async () => {
  server.use(http.get('/api/users', () => new HttpResponse(null, { status: 500 })))
  render(<Users />)
  expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i)
})` },
    { h: 'Providers and custom render', lv: 'Medium', html: `<p>Wrap components with router, QueryClient (new per test, retry: false), store and theme in a <code>renderWithProviders</code> helper.</p>` },
    { h: 'Hooks, timers and accessibility', lv: 'Hard', html: `<p><code>renderHook</code> for hooks; fake timers for debounce/intervals; <code>jest-axe</code>/<code>vitest-axe</code> for automated accessibility checks.</p>` },
    { h: 'Reliable tests', lv: 'Hard', html: `<p>No arbitrary sleeps, isolated state per test, deterministic data, avoid snapshot overuse, run in CI, keep tests close to features.</p>` },
  ],
  mistakes: ['Testing state/implementation instead of behaviour', 'container.querySelector instead of role queries', 'Mocking hooks like useSelector instead of using real providers', 'Shared QueryClient between tests', 'Huge brittle snapshots'],
  qa: [
    { q: 'How do you test React applications?', a: 'Integration tests with React Testing Library (queries by role, user-event), MSW for network, unit tests for pure logic, a few Playwright E2E tests, plus linting and type checks in CI.' },
    { q: 'getBy vs queryBy vs findBy?', a: 'getBy throws if missing (presence), queryBy returns null (absence), findBy waits asynchronously (appearance).' },
  ],
  scenarios: [{ q: 'Tests pass alone but fail together.', a: 'Shared state leaks between tests (QueryClient cache, store, MSW handlers, localStorage). Create fresh instances per test and reset handlers in afterEach.' }],
  exercises: [{ lv: 'Medium', task: 'Test a debounced search input calls the API once after typing.', hint: 'Fake timers + advance.',
    solution: `test('debounces search', async () => {
  vi.useFakeTimers()
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
  const search = vi.fn().mockResolvedValue([])
  render(<Search onSearch={search} />)
  await user.type(screen.getByRole('searchbox'), 'react')
  vi.advanceTimersByTime(300)
  expect(search).toHaveBeenCalledTimes(1)
  expect(search).toHaveBeenCalledWith('react')
  vi.useRealTimers()
})`, explain: 'Fake timers make the debounce deterministic; user-event is told to advance them.' }],
  followups: [{ q: 'Why prefer MSW over mocking fetch?', a: 'Your real data layer runs, handlers are reusable in Storybook/dev, and tests break only when behaviour changes.' }],
  summary: ['Mostly integration tests', 'Query by role/label', 'userEvent over fireEvent', 'getBy/queryBy/findBy', 'MSW for network; fresh providers', 'Fake timers; axe checks'],
  quiz: [{ q: 'Best query for a Save button?', options: ['getByTestId("save")', 'getByRole("button", { name: /save/i })', 'container.querySelector(".btn")', 'getByText("S")'], answer: 1, why: 'Role queries match how users and assistive tech see the UI.' }],
});
