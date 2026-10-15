/* Study page: preparation modes, 14-day plan, topic guides (basic → advanced) with exercises and quiz. */
(function () {
  'use strict';
  const PLAN = [
    ['Day 1', 'JavaScript core: scope, hoisting, TDZ, closures, this', ['guide/closures', 'learn/javascript']],
    ['Day 2', 'Async JS: event loop, promises, async/await, output questions', ['guide/event-loop', 'learn/jscoding']],
    ['Day 3', 'React fundamentals: rendering, reconciliation, keys, state vs props', ['learn/basics', 'learn/reactlist']],
    ['Day 4', 'Hooks deep dive: useEffect, cleanup, stale closures, race conditions', ['guide/use-effect', 'learn/advanced']],
    ['Day 5', 'Performance: re-renders, memo, virtualization, code splitting, Web Vitals', ['guide/performance', 'learn/scenarios']],
    ['Day 6', 'React 19, Server Components, SSR/CSR/SSG, hydration', ['learn/modern']],
    ['Day 7', 'Revision day: Most asked list + cheat sheet + 1 mock interview', ['learn/top', 'cheat', 'interview']],
    ['Day 8', 'State management: Context vs Redux Toolkit vs Zustand', ['guide/zustand', 'learn/reduxnotes']],
    ['Day 9', 'Server state: TanStack Query, caching, invalidation, optimistic updates', ['guide/tanstack-query', 'learn/reactquery']],
    ['Day 10', 'REST APIs, auth, tokens, CORS, security', ['guide/rest-apis', 'learn/rest', 'learn/auth']],
    ['Day 11', 'Patterns: portals, HOCs, composition, error boundaries, forms', ['guide/portals', 'learn/reactvisual']],
    ['Day 12', 'Testing: RTL, MSW, Playwright', ['guide/playwright', 'learn/rtl', 'learn/testing']],
    ['Day 13', 'Production scenarios + frontend system design', ['learn/scenarios', 'learn/architecture']],
    ['Day 14', 'Full mock interview, review scorecard, fix weakest topics', ['interview', 'cheat']],
  ];
  const linkLabel = r => ({ cheat: 'Cheat sheet', interview: 'Voice coach' }[r] || (r.startsWith('guide/') ? 'Guide: ' + (HUB.guides.find(g => g.id === r.slice(6)) || {}).title : 'Q&A: ' + ((HUB.sections.find(s => 'learn/' + s.id === r) || { title: r === 'learn/top' ? 'Most asked' : r }).title)));

  const AREAS = ['React', 'JavaScript', 'HTML', 'CSS', 'State & data', 'APIs & security', 'Browser & performance', 'Testing'];
  const AREA_OF = { zustand: 'State & data', portals: 'React', 'use-effect': 'React', performance: 'Browser & performance', 'tanstack-query': 'State & data', 'rest-apis': 'APIs & security', closures: 'JavaScript', 'event-loop': 'JavaScript', playwright: 'Testing' };
  const areaOf = g => g.area || AREA_OF[g.id] || 'Other';
  const SEC_GUIDES = { basics: ['react-fiber', 'state-hooks', 'forms'], advanced: ['context-api', 'use-effect', 'suspense-errors', 'rendering-strategies', 'react-patterns', 'performance'], modern: ['react-19', 'rendering-strategies'], reactlist: ['react-fiber', 'react-patterns', 'rendering-strategies'], reactvisual: ['zustand', 'portals', 'react-fiber'], javascript: ['closures', 'event-loop', 'this-binding', 'prototypes-classes', 'arrays-objects', 'dom-events'], jsbehavioral: ['testing-rtl', 'react-patterns'], fedesign: ['rendering-strategies', 'performance', 'auth-frontend', 'tanstack-query'], machine: ['react-patterns', 'forms', 'dom-events', 'state-hooks'], coding: ['arrays-objects', 'closures', 'event-loop'], coding: ['arrays-objects', 'closures', 'event-loop', 'react-patterns', 'forms', 'dom-events'], html: ['html-semantics-a11y'], css: ['css-cascade-box', 'css-flex-grid', 'css-responsive'], rest: ['rest-apis'], redux: ['redux-toolkit'], rtk: ['redux-toolkit'], reduxnotes: ['redux-toolkit'], router: ['react-router'], reactquery: ['tanstack-query'], auth: ['auth-frontend'], axios: ['rest-apis', 'auth-frontend'], styled: ['css-cascade-box'], webpack: ['suspense-errors', 'browser-rendering'], testing: ['testing-rtl', 'playwright'], rtl: ['testing-rtl'], formik: ['forms'], rhf: ['forms'], storybook: ['react-patterns'], security: ['auth-frontend', 'html-semantics-a11y'], architecture: ['react-patterns', 'performance'], scenarios: ['performance', 'use-effect', 'rendering-strategies'], compare: ['state-hooks', 'context-api', 'rendering-strategies'] };
  const guideCard = (g, done, esc) => `<a class="topic" href="#/guide/${g.id}"><div class="topic-top"><strong>${esc(g.title)}</strong><span class="count">${done[g.id] ? '✓ done' : esc(g.time)}</span></div><p>${esc(g.intro)}</p></a>`;

  function study(ctx, arg) {
    const { view, esc, store } = ctx;
    const done = store.get('plan', {});
    const guideDone = store.get('guides', {});
    view.innerHTML = `<h1 class="page-title">Study</h1>
      <p class="lead">Choose how you want to prepare today. Everything works offline in your browser.</p>
      <div class="modes">
        <a class="mode" href="#/study/guides"><b>A · Learn a topic</b><span>Basic → advanced guides with examples, mistakes, exercises and a quiz.</span></a>
        <a class="mode" href="#/learn/top"><b>B · Questions and answers</b><span>Start with the Most asked list, then any topic. Filter by difficulty.</span></a>
        <a class="mode" href="#/cheat"><b>C · Quick revision</b><span>15 / 30 / 60 minute plans below, or the full cheat sheet.</span></a>
        <a class="mode" href="#/interview"><b>D · Scenario practice</b><span>Voice coach → Interview me → topic "Real-time production scenarios".</span></a>
        <a class="mode" href="#/interview"><b>E · Mock interview</b><span>Mixed questions one at a time, then a scorecard with weak topics.</span></a>
      </div>

      ${(HUB.videoRound || []).length ? `<div class="section-head"><h2>Practice round: React interview video topics</h2><span class="result-note">The ${HUB.videoRound.length} topics from the interview video you shared, in order. Answer each out loud, then open it.</span></div>
      <ol class="plan">${HUB.videoRound.map(([label, sid, pre]) => { const sx = HUB.sections.find(x => x.id === sid); const i = sx ? sx.items.findIndex(it => it.q.startsWith(pre)) : -1; return `<li><span><b>${esc(label)}</b></span><span class="plan-links">${i >= 0 ? `<a href="#/learn/${sid}?open=${sid}-${i + 1}">Open answer</a>` : '<span class="result-note">missing</span>'}</span></li>`; }).join('')}</ol>` : ''}

      ${(HUB.rounds || []).length ? `<div class="section-head"><h2>Practice rounds from real interview experiences</h2><span class="result-note">From interview experiences and lists you collected. Company names are as reported by the candidates.</span></div>
      ${HUB.rounds.map(r => `<details class="g-qa round"><summary>${esc(r.title)} <span class="result-note">${r.items.length} questions · ${esc(r.source)}</span></summary><ol class="plan">${r.items.map(([label, query, prefix]) => { let hit = null;
        if (prefix) { const sx = HUB.sections.find(x => x.id === query); const i = sx ? sx.items.findIndex(it => it.q.startsWith(prefix)) : -1; if (i >= 0) hit = { item: { q: sx.items[i].q, id: sx.id + '-' + (i + 1), sec: { id: sx.id } } }; }
        else hit = ctx.search(query)[0]; return `<li><span><b>${esc(label)}</b>${hit ? `<br><span class="result-note">${esc(hit.item.q)}</span>` : ''}</span><span class="plan-links">${hit ? `<a href="#/learn/${hit.item.sec.id}?open=${hit.item.id}">Open answer</a>` : ''}</span></li>`; }).join('')}</ol></details>`).join('')}` : ''}

      <div class="section-head"><h2>Quick revision</h2></div>
      <div class="revise">
        <a class="box" href="#/learn/top"><h3>15 minutes</h3><span>Read the Most asked list (kid line + first line of each answer).</span></a>
        <a class="box" href="#/cheat/top,scenarios"><h3>30 minutes</h3><span>Most asked + production scenarios, one line each.</span></a>
        <a class="box" href="#/cheat/top,javascript,basics,advanced,modern,reactquery,reduxnotes,rest,auth,scenarios"><h3>60 minutes</h3><span>Core JavaScript, React, state, APIs and scenarios cheat sheet.</span></a>
      </div>

      <div class="section-head" id="guides"><h2>Topic guides</h2><span class="result-note">${HUB.guides.length} hand-written guides, grouped by area</span></div>
      ${AREAS.concat('Other').map(area => { const list = HUB.guides.filter(g => areaOf(g) === area); return list.length ? `<h3 class="area-h">${esc(area)} <span class="result-note">${list.length}</span></h3><div class="topics">${list.map(g => guideCard(g, guideDone, esc)).join('')}</div>` : ''; }).join('')}

      <div class="section-head" id="topics-all"><h2>Every topic: learning pages</h2><span class="result-note">Built from each topic's own questions: basic → advanced path, examples, traps, quiz</span></div>
      <div class="topics compact">${HUB.sections.map(sx => `<a class="topic" href="#/topic/${sx.id}"><div class="topic-top"><strong>${esc(sx.short || sx.title)}</strong><span class="count">${sx.items.length} Q</span></div></a>`).join('')}</div>

      <div class="section-head"><h2>14-day plan</h2><span class="result-note">Tick days as you finish. Saved in this browser.</span></div>
      <ol class="plan">${PLAN.map(([d, text, links], i) => `<li class="${done[i] ? 'done' : ''}">
        <label><input type="checkbox" data-day="${i}" ${done[i] ? 'checked' : ''}> <b>${d}</b> ${esc(text)}</label>
        <span class="plan-links">${links.map(l => `<a href="#/${l}">${esc(linkLabel(l))}</a>`).join('')}</span></li>`).join('')}</ol>

      <div class="section-head"><h2>Sources and research notes</h2></div>
      <div class="box research">${(window.SITE.research || []).map(r => `<p><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a> <span class="result-note">${esc(r.date)} · ${esc(r.note)}</span></p>`).join('')}
        <p class="result-note">${esc(window.SITE.researchNote || '')}</p></div>`;
    view.querySelectorAll('[data-day]').forEach(cb => cb.onchange = () => {
      const d = store.get('plan', {}); d[cb.dataset.day] = cb.checked; store.set('plan', d);
      cb.closest('li').classList.toggle('done', cb.checked);
    });
    if (arg === 'guides') setTimeout(() => document.getElementById('guides').scrollIntoView(), 30);
  }

  function guide(ctx, id) {
    const { view, esc, search, toast, store } = ctx;
    const g = HUB.guides.find(x => x.id === id);
    if (!g) { view.innerHTML = '<p class="empty">Guide not found. <a href="#/study">Back to Study</a></p>'; return; }
    document.title = g.title + ' · Study';
    const related = search(g.related || g.title).slice(0, 10).map(r => r.item);
    const sec = (key, title, html) => html ? `<section class="g-sec" id="g-${key}"><h2>${title}</h2>${html}</section>` : '';
    const list = arr => `<ul>${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
    const code = c => c ? `<div class="codewrap"><pre class="code"><code>${esc(c)}</code></pre><button class="copy" type="button" data-copy>Copy</button></div>` : '';
    view.innerHTML = `<p class="crumbs"><a href="#/study/guides">Study</a> › Topic guide</p>
      <h1 class="page-title">${esc(g.title)}</h1>
      <p class="lead">${esc(g.intro)}</p>
      <p class="result-note">${esc(g.level)} · about ${esc(g.time)}</p>
      <nav class="toc" aria-label="On this page">${[['pre','Prerequisites'],['concepts','Concepts'],['mistakes','Common mistakes'],['qa','Interview Q&A'],['scenarios','Real-world scenarios'],['exercises','Coding exercises'],['followups','Follow-ups'],['summary','Revision summary'],['quiz','Quiz']].map(([k, t]) => `<a href="#g-${k}" data-jump="g-${k}">${t}</a>`).join('')}</nav>
      <div class="guide-body">
      ${sec('pre', '1. Prerequisites', list(g.prereq))}
      ${sec('concepts', '2. Concepts, basic to advanced', g.concepts.map(c => `<div class="g-step"><h3>${esc(c.h)} <span class="tag lv-${c.lv.toLowerCase()}">${esc(c.lv)}</span></h3><div>${c.html}</div>${code(c.code)}</div>`).join(''))}
      ${sec('mistakes', '3. Common mistakes', list(g.mistakes))}
      ${sec('qa', '4. Interview questions and answers', g.qa.map((x, i) => `<details class="g-qa"><summary>${i + 1}. ${esc(x.q)}</summary><div>${x.a}</div>${code(x.c)}</details>`).join('') +
        (related.length ? `<p class="result-note" style="margin-top:12px">More on this in the question bank:</p><ul class="g-related">${related.map(it => `<li><a href="#/learn/${it.sec.id}?open=${it.id}">${esc(it.q)}</a> <span class="result-note">${esc(it.sec.short)}</span></li>`).join('')}</ul>` : ''))}
      ${sec('scenarios', '5. Real-world scenarios', g.scenarios.map(s => `<div class="g-step"><h3>${esc(s.q)}</h3><div>${s.a}</div>${code(s.c)}</div>`).join(''))}
      ${sec('exercises', '6. Coding exercises', g.exercises.map((x, i) => `<div class="g-step"><h3>Exercise ${i + 1} <span class="tag lv-${x.lv.toLowerCase()}">${esc(x.lv)}</span></h3><p>${x.task}</p>
        <details><summary>Show hint</summary><p>${x.hint}</p></details>
        <details><summary>Show solution</summary>${code(x.solution)}<p>${x.explain}</p></details></div>`).join(''))}
      ${sec('followups', '7. Likely follow-up questions', g.followups.map(f => `<details class="g-qa"><summary>${esc(f.q)}</summary><div>${f.a}</div></details>`).join(''))}
      ${sec('summary', '8. Revision summary', list(g.summary))}
      ${sec('quiz', '9. Knowledge check', `<ol class="quiz">${g.quiz.map((q, i) => `<li><p>${esc(q.q)}</p>${q.options.map((o, j) => `<label><input type="radio" name="q${i}" value="${j}"> ${esc(o)}</label>`).join('')}<p class="why" hidden></p></li>`).join('')}</ol>
        <div class="hero-actions"><button class="btn primary" type="button" id="quiz-check">Check answers</button><button class="btn" type="button" id="guide-done">Mark guide as done</button></div><p class="result-note" id="quiz-score" aria-live="polite"></p>`)}
      </div>`;
    view.querySelector('#quiz-check').onclick = () => {
      let score = 0;
      g.quiz.forEach((q, i) => {
        const li = view.querySelectorAll('.quiz > li')[i];
        const picked = li.querySelector('input:checked');
        const ok = picked && Number(picked.value) === q.answer;
        if (ok) score++;
        li.classList.toggle('right', !!ok); li.classList.toggle('wrong', !ok);
        const why = li.querySelector('.why'); why.hidden = false;
        why.textContent = (ok ? 'Correct. ' : 'Answer: ' + q.options[q.answer] + '. ') + q.why;
      });
      view.querySelector('#quiz-score').textContent = `You scored ${score} of ${g.quiz.length}.` + (score === g.quiz.length ? ' Excellent!' : ' Re-read the sections for the ones you missed.');
    };
    view.querySelector('#guide-done').onclick = () => { const d = store.get('guides', {}); d[g.id] = true; store.set('guides', d); toast('Guide marked as done'); };
    view.querySelectorAll('[data-jump]').forEach(a => a.onclick = e => { e.preventDefault(); document.getElementById(a.dataset.jump).scrollIntoView({ behavior: 'smooth' }); });
    if ('IntersectionObserver' in window) {
      const links = [...view.querySelectorAll('.toc a')];
      const io = new IntersectionObserver(entries => entries.forEach(en => {
        if (en.isIntersecting) links.forEach(a => a.classList.toggle('on', a.dataset.jump === en.target.id));
      }), { rootMargin: '-140px 0px -60% 0px' });
      view.querySelectorAll('.g-sec').forEach(sec => io.observe(sec));
    }
  }

  function topic(ctx, secId) {
    const { view, esc, store } = ctx;
    const sec = HUB.sections.find(x => x.id === secId);
    if (!sec) { view.innerHTML = '<p class="empty">Topic not found. <a href="#/study/guides">Back to Study</a></p>'; return; }
    document.title = sec.title + ' · Learn';
    const items = sec.items.map((it, i) => Object.assign({ id: sec.id + '-' + (i + 1), n: i + 1 }, it));
    const hasLv = items.some(it => /^(Easy|Medium|Hard)$/.test(it.lv || ''));
    const third = Math.ceil(items.length / 3);
    const stage = (it, i) => hasLv ? ({ Easy: 0, Medium: 1, Hard: 2 }[it.lv] ?? 1) : Math.min(2, Math.floor(i / third));
    const stages = [['Foundations', 'Start here: the ideas everything else builds on.'], ['Core', 'What most interviews dig into.'], ['Advanced', 'Senior-level depth, edge cases and design.']];
    const guides = (SEC_GUIDES[sec.id] || []).map(id => HUB.guides.find(g => g.id === id)).filter(Boolean);
    const examples = items.filter(it => it.c).slice(0, 6);
    const traps = items.filter(it => it.t || it.u).slice(0, 10);
    const link = it => `#/learn/${sec.id}?open=${it.id}`;
    // auto quiz: pick the right plain-words explanation
    const pool = items.filter(it => it.k);
    const pick = pool.filter((_, i) => i % Math.max(1, Math.floor(pool.length / 8)) === 0).slice(0, 8);
    const quiz = pick.map((it, qi) => {
      const others = pool.filter(o => o !== it);
      const opts = [it.k, ...[1, 2, 3].map(j => others[(qi * 7 + j * 5) % others.length].k)].filter((v, i, a) => a.indexOf(v) === i);
      const order = opts.map((o, i) => [((qi + 3) * (i + 7)) % 11, o]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
      return { q: it.q, options: order, answer: order.indexOf(it.k) };
    });
    view.innerHTML = `<p class="crumbs"><a href="#/study/guides">Study</a> › Learning page</p>
      <h1 class="page-title">${esc(sec.title)}</h1>
      <p class="lead">${esc(sec.blurb)}</p>
      <div class="hero-actions" style="margin-top:16px"><a class="btn primary" href="#/learn/${sec.id}">Open all ${items.length} Q&amp;A</a><a class="btn" href="#/cheat/${sec.id}">Cheat sheet for this topic</a><a class="btn" href="#/interview">Practise out loud</a></div>
      ${guides.length ? `<div class="section-head"><h2>Deep guides for this topic</h2></div><div class="topics">${guides.map(g => guideCard(g, store.get('guides', {}), esc)).join('')}</div>` : ''}
      <div class="section-head"><h2>Learning path</h2><span class="result-note">Read the plain-words line, then open the full answer</span></div>
      ${stages.map(([name, note], si) => { const list = items.filter((it, i) => stage(it, i) === si); return list.length ? `<section class="g-sec"><h2>${si + 1}. ${name} <span class="result-note">${list.length} · ${note}</span></h2><ol class="path">${list.map(it => `<li><a href="${link(it)}">${esc(it.q)}</a><span>${esc(it.k)}</span></li>`).join('')}</ol></section>` : ''; }).join('')}
      ${examples.length ? `<section class="g-sec"><h2>Examples</h2>${examples.map(it => `<div class="g-step"><h3><a href="${link(it)}">${esc(it.q)}</a></h3><div class="codewrap"><pre class="code"><code>${esc(it.c)}</code></pre><button class="copy" type="button" data-copy>Copy</button></div></div>`).join('')}</section>` : ''}
      ${traps.length ? `<section class="g-sec"><h2>Traps and updates</h2><ul class="traps">${traps.map(it => `<li><a href="${link(it)}">${esc(it.q)}</a><div>${it.t || ''}${it.u ? ' <b>2026:</b> ' + it.u : ''}</div></li>`).join('')}</ul></section>` : ''}
      ${quiz.length >= 3 ? `<section class="g-sec"><h2>Knowledge check</h2><p class="result-note">Pick the plain-words explanation that matches each question.</p><ol class="quiz">${quiz.map((q, i) => `<li><p>${esc(q.q)}</p>${q.options.map((o, j) => `<label><input type="radio" name="tq${i}" value="${j}"> ${esc(o)}</label>`).join('')}<p class="why" hidden></p></li>`).join('')}</ol>
        <div class="hero-actions"><button class="btn primary" type="button" id="tq-check">Check answers</button></div><p class="result-note" id="tq-score" aria-live="polite"></p></section>` : ''}`;
    const btn = view.querySelector('#tq-check');
    if (btn) btn.onclick = () => {
      let score = 0;
      view.querySelectorAll('.quiz > li').forEach((li, i) => {
        const picked = li.querySelector('input:checked'), ok = picked && +picked.value === quiz[i].answer;
        if (ok) score++;
        li.classList.toggle('right', !!ok); li.classList.toggle('wrong', !ok);
        const why = li.querySelector('.why'); why.hidden = false; why.textContent = ok ? 'Correct.' : 'Answer: ' + quiz[i].options[quiz[i].answer];
      });
      view.querySelector('#tq-score').textContent = 'You scored ' + score + ' of ' + quiz.length + '.';
    };
  }

  window.GUIDES = { study, guide, topic };
})();
