HUB.add({
  id: 'rtl', title: 'React Testing Library', short: 'RTL',
  blurb: 'Queries, async utilities, user-event, mocking, hooks, providers, portals and accessibility.',
  items: [
{ q: `What is React Testing Library, and how does it differ from Enzyme?`,
  k: `RTL plays with the toy like a kid; Enzyme opened the robot to look at its gears.`,
  a: `RTL renders components into a real DOM (jsdom) and encourages tests that resemble usage: find elements by role/label/text, interact, assert visible output. "The more your tests resemble the way your software is used, the more confidence they give." Enzyme exposed internals (state, instances, shallow rendering) and doesn't support React 18+.` },
{ q: `How do you set up React Testing Library in a React application?`,
  k: `Install the toy-player and its helpers.`,
  a: `Install <code>@testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom</code> with Vitest or Jest (jsdom). Import jest-dom matchers in a setup file and create a custom <code>render</code> with your providers.`,
  c: `// vitest.config.ts
export default defineConfig({ test: { environment: 'jsdom', setupFiles: './src/test/setup.ts' } })
// setup.ts
import '@testing-library/jest-dom/vitest'` },
{ q: `What is the purpose of the render function in React Testing Library?`,
  k: `Puts the toy on the table so you can play.`,
  a: `Mounts the UI into a container attached to <code>document.body</code>, wrapped in <code>act</code>, and returns utilities (<code>rerender</code>, <code>unmount</code>, <code>container</code>, bound queries). Usually you use <code>screen</code> instead of returned queries.` },
{ q: `How do you query for elements in React Testing Library?`,
  k: `Find things the way a person would: "the Save button", "the Email box".`,
  a: `Through <code>screen</code>: <code>getByRole('button', { name: /save/i })</code> first, then label, placeholder, text, display value, alt, title, and test id last. Use <code>within(el)</code> to scope.` },
{ q: `What is the difference between getBy, queryBy, and findBy queries?`,
  k: `getBy: "it must be here now". queryBy: "it might not be here". findBy: "it will show up soon".`,
  a: `<b>getBy</b> returns the element or throws (assert presence). <b>queryBy</b> returns null if missing (assert absence: <code>expect(queryByText('x')).not.toBeInTheDocument()</code>). <b>findBy</b> returns a promise that retries until found or timeout (async appearance). *AllBy variants return arrays.` },
{ q: `How do you test asynchronous behavior in React Testing Library?`,
  k: `Wait patiently until the toy finishes changing.`,
  a: `Use <code>await screen.findBy...</code> for elements that appear, <code>waitFor(() =&gt; expect(...))</code> for other assertions, <code>waitForElementToBeRemoved</code> for spinners. Mock the network with MSW. Avoid arbitrary sleeps.`,
  c: `render(<ToyList />)
expect(await screen.findByText('Kite')).toBeInTheDocument()
await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))` },
{ q: `What is the use of the screen object in React Testing Library?`,
  k: `"Look at the whole table" without remembering where you put the toy.`,
  a: `<code>screen</code> provides all queries bound to <code>document.body</code>, so you don't destructure from render, and <code>screen.debug()</code> / <code>screen.logTestingPlaygroundURL()</code> help find good queries.` },
{ q: `How do you handle user interactions in React Testing Library?`,
  k: `Use the "real person" helper to click and type.`,
  a: `With <code>@testing-library/user-event</code>: <code>const user = userEvent.setup()</code> (before render) and await its methods. It fires realistic event sequences (pointer, focus, key, input).` },
{ q: `What is the use of the fireEvent function in React Testing Library?`,
  k: `One single poke, not a full person.`,
  a: `Dispatches one DOM event (<code>fireEvent.change(input, { target: { value: 'x' } })</code>). Use it for events user-event can't simulate (scroll, resize, custom events); otherwise prefer user-event.` },
{ q: `How do you simulate events using the userEvent library?`,
  k: `Pretend to be a person typing and clicking.`,
  a: `Create a user session with <code>userEvent.setup()</code> before rendering, then <code>await</code> each interaction: <code>type</code>, <code>click</code>, <code>keyboard</code>, <code>tab</code>, <code>selectOptions</code>, <code>upload</code>. user-event fires the full realistic event sequence (pointer, focus, keydown, input, keyup), so it catches bugs that a single <code>fireEvent</code> would miss.`,
  c: `const user = userEvent.setup()
render(<Login />)
await user.type(screen.getByLabelText(/email/i), 'asha@example.com')
await user.keyboard('{Tab}')
await user.click(screen.getByRole('button', { name: /sign in/i }))` },
{ q: `How do you test form submissions in React Testing Library?`,
  k: `Fill the form, press send, and see what happened.`,
  a: `Fill fields via labels, submit with the button, then assert the handler was called with the right data or that the UI shows success/validation errors. With MSW, assert on the request body or resulting UI.`,
  c: `const onSubmit = vi.fn()
render(<ContactForm onSubmit={onSubmit} />)
await user.type(screen.getByLabelText(/name/i), 'Asha')
await user.click(screen.getByRole('button', { name: /send/i }))
expect(onSubmit).toHaveBeenCalledWith({ name: 'Asha' })` },
{ q: `What is the role of the waitFor function in React Testing Library?`,
  k: `Keep checking again and again until it's true or time runs out.`,
  a: `<code>waitFor(callback, { timeout })</code> retries the callback until it doesn't throw. Put only assertions inside (no side effects), one assertion per waitFor ideally, and prefer <code>findBy</code> when waiting for an element.` },
{ q: `How do you handle mocking in React Testing Library?`,
  k: `Swap the real shop with a pretend one during the test.`,
  a: `RTL doesn't mock; use your runner (<code>vi.mock</code>/<code>jest.mock</code>) for modules, MSW for HTTP, fake timers for time, and simple stubs for browser APIs missing in jsdom (<code>matchMedia</code>, <code>IntersectionObserver</code>, <code>ResizeObserver</code>).` },
{ q: `What is the purpose of the act function in React Testing Library?`,
  k: `act says "finish all the redrawing before I check".`,
  a: `<code>act()</code> ensures all updates, effects and microtasks from an action are flushed before assertions. RTL's render, fireEvent, user-event and async utilities already wrap in act; you rarely call it yourself. "Not wrapped in act" warnings usually mean an async update you didn't await.` },
{ q: `How do you test custom hooks using React Testing Library?`,
  k: `Put the sticker on a tiny test brick and watch what it does.`,
  a: `Use <code>renderHook</code> from <code>@testing-library/react</code> (the old react-hooks-testing-library is merged). Access <code>result.current</code>, wrap updates in <code>act</code>, pass a <code>wrapper</code> for providers. Often better: test the hook through a component that uses it.`,
  c: `const { result } = renderHook(() => useCounter(5))
act(() => result.current.increment())
expect(result.current.count).toBe(6)` },
{ q: `What are some best practices for writing tests with React Testing Library?`,
  k: `Find things like people do, wait the right way, and don't peek inside the robot.`,
  a: `Use <code>screen</code>; prefer <code>*ByRole</code>; use user-event; use <code>findBy</code> instead of waitFor+getBy; don't use container.querySelector; avoid test ids unless needed; one behaviour per test; custom render with providers; MSW for APIs; enable the <code>eslint-plugin-testing-library</code> rules.` },
{ q: `How do you test component rendering based on props in React Testing Library?`,
  k: `Give the brick different instructions and check what it shows.`,
  a: `Render with specific props and assert output; use <code>rerender</code> to change props; use <code>test.each</code> for tables of cases.`,
  c: `test.each([[0, 'No items'], [3, '3 items']])('count %i', (n, text) => {
  render(<CartBadge count={n} />)
  expect(screen.getByText(text)).toBeInTheDocument()
})` },
{ q: `How do you test context usage in React components with React Testing Library?`,
  k: `Put the loudspeaker on the test table too.`,
  a: `Wrap the component in the real provider with a test value (via <code>wrapper</code> or custom render) and assert on behaviour. Test the provider itself by rendering consumers that read and update it.`,
  c: `render(<Header />, { wrapper: ({ children }) => <AuthContext value={{ user: { name: 'Asha' } }}>{children}</AuthContext> })
expect(screen.getByText(/asha/i)).toBeInTheDocument()` },
{ q: `How do you test components that use React portals with React Testing Library?`,
  k: `The pop-up appears elsewhere on the table, but screen can still see it.`,
  a: `Portals render into <code>document.body</code> or a target node; <code>screen</code> queries the whole body, so query normally (<code>getByRole('dialog')</code>). If the portal targets a specific node, create it in the test setup.` },
{ q: `How do you handle setup and teardown in React Testing Library tests?`,
  k: `Set up the table and clean it after each game.`,
  a: `RTL auto-cleans rendered trees after each test (with globals enabled). Use <code>beforeEach</code>/<code>afterEach</code> for MSW handler resets, clearing mocks, localStorage, fake timers, and query client caches (create a new QueryClient per test).` },
{ q: `How do you test components that rely on window size or media queries with React Testing Library?`,
  k: `Pretend the screen is small or big.`,
  a: `jsdom has no layout. Mock <code>window.matchMedia</code> to return the desired matches, set <code>window.innerWidth</code> and dispatch <code>resize</code>, or inject breakpoints via context. For real responsive checks use Playwright with viewports.`,
  c: `window.matchMedia = vi.fn().mockImplementation(q => ({
  matches: q.includes('max-width: 600px'), media: q,
  addEventListener: vi.fn(), removeEventListener: vi.fn(),
}))` },
{ q: `How do you test React components with Redux using React Testing Library?`,
  k: `Give each test its own little cupboard.`,
  a: `Custom <code>renderWithProviders</code> creating a fresh store per test with optional <code>preloadedState</code>; interact through UI; assert UI (and optionally <code>store.getState()</code>). Don't mock the store or hooks.` },
{ q: `How do you test React Router components with React Testing Library?`,
  k: `Use a pretend map that starts on the page you want.`,
  a: `Wrap in <code>MemoryRouter initialEntries={['/toys/1']}</code> with matching routes, or <code>createMemoryRouter</code> + <code>RouterProvider</code> for loaders. In React Router v7 you can use <code>createRoutesStub</code>. Assert navigation by checking the destination content.`,
  c: `render(<MemoryRouter initialEntries={['/toys/7']}>
  <Routes><Route path="/toys/:id" element={<ToyPage />} /></Routes>
</MemoryRouter>)` },
{ q: `How do you test for accessibility compliance using React Testing Library?`,
  k: `Check that everyone, including people using screen readers, can use the toy.`,
  a: `Role-based queries already enforce accessible names. Add <code>jest-axe</code>/<code>vitest-axe</code>: <code>expect(await axe(container)).toHaveNoViolations()</code>. Test keyboard navigation with <code>user.tab()</code> and focus assertions. Automated checks catch only part of the issues; also test manually.` },
{ q: `How do you configure custom queries in React Testing Library?`,
  k: `Teach the finder a new way to find things.`,
  a: `Build queries with <code>buildQueries</code> and <code>queryHelpers</code>, then pass them to a custom render (<code>queries: { ...queries, ...custom }</code>) or use <code>configure({ testIdAttribute: 'data-qa' })</code> for a different test id attribute.` },
  ],
});
