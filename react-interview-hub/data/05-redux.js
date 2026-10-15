HUB.add({
  id: 'redux', title: 'Redux', short: 'Redux',
  blurb: 'Store, actions, reducers, middleware, selectors, side effects and persistence.',
  items: [
{ q: `What is Redux?`,
  k: `Redux is one big toy cupboard for the whole house. To change it, you send a note; a strict librarian reads the note and rearranges the cupboard.`,
  a: `Redux is a predictable state container: the whole app's global client state lives in one store, changes are described by plain-object <b>actions</b>, and pure <b>reducers</b> compute the next state. It gives traceable updates, time-travel debugging and a large ecosystem. Today you write Redux with <b>Redux Toolkit</b>, and you don't need Redux for server data (use RTK Query or TanStack Query).` },
{ q: `What are the core principles of Redux?`,
  k: `One cupboard, read-only, and only the librarian changes it using the rule book.`,
  a: `<ol><li><b>Single source of truth</b>: one store holds global state.</li><li><b>State is read-only</b>: the only way to change it is to dispatch an action.</li><li><b>Changes via pure functions</b>: reducers take state and action and return new state without side effects.</li></ol>` },
{ q: `What is a store in Redux?`,
  k: `The cupboard itself.`,
  a: `The object holding the state tree. API: <code>getState()</code>, <code>dispatch(action)</code>, <code>subscribe(listener)</code>. Created with RTK's <code>configureStore</code> and provided to React with <code>&lt;Provider store={store}&gt;</code>.` },
{ q: `How do you create a store in Redux?`,
  k: `Build the cupboard and tell it which drawers it has.`,
  a: `Use <code>configureStore</code> from Redux Toolkit; it combines reducers, adds thunk and dev checks, and enables DevTools.`,
  c: `import { configureStore } from '@reduxjs/toolkit'
export const store = configureStore({
  reducer: { cart: cartReducer, user: userReducer },
})`,
  u: `Plain createStore is marked deprecated (still works); use configureStore.` },
{ q: `What is an action in Redux?`,
  k: `A note that says what happened: "a toy was added".`,
  a: `A plain object with a <code>type</code> string (convention: <code>'domain/eventName'</code>) and optional <code>payload</code>. Actions describe <i>what happened</i>, not how to change state. They must be serializable.`,
  c: `{ type: 'cart/itemAdded', payload: { id: 7, qty: 1 } }` },
{ q: `What is an action creator?`,
  k: `A note-writing machine, so every note is written the same way.`,
  a: `A function that returns an action object, keeping type strings and payload shapes in one place. RTK's <code>createSlice</code> and <code>createAction</code> generate them for you.`,
  c: `const itemAdded = (item) => ({ type: 'cart/itemAdded', payload: item })` },
{ q: `What is a reducer in Redux?`,
  k: `The librarian's rule book: old cupboard + note = new cupboard.`,
  a: `A pure function <code>(state, action) =&gt; newState</code>. No mutation (in plain Redux), no API calls, no random values. Return the existing state for unknown actions. With RTK, Immer lets you write "mutating" code that produces immutable updates.` },
{ q: `How do you create a reducer in Redux?`,
  k: `Write the rule book page for each kind of note.`,
  a: `Modern: inside <code>createSlice</code>. Classic: a switch on <code>action.type</code> returning new objects.`,
  c: `function cartReducer(state = [], action) {
  switch (action.type) {
    case 'cart/itemAdded': return [...state, action.payload]
    case 'cart/itemRemoved': return state.filter(i => i.id !== action.payload)
    default: return state
  }
}` },
{ q: `What is the purpose of combineReducers?`,
  k: `Each drawer gets its own small rule book, and combineReducers staples them into one big book.`,
  a: `It merges slice reducers into a root reducer where each manages its own key of the state. Every action is passed to every slice reducer. <code>configureStore({ reducer: {...} })</code> calls it for you.` },
{ q: `What is middleware in Redux?`,
  k: `A checkpoint between sending the note and the librarian reading it, where someone can log it, delay it or do extra jobs.`,
  a: `Middleware wraps <code>dispatch</code>: <code>store =&gt; next =&gt; action =&gt; ...</code>. It can log, transform, delay, or run async logic before passing the action on. Examples: thunk, listener middleware, RTK Query's middleware, analytics, saga.`,
  c: `const logger = store => next => action => {
  console.log('dispatching', action.type)
  const result = next(action)
  console.log('next state', store.getState())
  return result
}` },
{ q: `How do you apply middleware in Redux?`,
  k: `Tell the cupboard which checkpoints to put in line.`,
  a: `With RTK: extend the defaults (keep thunk and dev checks).`,
  c: `configureStore({
  reducer,
  middleware: getDefault => getDefault().concat(logger, api.middleware),
})
// classic: createStore(reducer, applyMiddleware(thunk, logger))` },
{ q: `What is the purpose of the thunk middleware?`,
  k: `It lets you send a "to-do job" instead of a note: the job can wait for the shop, then send real notes.`,
  a: `Redux Thunk lets you dispatch functions <code>(dispatch, getState, extra) =&gt; {}</code> to run async or conditional logic, dispatching plain actions along the way. It's included by default in <code>configureStore</code> and is the recommended default for async logic.`,
  c: `const loadCart = () => async (dispatch) => {
  dispatch(cartLoading())
  const items = await api.getCart()
  dispatch(cartLoaded(items))
}` },
{ q: `How do you handle asynchronous actions in Redux?`,
  k: `Send a "started" note, go to the shop, then send "done" or "failed".`,
  a: `Options in order of preference: <b>RTK Query</b> for server data; <code>createAsyncThunk</code> for other async flows (dispatches pending/fulfilled/rejected); <b>listener middleware</b> for reactive side effects; sagas only if the team already uses them.` },
{ q: `What is the use of the Redux DevTools extension?`,
  k: `A replay camera that shows every note sent and how the cupboard changed.`,
  a: `Browser extension to inspect actions, state diffs, and time-travel (jump between states), export/import sessions, and trace where actions were dispatched. Enabled automatically by <code>configureStore</code> in development.` },
{ q: `What are selectors in Redux?`,
  k: `A selector is a little question: "how many toys are in the cart?" so everyone asks the same way.`,
  a: `Functions that read or derive data from state: <code>state =&gt; state.cart.items</code>. They encapsulate state shape and can be memoized with <code>createSelector</code> (Reselect) so derived arrays keep the same reference and don't cause re-renders.`,
  c: `const selectCartTotal = createSelector(
  [state => state.cart.items],
  items => items.reduce((sum, i) => sum + i.price * i.qty, 0)
)` },
{ q: `How do you use the useSelector hook in Redux?`,
  k: `A brick asks the cupboard a question and redraws only when the answer changes.`,
  a: `<code>useSelector(selector)</code> subscribes the component and re-renders when the selected value changes by reference (===). Select the smallest piece needed; avoid returning new objects/arrays from inline selectors (or use <code>shallowEqual</code> / memoized selectors).`,
  c: `const total = useSelector(selectCartTotal)` },
{ q: `What is the useDispatch hook in Redux?`,
  k: `It gives the brick a pen to write notes to the librarian.`,
  a: `<code>useDispatch()</code> returns the store's <code>dispatch</code> function (stable reference). Use typed versions in TypeScript.`,
  c: `const dispatch = useDispatch()
<button onClick={() => dispatch(itemAdded(toy))}>Add</button>` },
{ q: `What is the connect function in Redux?`,
  k: `The old way of plugging a brick into the cupboard.`,
  a: `<code>connect(mapStateToProps, mapDispatchToProps)(Component)</code> is a HOC from react-redux that injects state and dispatchers as props and optimises re-renders. Still supported, but hooks are the recommended API.` },
{ q: `How do you connect a React component to Redux?`,
  k: `Put the cupboard at the top of the house, then let bricks ask questions and write notes.`,
  a: `Wrap the app in <code>&lt;Provider store={store}&gt;</code>, then use <code>useSelector</code> and <code>useDispatch</code> in components (or <code>connect</code> in legacy code).` },
{ q: `What is the purpose of mapStateToProps?`,
  k: `It picks which bits from the cupboard become the brick's instructions.`,
  a: `In <code>connect</code>, it maps store state to props: <code>(state, ownProps) =&gt; ({ ... })</code>. Called on every store update; the component re-renders when the returned object is shallowly different.` },
{ q: `What is the purpose of mapDispatchToProps?`,
  k: `It gives the brick ready-made buttons that send notes.`,
  a: `In <code>connect</code>, it maps action creators to props so the component can call them directly. The object shorthand <code>{ addItem }</code> auto-binds to dispatch.` },
{ q: `What is the difference between mapStateToProps and useSelector?`,
  k: `Two ways to ask the cupboard; one is the old wrapper, the other is the new sticker.`,
  a: `<code>mapStateToProps</code> returns an object of props and uses shallow equality; it works with <code>connect</code> and class components. <code>useSelector</code> is called inside function components, can be used many times, uses strict equality by default, and doesn't add wrapper components.` },
{ q: `How do you handle side effects in Redux?`,
  k: `Reducers never phone the shop; helpers do the phoning.`,
  a: `Never in reducers. Use thunks / <code>createAsyncThunk</code>, RTK's <b>listener middleware</b> (react to actions: analytics, sync to storage, debounced saves), RTK Query for data, or Redux Saga for complex workflows.`,
  c: `listener.startListening({
  actionCreator: itemAdded,
  effect: async (action, api) => { await analytics.track('add_to_cart', action.payload) },
})` },
{ q: `What is the use of Redux Saga?`,
  k: `A manager who watches the notes and runs long, complicated errands step by step.`,
  a: `A middleware using generator functions to describe side effects as data (<code>call</code>, <code>put</code>, <code>takeLatest</code>, <code>race</code>). Strengths: cancellation, complex orchestration, testability. Costs: learning curve and boilerplate. For new code, RTK's listener middleware or RTK Query covers most needs.` },
{ q: `How do you implement Redux Saga in a React application?`,
  k: `Hire the manager, give them a list of notes to watch, and start them.`,
  a: `Create the middleware, add it to the store, and run root saga.`,
  c: `function* fetchUser(action) {
  try {
    const user = yield call(api.getUser, action.payload)
    yield put(userLoaded(user))
  } catch (e) { yield put(userFailed(e.message)) }
}
function* rootSaga() { yield takeLatest('user/requested', fetchUser) }
const saga = createSagaMiddleware()
const store = configureStore({ reducer, middleware: g => g({ thunk: false }).concat(saga) })
saga.run(rootSaga)` },
{ q: `What are some best practices for structuring a Redux application?`,
  k: `Group things by what they're about, not by what kind of file they are.`,
  a: `Follow the Redux Style Guide: use RTK; feature folders with one slice file each; keep state minimal and normalized; put logic in reducers, not components; model actions as events; use selectors; don't put non-serializable values or server cache in Redux (use RTK Query); only global state goes in Redux.` },
{ q: `How do you handle large-scale applications with Redux?`,
  k: `A big house needs labelled drawers, and some drawers only open when you enter that room.`,
  a: `Feature-based slices, normalized entities (<code>createEntityAdapter</code>), memoized selectors, RTK Query with tag invalidation, code-split reducers (<code>combineSlices</code> + <code>inject</code> in RTK 2), strict TypeScript, and clear ownership per team.` },
{ q: `What are some common performance issues with Redux, and how do you address them?`,
  k: `Too many bricks redraw when only one drawer changed.`,
  a: `<ul><li>Selectors returning new objects every time → memoize with <code>createSelector</code> or select primitives.</li><li>Components subscribing to large slices → select smaller pieces.</li><li>Huge arrays → normalize and look up by id.</li><li>Expensive derived data → memoized selectors.</li><li>Too many dispatches → batch (automatic in React 18).</li><li>Storing derived or server data → compute or move to RTK Query.</li></ul>` },
{ q: `How do you persist the Redux state across page reloads?`,
  k: `Before you sleep, write down what's in the cupboard; in the morning, read it back.`,
  a: `Use <code>redux-persist</code> or a listener that saves selected slices to <code>localStorage</code>/IndexedDB and loads them as <code>preloadedState</code>. Persist only what's needed (cart, preferences), version the stored shape for migrations, and never store secrets or tokens in localStorage.` },
{ q: `What is the use of the Redux Persist library?`,
  k: `A helper that automatically writes the cupboard list down and reads it back.`,
  a: `It wraps the root reducer with <code>persistReducer</code>, saves state to storage, rehydrates on startup with <code>persistStore</code>, and offers <code>whitelist</code>/<code>blacklist</code>, migrations and <code>PersistGate</code> to delay rendering until rehydrated. Configure RTK's serializable check to ignore its actions.` },
  ],
});

