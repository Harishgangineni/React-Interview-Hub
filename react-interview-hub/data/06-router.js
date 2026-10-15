HUB.add({
  id: 'router', title: 'React Router', short: 'Router',
  blurb: 'Routes, links, params, nested layouts, guards, loaders. Old v5 APIs are mapped to v7.',
  items: [
{ q: `What is React Router?`,
  k: `A map for your app: when the address says "/toys", it shows the toys room.`,
  a: `The standard routing library for React. It maps URLs to components, handles navigation without full page reloads, and in v6.4+/v7 also loads data (loaders), handles mutations (actions), and can run as a full framework (formerly Remix) with SSR and type generation. Current major: v7.` },
{ q: `What are the main features of React Router?`,
  k: `Rooms, doors between rooms, rooms inside rooms, and fetching what each room needs.`,
  a: `Declarative and data routers, nested routes with layouts (<code>&lt;Outlet&gt;</code>), dynamic segments and splats, <code>Link</code>/<code>NavLink</code>, programmatic navigation, search params, loaders/actions with pending UI, error boundaries per route, lazy routes, scroll restoration, view transitions, and in framework mode SSR, pre-rendering and typed routes.` },
{ q: `How do you set up routing in a React application?`,
  k: `Write the map and put it at the top of the house.`,
  a: `Library ("data") mode: create a router and render <code>RouterProvider</code>. Or declarative mode with <code>&lt;BrowserRouter&gt;&lt;Routes&gt;</code>.`,
  c: `import { createBrowserRouter, RouterProvider } from 'react-router'
const router = createBrowserRouter([
  { path: '/', Component: Layout, children: [
    { index: true, Component: Home },
    { path: 'toys/:id', Component: ToyPage, loader: toyLoader },
    { path: '*', Component: NotFound },
  ]},
])
createRoot(root).render(<RouterProvider router={router} />)`,
  u: `In v7 import everything from "react-router"; "react-router-dom" is only a re-export.` },
{ q: `What is the use of the BrowserRouter component?`,
  k: `It listens to the address bar and tells the map which room you're in.`,
  a: `<code>&lt;BrowserRouter&gt;</code> provides routing using the HTML5 History API (clean URLs like <code>/toys/3</code>). The server must return <code>index.html</code> for unknown paths (SPA fallback). Alternatives: <code>HashRouter</code> (#/toys, no server config), <code>MemoryRouter</code> (tests), and <code>createBrowserRouter</code> for data APIs.` },
{ q: `How do you define routes in React Router?`,
  k: `List each address and what room it opens.`,
  a: `Either JSX <code>&lt;Routes&gt;&lt;Route path element /&gt;&lt;/Routes&gt;</code> or route objects in <code>createBrowserRouter</code>. In framework mode, in <code>app/routes.ts</code> with <code>route()</code>, <code>index()</code>, <code>layout()</code>.`,
  c: `<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="toys/:id" element={<Toy />} />
  </Route>
</Routes>` },
{ q: `What is the Route component in React Router?`,
  k: `One line on the map: "this address shows this room".`,
  a: `<code>&lt;Route&gt;</code> declares a path and what to render (<code>element</code> or <code>Component</code>), plus optional <code>loader</code>, <code>action</code>, <code>errorElement</code>, <code>lazy</code>, <code>index</code> and children. Paths are relative to the parent route.` },
{ q: `What is the Link component in React Router?`,
  k: `A door: click it and you walk to another room without leaving the house.`,
  a: `<code>&lt;Link to="/toys"&gt;</code> renders an accessible <code>&lt;a&gt;</code> that navigates client-side without reloading. Supports relative paths, <code>replace</code>, <code>state</code>, <code>prefetch</code> (framework mode), and <code>viewTransition</code>.` },
{ q: `What is the NavLink component in React Router?`,
  k: `A door that lights up when you're in its room.`,
  a: `A <code>Link</code> that knows if it's active and sets <code>aria-current="page"</code> and an <code>active</code> class, or lets you style via a function. Use <code>end</code> to match exactly.`,
  c: `<NavLink to="/toys" className={({ isActive }) => isActive ? 'nav active' : 'nav'}>Toys</NavLink>` },
{ q: `How do you perform navigation programmatically in React Router?`,
  k: `Instead of clicking a door, the brick decides to walk you somewhere, like after you save a form.`,
  a: `<code>const navigate = useNavigate()</code> then <code>navigate('/done')</code>, <code>navigate(-1)</code>, or <code>navigate(path, { replace: true, state })</code>. In loaders/actions return <code>redirect('/login')</code>. Render <code>&lt;Navigate to /&gt;</code> for redirects during render.`,
  c: `const navigate = useNavigate()
async function onSave() { await save(); navigate('/toys', { replace: true }) }` },
{ q: `What is the use of the useHistory hook in React Router?`,
  k: `The old remote control for moving between rooms; it was replaced by a newer one.`,
  a: `In v5, <code>useHistory()</code> returned the history object (<code>push</code>, <code>replace</code>, <code>goBack</code>). It was removed in v6. Use <code>useNavigate</code>: <code>history.push(p)</code> → <code>navigate(p)</code>, <code>history.replace(p)</code> → <code>navigate(p, { replace: true })</code>, <code>goBack()</code> → <code>navigate(-1)</code>.`,
  u: `Legacy (v5). Answer with useNavigate.` },
{ q: `How do you pass parameters to routes in React Router?`,
  k: `Put a blank in the address, like "/toys/___", and fill it with the toy's number.`,
  a: `Dynamic segments in the path (<code>/toys/:id</code>), optional segments (<code>:lang?</code>), splats (<code>files/*</code>), search params (<code>?sort=price</code>), or navigation <code>state</code> (not shareable via URL).`,
  c: `<Route path="toys/:id" element={<Toy />} />
<Link to={'/toys/' + toy.id}>Open</Link>` },
{ q: `What is the use of the useParams hook in React Router?`,
  k: `It reads the blank that was filled in the address.`,
  a: `<code>useParams()</code> returns an object of dynamic segment values for the current route, always strings (or undefined). Parse and validate them. In loaders use <code>params</code> from the argument.`,
  c: `const { id } = useParams()
const toy = useQuery(toyQueries.detail(Number(id)))` },
{ q: `How do you handle nested routes in React Router?`,
  k: `Rooms inside rooms: the house frame stays, only the inner room changes.`,
  a: `Nest child routes inside a parent; the parent renders shared layout and an <code>&lt;Outlet /&gt;</code> where the matching child appears. Index routes render at the parent's exact path. Layout routes without a path group children under shared UI.`,
  c: `function DashboardLayout() {
  return <div className="dash"><Sidebar /><main><Outlet /></main></div>
}` },
{ q: `What is the use of the Switch component in React Router?`,
  k: `The old "pick only the first matching room" box, replaced by a smarter one.`,
  a: `In v5, <code>&lt;Switch&gt;</code> rendered the first matching <code>&lt;Route&gt;</code>. v6+ replaced it with <code>&lt;Routes&gt;</code>, which picks the <b>best</b> match by ranking, so route order no longer matters and <code>exact</code> is gone.`,
  u: `Legacy (v5). Use Routes.` },
{ q: `How do you implement route guards in React Router?`,
  k: `A guard at the door checks your wristband before you enter the room.`,
  a: `Option 1: a protected layout route that checks auth and renders <code>&lt;Outlet /&gt;</code> or <code>&lt;Navigate to="/login" state={{ from: location }} replace /&gt;</code>. Option 2 (data/framework mode): check in a <code>loader</code> and <code>throw redirect('/login')</code> before any UI renders, or use v7 middleware. Always enforce authorization on the server too.`,
  c: `function RequireAuth() {
  const { user } = useAuth()
  const location = useLocation()
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}` },
{ q: `What is the Redirect component in React Router?`,
  k: `An old sign that said "go to the other room", now replaced by Navigate.`,
  a: `In v5, <code>&lt;Redirect to&gt;</code> navigated when rendered. In v6+ use <code>&lt;Navigate to replace /&gt;</code> in components, or <code>redirect()</code> from loaders/actions.`,
  u: `Legacy (v5). Use Navigate or redirect().` },
{ q: `How do you handle 404 pages in React Router?`,
  k: `If no room matches the address, show the "this room doesn't exist" page.`,
  a: `Add a catch-all route <code>path="*"</code> last in its level. For data routers also set <code>errorElement</code>/<code>ErrorBoundary</code> and throw <code>new Response('Not found', { status: 404 })</code> (or <code>data(null, { status: 404 })</code>) from loaders when a record doesn't exist.` },
{ q: `What is the use of the useRouteMatch hook in React Router?`,
  k: `An old question: "does this address match this pattern?"`,
  a: `v5 hook that returned match info (<code>path</code>, <code>url</code>, <code>params</code>) for building nested routes. Replaced by relative routes, <code>useMatch(pattern)</code>, <code>matchPath</code>, and <code>useMatches()</code> for all active route matches.`,
  u: `Legacy (v5). Use useMatch or relative paths.` },
{ q: `How do you implement dynamic routing in React Router?`,
  k: `The map can grow while you play, adding rooms when you need them.`,
  a: `Routes are just data: build them from config or permissions, use dynamic segments for records, and load route modules lazily with the <code>lazy</code> property (code-split per route). <code>patchRoutesOnNavigation</code> lets you discover routes at runtime in very large apps.`,
  c: `{ path: 'reports', lazy: () => import('./routes/reports') }` },
{ q: `How do you handle query parameters in React Router?`,
  k: `Extra notes after the "?" in the address, like "?colour=red".`,
  a: `<code>const [params, setParams] = useSearchParams()</code>; read with <code>params.get('q')</code>, update with <code>setParams({ q, page: '1' })</code>. Keep filter/sort/page state in the URL so it's shareable and survives refresh. Loaders read <code>new URL(request.url).searchParams</code>.` },
{ q: `What is the use of the withRouter higher-order component in React Router?`,
  k: `An old gift wrapper that gave a brick the map; now bricks use stickers (hooks) instead.`,
  a: `v5 HOC injecting <code>history</code>, <code>location</code> and <code>match</code> props into class components. Removed in v6. Use <code>useNavigate</code>, <code>useLocation</code>, <code>useParams</code>; for class components write a tiny wrapper that passes hook values as props.`,
  u: `Legacy (v5).` },
{ q: `How do you handle transitions between routes in React Router?`,
  k: `Make walking between rooms smooth: show you're moving, and fade nicely.`,
  a: `Use <code>useNavigation()</code> for global pending UI (<code>navigation.state === 'loading'</code>), <code>useFetcher</code> for in-place mutations, <code>viewTransition</code> on <code>Link</code>/<code>navigate</code> for the View Transitions API, and React transitions so old UI stays visible while new data loads.` },
{ q: `How do you optimize routing for large applications in React Router?`,
  k: `Only carry each room's toys when you visit it, and start fetching before you arrive.`,
  a: `Lazy route modules, loaders that fetch in parallel (no component waterfalls), prefetching on hover/intent, route-level error boundaries, keeping search state in the URL, and framework mode for SSR/pre-rendering and automatic code splitting.` },
{ q: `What is the use of the StaticRouter component in React Router?`,
  k: `A map that doesn't move, used when the kitchen (server) prepares the page.`,
  a: `Used for server rendering: it renders routes for a fixed URL with no history. With data routers use <code>createStaticHandler</code> + <code>createStaticRouter</code> + <code>StaticRouterProvider</code>. Framework mode handles this for you.` },
{ q: `How do you integrate React Router with Redux?`,
  k: `The map and the cupboard each do their own job and talk when needed.`,
  a: `Keep URL state in the router, not Redux (the old connected-react-router is unmaintained). Dispatch Redux actions from loaders or components when needed, read the store inside loaders via <code>store.getState()</code>, and use RTK Query's <code>initiate</code> in loaders to prefetch data.`,
  c: `loader: async ({ params }) => {
  const sub = store.dispatch(api.endpoints.getToy.initiate(params.id))
  try { return await sub.unwrap() } finally { sub.unsubscribe() }
}` },
  ],
});
