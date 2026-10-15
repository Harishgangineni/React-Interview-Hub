HUB.add({
  id: 'styled', title: 'styled-components', short: 'Styled',
  blurb: 'CSS-in-JS with styled-components (in maintenance mode since March 2025) and what to use instead.',
  items: [
{ q: `What are styled-components in React?`,
  k: `Bricks that come already painted: you write the paint right next to the brick.`,
  a: `A runtime CSS-in-JS library: tagged template literals create React components with scoped, auto-generated class names. Supports props-based styling, theming, global styles and SSR. Since March 2025 it is in <b>maintenance mode</b>: still works (v6), receives fixes, but not recommended for new projects, especially with Server Components.` },
{ q: `How do you set up styled-components in a React application?`,
  k: `Install the paint kit and start painting bricks.`,
  a: `<code>npm i styled-components</code> (v6 ships its own types). Optionally add the SWC/Babel plugin for better class names and SSR, a <code>ThemeProvider</code> and <code>createGlobalStyle</code>. In Next.js App Router, add a style registry and mark components <code>'use client'</code>.` },
{ q: `What is the advantage of using styled-components over traditional CSS?`,
  k: `Paint lives with its brick, so you never paint the wrong one by accident.`,
  a: `Scoped styles (no class collisions), colocated with components, dynamic styling from props, theming, dead-code removal with components, automatic vendor prefixing. Downsides: runtime cost, larger bundles, SSR setup, RSC incompatibility. CSS Modules, Tailwind or zero-runtime libraries give scoping without runtime.` },
{ q: `How do you create a basic styled component?`,
  k: `Say which brick and write its paint between backticks.`,
  a: `Call <code>styled.tagName</code> (or <code>styled(Component)</code>) with a tagged template literal containing CSS. styled-components generates a unique class name, injects the CSS, and returns a React component that renders that tag with the class. Nesting with <code>&amp;</code>, pseudo-classes and media queries work inside the template.`,
  c: `import styled from 'styled-components'
const Button = styled.button\`
  padding: 8px 16px;
  border-radius: 8px;
  background: rebeccapurple;
  color: white;
  &:hover { opacity: .9; }
\`` },
{ q: `How do you pass props to styled-components?`,
  k: `Give the brick an instruction and let the paint change with it.`,
  a: `Interpolate functions that receive props. Use <b>transient props</b> (<code>$</code> prefix) so styling-only props aren't forwarded to the DOM.`,
  c: `const Tag = styled.span\`
  color: \${p => (p.$tone === 'danger' ? 'crimson' : 'inherit')};
\`
<Tag $tone="danger">Sold out</Tag>` },
{ q: `What is the purpose of the css helper in styled-components?`,
  k: `A small paint recipe you can reuse in many bricks.`,
  a: `<code>css</code> creates reusable style fragments that keep interpolations working (functions of props) when composed into other styled components.`,
  c: `const focusRing = css\`outline: 3px solid \${p => p.theme.colors.focus};\`
const Input = styled.input\`&:focus-visible { \${focusRing} }\`` },
{ q: `How do you handle theme management with styled-components?`,
  k: `One colour book for the whole house that every brick can read.`,
  a: `Wrap the app in <code>ThemeProvider theme={theme}</code>; styled components read <code>props.theme</code>; components use <code>useTheme()</code>. Switch themes by changing the object. Modern alternative: CSS custom properties, which also work without JS.` },
{ q: `What is the ThemeProvider component in styled-components?`,
  k: `The loudspeaker for colours.`,
  a: `A context provider that makes a theme object available to all styled components below it. Supports nesting and function themes that extend the outer theme.` },
{ q: `How do you define global styles with styled-components?`,
  k: `Paint for the whole house, not just one brick.`,
  a: `<code>createGlobalStyle</code> returns a component that injects global CSS when rendered (resets, fonts, body styles).`,
  c: `const GlobalStyle = createGlobalStyle\`
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: \${p => p.theme.font}; }
\`` },
{ q: `How do you create dynamic styles based on props with styled-components?`,
  k: `The paint changes depending on what the brick is told.`,
  a: `Use prop interpolations, <code>css</code> blocks for variant groups, or a variant map. For performance with many dynamic values, set CSS variables via <code>style</code> and keep the styled CSS static.`,
  c: `const variants = { primary: css\`background: navy;\`, ghost: css\`background: transparent;\` }
const Btn = styled.button\`\${p => variants[p.$variant || 'primary']}\`` },
{ q: `How do you style child components using styled-components?`,
  k: `Paint the little bricks inside a bigger brick.`,
  a: `Nest selectors with <code>&amp;</code>, reference other styled components as selectors (<code>\${Icon}</code>), or extend a component with <code>styled(Child)</code> (the child must pass <code>className</code> to its root).`,
  c: `const Card = styled.div\`
  \${Icon} { width: 16px; }
  & > h3 { margin: 0; }
\`` },
{ q: `What are keyframes in styled-components, and how do you use them?`,
  k: `A dance routine for a brick.`,
  a: `<code>keyframes</code> creates a uniquely named @keyframes animation you interpolate into styles.`,
  c: `const spin = keyframes\`to { transform: rotate(360deg); }\`
const Spinner = styled.div\`animation: \${spin} 1s linear infinite;\`` },
{ q: `How do you perform conditional styling with styled-components?`,
  k: `"If it's chosen, make it blue."`,
  a: `Use prop functions with ternaries, <code>css</code> fragments with <code>&amp;&amp;</code>, or attribute selectors (<code>&amp;[aria-selected='true']</code>), which keep styling tied to accessible state.`,
  c: `const Tab = styled.button\`
  border-bottom: 2px solid transparent;
  &[aria-selected='true'] { border-color: navy; }
\`` },
{ q: `How do you use media queries in styled-components?`,
  k: `Paint differently on small screens and big screens.`,
  a: `Write <code>@media</code> blocks inside the template, ideally with breakpoints from the theme or a helper.`,
  c: `const Grid = styled.div\`
  display: grid; grid-template-columns: 1fr;
  @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
\`` },
{ q: `How do you use styled-components with TypeScript?`,
  k: `Label which extra instructions the paint can use.`,
  a: `v6 includes types. Pass prop types as a generic (<code>styled.div&lt;{ $active: boolean }&gt;</code>) and augment <code>DefaultTheme</code> for a typed theme.` },
{ q: `What is the extend syntax in styled-components?`,
  k: `Take an existing painted brick and add a bit more paint.`,
  a: `<code>styled(Button)</code> creates a new component inheriting Button's styles and adding new ones (the old <code>.extend</code> was removed in v4). Use <code>as</code> to change the rendered element.`,
  c: `const DangerButton = styled(Button)\`background: crimson;\`
<Button as="a" href="/buy">Buy</Button>` },
{ q: `How do you handle nesting in styled-components?`,
  k: `Write paint for hover and inside parts inside the main paint.`,
  a: `Supports Sass-like nesting with <code>&amp;</code>: pseudo-classes, pseudo-elements, child selectors and media queries. Keep nesting shallow for readability and specificity.` },
{ q: `What is the use of the attrs method in styled-components?`,
  k: `Give the brick default settings, like "this input is always a password box".`,
  a: `<code>.attrs()</code> sets static or computed props/attributes on the rendered element, e.g. <code>type</code>, <code>aria-*</code>, or frequently changing inline styles (avoids generating many classes).`,
  c: `const Password = styled.input.attrs({ type: 'password', autoComplete: 'current-password' })\`padding: 8px;\`` },
{ q: `How do you handle server-side rendering with styled-components?`,
  k: `The kitchen must also send the paint with the sandwich.`,
  a: `Collect styles during render with <code>ServerStyleSheet</code> (<code>collectStyles</code>, <code>getStyleTags</code>) and inject them into the HTML; in Next.js App Router use a registry with <code>useServerInsertedHTML</code>. Without it you get a flash of unstyled content.` },
{ q: `How do you optimize styled-components for better performance?`,
  k: `Don't make new paint every second; reuse paint.`,
  a: `Define styled components outside render, avoid highly dynamic interpolations (use CSS variables or <code>attrs</code> style), use transient props, enable the compiler plugin, and avoid wrapping huge lists in many styled layers. Long term: migrate hot paths to zero-runtime CSS.` },
{ q: `How do you use the StyleSheetManager component in styled-components?`,
  k: `A manager that decides where and how the paint is stored.`,
  a: `<code>StyleSheetManager</code> configures style injection for its subtree: a custom <code>target</code> (iframes, shadow DOM), <code>shouldForwardProp</code> (needed in v6 to filter props), <code>stylisPlugins</code> (e.g. RTL), and <code>enableVendorPrefixes</code>.` },
{ q: `How do you handle CSS resets with styled-components?`,
  k: `Wipe the wall clean before painting.`,
  a: `Put a modern reset or normalize in <code>createGlobalStyle</code> rendered once near the root (or import a reset CSS file).` },
{ q: `How do you integrate styled-components with existing CSS frameworks?`,
  k: `Use your own paint on top of a paint set you already have.`,
  a: `Wrap framework classes with <code>.attrs({ className })</code>, style framework components via <code>styled(Component)</code>, and control specificity (<code>&amp;&amp;</code> doubles the class) or load order. With Tailwind, avoid mixing both on the same element.` },
{ q: `How do you debug issues in styled-components?`,
  k: `Give the paint readable names so you can find it.`,
  a: `Use the Babel/SWC plugin for <code>displayName</code> and readable class names, inspect generated classes in DevTools, check for prop forwarding warnings, duplicate library instances (multiple versions in the bundle), and SSR hydration class mismatches.` },
{ q: `How do you handle animations in styled-components?`,
  k: `Make bricks dance with keyframes, gently.`,
  a: `Use <code>keyframes</code> and transitions in styles, respect <code>prefers-reduced-motion</code>, and animate transform/opacity for performance. For complex motion use Motion (Framer Motion) and keep styled-components for static styling.` },
  ],
});

