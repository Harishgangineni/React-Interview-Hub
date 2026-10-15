HUB.guide({
  id: 'closures', title: 'Closures, scope, hoisting and this', level: 'Beginner → Senior', time: '45 min',
  intro: 'How JavaScript finds variables, why functions remember their surroundings, hoisting and the TDZ, how this is decided, and how all of it shows up in React.',
  related: 'closure scope hoisting this',
  prereq: ['Functions and variables', 'let / const / var'],
  concepts: [
    { h: 'Scope and the scope chain', lv: 'Easy', html: `<p>Global, function, block (let/const) and module scope. Lookup walks outward from the current scope to the global scope (lexical scope: decided by where code is written).</p>` },
    { h: 'Closures', lv: 'Easy', html: `<p>A function keeps access to variables from the scope where it was created, even after that scope finished.</p>`,
      code: `function counter() { let count = 0; return () => ++count }
const inc = counter(); inc(); inc()   // 2 — count lives on in the closure` },
    { h: 'Uses: privacy, factories, memoization', lv: 'Medium', html: `<p>Private state (module pattern), function factories (<code>makeAdder(5)</code>), memoize caches, debounce/throttle timers, event handler factories, React hooks (each render's handlers close over that render's props and state).</p>` },
    { h: 'Hoisting and the TDZ', lv: 'Medium', html: `<p>var: hoisted and initialised to undefined. Function declarations: fully hoisted. let/const/class: hoisted but in the temporal dead zone until their line (ReferenceError).</p>` },
    { h: 'Closures in loops', lv: 'Medium', html: `<p>var shares one binding across iterations, let creates one per iteration.</p>`,
      code: `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))   // 3 3 3
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j))   // 0 1 2` },
    { h: 'How this is decided', lv: 'Medium', html: `<p>By the call site: method call → the object; plain call → undefined (strict); new → the instance; call/apply/bind → given value; arrow functions → inherit from the enclosing scope.</p>` },
    { h: 'Stale closures in React', lv: 'Hard', html: `<p>Each render creates new handlers that capture that render's state. A callback created once (interval, subscription, memoized callback with missing deps) keeps reading old values. Fix with correct dependencies, functional updates, refs, or useEffectEvent.</p>` },
    { h: 'Closures and memory', lv: 'Hard', html: `<p>Closures keep their captured variables alive. Long-lived listeners or caches capturing large data can leak memory; remove listeners and avoid capturing more than needed.</p>` },
  ],
  mistakes: ['Expecting var in loops to capture each value', 'Using variables before let/const declarations', 'Passing object methods as callbacks and losing this', 'Stale state in intervals and memoized callbacks', 'Closures accidentally holding large objects'],
  qa: [
    { q: 'What is a closure?', a: 'A function together with the variables of the scope it was created in, which stay accessible after that scope ends.' },
    { q: 'Give a practical use of closures.', a: 'Data privacy (counter, module pattern), function factories, memoization caches, debounce/throttle, React hooks and event handlers.' },
    { q: 'What is the temporal dead zone?', a: 'The time between entering a scope and the let/const declaration line, during which accessing the variable throws a ReferenceError.' },
  ],
  scenarios: [{ q: 'A click handler logs an old count after several clicks.', a: 'It was memoized with useCallback and an empty dependency array, so it closes over the first render\'s count. Add count to the dependencies or use a functional update.' }],
  exercises: [
    { lv: 'Easy', task: 'Write <code>once(fn)</code> that runs fn only on the first call and returns the same result afterwards.', hint: 'Keep a flag and result in the closure.',
      solution: `function once(fn) {
  let called = false, result
  return function (...args) {
    if (!called) { called = true; result = fn.apply(this, args) }
    return result
  }
}`, explain: 'called and result live in the closure, shared by every call of the returned function.' },
    { lv: 'Medium', task: 'Write <code>memoize(fn)</code> for single-argument functions using a Map.', hint: 'Cache lookups by argument.',
      solution: `function memoize(fn) {
  const cache = new Map()
  return x => { if (!cache.has(x)) cache.set(x, fn(x)); return cache.get(x) }
}`, explain: 'The Map persists between calls because the returned arrow function closes over it.' },
  ],
  followups: [{ q: 'How do closures relate to React hooks?', a: 'Every render is a function call with its own props/state; handlers and effects close over that snapshot, which is why dependencies and functional updates matter.' }],
  summary: ['Lexical scope + scope chain', 'Closure = function + remembered variables', 'var hoisted as undefined; let/const TDZ', 'let per-iteration binding in loops', 'this decided by call site; arrows inherit', 'Stale closures: deps, functional updates, refs'],
  quiz: [
    { q: 'for (var i=0;i<3;i++) setTimeout(()=>console.log(i)) prints?', options: ['0 1 2', '3 3 3', 'undefined ×3', 'Error'], answer: 1, why: 'One shared var binding, which is 3 when the callbacks run.' },
    { q: 'Accessing a let variable before its declaration gives?', options: ['undefined', 'null', 'ReferenceError', '0'], answer: 2, why: 'It is in the temporal dead zone.' },
    { q: 'An arrow function\'s this is…', options: ['The caller', 'Always window', 'Inherited from the enclosing scope', 'undefined always'], answer: 2, why: 'Arrows have no own this.' },
  ],
});

