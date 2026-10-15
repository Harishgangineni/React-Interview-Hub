/* Practice rounds from interview experiences and lists the user pasted (LinkedIn). Company names are as reported by the candidates who posted them.
   Each item: [label, search query used to link the matching question on this site]. */
HUB.rounds = [
  { title: 'Machine coding: 20 commonly asked components', source: 'LinkedIn post (list)', items: [
    ['Todo list', 'React build: todo list'], ['Tabs with content switching', 'React build: accessible tabs'], ['Accordion', 'React build: accordion'],
    ['Carousel (system design)', 'Build a carousel'], ['Pagination', 'React build: pagination'], ['Truncated pagination', 'truncated pagination'],
    ['Infinite scroll', 'React build: infinite scroll'], ['Configurable colour boxes', 'configurable colour boxes'], ['Posts with comments', 'posts with nested comments'],
    ['Progress bar', 'Build a progress bar'], ['Config-driven form', 'config-driven form'], ['Star rating', 'React build: star rating'],
    ['E-commerce filters', 'Build e-commerce filters'], ['Shopping cart in React', 'shopping cart persist sync optimistic offline'], ['Nested comment section', 'posts with nested comments'],
    ['Advanced tic-tac-toe', 'tic-tac-toe'], ['Toast / notification system', 'toast notification system'], ['Autocomplete / typeahead', 'React build: autocomplete'],
    ['Poll widget', 'poll widget'], ['Match similar tiles game', 'match similar tiles memory game'] ] },
  { title: 'DSA: 15 most-asked array and string problems', source: 'LinkedIn post (list)', items: [
    ['Product of array except self', 'product except self'], ['Word pattern', 'Word pattern'], ['Evens to front, odds to back', 'even numbers to the front'],
    ['Balanced brackets', 'balanced brackets'], ['All subsets', 'all subsets of an array'], ['Remove vowels', 'Remove all vowels from a string'],
    ['Subarray sum equals k', 'subarrays whose sum equals k'], ['Longest word in a string', 'longest word in a sentence'], ['3Sum (triplets to zero)', 'triplets that sum to zero'],
    ['String compression', 'Compress a string'], ['Reverse array without reverse()', 'Reverse an array without using reverse'], ['Remove characters of second string', 'Remove all characters of the second string'],
    ['Longest increasing subsequence', 'Longest increasing subsequence'], ['String rotation', 'rotation of another'], ['Pairs with difference k', 'pairs that differ by exactly k'] ] },
  { title: 'Experience: pen-and-paper round + React/JS discussion', source: 'Candidate-reported (LinkedIn)', items: [
    ['String rotation', 'rotation of another'], ['Pythagorean triplets', 'Pythagorean triplets'], ['Repeated elements with indices', 'repeated elements and their indices'],
    ['React 18 automatic batching', 'automatic batching in React 18'], ['useTransition', 'useTransition'], ['Redux vs custom hooks', 'custom hooks can reuse logic Redux'],
    ['find() and filter() use cases', 'find filter array methods'] ] },
  { title: 'Experience: React, JavaScript, performance and architecture round', source: 'Candidate-reported (LinkedIn)', items: [
    ['What is a component; designing reusable ones', 'What is a component in React?'], ['setCount(count + 1) three times', 'automatic batching in React 18 setCount three times'],
    ['Stale closures with setTimeout', 'stale closure'], ['Infinite re-renders with useEffect', 'infinite render loop'], ['useRef and passing refs parent ↔ child', 'forwardRef pass ref to child'],
    ['useMemo vs useCallback vs React.memo', 'difference between useMemo, useCallback and React.memo'], ['React Fiber and why it was introduced', 'What is React Fiber'],
    ['useDeferredValue', 'useDeferredValue'], ['call() vs apply() with outputs', 'call apply bind difference'], ['~ vs ^ in package versions', 'version ranges package.json'],
    ['Page making multiple API calls', 'page that makes many API calls'], ['Filtering ~1000 rows', 'dashboard slow thousands of records'], ['Role-based access control', 'role-based access control'],
    ['404 page with React Router', '404 not found React Router'], ['Redux Toolkit', 'Redux Toolkit createSlice configureStore'], ['Keys in lists', 'key prop lists'] ] },
  { title: '17 questions across 3 rounds (fundamentals, architecture, leadership)', source: 'LinkedIn post (list)', items: [
    ['Event loop: sync, microtasks, macrotasks', 'event loop microtasks macrotasks'], ['Reusable debounce hook', 'A search field sends too many API requests'], ['Searchable multi-select dropdown', 'searchable multi-select dropdown'],
    ['10,000+ records without slowing the UI', 'list virtualization'], ['Controlled vs uncontrolled', 'controlled and uncontrolled components'], ['Dashboard with 100+ pages', 'Redux for 200+ screens feature modules'],
    ['Code splitting and lazy loading', 'code splitting lazy loading'], ['Rate limits, retries, backoff, 429', 'rate limiting 429'], ['Hydration mismatches in Next.js', 'hydration errors'],
    ['Shared component library for many teams', 'component library design system'], ['CSR vs SSR vs SSG', 'CSR SSR SSG'], ['Frontend for 1M+ users a day', 'million users a day'],
    ['Production release breaks a critical flow', 'production deployment breaks an existing feature'], ['Tech debt vs bugs vs features', 'technical debt bug fixes'], ['Design and backend disagree with you', 'disagreed with your manager design backend'],
    ['Explaining trade-offs to non-technical people', 'non-technical stakeholders'], ['PR works but has maintainability concerns', 'pull request that works but has maintainability'] ] },
  { title: 'Infosys interview experience', source: 'Candidate-reported (LinkedIn)', items: [
    ['Access token vs refresh token', 'access token refresh token'], ['Cookies in web apps', 'cookies'], ['Authentication vs authorization', 'authentication vs authorization'],
    ['useCallback vs useMemo with real use cases', 'difference between useMemo and useCallback'], ['Context API vs Redux / RTK', 'Context API over Redux'], ['Optimise a React app', 'optimize performance in a React application'],
    ['Prevent unnecessary re-renders', 'component re-renders even though its visible data'], ['var + setTimeout loop output', 'var in loops setTimeout'], ['Hoisting and TDZ', 'temporal dead zone'],
    ['Event delegation', 'event delegation'], ['Product CRUD app (persist to storage)', 'product CRUD localStorage'], ['localStorage vs sessionStorage', 'localStorage sessionStorage'],
    ['Cloud and deployment knowledge', 'cloud platforms deployment production environments'] ] },
  { title: 'Flipkart interview experience', source: 'Candidate-reported (LinkedIn)', items: [
    ['Shopping cart in vanilla JS (machine coding)', 'shopping cart in vanilla JavaScript'], ['Polyfills for useMemo and useCallback', 'polyfills of useMemo and useCallback'],
    ['Array.prototype.flat with depth', 'flat with a depth parameter'], ['React hydration and when it breaks', 'hydration errors'], ['Reverse a linked list O(n)/O(1)', 'reverse linked list'],
    ['Toughest production bug', 'difficult production bug'], ['Rewrite vs refactor legacy code', 'rewriting and refactoring legacy code'], ['Disagreeing with your manager', 'disagreed with your manager'],
    ['Why this company?', 'Why do you want to join our company'] ] },
  { title: 'Web security, JWT, HTTP and timers posts', source: 'LinkedIn posts', items: [
    ['How XSS can steal your JWT', 'How does React protect against XSS'], ['Where to store JWTs', 'Where should you store a JWT'], ['JWT structure and claims', 'structure of a JWT'],
    ['HTTP status codes', 'status codes 4xx 5xx'], ['setTimeout: sync or async, setTimeout(0)', 'setTimeout synchronous or asynchronous'], ['setInterval vs recursive setTimeout', 'setInterval vs recursive setTimeout'],
    ['Timer drift, background tabs, requestAnimationFrame', 'timer drift requestAnimationFrame'], ['Timers and memory leaks in React', 'timers cause memory leaks'] ] },
];