HUB.add({
  id: 'rtk', title: 'Redux Toolkit', short: 'Redux Toolkit',
  blurb: 'The official way to write Redux: configureStore, createSlice, thunks, entities, RTK Query.',
  items: [
{ q: `What is Redux Toolkit?`,
  k: `A ready-made kit that builds the cupboard and rule book for you with much less work.`,
  a: `The official, recommended way to write Redux. It removes boilerplate and bakes in best practices: <code>configureStore</code>, <code>createSlice</code> (Immer-powered reducers that auto-generate actions), <code>createAsyncThunk</code>, <code>createEntityAdapter</code>, listener middleware and <b>RTK Query</b> for data fetching and caching. Current major: RTK 2.x.` },
{ q: `What are the main features of Redux Toolkit?`,
  k: `Quick cupboard, quick rule book, quick shop trips.`,
  a: `<ul><li><code>configureStore</code> with good defaults and DevTools.</li><li><code>createSlice</code>: reducers + actions in one place, "mutating" syntax via Immer.</li><li><code>createAsyncThunk</code>: pending/fulfilled/rejected lifecycle.</li><li><code>createEntityAdapter</code>: normalized CRUD + selectors.</li><li><code>createSelector</code> re-exported.</li><li>Listener middleware for side effects.</li><li>RTK Query: data fetching, caching, invalidation, codegen.</li><li>Dev checks for mutation and non-serializable values.</li></ul>` },
{ q: `How do you set up a Redux store using Redux Toolkit?`,
  k: `Install the kit, build the cupboard, place it at the top of the house.`,
  a: `Install <code>@reduxjs/toolkit react-redux</code>, create the store, and provide it.`,
  c: `// store.js
export const store = configureStore({ reducer: { cart: cartSlice.reducer } })
// main.jsx
<Provider store={store}><App /></Provider>` },
{ q: `What is createSlice in Redux Toolkit?`,
  k: `One page that holds a drawer's starting contents and all its rules.`,
  a: `<code>createSlice({ name, initialState, reducers, extraReducers, selectors })</code> generates a reducer, action creators and action types. Reducers can "mutate" a draft thanks to Immer, or return a new value.` },
{ q: `How do you create a slice using createSlice?`,
  k: `Name it, give it starting toys, write the rules.`,
  a: `Define the slice and export its actions and reducer.`,
  c: `const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    itemAdded(state, action) { state.items.push(action.payload) },
    itemRemoved(state, action) { state.items = state.items.filter(i => i.id !== action.payload) },
  },
})
export const { itemAdded, itemRemoved } = cartSlice.actions
export default cartSlice.reducer` },
{ q: `What is createAsyncThunk in Redux Toolkit?`,
  k: `A shop-trip helper that automatically says "started", "done" or "failed".`,
  a: `<code>createAsyncThunk(type, payloadCreator)</code> returns a thunk that dispatches <code>pending</code>, <code>fulfilled</code> and <code>rejected</code> actions around a promise. Supports <code>rejectWithValue</code>, <code>condition</code> (skip if already loading), abort via <code>signal</code>.` },
{ q: `How do you handle asynchronous actions using createAsyncThunk?`,
  k: `Write the trip, then tell the drawer what to do at each step.`,
  a: `Handle lifecycle actions in <code>extraReducers</code>.`,
  c: `export const fetchToys = createAsyncThunk('toys/fetch', async (_, { signal }) =>
  (await api.get('/toys', { signal })).data)

extraReducers: builder => {
  builder
    .addCase(fetchToys.pending, s => { s.status = 'loading' })
    .addCase(fetchToys.fulfilled, (s, a) => { s.status = 'idle'; s.items = a.payload })
    .addCase(fetchToys.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })
}`,
  t: `For server data, RTK Query or TanStack Query removes all this code.` },
{ q: `What is the configureStore function in Redux Toolkit?`,
  k: `The one-step cupboard builder.`,
  a: `Wraps <code>createStore</code>: combines slice reducers, adds thunk, immutability and serializability checks in dev, sets up DevTools, and accepts <code>middleware</code>, <code>preloadedState</code> and <code>enhancers</code> callbacks.` },
{ q: `How do you integrate Redux Toolkit with React?`,
  k: `Place the cupboard at the top and use the ask/write stickers.`,
  a: `<code>&lt;Provider store={store}&gt;</code> at the root, typed <code>useAppSelector</code>/<code>useAppDispatch</code> hooks, slice actions dispatched from events, RTK Query hooks (<code>useGetToysQuery</code>) for data.` },
{ q: `What is the createEntityAdapter function in Redux Toolkit?`,
  k: `A tidy shelf system: every toy has a numbered spot and a list of numbers in order.`,
  a: `Generates reducers and selectors for normalized collections stored as <code>{ ids: [], entities: {} }</code>: <code>addOne</code>, <code>upsertMany</code>, <code>removeOne</code>, <code>selectAll</code>, <code>selectById</code>, plus optional <code>sortComparer</code>.` },
{ q: `How do you normalize data using createEntityAdapter?`,
  k: `Put each toy in its own numbered spot instead of a messy pile.`,
  a: `Create an adapter, use its initial state, and call its CRUD helpers in reducers.`,
  c: `const toysAdapter = createEntityAdapter({ sortComparer: (a, b) => a.name.localeCompare(b.name) })
const toysSlice = createSlice({
  name: 'toys', initialState: toysAdapter.getInitialState(),
  reducers: { toyAdded: toysAdapter.addOne, toysReceived: toysAdapter.setAll },
})
export const { selectAll: selectAllToys, selectById: selectToyById } =
  toysAdapter.getSelectors(state => state.toys)` },
{ q: `What is the use of the createReducer function?`,
  k: `A rule book written with a builder, without the automatic note machine.`,
  a: `Creates a reducer from a builder callback with Immer support, for when actions are defined elsewhere (shared <code>createAction</code>s). <code>createSlice</code> uses it internally.`,
  c: `const counter = createReducer(0, builder => {
  builder.addCase(increment, s => s + 1).addCase(reset, () => 0)
})` },
{ q: `How do you handle side effects with Redux Toolkit?`,
  k: `Use the built-in helpers for shop trips and for "when this happens, also do that".`,
  a: `<code>createAsyncThunk</code> for request-style effects, <b>listener middleware</b> (<code>createListenerMiddleware</code>) for reacting to actions or state changes with cancellation and debouncing, and <b>RTK Query</b> for all server data.` },
{ q: `What are some best practices for using Redux Toolkit?`,
  k: `Keep drawers small, rules simple, and don't store shop data in the cupboard by hand.`,
  a: `One slice per feature; RTK Query for server state; normalized entities; memoized selectors; typed hooks; serializable state only; event-style action names; keep component state local; test reducers and selectors as plain functions.` },
{ q: `How do you migrate from Redux to Redux Toolkit?`,
  k: `Swap old parts for kit parts one drawer at a time.`,
  a: `Replace <code>createStore</code> with <code>configureStore</code> (existing reducers work), convert reducers one by one to <code>createSlice</code>, replace hand-written thunks with <code>createAsyncThunk</code> or RTK Query, swap <code>connect</code> for hooks over time. RTK 2 removed the object syntax for <code>extraReducers</code>; use the builder.` },
{ q: `What is the use of the createAction function in Redux Toolkit?`,
  k: `A note-writing machine that also knows its own label.`,
  a: `<code>createAction('type', prepare?)</code> returns an action creator with <code>.type</code> and <code>.match()</code>. Useful for actions shared across slices or handled by middleware.`,
  c: `export const loggedOut = createAction('auth/loggedOut')
// any slice: builder.addCase(loggedOut, () => initialState)` },
{ q: `How do you create custom middleware with Redux Toolkit?`,
  k: `Add your own checkpoint to the line.`,
  a: `Write standard middleware (typed with <code>Middleware</code>) and append it via the <code>middleware</code> callback. For most effect-style needs prefer listener middleware.`,
  c: `const crashReporter = store => next => action => {
  try { return next(action) } catch (err) { report(err, action); throw err }
}
configureStore({ reducer, middleware: g => g().concat(crashReporter) })` },
{ q: `What is the difference between createSlice and createReducer?`,
  k: `createSlice is the full kit; createReducer is only the rule book.`,
  a: `<code>createSlice</code> generates the reducer <b>and</b> action creators from case reducers keyed by name. <code>createReducer</code> only builds the reducer and needs actions defined separately. Use slice by default; reducer when handling only external actions.` },
{ q: `How do you structure a large-scale application using Redux Toolkit?`,
  k: `Each room in the big house has its own labelled drawer and its own helper.`,
  a: `Feature folders (<code>features/cart/cartSlice.ts</code>, selectors, components), a single RTK Query <code>api</code> with <code>injectEndpoints</code> per feature, lazy-loaded slices with <code>combineSlices().inject</code>, entity adapters, listener middleware for cross-feature effects, and shared typed hooks in <code>app/</code>.` },
{ q: `What is the use of the nanoid function in Redux Toolkit?`,
  k: `It makes a random name tag for a new toy.`,
  a: `A tiny non-cryptographic unique id generator re-exported by RTK, typically used in a <code>prepare</code> callback to give new items ids (keeping reducers pure). Use <code>crypto.randomUUID()</code> when you need UUIDs.`,
  c: `todoAdded: {
  reducer(state, action) { state.push(action.payload) },
  prepare(text) { return { payload: { id: nanoid(), text } } },
}` },
  ],
});
