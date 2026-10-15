(function () {
  const T = (lv, q, k, a, c) => ({ lv, q, k, a, c });
  HUB.sections.find(s => s.id === 'tsdeep').items.push(
// ---------- Classes & OOP ----------
T('Easy', `What are access modifiers in TypeScript classes?`,
  `Signs on a robot's parts: "anyone can touch", "only family can touch", "only me".`,
  `<code>public</code> (default, accessible everywhere), <code>protected</code> (class and subclasses), <code>private</code> (only inside the class). They're compile-time only and erased; for real runtime privacy use JS <code>#fields</code>.`),
T('Medium', `What are abstract classes? When should you use them?`,
  `A half-finished robot design: it lists jobs the children must do, and you can't build the half-robot itself.`,
  `<code>abstract class</code> can't be instantiated; it can hold shared implementation plus <code>abstract</code> members subclasses must implement. Use when subclasses share real code; use an interface when you only need a contract.`,
  `abstract class Shape { abstract area(): number; describe() { return 'Area: ' + this.area() } }
class Square extends Shape { constructor(private s: number) { super() } area() { return this.s ** 2 } }`),
T('Hard', `What are decorators in TypeScript?`,
  `Stickers you put on a class or method that add extra behaviour, like logging every call.`,
  `Functions applied with <code>@decorator</code> to classes, methods, accessors and fields to wrap or annotate them. TS 5.0 implements the standard (TC39 stage 3) decorators; the older <code>experimentalDecorators</code> version (plus parameter decorators and metadata) is still used by Angular and NestJS. Not available on standalone functions.`,
  `function logged(fn: any, ctx: ClassMethodDecoratorContext) {
  return function (this: any, ...args: any[]) { console.log('call', String(ctx.name)); return fn.apply(this, args) }
}
class Api { @logged fetchUsers() {} }`),
T('Hard', `What are mixins in TypeScript?`,
  `Instead of one parent, you snap extra skill-packs onto a class.`,
  `A mixin is a function taking a base class constructor and returning a subclass with added members, letting you compose behaviours without multiple inheritance. Type the base as a constructor type.`,
  `type Ctor<T = {}> = new (...args: any[]) => T
function Timestamped<B extends Ctor>(Base: B) {
  return class extends Base { createdAt = new Date() }
}
class User {}
const StampedUser = Timestamped(User)
new StampedUser().createdAt`),
T('Medium', `What is the difference between implements and extends?`,
  `extends: you inherit your parent's skills. implements: you promise to have certain skills, and you must build them yourself.`,
  `<code>extends</code> inherits implementation from one class (runtime prototype chain). <code>implements</code> only checks that a class satisfies one or more interfaces at compile time; nothing is inherited.`),
T('Medium', `What is the override keyword?`,
  `A label saying "I'm changing my parent's way of doing this on purpose".`,
  `<code>override</code> marks methods that replace a base-class member; with <code>noImplicitOverride</code>, overriding without it is an error, and using it on a member that doesn't exist in the base is an error, catching renames.`),
T('Easy', `What does readonly do on class properties?`,
  `The value can be set when the robot is built, then never changed.`,
  `A <code>readonly</code> property can be assigned in its declaration or constructor only. Compile-time only; the object isn't frozen at runtime.`),
T('Easy', `What are static class members?`,
  `Things that belong to the robot factory, not to each robot.`,
  `Static members live on the class itself (<code>ClassName.member</code>), not on instances: factory methods, counters, shared constants, singletons. TS 4.4+ supports <code>static { }</code> initialization blocks.`,
  `class Id { static count = 0; static next() { return ++Id.count } }`),
T('Medium', `What is the difference between TypeScript private and JavaScript # private fields?`,
  `private is a "please don't touch" sign only TypeScript enforces; # is a real lock that works even when the program runs.`,
  `<code>private</code> is checked at compile time and erased, so it's accessible at runtime (and via bracket access). <code>#field</code> is a JS language feature, truly private at runtime, not visible to subclasses, and supports brand checks (<code>#x in obj</code>).`),
T('Easy', `What is constructor parameter shorthand (parameter properties)?`,
  `A shortcut that creates and fills a robot's parts straight from the build instructions.`,
  `Adding an access modifier or <code>readonly</code> to a constructor parameter declares and assigns the property automatically. Not allowed under <code>erasableSyntaxOnly</code> / Node's type stripping, since it generates code.`,
  `class User { constructor(public readonly id: string, private name: string) {} }`),
T('Medium', `What is strictPropertyInitialization?`,
  `A rule that every part of the robot must be filled in when it's built.`,
  `With this flag, class properties not marked optional must be assigned in the declaration or constructor. Use <code>!</code> (definite assignment) only when something else really initialises it (frameworks, init methods).`),
T('Hard', `How do you type a class constructor (ConstructorParameters, InstanceType)?`,
  `Tools to read what a robot factory needs and what kind of robot it builds.`,
  `Constructor types look like <code>new (...args: A) =&gt; T</code>. <code>ConstructorParameters&lt;typeof C&gt;</code> gives the argument tuple; <code>InstanceType&lt;typeof C&gt;</code> the instance type. Useful for factories and DI containers.`,
  `function create<C extends new (...a: any[]) => any>(Cls: C, ...args: ConstructorParameters<C>): InstanceType<C> {
  return new Cls(...args)
}`),
T('Medium', `What is the class-as-value vs class-as-type distinction?`,
  `The class name means two things: the factory (a real thing) and the label for robots it makes.`,
  `A class declaration creates a runtime value (the constructor) and a type (the instance shape). <code>User</code> in a type position means instances; <code>typeof User</code> means the constructor itself.`),
T('Medium', `How do you implement the Singleton pattern in TypeScript?`,
  `Only one robot is ever built, and everyone shares it.`,
  `Private constructor plus a static accessor that creates the instance once. In modern apps an ES module exporting a single instance is usually simpler.`,
  `class Config {
  private static instance?: Config
  private constructor() {}
  static get() { return (Config.instance ??= new Config()) }
}`),
T('Easy', `What is the difference between a class and an interface at runtime?`,
  `A class is a real factory that exists when the program runs; an interface is only a checklist that disappears.`,
  `Classes emit JavaScript (constructor, prototype methods) and support <code>instanceof</code>. Interfaces are erased completely, so you can't <code>instanceof</code> an interface; use type guards instead.`),
// ---------- Narrowing & type guards ----------
T('Easy', `What is type narrowing in TypeScript?`,
  `After you check what's in the box, TypeScript remembers and gives you the right tools.`,
  `Refining a broad type (union, unknown) to a more specific one inside a code path, based on checks the compiler understands (typeof, instanceof, in, equality, truthiness, discriminants, predicates).`),
T('Medium', `What are the six built-in narrowing techniques?`,
  `Six ways to check what's in the box.`,
  `1) <code>typeof</code> for primitives, 2) <code>instanceof</code> for class instances, 3) <code>in</code> for property presence, 4) truthiness checks, 5) equality checks (<code>===</code>, <code>!==</code>, <code>== null</code>), 6) discriminant (tag) checks on unions. Plus user-defined type predicates and assertion functions.`),
T('Medium', `What is the in operator narrowing?`,
  `"Does this box have a 'fly' label? Then it must be a bird."`,
  `<code>'prop' in obj</code> narrows a union to members that declare (or may have) that property.`,
  `type Fish = { swim(): void }; type Bird = { fly(): void }
function move(a: Fish | Bird) { if ('fly' in a) a.fly(); else a.swim() }`),
T('Medium', `What is a custom type guard function?`,
  `Your own checking machine whose "yes" TypeScript believes.`,
  `A function returning <code>x is T</code>. Use it to reuse complex checks and to filter arrays with correct types. Keep it truthful; a wrong predicate lies to the compiler.`,
  `const isDefined = <T,>(v: T | null | undefined): v is T => v != null
const ids = [1, null, 3].filter(isDefined)   // number[]`),
T('Hard', `What is an assertion function and how does it narrow?`,
  `A guard that either stops the show or lets TypeScript trust the box from then on.`,
  `A function typed <code>asserts cond</code> or <code>asserts x is T</code>; if it returns normally, the condition holds for the rest of the scope. Good for invariants and test helpers.`),
T('Medium', `What is control flow analysis?`,
  `TypeScript follows every path your program can take and remembers what you checked on the way.`,
  `The compiler tracks types through if/else, returns, throws, switch, loops and assignments, narrowing and widening variables at each point. Early returns narrow the remaining code.`,
  `function len(x: string | null) {
  if (!x) return 0
  return x.length   // x: string here
}`),
T('Medium', `How does narrowing work with switch statements?`,
  `Each case is a door; inside each door TypeScript knows exactly which box you have.`,
  `Switching on a discriminant or <code>typeof</code> narrows within each case; fallthrough cases combine. Use a <code>default</code> with a <code>never</code> check for exhaustiveness.`),
T('Easy', `What is narrowing with null and optional chaining?`,
  `"Is the box empty?" checks and the ?. "look only if it's there" helper.`,
  `<code>if (x != null)</code> removes null and undefined; <code>x?.y</code> yields undefined instead of throwing; <code>??</code> supplies defaults. The non-null assertion <code>x!</code> silences the compiler without checking, so use it sparingly.`),
T('Hard', `What happens to narrowing after a mutable variable is reassigned?`,
  `If someone swaps the toy, TypeScript forgets what it knew and checks again.`,
  `Narrowing is reset when a <code>let</code> variable is reassigned. Narrowings also don't survive into callbacks for mutable variables (the callback may run later), so copy to a <code>const</code> first. TS 5.4 preserves narrowing in closures after the last assignment.`),
T('Hard', `How do you use #private fields for brand-based narrowing?`,
  `A secret mark only real members of the family have, so you can test "are you really one of us?"`,
  `<code>#field in obj</code> is a runtime brand check that only true instances pass (not look-alike objects), and TS narrows <code>obj</code> to the class type.`,
  `class Money { #brand = true; static is(x: unknown): x is Money { return typeof x === 'object' && x !== null && #brand in x } }`),
T('Easy', `What is truthiness narrowing and what values does it exclude?`,
  `"If it's something real, keep going."`,
  `<code>if (x)</code> excludes falsy values: <code>false</code>, <code>0</code>, <code>-0</code>, <code>0n</code>, <code>''</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>. Careful: it also excludes legitimate 0 and empty strings; use <code>!= null</code> when only null/undefined should be excluded.`),
T('Hard', `What is the satisfies operator vs type annotation for narrowing?`,
  `A label stamped on the box makes TypeScript forget details; satisfies only checks and keeps the details.`,
  `An annotation sets the variable's type to the declared (often wider) type, losing literal info. <code>satisfies</code> checks against the type but keeps the narrower inferred type, so later code still knows exact keys and literal values.`),
T('Hard', `What is noUncheckedIndexedAccess and why is it useful?`,
  `It reminds you that looking in an array spot might find nothing.`,
  `With it, indexing arrays or index-signature objects returns <code>T | undefined</code>, forcing you to handle missing elements. It catches real bugs (out-of-range access, missing keys) that strict mode misses.`),
T('Medium', `How does TypeScript narrow unknown in a catch clause?`,
  `Anything could be thrown, so you must check what it is before using it.`,
  `With <code>useUnknownInCatchVariables</code> (in strict), <code>catch (e)</code> is <code>unknown</code>. Narrow with <code>e instanceof Error</code>, custom guards, or normalise with a helper.`,
  `try { await save() } catch (e) {
  const message = e instanceof Error ? e.message : String(e)
}`),
T('Medium', `What is the discriminant narrowing pattern?`,
  `Every kind of box carries a name tag; read the tag and you know the box.`,
  `Give each union member a shared literal property (<code>type</code>, <code>kind</code>), then check it with if/switch; TS narrows the whole object. It works best when the tag is a literal type and the union is closed.`),
// ---------- Modules, .d.ts & tooling ----------
T('Medium', `What is the difference between ESM and CommonJS in TypeScript?`,
  `Two different ways files share toys: the new import/export way and the old require way.`,
  `ESM uses <code>import/export</code>, static, async-loaded, tree-shakeable; CommonJS uses <code>require/module.exports</code>, synchronous. TS settings <code>module</code> and <code>moduleResolution</code> (<code>nodenext</code> for Node, <code>bundler</code> for Vite/webpack) decide emitted format and resolution; interop needs <code>esModuleInterop</code>.`),
T('Medium', `What is import type and why should you use it?`,
  `Borrowing only the label, not the toy, so nothing extra is packed.`,
  `<code>import type { User } from './user'</code> imports only types and is always erased, avoiding accidental runtime imports, side effects and circular-dependency issues. Inline form: <code>import { type User, getUser }</code>.`),
T('Hard', `What is isolatedModules and what restrictions does it impose?`,
  `A rule that every file must make sense on its own, so fast tools can translate them one at a time.`,
  `It ensures each file can be transpiled independently (as Babel, esbuild, SWC do). Restrictions: re-exporting types needs <code>export type</code>, <code>const enum</code> across files isn't allowed, files must be modules. Enable it with any single-file transpiler.`),
T('Easy', `What are .d.ts declaration files?`,
  `Instruction cards that describe a toy without containing the toy itself.`,
  `Type-only files describing the shape of JavaScript code: generated by <code>tsc --declaration</code> for libraries, shipped in packages or via <code>@types</code>, or handwritten for untyped modules and globals. They contain no implementation.`),
T('Hard', `What is module augmentation and how do you extend a third-party type?`,
  `Adding your own page to someone else's instruction book.`,
  `Re-declare the module and merge into its interfaces, from a file that is itself a module.`,
  `// express.d.ts
import 'express'
declare module 'express-serve-static-core' {
  interface Request { user?: { id: string } }
}`),
T('Hard', `What is global augmentation?`,
  `Adding a new label that every file in the house can see.`,
  `Inside a module, <code>declare global { ... }</code> adds to global types (<code>Window</code>, <code>globalThis</code>, global interfaces).`,
  `export {}
declare global { interface Window { analytics?: { track(e: string): void } } }`),
T('Easy', `What is @types and how does TypeScript find third-party types?`,
  `A shared library of instruction cards for toys that came without any.`,
  `TS looks for types in the package's own <code>types</code>/<code>exports</code> fields, then in <code>node_modules/@types</code> (DefinitelyTyped). <code>typeRoots</code> and <code>types</code> in tsconfig control which global type packages load.`),
T('Medium', `What are the most important tsconfig.json options and what do they do?`,
  `The settings page for the homework checker.`,
  `<code>strict</code>; <code>target</code> (emitted JS level); <code>lib</code> (available built-in types); <code>module</code>/<code>moduleResolution</code>; <code>jsx</code>; <code>noEmit</code> (bundler projects); <code>outDir</code>/<code>rootDir</code>; <code>declaration</code>; <code>paths</code>/<code>baseUrl</code>; <code>esModuleInterop</code>; <code>isolatedModules</code>/<code>verbatimModuleSyntax</code>; <code>skipLibCheck</code>; <code>noUncheckedIndexedAccess</code>; <code>include</code>/<code>exclude</code>.`),
T('Hard', `What is verbatimModuleSyntax?`,
  `"Keep my import lines exactly as I wrote them; only drop the ones marked as labels."`,
  `With it, TS keeps imports/exports without the <code>type</code> modifier and drops only those marked <code>type</code>. Behaviour becomes predictable for all transpilers; it replaces <code>importsNotUsedAsValues</code> and <code>preserveValueImports</code>.`),
T('Medium', `What is paths in tsconfig and how do you set up import aliases?`,
  `Short nicknames for long folder addresses.`,
  `<code>paths</code> maps import specifiers to locations for type checking (<code>"@/*": ["./src/*"]</code>). The bundler/runtime must know the alias too (Vite <code>resolve.alias</code>, vite-tsconfig-paths, Node subpath imports), since tsc doesn't rewrite paths.`),
T('Medium', `What is the difference between tsc and tools like esbuild/SWC for TypeScript?`,
  `tsc checks the homework and translates it; the fast tools only translate.`,
  `tsc type-checks across the whole program and can emit JS and declarations. esbuild/SWC/Babel strip types file by file very fast, without type checking. Common setup: bundler for builds/dev, <code>tsc --noEmit</code> in CI and editors for checking. The Go-based TypeScript 7 compiler aims to make tsc much faster.`),
T('Hard', `What is project references in TypeScript?`,
  `Splitting a huge homework into chapters that can be checked separately and only rechecked when changed.`,
  `<code>references</code> plus <code>composite: true</code> split a codebase into sub-projects built with <code>tsc --build</code>, enabling incremental builds, enforced boundaries and faster editor performance in monorepos.`),
T('Medium', `What is namespace in TypeScript and is it still recommended?`,
  `An old way of grouping things under one name, from before files could share toys properly.`,
  `<code>namespace X { }</code> creates a runtime object grouping code (formerly "internal modules"). For application code ES modules replace them; namespaces remain useful in declaration files for describing global libraries and merging with functions/classes.`),
T('Hard', `How do you write a .d.ts file for a JavaScript module?`,
  `Write the instruction card for an untyped toy.`,
  `Declare the module and its exports, put the file in a folder included by tsconfig, and refine over time.`,
  `// types/slugify.d.ts
declare module 'tiny-slugify' {
  export interface Options { lower?: boolean }
  export default function slugify(input: string, opts?: Options): string
}`),
T('Medium', `What is skipLibCheck and when should you use it?`,
  `"Don't re-check the instruction cards that came with borrowed toys."`,
  `It skips type checking of all <code>.d.ts</code> files (yours and node_modules), speeding up builds and avoiding conflicts between dependency type versions. Recommended for most apps; library authors should still validate their own declarations.`),
// ---------- Async, errors & React ----------
T('Easy', `How does TypeScript type async/await?`,
  `An async recipe always hands you a ticket (Promise) for the dish; await opens the ticket.`,
  `An <code>async</code> function's return type is <code>Promise&lt;T&gt;</code>; <code>await</code> on <code>Promise&lt;T&gt;</code> gives <code>T</code>. Annotate as <code>async function f(): Promise&lt;User&gt;</code>.`),
T('Medium', `What is Awaited<T> and when do you need it?`,
  `It opens tickets inside tickets until it finds the real dish.`,
  `<code>Awaited&lt;T&gt;</code> recursively unwraps promises/thenables, matching what <code>await</code> does. Use it with ReturnType of async functions, in generic helpers, and when modelling Promise.all.`,
  `type User = Awaited<ReturnType<typeof getUser>>`),
T('Medium', `How do you handle errors in TypeScript async code safely?`,
  `Treat every "oops" as unknown until you check what it is.`,
  `Catch variables are <code>unknown</code>: narrow with <code>instanceof Error</code> or guards; define typed error classes; consider Result types for expected failures; handle every promise (<code>no-floating-promises</code> lint rule); validate external data with zod.`),
T('Hard', `What is the Result / Either pattern in TypeScript?`,
  `Instead of throwing, the recipe returns a box saying either "here's your dish" or "here's what went wrong".`,
  `Return a discriminated union so failures are part of the type and callers must handle them.`,
  `type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }
async function getUser(id: string): Promise<Result<User, 'not_found' | 'network'>> { /* ... */ }
const r = await getUser('1')
if (!r.ok) showError(r.error) else render(r.value)`),
T('Easy', `How do you type React functional components?`,
  `Write down what instructions the brick accepts.`,
  `Type the props parameter directly (preferred) or use <code>React.FC</code>; return JSX. Extend native element props with <code>React.ComponentProps&lt;'button'&gt;</code>.`,
  `type Props = { title: string; onClose?: () => void; children?: React.ReactNode }
function Modal({ title, onClose, children }: Props) { return <div>{title}{children}</div> }`),
T('Easy', `How do you type React useState?`,
  `Usually TypeScript guesses; tell it when the box starts empty.`,
  `Inference works from the initial value. Provide a generic for null starts, unions or empty arrays.`,
  `const [user, setUser] = useState<User | null>(null)
const [tags, setTags] = useState<string[]>([])`),
T('Medium', `How do you type React event handlers?`,
  `Each kind of poke has its own label.`,
  `Use <code>React.ChangeEvent&lt;HTMLInputElement&gt;</code>, <code>React.MouseEvent&lt;HTMLButtonElement&gt;</code>, <code>React.FormEvent&lt;HTMLFormElement&gt;</code>, <code>React.KeyboardEvent</code>, or handler types like <code>React.ChangeEventHandler&lt;HTMLInputElement&gt;</code>. Inline handlers infer automatically.`),
T('Medium', `How do you type useRef in React?`,
  `Tell the pocket what will go in it.`,
  `DOM refs: <code>useRef&lt;HTMLInputElement&gt;(null)</code> → <code>RefObject</code>, read with <code>ref.current?.focus()</code>. Mutable values: <code>useRef&lt;number | null&gt;(null)</code>. React 19 types require an initial argument; ref props are typed <code>React.Ref&lt;T&gt;</code>.`),
T('Medium', `How do you type a custom React hook?`,
  `Say what the sticker needs and what it gives back.`,
  `Annotate parameters and return value; return tuples <code>as const</code>; use generics for reusable hooks.`,
  `function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  return { data, error } as const
}`),
T('Medium', `How do you type useReducer?`,
  `Write the shape of the box and a list of every allowed message.`,
  `Type the state and a discriminated union of actions; TS infers the rest and narrows <code>action</code> in each case.`,
  `type Action = { type: 'add'; item: Item } | { type: 'remove'; id: string }
function reducer(state: Item[], action: Action): Item[] {
  switch (action.type) {
    case 'add': return [...state, action.item]
    case 'remove': return state.filter(i => i.id !== action.id)
  }
}
const [items, dispatch] = useReducer(reducer, [])`),
T('Medium', `How do you type React context?`,
  `Write on the loudspeaker what kind of messages it plays, and complain if nobody plugged it in.`,
  `<code>createContext&lt;Value | null&gt;(null)</code> plus a hook that throws when missing, so consumers get a non-null type.`),
T('Medium', `How do you handle AbortController with TypeScript?`,
  `A typed "never mind!" button for shop trips.`,
  `Pass <code>signal: AbortSignal</code> through functions; on abort, fetch rejects with a <code>DOMException</code> named "AbortError", so check <code>e instanceof DOMException &amp;&amp; e.name === 'AbortError'</code>. <code>AbortSignal.timeout(ms)</code> and <code>AbortSignal.any()</code> are handy.`),
T('Hard', `How do you type generic React components?`,
  `A brick that works with any kind of toy list and remembers the toy type.`,
  `Make the component function generic so props relate (items and renderItem).`,
  `type ListProps<T> = { items: T[]; render: (item: T) => React.ReactNode; getKey: (item: T) => string }
function List<T>({ items, render, getKey }: ListProps<T>) {
  return <ul>{items.map(i => <li key={getKey(i)}>{render(i)}</li>)}</ul>
}`),
T('Medium', `What are React.ReactNode, React.ReactElement, and JSX.Element?`,
  `ReactNode: anything you can draw. ReactElement: one drawn brick. JSX.Element: what a JSX tag gives you.`,
  `<code>ReactNode</code>: anything renderable (elements, strings, numbers, arrays, null, booleans), the right type for <code>children</code>. <code>ReactElement</code>: an element object with type and props. <code>JSX.Element</code>: the result type of a JSX expression (a ReactElement). Use ReactNode for props.`),
T('Hard', `How do you type a higher-order component (HOC) in TypeScript?`,
  `The gift wrapper must keep the brick's own instructions and only remove the ones it fills in.`,
  `Generic over the wrapped props; omit the injected ones from the outer props.`,
  `function withUser<P extends { user: User }>(Comp: React.ComponentType<P>) {
  return (props: Omit<P, 'user'>) => <Comp {...(props as P)} user={useUser()} />
}`),
  );
})();