HUB.guide({
  id: 'event-loop', title: 'Event loop, promises and async/await', level: 'Beginner → Senior', time: '45 min',
  intro: 'How single-threaded JavaScript handles async work: call stack, Web APIs, microtasks vs macrotasks, promises, async/await, error handling and output questions.',
  related: 'event loop promise async await microtask',
  prereq: ['Functions and callbacks', 'Closures'],
  concepts: [
    { h: 'Call stack and Web APIs', lv: 'Easy', html: `<p>JS runs one thing at a time on the call stack. Timers, network and events are handled by the browser (Web APIs); their callbacks are queued when ready.</p>` },
    { h: 'Microtasks vs macrotasks', lv: 'Medium', html: `<p>Microtasks: promise reactions, queueMicrotask, MutationObserver. Macrotasks: setTimeout, setInterval, events, I/O. After each macrotask the loop drains <b>all</b> microtasks, may render, then takes the next macrotask.</p>`,
      code: `console.log(1)
setTimeout(() => console.log(2))
Promise.resolve().then(() => console.log(3))
queueMicrotask(() => console.log(4))
console.log(5)
// 1 5 3 4 2` },
    { h: 'Promises', lv: 'Easy', html: `<p>An object for a future value: pending → fulfilled or rejected, settled once. Chain with then/catch/finally; errors propagate to the nearest catch.</p>` },
    { h: 'Promise combinators', lv: 'Medium', html: `<p><code>all</code> (all succeed, fail fast), <code>allSettled</code> (every result), <code>race</code> (first settled), <code>any</code> (first success).</p>` },
    { h: 'async/await', lv: 'Medium', html: `<p>async functions return promises; await pauses the function (not the thread). Use try/catch; avoid accidental sequential awaits for independent work.</p>`,
      code: `// sequential (slow)
const a = await getA(); const b = await getB()
// parallel
const [a2, b2] = await Promise.all([getA(), getB()])` },
    { h: 'Error handling and unhandled rejections', lv: 'Hard', html: `<p>Always handle rejections (catch or try/catch); use <code>unhandledrejection</code> listeners for monitoring; a forEach with async callbacks doesn't wait (use for...of or Promise.all).</p>` },
    { h: 'Keeping the main thread free', lv: 'Hard', html: `<p>Long synchronous work blocks rendering and input (poor INP). Break work into chunks (scheduler.yield or setTimeout), use Web Workers for heavy computation.</p>` },
  ],
  mistakes: ['Thinking setTimeout(fn, 0) runs immediately', 'Forgetting microtasks run before timers', 'Awaiting independent calls one by one', 'async callbacks in forEach', 'Unhandled promise rejections', 'Blocking the main thread with heavy loops'],
  qa: [
    { q: 'Explain the event loop.', a: 'Synchronous code runs on the call stack; async callbacks wait in queues. When the stack is empty, the loop runs all microtasks (promises), lets the browser render, then runs the next macrotask (timers, events), and repeats.' },
    { q: 'Promise.all vs allSettled?', a: 'all rejects as soon as one fails; allSettled waits for all and reports each status.' },
    { q: 'Difference between promises and async/await?', a: 'Same mechanism; async/await is syntax that makes promise code read top-to-bottom with try/catch.' },
  ],
  scenarios: [{ q: 'A page shows data from two APIs and takes the sum of both latencies.', a: 'The calls are awaited sequentially. Start both and await Promise.all (or allSettled if partial data is acceptable).' }],
  exercises: [
    { lv: 'Medium', task: 'Predict the output: <code>setTimeout(()=>log("A")); Promise.resolve().then(()=>log("B")); (async()=>{ log("C"); await null; log("D") })(); log("E")</code>', hint: 'Synchronous first, then microtasks, then timers.',
      solution: `// C E B D A`, explain: 'C and E are synchronous; B and the continuation after await (D) are microtasks in queue order; A is a macrotask.' },
    { lv: 'Hard', task: 'Write <code>sleep(ms)</code> and <code>retry(fn, times)</code> that retries an async function with exponential backoff.', hint: 'Loop with try/catch and await sleep(2 ** attempt * 100).',
      solution: `const sleep = ms => new Promise(r => setTimeout(r, ms))
async function retry(fn, times = 3) {
  for (let attempt = 0; ; attempt++) {
    try { return await fn() }
    catch (e) { if (attempt >= times - 1) throw e; await sleep(2 ** attempt * 100) }
  }
}`, explain: 'Each failure waits longer before the next attempt; after the last attempt the error is re-thrown.' },
  ],
  followups: [{ q: 'Where does rendering happen in the event loop?', a: 'Between tasks, after microtasks are drained; long tasks or endless microtasks delay rendering.' }],
  summary: ['One call stack; async via queues', 'Microtasks (promises) before macrotasks (timers)', 'Promise states; then/catch/finally', 'all / allSettled / race / any', 'await pauses the function, not the thread', 'Parallelise independent work', 'Handle every rejection'],
  quiz: [
    { q: 'Which runs first?', options: ['setTimeout callback', 'Promise.then callback', 'They are random', 'Whichever was written first'], answer: 1, why: 'Microtasks run before the next macrotask.' },
    { q: 'Which rejects as soon as one promise fails?', options: ['Promise.all', 'Promise.allSettled', 'Promise.any', 'None'], answer: 0, why: 'all is fail-fast.' },
  ],
});

