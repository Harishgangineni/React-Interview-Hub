/* Days 9–31 of the 30-day LinkedIn series the user pasted. Only topics not already on the site; answers written for this hub, with corrections where the posts were inaccurate. */
(function () {
  const sec = id => HUB.sections.find(s => s.id === id).items;

  HUB.add({
    id: 'git', title: 'Git and version control', short: 'Git',
    blurb: 'The Git questions frontend interviews ask: everyday commands, branching and merging, conflicts, undoing commits safely, .gitignore, and team workflows.',
    items: [
{ lv: 'Easy', q: `What is the difference between Git and GitHub?`,
  k: `Git is the notebook that remembers every version; GitHub is an online library where teams keep and share those notebooks.`,
  a: `<b>Git</b> is a distributed version control system that runs locally: commits, branches, history, merging. <b>GitHub</b> (like GitLab, Bitbucket, Azure Repos) is a hosting service for Git repositories that adds collaboration: pull requests and code review, issues, permissions, CI/CD (GitHub Actions), wikis. You can use Git without GitHub.` },
{ lv: 'Easy', q: `What are the basic Git commands to start a repository and commit changes?`,
  k: `Start a notebook, choose which pages to save, then save them with a note.`,
  a: `<code>git init</code> (new repo) or <code>git clone &lt;url&gt;</code> (copy existing); <code>git status</code> (what changed); <code>git add &lt;file&gt;</code> / <code>git add .</code> (stage); <code>git commit -m "message"</code> (save a snapshot); <code>git log --oneline</code> (history); <code>git diff</code> (see changes); <code>git switch -c feature/x</code> (new branch); <code>git pull</code> / <code>git push</code> (sync with remote); <code>git stash</code> (put work aside temporarily).`,
  c: `git init
git add .
git commit -m "feat: add login form validation"
git remote add origin https://github.com/you/app.git
git push -u origin main` },
{ lv: 'Easy', q: `How do you merge one branch into another, and what is the difference between merge and rebase?`,
  k: `Merge ties two lines of work together with a knot; rebase moves your work so it looks like it started later, in one straight line.`,
  a: `Switch to the target branch and merge the source: <code>git switch main</code> then <code>git merge feature/login</code>. In teams this usually happens through a pull request. <b>Merge</b> keeps history as it happened and adds a merge commit (safe for shared branches). <b>Rebase</b> replays your commits on top of the latest base for a linear history; never rebase commits others already pulled (it rewrites history). Common practice: rebase your own feature branch on main to update it, then merge via PR (often squash-merge).` },
{ lv: 'Medium', q: `How do you resolve a merge conflict?`,
  k: `Two people changed the same line; you read both versions and decide what the final line should say.`,
  a: `Git stops and marks conflicting files. Open each file, find the markers (<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>), decide the correct combined code (talk to the other author if unsure), remove the markers, run the app/tests, then <code>git add</code> the files and <code>git commit</code> (or <code>git rebase --continue</code>). <code>git merge --abort</code> cancels. Reduce conflicts with small PRs, pulling/rebasing often, and agreed formatting (Prettier) so whitespace doesn't conflict.`,
  c: `<<<<<<< HEAD
const timeout = 5000
=======
const timeout = 8000
>>>>>>> feature/slow-network
// → decide, e.g. const timeout = 8000, remove markers, then:
git add src/api.js && git commit` },
{ lv: 'Medium', q: `How do you undo the last commit but keep the changes? And how do you undo a commit that is already pushed?`,
  k: `Un-save the last page but keep what you wrote; if others already have the page, add a new page that cancels it instead.`,
  a: `<b>Not pushed yet:</b> <code>git reset --soft HEAD~1</code> undoes the commit and keeps changes <b>staged</b>; <code>git reset HEAD~1</code> (mixed, the default) keeps them <b>unstaged</b> in your working directory. <code>git reset --hard HEAD~1</code> <b>deletes</b> the changes, so don't use it if you want to keep them. To fix only the message or add a forgotten file: <code>git commit --amend</code>. <b>Already pushed/shared:</b> use <code>git revert &lt;commit&gt;</code>, which creates a new commit that undoes it without rewriting history; avoid <code>reset</code> + force-push on shared branches. Lost something? <code>git reflog</code> shows where HEAD was.`,
  t: `Some posts suggest running "git reset --hard" or stash after the reset to "keep" changes. That's wrong: --hard discards them. Use --soft (staged) or the default mixed reset (unstaged).` },
{ lv: 'Easy', q: `What is a .gitignore file used for?`,
  k: `A list of things the notebook should never save, like scraps and secrets.`,
  a: `It lists files and patterns Git should not track: <code>node_modules/</code>, build output (<code>dist/</code>, <code>build/</code>), logs, OS/editor files (<code>.DS_Store</code>, <code>.vscode/</code>), local env files (<code>.env.local</code>), coverage reports. It doesn't affect files already committed (remove them with <code>git rm --cached</code>). If a secret was ever committed, rotate it: removing it later doesn't remove it from history.` },
{ lv: 'Medium', q: `What branching strategies have you used, and how do Git and CI/CD fit together?`,
  k: `Everyone works on their own copy, checks it with robots, then joins it to the main copy.`,
  a: `<b>Feature branch + pull requests</b> (most common): short-lived branches from main, PR with review and CI checks (lint, tests, build), merge, deploy. <b>Trunk-based</b>: very short branches, frequent merges, feature flags for unfinished work. <b>GitFlow</b>: develop/release/hotfix branches for scheduled releases. Good habits: small focused commits with clear messages (e.g. Conventional Commits), branch protection on main, required reviews, never commit secrets, tag releases. From your resume: you've used <b>Azure DevOps</b> repos and pipelines, so describe your team's actual flow (branch naming, PR rules, which environments the pipeline deploys to).` },
    ],
  });

  sec('javascript').push(
{ lv: 'Easy', q: `How do you create objects and access their properties? Dot vs bracket notation?`,
  k: `Dot is for labels you know when writing code; brackets are for labels that come from a variable or have odd characters.`,
  a: `Create with object literals (most common), constructor functions/classes with <code>new</code>, <code>Object.create(proto)</code>, factory functions, <code>Object.fromEntries</code>. <b>Dot notation</b> (<code>user.name</code>) for fixed, valid identifiers. <b>Bracket notation</b> (<code>user[key]</code>, <code>user['first-name']</code>) for dynamic keys, keys with spaces/hyphens, numbers, or symbols. Add/modify by assignment; delete with <code>delete obj.key</code> (in React state, create a new object instead). Computed keys in literals: <code>{ [field]: value }</code>.`,
  c: `const field = 'email'
const user = { name: 'Asha', [field]: 'asha@example.com', 'first-name': 'Asha' }
user.name; user[field]; user['first-name']
const updated = { ...user, name: 'Asha R' }   // immutable update` },
{ lv: 'Medium', q: `How do you loop through an object's properties and check whether a property exists?`,
  k: `Ask for the list of labels, values or label-value pairs; and check if a label is the object's own or borrowed from its parent.`,
  a: `<b>Loop:</b> <code>Object.keys</code>, <code>Object.values</code>, <code>Object.entries</code> (own enumerable string keys, best default; pair with for...of or array methods). <code>for...in</code> also visits inherited enumerable keys, so guard with <code>Object.hasOwn</code>. <b>Check existence:</b> <code>Object.hasOwn(obj, 'k')</code> (modern, own properties only; safer than <code>obj.hasOwnProperty('k')</code>, which fails on objects without a prototype or that override it); <code>'k' in obj</code> (includes inherited); <code>obj.k !== undefined</code> is unreliable when the value is legitimately undefined; optional chaining <code>obj?.a?.b</code> for safe reads.`,
  c: `const prices = { pen: 20, book: 150 }
for (const [item, price] of Object.entries(prices)) console.log(item, price)
Object.hasOwn(prices, 'pen')   // true
'toString' in prices            // true (inherited)
Object.hasOwn(prices, 'toString') // false` },
{ lv: 'Medium', q: `What are getters and setters, and how do you achieve encapsulation in JavaScript objects?`,
  k: `A getter is a label that works out its value when you read it; a setter checks a value before saving it; encapsulation hides the inside of the box.`,
  a: `<b>Getters/setters</b> (<code>get</code>/<code>set</code> in literals and classes, or <code>Object.defineProperty</code>) run code on read/write: computed values, validation, logging. <b>Encapsulation</b> hides internal state and exposes a controlled API: closures (module/factory pattern), <code>#private</code> class fields (truly private at runtime), symbols or WeakMaps for semi-private data. In React the same idea appears as hooks and modules exposing a small API.`,
  c: `class Account {
  #balance = 0
  get balance() { return this.#balance }
  set deposit(amount) { if (amount <= 0) throw new Error('Invalid amount'); this.#balance += amount }
}
const acc = new Account(); acc.deposit = 100; acc.balance   // 100; acc.#balance → SyntaxError` },
{ lv: 'Medium', q: `Object.assign vs spread for copying/merging objects, and what does instanceof check?`,
  k: `Both copy only the top layer; later boxes win when labels clash. instanceof asks "were you made by this factory (or its parents)?"`,
  a: `Both make <b>shallow</b> copies of own enumerable properties, and later sources overwrite earlier ones: <code>{ ...a, ...b }</code> ≈ <code>Object.assign({}, a, b)</code>. Differences: <code>Object.assign(target, …)</code> <b>mutates</b> the target and triggers its setters; spread always creates a new object (preferred in React). Neither deep-merges nested objects (write a recursive merge or use a library, or <code>structuredClone</code> for deep copies). <b>instanceof</b> checks whether <code>Constructor.prototype</code> appears in the object's prototype chain (<code>err instanceof TypeError</code>); it fails across iframes/realms, so use <code>Array.isArray</code> for arrays.`,
  c: `const defaults = { theme: 'light', layout: { dense: false } }
const merged = { ...defaults, theme: 'dark' }           // new object
merged.layout === defaults.layout                        // true — nested object is shared (shallow)
class ApiError extends Error {}
new ApiError() instanceof Error                          // true` },
{ lv: 'Easy', q: `What does Array.prototype.flatMap do?`,
  k: `Change each item into a small list, then pour all the small lists into one big list.`,
  a: `<code>flatMap(fn)</code> maps each element, then flattens the result <b>one level</b>; equivalent to <code>map(fn).flat()</code> but in one pass. Return an array to produce several items, an empty array to drop an item: a neat way to filter and map together.`,
  c: `const orders = [{ id: 1, items: ['pen', 'book'] }, { id: 2, items: ['bag'] }]
orders.flatMap(o => o.items)                    // ['pen', 'book', 'bag']
[1, 2, 3, 4].flatMap(n => (n % 2 ? [] : [n * 10]))   // [20, 40] — filter + map` },
  );

  sec('css').push(
{ lv: 'Easy', q: `What are the different ways to center a div?`,
  k: `Ask the parent box to put the child in the middle; the modern ways are flexbox and grid.`,
  a: `<b>Both axes:</b> grid parent with <code>place-items: center</code>; flex parent with <code>justify-content: center; align-items: center</code>; flex/grid parent + <code>margin: auto</code> on the child; absolute child with <code>top: 50%; left: 50%; transform: translate(-50%, -50%)</code>; absolute child with <code>inset: 0; margin: auto</code> plus a fixed width/height. <b>Horizontal only:</b> <code>margin: 0 auto</code> on a block with a width; <code>text-align: center</code> on the parent centers inline/inline-block children (not a block div). Legacy: table-cell + <code>vertical-align: middle</code>.`,
  c: `.parent { display: grid; place-items: center; min-height: 100vh; }     /* simplest */
.parent { display: flex; justify-content: center; align-items: center; }
.child  { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }`,
  t: `Common mistake in posts: "margin: auto centers both ways". In normal block flow it only centers horizontally; vertical centering with margin: auto needs a flex/grid parent or an absolutely positioned element with inset: 0.` },
{ lv: 'Easy', q: `How do you hide an element in CSS? display:none vs visibility:hidden vs opacity:0 (and screen-reader-only text)?`,
  k: `Remove it completely, keep its empty space, or make it see-through, and each choice treats clicks and screen readers differently.`,
  a: `<code>display: none</code>: removed from layout and the accessibility tree, not focusable. <code>visibility: hidden</code>: keeps its space, invisible, not clickable or read by screen readers. <code>opacity: 0</code>: keeps space, still clickable/focusable and read by screen readers (good for fade animations, risky otherwise). The HTML <code>hidden</code> attribute ≈ display none. To hide visually but keep it for screen readers, use a <code>.sr-only</code> class (1px clip pattern). <code>aria-hidden="true"</code> hides from screen readers only.` },
{ lv: 'Medium', q: `What is the difference between :nth-child() and :nth-of-type(), and between pseudo-classes and pseudo-elements?`,
  k: `nth-child counts all children; nth-of-type counts only children of the same tag. A pseudo-class is a state; a pseudo-element is a part.`,
  a: `<code>p:nth-child(2)</code> matches a <code>p</code> that is the 2nd child of its parent (counting all element types). <code>p:nth-of-type(2)</code> matches the 2nd <code>p</code> among its siblings. Formulas: <code>odd</code>, <code>even</code>, <code>3n+1</code>. <b>Pseudo-classes</b> select a state or position: <code>:hover</code>, <code>:focus-visible</code>, <code>:disabled</code>, <code>:checked</code>, <code>:has()</code>, <code>:not()</code>. <b>Pseudo-elements</b> style a part or insert content: <code>::before</code>, <code>::after</code>, <code>::placeholder</code>, <code>::first-line</code>, <code>::selection</code>.`,
  c: `<div><h2>Title</h2><p>A</p><p>B</p></div>
/* p:nth-child(2) → "A" (2nd child overall);  p:nth-of-type(2) → "B" (2nd <p>) */` },
{ lv: 'Easy', q: `block vs inline vs inline-block, and what is float used for today?`,
  k: `Block boxes stack on new lines; inline words flow in a line; inline-block flows in a line but can have a size.`,
  a: `<b>block</b> (div, p): starts on a new line, takes full width, accepts width/height/margins. <b>inline</b> (span, a): flows within text, ignores width/height and vertical margins. <b>inline-block</b>: flows inline but accepts width, height, padding and margins (old way to place items side by side). <b>float</b> moves an element left/right so text wraps around it; it was once used for page layouts (with clearfix hacks). Today use flexbox/grid for layout and keep float for wrapping text around images.` },
  );

  sec('rest').push(
{ lv: 'Medium', q: `Can a REST API be secured with HTTPS alone?`,
  k: `HTTPS puts the letter in a locked van, but the shop still has to check who's ordering and what they're allowed to have.`,
  a: `<b>No.</b> HTTPS (TLS) encrypts and protects data <b>in transit</b> and proves the server's identity, preventing eavesdropping and man-in-the-middle attacks. It does nothing about <b>who</b> is calling or <b>what they may do</b>. You also need authentication (tokens, sessions, OAuth), authorization per resource, input validation, rate limiting, CORS configured correctly, secure headers, secrets management, logging and monitoring. HTTPS is required, but not sufficient.`,
  t: `Some posts answer "yes" to this. Interviewers usually ask it to check whether you know HTTPS is only transport security.` },
  );

  sec('advanced').push(
{ lv: 'Medium', q: `WebSockets vs Server-Sent Events vs polling: when would you use each?`,
  k: `Polling keeps asking "anything new?"; SSE is the server talking to you; WebSockets let both talk at any time.`,
  a: `<b>Short polling</b>: request every N seconds; simple, works everywhere, wasteful and delayed (fine for dashboards refreshing every 30s; React Query <code>refetchInterval</code>). <b>Long polling</b>: the server holds the request until there's data; fallback technique. <b>SSE</b> (<code>EventSource</code>): one-way server → client over HTTP, automatic reconnect, simple; great for notifications, live feeds, AI token streaming. <b>WebSockets</b>: full-duplex, low-latency messages both ways over one connection; for chat, collaboration, multiplayer, live trading. WebSockets need connection management (auth, heartbeats, reconnect with backoff, scaling with sticky sessions/pub-sub).` },
{ lv: 'Medium', q: `What is a Single Page Application (SPA)? What are its pros and cons?`,
  k: `One page that swaps its pictures instead of loading a new page every time you click.`,
  a: `An SPA loads one HTML shell and JavaScript; navigation and updates happen in the browser (client-side routing, data via APIs). <b>Pros:</b> app-like fast navigation after the first load, rich interactivity, clear separation of frontend and API, easy static hosting. <b>Cons:</b> larger initial JavaScript and slower first load, SEO and social previews need extra work, memory leaks in long sessions, needs client-side routing with server fallback, focus/scroll management for accessibility. Modern answers combine approaches: SSR/SSG for first load and SEO with SPA-style navigation afterwards (Next.js, React Router framework mode).` },
{ lv: 'Medium', q: `Real DOM vs Virtual DOM: what are the common misconceptions?`,
  k: `The browser doesn't rebuild the whole page on every change; React's copy just helps it work out the smallest set of changes for you.`,
  a: `<b>Misconception 1:</b> "the browser re-renders the entire real DOM on every change". It doesn't; DOM updates are granular. The real cost is triggering style recalculation, layout and paint too often (layout thrashing). <b>Misconception 2:</b> "the Virtual DOM is always faster than the DOM". Hand-written, targeted DOM updates can be faster; the VDOM adds diffing and memory overhead. Its value is a <b>declarative</b> model: you describe the UI for the current state and React computes and batches minimal DOM updates, so performance stays good by default and code stays simple. <b>Misconception 3:</b> "VDOM replaces the DOM". It only describes it; the browser DOM still renders everything. Frameworks like Svelte and Solid skip the VDOM entirely with fine-grained reactivity.` },
  );
})();