HUB.rounds.push(
  { title: 'React LLD: 9 commonly asked low-level design questions', source: 'LinkedIn post (list)', items: [
    ['Toast notification system', 'toast notification system'], ['Comment thread with nested replies', 'posts with nested comments'], ['Responsive sidebar navigation', 'responsive sidebar navigation'],
    ['Tabs with animated switching', 'tabs with animated switching'], ['Filterable, sortable data table', 'filterable, sortable, paginated data table'], ['Like button with optimistic updates', 'like/favourite button with optimistic updates'],
    ['Live chat (WebSockets, typing status)', 'live chat feature'], ['Rate-limited / throttled button click', 'prevent multiple API hits from rapid clicks'], ['Collapsible accordion', 'React build: accordion'] ] },
  { title: 'EY senior frontend experience (JavaScript and design parts)', source: 'Candidate-reported (LinkedIn); Angular-only questions left out', items: [
    ['Memory allocation in JavaScript', 'allocate memory garbage collection'], ['How to clear closure memory', 'Closures deep dive free closure memory'], ['ES6 features you use', 'ES6 features'],
    ['Modules in JavaScript', 'What are ES modules?'], ['Pure functions with a use case', 'pure functions functional programming'], ['Recursive functions', 'What is recursion? Write a recursive function'],
    ['Stay logged in after closing the tab', 'keep a user logged in even after they close the tab'], ['Use whichever API responds first', 'Promise.all, allSettled, race and any'],
    ['Prevent duplicate submits on slow networks', 'prevent multiple API hits from rapid clicks'], ['Keep table filters and data when coming back', 'same filters and data when coming back'],
    ['Reusable components you built', 'composition reusable components'], ['Send dashboard activity with logout', 'logout button is in the navbar'], ['Role-based dynamic menus and route guards', 'role-based access control'],
    ['Migrating UI libraries without disrupting sprints', 'migrating a UI component library'] ] },
  { title: 'Swiggy frontend interview experience', source: 'Candidate-reported (LinkedIn)', items: [
    ['Infinite scroll with error handling', 'React build: infinite scroll'], ['Debounced search', 'React build: debounced search'], ['Responsive grid layout', 'Flexbox vs Grid'],
    ['Custom useDebounce hook', 'reusable useDebounce hook'], ['10,000+ item list', 'list virtualization'], ['Real-time order tracker with WebSockets', 'real-time order tracker'],
    ['Restaurant list with filters and sorting', 'Build e-commerce filters'], ['Cart with real-time price updates', 'shopping cart persist sync optimistic offline'], ['Error boundaries and loading states', 'error boundaries catch'],
    ['Responsive for mobile', 'How do you make a site responsive'], ['Restaurant page architecture with real-time updates', 'restaurant page with real-time order updates'],
    ['Component architecture and code splitting', 'code splitting lazy loading'], ['State management, data fetching and caching', 'server state client state TanStack Query'], ['Performance and error handling strategies', 'optimize performance in a React application'] ] },
  { title: 'Senior system-level frontend questions (15)', source: 'LinkedIn post (list)', items: [
    ['React Fiber', 'What is React Fiber'], ['Server vs Client Components', 'React Server Components'], ['Fix unnecessary re-renders', 'component re-renders even though its visible data'],
    ['Virtual DOM diffing and its limits', 'reconciliation diffing'], ['When memo/useMemo/useCallback hurt', 'Interview trap: does React.memo stop'], ['Micro-frontend architecture', 'micro-frontend architecture become a bad idea'],
    ['Code splitting, lazy loading, module federation', 'Module Federation'], ['Real-time notifications for millions', 'real-time notifications that arrive every second'], ['CSR vs SSR vs SSG vs ISR', 'CSR SSR SSG'],
    ['Frontend for multiple teams', 'How do you build a design system in React?'], ['Event loop with examples', 'event loop microtasks macrotasks'], ['Browser rendering bottlenecks', 'critical rendering path'],
    ['Hydration and debugging it', 'hydration errors'], ['Memory leaks in React', 'memory leak appears after navigating'], ['Monitoring frontend in production', 'monitor a React application in production'] ] },
  { title: 'React scenario-based questions, part 2', source: 'LinkedIn post (list)', items: [
    ['Monitoring an app used by millions', 'monitor a React application in production'], ['Notifications every second', 'real-time notifications that arrive every second'], ['Growing bundle from third-party libraries', 'bundle size'],
    ['Shared design system across teams', 'component library design system'], ['AI dashboard streaming updates', 'AI-powered dashboard streams'], ['Moving to Server Components', 'introduce Server Components into an app'],
    ['UI blocking during filtering (transitions)', 'useTransition useDeferredValue'], ['Suspense and streaming for slow sources', 'streaming SSR Suspense'], ['Large GraphQL responses', 'Large GraphQL responses'] ] },
  { title: 'JavaScript coding: polyfills and utilities to practise', source: 'LinkedIn posts (lists)', items: [
    ['map() polyfill', 'polyfill for Array.prototype.map'], ['filter() polyfill', 'polyfill for Array.prototype.filter'], ['reduce() polyfill', 'polyfill for Array.prototype.reduce'],
    ['call / apply / bind', 'call apply bind difference'], ['Debounce', 'debounce with leading option'], ['Throttle', 'throttle that also runs the last call'],
    ['Flatten an array', 'Flatten a nested array'], ['Deep vs shallow copy', 'deep copy and shallow copy'], ['Currying and infinite currying', 'infinite currying'],
    ['Memoize and once', 'memoize and once'], ['Promise.all polyfill', 'Promise.all polyfill'], ['Promise.race polyfill', 'Promise.race polyfill'],
    ['Promise.allSettled / any polyfills', 'Promise.allSettled and Promise.any polyfills'], ['Retry failed API calls', 'retry a failing async function with exponential backoff'], ['Run async tasks with a limit', 'concurrency limit'],
    ['Tasks in series', 'async tasks in series'], ['Group by a property', 'implement groupBy'], ['Sort by multiple keys', 'sort an array of objects by multiple keys'],
    ['Flatten a nested object', 'flatten a nested object into dot paths'], ['Deep equality', 'deep equality check'], ['Event emitter / pub-sub', 'tiny EventEmitter'],
    ['LRU cache', 'LRU Cache'], ['pipe and compose', 'compose and pipe'], ['setInterval with setTimeout, clearAllTimeouts', 'implement setInterval using setTimeout'],
    ['Deep freeze', 'deepFreeze'], ['Array to tree', 'flat array with parentId into a tree'], ['Basic useState with closures', 'basic useState using closures'],
    ['Simplified virtual DOM', 'simplified virtual DOM'], ['Lazy-load images', 'Lazy-load images with IntersectionObserver'], ['Drag and drop', 'drag-and-drop to reorder'] ] },
  { title: 'Top React and JavaScript questions to master in 2026', source: 'LinkedIn post (list)', items: [
    ['Object vs Map', 'Map vs object'], ['PATCH vs PUT', 'difference between PUT and PATCH'], ['Debounce vs throttle', 'throttling and debouncing'],
    ['How the JavaScript engine works', 'JavaScript engine'], ['Virtual DOM and comparison', 'virtual DOM'], ['Why keys matter', 'key prop lists'],
    ['How useState works internally', 'basic useState using closures'], ['Portals and modals', 'portal in React'], ['Error boundaries', 'error boundaries'],
    ['Memoization in React', 'difference between useMemo, useCallback and React.memo'], ['SSR vs CSR', 'CSR SSR'], ['Micro-frontends and module federation', 'Module Federation'],
    ['SSR techniques for SEO', 'improve the SEO of a React single-page application'], ['Tab order and tabIndex', 'tabIndex'], ['Capturing and bubbling', 'event bubbling and capturing'],
    ['Override toString on String.prototype', 'override toString on String.prototype'], ['Memory leaks in React', 'memory leak appears after navigating'], ['Measure React performance', 'React Profiler measure'],
    ['OAuth', 'OAuth 2.0'], ['SSO', 'SSO OpenID Connect'], ['REST methods', 'HTTP methods and what does each do'],
    ['Functional programming principles', 'pure functions functional programming'], ['Reusable UI component structure', 'composition reusable components'] ] },
);

