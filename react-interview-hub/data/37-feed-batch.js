/* LinkedIn feed batch the user collected (posts, images, and the question list of a "100 JavaScript console questions" PDF).
   The PDF is copyrighted, so only its question topics are used; all answers are written for this hub. Appended to keep ids stable. */
(function () {
  const sec = id => HUB.sections.find(s => s.id === id).items;

  sec('advanced').push(
{ lv: 'Medium', q: `What is the difference between a React Node, a React Element and a React Component?`,
  k: `A component is the recipe, an element is one dish described on paper, and a node is anything that can go on the table.`,
  a: `A <b>component</b> is a function (or class) that returns UI: <code>function Card(props) {…}</code>. An <b>element</b> is the plain, immutable object describing what to render, created by JSX or <code>createElement</code>: <code>&lt;Card title="Hi" /&gt;</code> → <code>{ type: Card, props: { title: 'Hi' } }</code>. A <b>node</b> (<code>ReactNode</code>) is anything React can render: elements, strings, numbers, arrays/fragments, portals, <code>null</code>, booleans. Components produce elements; elements form the tree React reconciles.` },
{ lv: 'Medium', q: `createElement vs cloneElement: what's the difference and when would you use cloneElement?`,
  k: `createElement makes a new toy from a recipe; cloneElement copies an existing toy and swaps a few parts.`,
  a: `<code>React.createElement(type, props, ...children)</code> creates a new element (what JSX compiles to). <code>React.cloneElement(element, extraProps, ...children)</code> copies an existing element, shallow-merging new props (keeping its key and ref unless overridden). It was used to inject props into <code>children</code> (e.g. a Tabs parent adding <code>isActive</code>). It's now considered a legacy pattern: it's fragile (breaks with wrappers/fragments) and hides data flow; prefer render props, context (compound components) or explicit props.`,
  c: `function Toolbar({ children }) {
  return Children.map(children, child => cloneElement(child, { size: 'small' }))   // legacy pattern
}` },
{ lv: 'Medium', q: `What does useImperativeHandle do, and when should you use it?`,
  k: `It lets a parent press only a few chosen buttons on a child, instead of reaching inside it.`,
  a: `It customises what a parent gets through a <code>ref</code>: instead of the raw DOM node, you expose a small imperative API (focus, scrollToBottom, open, reset). In React 19 the child receives <code>ref</code> as a prop (no forwardRef needed). Use it sparingly for genuinely imperative actions (focus, media playback, scrolling, animations); prefer props and state for everything else.`,
  c: `function SearchInput({ ref, ...props }) {
  const inputRef = useRef(null)
  useImperativeHandle(ref, () => ({ focus: () => inputRef.current.focus(), clear: () => { inputRef.current.value = '' } }), [])
  return <input ref={inputRef} {...props} />
}
// parent: const search = useRef(null); search.current.focus()` },
{ lv: 'Medium', q: `What is the Flux pattern, and how does one-way data flow help?`,
  k: `Messages go one way around a circle: click → message → store → screen, so it's easy to see why something changed.`,
  a: `Flux (from Facebook, 2014) is an architecture with <b>unidirectional data flow</b>: Views dispatch <b>actions</b> → a <b>dispatcher</b> sends them to <b>stores</b> → stores update state and notify views → views re-render. Redux simplified it to one store and pure reducers (no dispatcher). Benefits: predictable updates, easy debugging/time travel, clear ownership of state. React's own model is one-way too: data flows down via props, events flow up via callbacks.` },
{ lv: 'Medium', q: `How do you fetch data in Next.js: getStaticProps / getServerSideProps vs the App Router?`,
  k: `Old way: special functions run before the page is shown. New way: server components fetch the data themselves.`,
  a: `<b>Pages Router (older):</b> <code>getStaticProps</code> runs at build time (SSG; with <code>revalidate</code> for ISR); <code>getStaticPaths</code> lists dynamic routes to pre-render; <code>getServerSideProps</code> runs on every request (SSR); the page receives the data as props. <b>App Router (current default):</b> Server Components are <code>async</code> and fetch directly; caching and revalidation are configured per fetch or route (<code>export const revalidate = 60</code>, <code>dynamic = 'force-dynamic'</code>, <code>revalidatePath</code>/<code>revalidateTag</code>); Server Actions handle mutations; client components use React Query/SWR for client-side fetching. Mention which router your project uses.`,
  c: `// Pages Router
export async function getServerSideProps({ params }) {
  const product = await getProduct(params.id)
  return product ? { props: { product } } : { notFound: true }
}
// App Router (app/products/[id]/page.jsx)
export const revalidate = 60
export default async function Page({ params }) { const product = await getProduct((await params).id); return <Product product={product} /> }` },
{ lv: 'Easy', q: `What is the difference between npm, yarn and pnpm?`,
  k: `Three different delivery services for the same packages, with different speeds and ways of storing them.`,
  a: `All install packages from the npm registry and manage <code>package.json</code> scripts and lockfiles. <b>npm</b>: ships with Node, <code>package-lock.json</code>, workspaces. <b>Yarn</b>: <code>yarn.lock</code>; Classic (v1) was faster than old npm; Berry (v2+) adds Plug'n'Play. <b>pnpm</b>: content-addressable global store with hard links (fast installs, much less disk), strict node_modules that prevents using undeclared dependencies, excellent monorepo workspaces. Whatever you choose: commit the lockfile, use one manager per repo, and use <code>npm ci</code> / <code>pnpm install --frozen-lockfile</code> in CI.` },
{ lv: 'Medium', q: `How do you sync state (e.g. logout or unread counts) across browser tabs?`,
  k: `Tabs pass notes to each other so when you log out in one, the others know too.`,
  a: `<b>BroadcastChannel</b> (same-origin tabs send messages to each other: logout, theme change, new notification counts); the <b>storage event</b> (fires in other tabs when localStorage changes, a common fallback); a <b>SharedWorker</b> holding one WebSocket for all tabs; or server-driven sync (each tab subscribes and the server pushes unread counts). On logout, broadcast and have every tab clear caches and redirect. Avoid putting tokens in localStorage just to sync tabs.`,
  c: `const channel = new BroadcastChannel('app')
channel.onmessage = e => { if (e.data.type === 'logout') { queryClient.clear(); location.assign('/login') } }
function logoutEverywhere() { channel.postMessage({ type: 'logout' }); /* then logout locally */ }` },
  );

  sec('javascript').push(
{ lv: 'Easy', q: `innerHTML vs textContent (vs innerText): which should you use?`,
  k: `textContent puts plain words in; innerHTML builds real tags from text, which a bad actor could abuse.`,
  a: `<code>innerHTML</code> parses a string as HTML (creates elements); using it with user input enables <b>XSS</b> (sanitize with DOMPurify if you must). <code>textContent</code> reads/writes plain text, never parsed, safe and fast. <code>innerText</code> is layout-aware (respects CSS visibility, triggers reflow, slower). In React, JSX text is escaped like textContent; <code>dangerouslySetInnerHTML</code> is the innerHTML equivalent.` },
{ lv: 'Hard', q: `What are Proxy and Reflect, and where are they used?`,
  k: `A Proxy is a guard standing in front of an object, checking or changing every read and write.`,
  a: `<code>new Proxy(target, handler)</code> intercepts fundamental operations with traps (<code>get</code>, <code>set</code>, <code>has</code>, <code>deleteProperty</code>, <code>apply</code>, …). <code>Reflect</code> provides the default behaviour for each trap. Uses: validation, default values, logging/observability, reactivity (Vue 3 and MobX track reads/writes with proxies; Immer uses proxies for drafts), API mocks. Costs: slower than plain objects, harder debugging.`,
  c: `const user = new Proxy({}, {
  set(target, key, value) {
    if (key === 'age' && !Number.isInteger(value)) throw new TypeError('age must be an integer')
    return Reflect.set(target, key, value)
  },
  get: (target, key) => (key in target ? Reflect.get(target, key) : 'N/A'),
})
user.age = 30; user.name   // 'N/A'` },
{ lv: 'Medium', q: `What is a tagged template literal?`,
  k: `A function that receives the text pieces and the inserted values separately, so it can build the final string its own way.`,
  a: `<code>tag\`Hello \${name}\`</code> calls <code>tag(strings, ...values)</code> where <code>strings</code> holds the literal parts (plus <code>strings.raw</code>). The tag can escape values, build non-string results, or parse a DSL. Real uses: styled-components/Emotion (<code>styled.div\`…\`</code>), GraphQL (<code>gql\`…\`</code>), safe HTML/SQL builders, i18n, <code>String.raw</code>.`,
  c: `function safeHtml(strings, ...values) {
  const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
  return strings.reduce((out, s, i) => out + s + (i < values.length ? esc(values[i]) : ''), '')
}
safeHtml\`<p>\${'<img onerror=alert(1)>'}</p>\`   // '<p>&lt;img onerror=alert(1)&gt;</p>'` },
  );

  sec('coding').push(
{ lv: 'Medium', q: `Output drill: 1 < 2 < 3, 3 > 2 > 1, [1] == [1], [1,2,3] + [4,5,6], null + 1, undefined + 1, 2 ** 3 ** 2, Boolean('') === Boolean(0), +[], +'3'`,
  k: `Comparisons turn true/false into 1/0; objects compare by address; null acts like 0 but undefined breaks maths.`,
  a: `<b>true</b> (true &lt; 3 → 1 &lt; 3), <b>false</b> (true &gt; 1 → 1 &gt; 1), <b>false</b> (two different array references), <b>"1,2,34,5,6"</b> (arrays become "1,2,3" and "4,5,6", then concatenate), <b>1</b> (null → 0), <b>NaN</b> (undefined → NaN), <b>512</b> (** is right-associative: 2 ** 9), <b>true</b> (both falsy), <b>0</b> ([] → "" → 0), <b>3</b> (unary + converts to number). Lesson: write ranges as <code>a &lt; x &amp;&amp; x &lt; b</code>, compare objects by content explicitly, and convert types on purpose.` },
{ lv: 'Hard', q: `Output drill: ['1','2','3'].map(parseInt), obj[true] vs obj['true'], [...Array(3)].map((_, i) => i) vs Array(3).map(...), arr.length = 0, typeof class {}, and why {} + [] can differ in the console.`,
  k: `Little JavaScript surprises: extra arguments, keys turning into words, empty holes, and curly braces read as a block.`,
  a: `<b>[1, NaN, NaN]</b>: map passes (value, index), so parseInt('2', 1) and parseInt('3', 2) use invalid radixes (fix: <code>.map(Number)</code> or <code>.map(s =&gt; parseInt(s, 10))</code>). <b>obj[true] and obj['true'] are the same key</b>: non-symbol keys are converted to strings. <b>[0, 1, 2]</b> vs <b>[ &lt;3 empty items&gt; ]</b>: <code>Array(3)</code> has holes that map skips; spreading (or <code>Array.from({ length: 3 }, (_, i) =&gt; i)</code>) creates real undefined values. <b>arr.length = 0</b> empties the array in place (all references see it). <b>typeof class {}</b> is "function". <b>{} + []</b> as an expression is "[object Object]", but typed at the start of a console line <code>{}</code> may be parsed as an empty block, leaving <code>+[]</code> → 0.` },
{ lv: 'Hard', q: `Utility: deep clone that handles nested objects, arrays, Dates, Maps/Sets and circular references.`,
  k: `Copy every box inside every box, and remember boxes you've already copied so a box that contains itself doesn't loop forever.`,
  a: `Prefer <code>structuredClone</code> in real code. To implement: return primitives as-is; keep a <b>WeakMap</b> from original → copy to handle circular references and shared references; special-case Date, RegExp, Map, Set; preserve the prototype for plain objects/classes; recurse into own properties (including symbols if needed). Functions are usually copied by reference.`,
  c: `function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value
  if (seen.has(value)) return seen.get(value)
  if (value instanceof Date) return new Date(value)
  if (value instanceof RegExp) return new RegExp(value.source, value.flags)
  if (value instanceof Map) { const m = new Map(); seen.set(value, m); value.forEach((v, k) => m.set(deepClone(k, seen), deepClone(v, seen))); return m }
  if (value instanceof Set) { const s = new Set(); seen.set(value, s); value.forEach(v => s.add(deepClone(v, seen))); return s }
  const copy = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value))
  seen.set(value, copy)
  for (const key of Reflect.ownKeys(value)) copy[key] = deepClone(value[key], seen)
  return copy
}` },
{ lv: 'Hard', q: `Utility: implement getElementsByStyle(property, value) — find all elements whose computed style matches.`,
  k: `Walk through every element on the page and keep the ones painted with the colour you asked for.`,
  a: `Traverse the DOM tree (recursively or with a stack/TreeWalker) from a root, read <code>getComputedStyle(el).getPropertyValue(prop)</code> and compare with the expected value. Computed values are normalised (colours become <code>rgb(…)</code>, sizes become px), so normalise the expected value by applying it to a temporary element first. Note the cost: getComputedStyle forces style calculation, so avoid calling it in hot paths.`,
  c: `function getElementsByStyle(property, value, root = document.body) {
  const probe = document.createElement('div'); probe.style.setProperty(property, value); document.body.appendChild(probe)
  const expected = getComputedStyle(probe).getPropertyValue(property); probe.remove()   // normalise e.g. 'red' → 'rgb(255, 0, 0)'
  const result = [], stack = [root]
  while (stack.length) {
    const el = stack.pop()
    if (getComputedStyle(el).getPropertyValue(property) === expected) result.push(el)
    stack.push(...el.children)
  }
  return result
}` },
{ lv: 'Easy', q: `Capitalize the first letter of every word ("India is my country." → "India Is My Country.").`,
  k: `Make the first letter of each word a capital.`,
  a: `Split on spaces, uppercase the first character of each word and keep the rest, then join; or a regex replace on word boundaries. Handle multiple spaces by splitting on a single space (keeps them) or using the regex.`,
  c: `const capitalizeWords = s => s.split(' ').map(w => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ')
const capitalizeWords2 = s => s.replace(/\\b\\w/g, c => c.toUpperCase())
capitalizeWords('India is my country.')   // 'India Is My Country.'` },
{ lv: 'Easy', q: `Print numbers 1 to 10 with a one-second delay between each.`,
  k: `Say a number, wait one second, say the next one.`,
  a: `Either schedule each print with an increasing delay (using <code>let</code> so each callback gets its own i), or await a promise-based sleep inside a loop (clearer and easy to stop).`,
  c: `for (let i = 1; i <= 10; i++) setTimeout(() => console.log(i), i * 1000)
// or
const sleep = ms => new Promise(r => setTimeout(r, ms))
async function count() { for (let i = 1; i <= 10; i++) { console.log(i); await sleep(1000) } }` },
  );

  sec('machine').push(
{ lv: 'Medium', q: `Build a tag input (chips): add on Enter/comma, paste many, no duplicates, delete with Backspace or ×.`,
  k: `Type a word and press Enter to turn it into a little chip; tap × to remove it.`,
  a: `State: tags array and current text. Add on Enter or comma (trim, ignore empty, case-insensitive dedupe, max count); paste splits on commas/newlines; Backspace on empty input removes the last chip; each chip has an accessible remove button. Keep it controlled (value/onChange) so forms can use it.`,
  c: `function TagInput({ value, onChange, max = 10 }) {
  const [text, setText] = useState('')
  const add = raw => {
    const next = [...value]
    raw.split(/[,\\n]/).map(t => t.trim()).filter(Boolean).forEach(t => {
      if (next.length < max && !next.some(x => x.toLowerCase() === t.toLowerCase())) next.push(t)
    })
    onChange(next); setText('')
  }
  return <div className="tags">
    {value.map(t => <span key={t} className="chip">{t}<button type="button" aria-label={'Remove ' + t} onClick={() => onChange(value.filter(x => x !== t))}>×</button></span>)}
    <input aria-label="Add tag" value={text} onChange={e => setText(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(text) }
        else if (e.key === 'Backspace' && !text && value.length) onChange(value.slice(0, -1))
      }}
      onPaste={e => { e.preventDefault(); add(e.clipboardData.getData('text')) }} />
  </div>
}` },
{ lv: 'Medium', q: `Build a counter timer with Start, Pause/Resume and Stop (Stop resets to 0).`,
  k: `Start counts up every second, Pause freezes it, Resume continues, Stop goes back to zero.`,
  a: `Keep <code>status</code> ('idle' | 'running' | 'paused') and <code>seconds</code>. An effect starts an interval only while running and clears it in cleanup; use the functional update so the interval never reads stale state. Stop clears and resets. (For precise timing, compute from timestamps; see the stopwatch scenario.)`,
  c: `function Timer() {
  const [seconds, setSeconds] = useState(0), [status, setStatus] = useState('idle')
  useEffect(() => {
    if (status !== 'running') return
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [status])
  return <div>
    <output aria-live="polite">{seconds}s</output>
    {status === 'idle' && <button onClick={() => setStatus('running')}>Start</button>}
    {status === 'running' && <button onClick={() => setStatus('paused')}>Pause</button>}
    {status === 'paused' && <button onClick={() => setStatus('running')}>Resume</button>}
    <button onClick={() => { setStatus('idle'); setSeconds(0) }} disabled={status === 'idle' && seconds === 0}>Stop</button>
  </div>
}` },
  );

  sec('fedesign').push(
{ lv: 'Hard', q: `A global Context holds user, theme, permissions and frequently changing data. What goes wrong, and how would you redesign it?`,
  k: `One loudspeaker for everything means everyone hears every tiny update; give each kind of news its own speaker.`,
  a: `Every consumer re-renders whenever <i>any</i> part of the value changes, so fast-changing data (notifications, presence, live prices) re-renders the whole app; it also couples unrelated features and makes testing harder. Redesign: <b>split by domain and update frequency</b> (AuthContext, ThemeContext, PermissionsContext each memoized); move fast-changing or server data to a store with selectors (Zustand/Redux) or a query cache (React Query); split state and actions contexts; keep providers close to where they're needed. Verify with the Profiler.` },
{ lv: 'Hard', q: `How do you handle optimistic updates for several concurrent mutations that may complete out of order?`,
  k: `Several quick changes are in the air at once; keep a list of them so an old answer can't undo a newer change.`,
  a: `Don't snapshot-and-restore the whole cache per mutation (a late failure would wipe out newer changes). Instead: give each mutation an id and apply it as a <b>pending operation</b> layered on top of server state; on success, replace with the server's version (using a version/updatedAt to ignore stale responses); on failure, remove only that operation and show an error. Serialise mutations per entity if order matters (a queue per id), cancel in-flight refetches before applying optimistic data (<code>cancelQueries</code>), and invalidate once when all settle. React Query's <code>useMutationState</code>/variables or React 19 <code>useOptimistic</code> help render pending items.` },
{ lv: 'Hard', q: `A feature needs data from five APIs, some slow or unreliable. Where should the orchestration live: components, hooks, a service layer or a BFF?`,
  k: `Don't make every screen run errands to five shops; send one helper (the BFF) who brings back one neat bag.`,
  a: `<b>Components</b> should only render. <b>Hooks + a service layer</b> are fine for a few independent calls: parallel queries, per-widget loading/error, partial results (<code>allSettled</code>), timeouts and retries. When calls depend on each other, need secrets, aggregate/transform heavily, or must be fast on slow mobile networks, use a <b>Backend-for-Frontend</b> (or GraphQL) that fans out server-side, caches, applies timeouts/circuit breakers and returns one view-shaped response. The UI still handles degraded responses (missing sections, stale data indicators).` },
{ lv: 'Hard', q: `Business logic is tightly coupled to UI components. How do you separate them gradually without a rewrite?`,
  k: `Move the thinking out of the drawing code, one piece at a time, with tests guarding each move.`,
  a: `Add characterization tests around the current behaviour; extract <b>pure functions</b> (calculations, validation, formatting) into modules with unit tests; move data access into a <b>service/API layer</b> and server-state hooks (React Query); move stateful workflows into <b>custom hooks</b> or a store (reducers/state machines); leave components presentational (props in, events out). Do it feature by feature as you touch code (strangler pattern), enforce boundaries with lint rules (e.g. no fetch in components), and track progress in the backlog.` },
{ lv: 'Medium', q: `A library upgrade breaks a component, or users report glitches in some browsers. How do you troubleshoot and prevent it?`,
  k: `Find exactly what changed and where it breaks, fix it, and add checks so it can't sneak back.`,
  a: `<b>Upgrades:</b> read the changelog/migration guide, upgrade one major version at a time, run tests and visual regression, use codemods, pin versions with the lockfile, and let Renovate/Dependabot open small PRs; isolate third-party components behind your own wrappers so changes are localised. <b>Cross-browser:</b> reproduce with the user's browser/version/device (BrowserStack, Playwright projects for WebKit/Firefox), check console errors and unsupported APIs (caniuse, Baseline), CSS differences (Safari flex/gap, date inputs, 100vh), polyfills via browserslist targets, and add the case to automated cross-browser tests.` },
  );

  sec('behavioral').push(
{ lv: 'Behavioral', q: `What is your experience with Node.js?`,
  k: `Say honestly how much you've used it, and what you know about it.`,
  a: `Be precise and honest: your resume is frontend-focused (React, Redux, JavaScript) with backend work done by other teams, so don't claim backend Node experience you don't have. You can truthfully describe day-to-day Node usage as a frontend developer: npm scripts, build tooling (webpack/Vite), running dev servers, environment variables, maybe mock servers or small scripts. Then show understanding: Node is a JavaScript runtime with an event loop and non-blocking I/O, used for APIs (Express/Nest), BFFs, SSR (Next.js) and tooling. If you've written any Express endpoints or Lambda functions, describe exactly what.` },
  );
})();
