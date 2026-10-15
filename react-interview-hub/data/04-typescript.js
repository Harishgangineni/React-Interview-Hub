HUB.add({
  id: 'typescript', title: 'React with TypeScript', short: 'TypeScript',
  blurb: 'Typing props, state, hooks, events, refs, context, Redux, routing and tests.',
  items: [
{ q: `What are the benefits of using TypeScript with React?`,
  k: `TypeScript is a grown-up who checks your homework before you hand it in, so mistakes are caught early.`,
  a: `Catches bugs at compile time (wrong props, missing fields, null access), gives autocomplete and safe refactors, documents component APIs in code, and makes large teams faster. It replaced <code>propTypes</code> (whose runtime checks were removed in React 19). Cost: some learning curve and typing effort.` },
{ q: `How do you set up a React application with TypeScript?`,
  k: `Pick the starter kit that says "TS" on the box.`,
  a: `<code>npm create vite@latest app -- --template react-ts</code>, or <code>create-next-app</code> (TypeScript by default). For an existing project: add <code>typescript</code>, <code>@types/react</code>, <code>@types/react-dom</code>, a <code>tsconfig.json</code>, and rename files to <code>.tsx</code>.`,
  u: `CRA's TypeScript template is deprecated with CRA itself.` },
{ q: `What is the purpose of the tsconfig.json file?`,
  k: `It's the rule book that tells the homework checker how strict to be.`,
  a: `It configures the TypeScript compiler: which files to include, target JS version, module system, JSX mode (<code>"jsx": "react-jsx"</code>), path aliases, and strictness. Always use <code>"strict": true</code>. With Vite, <code>"noEmit": true</code> because the bundler transpiles; <code>tsc</code> only type-checks.`,
  c: `{
  "compilerOptions": {
    "target": "ES2022", "module": "ESNext", "moduleResolution": "bundler",
    "jsx": "react-jsx", "strict": true, "noEmit": true,
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}` },
{ q: `How do you define types for props in a functional component?`,
  k: `You write a list saying what each instruction must look like.`,
  a: `Declare a <code>type</code> or <code>interface</code> and annotate the destructured props. Optional props use <code>?</code> plus a default value. Extend native element props with <code>ComponentProps&lt;'button'&gt;</code>.`,
  c: `type ButtonProps = {
  variant?: 'primary' | 'ghost'
  onClick?: () => void
  children: React.ReactNode
} & React.ComponentProps<'button'>

function Button({ variant = 'primary', ...rest }: ButtonProps) {
  return <button data-variant={variant} {...rest} />
}` },
{ q: `How do you define types for props in a class component?`,
  k: `Same list, but you hand it to the class robot in angle brackets.`,
  a: `Pass generics to <code>React.Component&lt;Props, State&gt;</code>.`,
  c: `type Props = { initial: number }
type State = { count: number }
class Counter extends React.Component<Props, State> {
  state: State = { count: this.props.initial }
  render() { return <span>{this.state.count}</span> }
}` },
{ q: `What is the use of the React.FC type?`,
  k: `A label that says "this is a function brick". Handy, but many grown-ups prefer not to use it.`,
  a: `<code>React.FC&lt;Props&gt;</code> types a function component's props and return type. Since React 18 types it no longer adds implicit <code>children</code>. Most teams now type props directly on the parameter instead, which works better with generics and default values. Either is acceptable; be consistent.` },
{ q: `How do you define types for state in a class component?`,
  k: `You tell the robot exactly what goes in its memory box.`,
  a: `Provide the State type as the second generic and initialise <code>state</code> with that type. <code>setState</code> is then checked: partial updates must match keys of State.`,
  c: `class Form extends React.Component<{}, { email: string; sent: boolean }> {
  state = { email: '', sent: false }
}` },
{ q: `How do you use TypeScript with React hooks?`,
  k: `Most hooks guess the type themselves; when they can't, you tell them in angle brackets.`,
  a: `Rely on inference when the initial value says it all. Supply a generic when it doesn't (null initial, unions, empty arrays). Type reducers with a discriminated union of actions so <code>switch</code> narrows correctly.`,
  c: `const [user, setUser] = useState<User | null>(null)
type Action = { type: 'add'; todo: Todo } | { type: 'remove'; id: string }
const [todos, dispatch] = useReducer((s: Todo[], a: Action) => s, [])` },
{ q: `How do you define types for useState hook?`,
  k: `If the box starts empty, write on it what will go in later.`,
  a: `<code>useState(0)</code> infers number. Use a generic for nullable or union types: <code>useState&lt;Status&gt;('idle')</code>, <code>useState&lt;Item[]&gt;([])</code>. Avoid <code>useState&lt;any&gt;</code>.` },
{ q: `How do you define types for useEffect hook?`,
  k: `useEffect doesn't need a label; just make sure the clean-up job returns nothing or a function.`,
  a: `<code>useEffect</code> takes <code>() =&gt; void | (() =&gt; void)</code>. You don't type it; just don't return a promise. For async work define an inner async function and call it, or use an AbortController in cleanup.`,
  c: `useEffect(() => {
  let cancelled = false
  ;(async () => { const d = await load(); if (!cancelled) setData(d) })()
  return () => { cancelled = true }
}, [])` },
{ q: `How do you define types for custom hooks?`,
  k: `You say what the sticker needs and what it gives back.`,
  a: `Type parameters and return value explicitly. Return tuples <code>as const</code> so they don't widen to arrays of unions; return objects for 3+ values. Use generics to make hooks reusable.`,
  c: `function useToggle(initial = false) {
  const [on, set] = useState(initial)
  const toggle = useCallback(() => set(v => !v), [])
  return [on, toggle] as const
}
function useFetch<T>(url: string): { data?: T; error?: Error } { ... }` },
{ q: `How do you handle event types in React with TypeScript?`,
  k: `Each kind of poke (click, typing, sending a form) has its own label.`,
  a: `Use React's event types: <code>React.ChangeEvent&lt;HTMLInputElement&gt;</code>, <code>React.MouseEvent&lt;HTMLButtonElement&gt;</code>, <code>React.FormEvent&lt;HTMLFormElement&gt;</code>, <code>React.KeyboardEvent</code>. Inline handlers infer types automatically. For handler props use <code>React.ChangeEventHandler&lt;HTMLInputElement&gt;</code>.`,
  c: `function onChange(e: React.ChangeEvent<HTMLInputElement>) { setValue(e.target.value) }` },
{ q: `How do you type ref objects in React with TypeScript?`,
  k: `Tell the pocket what kind of thing will be put in it.`,
  a: `DOM refs: <code>useRef&lt;HTMLInputElement&gt;(null)</code> (then <code>ref.current?.focus()</code>). Mutable value refs: <code>useRef&lt;number | undefined&gt;(undefined)</code>. In React 19 types <code>useRef</code> requires an argument. For ref props in 19 use <code>ref?: React.Ref&lt;HTMLInputElement&gt;</code> in your props type.` },
{ q: `How do you type context in React with TypeScript?`,
  k: `Write on the loudspeaker what kind of messages it plays.`,
  a: `Give <code>createContext</code> a type including <code>null</code> (or <code>undefined</code>) for "no provider", then a custom hook that throws if missing, so consumers get a non-null type.`,
  c: `type Auth = { user: User | null; login(u: User): void }
const AuthContext = createContext<Auth | null>(null)
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth outside AuthProvider')
  return ctx
}` },
{ q: `What is the use of the React.Context type?`,
  k: `It's the type name for the loudspeaker itself.`,
  a: `<code>React.Context&lt;T&gt;</code> is the type returned by <code>createContext&lt;T&gt;()</code>. You use it when writing generic helpers that accept any context, e.g. a <code>createSafeContext</code> utility or a function that reads a context passed in. <code>React.ContextType&lt;typeof Ctx&gt;</code> extracts the value type.` },
{ q: `How do you define types for higher-order components?`,
  k: `The gift wrapper must promise to keep the brick's original instructions and add its own.`,
  a: `Make the HOC generic over the wrapped component's props and omit the props the HOC injects.`,
  c: `function withUser<P extends { user: User }>(Comp: React.ComponentType<P>) {
  return function Wrapped(props: Omit<P, 'user'>) {
    const user = useUser()
    return <Comp {...(props as P)} user={user} />
  }
}` },
{ q: `How do you handle default props in React with TypeScript?`,
  k: `Mark the instruction "optional" and give it a normal setting.`,
  a: `Make the prop optional in the type and give a default in destructuring: <code>({ size = 'md' }: Props)</code>. TypeScript then treats <code>size</code> as defined inside the component. Avoid <code>defaultProps</code> on function components (removed in React 19).` },
{ q: `How do you use generics in React components?`,
  k: `A generic brick works with any kind of toy and remembers which kind you gave it.`,
  a: `Declare a type parameter on the component so props relate to each other, e.g. a list or select that works with any item type.`,
  c: `type ListProps<T> = { items: T[]; getKey(item: T): string; render(item: T): React.ReactNode }
function List<T>({ items, getKey, render }: ListProps<T>) {
  return <ul>{items.map(i => <li key={getKey(i)}>{render(i)}</li>)}</ul>
}
<List items={users} getKey={u => u.id} render={u => u.name} />` },
{ q: `How do you type children props in React with TypeScript?`,
  k: `"Children" can be almost anything you put between the tags.`,
  a: `Use <code>children: React.ReactNode</code> (anything renderable) or <code>React.PropsWithChildren&lt;Props&gt;</code>. Use <code>React.ReactElement</code> only when you require a single element, and a function type for render-prop children.` },
{ q: `How do you use TypeScript with React Router?`,
  k: `The map tells you exactly which roads exist and what each road needs.`,
  a: `React Router v7 is written in TypeScript. In framework mode it generates route types (<code>./+types/route</code>) so loaders, actions, params and <code>loaderData</code> are typed automatically. In library mode, type hooks yourself: <code>useParams&lt;{ id: string }&gt;()</code>, <code>useLoaderData&lt;typeof loader&gt;()</code>.` },
{ q: `How do you define types for route parameters in React Router?`,
  k: `Tell the map that "/toys/:id" always has an id.`,
  a: `<code>const { id } = useParams&lt;{ id: string }&gt;()</code> — values can still be <code>undefined</code> at the type level, so validate. In framework mode use generated <code>Route.LoaderArgs</code> where <code>params.id</code> is typed from the path.`,
  c: `import type { Route } from './+types/toy'
export async function loader({ params }: Route.LoaderArgs) {
  return getToy(params.id)
}` },
{ q: `How do you use TypeScript with Redux?`,
  k: `Label the house rule book so every message and every drawer has a clear name.`,
  a: `Use Redux Toolkit; infer types from the store instead of writing them: <code>RootState = ReturnType&lt;typeof store.getState&gt;</code>, <code>AppDispatch = typeof store.dispatch</code>, then typed hooks via <code>useSelector.withTypes&lt;RootState&gt;()</code>.`,
  c: `export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()` },
{ q: `How do you define types for actions in Redux?`,
  k: `Every message has a label saying what kind it is and what it carries.`,
  a: `With RTK, <code>createSlice</code> generates action creators and types from <code>PayloadAction&lt;T&gt;</code>. In classic Redux, a discriminated union on <code>type</code>. Use <code>action.match</code> or RTK's matchers for narrowing.`,
  c: `reducers: { added(state, action: PayloadAction<Todo>) { state.push(action.payload) } }` },
{ q: `How do you define types for reducers in Redux?`,
  k: `The rule book says: given this box and this message, here is the new box.`,
  a: `In RTK the slice infers it: type <code>initialState</code> and each <code>PayloadAction</code>. Classic: <code>(state: State = initial, action: Action): State</code>. Use <code>satisfies</code> or explicit types on initialState for unions.`,
  c: `const initialState: { items: Todo[]; status: 'idle' | 'loading' } = { items: [], status: 'idle' }` },
{ q: `How do you define types for thunks in Redux?`,
  k: `A thunk is a helper job; you label what it returns and what it can read.`,
  a: `Prefer <code>createAsyncThunk</code>, which infers types from the payload creator. For manual thunks, type with <code>ThunkAction&lt;ReturnType, RootState, unknown, UnknownAction&gt;</code> or define <code>AppThunk</code>.`,
  c: `export type AppThunk<R = void> = ThunkAction<R, RootState, unknown, UnknownAction>` },
{ q: `How do you use TypeScript with Redux Toolkit?`,
  k: `RTK already wears labels; you just tell it the shape of each drawer.`,
  a: `Type initial state and payloads; let RTK infer the rest. Export RootState/AppDispatch, use typed hooks, and type thunks via <code>createAsyncThunk.withTypes&lt;{ state: RootState; rejectValue: string }&gt;()</code>. RTK Query endpoints are typed with <code>builder.query&lt;Result, Arg&gt;</code>.` },
{ q: `How do you define types for slices in Redux Toolkit?`,
  k: `Write the drawer's contents list once; the rest is filled in.`,
  a: `Declare a <code>State</code> type, pass it via typed <code>initialState</code>, and use <code>PayloadAction&lt;T&gt;</code> in each case reducer. Selectors receive <code>RootState</code>; RTK 2 slices also support typed <code>selectors</code>.`,
  c: `type CartState = { items: Item[] }
const cartSlice = createSlice({
  name: 'cart', initialState: { items: [] } as CartState,
  reducers: { add(s, a: PayloadAction<Item>) { s.items.push(a.payload) } },
  selectors: { count: s => s.items.length },
})` },
{ q: `How do you define types for async thunks in Redux Toolkit?`,
  k: `Label what you send, what comes back, and what a "no" looks like.`,
  a: `Generics are <code>&lt;Returned, ThunkArg, ThunkApiConfig&gt;</code>; usually inferred from the function, with <code>rejectValue</code> configured.`,
  c: `export const fetchUser = createAsyncThunk<User, string, { rejectValue: string }>(
  'user/fetch',
  async (id, { rejectWithValue }) => {
    const res = await api.get('/users/' + id).catch(() => null)
    return res ? res.data : rejectWithValue('Not found')
  })` },
{ q: `How do you use TypeScript with styled-components?`,
  k: `Tell the styled brick which extra instructions it accepts.`,
  a: `styled-components v6 ships its own types. Type extra props with a generic and use transient <code>$props</code> so they aren't passed to the DOM. Type the theme by augmenting <code>DefaultTheme</code>.`,
  c: `const Box = styled.div<{ $tone: 'info' | 'error' }>\`
  color: \${p => (p.$tone === 'error' ? 'crimson' : 'navy')};
\`` ,
  u: `styled-components is in maintenance mode (March 2025); prefer CSS Modules or Tailwind for new work.` },
{ q: `How do you define types for styled-components?`,
  k: `Teach the styling helper what your colours and sizes are called.`,
  a: `Declare the theme shape once with module augmentation, so <code>props.theme</code> is typed everywhere.`,
  c: `// styled.d.ts
import 'styled-components'
declare module 'styled-components' {
  export interface DefaultTheme { colors: { primary: string; bg: string }; space: (n: number) => string }
}` },
{ q: `How do you handle third-party libraries without type definitions?`,
  k: `If a toy came without instructions, you write a small note yourself.`,
  a: `Check for <code>@types/lib</code> on DefinitelyTyped first. Otherwise add a declaration file: quick <code>declare module 'lib'</code> (any) to unblock, then a proper typed declaration for the parts you use. Wrap untyped libraries behind your own typed module.` },
{ q: `What is the use of the DefinitelyTyped repository?`,
  k: `A giant library of instruction notes for toys that didn't come with any.`,
  a: `A community repo publishing type definitions to npm as <code>@types/*</code> for JavaScript packages that don't ship their own. Versions track the library's major/minor. Many modern packages now bundle their own types, so check <code>package.json</code> "types" first.` },
{ q: `How do you write type definitions for third-party libraries?`,
  k: `You write the instruction note: what goes in, what comes out.`,
  a: `Create <code>types/lib.d.ts</code> with <code>declare module 'lib' { ... }</code>, describing exported functions, classes and interfaces. Include the folder in tsconfig. Contribute it to DefinitelyTyped if useful to others.`,
  c: `declare module 'tiny-slugify' {
  export default function slugify(input: string, opts?: { lower?: boolean }): string
}` },
{ q: `How do you configure Webpack for a React TypeScript application?`,
  k: `Teach the packing machine to read TS files.`,
  a: `Use <code>babel-loader</code> with <code>@babel/preset-typescript</code> or <code>ts-loader</code>/<code>swc-loader</code> for .tsx, add <code>resolve.extensions: ['.tsx', '.ts', '.js']</code>, and run type checks separately with <code>fork-ts-checker-webpack-plugin</code> or <code>tsc --noEmit</code>.`,
  u: `For new projects Vite (or Rspack) is the default; no TS loader config needed.` },
{ q: `What are some best practices for using TypeScript with React?`,
  k: `Be strict, be clear, and don't cheat with "anything goes".`,
  a: `<ul><li><code>strict: true</code>; avoid <code>any</code>, use <code>unknown</code> and narrow.</li><li>Type props on the parameter; extend native props with <code>ComponentProps</code>.</li><li>Use discriminated unions for variants and state machines.</li><li>Infer types from sources (zod schemas, store, API clients) instead of duplicating.</li><li>Validate external data at runtime (zod/valibot).</li><li>Prefer <code>satisfies</code> for config objects; <code>as const</code> for literal tuples.</li></ul>` },
{ q: `How do you migrate a JavaScript React project to TypeScript?`,
  k: `Change one room at a time, not the whole house at once.`,
  a: `Add TS with <code>allowJs</code>, start non-strict or with strict on new files, convert leaf utilities and shared types first, then components. Install <code>@types</code>, add declarations for untyped libs, turn on strict flags step by step, and track <code>any</code> count. Keep CI type-checking from day one.` },
{ q: `How do you handle type inference in React with TypeScript?`,
  k: `Let the checker guess when it can; only explain when it's confused.`,
  a: `Annotate boundaries (props, function parameters, exported functions) and let TypeScript infer locals, hook states with good initial values, and JSX. Use <code>typeof</code>, <code>ReturnType</code>, <code>ComponentProps</code> and schema inference (<code>z.infer</code>) to derive types from a single source.` },
{ q: `How do you define types for form data in React with TypeScript?`,
  k: `Write the shape of the form once and use it everywhere.`,
  a: `Define the form schema with zod and infer the type, then pass it to React Hook Form so fields, errors and submit data are typed.`,
  c: `const schema = z.object({ email: z.string().email(), age: z.coerce.number().min(18) })
type FormValues = z.infer<typeof schema>
const { register, handleSubmit } = useForm<FormValues>({ resolver: zodResolver(schema) })` },
{ q: `How do you handle errors in a React TypeScript application?`,
  k: `Every "oops" gets a label so you know what kind of oops it is.`,
  a: `Treat caught values as <code>unknown</code> and narrow (<code>if (e instanceof ApiError)</code>). Use a typed error class for API errors, error boundaries for render errors, and result types (<code>{ ok: true, data } | { ok: false, error }</code>) for expected failures.` },
{ q: `How do you integrate TypeScript with Jest for testing React components?`,
  k: `Let the test runner read TS files too.`,
  a: `Use <code>ts-jest</code> or Babel/SWC transforms (<code>@swc/jest</code>), install <code>@types/jest</code> and <code>@testing-library/jest-dom</code>, and set up a <code>jest.config.ts</code>. Many Vite projects use <b>Vitest</b>, which runs TS out of the box with a Jest-compatible API.` },
  ],
});