HUB.rounds.push(
  { title: '30-day frontend series: Days 1–8 (pasted so far)', source: 'LinkedIn series; Days 9–31 not added yet (links need login)', items: [
    ['HTML vs HTML5', 'HTML5'], ['CSS box model', 'box model'], ['Media queries', 'media queries'], ['Margin vs padding', 'difference between margin and padding'],
    ['Responsive web design', 'How do you make a site responsive'], ['CSS preprocessors', 'CSS preprocessor'], ['Event delegation', 'event delegation'], ['"use strict"', 'What does "use strict" do'],
    ['Closures', 'What is a closure'], ['Virtual DOM', 'virtual DOM'], ['Class vs functional components', 'class components and functional components'], ['key prop in lists', 'key prop lists'],
    ['null vs undefined', 'null and undefined'], ['script defer vs async', 'script defer and async'], ['CORS', 'What is CORS and how does preflight work'], ['fetch() API', 'Fetch API'],
    ['Web Components', 'What are Web Components'], ['Bubbling vs capturing', 'event bubbling and capturing'], ['z-index', 'How does z-index work'], ['Website performance', 'optimize performance in a React application'],
    ['Hoisting', 'hoisting'], ['Arrow vs regular functions', 'arrow functions'], ['Callback functions', 'What is a callback function, and what is callback hell?'], ['localStorage vs sessionStorage', 'localStorage sessionStorage'],
    ['Ways to include CSS', 'ways to include CSS'], ['Ways to loop over an array', 'ways to loop over an array'], ['Ways to handle async code', 'async/await and promises'], ['Sync vs async JavaScript', 'synchronous and asynchronous'],
    ['React rendering performance', 'prevent unnecessary re-renders'], ['Higher-order components', 'higher-order component'], ['SEO for SPAs', 'improve the SEO of a React single-page application'], ['Code splitting', 'code splitting lazy loading'],
    ['CSS animation performance', 'CSS animations and transitions perform well'], ['Responsive images', 'make images responsive and fast'], ['Output: coercion puzzles (Day 7)', 'Output: console.log(5 - "2"'],
    ['TS access modifiers', 'access modifiers in TypeScript'], ['TS type inference', 'type inference'], ['TS interfaces', 'interface and type alias'], ['TypeScript vs JavaScript', 'What is TypeScript and how does it differ'] ] },
  { title: 'Performance posts: bundle size and the main thread', source: 'LinkedIn posts', items: [
    ['Reduce bundle size (analyzer, tree shaking, splitting, compression)', 'reduce a React app\'s bundle size'], ['Web Workers for heavy work', 'What are Web Workers'],
    ['Long tasks blocking the UI', 'long Promise chain or microtask loop block rendering'], ['React performance mistakes', 'optimize performance in a React application'] ] },
);

