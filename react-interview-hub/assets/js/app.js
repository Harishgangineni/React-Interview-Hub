/* React Interview Hub — app logic (no build step, no backend) */
(function () {
  'use strict';
  const S = window.SITE;
  const ORDER = ['scenarios', 'behavioral', 'basics', 'advanced', 'modern', 'reactlist', 'reactvisual', 'javascript', 'jscoding', 'coding', 'machine', 'fedesign', 'dsa', 'html', 'css', 'rest', 'git', 'typescript', 'tsdeep', 'redux', 'rtk', 'reduxnotes', 'router', 'reactquery', 'auth', 'compare', 'axios', 'styled', 'webpack', 'testing', 'rtl', 'formik', 'rhf', 'storybook', 'security', 'architecture'];
  const rank = id => { const i = ORDER.indexOf(id); return i === -1 ? 999 : i; };
  const SECTIONS = window.HUB.sections.slice().sort((a, b) => rank(a.id) - rank(b.id));
  const $ = (sel, root = document) => root.querySelector(sel);
  const view = $('#view');

  // ---------- Flatten data ----------
  const ALL = [];
  SECTIONS.forEach(sec => sec.items.forEach((it, i) => {
    const item = Object.assign({}, it, { id: sec.id + '-' + (i + 1), n: i + 1, sec });
    item.plainA = stripHtml(it.a);
    item.hay = (it.q + ' ' + item.plainA + ' ' + it.k + ' ' + (it.t || '') + ' ' + (it.u || '') + ' ' + sec.title).toLowerCase();
    ALL.push(item);
  }));
  const BY_ID = Object.fromEntries(ALL.map(x => [x.id, x]));
  const TOP_SEC = { id: 'top', title: 'Most asked: start here', short: 'Most asked', blurb: 'The questions that come up again and again in 2026 React interviews (see Study → Sources). Revise these first.' };
  const TOP = (window.HUB.top || []).map(([sid, pre]) => ALL.find(x => x.sec.id === sid && x.q.startsWith(pre))).filter(Boolean);
  window.HUB_ALL = ALL;

  function stripHtml(html) {
    const d = document.createElement('div');
    d.innerHTML = String(html || '').replace(/<li>/g, ' • ').replace(/<\/(p|li|ul|ol)>/g, '. ');
    return d.textContent.replace(/\s+/g, ' ').replace(/(\.\s*){2,}/g, '. ').trim();
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  // ---------- Persistent prefs and progress ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('rih-' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('rih-' + k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };
  let progress = store.get('progress', {});
  let mode = store.get('mode', 'both');
  const setProgress = (id, val) => {
    if (progress[id] === val) delete progress[id]; else progress[id] = val;
    store.set('progress', progress);
  };
  const countSec = (sec, val) => sec.items.reduce((n, _, i) => n + (progress[sec.id + '-' + (i + 1)] === val ? 1 : 0), 0);
  const countAll = val => Object.values(progress).filter(v => v === val).length;

  // ---------- Mode (5 / both / 35) ----------
  function applyMode(m) {
    mode = m; store.set('mode', m); document.body.dataset.mode = m;
    document.querySelectorAll('.age button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
    document.querySelectorAll('.age').forEach(a => { a.dataset.active = m; a.style.setProperty('--i', { kid: 0, both: 1, senior: 2 }[m]); });
    const demo = $('#demo-body'); if (demo) renderDemo();
  }
  function ageSwitch(big) {
    return `<div class="age ${big ? 'big' : ''}" role="group" aria-label="Explanation level">
      <button type="button" data-mode="kid" aria-pressed="false"><b>5</b><small>like I'm five</small></button>
      <button type="button" data-mode="both" aria-pressed="false"><b>5+35</b><small>both</small></button>
      <button type="button" data-mode="senior" aria-pressed="false"><b>35</b><small>senior</small></button>
    </div>`;
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('.age button');
    if (b) applyMode(b.dataset.mode);
  });

  // ---------- Theme ----------
  const themeBtn = $('#theme-btn');
  function applyTheme(t) {
    if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
    store.set('theme', t || null);
  }
  applyTheme(store.get('theme', null));
  themeBtn.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme === 'dark' ||
      (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
    applyTheme(dark ? 'light' : 'dark');
  });

  // ---------- Search ----------
  const STOP = new Set('a an the is are what how do you does in of to for and or with use using when should vs versus between difference react can i me my it its this that be on by from as which why your'.split(' '));
  function tokens(s) { return String(s).toLowerCase().replace(/[^a-z0-9.#+\s-]/g, ' ').split(/\s+/).filter(w => w && !STOP.has(w)); }
  function search(query, pool = ALL) {
    const qt = tokens(query);
    if (!qt.length) return pool.map(item => ({ item, score: 0 }));
    const res = [];
    for (const item of pool) {
      const q = item.q.toLowerCase();
      let score = 0, hits = 0;
      for (const t of qt) {
        let hit = false;
        if (q.includes(t)) { score += 4; hit = true; }
        if (item.hay.includes(t)) { score += 1; hit = true; }
        if (item.sec.title.toLowerCase().includes(t)) score += 1;
        if (hit) hits++;
      }
      if (hits) { score += (hits / qt.length) * 6; if (q.includes(query.toLowerCase().trim())) score += 8; res.push({ item, score }); }
    }
    return res.sort((a, b) => b.score - a.score);
  }
  window.HUB_SEARCH = search;

  // ---------- Router ----------
  const routes = { '': home, learn, cards, interview, cheat, about, study: arg => window.GUIDES.study(GCTX(), arg), guide: id => window.GUIDES.guide(GCTX(), id), topic: id => window.GUIDES.topic(GCTX(), id) };
  const GCTX = () => ({ view, esc, store, toast, search, itemBody });
  function route() {
    const [, name = '', arg = ''] = (location.hash || '#/').match(/^#\/?([^/?]*)\/?([^?]*)/) || [];
    const fn = routes[name] || home;
    document.body.dataset.route = name || 'home';
    document.querySelectorAll('.nav a').forEach(a => {
      const r = a.getAttribute('href').replace('#/', '');
      if (r === (name === 'guide' || name === 'topic' ? 'study' : name)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (window.VOICE) window.VOICE.stop();
    fn(decodeURIComponent(arg));
    applyMode(mode);
    view.classList.remove('enter'); void view.offsetWidth; view.classList.add('enter');
    window.scrollTo(0, 0);
    const h = view.querySelector('h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }
  window.addEventListener('hashchange', route);

  // ---------- Views ----------
  function home() {
    document.title = S.owner + ' · React interview hub';
    const known = countAll('known');
    view.innerHTML = `
      <section class="hero">
        <div>
          <h1>React interviews, <span class="two">explained twice.</span></h1>
          <p>${ALL.length.toLocaleString('en-IN')} questions, each answered two ways: one a five-year-old understands, and one a senior interviewer expects. Pick your level, then read, flip cards, or practise out loud with the voice coach.</p>
          <div class="hero-actions">
            <a class="btn primary" href="#/learn">Start learning</a>
            <a class="btn" href="#/study">Study by topic</a>
            <a class="btn" href="#/interview">${ICON.mic} Interview me by voice</a>
          </div>
          <div class="stats">
            <div class="stat"><b data-count="${ALL.length}">${ALL.length.toLocaleString('en-IN')}</b><span>questions</span></div>
            <div class="stat"><b data-count="${(window.HUB.guides || []).length}">${(window.HUB.guides || []).length}</b><span>topic guides</span></div>
            <div class="stat"><b data-count="${known}">${known}</b><span>marked known</span></div>
            <div class="stat"><b data-count="${countAll('revise')}">${countAll('revise')}</b><span>to revise</span></div>
          </div>
        </div>
        <div class="demo" aria-live="polite">
          <div class="demo-label">Explain it like I'm…</div>
          ${ageSwitch(true)}
          <div id="demo-body"></div>
        </div>
      </section>
      ${(() => { const last = store.get('last', null); const ls = last && (last === 'top' ? TOP_SEC : SECTIONS.find(x => x.id === last)); return ls ? `<a class="continue" href="#/learn/${ls.id}"><span style="flex:1"><b>Continue where you left off</b><br><span>${esc(ls.title)}</span></span>${ICON.chevron}</a>` : ''; })()}
      <a class="pf-strip" href="#/about">
        <img src="${esc(S.photoSmall)}" alt="" width="64" height="64">
        <span><b>Hi, I'm ${esc(S.owner.split(' ')[0])}.</b> ${esc(S.role)} with ${esc(S.experience)} in React, Redux and JavaScript. See my experience and projects.</span>
      </a>
      <div class="section-head"><h2>Topics</h2><span class="demo-label">Progress shows questions you marked as known.</span></div>
      <div class="topics">${SECTIONS.map(sec => {
        const k = countSec(sec, 'known');
        return `<a class="topic" href="#/learn/${sec.id}">
          <div class="topic-top"><strong>${esc(sec.title)}</strong><span class="count">${k}/${sec.items.length}</span></div>
          <p>${esc(sec.blurb)}</p>
          <div class="bar" aria-hidden="true"><i style="width:${(k / sec.items.length) * 100}%"></i></div>
        </a>`;
      }).join('')}</div>`;
    renderDemo();
    countUp();
  }
  function countUp() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    view.querySelectorAll('[data-count]').forEach(el => {
      const end = +el.dataset.count, t0 = performance.now(), dur = 900;
      const step = now => { const p = Math.min(1, (now - t0) / dur); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('en-IN'); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }
  function renderDemo() {
    const el = $('#demo-body'); if (!el) return;
    const it = ALL.find(x => x.sec.id === 'basics') || ALL[0];
    el.innerHTML = `<div class="demo-q">${esc(it.q)}</div>` + answerPanels(it);
  }

  function answerPanels(it) {
    return `<div class="pair">
      <div class="panel p-kid"><h4>${ICON.crayon} Like I'm 5</h4><div class="ktext">${esc(it.k)}</div></div>
      <div class="panel p-sen"><h4>${ICON.brief} ${it.sc ? 'Interview-ready answer' : 'Senior answer'}</h4><div>${it.a}</div></div>
    </div>`;
  }

  let learnState = { q: '', filter: 'all' };
  function learn(secId) {
    const sec = secId === 'top' ? TOP_SEC : SECTIONS.find(s => s.id === secId);
    if (sec) store.set('last', sec.id);
    document.title = (sec ? sec.title + ' · ' : '') + 'Learn · ' + S.owner;
    view.innerHTML = `
      <div class="learn">
        <nav class="side" aria-label="Topics">
          <h2>Topics</h2>
          <ul>
            <li><a href="#/learn/top" ${sec === TOP_SEC ? 'aria-current="true"' : ''}><span>★ Most asked</span><span>${TOP.length}</span></a></li>
            <li><a href="#/learn" ${!sec ? 'aria-current="true"' : ''}><span>All topics</span><span>${ALL.length.toLocaleString('en-IN')}</span></a></li>
            ${SECTIONS.map(s => `<li><a href="#/learn/${s.id}" ${sec === s ? 'aria-current="true"' : ''}><span>${esc(s.short || s.title)}</span><span>${countSec(s, 'known')}/${s.items.length}</span></a></li>`).join('')}
          </ul>
        </nav>
        <div>
          <div class="title-row"><h1 class="page-title">${sec ? esc(sec.title) : 'All questions'}</h1>${sec && sec !== TOP_SEC ? `<a class="btn small" href="#/topic/${sec.id}">Study this topic</a>` : ''}</div>
          <p class="lead">${sec ? esc(sec.blurb) : 'Search everything, or pick a topic. Press / to jump to search.'}</p>
          <div class="toolbar">
            <div class="search">${ICON.search}<label class="sr-only" for="q">Search questions</label>
              <input id="q" type="search" placeholder="Search, e.g. useEffect cleanup, staleTime, Redux thunk" value="${esc(learnState.q)}" autocomplete="off"></div>
            ${ageSwitch(false)}
          </div>
          <div class="toolbar" style="margin-top:0">
            <div class="chips" role="group" aria-label="Filter">
              ${[['all', 'All'], ['revise', 'To revise'], ['known', 'Known'], ['new', 'Not marked'], ['updates', '2026 updates'], ['Easy', 'Easy'], ['Medium', 'Medium'], ['Hard', 'Hard']].map(([v, l]) =>
                `<button class="chip" type="button" data-filter="${v}" aria-pressed="${learnState.filter === v}">${l}</button>`).join('')}
            </div>
            <button class="btn small" type="button" id="expand-all">Expand all</button>
          </div>
          <p class="result-note" id="result-note" aria-live="polite"></p>
          <div class="qlist" id="qlist"></div>
        </div>
      </div>`;
    const pool = sec === TOP_SEC ? TOP : sec ? ALL.filter(x => x.sec === sec) : ALL;
    const input = $('#q');
    const draw = () => {
      let rows = search(learnState.q, pool).map(r => r.item);
      if (!learnState.q) rows = pool.slice();
      const f = learnState.filter;
      rows = rows.filter(it => f === 'all' ? true : f === 'updates' ? !!it.u : /^(Easy|Medium|Hard)$/.test(f) ? it.lv === f : f === 'new' ? !progress[it.id] : progress[it.id] === f);
      $('#result-note').textContent = rows.length + (rows.length === 1 ? ' question' : ' questions') + (learnState.q ? ` matching "${learnState.q}"` : '');
      $('#qlist').innerHTML = rows.length ? rows.map(it => qItem(it, !sec || sec === TOP_SEC)).join('') :
        `<div class="empty">No questions match. Clear the search or choose "All".</div>`;
    };
    let t; input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { learnState.q = input.value; draw(); }, 120); });
    view.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => {
      learnState.filter = b.dataset.filter;
      view.querySelectorAll('[data-filter]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      draw();
    }));
    $('#expand-all').addEventListener('click', e => {
      const open = e.currentTarget.textContent === 'Expand all';
      view.querySelectorAll('.qi').forEach(q => toggleItem(q, open));
      e.currentTarget.textContent = open ? 'Collapse all' : 'Expand all';
    });
    draw();
    const hashOpen = new URLSearchParams(location.hash.split('?')[1] || '').get('open');
    if (hashOpen) { const el = document.getElementById('qi-' + hashOpen); if (el) { toggleItem(el, true); setTimeout(() => el.scrollIntoView({ block: 'start' }), 50); } }
  }

  function qItem(it, showSec) {
    const p = progress[it.id];
    return `<article class="qi ${p || ''}" id="qi-${it.id}" data-id="${it.id}">
      <div class="qhead">
        <button class="qbtn" type="button" aria-expanded="false" aria-controls="qb-${it.id}">
          <span class="qnum">${showSec ? esc(it.sec.short) + ' ' : ''}${showSec || !/^[A-Z]?\d+\.\s/.test(it.q) ? it.n : ''}</span>
          <span class="qtext">${esc(it.q)}${(it.u || it.lv) ? `<span class="qtags">${it.lv ? `<span class="tag lv-${it.lv.toLowerCase()}">${esc(it.lv)}</span>` : ''}${it.u ? '<span class="tag">2026 update</span>' : ''}</span>` : ''}</span>
        </button>
        <div class="qactions">
          <button class="mini" type="button" data-act="speak" aria-label="Read answer aloud" title="Read aloud">${ICON.speaker}</button>
          <button class="mini k-revise" type="button" data-act="revise" aria-pressed="${p === 'revise'}" aria-label="Mark to revise" title="Revise later">${ICON.flag}</button>
          <button class="mini k-known" type="button" data-act="known" aria-pressed="${p === 'known'}" aria-label="Mark as known" title="I know this">${ICON.check}</button>
        </div>
      </div>
      <div class="qbody" id="qb-${it.id}" hidden></div>
    </article>`;
  }
  function scenarioBody(it) {
    const x = it.sc, li = a => '<ul>' + a.map(v => '<li>' + esc(v) + '</li>').join('') + '</ul>', ol = a => '<ol>' + a.map(v => '<li>' + esc(v) + '</li>').join('') + '</ol>';
    return `<div class="scn">
      <p class="src-tag">${esc(it.src || '')}</p>
      <div><h5>Production context and symptoms</h5><p>${esc(x.ctx)}</p></div>
      <div><h5>Possible root causes</h5>${li(x.causes)}</div>
      <div><h5>Systematic debugging approach</h5>${ol(x.debug)}</div>
      <div><h5>Recommended solution</h5><p>${esc(x.fix)}</p></div>
      ${x.code ? `<div class="codewrap"><pre class="code"><code>${esc(x.code)}</code></pre><button class="copy" type="button" data-copy>Copy</button></div>` : ''}
      <div><h5>Alternatives and trade-offs</h5><p>${esc(x.alt)}</p></div>
      <div><h5>Prevention, testing and monitoring</h5><p>${esc(x.prevent)}</p></div>
      <div><h5>Likely follow-up questions</h5>${li(x.follow)}</div>
    </div>`;
  }
  function itemBody(it) {
    return answerPanels(it) +
      (it.c ? `<div class="codewrap"><pre class="code"><code>${esc(it.c)}</code></pre><button class="copy" type="button" data-copy>Copy</button></div>` : '') +
      (it.m ? `<div class="note mem"><b>Remember</b>${esc(it.m)}</div>` : '') +
      (it.t ? `<div class="note tip"><b>Interview tip</b>${it.t}</div>` : '') +
      (it.u ? `<div class="note upd"><b>2026 update</b>${it.u}</div>` : '') +
      (it.sc ? scenarioBody(it) : '');
  }
  function toggleItem(article, force) {
    const btn = article.querySelector('.qbtn'); const body = article.querySelector('.qbody');
    const open = force !== undefined ? force : btn.getAttribute('aria-expanded') !== 'true';
    if (open && !body.innerHTML) body.innerHTML = itemBody(BY_ID[article.dataset.id]);
    btn.setAttribute('aria-expanded', String(open)); body.hidden = !open;
  }
  view.addEventListener('click', e => {
    const qb = e.target.closest('.qbtn'); if (qb) { toggleItem(qb.closest('.qi')); return; }
    const act = e.target.closest('[data-act]');
    if (act) {
      const art = act.closest('.qi'); const it = BY_ID[art.dataset.id];
      if (act.dataset.act === 'speak') { window.VOICE && window.VOICE.speakItem(it, mode); toggleItem(art, true); return; }
      setProgress(it.id, act.dataset.act);
      art.className = 'qi ' + (progress[it.id] || '');
      art.querySelectorAll('[data-act="known"],[data-act="revise"]').forEach(b => b.setAttribute('aria-pressed', String(progress[it.id] === b.dataset.act)));
      return;
    }
    const cp = e.target.closest('[data-copy]');
    if (cp) {
      const text = cp.previousElementSibling.textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => { cp.textContent = 'Copied ✓'; cp.classList.add('done'); setTimeout(() => { cp.textContent = 'Copy'; cp.classList.remove('done'); }, 1500); }, () => toast('Select the code and copy it manually'));
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { const q = $('#q'); if (q) { e.preventDefault(); q.focus(); } }
  });

  // ---------- Flashcards ----------
  let deck = [], deckPos = 0, flipped = false;
  function cards() {
    document.title = 'Flashcards · ' + S.owner;
    view.innerHTML = `<div class="cards-wrap">
      <h1 class="page-title">Flashcards</h1>
      <p class="lead">Read the question, answer in your head (or out loud), then flip. Mark it so the revise pile gets smaller.</p>
      <div class="card-controls">
        <label class="sr-only" for="deck-sec">Topic</label>
        <select id="deck-sec"><option value="">All topics</option>${SECTIONS.map(s => `<option value="${s.id}">${esc(s.title)}</option>`).join('')}</select>
        <label class="sr-only" for="deck-filter">Which cards</label>
        <select id="deck-filter"><option value="all">All cards</option><option value="revise">To revise</option><option value="new">Not marked yet</option><option value="known">Known</option></select>
        <button class="btn small" type="button" id="shuffle">Shuffle</button>
        ${ageSwitch(false)}
      </div>
      <div id="flash"></div>
      <div class="card-nav">
        <button class="btn" type="button" id="prev">Previous</button>
        <button class="btn primary" type="button" id="flip">Show answer</button>
        <button class="btn revise" type="button" id="m-revise">${ICON.flag} Revise again</button>
        <button class="btn known" type="button" id="m-known">${ICON.check} I know this</button>
        <button class="btn" type="button" id="say">${ICON.speaker} Read aloud</button>
        <button class="btn" type="button" id="next">Next</button>
      </div>
      <p class="result-note" style="text-align:center;margin-top:14px">Keys: Space flips, arrows move, K known, R revise.</p>
    </div>`;
    const build = (shuffle) => {
      const sid = $('#deck-sec').value, f = $('#deck-filter').value;
      deck = ALL.filter(it => (!sid || it.sec.id === sid) && (f === 'all' || (f === 'new' ? !progress[it.id] : progress[it.id] === f)));
      if (shuffle) for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
      deckPos = 0; flipped = false; drawCard();
    };
    $('#deck-sec').onchange = () => build(false);
    $('#deck-filter').onchange = () => build(false);
    $('#shuffle').onclick = () => build(true);
    $('#flip').onclick = () => turn(() => { flipped = !flipped; });
    $('#next').onclick = () => move(1);
    $('#prev').onclick = () => move(-1);
    $('#m-known').onclick = () => markCard('known');
    $('#m-revise').onclick = () => markCard('revise');
    $('#say').onclick = () => { const it = deck[deckPos]; if (it && window.VOICE) flipped ? window.VOICE.speakItem(it, mode) : window.VOICE.speak(it.q); };
    build(false);
  }
  function turn(change) {
    const card = $('#flash .flash');
    if (!card || matchMedia('(prefers-reduced-motion: reduce)').matches) { change(); drawCard(); return; }
    card.classList.add('turning');
    setTimeout(() => { change(); drawCard(); const c = $('#flash .flash'); if (c) { c.classList.add('turning'); requestAnimationFrame(() => requestAnimationFrame(() => c.classList.remove('turning'))); } }, 200);
  }
  function move(d) { if (!deck.length) return; turn(() => { deckPos = (deckPos + d + deck.length) % deck.length; flipped = false; }); }
  function markCard(v) { const it = deck[deckPos]; if (!it) return; progress[it.id] = v; store.set('progress', progress); toast(v === 'known' ? 'Marked as known' : 'Added to revise pile'); move(1); }
  function drawCard() {
    const el = $('#flash'); if (!el) return;
    const it = deck[deckPos];
    if (!it) { el.innerHTML = `<div class="flash"><div class="empty">No cards here. Pick another topic or "All cards".</div></div>`; return; }
    el.innerHTML = `<div class="flash-progress" aria-hidden="true"><i style="width:${((deckPos + 1) / deck.length) * 100}%"></i></div><div class="flash ${flipped ? 'back' : ''}" aria-live="polite">
      <div class="meta"><span>${esc(it.sec.title)}</span><span>${deckPos + 1} / ${deck.length}${progress[it.id] ? ' · ' + (progress[it.id] === 'known' ? 'known' : 'to revise') : ''}</span></div>
      <div class="fq">${esc(it.q)}</div>
      ${flipped ? itemBody(it) : '<div class="hint">Think of your answer, then press Show answer.</div>'}
    </div>`;
    $('#flip').textContent = flipped ? 'Hide answer' : 'Show answer';
  }
  document.addEventListener('keydown', e => {
    if (!$('#flash') || /input|textarea|select/i.test(document.activeElement.tagName)) return;
    if (e.key === ' ') { e.preventDefault(); turn(() => { flipped = !flipped; }); }
    else if (e.key === 'ArrowRight') move(1);
    else if (e.key === 'ArrowLeft') move(-1);
    else if (e.key.toLowerCase() === 'k') markCard('known');
    else if (e.key.toLowerCase() === 'r') markCard('revise');
  });

  // ---------- Voice coach view (logic in voice.js) ----------
  function interview() {
    document.title = 'Voice coach · ' + S.owner;
    view.innerHTML = window.VOICE ? window.VOICE.view(SECTIONS, ageSwitch(false)) : '<p>Voice module failed to load.</p>';
    window.VOICE && window.VOICE.mount({ search, mode: () => mode, sections: SECTIONS, all: ALL, progress: () => progress, setProgress: (id, v) => { progress[id] = v; store.set('progress', progress); }, esc, itemBody });
  }

  // ---------- Cheat sheet ----------
  function cheat(arg) {
    document.title = 'Cheat sheet · ' + S.owner;
    const first = s => { const m = s.match(/^(.{20,220}?[.!?])(\s|$)/); return m ? m[1] : s.slice(0, 220); };
    view.innerHTML = `<h1 class="page-title">Cheat sheet</h1>
      <p class="lead">Every question in one line each. Read it the night before. Use the level switch to show the kid line, the senior line, or both, then print.</p>
      <div class="toolbar no-print">${ageSwitch(false)}<button class="btn small" type="button" onclick="window.print()">Print or save as PDF</button></div>
      ${arg ? `<p class="result-note no-print">Showing: ${esc(arg.split(',').map(id => (id === 'top' ? TOP_SEC : SECTIONS.find(s => s.id === id) || {}).short || id).join(', '))} · <a href="#/cheat">show all topics</a></p>` : ''}
      ${(arg ? arg.split(',').map(id => id === 'top' ? Object.assign({}, TOP_SEC, { items: TOP }) : SECTIONS.find(s => s.id === id)).filter(Boolean) : SECTIONS).map(sec => `<section class="cheat-sec"><h2>${esc(sec.title)}</h2>
        ${sec.items.map((it, i) => `<div class="cheat-row"><div class="cq">${i + 1}. ${esc(it.q)}</div><div class="ck">${esc(it.k)}</div><div class="cs">${it.m ? '<b>' + esc(it.m) + '</b> ' : ''}${esc(first(stripHtml(it.a)))}</div></div>`).join('')}
      </section>`).join('')}`;
  }

  // ---------- About / portfolio ----------
  function about() {
    document.title = S.owner + ' · ' + S.role;
    const contact = [
      S.email ? `<a class="btn small primary" href="mailto:${esc(S.email)}">${esc(S.email)}</a>` : '',
      S.showPhone && S.phone ? `<a class="btn small" href="tel:${esc(S.phone.replace(/[^+\d]/g, ''))}">${esc(S.phone)}</a>
        <a class="btn small" href="https://wa.me/${esc(S.phone.replace(/\D/g, ''))}" target="_blank" rel="noopener">WhatsApp</a>` : '',
      ...S.links.filter(l => !l.url.startsWith('mailto:')).map(l => `<a class="btn small" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`),
    ].join('');
    view.innerHTML = `
      <section class="pf-hero">
        <img class="pf-photo" src="${esc(S.photo)}" alt="Portrait of ${esc(S.owner)}" width="360" height="360">
        <div>
          <h1 class="pf-name">${esc(S.owner)}</h1>
          <p class="pf-role">${esc(S.role)} · ${esc(S.experience)} · ${esc(S.location)}</p>
          ${S.summary.map(p => `<p class="pf-sum">${esc(p)}</p>`).join('')}
          <div class="links">${contact}</div>
        </div>
      </section>

      <section class="pf-block">
        <h2>Skills</h2>
        <div class="pf-skills">${S.skills.map(g => `<div><h3>${esc(g.group)}</h3><div class="terms">${g.items.map(i => `<span class="skill">${esc(i)}</span>`).join('')}</div></div>`).join('')}</div>
      </section>

      <section class="pf-block">
        <h2>Experience</h2>
        <ol class="timeline">${S.jobs.map(j => `<li>
          <div class="tl-head"><h3>${esc(j.role)}, ${esc(j.company)}</h3><span class="tl-date">${esc(j.period)}</span></div>
          ${j.projects.map(pr => `<div class="proj">
            <h4>${pr.url ? `<a href="${esc(pr.url)}" target="_blank" rel="noopener">${esc(pr.name)}</a>` : esc(pr.name)}${pr.period ? ` <span class="tl-date">${esc(pr.period)}</span>` : ''}</h4>
            <p>${esc(pr.text)}</p>
            <ul>${pr.points.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
            <div class="terms">${pr.tech.map(t => `<span class="skill small">${esc(t)}</span>`).join('')}</div>
          </div>`).join('')}
        </li>`).join('')}</ol>
      </section>

      <section class="pf-block pf-two">
        <div>
          <h2>Education</h2>
          <ul class="edu">${S.education.map(e => `<li><b>${esc(e.title)}</b><span>${esc(e.place)}</span></li>`).join('')}</ul>
        </div>
        <div>
          <h2>This interview hub</h2>
          <p>${esc(S.about)}</p>
          <ul class="how">
            <li><b>${ALL.length} questions, answered twice</b>A simple version to get the idea, then the senior version an interviewer listens for.</li>
            <li><b>Built from my own notes</b>JavaScript, coding and output questions, DSA, authentication, HTML, CSS and my React list, plus the w3flow React question bank.</li>
            <li><b>Voice coach</b>Ask out loud or get interviewed, with key-term scoring, all in the browser.</li>
          </ul>
          <div class="hero-actions" style="margin-top:14px"><a class="btn primary" href="#/learn">Open the hub</a><a class="btn" href="#/interview">Try the voice coach</a></div>
        </div>
      </section>

      <section class="pf-block">
        <div class="box">
          <h3>Sources</h3>
          ${S.sources.map(s => `<a href="${esc(s.url)}" ${s.url.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${esc(s.label)}</a>`).join('')}
          <p class="result-note">Answers written for this hub and updated ${esc(S.updated)}. Progress is saved only in this browser.</p>
          <button class="btn small" type="button" id="reset-progress" style="justify-self:start">Reset my progress</button>
        </div>
      </section>`;
    $('#reset-progress').onclick = () => { if (confirm('Clear all known and revise marks on this device?')) { progress = {}; store.set('progress', progress); toast('Progress cleared'); } };
  }

  // ---------- Toast ----------
  let toastT;
  function toast(msg) {
    let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 1800);
  }
  window.HUB_TOAST = toast;

  // ---------- Icons ----------
  const svg = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const ICON = {
    mic: svg('<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/>'),
    speaker: svg('<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>'),
    check: svg('<path d="M20 6 9 17l-5-5"/>'),
    flag: svg('<path d="M4 22V4M4 4h13l-2 4 2 4H4"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
    crayon: svg('<path d="m14 4 6 6-10 10H4v-6z"/><path d="m12 6 6 6"/>'),
    chevron: svg('<path d="m9 18 6-6-6-6"/>'),
    brief: svg('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>'),
  };
  window.HUB_ICON = ICON;

  // ---------- Header shadow on scroll ----------
  addEventListener('scroll', () => document.body.classList.toggle('scrolled', scrollY > 8), { passive: true });

  // ---------- Command palette (Ctrl/Cmd + K) ----------
  function palette() {
    if ($('.palette-bg')) return;
    const prev = document.activeElement;
    const bg = document.createElement('div');
    bg.className = 'palette-bg';
    bg.innerHTML = `<div class="palette" role="dialog" aria-modal="true" aria-label="Search everything">
      <input type="search" placeholder="Search questions, guides and topics…" aria-label="Search" autocomplete="off">
      <ul role="listbox"></ul>
      <div class="pal-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div></div>`;
    document.body.appendChild(bg);
    const input = bg.querySelector('input'), list = bg.querySelector('ul');
    let items = [], sel = 0;
    const pages = [['Study and topic guides', '#/study'], ['Most asked questions', '#/learn/top'], ['Flashcards', '#/cards'], ['Voice coach and mock interview', '#/interview'], ['Cheat sheet', '#/cheat'], ['About me', '#/about']];
    const draw = () => {
      const q = input.value.trim().toLowerCase();
      const guides = (window.HUB.guides || []).filter(g => !q || (g.title + ' ' + g.intro).toLowerCase().includes(q)).map(g => ({ label: g.title, sub: 'Topic guide', href: '#/guide/' + g.id }));
      const secs = SECTIONS.filter(s => q && s.title.toLowerCase().includes(q)).map(s => ({ label: s.title, sub: s.items.length + ' questions', href: '#/learn/' + s.id }));
      const qs = q ? search(q).slice(0, 12).map(r => ({ label: r.item.q, sub: r.item.sec.title, href: '#/learn/' + r.item.sec.id + '?open=' + r.item.id })) : [];
      const pg = pages.filter(([l]) => !q || l.toLowerCase().includes(q)).map(([l, h]) => ({ label: l, sub: 'Page', href: h }));
      items = (q ? [...guides.slice(0, 4), ...secs.slice(0, 3), ...qs, ...pg] : [...pg, ...guides]).slice(0, 20);
      sel = 0;
      list.innerHTML = items.length ? items.map((it, i) => `<li><a href="${it.href}" role="option" aria-selected="${i === 0}">${esc(it.label)}<small>${esc(it.sub)}</small></a></li>`).join('') : '<li class="result-note" style="padding:14px">No results. Try other words.</li>';
    };
    const mark = () => list.querySelectorAll('a').forEach((a, i) => { a.setAttribute('aria-selected', String(i === sel)); if (i === sel) a.scrollIntoView({ block: 'nearest' }); });
    const close = () => { bg.remove(); prev && prev.focus && prev.focus(); };
    input.addEventListener('input', draw);
    bg.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(items.length - 1, sel + 1); mark(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); mark(); }
      else if (e.key === 'Enter' && items[sel]) { e.preventDefault(); location.hash = items[sel].href; close(); }
    });
    bg.addEventListener('click', e => { if (e.target === bg) close(); else if (e.target.closest('a')) setTimeout(close, 0); });
    draw(); input.focus();
  }
  $('#pal-btn').addEventListener('click', palette);
  document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette(); } });

  // ---------- Boot ----------
  $('#owner-name').textContent = S.owner;
  $('#owner-initials').textContent = S.initials;
  $('#foot-owner').textContent = '© ' + new Date().getFullYear() + ' ' + S.owner;
  $('#fab').innerHTML = ICON.mic;
  route();
})();
