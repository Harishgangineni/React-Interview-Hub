HUB.add({
  id: 'basics', title: 'React basics', short: 'Basics',
  blurb: 'Components, JSX, state, props, events, lists and the class lifecycle.',
  items: [
{ q: `What is React?`,
  k: `React is a box of Lego bricks for websites. You build small bricks (a button, a card) and snap them together into a whole page. When something changes, React only swaps the bricks that changed.`,
  a: `React is a JavaScript library for building user interfaces from <b>components</b>. You describe what the UI should look like for a given state, and React updates the DOM to match (declarative UI). It is maintained by Meta; the current major version is React 19. React itself is only the view layer: routing, data fetching and build tooling come from the ecosystem or a framework such as Next.js or React Router.`,
  t: `Say "library, not framework": React handles rendering; you choose routing, state and data tools.` },
{ q: `What are the main features of React?`,
  k: `Little reusable pieces, a clever "spot the difference" game so only changed parts get redrawn, and data that flows down like water from parent to child.`,
  a: `<ul><li><b>Components</b>: reusable, composable UI units.</li><li><b>JSX</b>: HTML-like syntax inside JavaScript.</li><li><b>Declarative rendering + reconciliation</b>: React diffs the new element tree with the old one and applies minimal DOM changes.</li><li><b>One-way data flow</b>: data goes down through props, events go up through callbacks.</li><li><b>Hooks</b>: state and side effects in function components.</li><li><b>Concurrent rendering</b>: transitions, Suspense, streaming SSR.</li><li><b>React 19</b>: Actions, <code>use()</code>, Server Components, and the React Compiler for automatic memoization.</li></ul>`,
  u: `"Virtual DOM" is still a fine word in interviews, but the modern framing is reconciliation plus concurrent rendering and the React Compiler.` },
{ q: `What is JSX?`,
  k: `JSX lets you write what the page looks like using tags, like drawing with HTML, but inside your JavaScript homework.`,
  a: `JSX is a syntax extension that looks like HTML and compiles to function calls (<code>jsx()</code> from <code>react/jsx-runtime</code> since the automatic runtime, previously <code>React.createElement</code>). It produces plain objects called React elements. Because it is JavaScript, you can embed expressions with <code>{}</code>, map arrays, and pass components as values.`,
  c: `const name = 'Hareesh'
const el = <h1 className="title">Hello, {name}</h1>
// compiles to roughly:
// jsx('h1', { className: 'title', children: ['Hello, ', name] })`,
  t: `JSX is optional but universal. You no longer need "import React" in every file because of the automatic JSX runtime.` },
{ q: `How does JSX differ from HTML?`,
  k: `JSX looks like HTML but follows JavaScript's rules, so some words change: "class" becomes "className", and every tag must be closed.`,
  a: `<ul><li><code>className</code> instead of <code>class</code>, <code>htmlFor</code> instead of <code>for</code>.</li><li>Attributes are camelCase: <code>onClick</code>, <code>tabIndex</code>.</li><li><code>style</code> takes an object: <code>style={{ color: 'red' }}</code>.</li><li>Every tag must close: <code>&lt;img /&gt;</code>.</li><li>One root per expression (use a Fragment).</li><li>Expressions go in <code>{}</code>; comments are <code>{/* */}</code>.</li><li>Text is escaped by default, which protects against XSS.</li></ul>` },
{ q: `What is a component in React?`,
  k: `A component is one Lego brick: a little machine that takes some instructions and gives back a piece of the screen.`,
  a: `A component is a function (or class) that takes <b>props</b> and returns React elements describing part of the UI. Components can hold state, run effects, and compose other components. Names must start with a capital letter so JSX treats them as components, not HTML tags. Keep them pure: same props and state should give the same output.`,
  c: `function Greeting({ name }) {
  return <p>Hi {name}!</p>
}
<Greeting name="Asha" />` },
{ q: `What are functional components?`,
  k: `A functional component is a recipe: you give it ingredients (props) and it gives you the dish (the screen part).`,
  a: `Plain JavaScript functions that receive props and return JSX. With hooks (<code>useState</code>, <code>useEffect</code>, etc.) they can do everything class components could, with less boilerplate and better reuse through custom hooks. They are the standard way to write React today and the only kind the React Compiler optimises.`,
  c: `function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}` },
{ q: `What are class components?`,
  k: `The older way of building bricks, where each brick is a little robot with a body called "this" that remembers things.`,
  a: `ES6 classes extending <code>React.Component</code> with a <code>render()</code> method, state in <code>this.state</code>, updates via <code>this.setState</code>, and lifecycle methods such as <code>componentDidMount</code>. They still work in React 19 but are legacy: new code uses function components. The one thing still class-only is an <b>error boundary</b> (or a library like <code>react-error-boundary</code>).`,
  c: `class Counter extends React.Component {
  state = { count: 0 }
  render() {
    return <button onClick={() => this.setState({ count: this.state.count + 1 })}>
      {this.state.count}
    </button>
  }
}` },
{ q: `How do you create a React application?`,
  k: `You use a starter kit that sets up the whole toy box for you, so you can start building right away.`,
  a: `In 2026: <code>npm create vite@latest my-app -- --template react-ts</code> for a client-side app, or a framework when you need routing, SSR and data loading: <code>npx create-next-app@latest</code> or React Router's framework mode (<code>npx create-react-router@latest</code>). React's docs recommend starting with a framework.`,
  u: `Create React App was officially deprecated in February 2025. Mention it only as history; say Vite or a framework instead.`,
  c: `npm create vite@latest toy-box -- --template react-ts
cd toy-box && npm install && npm run dev` },
{ q: `What is the purpose of render() in React?`,
  k: `render is the part that says "this is what I look like right now".`,
  a: `In class components, <code>render()</code> returns the elements for the current props and state. It must be pure: no setState, no DOM access, no side effects. In function components the function body itself is the render. At the root, React 18+ uses <code>createRoot(el).render(&lt;App /&gt;)</code>; the old <code>ReactDOM.render</code> was removed in React 19.`,
  c: `import { createRoot } from 'react-dom/client'
createRoot(document.getElementById('root')).render(<App />)` },
{ q: `What is a state in React?`,
  k: `State is the component's memory, like a sticky note it keeps: "I have been clicked 3 times".`,
  a: `State is data owned by a component that changes over time and triggers a re-render when updated. Keep it minimal: derive everything you can from props or other state during render instead of storing duplicates. Server data is better kept in a cache like TanStack Query; URL-shaped state belongs in the URL.`,
  c: `const [isOpen, setIsOpen] = useState(false)`,
  t: `"Don't store what you can compute" is a senior signal. Duplicated state drifts out of sync.` },
{ q: `How do you update the state in a React component?`,
  k: `You never scribble on the sticky note directly. You hand React a new note, and React redraws the picture.`,
  a: `Call the setter from <code>useState</code> (or <code>setState</code> in classes). Never mutate: create new objects or arrays. When the new value depends on the old one, use the updater function. Updates are batched (automatically everywhere since React 18) and applied on the next render, so the variable does not change immediately.`,
  c: `setCount(c => c + 1)                         // depends on previous
setUser(u => ({ ...u, name: 'Asha' }))       // new object, not mutation
setTodos(t => t.filter(x => x.id !== id))     // new array`,
  t: `Classic trap: calling setCount(count + 1) three times adds 1, not 3. Use the updater form.` },
{ q: `What are props in React?`,
  k: `Props are the instructions a parent gives a child: "be blue, say hello".`,
  a: `Props are read-only inputs passed from a parent to a child, like function arguments. A component must never modify its props. They can be any value: strings, objects, functions (callbacks), JSX, even components. <code>children</code> is the prop for nested content. In React 19, <code>ref</code> is also an ordinary prop for function components.` },
{ q: `How do you pass props to a component?`,
  k: `You write them like labels on the brick when you use it.`,
  a: `As JSX attributes; strings in quotes, everything else in braces. The child receives one props object, usually destructured with defaults.`,
  c: `<Avatar user={user} size={48} onClick={handleClick} rounded />

function Avatar({ user, size = 32, onClick, rounded = false }) {
  return <img src={user.photo} width={size} onClick={onClick} />
}

// spread when forwarding: <Button {...rest} />` },
{ q: `What is the difference between state and props?`,
  k: `Props are what your parents tell you. State is what you remember yourself.`,
  a: `<b>Props</b> come from the parent, are read-only, and change when the parent re-renders with new values. <b>State</b> is owned and updated by the component itself. Both trigger re-renders. If two siblings need the same state, lift it up to their common parent and pass it down as props.` },
{ q: `What is the use of the key prop in React?`,
  k: `Keys are name tags for kids in a line, so if they swap places the teacher still knows who is who.`,
  a: `<code>key</code> gives list items a stable identity so React can match elements between renders, keeping the right state and DOM nodes when items are added, removed or reordered. Use a stable unique id from your data. Array index is only safe for static lists that never reorder. Keys must be unique among siblings, not globally.`,
  c: `{todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}`,
  t: `Changing a component's key resets it completely, a handy trick to reset a form: <code>&lt;Form key={userId} /&gt;</code>.` },
{ q: `What are React fragments?`,
  k: `A fragment is an invisible bag that holds several bricks together without adding an extra box.`,
  a: `Fragments let a component return multiple elements without adding a wrapper DOM node, which keeps HTML valid (table rows, lists) and CSS layouts clean. Short syntax <code>&lt;&gt;...&lt;/&gt;</code>; use <code>&lt;Fragment key={id}&gt;</code> when you need a key in a list.`,
  c: `return (
  <>
    <dt>{term}</dt>
    <dd>{definition}</dd>
  </>
)` },
{ q: `How do you handle events in React?`,
  k: `You tell the button "when someone presses you, run this little job".`,
  a: `Pass a function to camelCase props like <code>onClick</code> or <code>onChange</code>. React wraps native events in a <b>SyntheticEvent</b> with a consistent API and attaches listeners at the root container (since React 17). Call <code>e.preventDefault()</code> explicitly; returning false does nothing.`,
  c: `<button onClick={() => remove(item.id)}>Delete</button>
<form onSubmit={e => { e.preventDefault(); save() }}>`,
  t: `Pass the function, don't call it: onClick={save} not onClick={save()}.` },
{ q: `What is conditional rendering in React?`,
  k: `Showing a picture only when it's the right time, like a "Good night" sign only at night.`,
  a: `Using JavaScript conditions to decide what to render: <code>if</code> with early return, the ternary, <code>&amp;&amp;</code>, or a lookup object for many cases. Return <code>null</code> to render nothing.`,
  c: `if (isLoading) return <Spinner />
return (
  <>
    {error ? <ErrorBox /> : <List />}
    {items.length > 0 && <Badge count={items.length} />}
  </>
)`,
  t: `Trap: {count &amp;&amp; &lt;Badge /&gt;} renders "0" when count is 0. Use count &gt; 0 &amp;&amp;.` },
{ q: `How do you perform list rendering in React?`,
  k: `You have a list of toys and you make one picture for each toy.`,
  a: `Map an array to elements, each with a stable <code>key</code>. Filter or sort before mapping (on a copy). For very long lists use virtualization (TanStack Virtual, react-window).`,
  c: `<ul>
  {products
    .filter(p => p.inStock)
    .map(p => <li key={p.id}>{p.name}</li>)}
</ul>` },
{ q: `What are React lifecycle methods?`,
  k: `The life story of a brick: it's born (mount), it changes (update), and it's put away (unmount).`,
  a: `Class component hooks into three phases. <b>Mounting</b>: constructor, getDerivedStateFromProps, render, componentDidMount. <b>Updating</b>: getDerivedStateFromProps, shouldComponentUpdate, render, getSnapshotBeforeUpdate, componentDidUpdate. <b>Unmounting</b>: componentWillUnmount. <b>Errors</b>: getDerivedStateFromError, componentDidCatch. In function components, <code>useEffect</code> covers mount, update and cleanup.`,
  c: `useEffect(() => {
  const id = setInterval(tick, 1000)   // like componentDidMount
  return () => clearInterval(id)       // like componentWillUnmount
}, [])` },
{ q: `What is the difference between componentWillMount and componentDidMount?`,
  k: `One ran just before the brick was placed, the other right after. The "before" one caused trouble, so it was retired.`,
  a: `<code>componentWillMount</code> ran before the first render (and on the server); it is deprecated as <code>UNSAFE_componentWillMount</code> because with async rendering it could run more than once. <code>componentDidMount</code> runs once after the component is in the DOM: the right place for subscriptions, DOM measurement and starting fetches. Equivalent today: <code>useEffect(fn, [])</code>.`,
  u: `componentWillMount is legacy. Initialise state in the constructor or useState initialiser instead.` },
{ q: `What is the use of componentWillUnmount in React?`,
  k: `Cleaning up your toys before you leave the room.`,
  a: `It runs right before a class component is removed, to clean up: clear timers, unsubscribe, abort requests, remove global listeners. Forgetting cleanup causes memory leaks and "setState on unmounted component" bugs. Hook equivalent: the function returned from <code>useEffect</code>.` },
{ q: `What is the purpose of shouldComponentUpdate in React?`,
  k: `A question the brick asks: "Did anything I care about really change? If not, I'll skip redrawing."`,
  a: `A class lifecycle method that returns false to skip re-rendering when the next props and state would not change the output. It is a performance escape hatch; <code>React.PureComponent</code> implements it with a shallow comparison. Function equivalent: <code>React.memo</code>, and in React 19 the React Compiler can memoize automatically.` },
{ q: `How do you handle errors in React using error boundaries?`,
  k: `An error boundary is a safety net: if one brick breaks, the net catches it and shows "Oops" instead of the whole tower falling.`,
  a: `An error boundary is a class component with <code>static getDerivedStateFromError</code> (to show a fallback) and/or <code>componentDidCatch</code> (to log). It catches errors during rendering, lifecycle methods and constructors of its children. It does <b>not</b> catch errors in event handlers, async code or the boundary itself. Most teams use the <code>react-error-boundary</code> package for a hook-friendly API and reset support.`,
  c: `import { ErrorBoundary } from 'react-error-boundary'
<ErrorBoundary fallback={<p>Something went wrong.</p>} onError={logError}>
  <Dashboard />
</ErrorBoundary>`,
  u: `React 19 adds root options onCaughtError and onUncaughtError for central logging.` },
{ q: `What is the use of refs in React?`,
  k: `A ref is a pocket where you keep something you need to grab later, like the TV remote, without making the screen redraw.`,
  a: `Refs give direct access to a DOM node or hold a mutable value that persists across renders without causing re-renders. Use them for focus, text selection, measuring, media playback, integrating non-React libraries, and storing timer ids or previous values. Avoid them for anything that should appear on screen: that's state.` },
{ q: `How do you create refs in React?`,
  k: `You make an empty pocket with useRef, then tell an element "put yourself in this pocket".`,
  a: `In function components: <code>useRef(initial)</code>. In classes: <code>React.createRef()</code> or callback refs. In React 19 function components accept <code>ref</code> as a normal prop, so <code>forwardRef</code> is no longer needed. Callback refs can also return a cleanup function in React 19.`,
  c: `function Search() {
  const inputRef = useRef(null)
  return <>
    <input ref={inputRef} />
    <button onClick={() => inputRef.current.focus()}>Focus</button>
  </>
}` },
{ q: `What is the use of controlled components in React?`,
  k: `A controlled input is a puppet: React holds the strings and decides exactly what letters appear.`,
  a: `A controlled input gets its value from React state and reports changes via <code>onChange</code>. React is the single source of truth, which makes validation, formatting, conditional fields and resetting easy. Cost: a re-render per keystroke, which is usually fine; for huge forms use React Hook Form (uncontrolled by default).`,
  c: `const [email, setEmail] = useState('')
<input value={email} onChange={e => setEmail(e.target.value)} />` },
{ q: `What is the use of uncontrolled components in React?`,
  k: `An uncontrolled input is a kid drawing on their own; you only look at the picture when they're done.`,
  a: `The DOM keeps the value; you read it when needed through a ref or <code>FormData</code>. Good for simple forms, file inputs (always uncontrolled), and integrating non-React code. React 19 form Actions make uncontrolled forms first-class: <code>&lt;form action={fn}&gt;</code> receives <code>FormData</code>.`,
  c: `function Signup() {
  async function action(formData) {
    await createUser(formData.get('email'))
  }
  return <form action={action}><input name="email" defaultValue="" /><button>Join</button></form>
}` },
{ q: `What is the purpose of default props in React?`,
  k: `If a parent forgets to give an instruction, the brick uses a sensible "normal" setting.`,
  a: `Default props provide fallback values for props that aren't passed. For function components use default parameters in destructuring. <code>Component.defaultProps</code> was deprecated for function components and removed in React 19 (still works for classes).`,
  c: `function Button({ variant = 'primary', size = 'md', children }) { ... }`,
  u: `defaultProps on function components no longer works in React 19.` },
{ q: `How do you optimize performance in a React application?`,
  k: `Don't redraw what didn't change, don't carry toys you don't need yet, and don't make the helper run to the shop twice.`,
  a: `Measure first with React DevTools Profiler and Lighthouse/Web Vitals. Then: <ul><li>Avoid unnecessary renders: keep state local, split context, memoize (<code>React.memo</code>, <code>useMemo</code>, <code>useCallback</code>) or enable the <b>React Compiler</b>.</li><li>Ship less JS: code splitting with <code>lazy</code>, tree shaking, smaller dependencies.</li><li>Long lists: virtualization.</li><li>Keep typing smooth: <code>useTransition</code>, <code>useDeferredValue</code>, debounce.</li><li>Data: cache with TanStack Query, prefetch, avoid waterfalls.</li><li>Rendering strategy: SSR/SSG/streaming, Server Components.</li><li>Assets: image sizes, lazy loading, fonts.</li></ul>`,
  t: `Say "measure, then fix the biggest thing". Premature useMemo everywhere is a junior smell.` },
  ],
});