HUB.rounds.push(
  { title: '30-day frontend series: Days 9–31', source: 'LinkedIn series (pasted)', items: [
    ['Day 9: Git vs GitHub', 'difference between Git and GitHub'], ['Day 9: Basic Git commands', 'basic Git commands'], ['Day 9: Merge branches', 'merge one branch into another'],
    ['Day 9: Resolve merge conflicts', 'resolve a merge conflict'], ['Day 9: Undo last commit / revert pushed commit', 'undo the last commit but keep the changes'], ['Day 9: .gitignore', '.gitignore'],
    ['Day 10: Debounce', 'debounce with leading option'], ['Day 10: Throttle', 'throttle that also runs the last call'],
    ['Day 11: Creating objects, dot vs bracket', 'dot vs bracket notation'], ['Day 11: Prototype and Object.create', 'prototypal inheritance'], ['Day 11: this inside objects', 'How does the "this" keyword work'],
    ['Day 11: Loop properties, check existence', 'loop through an object\'s properties'], ['Day 11: Constructor functions', 'constructor function'], ['Day 11: Destructuring', 'destructuring'],
    ['Day 11: Shallow vs deep copy', 'deep copy and shallow copy'], ['Day 11: Getters, setters, encapsulation', 'getters and setters'], ['Day 11: Prevent new properties (freeze/seal)', 'Object.freeze Object.seal'],
    ['Day 11: Object.keys/values/entries', 'loop through an object\'s properties'], ['Day 11: Object.assign vs spread, instanceof', 'Object.assign vs spread'], ['Day 11: Objects vs Map', 'Map vs object'],
    ['Day 12: Optimise API performance on the frontend', 'page that makes many API calls'], ['Day 12: OAuth 2.0', 'OAuth 2.0'], ['Day 12: Async API requests', 'async/await and promises'], ['Day 12: CORS', 'What is CORS and how does preflight work'],
    ['Day 13: Ways to center a div', 'ways to center a div'], ['Day 14: Hide elements', 'hide an element in CSS'], ['Day 14: nth-child vs nth-of-type', 'nth-child() and :nth-of-type()'],
    ['Day 14: inline-block and float', 'block vs inline vs inline-block'], ['Day 14: CSS animations', 'CSS animations and transitions perform well'], ['Day 14: rem unit', 'px vs em vs rem'],
    ['Day 14: position values', 'position values'], ['Day 15: REST API basics', 'What is REST?'], ['Day 15: Versioning', 'version a REST API'], ['Day 15: Rate limiting', 'rate limiting 429'],
    ['Day 15: Is HTTPS alone enough?', 'secured with HTTPS alone'], ['Day 16: Clean coding habits', 'clean code'], ['Day 17: Array.flatMap', 'flatMap'],
    ['Day 18: Hoisting', 'Hoisting edge cases'], ['Day 19: this keyword', 'How does the "this" keyword work'], ['Day 20: Closures', 'What is a closure'], ['Day 21: CORS in depth', 'What is CORS and how does preflight work'],
    ['Day 22: Memoization', 'memoize and once'], ['Day 23: Virtual DOM', 'virtual DOM'], ['Day 23: SSR vs CSR', 'CSR SSR'], ['Day 23: WebSockets', 'WebSockets vs Server-Sent Events vs polling'],
    ['Day 23: Lazy loading', 'code splitting lazy loading'], ['Day 23: SPAs: pros and cons', 'Single Page Application (SPA)'], ['Day 24: CDN', 'backend/system design concepts should a frontend engineer'],
    ['Day 24: PWAs', 'service workers PWA'], ['Day 24: State management', 'Context API over Redux'], ['Day 24: Grid vs Flexbox', 'Flexbox vs Grid'], ['Day 24: Tree shaking', 'tree shaking'],
    ['Day 25: React basics and props', 'difference between state and props'], ['Day 25: React Router', 'What is React Router?'], ['Day 25: Context', 'What is the context API in React?'], ['Day 25: Lifecycle methods', 'lifecycle methods'],
    ['Day 26: Event loop', 'event loop microtasks macrotasks'], ['Day 27: Real vs Virtual DOM', 'Real DOM vs Virtual DOM'], ['Day 28: Why Redux', 'What is Redux?'],
    ['Day 29: Redux flow', 'Explain the Redux data flow'], ['Day 30: How the virtual DOM works', 'reconciliation diffing'], ['Day 31: SSR vs CSR in depth', 'CSR SSR SSG'] ] },
);

