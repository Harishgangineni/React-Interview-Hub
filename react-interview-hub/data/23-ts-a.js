/* TypeScript deep dive. Question list from TypeScript_Interview_QA.pdf (@coding.artist, 210 questions).
   Answers written in our own words for this hub. lv = Easy | Medium | Hard */
(function () {
  const T = (lv, q, k, a, c) => ({ lv, q, k, a, c });
  HUB.add({
    id: 'tsdeep', title: 'TypeScript: 210 questions, easy to hard', short: 'TS 210',
    blurb: 'Fundamentals, type system, generics, classes, narrowing, tooling, React typing, advanced types and edge cases. Filter by Easy, Medium or Hard.',
    items: [
// ---------- Fundamentals ----------
T('Easy', `What is TypeScript and how does it differ from JavaScript?`,
  `TypeScript is JavaScript with labels on every box, checked before the program runs.`,
  `A statically typed superset of JavaScript from Microsoft. Any valid JS is valid TS. You add optional type annotations; the compiler checks them and then <b>erases</b> them, emitting plain JS. Differences: JS finds type mistakes at runtime, TS at compile time; TS adds interfaces, generics, enums, access modifiers and richer tooling; TS needs a build/transpile step.`),
T('Easy', `What are the benefits of using TypeScript over JavaScript?`,
  `Mistakes are caught early, your editor helps you more, and the code explains itself.`,
  `Compile-time error detection, excellent autocomplete and inline docs, safe large refactors (rename a field and every broken use lights up), self-documenting function signatures, easier collaboration on large teams, and no runtime cost because types are erased.`),
T('Easy', `What is the TypeScript compilation pipeline?`,
  `You write labelled code, a checker looks for mistakes, then the labels are peeled off and normal JavaScript runs.`,
  `Write <code>.ts</code> → <code>tsc</code> builds a type graph and reports errors → emits <code>.js</code> with types stripped (by default even if there were errors; set <code>noEmitOnError</code> to stop that) → the runtime executes plain JS. Bundler tools (esbuild, SWC, Vite) only strip types without checking, so run <code>tsc --noEmit</code> in CI.`),
T('Medium', `What is the difference between any, unknown, and never?`,
  `any: "anything goes, nobody checks". unknown: "could be anything, check before you use it". never: "this can't happen".`,
  `<b>any</b> disables type checking for that value and spreads unsafety. <b>unknown</b> is the safe top type: you can assign anything to it, but must narrow before using it. <b>never</b> is the bottom type with no values: functions that always throw or loop forever, impossible branches, exhaustiveness checks.`,
  `function parse(json: string): unknown { return JSON.parse(json) }
const v = parse('{"a":1}')
// v.a        ❌ error: v is unknown
if (typeof v === 'object' && v && 'a' in v) console.log(v.a) // ✅ after narrowing
function fail(msg: string): never { throw new Error(msg) }`),
T('Medium', `What does void mean as a return type? How is it different from undefined?`,
  `void means "I don't give anything back that you should use".`,
  `<code>void</code> says the return value should be ignored. A function type returning void can be implemented by a function that returns something (callbacks like <code>forEach</code> rely on this). <code>undefined</code> is a concrete value type: a function declared to return <code>undefined</code> must return it (TS 5.1+ allows no return statement).`),
T('Easy', `What is type inference? When does TypeScript infer types automatically?`,
  `TypeScript guesses the label from what you put in the box, so you don't have to write it.`,
  `TS infers types from initialisers (<code>let n = 5</code> → number), return statements, default parameters, contextual typing (callback parameters from where the function is used), and generic arguments from call arguments. Annotate boundaries (function parameters, exported APIs); let locals be inferred.`),
T('Medium', `What does "strict": true enable in tsconfig?`,
  `It turns on all the strict homework checkers at once.`,
  `A family of flags: <code>strictNullChecks</code> (null/undefined aren't assignable everywhere), <code>noImplicitAny</code>, <code>strictFunctionTypes</code>, <code>strictBindCallApply</code>, <code>strictPropertyInitialization</code>, <code>noImplicitThis</code>, <code>alwaysStrict</code>, <code>useUnknownInCatchVariables</code>. Always enable it on new projects. Extra useful flags outside strict: <code>noUncheckedIndexedAccess</code>, <code>exactOptionalPropertyTypes</code>.`),
T('Medium', `What is the difference between interface and type alias?`,
  `Both describe shapes. Interfaces can be reopened and added to; type aliases can describe more kinds of things.`,
  `<b>interface</b>: object shapes only, can be extended with <code>extends</code> and merged by redeclaring (declaration merging), good error messages and cached checking. <b>type</b>: any type, including unions, tuples, primitives, mapped and conditional types; can't be reopened. Common rule: interfaces for public object contracts, types for unions and type-level logic.`,
  `interface User { id: string }
interface User { name: string }          // merged ✅
type Status = 'idle' | 'loading'           // only type alias can do this
type Pair = [string, number]`),
T('Easy', `What is structural typing (duck typing) in TypeScript?`,
  `If it looks like a duck and quacks like a duck, TypeScript treats it as a duck, whatever its name.`,
  `Compatibility is decided by shape (members and their types), not by declared names or inheritance. Any object with the required properties satisfies an interface without <code>implements</code>. Contrast with nominal typing in Java/C#.`,
  `interface Point { x: number; y: number }
class Coord { constructor(public x: number, public y: number) {} }
const p: Point = new Coord(1, 2) // ✅ no 'implements Point' needed`),
T('Medium', `What is excess property checking and when does it apply?`,
  `When you write a fresh object directly, TypeScript complains about extra spelling-mistake properties.`,
  `Object <b>literals</b> assigned directly to a typed target are checked for unknown properties, catching typos. It doesn't apply when the object comes from a variable (structural typing allows extras). Ways around it, deliberately: assign via a variable, add an index signature, or use a type assertion.`,
  `interface Opts { color?: string }
const o: Opts = { colour: 'red' }     // ❌ excess property 'colour'
const tmp = { colour: 'red' }; const o2: Opts = tmp // ✅ no fresh-literal check`),
T('Medium', `What is the difference between const and readonly in TypeScript?`,
  `const glues the box's lid shut; readonly glues one label on a toy so it can't be changed.`,
  `<code>const</code> is a JS runtime rule for variables: the binding can't be reassigned. <code>readonly</code> is a compile-time modifier for properties (and arrays/tuples): the property can't be reassigned through that type. Neither deep-freezes nested objects.`),
T('Medium', `What are enums and when should you prefer union literal types instead?`,
  `An enum is a named list of choices; a union of strings is a lighter list that disappears after checking.`,
  `Enums create a runtime object (numeric enums also reverse-map and accept any number). String literal unions (<code>'sm' | 'md' | 'lg'</code>) have zero runtime cost, work with <code>isolatedModules</code>/erasable-syntax tooling, and narrow nicely. Prefer unions, or an <code>as const</code> object plus <code>keyof typeof</code> when you need runtime values.`,
  `const Size = { Sm: 'sm', Md: 'md' } as const
type Size = (typeof Size)[keyof typeof Size]   // 'sm' | 'md'`),
T('Medium', `What is declaration merging?`,
  `If you write two notes with the same name, TypeScript staples them into one note.`,
  `Multiple declarations with the same name combine: interfaces merge members; namespaces merge with namespaces, classes, functions and enums. It's how you augment third-party types (<code>Window</code>, Express <code>Request</code>). Type aliases do not merge.`),
T('Medium', `What is as const and what does it do to types?`,
  `as const says "these values never change", so TypeScript remembers the exact values, not just "some string".`,
  `A const assertion makes literals keep their narrowest types and marks objects/arrays deeply <code>readonly</code> (arrays become readonly tuples). Great for config objects, lookup tables and deriving union types from values.`,
  `const roles = ['admin', 'user'] as const    // readonly ['admin', 'user']
type Role = (typeof roles)[number]            // 'admin' | 'user'`),
T('Hard', `What is the satisfies operator (TypeScript 4.9+)?`,
  `satisfies checks that your box matches the rules, but still remembers exactly what you put in it.`,
  `<code>expr satisfies Type</code> validates an expression against a type without changing its inferred type. Annotation (<code>const x: Type</code>) widens to Type and loses specifics; <code>satisfies</code> keeps literal keys and values while still catching mistakes.`,
  `type Colors = Record<'primary' | 'bg', string | [number, number, number]>
const theme = { primary: '#123', bg: [255, 255, 255] } satisfies Colors
theme.primary.toUpperCase()   // ✅ still known to be a string
theme.bg.map(n => n / 255)    // ✅ still known to be a tuple`),
// ---------- Types & type system ----------
T('Easy', `What is a union type and what is an intersection type?`,
  `Union: "this OR that". Intersection: "this AND that, both at once".`,
  `<code>A | B</code>: a value of either type; you can only use members common to both until you narrow. <code>A &amp; B</code>: a value that has all members of both, used to combine object types. Intersections of incompatible primitives become <code>never</code>.`),
T('Medium', `What is a discriminated union and why is it useful?`,
  `Each kind of box has a label saying which kind it is, so TypeScript knows what's inside after reading the label.`,
  `A union of object types sharing a literal "tag" property (<code>kind</code>, <code>type</code>, <code>status</code>). Checking the tag narrows to the exact member. Ideal for state machines, API results, Redux actions; pairs with exhaustive <code>never</code> checks.`,
  `type State =
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: string }
function render(s: State) {
  if (s.status === 'success') return s.data.length   // data is available here
}`),
T('Medium', `What is type widening and how do you prevent it?`,
  `When a box can change later, TypeScript writes a general label ("some word") instead of the exact word.`,
  `Mutable positions widen literals: <code>let x = 'hi'</code> is <code>string</code>, object properties widen too. Prevent with <code>const</code>, <code>as const</code>, explicit literal annotations, <code>satisfies</code>, or <code>const</code> type parameters on generics.`),
T('Medium', `What is keyof and what does T[K] (indexed access) do?`,
  `keyof lists all the label names on a box; T[K] asks "what type is under this label?"`,
  `<code>keyof T</code> is the union of T's keys. <code>T[K]</code> looks up the type of property K. Together they build type-safe accessors and mapped types.`,
  `function get<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key] }
get({ id: 1, name: 'Asha' }, 'name')   // string
// get(user, 'nmae')                   // ❌ compile error`),
T('Medium', `What is the difference between typeof in TypeScript vs JavaScript?`,
  `In JavaScript, typeof tells you the kind of a value while running; in TypeScript it can also copy the label of a value to use as a type.`,
  `JS <code>typeof x</code> is a runtime operator returning a string ("string", "object"…), and TS uses it for narrowing. In a <b>type position</b>, TS <code>typeof x</code> extracts the static type of a variable or function, e.g. <code>ReturnType&lt;typeof fn&gt;</code> or <code>keyof typeof config</code>.`,
  `const config = { port: 3000, host: 'localhost' }
type Config = typeof config       // { port: number; host: string }`),
T('Medium', `What are mapped types? Give a real-world example.`,
  `A machine that goes through every label on a box and changes each one the same way.`,
  `Types that iterate over keys: <code>{ [K in keyof T]: ... }</code>, with modifiers (<code>readonly</code>, <code>?</code>, <code>-?</code>) and key remapping (<code>as</code>). Built-ins like Partial, Readonly, Record are mapped types.`,
  `type FormErrors<T> = { [K in keyof T]?: string }
type Setters<T> = { [K in keyof T as \`set\${Capitalize<string & K>}\`]: (v: T[K]) => void }
// Setters<{ name: string }> → { setName: (v: string) => void }`),
T('Hard', `What are conditional types? Explain T extends U ? X : Y.`,
  `An if/else for types: "if this label fits that shape, use this type, otherwise that one".`,
  `If T is assignable to U the type resolves to X, else Y. They power utilities like Exclude, ReturnType and Awaited, and combine with <code>infer</code>. When T is a naked type parameter and a union, the condition distributes over each member.`,
  `type IsString<T> = T extends string ? 'yes' : 'no'
type A = IsString<'hi'>   // 'yes'
type ToArray<T> = T extends any ? T[] : never
type B = ToArray<string | number>   // string[] | number[] (distributed)`),
T('Hard', `What are template literal types? When are they useful?`,
  `Building new word-labels by gluing word-labels together, like "on" + "Click".`,
  `String literal types built with template syntax, combining unions to produce every combination, with helpers Uppercase, Lowercase, Capitalize, Uncapitalize. Uses: event names, CSS values, route params, typed object paths, getter/setter names.`,
  `type Event = 'click' | 'focus'
type Handler = \`on\${Capitalize<Event>}\`   // 'onClick' | 'onFocus'
type Size = \`\${number}px\`
const w: Size = '12px'   // ✅`),
T('Hard', `What is the infer keyword in TypeScript?`,
  `infer says "whatever type sits in this spot, give it a name so I can use it".`,
  `Inside the <code>extends</code> clause of a conditional type, <code>infer X</code> captures part of a matched type: return types, parameter types, array elements, promise values, string pieces.`,
  `type ElementOf<T> = T extends (infer E)[] ? E : never
type Unwrap<T> = T extends Promise<infer V> ? V : T
type E = ElementOf<string[]>      // string`),
T('Medium', `Explain the built-in utility types: Partial, Required, Readonly, Pick, Omit, Record.`,
  `Ready-made label changers: make everything optional, make everything required, lock everything, keep some labels, remove some labels, or build a map.`,
  `<code>Partial&lt;T&gt;</code> all optional; <code>Required&lt;T&gt;</code> all required; <code>Readonly&lt;T&gt;</code> all readonly; <code>Pick&lt;T, K&gt;</code> keep keys K; <code>Omit&lt;T, K&gt;</code> drop keys K; <code>Record&lt;K, V&gt;</code> object with keys K and values V. All shallow.`,
  `type UserPatch = Partial<Pick<User, 'name' | 'email'>>
type ById = Record<string, User>`),
T('Medium', `What are Exclude, Extract, NonNullable, ReturnType, Parameters, and Awaited?`,
  `More helpers: remove choices, keep choices, drop empty values, read what a function returns or takes, and unwrap a promise.`,
  `<code>Exclude&lt;U, X&gt;</code> removes union members assignable to X; <code>Extract&lt;U, X&gt;</code> keeps them; <code>NonNullable&lt;T&gt;</code> drops null/undefined; <code>ReturnType&lt;F&gt;</code> and <code>Parameters&lt;F&gt;</code> read function signatures; <code>Awaited&lt;T&gt;</code> recursively unwraps promises/thenables.`,
  `type R = Awaited<ReturnType<typeof fetchUser>>   // User, not Promise<User>`),
T('Hard', `What are branded (opaque) types and why use them?`,
  `Two boxes both hold a number, but one is stamped "UserId" and one "OrderId", so you can't mix them up.`,
  `TS is structural, so <code>type UserId = string</code> is interchangeable with any string. A brand adds a phantom property to create a nominal-like type that only a constructor/validator can produce, preventing mix-ups (IDs, currencies, validated emails).`,
  `type UserId = string & { readonly __brand: 'UserId' }
const toUserId = (s: string) => s as UserId
function getUser(id: UserId) {}
getUser(toUserId('u1'))  // ✅
// getUser('u1')          // ❌ plain string rejected`),
T('Hard', `What is object vs {} vs Object in TypeScript?`,
  `object means "a real box, not a plain value"; {} and Object mean "anything that isn't empty-nothing".`,
  `<code>object</code>: any non-primitive. <code>{}</code>: any value except null/undefined (primitives included!). <code>Object</code>: similar to {} (the interface of all objects), avoid it. For "any object" use <code>object</code> or <code>Record&lt;string, unknown&gt;</code>.`),
T('Hard', `What is the difference between Partial<T> and DeepPartial<T>? How do you implement DeepPartial?`,
  `Partial makes the outer labels optional; DeepPartial makes labels optional inside every box inside the box too.`,
  `Partial is shallow. DeepPartial recursively applies optional to nested objects, while leaving functions and arrays sensible.`,
  `type DeepPartial<T> = T extends (...args: any[]) => any
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T`),
T('Hard', `What is the never type used for in exhaustiveness checking?`,
  `If every kind of box is handled, nothing is left over; if something is left, TypeScript shouts.`,
  `After narrowing every member of a union, the remaining type is <code>never</code>. Assigning it to a <code>never</code> variable in the default branch only compiles when all cases are handled, so adding a new member later produces a compile error.`,
  `function area(s: Shape) {
  switch (s.kind) {
    case 'circle': return Math.PI * s.r ** 2
    case 'square': return s.size ** 2
    default: { const _exhaustive: never = s; return _exhaustive }
  }
}`),
// ---------- Functions & generics ----------
T('Medium', `What are function overloads in TypeScript?`,
  `One recipe with several menus: give it this, get that; give it something else, get something else.`,
  `Multiple call signatures followed by one implementation signature (not visible to callers). The return type can depend on argument types. Often a union or generic is simpler; overloads shine when the relation between input and output is irregular.`,
  `function parse(x: string): number
function parse(x: number): string
function parse(x: string | number) { return typeof x === 'string' ? Number(x) : String(x) }`),
T('Medium', `What is the this parameter in TypeScript functions?`,
  `A fake first ingredient that tells TypeScript who "this" will be.`,
  `A first parameter named <code>this</code> declares the expected <code>this</code> type; it's erased from the emitted JS and callers don't pass it. With <code>noImplicitThis</code>, it prevents calling methods with the wrong context.`,
  `function onClick(this: HTMLButtonElement, e: MouseEvent) { this.disabled = true }`),
T('Easy', `What are generics in TypeScript? Why use them?`,
  `A recipe that works with any ingredient and remembers which one you used.`,
  `Type parameters let functions, classes and types work with many types while preserving the relationship between input and output, instead of losing information with <code>any</code>.`,
  `function first<T>(arr: T[]): T | undefined { return arr[0] }
const n = first([1, 2, 3])     // number | undefined
const s = first(['a'])         // string | undefined`),
T('Medium', `What are generic constraints? Show an example.`,
  `"Any ingredient is fine, as long as it has a length."`,
  `<code>&lt;T extends Something&gt;</code> limits what T can be so you can safely use its members.`,
  `function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b
}
longest('abc', 'de')      // ✅ strings have length
longest([1, 2], [3])      // ✅ arrays too
// longest(1, 2)          // ❌ numbers have no length`),
T('Medium', `What is the difference between a generic function and a function accepting any?`,
  `A generic remembers what you gave it; any forgets.`,
  `With <code>any</code>, the output is <code>any</code> and type safety is lost downstream. A generic captures the caller's type and returns a precisely related type, so errors are still caught.`),
T('Medium', `How do you type a generic class?`,
  `A box factory that makes boxes for one kind of toy, chosen when you build it.`,
  `Put type parameters on the class; use them in fields and methods.`,
  `class Stack<T> {
  private items: T[] = []
  push(item: T) { this.items.push(item) }
  pop(): T | undefined { return this.items.pop() }
}
const s = new Stack<number>(); s.push(1)   // s.push('x') ❌`),
T('Hard', `What is ReturnType<T> and Parameters<T>? How are they implemented?`,
  `Tools that read a recipe and tell you what it gives back and what ingredients it needs.`,
  `Both use conditional types with <code>infer</code> against a function type.`,
  `type MyReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : never
type MyParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never`),
T('Medium', `What are default type parameters?`,
  `If you don't say which ingredient, the recipe uses a normal one.`,
  `Like default function parameters for generics: <code>&lt;T = unknown&gt;</code>. Used when T can't be inferred and callers don't specify it.`,
  `interface ApiResponse<T = unknown> { data: T; status: number }
const a: ApiResponse = { data: {}, status: 200 }          // T = unknown
const b: ApiResponse<User> = { data: user, status: 200 }  // T = User`),
T('Hard', `How do you write a generic arrow function in a .tsx file?`,
  `In TSX files, <T> looks like a tag, so you add a tiny hint so TypeScript knows it's a type.`,
  `In <code>.tsx</code>, <code>&lt;T&gt;(x: T) =&gt; x</code> is parsed as JSX. Use <code>&lt;T,&gt;</code> (trailing comma) or a constraint <code>&lt;T extends unknown&gt;</code>, or use a function declaration.`,
  `const identity = <T,>(value: T) => value`),
T('Hard', `What are variadic tuple types and what problem do they solve?`,
  `Lists of ingredients that can be stretched or joined while still remembering each ingredient's type.`,
  `Spreads of generic tuples inside tuple types (<code>[...T, ...U]</code>) let you type functions that prepend, append or concatenate argument lists, such as <code>concat</code>, <code>curry</code>, <code>bind</code> and middleware, without dozens of overloads.`,
  `function concat<T extends unknown[], U extends unknown[]>(a: [...T], b: [...U]): [...T, ...U] {
  return [...a, ...b]
}
const r = concat([1, 'a'], [true])   // [number, string, boolean]`),
T('Medium', `What is a type predicate (val is T)?`,
  `A checking function that tells TypeScript "if I say yes, it really is that kind".`,
  `A function returning <code>param is Type</code>; when it returns true, TS narrows the argument in the caller. Useful for filtering and complex checks; the predicate must be correct, since TS trusts it.`,
  `function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x
}
const users = items.filter(isUser)   // User[]`),
T('Hard', `What are assertion functions (asserts val is T)?`,
  `A guard that stops everything if the check fails, and otherwise lets TypeScript trust the type afterwards.`,
  `Functions with return type <code>asserts x is T</code> (or <code>asserts x</code>) throw on failure; after the call TS narrows x for the rest of the scope. Must be declared with an explicit type annotation when used as a variable.`,
  `function assertDefined<T>(v: T, msg = 'missing'): asserts v is NonNullable<T> {
  if (v == null) throw new Error(msg)
}
assertDefined(user); user.name   // narrowed to non-null`),
T('Hard', `What is strictFunctionTypes and what does contravariance mean?`,
  `A helper that only knows how to feed puppies can't be used where every animal must be fed.`,
  `With <code>strictFunctionTypes</code>, function-typed <b>properties</b> check parameters contravariantly: a function accepting a wider type can stand in for one accepting a narrower type, but not the reverse. Method-shorthand signatures stay bivariant for compatibility (a known unsoundness).`),
T('Medium', `How does TypeScript type Promise.all()?`,
  `It waits for all the helpers and remembers what each one brings back, in order.`,
  `Promise.all is typed with a mapped tuple: given a tuple of values/promises it returns <code>Promise&lt;{ -readonly [K in keyof T]: Awaited&lt;T[K]&gt; }&gt;</code>, so destructured results keep their individual types.`,
  `const [user, orders] = await Promise.all([fetchUser(), fetchOrders()])
// user: User, orders: Order[]`),
T('Hard', `What is polymorphic this and when is it useful?`,
  `A method that says "I give back whatever kind of box you called me on", even for child boxes.`,
  `Using <code>this</code> as a return type means "the type of the current instance", so chained methods on subclasses keep the subclass type. Used in fluent builders.`,
  `class Builder { set(k: string, v: unknown): this { return this } }
class UserBuilder extends Builder { admin(): this { return this } }
new UserBuilder().set('a', 1).admin()   // ✅ still UserBuilder`),
    ],
  });
})();