HUB.guide({
  id: 'playwright', title: 'Playwright: end-to-end and API testing', level: 'Intermediate → Senior', time: '50 min',
  intro: 'Set up Playwright, write reliable tests with locators and web-first assertions, fixtures, authentication, network mocking, API tests, debugging traces and CI.',
  related: 'end-to-end testing E2E Cypress Playwright',
  prereq: ['How your app works end to end', 'async/await', 'Basic testing ideas (arrange, act, assert)'],
  concepts: [
    { h: 'What Playwright is', lv: 'Easy', html: `<p>A Microsoft test framework that drives Chromium, Firefox and WebKit, with auto-waiting, parallel workers, trace viewer, codegen, API testing and component testing.</p>`,
      code: `npm init playwright@latest
npx playwright test          # run
npx playwright test --ui     # UI mode
npx playwright codegen http://localhost:5173` },
    { h: 'Locators and web-first assertions', lv: 'Easy', html: `<p>Find elements the way users do (<code>getByRole</code>, <code>getByLabel</code>, <code>getByText</code>, <code>getByTestId</code> last). Assertions like <code>toBeVisible</code> and <code>toHaveText</code> retry automatically, so no manual sleeps.</p>`,
      code: `import { test, expect } from '@playwright/test'
test('user can log in', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('asha@example.com')
  await page.getByLabel('Password').fill('secret123')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})` },
    { h: 'Configuration', lv: 'Medium', html: `<p><code>playwright.config.js</code>: baseURL, projects (browsers/devices), retries in CI, trace/screenshot/video settings, webServer to start the app, timeouts.</p>`,
      code: `export default defineConfig({
  use: { baseURL: 'http://localhost:5173', trace: 'on-first-retry' },
  retries: process.env.CI ? 2 : 0,
  webServer: { command: 'npm run dev', url: 'http://localhost:5173', reuseExistingServer: !process.env.CI },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})` },
    { h: 'Fixtures and the Page Object pattern', lv: 'Medium', html: `<p>Fixtures provide isolated setup per test (page, request, custom fixtures like a logged-in user or seeded data). Page objects wrap selectors and actions for readability.</p>`,
      code: `const test = base.extend({
  todoPage: async ({ page }, use) => { const p = new TodoPage(page); await p.goto(); await use(p) },
})` },
    { h: 'Authentication', lv: 'Medium', html: `<p>Log in once in a setup project, save <code>storageState</code> to a file, and reuse it in tests so each test doesn't log in through the UI.</p>` },
    { h: 'Network mocking and API testing', lv: 'Hard', html: `<p><code>page.route</code> intercepts requests to return fixtures or errors (test error states deterministically). The <code>request</code> fixture calls APIs directly for API tests or fast data setup.</p>`,
      code: `await page.route('**/api/users', route => route.fulfill({ status: 500, json: { message: 'Server down' } }))
await page.goto('/users')
await expect(page.getByRole('alert')).toHaveText(/server down/i)

test('API: create user', async ({ request }) => {
  const res = await request.post('/api/users', { data: { name: 'Asha' } })
  expect(res.status()).toBe(201)
})` },
    { h: 'Debugging and flakiness', lv: 'Hard', html: `<p>Trace viewer (DOM snapshots, network, console per step), <code>--debug</code>, UI mode. Flakiness comes from fixed waits, shared data, order dependence, animations, real third-party calls. Fix the cause; retries are a safety net, not a fix.</p>` },
    { h: 'CI', lv: 'Hard', html: `<p>Install browsers with <code>npx playwright install --with-deps</code>, run in parallel with sharding (<code>--shard=1/4</code>), upload the HTML report and traces as artifacts, run a smoke suite on every PR and the full suite nightly.</p>` },
  ],
  mistakes: ['page.waitForTimeout instead of web-first assertions', 'CSS/XPath selectors tied to styling', 'Tests depending on each other or shared accounts', 'Logging in through the UI in every test', 'Calling real third-party services', 'Ignoring traces when debugging CI failures'],
  qa: [
    { q: 'Playwright vs Cypress?', a: 'Playwright: multiple browser engines including WebKit, multi-tab/multi-origin support, parallel workers out of the box, API testing, trace viewer. Cypress: in-browser runner with a great time-travel UI and a strong component-testing story. Both are solid; Playwright is very popular for new projects.' },
    { q: 'How does auto-waiting work?', a: 'Actions wait for the element to be attached, visible, stable, enabled and able to receive events; web-first assertions retry until the condition holds or the timeout expires.' },
    { q: 'How do you handle authentication in Playwright tests?', a: 'A setup project logs in once (UI or API) and saves storageState; tests use that state. Use separate accounts per worker if tests mutate user data.' },
  ],
  scenarios: [{ q: 'A test passes locally but fails in CI.', a: 'Open the trace from the failed retry; check timing assumptions, shared data between workers, viewport/locale/timezone differences and env vars. See the Scenarios section for the full answer.' }],
  exercises: [
    { lv: 'Medium', task: 'Write a test that mocks <code>/api/todos</code> to return two items and checks both are listed.', hint: 'page.route + route.fulfill with json.',
      solution: `test('lists todos', async ({ page }) => {
  await page.route('**/api/todos', r => r.fulfill({ json: [{ id: 1, title: 'Buy milk' }, { id: 2, title: 'Write tests' }] }))
  await page.goto('/todos')
  await expect(page.getByRole('listitem')).toHaveCount(2)
  await expect(page.getByText('Write tests')).toBeVisible()
})`, explain: 'Mocking makes the test fast and deterministic; toHaveCount retries until the list renders.' },
  ],
  followups: [{ q: 'How do you keep an E2E suite fast?', a: 'Parallel workers and sharding, API-based setup, storageState auth, mocking third parties, smoke vs full suites, and pushing most coverage down to unit/integration tests.' }],
  summary: ['Locators by role/label/text', 'Web-first assertions auto-wait; no sleeps', 'Config: baseURL, webServer, retries, trace', 'Fixtures + storageState auth', 'page.route mocks; request fixture for APIs', 'Trace viewer for CI failures', 'Shard and parallelise in CI'],
  quiz: [
    { q: 'Best locator for a Save button?', options: ['page.locator(".btn-primary")', 'page.getByRole("button", { name: "Save" })', 'XPath //button[2]', 'page.waitForTimeout(1000)'], answer: 1, why: 'Role-based locators are resilient and accessible.' },
    { q: 'How do you avoid logging in for every test?', options: ['Disable auth', 'Reuse saved storageState', 'Use waitForTimeout', 'Share one browser tab'], answer: 1, why: 'storageState stores cookies and localStorage from a login.' },
    { q: 'First thing to check for a CI-only failure?', options: ['Rewrite the test', 'The trace and screenshots from CI', 'Increase all timeouts', 'Delete the test'], answer: 1, why: 'The trace shows exactly what the browser saw.' },
  ],
});
