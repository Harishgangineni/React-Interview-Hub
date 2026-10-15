# React Interview Hub — Hareesh Gangineni

1,324 interview questions (React, JavaScript, JS coding and output questions, DSA, authentication, HTML, CSS, TypeScript including a 210-question easy-to-hard set, Redux with your notes and 2026 trends, testing and more), each answered twice: once for a 5-year-old, once at senior level.
Includes your portfolio (About me), a Study page with 30 hand-written topic guides (basic → advanced, examples, real-world usage, exercises, quiz) plus an auto-built learning page for every one of the 31 topics, 19 production scenarios, a Most asked list, a 14-day plan, flashcards, a printable cheat sheet and a voice coach with a mock-interview scorecard.

Ways to prepare (Study page):
- A · Learn a topic: 30 guides grouped by area
  - React: Fiber & reconciliation, CSR/SSR/SSG/ISR & Server Components, state hooks, Context API, useEffect, patterns (HOC, render props, compound), Suspense & error boundaries, React 19, forms, React Router, Portals
  - JavaScript: closures & scope, event loop & async, this/call/apply/bind, prototypes & classes, arrays/objects/immutability, DOM & events
  - HTML: semantics, forms, accessibility & SEO
  - CSS: cascade/specificity/box model/stacking, Flexbox & Grid, responsive design
  - State & data: Zustand, TanStack Query, Redux Toolkit & RTK Query
  - APIs & security: REST APIs, authentication (JWT, refresh, OAuth)
  - Browser & performance: rendering pipeline & Core Web Vitals, React performance
  - Testing: React Testing Library + MSW, Playwright
  Every Q&A topic also has a learning page (#/topic/<id>) and a "Study this topic" button.
- B · Questions and answers: Q&A → ★ Most asked, or any topic; filter by Easy/Medium/Hard
- C · Quick revision: 15 / 30 / 60 minute cheat-sheet plans (#/cheat/top,scenarios etc.)
- D · Scenario practice: Voice coach → Interview me → "Real-time production scenarios"
- Practice round (Study page): the 12 topics from the React interview video, in order, each linking to its answer
- Frontend system design and LLD: 27 questions (sidebar, animated tabs, data table, like button, live chat, rate-limited button, order tracker, restaurant page, real-time notifications, micro-frontends, SOLID, security, monitoring, flash-sale and payment flows, SSO, service workers, gRPC)
- Practice rounds (Study page): 24 rounds from interview experiences and lists you collected (machine coding 20, DSA 15, Infosys, Flipkart, React/JS rounds, 17-question set, security/JWT/timers), 105 questions each linked to its answer
- Machine coding: 14 components (carousel, truncated pagination, colour boxes, nested comments, progress bar, config-driven form, e-commerce filters, tic-tac-toe, toast system, poll, memory game, multi-select dropdown, product CRUD, vanilla JS cart)
- Behavioral: 13 project and soft-skill questions with honest answer frameworks built from your resume ([brackets] = fill in your own details)
- E · Mock interview: Voice coach → Interview me → All topics, then "Finish and see scorecard" Plain HTML, CSS and JavaScript: no backend, no build step, no API keys.

## Run it on your PC

Any of these works. Use one so the microphone is allowed (browsers only allow the mic on `localhost` or `https`).

```bash
# Option 1: Node (any version 18+)
npx serve .

# Option 2: Python (comes with most computers)
python -m http.server 8080
# then open http://localhost:8080
```

Port tip: 3306 is MySQL's default port. If you also run MySQL, serve this site on another port (8080 or 5173) to avoid conflicts.

You can also double-click `index.html`. Everything works that way except voice input (read-aloud still works).

**Voice input:** use Chrome or Edge. Allow the microphone when asked. Firefox has no speech recognition, so type instead.

## Personalise

Edit `assets/js/config.js`. Your portfolio details (role, experience, projects, skills, education) were filled in from your resume:

- `showPhone`: set to `true` to show your phone number and a WhatsApp button publicly (off by default for privacy)
- `links`: uncomment and add GitHub and LinkedIn
- `jobs`, `skills`, `summary`: update when your resume changes
- Photo: replace `assets/img/hareesh.jpg` and `hareesh-small.jpg` (square images work best)

## Add or edit questions

Each topic is one file in `data/`. A question looks like this:

```js
{ q: `The question`,
  k: `Explanation for a 5-year-old`,
  a: `Senior answer. Simple HTML allowed: <b>, <code>, <ul><li>`,
  c: `optional code example`,
  t: `optional interview tip`,
  u: `optional "2026 update" note`,
  m: `optional memory line, shown as Remember`,
  lv: `optional label: Easy, Medium or Hard (filterable), or any short tag` },
```

Write text inside backticks. If your code contains a backtick or `${`, escape it as \` and \${.
To add a new topic, create a file that calls `HUB.add({ id, title, short, blurb, items: [...] })`, add a `<script>` line for it in `index.html` before `assets/js/voice.js`, and add its id to the `ORDER` list at the top of `assets/js/app.js` to choose where it appears.

## Keyboard shortcuts

- **Ctrl K** (Cmd K on Mac): search everything (questions, guides, topics, pages)
- **/** on a Q&A page: jump to the search box
- Flashcards: **Space** flip, **← →** move, **K** known, **R** revise

## Add a topic guide

Copy a block from `data/guides-a.js` and call `HUB.guide({ id, title, intro, level, time, prereq, concepts, mistakes, qa, scenarios, exercises, followups, summary, quiz, related })`. It appears on the Study page automatically. Add the file to `index.html` before `assets/js/guides.js`.

## Host it later

It's a static site, so upload the whole folder as it is.

- **Netlify:** drag the folder onto app.netlify.com/drop.
- **GitHub Pages:** push to a repo, then Settings → Pages → deploy from branch, root folder.
- **Vercel:** `npx vercel` in this folder.
- **Your own server (nginx):** copy the folder to the web root. No rewrite rules are needed because the site uses `#/` links.

Use HTTPS on the server so the microphone works for visitors.

## Folder map

```
index.html                 page shell
assets/css/style.css       all styles (light and dark)
assets/js/config.js        your name, role, links
assets/js/app.js           pages, search, progress, flashcards, cheat sheet
assets/js/voice.js         voice coach (Web Speech API)
data/*.js                  the 1,113 questions (one file per topic) and guides-*.js (topic guides)
assets/js/guides.js        Study page, 14-day plan and guide pages
assets/img/                your photo
```

## Where data is stored

Your known and revise marks, level choice, theme and voice settings are kept in the browser's localStorage on your device. Nothing is sent anywhere. The browser's own speech recognition service may process your voice (Chrome sends audio to Google for transcription).

Question sources: github.com/w3flow/React-Interview-Questions-and-Answers (questions only; answers written for this hub) and your own PDFs (JavaScript notes, JS interview Q&A, JS coding questions, DSA top 30, Authentication handbook, React/HTML/CSS lists). DSA solutions are in JavaScript. TypeScript questions follow the TypeScript Interview Q&A list by @coding.artist, with answers written for this hub. Updated October 2026.
