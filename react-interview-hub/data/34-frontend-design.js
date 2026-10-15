/* Frontend system design & LLD, from LinkedIn lists and interview experiences the user pasted. Answers written for this hub. */
(function () {
  const F = (lv, q, k, a, c, t) => ({ lv, q, k, a, c, t });
  HUB.add({
    id: 'fedesign', title: 'Frontend system design and LLD', short: 'FE design',
    blurb: 'Low-level design of real features and frontend system design rounds. Answer in this order: clarify requirements → data/state model → component structure → data flow and APIs → performance → accessibility → edge cases and trade-offs.',
    items: [
// ---------- LLD ----------
F('Medium', `LLD: design a responsive sidebar navigation (mobile vs desktop, submenus, routes).`,
  `On a big screen the menu sits on the side; on a phone it slides in from a button.`,
  `<b>Data:</b> menu config array (label, path, icon, children, required permission) so menus are data-driven and role-filtered. <b>Layout:</b> CSS-first responsiveness (persistent sidebar ≥ 1024px, off-canvas drawer below) rather than rendering two menus; a <code>useMediaQuery</code> hook only if behaviour differs. <b>State:</b> drawer open/closed, expanded submenu ids, active route from the router (<code>NavLink</code>). <b>A11y:</b> <code>&lt;nav aria-label&gt;</code>, toggle button with <code>aria-expanded</code>/<code>aria-controls</code>, focus trap and Escape for the mobile drawer, close on route change. <b>Animation:</b> CSS transform transitions, respect reduced motion. Collapse-to-icons mode with tooltips for desktop.`,
  `function Sidebar({ items, open, onClose }) {
  const [expanded, setExpanded] = useState(new Set())
  const toggle = id => setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  return <nav aria-label="Main" className={'sidebar' + (open ? ' open' : '')}>
    <ul>{items.map(it => <li key={it.path}>
      {it.children
        ? <><button aria-expanded={expanded.has(it.path)} onClick={() => toggle(it.path)}>{it.label}</button>
            {expanded.has(it.path) && <ul>{it.children.map(c => <li key={c.path}><NavLink to={c.path} onClick={onClose}>{c.label}</NavLink></li>)}</ul>}</>
        : <NavLink to={it.path} onClick={onClose}>{it.label}</NavLink>}
    </li>)}</ul>
  </nav>
}
/* .sidebar { position: fixed; inset: 0 auto 0 0; width: 260px; transform: translateX(-100%); transition: transform .25s }
   .sidebar.open { transform: none }  @media (min-width: 1024px) { .sidebar { position: sticky; transform: none } } */`),
F('Medium', `LLD: tabs with animated switching. Which animation approach would you use?`,
  `Tabs where the underline slides and the content fades in when you switch.`,
  `<b>Data:</b> tabs as an array of { id, label, content/lazy component }; active id in state (or in the URL for shareable tabs). <b>Animation options:</b> plain CSS transitions/keyframes (no dependency, best default), Framer Motion (<code>layoutId</code> for a sliding indicator, <code>AnimatePresence</code> for exit animations) when you need exit or shared-layout animations, react-transition-group (older). Animate only <code>transform</code>/<code>opacity</code>, respect <code>prefers-reduced-motion</code>, keep ARIA tabs pattern and arrow-key navigation, lazy-render inactive panels if heavy (or keep them mounted to preserve state).`,
  `/* indicator slides by moving a CSS variable */
<div role="tablist" style={{ '--i': activeIndex, '--n': tabs.length }} className="tabs">
  {tabs.map((t, i) => <button key={t.id} role="tab" aria-selected={i === activeIndex} onClick={() => setActive(i)}>{t.label}</button>)}
  <span className="indicator" />
</div>
<div role="tabpanel" key={tabs[activeIndex].id} className="fade-in">{tabs[activeIndex].content}</div>
/* .indicator { width: calc(100% / var(--n)); transform: translateX(calc(var(--i) * 100%)); transition: transform .3s }
   .fade-in { animation: fade .25s ease } @keyframes fade { from { opacity: 0; transform: translateY(4px) } } */`),
F('Hard', `LLD: a filterable, sortable, paginated data table that handles large data sets.`,
  `A table where you can search, sort by a column and move between pages, even with lots of rows.`,
  `<b>Decide where work happens:</b> small data (≤ a few thousand rows) → client-side filter/sort/paginate with useMemo; large data → server-side (send filter/sort/page as query params, React Query keyed by them, keepPreviousData). <b>Modular structure:</b> <code>DataTable</code> (state + data hook) → <code>TableToolbar</code> (search, filters), <code>TableHeader</code> (sortable column buttons with <code>aria-sort</code>), <code>TableBody</code>/<code>Row</code> (memoized, stable keys), <code>Pagination</code>. Column config drives rendering (accessor, header, sortable, cell renderer). <b>Performance:</b> debounce search, virtualize long pages, avoid recreating column config each render. <b>UX:</b> state in the URL, loading skeleton, empty state, sticky header. Headless libraries like TanStack Table implement this pattern.`,
  `const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'price', header: 'Price', sortable: true, cell: r => '₹' + r.price },
]
function useTableData(rows, { query, sort, page, pageSize }) {
  return useMemo(() => {
    const q = query.trim().toLowerCase()
    let out = q ? rows.filter(r => r.name.toLowerCase().includes(q)) : rows
    if (sort) out = out.toSorted((a, b) => (a[sort.key] > b[sort.key] ? 1 : -1) * (sort.dir === 'asc' ? 1 : -1))
    return { total: out.length, pageRows: out.slice((page - 1) * pageSize, page * pageSize) }
  }, [rows, query, sort, page, pageSize])
}`),
F('Medium', `LLD: a like/favourite button with optimistic updates and rollback.`,
  `The heart turns red the moment you tap it; if the server says no, it turns back and tells you.`,
  `Update the UI immediately, send the request, and on failure restore the previous state and show a message. Prevent double toggles while pending (or queue the latest intent), keep the count in sync with the server response, and make the API idempotent (PUT /likes/:id with liked: true/false instead of a blind toggle). Options: React 19 <code>useOptimistic</code>, React Query <code>onMutate</code>/<code>onError</code>, or local state.`,
  `function LikeButton({ postId, initialLiked, initialCount }) {
  const [state, setState] = useState({ liked: initialLiked, count: initialCount }), [pending, setPending] = useState(false)
  async function toggle() {
    if (pending) return
    const prev = state, next = { liked: !prev.liked, count: prev.count + (prev.liked ? -1 : 1) }
    setState(next); setPending(true)                                   // optimistic
    try { const res = await api.put('/posts/' + postId + '/like', { liked: next.liked }); setState(res.data) }
    catch { setState(prev); toast('Could not update like. Please try again.') }   // rollback
    finally { setPending(false) }
  }
  return <button aria-pressed={state.liked} onClick={toggle}>{state.liked ? '♥' : '♡'} {state.count}</button>
}`),
F('Hard', `LLD: a live chat feature (WebSockets or polling, message state, typing status).`,
  `Messages arrive instantly through an always-open phone line instead of calling again and again.`,
  `<b>Transport:</b> WebSocket (or a library like Socket.IO) for bidirectional real-time; SSE for server→client only; long polling as fallback. One connection per app (in a provider/store), reconnect with exponential backoff, heartbeat/ping, re-subscribe after reconnect and fetch missed messages since the last id. <b>State:</b> messages normalized by conversation (ids + entities), each with status (sending → sent → delivered → read/failed) and a client-generated temp id for optimistic sending and dedupe; history loaded with cursor pagination (infinite scroll upward, keep scroll position). <b>Typing indicator:</b> send "typing" events throttled (e.g. every 2s) and expire after inactivity. <b>UI:</b> virtualized message list, auto-scroll only if the user is at the bottom, unread counts, retry failed sends. <b>Security:</b> authenticate the socket, sanitize message content.`,
  `useEffect(() => {
  const ws = new WebSocket(url)
  ws.onmessage = e => { const msg = JSON.parse(e.data); dispatch({ type: msg.type, payload: msg.payload }) }   // 'message' | 'typing' | 'read'
  ws.onclose = () => scheduleReconnect()      // exponential backoff
  socketRef.current = ws
  return () => ws.close()
}, [url])
function send(text) {
  const tempId = crypto.randomUUID()
  dispatch({ type: 'message', payload: { id: tempId, text, status: 'sending' } })   // optimistic
  socketRef.current.send(JSON.stringify({ type: 'send', tempId, text }))
}`),
F('Medium', `LLD: prevent multiple API hits from rapid clicks or slow networks (rate-limited / throttled button).`,
  `Once the button is pressed, it waits for the answer before it can be pressed again.`,
  `Pick the tool by intent: <b>submit/pay/save</b> → in-flight guard (disable the button and ignore clicks while the request is pending) plus an <b>idempotency key</b> so the server ignores duplicates; <b>search/autosave</b> → debounce; <b>scroll/resize/"refresh" button</b> → throttle (e.g. at most once every 2s). A custom hook keeps it reusable; lodash throttle/debounce are fine but remember to cancel on unmount. This answers the EY-style question about users clicking Submit several times on 6–8 second responses: disable + loading state + idempotency key + server-side duplicate check.`,
  `function useSingleFlight(fn) {
  const busy = useRef(false), [pending, setPending] = useState(false)
  const run = useCallback(async (...args) => {
    if (busy.current) return                 // ignore clicks while a request is running
    busy.current = true; setPending(true)
    try { return await fn(...args) } finally { busy.current = false; setPending(false) }
  }, [fn])
  return [run, pending]
}
const [submit, pending] = useSingleFlight(data => api.post('/orders', data, { headers: { 'Idempotency-Key': formKey } }))
const button = <button disabled={pending} onClick={() => submit(form)}>{pending ? 'Placing order…' : 'Place order'}</button>`),
// ---------- Scenario-style design questions ----------
F('Medium', `How do you keep a user logged in even after they close the tab and reopen it?`,
  `Give the browser a long-life, hidden wristband so it can ask for a fresh short pass when the app opens.`,
  `Use a <b>persistent, HttpOnly, Secure, SameSite refresh-token cookie</b> (with an expiry, e.g. 7–30 days for "Remember me") set by the server. On app start, call <code>/auth/refresh</code>: if the cookie is valid, the server returns a short-lived access token (kept in memory) and the user; otherwise show login. Rotate refresh tokens, allow server-side revocation (logout everywhere), and use session cookies (no expiry) when "Remember me" is off. Avoid storing tokens in localStorage (XSS). sessionStorage is cleared per tab, so it doesn't meet this requirement.`),
F('Medium', `After opening a row's details and coming back, the table should show the same filters and data. How do you implement it?`,
  `Write the search choices in the address, and keep a copy of the results so going back is instant.`,
  `<b>Filters in the URL</b> (<code>?from=…&amp;to=…&amp;category=…&amp;page=2</code>) via <code>useSearchParams</code>: they survive back navigation, refresh and sharing. <b>Data in a cache</b> keyed by the filters (React Query/RTK Query with a sensible staleTime), so returning renders instantly from cache and refreshes in the background. <b>Scroll position:</b> React Router's <code>ScrollRestoration</code> or save it per key. Without a router/library: store filters in sessionStorage (per tab) and restore on mount. Navigate with links (not full reloads) so state is kept.`,
  `const [params, setParams] = useSearchParams()
const filters = Object.fromEntries(params)
const { data } = useQuery({ queryKey: ['orders', filters], queryFn: () => getOrders(filters), staleTime: 60_000, placeholderData: keepPreviousData })
function onSearch(form) { setParams(form) }   // URL becomes the source of truth`),
F('Medium', `The logout button is in the navbar but the user activity data lives in the dashboard. How do you send it with the logout API?`,
  `Put the activity notes somewhere both rooms can reach, and send them reliably even if the page is closing.`,
  `Don't pass data through unrelated components. Keep activity in a <b>shared store</b> (Context, Zustand or a Redux slice) that the dashboard writes to and the logout handler reads from; or emit events to a small activity service module. On logout, include it in the logout request; for unload/tab close use <code>navigator.sendBeacon</code> or <code>fetch(..., { keepalive: true })</code> on <code>pagehide</code>/<code>visibilitychange</code>, which is delivered even as the page unloads. Then clear stores and caches.`,
  `function logout() {
  const activity = useActivityStore.getState().events
  navigator.sendBeacon('/api/activity', new Blob([JSON.stringify(activity)], { type: 'application/json' }))
  return api.post('/auth/logout').finally(() => { queryClient.clear(); resetStores(); navigate('/login') })
}`),
F('Medium', `How would you plan migrating a UI component library (e.g. one design library to another) without disrupting sprints?`,
  `Swap the building blocks a little at a time, behind a wrapper, while the team keeps shipping features.`,
  `<b>Plan:</b> inventory components used and their usage counts; build an <b>adapter layer</b> (your own <code>Button</code>, <code>Table</code>, <code>Modal</code> wrappers) so screens depend on your API, not the library; migrate wrapper internals screen by screen, starting with low-risk, high-reuse components. <b>Branching:</b> trunk-based development with short-lived branches and <b>feature flags</b> rather than a long-lived migration branch (avoids painful merges); or a release branch per milestone if the team uses GitFlow. <b>Process:</b> reserve a fixed share of each sprint, visual regression tests (Storybook + Chromatic/Playwright screenshots), both libraries temporarily coexisting with scoped styles, track bundle size, remove the old dependency at the end.`),
F('Hard', `System design: build a real-time order tracker (e.g. food delivery) using WebSockets.`,
  `The order screen updates by itself: "preparing", "picked up", and the rider moving on the map.`,
  `<b>Requirements:</b> order status timeline, live rider location, ETA, works on mobile networks. <b>Initial load:</b> GET order snapshot (REST) so the page renders immediately. <b>Updates:</b> subscribe to an order channel over WebSocket (or SSE since updates are mostly server→client); events carry a version/sequence number so stale or duplicate events are ignored; on reconnect, refetch the snapshot. <b>State:</b> order status in a cache (React Query <code>setQueryData</code> from socket events), location updates throttled before rendering (e.g. animate marker at ~1 update/s), map lazy-loaded. <b>Resilience:</b> exponential backoff reconnect, fallback to polling, "last updated" indicator, offline banner. <b>Performance/battery:</b> pause updates when the tab is hidden; unsubscribe on unmount.`),
F('Hard', `System design: design the frontend architecture of a restaurant page with real-time order updates (Swiggy-style).`,
  `Plan how the big menu page is split into pieces, loaded quickly, and kept up to date.`,
  `<b>Rendering:</b> SSR/streaming for the restaurant header and menu (SEO, fast LCP), client components for cart and interactivity. <b>Components:</b> RestaurantHeader, MenuCategories (sticky nav with scroll-spy), MenuList (virtualized for large menus), ItemCard (memoized), CustomizationModal (lazy), CartDrawer, OrderStatusBanner. <b>State:</b> server data (menu, availability, offers) in React Query with caching; cart as client state (store + persisted) with derived totals via selectors; real-time item availability/price changes from WebSocket patches; optimistic cart updates with server validation at checkout. <b>Performance:</b> route-level code splitting, image CDN with responsive sizes, prefetch on hover, skeletons. <b>Errors:</b> error boundaries per section, retry, graceful "item unavailable" handling. <b>Observability:</b> Web Vitals and error tracking per release.`),
F('Hard', `How would you handle real-time notifications that arrive every second for thousands of users without slowing the UI?`,
  `Lots of little messages arrive; collect them and update the screen in calm batches.`,
  `<b>Transport:</b> one shared WebSocket/SSE connection per client (not per component); backend fans out via pub/sub. <b>Client:</b> buffer incoming events and flush in batches (every 250–1000 ms or per animation frame) instead of a state update per message; dedupe by id; cap stored notifications (keep latest N, paginate older); normalize state so updates touch only changed items; update only a badge count when the panel is closed; mark non-urgent renders with <code>startTransition</code>; virtualize the list. Pause or reduce frequency when the tab is hidden. <b>Scale (millions of users):</b> sticky load balancing for sockets, horizontal socket servers, message broker, backpressure and rate limits, fallback to polling.`,
  `const buffer = useRef([])
useEffect(() => {
  socket.on('notification', n => buffer.current.push(n))
  const id = setInterval(() => {
    if (!buffer.current.length) return
    const batch = buffer.current; buffer.current = []
    startTransition(() => setItems(prev => mergeById(batch, prev).slice(0, 200)))   // one render per batch
  }, 500)
  return () => { clearInterval(id); socket.off('notification') }
}, [])`),
F('Hard', `When does a micro-frontend architecture become a bad idea? What is Module Federation?`,
  `Splitting one app into many mini-apps helps big separate teams, but adds a lot of extra work.`,
  `<b>Good fit:</b> many teams owning separate business domains that need independent deployments and release cycles, at real organisational scale. <b>Bad idea:</b> small/medium teams, tightly coupled features, or adopting it early: you pay with duplicated dependencies and bigger bundles, version conflicts, inconsistent UX, routing and shared-state complexity, harder debugging and testing, and more CI/CD and infrastructure. Often a well-structured monorepo with feature modules and a shared design system gives most benefits. <b>Module Federation</b> (Webpack 5, also Rspack/Vite plugins) lets separately built apps load each other's modules at runtime (host + remotes) and share singletons like React, enabling independent deploys. Alternatives: build-time packages, iframes, Web Components, single-spa. Rule of thumb: pay for micro-frontends only when organisational complexity already exists.`),
F('Medium', `How do SOLID principles apply to React and JavaScript code?`,
  `Five habits that keep code easy to change: one job per piece, extend without breaking, swap parts safely, small contracts, depend on plugs not wires.`,
  `<b>S</b>ingle responsibility: split validation, API calls, token storage and navigation; components render, hooks hold logic, services call APIs. <b>O</b>pen/closed: extend via props, composition, config maps or plugin registries (add a payment method by adding an entry, not editing a switch everywhere). <b>L</b>iskov substitution: implementations of the same contract are interchangeable (mock API service vs real, localStorage vs IndexedDB adapter) without breaking callers. <b>I</b>nterface segregation: small, focused props/hooks; components don't take a giant "god" object they barely use. <b>D</b>ependency inversion: depend on abstractions (an <code>apiClient</code>, logger or auth provider passed in via context/parameters) rather than hard-coded implementations, which also makes testing easy.`,
  `// Open/closed + dependency inversion: add channels without editing the sender
const channels = { email: sendEmail, sms: sendSms }
export const notify = (type, msg, registry = channels) => registry[type]?.(msg)
// Liskov: any storage with get/set works
const storage = { get: k => localStorage.getItem(k), set: (k, v) => localStorage.setItem(k, v) }`),
F('Medium', `Which backend/system design concepts should a frontend engineer understand?`,
  `The roads, traffic lights and warehouses behind the shop, so you can design screens that work with them.`,
  `<b>Load balancing</b> (spread traffic; sticky sessions for WebSockets), <b>caching</b> (browser, CDN, server, TTLs; stale data trade-offs), <b>CDN</b> (static assets at the edge), <b>API gateway</b> (single entry, auth, rate limiting), <b>rate limiting</b> (429 + Retry-After → client backoff), <b>message queues and pub/sub</b> (async work, real-time fan-out → design pending states), <b>circuit breakers</b> (fail fast → graceful degradation in UI), <b>idempotency</b> (safe retries), <b>sharding/consistent hashing</b> (how data is split), <b>autoscaling</b> and <b>statelessness</b>. In interviews: clarify functional and non-functional requirements, state trade-offs, assume failures and design the UI for them (retries, timeouts, partial results).`),
F('Hard', `Flash sale / Tatkal booking: thousands click "Book" at the same time for a few seats. What happens and what should the frontend do?`,
  `Everyone rushes to the counter; a queue and a lock make sure only the real winners get seats, and the screen keeps everyone informed.`,
  `<b>Backend:</b> load balancers spread traffic, requests enter queues, inventory is <b>locked/reserved atomically</b> (reserve → validate → pay → confirm, with reservation expiry), so seats can't be double-booked; rate limiting and bot protection keep the system stable; idempotency keys prevent duplicate bookings from retries. Being logged in early doesn't give priority; the order requests reach the server decides. <b>Frontend:</b> prepare everything before the sale (passenger details, payment method), server time (not device time) for the countdown, a virtual waiting room/queue position UI, disable buttons while pending and send an idempotency key, clear states (reserved with timer, failed, waitlisted), no auto-retry storms (backoff with jitter), handle session refresh gracefully, and keep the page light (static assets on CDN).`),
F('Medium', `How does a digital payment (UPI-style) flow stay safe with retries, double taps and failures?`,
  `Each payment has one unique ticket, so pressing twice still pays once; if something breaks, it either finishes or the money comes back.`,
  `Every payment has a unique transaction/order id used as an <b>idempotency key</b>, so duplicate requests (double tap, retries) are recognised and processed once. The flow moves through explicit states (initiated → pending → success/failed → refunded) with background reconciliation for "pending" cases. <b>Frontend:</b> generate/receive the order id before paying, disable the pay button while pending, poll or subscribe for the final status instead of trusting the redirect alone, show clear pending/failed/refund messages, never mark success until the server confirms, and never retry with a new id automatically.`),
F('Medium', `What is end-to-end encryption (e.g. in messaging apps) in simple terms?`,
  `The message is locked on your phone and only your friend's phone has the key; the post office can't open it.`,
  `Each device has a key pair; devices exchange public keys (key agreement) and derive shared secrets, so messages are encrypted on the sender's device and decrypted only on the recipient's. Servers relay ciphertext they can't read. Protocols like the Signal Protocol also rotate keys per message (forward secrecy), so one compromised key doesn't expose past messages. Media is encrypted the same way. Contrast with <b>TLS/HTTPS</b>, which encrypts only between client and server (the server can read the data).`),
F('Medium', `gRPC vs REST: what is gRPC and when would you use it?`,
  `REST is like ordering in plain language; gRPC is like using a strict, compact order code both sides agreed on.`,
  `gRPC is a remote procedure call framework: services and messages are defined in a <code>.proto</code> contract; generated client <b>stubs</b> make calls look like local functions; data is binary (Protocol Buffers) over HTTP/2 with streaming support. <b>Pros:</b> fast and compact, strong typing, bidirectional streaming, great for service-to-service communication. <b>Cons for browsers:</b> browsers can't speak raw gRPC, so web apps need gRPC-Web (and a proxy) or a REST/GraphQL gateway; harder to debug than JSON. Typical setup: microservices talk gRPC internally, the frontend uses REST/GraphQL via a gateway or BFF.`),
F('Medium', `What are service workers and how do they improve frontend applications (PWA)?`,
  `A helper that sits between the app and the internet, keeping copies so the app works fast and even offline.`,
  `A service worker is a script that runs in the background, separate from the page, and can intercept network requests. Uses: offline support and caching strategies (cache-first for static assets, network-first or stale-while-revalidate for API data), faster repeat visits, background sync, push notifications, and installable PWAs (with a web app manifest). Requires HTTPS. Pitfalls: stale cached code after deploys (version your caches, prompt users to refresh), caching private API responses, and debugging complexity. Tools: Workbox, vite-plugin-pwa.`),
F('Medium', `What is SSO and how does it relate to OAuth 2.0 / OpenID Connect?`,
  `Log in once at a trusted gate, and many apps let you in without asking for your password again.`,
  `<b>Single Sign-On</b> lets a user authenticate once with an identity provider (IdP) such as Okta, Azure AD/Entra ID, Google or Keycloak and access many applications. Apps redirect to the IdP; the IdP has its own session cookie, so later apps get tokens without a new login. Implemented with <b>OIDC</b> (identity on top of OAuth 2.0, returns an ID token) or <b>SAML</b> (XML, common in enterprises). OAuth 2.0 itself is about delegated <i>authorization</i> (access tokens for APIs); OIDC adds <i>authentication</i>. SPAs use Authorization Code + PKCE; logout may need single logout across apps.`),
F('Medium', `Which frontend security threats should every React developer know (clickjacking, secrets, dependencies)?`,
  `The bad guys try to run code in your page, trick clicks, steal secrets or sneak in through borrowed packages.`,
  `<b>XSS:</b> React escapes <code>{text}</code>; avoid <code>dangerouslySetInnerHTML</code> or sanitize with DOMPurify; validate URLs (block <code>javascript:</code> in href/src). <b>CSRF:</b> SameSite cookies, CSRF tokens. <b>Clickjacking:</b> the app loaded in a hidden iframe to trick clicks; prevent with <code>Content-Security-Policy: frame-ancestors 'none'</code> (or X-Frame-Options: DENY). <b>Man-in-the-middle:</b> HTTPS everywhere + HSTS. <b>Sensitive data exposure:</b> anything in client env vars (<code>VITE_</code>/<code>REACT_APP_</code>) is public in the bundle; keep secrets server-side; don't log tokens. <b>Tokens:</b> HttpOnly cookies, short lifetimes. <b>Dependencies:</b> <code>npm audit</code>, Dependabot/Snyk, lockfiles, avoid low-quality packages. Add a CSP and review security with every new feature and dependency.`),
F('Hard', `An AI-powered dashboard streams thousands of updates from multiple models. How do you design rendering, caching and state?`,
  `Lots of live numbers pour in; collect them, update only what changed, and keep the screen calm.`,
  `Treat it like a high-frequency real-time feed: one streaming connection per source (SSE/WebSocket, or fetch streams for token-by-token text), a normalized store keyed by entity/model so each update patches one record, batching and throttling of renders (flush per animation frame or every few hundred ms), selectors so each widget subscribes only to its slice, virtualization for long lists, Web Workers for heavy aggregation/parsing, <code>startTransition</code> for non-urgent updates, bounded in-memory history with downsampling for charts (e.g. keep 1 point per second), cancellation of obsolete streams, and backpressure (drop or coalesce intermediate values). Show stream status and partial results; handle reconnects and errors per widget.`),
F('Hard', `You introduce Server Components into an app that relies heavily on client state. How do you decide what moves to the server?`,
  `Keep the parts that react to clicks on the client; move the parts that just fetch and display data to the server.`,
  `Move to <b>Server Components</b>: data-fetching and display-heavy parts with little interactivity (product details, lists, markdown, layouts), components that use large libraries only for rendering (formatting, syntax highlighting), and anything needing secrets or direct data access. Keep as <b>Client Components</b>: anything with state, effects, event handlers, browser APIs, or that reads client stores (cart, filters with instant feedback, forms with live validation). Push the <code>'use client'</code> boundary down to leaf interactive components and pass server-rendered content as children. Migrate incrementally route by route; replace client-side fetch effects with server fetching; keep shared client state in providers wrapped around server trees; measure bundle size and TTFB/INP before and after.`),
F('Hard', `Large GraphQL responses cause high memory usage and slow updates. How do you optimise?`,
  `Ask only for what the screen needs, store each item once, and draw only what's visible.`,
  `<b>Fetch less:</b> request only needed fields (fragments colocated with components), paginate connections (cursor-based), avoid deep nested over-fetching, split queries per view, use <code>@defer</code>/<code>@stream</code> where supported. <b>Cache well:</b> normalized cache (Apollo/urql/Relay) with proper ids so each entity is stored once; garbage-collect/evict unused entries; tune fetch policies to avoid duplicate requests. <b>Render efficiently:</b> virtualize lists, memoize row components, select small slices of data, avoid deep-cloning large results. Measure with heap snapshots and the Profiler; consider persisted queries and server-side limits (query cost/depth).`),
F('Medium', `How do you monitor a React application in production and detect issues quickly?`,
  `Put alarms and cameras in the app so you know when users have problems before they tell you.`,
  `<b>Errors:</b> error tracking (Sentry, Datadog RUM) with source maps, release tags, user/session context and breadcrumbs; error boundaries report render errors; capture unhandled rejections. <b>Performance:</b> real-user monitoring of Core Web Vitals (web-vitals library → analytics), route-level timings, long tasks, API latency and failure rates. <b>Alerts:</b> thresholds per release (error rate spikes, LCP/INP regressions). <b>Logs and analytics:</b> structured client logs for key flows, funnel drop-offs. <b>Process:</b> canary releases, feature flags for quick rollback, synthetic checks (Playwright on schedule), dashboards reviewed after each deploy.`),
    ],
  });

  HUB.sections.find(s => s.id === 'behavioral').items.push(
{ lv: 'Behavioral', q: `How do you use AI in your daily development work, and how do you verify AI-generated code?`,
  k: `AI is a fast helper, but you are still the one who checks and decides.`,
  a: `Answer honestly with your real usage. <b>Where it helps:</b> boilerplate and repetitive code, explaining unfamiliar code or errors, drafting tests and documentation, refactoring suggestions, learning new APIs. <b>How you verify:</b> read and understand every line, run it, write or run tests, check edge cases, security (no secrets in prompts, no unsafe HTML), accessibility and performance, and compare with official docs, since AI can be confidently wrong or out of date. <b>Prompting:</b> give context (stack, versions, constraints), ask for small focused pieces, iterate. <b>What not to delegate:</b> architecture decisions, security-sensitive logic without review, understanding the business requirements, final responsibility for the code. If you've built AI features (chat, streaming responses, summarisation), describe the UX challenges: streaming rendering, loading/cancel states, errors and cost.` },
  );
})();