HUB.rounds.push(
  { title: 'Accenture React.js (3+ yrs) experience', source: 'Candidate-reported (LinkedIn)', items: [
    ['var, let, const with scoping', 'var, let and const'], ['Hoisting', 'Hoisting edge cases'], ['Temporal Dead Zone', 'temporal dead zone'], ['Promises', 'promise and a callback'],
    ['Promises vs async/await', 'async/await and promises'], ['Destructuring', 'destructuring'], ['Class vs functional components', 'class components and functional components'],
    ['Prop drilling and solutions', 'prop drilling'], ['Redux vs Context', 'Context API over Redux'], ['React performance optimisation', 'optimize performance in a React application'],
    ['useReducer', 'useReducer hook'], ['Refs', 'forwardRef and useRef'], ['Routing', 'What is React Router?'], ['Increment/decrement counter', 'React build: a counter'] ] },
  { title: 'Wissen Tech frontend experience', source: 'Candidate-reported (LinkedIn)', items: [
    ['useRef and its uses beyond DOM access', 'useRef'], ['useEffect and its cleanup', 'What is the use of useEffect hook?'], ['localStorage vs sessionStorage', 'localStorage sessionStorage'],
    ['Closures', 'What is a closure'], ['Bubbling vs capturing', 'event bubbling and capturing'], ['Capitalize each word', 'Capitalize the first letter of every word'],
    ['Print 1–10 with a 1s delay', 'Print numbers 1 to 10 with a one-second delay'], ['Start / Pause / Resume / Stop counter', 'counter timer with Start, Pause/Resume and Stop'] ] },
  { title: 'Synechron React.js experience', source: 'Candidate-reported (LinkedIn)', items: [
    ['Hooks you use and when', 'What are React hooks?'], ['A custom hook you built', 'reusable useDebounce hook'], ['What changed in newer React versions', 'What is new in React 19?'],
    ['Finding and fixing unnecessary re-renders', 'component re-renders even though its visible data'], ['Redux vs Context', 'Context API over Redux'], ['Live coding: custom data-fetching hook with errors', 'React build: useFetch'],
    ['Testing with Jest and RTL', 'approach to writing test cases'], ['Closures with an example', 'What is a closure'], ['Node.js experience', 'experience with Node.js'], ['Using Copilot / AI tools', 'use AI in your daily development'] ] },
  { title: '10 senior React architecture questions', source: 'LinkedIn post (list)', items: [
    ['Root-causing unnecessary re-renders before memoizing', 'component re-renders even though its visible data'], ['Same data, different update frequencies', 'global Context holds user, theme, permissions'],
    ['A component with 15 props', 'What are render props?'], ['Global Context with mixed data', 'global Context holds user, theme, permissions'], ['50 independently updating widgets', 'dashboard with many widgets'],
    ['Design system without a "god library"', 'How do you build a design system in React?'], ['Concurrent optimistic mutations out of order', 'optimistic updates for several concurrent mutations'],
    ['Orchestrating five APIs (hooks vs BFF)', 'data from five APIs'], ['Separating business logic from UI', 'Business logic is tightly coupled'], ['When to choose or avoid micro-frontends', 'micro-frontend architecture become a bad idea'] ] },
  { title: 'React fundamentals checklist (frequently asked list)', source: 'LinkedIn post (list)', items: [
    ['React Node vs Element vs Component', 'React Node, a React Element and a React Component'], ['JSX', 'What is JSX'], ['Keys and why not indexes', 'key prop lists'], ['Pitfalls of Context', 'downsides of Context'],
    ['Rules of hooks', 'rules of hooks'], ['useEffect vs useLayoutEffect', 'useEffect and useLayoutEffect'], ['setState callback form', 'automatic batching in React 18'], ['useId', 'useId'],
    ['forwardRef', 'forwardRef'], ['Reset a component\'s state', 'reset a component'], ['Error boundaries', 'error boundaries'], ['Hydration', 'hydration'], ['Portals', 'portal in React'],
    ['Strict Mode', 'StrictMode'], ['Localization', 'How do you handle internationalization in React?'], ['createElement vs cloneElement', 'createElement vs cloneElement'], ['useImperativeHandle', 'useImperativeHandle'],
    ['Flux and one-way data flow', 'Flux pattern'], ['Presentational vs container components', 'presentational vs container'], ['Data-fetching pitfalls', 'API is being called twice'] ] },
  { title: 'JavaScript console and output drill (question list from a 100-question PDF)', source: 'Question topics only; answers written for this hub', items: [
    ['typeof null / NaN / class / function', 'typeof null'], ['0.1 + 0.2', '0.1 + 0.2 === 0.3'], ['Coercion with + and -', 'Output: console.log(5 - "2"'], ['[] + [], [] + {}, {} + []', 'Output: console.log([] + []'],
    ['Falsy values and !!', 'truthiness narrowing'], ['NaN === NaN, Number.isNaN', 'Output: console.log(0.1 + 0.2 === 0.3, NaN'], ['Hoisting traps', 'Hoisting edge cases'], ['var in a loop with setTimeout', 'for loop with setTimeout using let vs var'],
    ['== vs ===', 'javascript', 'What is the difference between == and ==='], ['call / apply / bind', 'call apply bind difference'], ['map(parseInt) and other drills', 'Output drill: [\'1\',\'2\',\'3\'].map(parseInt)'], ['Chained comparisons and more', 'Output drill: 1 < 2 < 3'],
    ['Event loop order', 'Output: console.log(1); setTimeout'], ['Microtasks vs macrotasks', 'event loop microtasks macrotasks'], ['Object references', 'Output: const a = { x: 1 }'], ['Shallow vs deep copy', 'deep copy and shallow copy'],
    ['Optional chaining and ??', 'optional chaining'], ['Generators', 'generator'], ['Symbol', 'Symbol'], ['WeakMap vs Map', 'WeakMap'], ['Proxy', 'Proxy and Reflect'], ['Tagged templates', 'tagged template literal'],
    ['slice vs splice', 'splice'], ['for...in vs for...of', 'ways to loop over an array'], ['JSON.stringify gotchas', 'JSON.parse(JSON.stringify'], ['innerHTML vs textContent', 'innerHTML vs textContent'], ['Pure functions', 'pure functions functional programming'], ['localStorage vs sessionStorage', 'localStorage sessionStorage'] ] },
);
