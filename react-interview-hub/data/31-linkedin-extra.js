/* Topics from LinkedIn posts and interview experiences the user pasted. Answers written for this hub. Appended so existing ids stay stable. */
(function () {
  const sec = id => HUB.sections.find(s => s.id === id).items;

  sec('javascript').push(
{ lv: 'Medium', q: `Is setTimeout synchronous or asynchronous, and why doesn't setTimeout(fn, 0) run immediately?`,
  k: `Setting the alarm happens now; the alarm rings later, and only when the helper is free.`,
  a: `Calling <code>setTimeout</code> is synchronous: it registers a timer with the browser/Node (not the JS engine) and returns an id. The callback is asynchronous: when the delay passes it goes to the task (macrotask) queue and runs only when the call stack is empty and all microtasks (promises) have run. The delay is a <b>minimum</b>, not a guarantee; 0 means "as soon as possible after current work". Browsers also clamp nested timers (≥ 4 ms after 5 levels) and throttle timers in background tabs.`,
  c: `setTimeout(() => console.log('timeout'), 0)
Promise.resolve().then(() => console.log('promise'))
console.log('sync')
// sync → promise → timeout` },
{ lv: 'Medium', q: `setInterval vs recursive setTimeout: what happens when the callback is slower than the interval?`,
  k: `setInterval rings on a schedule even if you're still busy; recursive setTimeout sets the next alarm only after you finish.`,
  a: `setInterval schedules runs at fixed intervals regardless of how long each run takes, so slow (especially async) work can pile up or overlap. Recursive setTimeout schedules the next run after the current one finishes, guaranteeing a gap, which is safer for polling APIs. Always clear timers (clearInterval/clearTimeout) on unmount in React.`,
  c: `async function poll() {
  try { await refresh() } finally { timer = setTimeout(poll, 5000) }   // next run starts 5s after this one ends
}
let timer = setTimeout(poll, 0)
// cleanup: clearTimeout(timer)` },
{ lv: 'Hard', q: `What is timer drift, why do background tabs slow timers, and when should you use requestAnimationFrame?`,
  k: `Alarm clocks slowly run late, sleep when you're not looking, and animations should follow the screen's own heartbeat.`,
  a: `<b>Drift:</b> each callback runs a little late (busy main thread, rendering, queue), and with setInterval-based counting the error accumulates; compute elapsed time from <code>Date.now()</code>/<code>performance.now()</code> instead of counting ticks. <b>Background tabs:</b> browsers throttle timers (often to ≥ 1 s, more for long-hidden tabs) to save CPU/battery, so don't rely on timers for exact timing; use the Page Visibility API to pause/resume. <b>requestAnimationFrame</b> runs right before the browser paints (~every frame), pauses in hidden tabs, and gives a timestamp, so it's the right tool for animations and visual updates.`,
  c: `function animate(el) {
  const start = performance.now()
  function frame(now) {
    const p = Math.min(1, (now - start) / 1000)
    el.style.transform = \`translateX(\${p * 200}px)\`
    if (p < 1) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}` },
{ lv: 'Medium', q: `Can timers cause memory leaks? How do you clean them up in React?`,
  k: `An alarm that keeps ringing after you've left the room keeps your old toys from being tidied away.`,
  a: `Yes: a pending timer keeps its callback and everything it closes over alive; intervals keep running forever; in React they may also update state of an unmounted component or use stale values. Store the id and clear it in the effect cleanup; use refs for ids you start in handlers; prefer libraries (React Query refetchInterval) for polling.`,
  c: `useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)
}, [])` },
{ lv: 'Easy', q: `What is the difference between ~ and ^ in package.json version ranges?`,
  k: `^ says "any newer version that isn't a big change"; ~ says "only tiny fixes".`,
  a: `Semantic versioning is MAJOR.MINOR.PATCH. <b>^1.4.2</b> allows <code>&gt;=1.4.2 &lt;2.0.0</code> (minor and patch updates; npm's default). <b>~1.4.2</b> allows <code>&gt;=1.4.2 &lt;1.5.0</code> (patch only). Special case: for 0.x versions, <code>^0.4.2</code> means <code>&lt;0.5.0</code> because 0.x minors can break. Exact <code>1.4.2</code> pins it. The lockfile (package-lock.json) records exact installed versions, so commit it and use <code>npm ci</code> in CI.` },
{ lv: 'Medium', q: `Implement Array.prototype.flat with a depth parameter.`,
  k: `Open boxes inside the box, but only as many layers deep as you're told.`,
  a: `Recursively spread nested arrays while depth &gt; 0; default depth 1; <code>Infinity</code> flattens fully. Skip holes like the native method.`,
  c: `function flat(arr, depth = 1) {
  return depth > 0
    ? arr.reduce((acc, v) => acc.concat(Array.isArray(v) ? flat(v, depth - 1) : [v]), [])
    : arr.slice()
}
flat([1, [2, [3, [4]]]], 1)          // [1, 2, [3, [4]]]
flat([1, [2, [3, [4]]]], Infinity)   // [1, 2, 3, 4]` },
  );

  sec('advanced').push(
{ lv: 'Medium', q: `What is automatic batching in React 18? What happens with setCount(count + 1) three times?`,
  k: `React collects all your "please change" notes and redraws once; three notes that each say "make it 1" still only make 1.`,
  a: `<b>Batching:</b> React groups several state updates into one re-render. Before React 18 this happened only inside React event handlers; since React 18 (with <code>createRoot</code>) it is <b>automatic everywhere</b>: timeouts, promises, native event handlers. <b>Three setCount(count + 1) calls</b> in one handler all read the same snapshot (<code>count</code> = 0), so each schedules "set to 1": result 1, one render. Use the updater form <code>setCount(c =&gt; c + 1)</code> three times to get 3, still one render. Opt out with <code>flushSync</code> when you must read the DOM immediately after an update.`,
  c: `function Counter() {
  const [count, setCount] = useState(0)
  function addThree() {
    setCount(count + 1); setCount(count + 1); setCount(count + 1)   // → 1 (same snapshot)
  }
  function addThreeCorrectly() {
    setCount(c => c + 1); setCount(c => c + 1); setCount(c => c + 1) // → 3
  }
  // both cause ONE re-render thanks to batching
}`,
  t: `Follow-up: "Is state updated right after setCount?" No, it's a snapshot; the new value appears on the next render.` },
{ lv: 'Medium', q: `Interview trap: does React.memo stop a component from re-rendering?`,
  k: `memo only skips redrawing when the instructions look the same; the brick still redraws if its own toys or a loudspeaker change.`,
  a: `No. React.memo skips a re-render <b>only</b> when the parent re-renders and all props are shallowly equal (primitives by value; objects, arrays and functions by reference). It does <b>not</b> stop re-renders caused by the component's own state, a context it reads, or a parent passing new references (inline objects <code>{}</code>, arrays <code>[]</code>, functions <code>() =&gt; {}</code>). Fix those with useMemo/useCallback or by moving them out of render. memo adds a comparison cost, so use it for components that are expensive or render often with the same props, after measuring. The React Compiler can handle this automatically.`,
  c: `const Child = memo(function Child({ style, onClick }) { console.log('Child render'); return <button style={style} onClick={onClick}>Child</button> })
function Parent() {
  const [n, setN] = useState(0)
  return <><button onClick={() => setN(n + 1)}>{n}</button>
    <Child style={{ color: 'red' }} onClick={() => {}} /></>   // ❌ new object + new function each render → Child re-renders every click
}
// ✅ const style = useMemo(() => ({ color: 'red' }), []); const onClick = useCallback(() => {}, [])`,
  t: `Classic follow-up: "Will Child re-render on each click?" Yes, because style and onClick are new references every render. With stable references, no.` },
{ lv: 'Medium', q: `If custom hooks can reuse logic, when do we still need Redux?`,
  k: `A custom hook shares how to do something; Redux shares the actual stuff everyone looks at.`,
  a: `A custom hook shares <b>logic</b>, but each component that calls it gets its <b>own</b> state; two components using <code>useCart()</code> would have two different carts unless the hook reads from a shared store or context. Redux (or Zustand/Context) shares <b>one state</b> across the app, with predictable updates, middleware, DevTools/time travel and selectors to limit re-renders. Use custom hooks for reusable behaviour (useDebounce, useFetch); use a shared store for global client state many unrelated components read and update; use React Query/RTK Query for server data. Often you combine them: a custom hook that wraps <code>useSelector</code>/<code>useDispatch</code>.`,
  c: `// Shared state through Redux, nicely wrapped in a custom hook
export function useCart() {
  const items = useAppSelector(s => s.cart.items)
  const dispatch = useAppDispatch()
  return { items, add: item => dispatch(added(item)), remove: id => dispatch(removed(id)) }
}` },
{ lv: 'Medium', q: `How would you implement role-based access control (RBAC) in a React app?`,
  k: `Each person has a badge; the app shows only the doors their badge opens, and the guard at each door checks again.`,
  a: `The <b>server</b> enforces permissions on every API call (the frontend is only UX). In the frontend: get the user's roles/permissions after login (from the token claims or a <code>/me</code> endpoint); map roles to permissions (<code>invoice:delete</code>) rather than checking role names everywhere; protect routes with a guard layout route (redirect to login if not authenticated, show 403 if not allowed); hide or disable actions with a <code>&lt;Can&gt;</code> component or <code>usePermission</code> hook; filter navigation menus by permission; refresh permissions when they change; handle 403 responses gracefully.`,
  c: `const can = (user, permission) => !!user?.permissions?.includes(permission)
function RequirePermission({ permission }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return can(user, permission) ? <Outlet /> : <Forbidden />
}
// routes: { element: <RequirePermission permission="reports:view" />, children: [{ path: 'reports', element: <Reports /> }] }
function Can({ permission, children, fallback = null }) { const { user } = useAuth(); return can(user, permission) ? children : fallback }` },
{ lv: 'Hard', q: `Write simple polyfills (implementations) of useMemo and useCallback.`,
  k: `Remember the last answer and its ingredients; if the ingredients didn't change, hand back the same answer.`,
  a: `Store the last dependencies and value in a ref; on each render compare deps with <code>Object.is</code> item by item; recompute only if they changed. useCallback is useMemo returning the function itself. (Real React stores this on the fiber's hook list; this shows the idea.)`,
  c: `function depsChanged(prev, next) {
  return !prev || prev.length !== next.length || next.some((d, i) => !Object.is(d, prev[i]))
}
function useMyMemo(factory, deps) {
  const ref = useRef(null)   // { deps, value }
  if (!ref.current || depsChanged(ref.current.deps, deps)) ref.current = { deps, value: factory() }
  return ref.current.value
}
const useMyCallback = (fn, deps) => useMyMemo(() => fn, deps)` },
{ lv: 'Hard', q: `How would you handle 3 lakh (300,000) records in a React application?`,
  k: `Don't carry the whole library home; ask for one shelf at a time and only look at the books in front of you.`,
  a: `Don't send or render all of them. <b>1) API:</b> server-side pagination (cursor-based for large or changing data) so the client receives only what it needs. <b>2) Server-side filtering, sorting and search</b> instead of processing 300k rows in the browser; debounce search input. <b>3) Virtualization</b> (TanStack Virtual, react-window) when users scroll long lists, so only visible rows are in the DOM. <b>4) Caching</b> pages with React Query; prefetch the next page. <b>5)</b> If heavy client processing is unavoidable, use a Web Worker; stream/export large files on the server. Remember: pagination reduces data transferred, virtualization reduces DOM, server-side operations reduce client CPU, caching avoids refetching; use them together.`,
  c: `const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['records', filters],
  queryFn: ({ pageParam, signal }) => api.get('/records', { params: { ...filters, cursor: pageParam, limit: 100 }, signal }).then(r => r.data),
  initialPageParam: null,
  getNextPageParam: last => last.nextCursor ?? undefined,
})
// rows = data.pages.flatMap(p => p.items) → render with a virtualizer; fetchNextPage when near the end` },
{ lv: 'Medium', q: `How would you optimise a page that makes many API calls?`,
  k: `Send helpers to the shop at the same time, don't send two for the same thing, and keep what they bring back.`,
  a: `Measure first (Network tab waterfall). Then: run independent calls in <b>parallel</b> (Promise.all / parallel queries) instead of sequentially; <b>deduplicate and cache</b> with React Query/RTK Query (shared keys, staleTime); <b>prefetch</b> data for likely next screens; <b>lazy-load</b> below-the-fold widgets (fetch when visible); <b>batch or aggregate</b> requests with a backend-for-frontend or GraphQL endpoint; avoid waterfalls caused by nested components fetching in effects (fetch in route loaders or at the parent); debounce user-triggered calls; cancel stale requests; use HTTP caching (ETag) and compression; show skeletons per section so the page isn't blocked by the slowest call.` },
{ lv: 'Hard', q: `How would you architect a frontend serving over a million users a day?`,
  k: `Make the shop fast for everyone: ready-made pages close to people, small bags to carry, and alarms when something breaks.`,
  a: `<b>Delivery:</b> CDN for static assets and cached pages (SSG/ISR), SSR/streaming only where personalisation needs it, HTTP/2-3, compression, long-cache hashed assets. <b>Performance budgets:</b> code splitting per route, small bundles, image optimisation, Core Web Vitals tracked per release. <b>Data:</b> caching layer (React Query), pagination, BFF/API gateway, rate-limit handling with retries and backoff. <b>Resilience:</b> error boundaries, graceful degradation, feature flags and canary releases, fast rollback. <b>Observability:</b> RUM (web-vitals), error tracking with source maps (Sentry), logging and alerts. <b>Scale of the team:</b> feature-based architecture or micro-frontends where teams are independent, shared design system, CI with tests, accessibility and security (CSP, dependency audits) built in.` },
  );

  sec('auth').push(
{ lv: 'Medium', q: `What is the structure of a JWT, and is its payload secret?`,
  k: `A JWT is a sealed note with three parts: what kind of seal, the message, and the seal itself. Anyone can read the message; the seal only proves nobody changed it.`,
  a: `<code>header.payload.signature</code>, each Base64URL-encoded. <b>Header:</b> token type (<code>typ</code>) and signing algorithm (<code>alg</code>, e.g. RS256). <b>Payload:</b> claims: registered ones like <code>sub</code> (subject/user id), <code>iss</code> (issuer), <code>aud</code> (audience), <code>exp</code> (expiry), <code>iat</code>, plus carefully chosen custom claims (roles). <b>Signature:</b> signs header + payload with a secret (HS256) or private key (RS256/ES256), so the server can detect tampering. The payload is <b>encoded, not encrypted</b>: anyone with the token can decode it, so never put passwords or sensitive data in it. Security comes from verifying the signature and claims (exp, iss, aud, allowed algorithms), short expiry, HTTPS, secure storage, key rotation and revocation strategy (refresh tokens, deny lists).`,
  c: `// decoding is NOT verifying — never trust these claims on the client for security decisions
const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))` },
  );

  sec('behavioral').push(
{ lv: 'Behavioral', q: `How do you balance technical debt, bug fixes and new feature delivery?`,
  k: `Keep the house clean enough to live in while still building new rooms.`,
  a: `Make debt visible (tickets in Azure Boards/Jira with impact), prioritise by risk and cost to the business (debt that slows every feature or causes bugs first), use the boy-scout rule (improve code you touch), reserve a regular share of each sprint for debt, bundle refactors with related features, and explain trade-offs to the product owner in terms of delivery speed and incidents. Critical bugs come first; never let "temporary" hacks go undocumented. Add a real example: "[a refactor you did alongside a feature]".` },
{ lv: 'Behavioral', q: `Tell me about a time you disagreed with your manager, or design and backend disagreed with your approach.`,
  k: `You disagreed politely, showed facts, listened, and agreed on what was best for users.`,
  a: `<b>STAR:</b> situation (what was proposed), your concern (with facts: user impact, effort, risk, performance, accessibility), how you raised it (privately, respectfully, with options or a quick prototype), how you listened to their constraints, the decision (yours, theirs or a compromise) and the result. If design and backend disagree with your implementation, bring all three together, compare options against requirements, and let the owner decide; then commit fully. Use a real example: "[when you suggested a reusable component / different API shape / design change]".` },
{ lv: 'Behavioral', q: `How do you choose between rewriting and refactoring legacy code?`,
  k: `Usually fix the old house room by room; only rebuild it when it can't be fixed safely.`,
  a: `Default to <b>incremental refactoring</b>: it keeps the product working, delivers value continuously and lowers risk. Add tests around the area first, then improve in small PRs (strangler pattern: new code replaces old piece by piece, e.g. class components → hooks, Redux → RTK). Consider a <b>rewrite</b> only when the technology is unsupported, changes have become dangerously slow, and the scope is small enough to finish; even then migrate in phases behind feature flags. Explain the decision with cost, risk and timeline, not preference.` },
{ lv: 'Behavioral', q: `What do you know about cloud platforms, deployment and production environments?`,
  k: `Explain how your code gets from your computer to real users, safely.`,
  a: `Answer from what you've actually done: your resume shows <b>Azure DevOps</b> (CI/CD, Azure Boards) for deploying code. Explain the pipeline: commit → PR review → build (install, lint, test, production build) → deploy to environments (dev → QA/staging → production) → monitoring. Mention environment variables per environment, build-time vs runtime config, static hosting with a CDN (Azure Static Web Apps/Blob + CDN, AWS S3 + CloudFront, Netlify/Vercel), cache-busting with hashed files, SPA fallback for routes, rollback strategy and error monitoring. If you've used AWS Lambda or other services, say exactly how; if not, say so and explain the concepts.` },
{ lv: 'Behavioral', q: `Why do you want to join our company?`,
  k: `Show you know what they do, and connect it to what you're good at and want to learn.`,
  a: `Research the company and product before the interview. <b>Structure:</b> what attracts you about their product/users/engineering (be specific), how your experience fits (React, reusable components, Redux, working closely with backend/QA on products like Signulu), and what you want to grow into (e.g. larger-scale architecture, performance, testing). Avoid salary-only or generic answers ("it's a big company").` },
{ lv: 'Behavioral', q: `How do you review a pull request that works but has maintainability or performance concerns?`,
  k: `Say what's good, explain the risk kindly, and suggest a better way.`,
  a: `Acknowledge what works, then explain each concern with its impact (harder to change, re-renders on every keystroke, duplicated logic) and a concrete suggestion or example; separate blocking issues from suggestions (prefix "nit:"); offer to pair on bigger changes; if it's urgent, agree on merging with a follow-up ticket. Focus on code, not the person, and follow team conventions documented in a checklist/linters so reviews stay consistent.` },
  );
})();
