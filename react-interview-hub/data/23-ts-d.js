(function () {
  const T = (lv, q, k, a, c) => ({ lv, q, k, a, c });
  HUB.sections.find(s => s.id === 'tsdeep').items.push(
// ---------- Types & declarations deep dive ----------
T('Medium', `What is the difference between target and lib in tsconfig?`,
  `target says what kind of JavaScript to write out; lib says which built-in tools TypeScript should know about.`,
  `<code>target</code> controls emitted syntax (ES2020, ES2022…) and down-levelling. <code>lib</code> controls which built-in type declarations are available (DOM, ES2023, WebWorker). They're independent: lib doesn't polyfill anything, so using an API at runtime still requires the environment to support it.`),
T('Hard', `What are ambient modules and how do you declare them?`,
  `Instruction cards for modules TypeScript can't see, like image files or old libraries.`,
  `<code>declare module 'name' { ... }</code> in a .d.ts describes a module without implementation; wildcard forms type non-code imports.`,
  `declare module '*.svg' { const src: string; export default src }
declare module '*.module.css' { const classes: Record<string, string>; export default classes }`),
T('Medium', `What are triple-slash references in TypeScript?`,
  `An old-style note at the top of a file saying "also read that other instruction card".`,
  `<code>/// &lt;reference types="vite/client" /&gt;</code> pulls in a type package; <code>/// &lt;reference path="..." /&gt;</code> includes another file; <code>lib</code> references include built-in libs. In modern code prefer imports and tsconfig <code>types</code>; they're still common in framework env files (vite-env.d.ts).`),
T('Medium', `What is the difference between optional properties (prop?) and prop: T | undefined?`,
  `"prop?" means the label might be missing; "T | undefined" means the label must be there but may be empty.`,
  `<code>{ a?: string }</code> allows omitting <code>a</code>. <code>{ a: string | undefined }</code> requires the key to be present. With <code>exactOptionalPropertyTypes</code>, <code>a?: string</code> no longer accepts an explicit <code>undefined</code> value.`),
T('Medium', `What is the difference between an index signature and a mapped type?`,
  `An index signature says "any label of this kind"; a mapped type builds labels from a known list.`,
  `<code>{ [key: string]: V }</code> describes open-ended keys. <code>{ [K in Keys]: V }</code> iterates a specific key union, producing exact properties, and supports modifiers and remapping.`),
T('Easy', `What is ReadonlyArray<T> vs readonly T[]?`,
  `Two ways to write "a list nobody can change".`,
  `They're equivalent: no <code>push</code>, <code>splice</code> or index assignment. <code>readonly string[]</code> is the shorthand. A mutable array is assignable to a readonly one but not vice versa. Use readonly arrays for function parameters you don't mutate.`),
T('Medium', `What are labeled tuple elements?`,
  `Giving each spot in a fixed list a name, so you remember what goes where.`,
  `<code>[start: number, end: number]</code> names positions for readability and editor hints (also with optional and rest elements). Labels don't change type compatibility.`,
  `type Range = [start: number, end: number, step?: number]`),
T('Medium', `What are rest elements in tuples?`,
  `A fixed start to the list, then "any number of these".`,
  `Tuples can include a spread of an array type anywhere: <code>[string, ...number[]]</code> or <code>[...string[], boolean]</code>, describing variable-length lists with fixed parts; key for typing function arguments.`),
T('Hard', `What is const enum and what are its gotchas?`,
  `A list of choices that gets replaced by plain values when compiled, but some fast tools can't do that replacement.`,
  `<code>const enum</code> members are inlined, so no runtime object exists. Gotchas: incompatible with <code>isolatedModules</code>/single-file transpilers across files, not usable for reverse lookup or iteration, risky in published .d.ts (consumers inline stale values). Prefer union literals or <code>as const</code> objects.`),
T('Medium', `What are numeric enum pitfalls?`,
  `Number-based choice lists let in numbers that aren't on the list.`,
  `Numeric enums accept any number (historically), reverse-map (values become keys in the runtime object, so <code>Object.keys</code> shows both), and auto-increment values can silently change when members are reordered. Use string enums or unions.`,
  `enum Color { Red, Green }
const c: Color = 42          // allowed for numeric enums (historically)
Object.keys(Color)           // ['0', '1', 'Red', 'Green']`),
T('Medium', `What is keyof typeof and when do you need it?`,
  `Read the labels of a real object and turn them into a list of allowed words.`,
  `<code>typeof obj</code> gets the type of a value; <code>keyof</code> of that gives its key union. Used to derive unions from runtime objects (config, lookup maps, as-const objects).`,
  `const routes = { home: '/', about: '/about' } as const
type RouteName = keyof typeof routes                  // 'home' | 'about'
type RoutePath = (typeof routes)[RouteName]           // '/' | '/about'`),
T('Hard', `What are deep indexed access types?`,
  `Follow a chain of labels into nested boxes to find the type deep inside.`,
  `Chain index access (<code>Config['db']['port']</code>), index with unions to get unions (<code>Config['db' | 'api']</code>), use <code>[number]</code> for array elements.`,
  `type Port = Config['db']['port']
type Item = Order['items'][number]`),
T('Hard', `What are the +/- modifiers in mapped types?`,
  `Add or remove "optional" and "locked" marks on every label.`,
  `In mapped types, <code>-?</code> removes optionality (Required), <code>+?</code>/<code>?</code> adds it (Partial), <code>-readonly</code> removes readonly (a "Mutable" type), <code>+readonly</code> adds it.`,
  `type Mutable<T> = { -readonly [K in keyof T]: T[K] }
type Concrete<T> = { [K in keyof T]-?: T[K] }`),
T('Medium', `What are the built-in string manipulation types?`,
  `Helpers that change the case of word-labels.`,
  `<code>Uppercase&lt;S&gt;</code>, <code>Lowercase&lt;S&gt;</code>, <code>Capitalize&lt;S&gt;</code>, <code>Uncapitalize&lt;S&gt;</code>, intrinsic types used with template literals to generate names like <code>onClick</code> or <code>GET_USER</code>.`),
T('Medium', `What is Readonly<T> vs as const?`,
  `Readonly locks the top labels of a type; as const locks a real value all the way down and remembers exact values.`,
  `<code>Readonly&lt;T&gt;</code> is a type-level, shallow readonly mapping. <code>as const</code> is applied to a value: deep readonly plus literal types and tuples. Neither freezes at runtime (use <code>Object.freeze</code> for that).`),
// ---------- Generics, classes & functions deep dive ----------
T('Medium', `What are barrel files and type-only re-exports?`,
  `One front-door file that re-shares toys from many rooms.`,
  `A barrel (<code>index.ts</code>) re-exports from many modules for tidy imports. Downsides: slower builds/tests, circular imports, weaker tree-shaking. Use <code>export type { X } from './x'</code> for types (required under isolatedModules) and keep barrels shallow.`),
T('Medium', `What is Array.isArray narrowing and why is it special?`,
  `Checking "is it a list?" makes TypeScript treat it as a list.`,
  `<code>Array.isArray(x)</code> is a built-in type guard (<code>x is any[]</code>), narrowing unions like <code>string | string[]</code>. Caveat: it narrows to <code>any[]</code> for unknown input, and doesn't narrow readonly arrays well in older versions.`,
  `function toArray(v: string | string[]) { return Array.isArray(v) ? v : [v] }`),
T('Hard', `What is ReturnType on overloaded functions and why is it tricky?`,
  `Asking "what does this recipe give back?" only reads its last menu.`,
  `Conditional types like ReturnType/Parameters resolve against the <b>last</b> overload signature only, so other overloads' types are ignored. Workarounds: a single generic signature, or a hand-written union of signatures.`),
T('Medium', `How does TypeScript infer generic types from usage?`,
  `It looks at what you actually pass in and works out the type from there.`,
  `TS collects inference candidates from arguments (and contextual return types), picks the best common type, and checks constraints. Literal types widen unless constrained (<code>T extends string</code> keeps literals) or using <code>const T</code>. If nothing infers, T falls back to its default or constraint (or unknown).`),
T('Hard', `What is an abstract class with a generic type parameter?`,
  `A half-finished factory design that children complete for one specific kind of toy.`,
  `Abstract generic bases share logic across entity types while subclasses supply type-specific parts (repositories, services).`,
  `abstract class Repo<T extends { id: string }> {
  protected items = new Map<string, T>()
  save(item: T) { this.items.set(item.id, item) }
  abstract validate(item: T): boolean
}
class UserRepo extends Repo<User> { validate(u: User) { return !!u.email } }`),
T('Hard', `What is an abstract constructor type?`,
  `A label for "a factory design that can't build things directly but can be extended".`,
  `<code>abstract new (...args: any[]) =&gt; T</code> describes abstract classes, which <code>new () =&gt; T</code> rejects. Used in mixins and DI to accept abstract bases.`),
T('Hard', `What is the accessor keyword in TypeScript 4.9+?`,
  `A shortcut that creates a hidden storage spot plus get and set doors for a property.`,
  `<code>accessor name = value</code> (auto-accessors from the decorators proposal) creates a private backing field with a getter/setter pair; standard decorators can then intercept get/set.`),
T('Hard', `What is excess property checking in function return types?`,
  `When a recipe returns a fresh object, TypeScript also complains about extra labels there, but only sometimes.`,
  `A function with an annotated return type gets excess property checks on returned object literals. Callbacks with contextual return types may not (e.g., <code>.map(() =&gt; ({...}))</code> into a typed array), so annotate the callback's return type when exactness matters.`),
T('Medium', `What is a "weak type" in TypeScript?`,
  `A label where every part is optional, so TypeScript checks that you share at least one part.`,
  `A type whose properties are all optional. Assigning a value that shares <b>no</b> properties with it is an error (weak type detection), catching mistakes like passing the wrong options object.`),
T('Hard', `How do you type iterables and the Symbol.iterator protocol?`,
  `Teach TypeScript what a box hands out, one toy at a time.`,
  `Implement <code>[Symbol.iterator](): Iterator&lt;T&gt;</code> (or make it a generator) and the class works with for...of, spread and <code>Array.from</code>; type parameters as <code>Iterable&lt;T&gt;</code> to accept arrays, sets and generators.`,
  `class Range implements Iterable<number> {
  constructor(private a: number, private b: number) {}
  *[Symbol.iterator]() { for (let i = this.a; i <= this.b; i++) yield i }
}
const nums = [...new Range(1, 3)]   // number[]`),
T('Hard', `How do you type generator functions?`,
  `Label what the storyteller says each time, what it says at the end, and what you can say back.`,
  `<code>Generator&lt;Yield, Return, Next&gt;</code> (and <code>AsyncGenerator</code>). Usually inferred; annotate for public APIs.`,
  `function* ids(): Generator<number, void, unknown> { let i = 0; while (true) yield i++ }
async function* pages(): AsyncGenerator<Item[]> { /* yield each page */ }`),
T('Medium', `How do you type Promise.allSettled and Promise.race?`,
  `allSettled tells you, for each helper, whether it succeeded or failed; race gives you whoever finished first.`,
  `<code>allSettled</code> returns a tuple of <code>PromiseSettledResult&lt;T&gt;</code> (<code>{ status: 'fulfilled'; value }</code> or <code>{ status: 'rejected'; reason: any }</code>), narrowed by <code>status</code>. <code>race</code> returns <code>Promise&lt;Awaited&lt;T[number]&gt;&gt;</code>, the union of input types.`,
  `const results = await Promise.allSettled([getA(), getB()])
const ok = results.filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof getA>>> => r.status === 'fulfilled')`),
T('Medium', `How do you type custom Error subclasses in TypeScript?`,
  `Make your own kind of "oops" with its own name and extra details.`,
  `Extend Error, set <code>name</code>, add typed fields, and pass <code>cause</code>. With older targets set the prototype explicitly so <code>instanceof</code> works.`,
  `class ApiError extends Error {
  constructor(message: string, public readonly status: number, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ApiError'
  }
}
if (e instanceof ApiError && e.status === 404) { /* ... */ }`),
T('Hard', `How do you type function composition?`,
  `Join recipes in a row so each one's dish is the next one's ingredient, and the types must line up.`,
  `Generic overloads or variadic generics ensure each function's input matches the previous output.`,
  `function pipe<A, B>(f: (a: A) => B): (a: A) => B
function pipe<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C
function pipe<A, B, C, D>(f: (a: A) => B, g: (b: B) => C, h: (c: C) => D): (a: A) => D
function pipe(...fns: Function[]) { return (x: unknown) => fns.reduce((v, f) => f(v), x) }
const slugLen = pipe((s: string) => s.trim(), s => s.toLowerCase(), s => s.length)`),
T('Hard', `How do you type partial application and currying?`,
  `Give ingredients one at a time and TypeScript tracks which ones are still missing.`,
  `Use variadic tuples: split parameters into those supplied and those remaining.`,
  `function partial<A extends unknown[], B extends unknown[], R>(fn: (...args: [...A, ...B]) => R, ...a: A) {
  return (...b: B) => fn(...a, ...b)
}
const add3 = (x: number, y: number, z: number) => x + y + z
const add1 = partial(add3, 1)   // (y: number, z: number) => number`),
// ---------- Type system edge cases ----------
T('Medium', `What are TypeScript's type compatibility rules?`,
  `A box fits where another is expected if it has at least the required parts of the right kinds.`,
  `Structural assignability: the source must have all required target properties with compatible types (extra allowed except fresh literals); functions are compatible if parameters accept what the target passes (fewer parameters OK) and returns are assignable; optional/readonly rules apply; <code>any</code> is assignable both ways; <code>unknown</code> only receives.`),
T('Hard', `What is the object type vs {} vs Object in TypeScript? (assignability)`,
  `object: real boxes only. {} and Object: almost anything except empty-nothing.`,
  `<code>let a: object = 1</code> ❌; <code>let b: {} = 1</code> ✅; <code>let c: Object = 'x'</code> ✅. Use <code>object</code> to reject primitives, <code>unknown</code> for anything, <code>Record&lt;string, unknown&gt;</code> for dictionary-like objects. Lint rules ban <code>{}</code> and <code>Object</code> as types.`),
T('Hard', `What is a discriminated union with two discriminants?`,
  `Two name tags on each box, and checking both tells you exactly which box it is.`,
  `Members can be distinguished by a combination of literal fields; TS narrows when you check both (TS 4.6+ also narrows via destructured discriminants).`,
  `type Res =
  | { kind: 'user'; ok: true; data: User }
  | { kind: 'user'; ok: false; error: string }
  | { kind: 'post'; ok: true; data: Post }
function h(r: Res) { if (r.kind === 'user' && r.ok) r.data.email }`),
T('Medium', `What happens when you spread object types in TypeScript?`,
  `Mixing two boxes: if both have the same label, the second box wins.`,
  `Spreading produces an object type where later properties override earlier ones, optional properties merge as unions, and methods/getters from classes are lost (only own enumerable props). Generic spreads produce intersections.`),
T('Easy', `What is namespace import (import * as X) typing?`,
  `Bring in the whole box of exports under one name.`,
  `<code>import * as utils from './utils'</code> gives an object type with all named exports (and <code>default</code> if any). Use <code>typeof import('./utils')</code> to reference the module's type.`),
T('Hard', `How does never behave in union and intersection types?`,
  `Adding "nothing" to a list changes nothing; requiring "nothing" makes the whole thing impossible.`,
  `<code>T | never</code> = T (never disappears from unions, which is why mapping to never filters). <code>T &amp; never</code> = never. Conflicting literal intersections (<code>'a' &amp; 'b'</code>) reduce to never, and objects with conflicting discriminants reduce to never.`),
T('Medium', `What is the difference between interface extends and type & intersection?`,
  `extends checks the new parts fit with the old; & just glues them and may hide clashes.`,
  `<code>interface B extends A</code> errors on incompatible property overrides and is cached by the checker (faster). <code>A &amp; B</code> silently intersects conflicting properties (possibly to never). Prefer extends for object hierarchies; intersections for ad hoc composition.`),
T('Medium', `What is type widening and how do you prevent it with as const?`,
  `Boxes that might change get a general label; as const says "never changing, remember exactly".`,
  `<code>const o = { status: 'idle' }</code> infers <code>status: string</code>. <code>as const</code> keeps <code>'idle'</code> and makes it readonly, so it can be passed where a literal union is expected.`),
T('Hard', `How does TypeScript handle this in callbacks?`,
  `Inside a normal callback, "this" may get lost; arrow functions keep the outside "this".`,
  `Regular functions get <code>this</code> from the call site, so passing a method as a callback loses it. Fix with arrow functions/class arrow properties or <code>bind</code>. Declare <code>this</code> parameters on callback types (like DOM listeners do) and enable <code>noImplicitThis</code> to catch mistakes.`),
T('Hard', `What is infer in a return type position vs parameter position?`,
  `Guessing from what a recipe gives back is "either/or"; guessing from what it takes in is "both".`,
  `A single infer variable appearing in several return (covariant) positions infers a union; in several parameter (contravariant) positions infers an intersection. Matching a union of functions against a parameter-position infer collapses to an intersection (the UnionToIntersection trick).`),
T('Hard', `What is exactOptionalPropertyTypes?`,
  `"Missing" and "present but empty" are treated as different things.`,
  `With this flag, <code>a?: string</code> means "absent or a string", not "string | undefined", so <code>{ a: undefined }</code> is rejected unless you write <code>a?: string | undefined</code>. Matches APIs where <code>'a' in obj</code> matters (patch requests, React props).`),
T('Medium', `What is the override keyword on abstract methods?`,
  `Mark the child's job as "this fills in the parent's to-do".`,
  `Implementing an abstract member may use <code>override</code>; with <code>noImplicitOverride</code> it's required for concrete overrides. It documents intent and errors if the base member is removed or renamed.`),
T('Hard', `What is a heterogeneous enum in TypeScript?`,
  `A choice list that mixes numbers and words, which is usually a bad idea.`,
  `An enum with both numeric and string members. Legal but confusing (reverse mapping only for numeric members, inconsistent serialization). Avoid it; prefer all-string enums or unions.`),
T('Medium', `What is the discriminant property narrowing with booleans?`,
  `A true/false name tag can also tell you which box you have.`,
  `Boolean literals work as discriminants: <code>{ ok: true; value: T } | { ok: false; error: E }</code> narrows on <code>if (r.ok)</code>. The literal types must be <code>true</code>/<code>false</code>, not <code>boolean</code>.`),
T('Easy', `What is TypeScript's --noEmitOnError flag?`,
  `Don't write out any JavaScript if the homework has mistakes.`,
  `By default tsc emits JS even when there are type errors. <code>noEmitOnError</code> stops emitting when errors exist, keeping broken output out of builds (bundler setups usually rely on a separate <code>tsc --noEmit</code> check instead).`),
// ---------- Real-world & miscellaneous ----------
T('Medium', `How do you migrate a JavaScript project to TypeScript incrementally?`,
  `Change one room at a time; the rest of the house keeps working.`,
  `Add tsconfig with <code>allowJs</code> (and optionally <code>checkJs</code> with JSDoc types); rename leaf modules and shared types first; install <code>@types</code>; write .d.ts for untyped deps; start lenient, then enable strict flags gradually (or strict per new file via tooling); track <code>any</code> count and ban new ones in lint; run type checking in CI.`),
T('Medium', `What is @ts-ignore vs @ts-expect-error vs @ts-nocheck?`,
  `Three ways to tell the checker to look away, from "this line" to "this whole file".`,
  `<code>// @ts-ignore</code> suppresses errors on the next line silently. <code>// @ts-expect-error</code> suppresses but errors if there's no error to suppress, so it doesn't rot (preferred). <code>// @ts-nocheck</code> disables checking for the file. Always add a reason comment.`),
T('Medium', `How do you type environment variables safely in TypeScript?`,
  `Check the settings once when the app starts, then everyone uses the checked copy.`,
  `Validate <code>process.env</code> / <code>import.meta.env</code> with a schema at startup and export a typed config object; for Vite, also augment <code>ImportMetaEnv</code> for editor types. Never trust raw env strings deep in the code.`,
  `const Env = z.object({ VITE_API_URL: z.string().url(), VITE_FLAG: z.enum(['on', 'off']).default('off') })
export const env = Env.parse(import.meta.env)`),
T('Medium', `What is declare const / declare function / declare var?`,
  `"This thing exists somewhere already; trust me about its type."`,
  `Ambient declarations describe values provided by the environment (globals from script tags, build-time constants like <code>__APP_VERSION__</code>) without emitting code.`,
  `declare const __APP_VERSION__: string
declare function gtag(...args: unknown[]): void`),
T('Easy', `What is the TypeScript language server and how does it power IDE features?`,
  `A helper running in the background of your editor that answers "what is this?" as you type.`,
  `<code>tsserver</code> is a long-running process editors talk to; it keeps a program model in memory to provide completions, hover types, go-to-definition, find references, renames, quick fixes and diagnostics. Plugins (e.g. for CSS modules) extend it.`),
T('Hard', `How do you type a React forwardRef component?`,
  `Let a parent reach inside the brick, and label what it can grab.`,
  `Pre-React 19: <code>forwardRef&lt;RefType, Props&gt;(...)</code>. In React 19, accept <code>ref</code> as a normal prop typed <code>React.Ref&lt;T&gt;</code> (or use <code>React.ComponentPropsWithRef&lt;'input'&gt;</code>).`,
  `// React 18
const Input = forwardRef<HTMLInputElement, Props>((props, ref) => <input ref={ref} {...props} />)
// React 19
function Input({ ref, ...props }: Props & { ref?: React.Ref<HTMLInputElement> }) { return <input ref={ref} {...props} /> }`),
T('Hard', `How do you type a mapped type that preserves optionality selectively?`,
  `Change only some labels to optional and leave the rest as they were.`,
  `Homomorphic mapped types (<code>[K in keyof T]</code>) preserve modifiers automatically. To change only selected keys, intersect two mapped types and prettify.`,
  `type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type NewUser = PartialBy<User, 'id' | 'createdAt'>`),
T('Hard', `What is TypeScript's satisfies with union types?`,
  `Check a value fits one of several shapes, and still remember which one it actually is.`,
  `<code>value satisfies A | B</code> validates against the union but keeps the specific inferred type, so later code knows which member it is without narrowing; with annotation you'd get the full union.`),
T('Hard', `How do you write TypeScript-first library types that are also ergonomic for JavaScript users?`,
  `Make instruction cards that help everyone, even people who don't read labels.`,
  `Ship .d.ts with correct <code>exports</code>/<code>types</code> conditions for ESM and CJS; prefer simple generic signatures with good inference over complex overloads; runtime-validate inputs (JS users get no compile-time checks); document with JSDoc (shown in JS editors); avoid exposing internal types; test types with <code>expectTypeOf</code>/tsd and attw.`),
T('Medium', `What is import.meta typing in TypeScript?`,
  `Information about the current file, like its address, with labels supplied by your tools.`,
  `<code>import.meta</code> is typed as <code>ImportMeta</code>; environments augment it: Vite adds <code>env</code> and <code>glob</code> via <code>vite/client</code> types, Node adds <code>url</code>, <code>dirname</code>, <code>filename</code>. Augment <code>ImportMetaEnv</code> for custom env vars.`),
T('Medium', `What is type-only namespace import and when is it useful?`,
  `Borrow all the labels from a file without borrowing any toys.`,
  `<code>import type * as Types from './types'</code> gives access to all exported types under one name with guaranteed erasure, handy for big generated type files (OpenAPI, GraphQL codegen).`),
T('Hard', `What are TypeScript's well-known symbol types?`,
  `Special built-in secret tags that hook into how JavaScript treats objects.`,
  `<code>Symbol.iterator</code>, <code>Symbol.asyncIterator</code>, <code>Symbol.hasInstance</code>, <code>Symbol.toPrimitive</code>, <code>Symbol.toStringTag</code>, <code>Symbol.dispose</code>/<code>asyncDispose</code> are typed as <code>unique symbol</code>s in lib files, so implementing them on classes is type-checked (iteration, instanceof behaviour, conversions, resource disposal).`),
T('Medium', `What is Awaited<T> vs PromiseLike<T>?`,
  `Awaited opens tickets to find the dish; PromiseLike describes anything that looks like a ticket.`,
  `<code>PromiseLike&lt;T&gt;</code> is an interface for any thenable (has <code>then</code>), useful for accepting promise-like inputs. <code>Awaited&lt;T&gt;</code> is a type operation computing the resolved value type.`),
T('Medium', `What is TypeScript project-level configuration with extends in tsconfig?`,
  `One shared settings page, with each project adding its own tweaks.`,
  `<code>"extends": "./tsconfig.base.json"</code> (or a package like <code>@tsconfig/strictest</code>) shares compiler options across packages; TS 5.0 allows extending multiple configs. Note <code>files/include/exclude</code> paths resolve relative to the config that defines them.`),
T('Hard', `How do you profile and debug TypeScript compile performance?`,
  `Find which part of the homework makes the checker slow.`,
  `<code>tsc --extendedDiagnostics</code> (time per phase, type counts), <code>--generateTrace dir</code> analysed with <code>@typescript/analyze-trace</code> or Perfetto, <code>--listFiles</code>/<code>--explainFiles</code> to find unexpected inputs, TS server logs in VS Code. Then simplify hot types, add explicit annotations, split projects.`),
  );
})();
