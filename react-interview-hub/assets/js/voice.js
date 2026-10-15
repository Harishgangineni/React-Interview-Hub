/* Voice coach: Web Speech API only. No backend, no API keys. */
(function () {
  'use strict';
  const synth = window.speechSynthesis;
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canListen = !!Rec && window.isSecureContext;
  const prefs = (() => { try { return JSON.parse(localStorage.getItem('rih-voice')) || {}; } catch { return {}; } })();
  const savePrefs = () => { try { localStorage.setItem('rih-voice', JSON.stringify(prefs)); } catch { /* ignore */ } };
  prefs.rate = prefs.rate || 1; prefs.lang = prefs.lang || 'en-IN';

  let voices = [];
  function loadVoices() { voices = synth ? synth.getVoices().filter(v => /^en/i.test(v.lang)) : []; fillVoices(); }
  if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }
  function pickVoice() {
    if (prefs.voice) { const v = voices.find(x => x.name === prefs.voice); if (v) return v; }
    return voices.find(v => v.lang === prefs.lang) || voices.find(v => /en-(IN|GB|US)/.test(v.lang)) || voices[0];
  }

  function speak(text, opts = {}) {
    if (!synth) return;
    synth.cancel();
    // Chrome cuts off long utterances: speak in sentence-sized chunks
    const parts = String(text).replace(/\s+/g, ' ').match(/[^.!?]+[.!?]*/g) || [text];
    const chunks = [];
    let buf = '';
    for (const p of parts) { if ((buf + p).length > 220) { if (buf) chunks.push(buf); buf = p; } else buf += p; }
    if (buf) chunks.push(buf);
    chunks.forEach((c, i) => {
      const u = new SpeechSynthesisUtterance(c.trim());
      const v = pickVoice(); if (v) u.voice = v;
      u.lang = (v && v.lang) || prefs.lang;
      u.rate = (opts.kid ? 0.92 : 1) * prefs.rate;
      u.pitch = opts.kid ? 1.15 : 1;
      if (i === chunks.length - 1 && opts.onend) u.onend = opts.onend;
      synth.speak(u);
    });
  }
  function stop() { if (synth) synth.cancel(); if (rec) { try { rec.abort(); } catch { /* ignore */ } } setListening(false); }
  function itemSpeech(it, mode) {
    const sen = it.plainA + (it.c ? ' There is a code example on screen.' : '') + (it.m ? ' Remember: ' + it.m + '.' : '') + (it.t ? ' Tip: ' + strip(it.t) : '');
    if (mode === 'kid') return { text: it.k, kid: true };
    if (mode === 'senior') return { text: sen };
    return { text: 'Simple version. ' + it.k + ' Senior version. ' + sen };
  }
  function speakItem(it, mode) { const s = itemSpeech(it, mode); speak(it.q + '. ' + s.text, { kid: s.kid }); }
  function strip(h) { const d = document.createElement('div'); d.innerHTML = h; return d.textContent; }

  // ---------- Speech recognition ----------
  let rec = null, listening = false, onFinal = null, onInterim = null, keep = '';
  function setListening(on) {
    listening = on;
    const b = document.getElementById('mic'); if (!b) return;
    b.classList.toggle('listening', on);
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', on ? 'Stop listening' : 'Start listening');
    setStatus(on ? 'Listening… speak now. Press the mic again to stop.' : '');
  }
  function listen({ continuous, final, interim }) {
    if (!canListen) return;
    if (synth) synth.cancel();
    rec = new Rec();
    rec.lang = prefs.lang; rec.interimResults = true; rec.continuous = !!continuous;
    keep = ''; onFinal = final; onInterim = interim;
    rec.onresult = e => {
      let fin = '', tmp = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]; if (r.isFinal) fin += r[0].transcript; else tmp += r[0].transcript;
      }
      if (fin) keep += (keep ? ' ' : '') + fin.trim();
      onInterim && onInterim((keep + ' ' + tmp).trim());
      if (!continuous && fin) { onFinal && onFinal(keep); }
    };
    rec.onerror = e => {
      const msg = { 'not-allowed': 'Microphone permission was blocked. Allow it in the address bar, then try again.',
        'no-speech': 'I did not hear anything. Press the mic and speak.', network: 'Speech recognition needs an internet connection in this browser.' }[e.error] || 'Speech error: ' + e.error;
      setStatus(msg); setListening(false);
    };
    rec.onend = () => { const was = listening; setListening(false); if (continuous && was && keep && onFinal) onFinal(keep); };
    rec.start(); setListening(true);
  }
  function stopListening() { if (rec && listening) rec.stop(); }

  // ---------- UI ----------
  let ctx = null, tab = 'ask', current = null;
  const session = [];   // mock interview results for the scorecard
  function setStatus(t) { const s = document.getElementById('status'); if (s) s.textContent = t; }
  function fillVoices() {
    const sel = document.getElementById('v-voice'); if (!sel) return;
    sel.innerHTML = '<option value="">Automatic</option>' + voices.map(v => `<option ${v.name === prefs.voice ? 'selected' : ''}>${v.name}</option>`).join('');
  }
  const ICON = () => window.HUB_ICON;

  function view(sections, ageSwitchHtml) {
    return `<h1 class="page-title">Voice coach</h1>
    <p class="lead">Ask any React question out loud and hear the answer, or let the coach interview you and check your answer against the key points.</p>
    <div class="toolbar">${ageSwitchHtml}</div>
    <div class="coach">
      <div class="coach-main">
        <div class="tabs" role="tablist" aria-label="Coach mode">
          <button role="tab" type="button" id="tab-ask" aria-selected="${tab === 'ask'}">Ask a question</button>
          <button role="tab" type="button" id="tab-int" aria-selected="${tab === 'int'}">Interview me</button>
        </div>
        ${canListen ? '' : `<div class="warnbox">${!Rec ? 'This browser has no speech recognition. Use Chrome or Edge for the microphone; typing and read-aloud work everywhere.' : 'The microphone needs a secure page. Open the site through http://localhost (see README) or https. Typing and read-aloud still work.'}</div>`}
        <div id="coach-body"></div>
      </div>
      <aside class="coach-side">
        <div class="box">
          <h3>Voice settings</h3>
          <label>Speaking voice<select id="v-voice"></select></label>
          <label>Speed <input id="v-rate" type="range" min="0.7" max="1.4" step="0.05" value="${prefs.rate}"></label>
          <label>Your accent (for listening)<select id="v-lang">
            ${[['en-IN', 'English (India)'], ['en-US', 'English (US)'], ['en-GB', 'English (UK)']].map(([v, l]) => `<option value="${v}" ${prefs.lang === v ? 'selected' : ''}>${l}</option>`).join('')}
          </select></label>
          <button class="btn small" type="button" id="v-test">Test voice</button>
        </div>
        <div class="box">
          <h3>Things you can say</h3>
          <div class="result-note">"What is the difference between useMemo and useCallback?"<br>"Explain staleTime"<br>"Repeat" · "Next question" · "Stop"</div>
        </div>
      </aside>
    </div>`;
  }

  function mount(c) {
    ctx = c;
    fillVoices();
    document.getElementById('v-voice').onchange = e => { prefs.voice = e.target.value; savePrefs(); };
    document.getElementById('v-rate').oninput = e => { prefs.rate = +e.target.value; savePrefs(); };
    document.getElementById('v-lang').onchange = e => { prefs.lang = e.target.value; savePrefs(); };
    document.getElementById('v-test').onclick = () => speak('Hi Hareesh. Ready when you are. Ask me anything about React.');
    document.getElementById('tab-ask').onclick = () => { tab = 'ask'; stop(); mount(ctx); };
    document.getElementById('tab-int').onclick = () => { tab = 'int'; stop(); mount(ctx); };
    document.getElementById('tab-ask').setAttribute('aria-selected', String(tab === 'ask'));
    document.getElementById('tab-int').setAttribute('aria-selected', String(tab === 'int'));
    tab === 'ask' ? mountAsk() : mountInterview();
  }

  function micRow(label) {
    return `<div class="mic-row">
      <button class="mic" id="mic" type="button" aria-pressed="false" aria-label="Start listening" ${canListen ? '' : 'disabled'}>${ICON().mic}</button>
      <div class="status" id="status" aria-live="polite">${canListen ? label : ''}</div>
    </div>`;
  }

  // ----- Ask mode -----
  function mountAsk() {
    const body = document.getElementById('coach-body');
    body.innerHTML = `${micRow('Press the mic and ask a question.')}
      <form class="ask-row" id="ask-form"><label class="sr-only" for="ask-in">Type a question</label>
        <input id="ask-in" placeholder="Or type: what is hydration?" autocomplete="off"><button class="btn primary" type="submit">Ask</button></form>
      <div class="chat" id="chat" aria-live="polite"></div>`;
    document.getElementById('ask-form').onsubmit = e => { e.preventDefault(); const v = document.getElementById('ask-in').value.trim(); if (v) { ask(v); document.getElementById('ask-in').value = ''; } };
    const mic = document.getElementById('mic');
    mic.onclick = () => listening ? stopListening() : listen({ continuous: false, interim: t => setStatus('"' + t + '"'), final: t => { stopListening(); ask(t); } });
    if (!document.getElementById('chat').children.length) bot(`<p>Hi ${ctx.esc(window.SITE.owner.split(' ')[0])}, ask me anything from the ${ctx.all.length} questions. Switch the level to 5 for the simple version or 35 for the senior one.</p>`);
  }
  function me(text) { const c = document.getElementById('chat'); c.insertAdjacentHTML('beforeend', `<div class="bubble me">${ctx.esc(text)}</div>`); }
  function bot(html) { const c = document.getElementById('chat'); c.insertAdjacentHTML('beforeend', `<div class="bubble bot">${html}</div>`); c.lastElementChild.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  function ask(text) {
    me(text);
    const t = text.toLowerCase().trim();
    if (/^(stop|quiet|be quiet)\b/.test(t)) { stop(); bot('<p>Stopped.</p>'); return; }
    if (/^(repeat|again|say (it|that) again)\b/.test(t) && current) { answer(current, true); return; }
    if (/(interview|quiz) me/.test(t)) { tab = 'int'; mount(ctx); return; }
    const res = ctx.search(text);
    if (!res.length || res[0].score < 6) {
      bot(`<p>I couldn't find a close match. Try different words, or pick one of these:</p>${suggest(res.slice(0, 3))}`);
      speak("I couldn't find a close match. Try different words.");
      return;
    }
    current = res[0].item;
    answer(current, false, res.slice(1, 4));
  }
  function suggest(rows) {
    return rows.length ? `<div class="terms">${rows.map(r => `<button class="chip" type="button" data-ask="${r.item.id}">${ctx.esc(r.item.q)}</button>`).join('')}</div>` : '';
  }
  function answer(it, repeat, others = []) {
    const m = ctx.mode();
    bot(`<p><b>${ctx.esc(it.q)}</b></p>${ctx.itemBody(it)}
      <div class="src">${ctx.esc(it.sec.title)} · <a href="#/learn/${it.sec.id}?open=${it.id}">Open in Learn</a></div>
      ${!repeat && others.length ? '<p class="src">Related:</p>' + suggest(others.map(o => o)) : ''}`);
    const s = itemSpeech(it, m);
    speak(it.q + '. ' + s.text, { kid: s.kid });
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-ask]'); if (!b || !ctx) return;
    const it = ctx.all.find(x => x.id === b.dataset.ask); if (it) { current = it; me(it.q); answer(it, false); }
  });

  // ----- Interview mode -----
  function mountInterview() {
    const body = document.getElementById('coach-body');
    body.innerHTML = `<div class="toolbar" style="margin:0">
        <label class="sr-only" for="int-sec">Topic</label>
        <select id="int-sec"><option value="">All topics</option>${ctx.sections.map(s => `<option value="${s.id}" ${s.id === (prefs.intSec || '') ? 'selected' : ''}>${ctx.esc(s.title)}</option>`).join('')}</select>
        <label style="display:flex;gap:6px;align-items:center;font-size:15px"><input type="checkbox" id="int-rev" ${prefs.intRev ? 'checked' : ''}> Only my revise pile</label>
        <button class="btn primary" type="button" id="int-next">Ask me a question</button>
        <button class="btn" type="button" id="int-score" ${session.length ? '' : 'hidden'}>Finish and see scorecard (${session.length})</button>
      </div>
      <p class="result-note">Mock interview: leave "All topics" selected for a mixed interview, or pick "Real-time production scenarios" for scenario practice. Answer, check, then press Next. Finish to get a scorecard.</p>
      <div id="int-q"></div>`;
    document.getElementById('int-sec').onchange = e => { prefs.intSec = e.target.value; savePrefs(); };
    document.getElementById('int-rev').onchange = e => { prefs.intRev = e.target.checked; savePrefs(); };
    document.getElementById('int-next').onclick = nextQuestion;
    document.getElementById('int-score').onclick = scorecard;
  }
  function scorecard() {
    if (!session.length) return;
    const avg = Math.round(session.reduce((t, r) => t + r.pct, 0) / session.length);
    const byTopic = {};
    session.forEach(r => { (byTopic[r.secId] ??= { title: r.sec, scores: [] }).scores.push(r.pct) });
    const topics = Object.entries(byTopic).map(([id, v]) => ({ id, title: v.title, avg: Math.round(v.scores.reduce((a, b) => a + b, 0) / v.scores.length), n: v.scores.length })).sort((a, b) => a.avg - b.avg);
    const missFreq = {}; session.forEach(r => r.miss.forEach(m => { missFreq[m] = (missFreq[m] || 0) + 1 }));
    const missed = Object.entries(missFreq).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([m]) => m);
    const strengths = topics.filter(t => t.avg >= 70), weak = topics.filter(t => t.avg < 50);
    document.getElementById('int-q').innerHTML = `<div class="box">
      <h3>Scorecard</h3>
      <div class="score"><b>${avg}%</b><span>average key-term coverage over ${session.length} answer${session.length > 1 ? 's' : ''}</span></div>
      <table class="sc-table"><thead><tr><th>Topic</th><th>Questions</th><th>Average</th></tr></thead><tbody>
        ${topics.map(t => `<tr><td>${ctx.esc(t.title)}</td><td>${t.n}</td><td>${t.avg}%</td></tr>`).join('')}</tbody></table>
      <p><b>Strengths:</b> ${strengths.length ? strengths.map(t => ctx.esc(t.title)).join(', ') : 'keep practising to build some'}</p>
      <p><b>Weak areas:</b> ${weak.length ? weak.map(t => ctx.esc(t.title)).join(', ') : 'none below 50%'}</p>
      ${missed.length ? `<p><b>Terms you often missed:</b></p><div class="terms">${missed.map(m => `<span class="term miss">${ctx.esc(m)}</span>`).join('')}</div>` : ''}
      <p><b>Improvement plan:</b></p><ol>${(weak.length ? weak : topics.slice(0, 3)).map(t => `<li>Revise <a href="#/learn/${t.id}">${ctx.esc(t.title)}</a> (re-read the senior answers, then flashcards)</li>`).join('')}<li>Do one more mixed mock tomorrow and compare.</li></ol>
      <p class="result-note">Scores are based on key terms, a rough guide to completeness, not a judge of your explanation. Communication, structure and trade-offs matter too: practise saying answers out loud.</p>
      <button class="btn" type="button" id="sc-reset">Start a new session</button></div>`;
    document.getElementById('sc-reset').onclick = () => { session.length = 0; mountInterview() };
    speak('Your average was ' + avg + ' percent across ' + session.length + ' questions.' + (weak.length ? ' Focus next on ' + weak.map(t => t.title).join(' and ') + '.' : ''));
  }
  function nextQuestion() {
    const sid = prefs.intSec, rev = prefs.intRev, p = ctx.progress();
    let pool = ctx.all.filter(it => (!sid || it.sec.id === sid) && (!rev || p[it.id] === 'revise'));
    if (!pool.length) { document.getElementById('int-q').innerHTML = '<div class="empty">No questions in this pile. Untick "Only my revise pile" or pick another topic.</div>'; return; }
    current = pool[Math.floor(Math.random() * pool.length)];
    const box = document.getElementById('int-q');
    box.innerHTML = `<div class="flash" style="min-height:0">
        <div class="meta"><span>${ctx.esc(current.sec.title)}</span><span>Question ${current.n}</span></div>
        <div class="fq">${ctx.esc(current.q)}</div>
      </div>
      ${micRow('Press the mic and answer out loud. Press again when you finish.')}
      <div class="ask-row"><label class="sr-only" for="int-ans">Your answer</label><textarea id="int-ans" placeholder="Your answer appears here as you speak. You can also type."></textarea></div>
      <div class="hero-actions"><button class="btn primary" type="button" id="int-check">Check my answer</button>
        <button class="btn" type="button" id="int-skip">Show answer</button>
        <button class="btn" type="button" id="int-repeat">${ICON().speaker} Repeat question</button></div>
      <div id="int-result" aria-live="polite"></div>`;
    const ta = document.getElementById('int-ans');
    document.getElementById('mic').onclick = () => listening ? stopListening() :
      listen({ continuous: true, interim: t => { ta.value = t; }, final: t => { ta.value = t; setStatus('Got it. Press Check my answer.'); } });
    document.getElementById('int-check').onclick = () => { stopListening(); grade(ta.value); };
    document.getElementById('int-skip').onclick = () => { stopListening(); grade(''); };
    document.getElementById('int-repeat').onclick = () => speak(current.q);
    speak('Question. ' + current.q);
  }

  const STOP = new Set(('about above after again against also although always among another because been before being below between both cannot could does doing during each either every first from further have having here into itself just like made make many more most much must never only other over same should since some such than that their them then there these they thing things this those through under until upon used uses using very want well were what when where which while will with within without would your yours instead return returns value values component components react state props function functions often usually prefer default called means example everything').split(' '));
  function keyTerms(it) {
    const terms = new Map();
    const add = (t, w) => { t = t.trim().replace(/[()]+$/, '').replace(/^[.<]+|[.>]+$/g, ''); if (t.length < 3 || t.length > 28) return; const k = t.toLowerCase(); terms.set(k, Math.max(terms.get(k) || 0, w)); };
    (it.a.match(/<code>(.*?)<\/code>/g) || []).forEach(m => add(strip(m.replace(/<\/?code>/g, '')).split(/[ (=]/)[0], 3));
    (it.a.match(/<b>(.*?)<\/b>/g) || []).forEach(m => add(strip(m.replace(/<\/?b>/g, '')), 3));
    const CODESKIP = new Set(['const', 'function', 'return', 'await', 'async', 'import', 'export', 'default', 'from', 'true', 'false', 'null', 'then', 'catch', 'console', 'document', 'window']);
    ((it.c || '').match(/\.?([A-Za-z_][A-Za-z0-9_]{3,})\s*\(/g) || []).forEach(m => {
      const name = m.replace(/[.(\s]/g, ''); if (!CODESKIP.has(name)) add(name, 2);
    });
    const words = it.plainA.toLowerCase().match(/[a-z][a-z0-9-]{4,}/g) || [];
    const freq = {}; words.forEach(w => { if (!STOP.has(w)) freq[w] = (freq[w] || 0) + 1; });
    Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([w, n]) => add(w, n > 1 ? 2 : 1));
    return [...terms.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t]) => t);
  }
  function covers(ans, term) {
    const a = ans.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const t = term.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
    if (!t) return false;
    if (a.includes(t)) return true;
    const spaced = t.replace(/([a-z])([A-Z])/g, '$1 $2');
    if (a.includes(spaced)) return true;
    const stem = t.length > 6 ? t.slice(0, Math.max(5, t.length - 3)) : t;
    return a.split(/\s+/).some(w => w.startsWith(stem));
  }
  function grade(ans) {
    const terms = keyTerms(current);
    const hit = terms.filter(t => covers(ans, t)), miss = terms.filter(t => !covers(ans, t));
    const pct = terms.length ? Math.round(hit.length / terms.length * 100) : 0;
    const verdict = !ans.trim() ? 'Here is the model answer.' : pct >= 70 ? 'Strong answer.' : pct >= 40 ? 'Good start. Add the missing points.' : 'Review this one and try again.';
    if (ans.trim()) {
      session.push({ secId: current.sec.id, sec: current.sec.title, pct, miss });
      const sb = document.getElementById('int-score'); if (sb) { sb.hidden = false; sb.textContent = 'Finish and see scorecard (' + session.length + ')'; }
    }
    const res = document.getElementById('int-result');
    res.innerHTML = `<div class="box" style="margin-top:6px">
        ${ans.trim() ? `<div class="score"><b>${pct}%</b><span>${verdict} You covered ${hit.length} of ${terms.length} key terms.</span></div>
        <div class="terms">${hit.map(t => `<span class="term hit">${ctx.esc(t)}</span>`).join('')}${miss.map(t => `<span class="term miss">${ctx.esc(t)}</span>`).join('')}</div>
        <p class="result-note">Green: you said it. Red: worth adding. Key-term matching is a rough guide, not a judge.</p>` : ''}
        ${ctx.itemBody(current)}
        <div class="hero-actions">
          <button class="btn revise" type="button" id="int-rev-btn">${ICON().flag} Revise again</button>
          <button class="btn known" type="button" id="int-known-btn">${ICON().check} I know this</button>
          <button class="btn primary" type="button" id="int-next2">Next question</button>
        </div></div>`;
    document.getElementById('int-rev-btn').onclick = () => { ctx.setProgress(current.id, 'revise'); window.HUB_TOAST('Added to revise pile'); };
    document.getElementById('int-known-btn').onclick = () => { ctx.setProgress(current.id, 'known'); window.HUB_TOAST('Marked as known'); };
    document.getElementById('int-next2').onclick = nextQuestion;
    const s = itemSpeech(current, ctx.mode());
    const fb = ans.trim() ? `You scored ${pct} percent. ${miss.length ? 'You could add: ' + miss.slice(0, 4).join(', ') + '. ' : ''}` : '';
    speak(fb + 'Model answer. ' + s.text, { kid: s.kid });
  }

  window.VOICE = { speak, speakItem, stop, view, mount };
})();
