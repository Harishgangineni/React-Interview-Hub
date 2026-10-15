/* From the "commonly asked frontend interview questions" 30-day LinkedIn series (Days 1–8 pasted by the user) and two performance posts. Answers written for this hub. Appended to keep ids stable. */
(function () {
  const sec = id => HUB.sections.find(s => s.id === id).items;

  sec('advanced').push(
{ lv: 'Medium', q: `How would you reduce a React app's bundle size?`,
  k: `Find the heaviest bags, throw out what you never use, and only carry the rest when you need it.`,
  a: `<b>1) Measure:</b> a bundle analyzer (rollup-plugin-visualizer for Vite, webpack-bundle-analyzer, source-map-explorer) shows which libraries and files are heavy; check Lighthouse/LCP before and after. <b>2) Tree shaking:</b> use ES module builds and named imports (<code>import { debounce } from 'lodash-es'</code>, not the whole library); avoid side-effectful barrel imports. <b>3) Code splitting:</b> <code>React.lazy</code> + Suspense for routes and heavy widgets (charts, editors, modals), dynamic <code>import()</code> for rarely used libraries. <b>4) Replace heavy dependencies:</b> moment.js → date-fns/Day.js or native <code>Intl</code>; lodash → native methods or per-function imports; check bundlephobia before adding packages. <b>5) Compression:</b> serve Brotli (or gzip) from the server/CDN, minify, long-term caching with hashed file names. <b>6) Keep it fixed:</b> size budgets in CI (size-limit), review new dependencies in PRs. Report results honestly with your own before/after numbers.`,
  c: `// vite.config.js — see what's inside the bundle
import { visualizer } from 'rollup-plugin-visualizer'
export default { plugins: [react(), visualizer({ open: true, gzipSize: true })] }

// load a heavy chart library only when the chart is shown
const Chart = lazy(() => import('./SalesChart'))` },
{ lv: 'Medium', q: `What are Web Workers and when would you use them in a React app?`,
  k: `A helper in another room does the heavy counting, so the main helper can keep answering clicks.`,
  a: `The browser runs your JavaScript, rendering and input handling on <b>one main thread</b>; heavy work (sorting/filtering 50,000 rows, parsing a large CSV, encryption, image processing, in-browser ML) blocks it and the UI freezes. A <b>Web Worker</b> runs a script on a separate thread: you <code>postMessage</code> data to it, it does the work, and posts the result back. Workers can't touch the DOM; data is copied (structured clone) unless you transfer ArrayBuffers; terminate workers you no longer need. Libraries like Comlink make the API feel like normal function calls. Alternatives first: do less work, paginate on the server, virtualize, or use <code>startTransition</code> for rendering cost.`,
  c: `// sortWorker.js
self.onmessage = e => {
  const { rows, key } = e.data
  self.postMessage(rows.toSorted((a, b) => (a[key] > b[key] ? 1 : -1)))
}
// component
useEffect(() => {
  const worker = new Worker(new URL('./sortWorker.js', import.meta.url), { type: 'module' })
  worker.onmessage = e => setSorted(e.data)
  worker.postMessage({ rows, key: sortKey })
  return () => worker.terminate()
}, [rows, sortKey])` },
{ lv: 'Medium', q: `How do you improve the SEO of a React single-page application?`,
  k: `Make sure search engines see real content and good labels when they visit, not an empty page.`,
  a: `A client-rendered SPA sends an almost empty HTML shell, so content depends on crawlers running JavaScript (Google can, with delay; many other crawlers and social link previews can't). Fixes: <b>render HTML on the server or at build time</b> (SSR, SSG/pre-rendering, ISR with Next.js or React Router framework mode) for public pages; unique <code>&lt;title&gt;</code>, meta description and canonical per route (React 19 supports <code>&lt;title&gt;</code>/<code>&lt;meta&gt;</code> in components); Open Graph/Twitter tags for link previews; clean URLs with BrowserRouter and server fallback; semantic HTML and headings; real <code>&lt;a href&gt;</code> links; sitemap.xml and robots.txt; structured data (JSON-LD); fast Core Web Vitals; avoid content hidden behind interactions. Pages behind login don't need SEO.` },
  );

  sec('css').push(
{ lv: 'Easy', q: `What is the difference between margin and padding?`,
  k: `Padding is the cushion inside the box; margin is the space outside the box.`,
  a: `<b>Padding</b> is space between the content and the border, inside the element: it takes the element's background and increases its clickable area. <b>Margin</b> is space outside the border, between the element and its neighbours: it's transparent, can be negative, can be <code>auto</code> (centring blocks horizontally) and vertical margins of adjacent blocks can collapse. With <code>box-sizing: border-box</code>, padding is included in the element's width; margin never is.` },
{ lv: 'Easy', q: `What is a CSS preprocessor (Sass/SCSS, Less)? Is it still needed?`,
  k: `A helper language that adds shortcuts to CSS, then turns into normal CSS.`,
  a: `Preprocessors extend CSS with <b>variables</b>, <b>nesting</b>, <b>mixins</b>, functions, loops and partials/imports, then compile to plain CSS. SCSS uses CSS-like syntax; Less is similar. Today native CSS covers much of this (custom properties, nesting, <code>@layer</code>, <code>color-mix()</code>, <code>clamp()</code>), and many React teams use CSS Modules, Tailwind or CSS-in-JS instead; Sass is still common in existing codebases and design systems (mixins, maps, generating utilities).`,
  c: `$brand: #0E7C9B;
@mixin card { border-radius: 12px; padding: 16px; }
.product { @include card; color: $brand; &:hover { color: darken($brand, 10%); } }` },
{ lv: 'Medium', q: `How does z-index work, and why doesn't a higher z-index always win?`,
  k: `A bigger number means "on top", but only among boxes in the same pile.`,
  a: `<code>z-index</code> sets stacking order for positioned elements (relative/absolute/fixed/sticky) and flex/grid children. It only compares elements inside the same <b>stacking context</b>. New contexts are created by positioned elements with a z-index, <code>opacity &lt; 1</code>, <code>transform</code>, <code>filter</code>, <code>isolation: isolate</code>, <code>position: fixed/sticky</code> and more. A child with <code>z-index: 9999</code> inside a parent context with a low z-index can never rise above a sibling context. Fix the context (or render overlays in a portal / the native dialog top layer) instead of escalating numbers; keep a small z-index scale in tokens.` },
{ lv: 'Easy', q: `What are the ways to include CSS in a page or React app?`,
  k: `Write styles on the element, in the page, in a separate file, or with tools that scope them to a component.`,
  a: `In HTML: <b>inline</b> <code>style</code> attributes (highest specificity, hard to maintain), an internal <code>&lt;style&gt;</code> block, and <b>external stylesheets</b> via <code>&lt;link rel="stylesheet"&gt;</code> (cacheable, preferred); <code>@import</code> inside CSS (slower, avoid for critical CSS). In React apps: imported global CSS files, CSS Modules, utility CSS (Tailwind), CSS-in-JS (styled-components/Emotion, or zero-runtime options), Sass, and inline style objects for dynamic values.` },
{ lv: 'Medium', q: `How do you make CSS animations and transitions perform well?`,
  k: `Move things with transform and fade with opacity, because the browser can do those cheaply.`,
  a: `Animate <b>transform</b> and <b>opacity</b>: they can run on the compositor (GPU) without layout or paint. Avoid animating <code>width/height/top/left/margin</code> (layout every frame) and large <code>box-shadow</code>/<code>filter</code> changes (expensive paint). Use <code>will-change</code> sparingly for elements about to animate; prefer CSS transitions/animations or the Web Animations API over JS timers, or <code>requestAnimationFrame</code> when JS is needed; keep animated layers small; respect <code>prefers-reduced-motion</code>; check the Performance panel for dropped frames.`,
  c: `.drawer { transform: translateX(-100%); transition: transform .25s ease; }
.drawer.open { transform: none; }
@media (prefers-reduced-motion: reduce) { .drawer { transition: none; } }` },
{ lv: 'Easy', q: `How do you make images responsive and fast?`,
  k: `Let pictures shrink to fit, and give phones smaller files than big screens.`,
  a: `<code>img { max-width: 100%; height: auto; }</code> so images never overflow their container; <code>srcset</code> + <code>sizes</code> so the browser downloads the right size for the screen and pixel density; <code>&lt;picture&gt;</code> for art direction or modern formats (AVIF/WebP with fallback); explicit <code>width</code>/<code>height</code> (or <code>aspect-ratio</code>) to prevent layout shift; <code>loading="lazy"</code> for below-the-fold images but <code>fetchpriority="high"</code> and no lazy loading for the LCP image; compress and serve from an image CDN.`,
  c: `<picture>
  <source type="image/avif" srcset="hero-800.avif 800w, hero-1600.avif 1600w" sizes="(min-width: 960px) 50vw, 100vw">
  <img src="hero-800.jpg" srcset="hero-800.jpg 800w, hero-1600.jpg 1600w" sizes="(min-width: 960px) 50vw, 100vw"
       width="800" height="500" alt="Dashboard preview" fetchpriority="high">
</picture>` },
  );

  sec('html').push(
{ lv: 'Easy', q: `What is the difference between script defer and async?`,
  k: `defer: download quietly and run after the page is read, in order. async: download quietly and run as soon as it arrives.`,
  a: `A plain <code>&lt;script&gt;</code> blocks HTML parsing while it downloads and runs. <b>defer</b> downloads in parallel and executes after the document is parsed, <b>in document order</b>, before <code>DOMContentLoaded</code>: best for app scripts that need the DOM. <b>async</b> downloads in parallel and executes as soon as it's ready, <b>in any order</b>, possibly before parsing finishes: best for independent scripts like analytics. <code>type="module"</code> scripts are deferred by default.`,
  c: `<script src="/app.js" defer></script>
<script src="https://analytics.example.com/a.js" async></script>
<script type="module" src="/main.js"></script>   <!-- deferred automatically -->` },
{ lv: 'Medium', q: `What are Web Components?`,
  k: `Make your own HTML tags with their own private look and behaviour that work in any framework.`,
  a: `A set of browser standards for reusable, framework-agnostic components: <b>Custom Elements</b> (define your own tag with a class extending <code>HTMLElement</code>), <b>Shadow DOM</b> (encapsulated markup and styles), and <b>HTML templates/slots</b>. Useful for design systems shared across React, Angular and plain pages, and for micro-frontends. React 19 supports custom elements fully (properties and custom events). Trade-offs: SSR and form integration are more complex, and styling across the shadow boundary needs CSS parts/custom properties.`,
  c: `class UserBadge extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })
    root.innerHTML = \`<style>span { font-weight: 700 }</style><span></span>\`
    root.querySelector('span').textContent = this.getAttribute('name')
  }
}
customElements.define('user-badge', UserBadge)
// <user-badge name="Hareesh"></user-badge>` },
  );

  sec('javascript').push(
{ lv: 'Easy', q: `What does "use strict" do in JavaScript?`,
  k: `It turns on a stricter rule book so silent mistakes become clear errors.`,
  a: `Strict mode turns some silent errors into thrown errors and removes error-prone features: assigning to undeclared variables throws (no accidental globals), <code>this</code> is <code>undefined</code> in plain function calls (not <code>window</code>), duplicate parameter names and <code>with</code> are not allowed, writing to read-only properties throws, and some reserved words are blocked. ES modules and class bodies are <b>always strict</b>, so modern React/Vite code is strict by default. Don't confuse it with React's <code>&lt;StrictMode&gt;</code>, which is a development checking tool.`,
  c: `'use strict'
function f() { count = 1 }   // ReferenceError: count is not defined (no accidental global)
function g() { return this } // g() → undefined, not window` },
{ lv: 'Easy', q: `What are the ways to loop over an array, and when do you use each?`,
  k: `Different loops for different jobs: walk through, change each, keep some, or add up.`,
  a: `<b>for</b> (index control, can break/continue, fastest in hot loops); <b>for...of</b> (clean value iteration, works with break and await); <b>forEach</b> (side effects only, can't break, doesn't wait for async callbacks); <b>map</b> (transform into a new array); <b>filter</b> (keep matching items); <b>reduce</b> (fold into one value); <b>find/findIndex/some/every</b> (search and stop early). Avoid <b>for...in</b> on arrays (iterates keys as strings, including inherited ones; meant for objects). In React render, use map with stable keys.` },
  );

  sec('coding').push(
{ lv: 'Easy', q: `Output: console.log(5 - "2", "2" * "3", 5 + "2" + "3", true + true, typeof true, typeof [1, 2, 3], typeof "hello")`,
  k: `Minus and times turn words into numbers; plus with a word glues text together.`,
  a: `Prints <b>3 6 "523" 2 "boolean" "object" "string"</b>. <code>-</code> and <code>*</code> convert strings to numbers; <code>+</code> concatenates as soon as one side is a string (evaluated left to right: 5 + "2" → "52", then "523"); booleans become 1/0 in arithmetic; arrays are objects for typeof (use <code>Array.isArray</code>).`,
  c: `console.log(1 + 2 + "3")   // "33" — numbers add first, then concatenation
console.log("1" + 2 + 3)   // "123"` },
  );
})();