HUB.add({
  id: 'axios', title: 'Axios', short: 'Axios',
  blurb: 'HTTP client setup, interceptors, errors, cancellation, auth, retries and React Query.',
  items: [
{ q: `What is Axios, and why is it used in React applications?`,
  k: `Axios is the post office that carries your letters to the shop and brings answers back.`,
  a: `A promise-based HTTP client for browsers and Node. Compared with <code>fetch</code>: automatic JSON parsing, rejects on non-2xx, instances with baseURL and defaults, request/response interceptors, timeouts, upload/download progress, and cancellation via <code>AbortController</code>. In React it usually sits in a service layer under TanStack Query or RTK Query.` },
{ q: `How do you set up Axios in a React application?`,
  k: `Build one post office with the shop's address written once.`,
  a: `Create a shared instance with base URL from env, timeout and credentials; export it from one module.`,
  c: `export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
  withCredentials: true,
})` },
{ q: `How do you perform a GET request with Axios?`,
  k: `Ask the shop: "please send me the toy list".`,
  a: `<code>api.get(url, { params, signal })</code>; the body is in <code>response.data</code>.`,
  c: `const { data } = await api.get('/toys', { params: { search: 'bear', page: 2 }, signal })` },
{ q: `How do you perform a POST request with Axios?`,
  k: `Send the shop a new toy to add.`,
  a: `<code>api.post(url, body, config)</code>; objects are sent as JSON automatically.`,
  c: `const { data: created } = await api.post('/toys', { name: 'Kite', price: 499 })` },
{ q: `How do you handle request and response interceptors in Axios?`,
  k: `A checker at the post office door who adds your wristband to letters and opens answers first.`,
  a: `Request interceptors modify outgoing config (attach token, headers). Response interceptors handle every reply (normalize errors, refresh token on 401, logging). Keep them for cross-cutting concerns only.`,
  c: `api.interceptors.request.use(cfg => {
  const t = tokenStore.get()
  if (t) cfg.headers.Authorization = 'Bearer ' + t
  return cfg
})
api.interceptors.response.use(r => r, err => Promise.reject(toApiError(err)))` },
{ q: `How do you handle errors with Axios?`,
  k: `Bad news comes in many envelopes; put them all in one red envelope.`,
  a: `Axios rejects for non-2xx (<code>error.response</code>), no response (<code>error.request</code>, network/CORS/timeout), and setup errors. Check <code>axios.isCancel</code> first. Normalize into one <code>ApiError</code> class with status, code and details so UI and retry logic are simple.`,
  c: `if (axios.isAxiosError(err)) {
  const status = err.response?.status ?? 0
  const message = err.response?.data?.message ?? err.message
}` },
{ q: `How do you cancel requests with Axios?`,
  k: `Shout "never mind!" and the post office stops the letter.`,
  a: `Pass an <code>AbortController</code> signal; call <code>abort()</code> on unmount or when a newer request replaces it. TanStack Query passes <code>signal</code> to your queryFn automatically. <code>CancelToken</code> is deprecated.`,
  c: `const ctrl = new AbortController()
api.get('/search', { params: { q }, signal: ctrl.signal })
ctrl.abort()` },
{ q: `How do you handle concurrent requests with Axios?`,
  k: `Send three helpers to three shops at the same time.`,
  a: `Use <code>Promise.all</code> (fail fast) or <code>Promise.allSettled</code> (all results). <code>axios.all</code>/<code>spread</code> are deprecated. In React, prefer parallel <code>useQueries</code>.`,
  c: `const [user, orders] = await Promise.all([api.get('/me'), api.get('/orders')])` },
{ q: `How do you set default headers in Axios?`,
  k: `Write your address on every envelope automatically.`,
  a: `On the instance: <code>axios.create({ headers: { 'X-App': 'web' } })</code> or <code>api.defaults.headers.common[...]</code>. For values that change (tokens), use a request interceptor instead of mutating defaults.` },
{ q: `How do you handle file uploads with Axios?`,
  k: `Put the picture in a special parcel (FormData) and watch the progress bar.`,
  a: `Send <code>FormData</code>; Axios sets the multipart boundary. Use <code>onUploadProgress</code> for progress and a signal to cancel.`,
  c: `const form = new FormData()
form.append('file', file)
await api.post('/upload', form, { onUploadProgress: e => setPct(Math.round(e.loaded * 100 / (e.total ?? 1))) })` },
{ q: `How do you handle authentication with Axios?`,
  k: `Show your wristband with every letter; if it expired, quietly get a new one.`,
  a: `Access token in memory added by a request interceptor; refresh token in an httpOnly, Secure, SameSite cookie. On 401, a response interceptor refreshes <b>once</b> (shared promise so parallel requests wait), retries the original request with <code>_retry</code> guard, and logs out if refresh fails (clear tokens and caches). Or cookie-only sessions with <code>withCredentials</code>.`,
  c: `let refreshing = null
api.interceptors.response.use(r => r, async err => {
  const original = err.config
  if (err.response?.status === 401 && !original._retry) {
    original._retry = true
    refreshing ??= refresh().finally(() => { refreshing = null })
    const token = await refreshing
    original.headers.Authorization = 'Bearer ' + token
    return api(original)
  }
  return Promise.reject(err)
})` },
{ q: `How do you use Axios with TypeScript?`,
  k: `Tell the post office what kind of answer to expect.`,
  a: `Axios ships types. Use generics for the response body: <code>api.get&lt;Toy[]&gt;('/toys')</code>; <code>AxiosError&lt;ErrorBody&gt;</code> for errors; <code>InternalAxiosRequestConfig</code> in interceptors. Validate at runtime with zod for untrusted APIs.` },
{ q: `What are some best practices for using Axios in React applications?`,
  k: `One post office, one way of handling bad news, and never waiting forever.`,
  a: `One instance; env-based baseURL (https in production); timeouts; service functions per endpoint returning plain data; pass <code>signal</code>; centralize errors into one class; token refresh with a single in-flight promise; no secrets in front-end env vars; let TanStack/RTK Query handle caching and retries; mock with MSW in tests.` },
{ q: `How do you integrate Axios with React Query?`,
  k: `The post office carries letters; React Query is the helper with the notebook.`,
  a: `Axios lives in service functions; React Query calls them in <code>queryFn</code> and passes <code>signal</code> for cancellation. Keep caching in React Query and retries decided by error status.`,
  c: `useQuery({
  queryKey: ['toys', 'list', { search }],
  queryFn: ({ signal }) => api.get('/toys', { params: { search }, signal }).then(r => r.data),
})` },
{ q: `How do you use Axios with Redux Toolkit?`,
  k: `The shop-trip helper uses the post office.`,
  a: `Call Axios inside <code>createAsyncThunk</code> (forward <code>signal</code>, use <code>rejectWithValue</code>), or write an Axios <code>baseQuery</code> for RTK Query so endpoints share your instance and interceptors.`,
  c: `const axiosBaseQuery = () => async ({ url, method = 'get', data, params }) => {
  try { const r = await api({ url, method, data, params }); return { data: r.data } }
  catch (e) { return { error: { status: e.response?.status, data: e.response?.data } } }
}` },
{ q: `How do you perform request retries with Axios?`,
  k: `If the letter got lost, try again a bit later, but not forever.`,
  a: `Use <code>axios-retry</code> or a response interceptor with exponential backoff and jitter. Retry only idempotent requests and transient errors (network, 5xx, 429 with Retry-After). If you use React Query, let it retry instead to avoid double retries.` },
{ q: `How do you handle pagination with Axios?`,
  k: `Ask for page 1, then page 2, with the page number on the letter.`,
  a: `Send page/limit or cursor in <code>params</code>, read totals or next cursor from the body or headers (<code>Link</code>, <code>X-Total-Count</code>). In React combine with <code>useQuery</code> + <code>keepPreviousData</code> or <code>useInfiniteQuery</code>.` },
{ q: `How do you handle large file downloads with Axios?`,
  k: `Big parcels come in a special box, and you watch the progress bar.`,
  a: `<code>responseType: 'blob'</code> (browser) with <code>onDownloadProgress</code>, then create an object URL and trigger a download, revoking it afterwards. For very large files prefer a direct link or signed URL so the browser streams it; in Node use <code>responseType: 'stream'</code>.` },
{ q: `How do you use Axios with React Native?`,
  k: `The same post office works on phones too.`,
  a: `Works the same; base URL must be reachable from the device (not localhost; use your machine IP or 10.0.2.2 on Android emulator), HTTPS required by default on iOS. File uploads use FormData with <code>{ uri, name, type }</code>. Handle offline with NetInfo.` },
{ q: `How do you handle response transformations with Axios?`,
  k: `Tidy the answer before giving it to the app.`,
  a: `Use <code>transformResponse</code> or a response interceptor to map snake_case to camelCase, parse dates, or unwrap envelopes; better still, map in service functions so each endpoint returns domain types (and validate with zod).`,
  c: `export async function getToy(id) {
  const { data } = await api.get('/toys/' + id)
  return { id: data.id, name: data.toy_name, createdAt: new Date(data.created_at) }
}` },
  ],
});
