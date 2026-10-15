(function () {
  const T = (lv, q, k, a, c) => ({ lv, q, k, a, c });
  HUB.sections.find(s => s.id === 'tsdeep').items.push(
// ---------- Patterns & real-world ----------
T('Hard', `What are branded types and why use them? (real-world use)`,
  `Stamp numbers with what they mean, so a price can't be passed where a quantity is expected.`,
  `In practice brands protect domain values: <code>UserId</code> vs <code>OrderId</code>, <code>Cents</code> vs <code>Dollars</code>, <code>ValidatedEmail</code>, <code>SanitizedHtml</code>. Create them only in validators/parsers (zod <code>.brand()</code> does this), so the type itself proves the check happened.`,
  `const Email = z.string().email().brand<'Email'>()
type Email = z.infer<typeof Email>
function sendWelcome(to: Email) {}
sendWelcome(Email.parse(input))   // only validated strings get in`),
T('Hard', `How do you type the Builder pattern in TypeScript?`,
  `Build a toy step by step, and TypeScript remembers which steps you've done.`,
  `Return <code>this</code> for simple fluent APIs, or track state in a generic parameter so <code>build()</code> is only available once required parts are set.`,
  `class QueryBuilder<T extends object = {}> {
  constructor(private parts: T = {} as T) {}
  from<N extends string>(table: N) { return new QueryBuilder({ ...this.parts, table }) }
  build(this: QueryBuilder<{ table: string }>) { return 'SELECT * FROM ' + this.parts.table }
}
new QueryBuilder().from('users').build()   // ✅
// new QueryBuilder().build()              // ❌ table not set`),
T('Hard', `How do you type a type-safe event emitter?`,
  `A walkie-talkie where each channel only carries the right kind of message.`,
  `Describe events as a map from name to payload type and make <code>on</code>/<code>emit</code> generic over the keys.`,
  `type Events = { login: { userId: string }; logout: undefined }
class Emitter<E extends Record<string, unknown>> {
  private handlers: { [K in keyof E]?: ((p: E[K]) => void)[] } = {}
  on<K extends keyof E>(event: K, fn: (p: E[K]) => void) { (this.handlers[event] ??= []).push(fn) }
  emit<K extends keyof E>(event: K, payload: E[K]) { this.handlers[event]?.forEach(fn => fn(payload)) }
}
const bus = new Emitter<Events>()
bus.on('login', p => p.userId)   // typed payload`),
T('Hard', `What is covariance and contravariance in TypeScript?`,
  `A box of puppies can be used where a box of animals is wanted (output side), but a puppy-only feeder can't feed every animal (input side).`,
  `<b>Covariant</b>: preserves the subtype direction (return types, readonly properties, arrays). <b>Contravariant</b>: reverses it (function parameters under strictFunctionTypes). <b>Invariant</b>: must match exactly (mutable read-write positions, in theory). TS 4.7 lets you annotate generic variance with <code>in</code>/<code>out</code>.`,
  `interface Producer<out T> { get(): T }
interface Consumer<in T> { accept(v: T): void }`),
T('Medium', `How do you validate data at runtime and get TypeScript types? (Zod)`,
  `TypeScript can't check letters arriving from the outside world, so a checker reads them and also writes the labels.`,
  `Types are erased, so API responses, forms, env vars and localStorage need runtime validation. Schema libraries (Zod, Valibot, ArkType) validate and infer the static type from the same schema, keeping one source of truth.`,
  `const User = z.object({ id: z.string(), email: z.string().email(), age: z.number().int().optional() })
type User = z.infer<typeof User>
const user = User.parse(await res.json())   // throws on bad data; safeParse returns a result`),
T('Hard', `What are recursive types and what are their limitations?`,
  `A label that refers to itself, like a box that can contain more boxes of the same kind.`,
  `Types can reference themselves (trees, JSON, nested menus). Limits: depth limits on instantiation (~50 for some recursions, 1000 for tail-recursive conditional types), "Type instantiation is excessively deep" errors and slow checking on large inputs.`,
  `type Json = string | number | boolean | null | Json[] | { [k: string]: Json }
type TreeNode<T> = { value: T; children: TreeNode<T>[] }`),
T('Medium', `What are some TypeScript performance optimization tips?`,
  `Ways to make the homework checker faster.`,
  `<code>skipLibCheck</code>; <code>incremental</code>; project references; prefer <code>interface extends</code> over big intersections; annotate exported function return types; avoid huge unions and deep recursive conditional types; use <code>import type</code>; limit <code>include</code> globs; profile with <code>--extendedDiagnostics</code>/<code>--generateTrace</code>; check with <code>tsc --noEmit</code> separately from bundling.`),
T('Hard', `What is the infer keyword in conditional types? (patterns)`,
  `Point at a spot in a shape and say "call whatever's here X".`,
  `Common patterns: unwrap arrays/promises, read function parameters or return types, extract the first/last tuple element, split strings, read props of components.`,
  `type First<T extends unknown[]> = T extends [infer F, ...unknown[]] ? F : never
type PropsOf<C> = C extends React.ComponentType<infer P> ? P : never
type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never`),
T('Hard', `What is mapped type filtering with never?`,
  `Go through every label and throw away the ones you don't want.`,
  `Remapping a key to <code>never</code> with <code>as</code> removes it, letting you filter keys by their value types.`,
  `type PickByValue<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] }
type StringProps = PickByValue<{ id: number; name: string; email: string }, string>
// { name: string; email: string }`),
T('Hard', `What is keyof with the as clause in mapped types?`,
  `While copying labels, you can also rename them.`,
  `The <code>as</code> clause (TS 4.1) transforms each key: add prefixes, capitalise, or filter (map to never).`,
  `type Getters<T> = { [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K] }
// Getters<{ age: number }> → { getAge: () => number }`),
T('Hard', `How do you build a DeepPartial<T> type? (handling arrays)`,
  `Make everything optional, all the way down, even inside lists.`,
  `Handle arrays separately so elements become DeepPartial while the array stays an array; leave primitives, functions and Dates as-is.`,
  `type DeepPartial<T> =
  T extends (...a: any[]) => any ? T :
  T extends Date ? T :
  T extends readonly (infer E)[] ? readonly DeepPartial<E>[] :
  T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T`),
T('Hard', `What is the NoInfer<T> utility type?`,
  `"Don't guess the type from this spot; guess it from the other ones."`,
  `TS 5.4's <code>NoInfer&lt;T&gt;</code> blocks a parameter from being used as an inference site, so T is inferred from the intended arguments only.`,
  `function createFSM<S extends string>(states: S[], initial: NoInfer<S>) {}
createFSM(['idle', 'loading'], 'idle')      // ✅
createFSM(['idle', 'loading'], 'oops')      // ❌ without NoInfer, 'oops' would widen S`),
T('Easy', `What is a discriminated union and what are its benefits?`,
  `Boxes with name tags: read the tag and you know what's inside.`,
  `Benefits: impossible states become unrepresentable, automatic narrowing, exhaustive checking with never, self-documenting state machines, and clean reducers/API result handling.`),
T('Medium', `What is exhaustive checking with never?`,
  `A safety net that complains if you forgot to handle one kind of box.`,
  `In the default branch assign the narrowed value to <code>never</code> (or call <code>assertNever(x)</code>). Adding a new union member then breaks compilation until it's handled.`,
  `function assertNever(x: never): never { throw new Error('Unhandled: ' + JSON.stringify(x)) }`),
T('Hard', `What are template literal types and their practical uses?`,
  `Glue word-labels together to make exact allowed words.`,
  `Typed event names (<code>\`\${Entity}:\${Action}\`</code>), CSS units, i18n keys, route params extraction, typed dot-paths for nested objects, getter/setter names, and validating string formats like <code>\`#\${string}\`</code>.`),
// ---------- Advanced type manipulation ----------
T('Hard', `What is conditional type distribution?`,
  `If you ask an if/else question about a mixed bag, TypeScript asks it about each item separately.`,
  `When the checked type is a naked type parameter and receives a union, the conditional applies to each member and the results are unioned. Wrap in a tuple <code>[T] extends [U]</code> to stop distribution.`,
  `type Dist<T> = T extends string ? 'S' : 'N'
type A = Dist<string | number>         // 'S' | 'N'
type NoDist<T> = [T] extends [string] ? 'S' : 'N'
type B = NoDist<string | number>       // 'N'`),
T('Hard', `How do you parse a string type with template literals and infer?`,
  `Read a word-label and cut it into pieces by pattern.`,
  `Use template literal patterns with <code>infer</code>, often recursively, to extract parts such as route params.`,
  `type Params<S extends string> =
  S extends \`\${string}:\${infer P}/\${infer Rest}\` ? P | Params<\`/\${Rest}\`> :
  S extends \`\${string}:\${infer P}\` ? P : never
type R = Params<'/users/:userId/posts/:postId'>   // 'userId' | 'postId'`),
T('Hard', `What is infer with covariant and contravariant positions?`,
  `If the same name is guessed from several output spots you get "either"; from several input spots you get "both".`,
  `When one <code>infer X</code> appears in multiple <b>covariant</b> positions, candidates combine into a union; in multiple <b>contravariant</b> (parameter) positions they combine into an intersection. This is the trick behind UnionToIntersection.`,
  `type UnionToIntersection<U> =
  (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never
type I = UnionToIntersection<{ a: 1 } | { b: 2 }>   // { a: 1 } & { b: 2 }`),
T('Hard', `What is Awaited<T> implemented as a conditional type?`,
  `Keep opening tickets inside tickets until there's no ticket left.`,
  `Awaited recursively unwraps any thenable (not just Promise): if T has a <code>then</code> whose callback receives V, it recurses on V; null/undefined pass through; non-thenables are returned as-is.`,
  `type MyAwaited<T> =
  T extends null | undefined ? T :
  T extends object & { then(onfulfilled: infer F, ...args: infer _): any }
    ? F extends (value: infer V, ...args: infer _) => any ? MyAwaited<V> : never
    : T`),
T('Medium', `What are all the built-in TypeScript utility types?`,
  `The full toolbox of ready-made label changers.`,
  `Object: <code>Partial</code>, <code>Required</code>, <code>Readonly</code>, <code>Pick</code>, <code>Omit</code>, <code>Record</code>. Unions: <code>Exclude</code>, <code>Extract</code>, <code>NonNullable</code>. Functions/classes: <code>Parameters</code>, <code>ReturnType</code>, <code>ConstructorParameters</code>, <code>InstanceType</code>, <code>ThisParameterType</code>, <code>OmitThisParameter</code>, <code>ThisType</code>. Promises: <code>Awaited</code>. Inference: <code>NoInfer</code>. Strings: <code>Uppercase</code>, <code>Lowercase</code>, <code>Capitalize</code>, <code>Uncapitalize</code>.`),
T('Hard', `What is a recursive conditional type and when do they fail?`,
  `A rule that keeps applying itself, which can get stuck if the input is too big.`,
  `Conditional types can call themselves (DeepReadonly, Split, Join, path types). They fail with "Type instantiation is excessively deep and possibly infinite" on deep or very long inputs. Tail-recursive forms (recursion as the whole branch result, often with an accumulator) get a higher limit (1000).`),
T('Hard', `How do you implement Flatten<T> — flatten nested arrays by one level?`,
  `Open each inner box once and pour its toys onto the main shelf.`,
  `Map over a tuple, spreading inner arrays; for plain arrays, take the element type of the inner array.`,
  `type Flatten<T extends readonly unknown[]> =
  T extends [infer H, ...infer R]
    ? H extends readonly unknown[] ? [...H, ...Flatten<R>] : [H, ...Flatten<R>]
    : []
type F = Flatten<[1, [2, 3], [4]]>   // [1, 2, 3, 4]
type FlatArr<T> = T extends (infer E)[] ? (E extends (infer I)[] ? I : E)[] : never`),
T('Hard', `What is Object.entries() typing in TypeScript and why is it imprecise?`,
  `TypeScript can't promise a box has only the labels it knows about, so it gives you plain strings.`,
  `<code>Object.keys/entries</code> return <code>string</code> keys because, with structural typing, an object may have extra properties at runtime. If you know the object is exact, cast deliberately or use a helper.`,
  `const typedEntries = <T extends object>(o: T) => Object.entries(o) as [keyof T, T[keyof T]][]`),
T('Medium', `What is the difference between unknown and any in a type position?`,
  `unknown is a locked box you must check; any is an open box nobody checks.`,
  `In generics and conditionals both accept everything, but <code>unknown</code> forces narrowing before use and doesn't leak, while <code>any</code> disables checks and is assignable to everything. In conditional types <code>any</code> distributes to both branches. Prefer <code>unknown</code> for "accept anything" parameters.`),
T('Medium', `What is Extract and how does it differ from Exclude?`,
  `Extract keeps the matching choices; Exclude throws them away.`,
  `<code>Extract&lt;T, U&gt;</code> = members of T assignable to U; <code>Exclude&lt;T, U&gt;</code> = members not assignable to U. Both distribute over unions.`,
  `type Ev = { type: 'click'; x: number } | { type: 'key'; key: string }
type Click = Extract<Ev, { type: 'click' }>
type NoClick = Exclude<Ev, { type: 'click' }>`),
T('Hard', `What is a Prettify<T> type and why is it useful?`,
  `It tidies a messy, glued-together label into one neat label you can read.`,
  `Re-mapping a type flattens intersections and aliases in editor hovers so you see the final shape instead of <code>A &amp; Omit&lt;B, 'x'&gt;</code>.`,
  `type Prettify<T> = { [K in keyof T]: T[K] } & {}
type U = Prettify<{ a: string } & { b: number } & { c: boolean }>   // { a: string; b: number; c: boolean }`),
T('Hard', `What is a type-safe get function for nested object paths?`,
  `Ask for "user.address.city" and TypeScript checks the path is real and tells you what's there.`,
  `Generate all dot paths with recursive template literal types, then resolve the value type for a path.`,
  `type Path<T> = T extends object
  ? { [K in keyof T & string]: K | \`\${K}.\${Path<T[K]>}\` }[keyof T & string] : never
type PathValue<T, P> = P extends \`\${infer K}.\${infer R}\`
  ? K extends keyof T ? PathValue<T[K], R> : never
  : P extends keyof T ? T[P] : never
declare function get<T, P extends Path<T>>(obj: T, path: P): PathValue<T, P>`),
T('Hard', `What is const type parameter (TypeScript 5.0)?`,
  `"Treat what I pass in as exact values", without the caller writing as const.`,
  `<code>&lt;const T&gt;</code> makes inference behave as if the argument had <code>as const</code>, keeping literal and tuple types.`,
  `function routes<const T extends readonly string[]>(r: T) { return r }
const r = routes(['/home', '/about'])   // readonly ['/home', '/about']`),
T('Easy', `What is Omit<T, K> and how is it different from Pick?`,
  `Pick keeps the labels you name; Omit keeps everything except the labels you name.`,
  `<code>Pick&lt;T, K&gt;</code> constructs a type with only keys K (K must be keys of T). <code>Omit&lt;T, K&gt;</code> removes keys K (K can be any string, so typos aren't caught; a stricter custom Omit can fix that).`),
T('Medium', `What is Record<K, V> and when should you use it vs an index signature?`,
  `Record makes a map with a known list of labels or any labels; an index signature says "any label of this kind".`,
  `<code>Record&lt;'a' | 'b', V&gt;</code> requires exactly those keys, great for exhaustive lookups. <code>Record&lt;string, V&gt;</code> equals <code>{ [key: string]: V }</code>. Index signatures can coexist with known properties. For dynamic keys consider <code>Map</code> and <code>noUncheckedIndexedAccess</code>.`,
  `const labels: Record<Status, string> = { idle: 'Idle', loading: 'Loading…', error: 'Failed' }   // must cover every Status`),
// ---------- Hard & tricky ----------
T('Hard', `What is unique symbol and how does it differ from symbol?`,
  `A symbol is a secret name tag; a unique symbol is one specific tag TypeScript can tell apart from all others.`,
  `<code>symbol</code> is the general type. <code>unique symbol</code> is a subtype tied to one declaration (<code>const</code> or <code>static readonly</code>), so it can be used as a typed property key and in brands.`,
  `const ID: unique symbol = Symbol('id')
interface Entity { [ID]: string }`),
T('Hard', `Can a namespace merge with a class? How?`,
  `Yes: a robot factory can also have a drawer of related helpers under the same name.`,
  `Declaring a <code>namespace</code> with the same name after a class merges them, adding static-like members and nested types (pattern used to attach related types to a class or function).`,
  `class Album { label!: Album.Label }
namespace Album { export interface Label { name: string } }`),
T('Hard', `What are declaration emit gotchas when shipping TypeScript libraries?`,
  `When you print instruction cards for others, some labels can't be printed if they're hidden or too big.`,
  `Errors when exported values reference non-exported types; huge inferred types bloating <code>.d.ts</code> (annotate exports explicitly); <code>isolatedDeclarations</code> (TS 5.5) requires explicit types to allow fast parallel emit; dual ESM/CJS packages need correct <code>exports</code> conditions with matching types; test with <code>@arethetypeswrong/cli</code>.`),
T('Hard', `What is the Split<T, D> type and how do you implement it?`,
  `Cut a word-label at every comma, at the type level.`,
  `Recursive template literal inference on the delimiter.`,
  `type Split<S extends string, D extends string> =
  S extends \`\${infer Head}\${D}\${infer Tail}\` ? [Head, ...Split<Tail, D>] : [S]
type Parts = Split<'a,b,c', ','>   // ['a', 'b', 'c']`),
T('Hard', `What is TypeScript's type instantiation limit and how do you hit it?`,
  `The checker stops if a label keeps unfolding too many times.`,
  `Deep recursive generics/conditionals, huge unions crossed with each other (cartesian template literals), or recursive path types on big objects trigger "Type instantiation is excessively deep and possibly infinite" (error 2589) or the 100,000-member union limit. Fix with tail recursion, depth counters, simpler types, or explicit annotations.`),
T('Hard', `How does TypeScript model function overloads for built-in functions like fetch?`,
  `The built-in instruction cards list several menus for one recipe.`,
  `<code>lib.dom.d.ts</code> declares overloaded signatures and union parameters (<code>fetch(input: RequestInfo | URL, init?: RequestInit): Promise&lt;Response&gt;</code>), and methods like <code>document.createElement</code> use a generic keyed on a tag-name map (<code>HTMLElementTagNameMap</code>) so <code>createElement('input')</code> returns HTMLInputElement.`),
T('Hard', `What is a Fluent API with type tracking in TypeScript?`,
  `Each step you chain changes what the next step is allowed to be.`,
  `Each method returns a new generic instance whose type parameter accumulates information (selected fields, set options), giving precise autocomplete and errors (query builders like Kysely and Drizzle use this).`,
  `class Select<Row, Picked extends keyof Row = never> {
  pick<K extends keyof Row>(...k: K[]): Select<Row, Picked | K> { return this as any }
  run(): Pick<Row, Picked>[] { return [] }
}
new Select<User>().pick('id', 'name').run()   // { id; name }[]`),
T('Hard', `How does TypeScript handle circular references in types?`,
  `A label can mention itself, as long as it's inside a box and not looping forever right away.`,
  `Recursive references are allowed inside object types, arrays, tuples and (since 3.7/4.1) in many alias and conditional positions. Immediately self-referential aliases (<code>type A = A</code>) error. Circular imports of types are fine with <code>import type</code>.`),
T('Hard', `What are some real TypeScript gotchas and their explanations?`,
  `Places where TypeScript trusts you a bit too much.`,
  `Method-shorthand parameters are bivariant; arrays are covariant (assigning Dog[] to Animal[] then pushing a Cat compiles); numeric enums accept any number; excess property checks only on fresh literals; <code>Object.keys</code> returns string[]; index access isn't checked without noUncheckedIndexedAccess; type assertions and <code>!</code> aren't checked; <code>let</code> widens literals; narrowing doesn't survive into callbacks for mutable variables.`),
T('Hard', `What is satisfies and when does it outperform both annotation and inference?`,
  `When you want the checker to catch mistakes and still remember every exact detail.`,
  `Plain inference gives precise types but no validation; annotation validates but widens. <code>satisfies</code> gives both: catch typos/missing keys in config, route tables, theme tokens, i18n dictionaries, while keeping literal keys for <code>keyof typeof</code>.`),
T('Hard', `How do you type a generic middleware pipeline (like Express middleware)?`,
  `Each station on the conveyor belt adds something, and the next station knows what was added.`,
  `Let each middleware transform a context type and compose them so the final handler sees the accumulated context.`,
  `type Mw<In, Out> = (ctx: In) => Out
function pipe<A, B, C>(m1: Mw<A, B>, m2: Mw<B, C>): Mw<A, C> { return ctx => m2(m1(ctx)) }
const withUser = (c: { req: Request }) => ({ ...c, user: { id: '1' } })
const withDb = (c: { req: Request; user: { id: string } }) => ({ ...c, db: {} })
const handler = pipe(withUser, withDb)   // ctx gains user, then db`),
T('Medium', `What is structural typing and why can it be "unsound"?`,
  `TypeScript judges boxes by their shape, so sometimes a look-alike sneaks through.`,
  `Sound means "if it compiles, no type errors at runtime". TS deliberately trades some soundness for usability: covariant arrays, bivariant method parameters, <code>any</code>, assertions, unchecked index access, optional-property assignment. Know these so you can tighten config and code where it matters.`),
T('Hard', `What are some advanced infer with extends constraint patterns?`,
  `Guess a piece of a shape, and also insist the piece is a certain kind.`,
  `TS 4.7+ allows <code>infer X extends C</code> to constrain the inferred type inline, e.g. parse a numeric string into a number literal.`,
  `type ToNumber<S> = S extends \`\${infer N extends number}\` ? N : never
type N = ToNumber<'42'>   // 42
type FirstString<T> = T extends [infer S extends string, ...unknown[]] ? S : never`),
T('Hard', `What is the TypeScript using keyword (Explicit Resource Management)?`,
  `"When I'm done with this, automatically put it away", even if something goes wrong.`,
  `TS 5.2 supports <code>using</code> / <code>await using</code>: when the block exits, the resource's <code>[Symbol.dispose]()</code> (or <code>[Symbol.asyncDispose]()</code>) is called, like try/finally for files, locks, connections and subscriptions.`,
  `function openFile(path: string) {
  const handle = fs.openSync(path, 'r')
  return { handle, [Symbol.dispose]() { fs.closeSync(handle) } }
}
{ using f = openFile('a.txt') /* ... */ }   // closed automatically here`),
T('Hard', `What makes TypeScript's type system Turing-complete?`,
  `The labels themselves can do maths and loops, like a tiny computer.`,
  `Recursive conditional types, inference and tuple/template manipulation can encode arbitrary computation (people have written arithmetic, parsers and games in types). It means type checking can, in principle, not terminate, which is why the compiler has depth and instantiation limits.`),
  );
})();
