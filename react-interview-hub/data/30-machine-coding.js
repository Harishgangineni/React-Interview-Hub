/* Machine coding: components from commonly shared frontend machine-coding lists (LinkedIn posts the user pasted). Solutions written for this hub. */
(function () {
  const M = (lv, q, k, a, c, t) => ({ lv, q, k, a, c, t });
  HUB.add({
    id: 'machine', title: 'Machine coding: build these components', short: 'Machine coding',
    blurb: 'The components interviewers ask you to build live. Talk through requirements and state first, build the simplest working version, then add accessibility, edge cases and polish. Todo, tabs, accordion, pagination, infinite scroll, star rating and autocomplete are in "Coding round".',
    items: [
M('Medium', `Build a carousel / image slider (with system-design notes).`,
  `A picture frame that shows one photo at a time, with arrows and dots to move.`,
  `<b>State:</b> current index. <b>Features:</b> previous/next with wrap-around, dots, optional autoplay that pauses on hover/focus and respects reduced motion, keyboard arrows, swipe on touch. <b>Design notes:</b> lazy-load images except the first, reserve height to avoid layout shift, <code>aria-roledescription="carousel"</code> and live region for slide changes, infinite loop by cloning or modulo index, CSS <code>transform: translateX</code> for smooth GPU-friendly movement.`,
  `function Carousel({ slides, interval = 4000 }) {
  const [i, setI] = useState(0), [paused, setPaused] = useState(false)
  const go = d => setI(x => (x + d + slides.length) % slides.length)
  useEffect(() => {
    if (paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => go(1), interval)
    return () => clearInterval(id)
  }, [paused, interval, slides.length])
  return <section aria-roledescription="carousel" aria-label="Featured" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
    onKeyDown={e => { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1) }}>
    <div style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', transform: \`translateX(-\${i * 100}%)\`, transition: 'transform .4s' }}>
        {slides.map((s, n) => <img key={s.src} src={s.src} alt={s.alt} loading={n === 0 ? 'eager' : 'lazy'} style={{ flex: '0 0 100%' }} />)}
      </div>
    </div>
    <button onClick={() => go(-1)} aria-label="Previous slide">‹</button>
    <button onClick={() => go(1)} aria-label="Next slide">›</button>
    <div>{slides.map((_, n) => <button key={n} aria-label={'Go to slide ' + (n + 1)} aria-current={n === i} onClick={() => setI(n)}>•</button>)}</div>
    <p className="sr-only" aria-live="polite">Slide {i + 1} of {slides.length}</p>
  </section>
}`),
M('Medium', `Build truncated pagination (1 … 4 5 6 … 20).`,
  `Show the first page, the last page and the pages near you, with dots for the gaps.`,
  `Write a pure function that returns the page list with ellipsis markers, then render it. Keep first, last, current ± siblings; insert '…' where pages are skipped.`,
  `function pageRange(current, total, siblings = 1) {
  const pages = new Set([1, total])
  for (let p = current - siblings; p <= current + siblings; p++) if (p > 1 && p < total) pages.add(p)
  const sorted = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b)
  const out = []
  sorted.forEach((p, i) => { if (i && p - sorted[i - 1] > 1) out.push('…'); out.push(p) })
  return out
}
// pageRange(5, 20) → [1, '…', 4, 5, 6, '…', 20]
function Pagination({ page, total, onChange }) {
  return <nav aria-label="Pagination">
    <button disabled={page === 1} onClick={() => onChange(page - 1)}>Prev</button>
    {pageRange(page, total).map((p, i) => p === '…' ? <span key={'e' + i}>…</span>
      : <button key={p} aria-current={p === page ? 'page' : undefined} onClick={() => onChange(p)}>{p}</button>)}
    <button disabled={page === total} onClick={() => onChange(page + 1)}>Next</button>
  </nav>
}`),
M('Medium', `Build configurable colour boxes (click to colour; when all are coloured, they reset in click order).`,
  `Tap boxes to colour them; when every box is coloured, they turn back one by one in the order you tapped.`,
  `Typical spec: a grid from a config (e.g. a 2D array of 1/0 for which cells exist). Clicking colours a box and records order; when all are selected, deselect in the same order with a delay, disabling clicks meanwhile. Clean up timers on unmount.`,
  `const CONFIG = [[1, 1, 1], [1, 0, 0], [1, 1, 1]]
function ColorBoxes({ config = CONFIG, delay = 300 }) {
  const cells = config.flat().map((v, i) => (v ? i : null)).filter(i => i !== null)
  const [order, setOrder] = useState([]), [resetting, setResetting] = useState(false)
  useEffect(() => {
    if (order.length !== cells.length || !cells.length) return
    setResetting(true)
    const id = setInterval(() => setOrder(o => { const next = o.slice(1); if (!next.length) { clearInterval(id); setResetting(false) } return next }), delay)
    return () => clearInterval(id)
  }, [order.length === cells.length])
  return <div style={{ display: 'grid', gridTemplateColumns: \`repeat(\${config[0].length}, 60px)\`, gap: 8 }}>
    {config.flat().map((v, i) => v ? <button key={i} aria-label={'Box ' + (i + 1)} disabled={resetting || order.includes(i)}
      onClick={() => setOrder(o => [...o, i])} style={{ height: 60, background: order.includes(i) ? 'seagreen' : 'white' }} /> : <span key={i} />)}
  </div>
}`),
M('Hard', `Build posts with nested comments (reply to any comment, any depth).`,
  `Comments can have replies, and replies can have replies, like a family tree.`,
  `Store comments flat with <code>parentId</code> (normalized; easy to add/delete), build the tree when rendering, and render recursively. Each comment can reply, collapse its thread and delete. For deep threads, limit indentation and add "continue thread".`,
  `function Comments({ initial = [] }) {
  const [list, setList] = useState(initial)   // [{ id, parentId, text }]
  const add = (parentId, text) => setList(l => [...l, { id: crypto.randomUUID(), parentId, text }])
  const childrenOf = id => list.filter(c => c.parentId === id)
  return <><ReplyBox onSubmit={t => add(null, t)} /><Thread items={childrenOf(null)} childrenOf={childrenOf} add={add} /></>
}
function Thread({ items, childrenOf, add }) {
  return <ul>{items.map(c => <CommentNode key={c.id} c={c} childrenOf={childrenOf} add={add} />)}</ul>
}
function CommentNode({ c, childrenOf, add }) {
  const [replying, setReplying] = useState(false)
  const kids = childrenOf(c.id)
  return <li>
    <p>{c.text}</p><button onClick={() => setReplying(r => !r)}>Reply</button>
    {replying && <ReplyBox onSubmit={t => { add(c.id, t); setReplying(false) }} />}
    {kids.length > 0 && <Thread items={kids} childrenOf={childrenOf} add={add} />}
  </li>
}
function ReplyBox({ onSubmit }) {
  const [t, setT] = useState('')
  return <form onSubmit={e => { e.preventDefault(); if (t.trim()) { onSubmit(t.trim()); setT('') } }}>
    <input value={t} onChange={e => setT(e.target.value)} aria-label="Write a comment" /><button>Post</button>
  </form>
}`,
  `Mention: flat storage + parentId makes updates O(1)-ish and avoids deep immutable updates; build a children map with useMemo for large threads.`),
M('Easy', `Build a progress bar component (and a timed/animated one).`,
  `A bar that fills up to show how much is done.`,
  `Clamp the value 0–100, use <code>role="progressbar"</code> with aria-valuenow/min/max, animate width with CSS transition (or transform: scaleX). A timed bar increments in an effect and cleans up; for several bars started in sequence, queue them.`,
  `function ProgressBar({ value, label = 'Progress' }) {
  const v = Math.min(100, Math.max(0, value))
  return <div role="progressbar" aria-label={label} aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}
    style={{ height: 10, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden' }}>
    <div style={{ height: '100%', width: v + '%', background: '#0e7c9b', transition: 'width .3s' }} />
  </div>
}
function TimedProgress({ duration = 3000 }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const start = performance.now(); let raf
    const tick = now => { const p = Math.min(100, ((now - start) / duration) * 100); setV(p); if (p < 100) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration])
  return <ProgressBar value={v} />
}`),
M('Hard', `Build a config-driven form (system design).`,
  `Describe the form in a list, and one engine draws and checks every field.`,
  `Define fields as data (name, type, label, validation rules, options, conditional visibility); a renderer maps type → component; a single state object holds values; validators run from rules; conditional fields use a <code>showIf</code> function. Benefits: forms built by config (even from the server), consistent UX and validation. Production: React Hook Form + zod schema generated from config, field registry for custom types, accessibility per field.`,
  `const schema = [
  { name: 'name', label: 'Full name', type: 'text', rules: { required: true, minLength: 2 } },
  { name: 'role', label: 'Role', type: 'select', options: ['Developer', 'Manager'], rules: { required: true } },
  { name: 'team', label: 'Team size', type: 'number', showIf: v => v.role === 'Manager', rules: { min: 1 } },
]
function validate(field, value) {
  const r = field.rules || {}
  if (r.required && !value) return field.label + ' is required'
  if (r.minLength && String(value).length < r.minLength) return \`At least \${r.minLength} characters\`
  if (r.min != null && value !== '' && Number(value) < r.min) return 'Must be at least ' + r.min
  return ''
}
function ConfigForm({ fields = schema, onSubmit }) {
  const [values, setValues] = useState({}), [errors, setErrors] = useState({})
  const visible = fields.filter(f => !f.showIf || f.showIf(values))
  function submit(e) {
    e.preventDefault()
    const errs = Object.fromEntries(visible.map(f => [f.name, validate(f, values[f.name] ?? '')]).filter(([, m]) => m))
    setErrors(errs); if (!Object.keys(errs).length) onSubmit(values)
  }
  return <form onSubmit={submit} noValidate>
    {visible.map(f => <div key={f.name}>
      <label htmlFor={f.name}>{f.label}</label>
      {f.type === 'select'
        ? <select id={f.name} value={values[f.name] ?? ''} onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))}><option value="">Choose…</option>{f.options.map(o => <option key={o}>{o}</option>)}</select>
        : <input id={f.name} type={f.type} value={values[f.name] ?? ''} onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))} aria-invalid={!!errors[f.name]} />}
      {errors[f.name] && <p role="alert">{errors[f.name]}</p>}
    </div>)}
    <button>Submit</button>
  </form>
}`),
M('Medium', `Build e-commerce filters (category, price range, rating, search, sort).`,
  `Pick "shoes", "under ₹2000" and "4 stars and up", and only matching products stay.`,
  `Keep filter state in the URL (shareable, back button works); derive the visible list with useMemo (compose predicates, then sort); debounce search; show counts and a "clear all"; for big catalogs filter on the server and send filters as query params.`,
  `function useFilteredProducts(products, f) {
  return useMemo(() => {
    const q = f.search.trim().toLowerCase()
    return products
      .filter(p => (!f.categories.length || f.categories.includes(p.category))
        && p.price >= f.minPrice && p.price <= f.maxPrice
        && p.rating >= f.minRating
        && (!q || p.name.toLowerCase().includes(q)))
      .toSorted((a, b) => f.sort === 'price-asc' ? a.price - b.price : f.sort === 'price-desc' ? b.price - a.price : b.rating - a.rating)
  }, [products, f])
}
// const [params, setParams] = useSearchParams() → build f from params so filters live in the URL`),
M('Medium', `Build a tic-tac-toe game (advanced: N×N board, winner detection, undo).`,
  `Two players take turns; three (or N) in a row wins.`,
  `Board as an array of n×n; derive the winner (don't store it); check all rows, columns and both diagonals; keep history for undo/time travel; disable moves after a win or draw. Configurable n and win length make it "advanced".`,
  `function winner(b, n) {
  const lines = []
  for (let i = 0; i < n; i++) { lines.push([...Array(n)].map((_, j) => i * n + j)); lines.push([...Array(n)].map((_, j) => j * n + i)) }
  lines.push([...Array(n)].map((_, i) => i * n + i), [...Array(n)].map((_, i) => i * n + (n - 1 - i)))
  for (const l of lines) if (b[l[0]] && l.every(k => b[k] === b[l[0]])) return b[l[0]]
  return null
}
function TicTacToe({ n = 3 }) {
  const [history, setHistory] = useState([Array(n * n).fill(null)])
  const board = history.at(-1), xNext = history.length % 2 === 1
  const win = winner(board, n), draw = !win && board.every(Boolean)
  const play = i => { if (board[i] || win) return; const next = [...board]; next[i] = xNext ? 'X' : 'O'; setHistory(h => [...h, next]) }
  return <>
    <p aria-live="polite">{win ? win + ' wins!' : draw ? 'Draw' : (xNext ? 'X' : 'O') + "'s turn"}</p>
    <div style={{ display: 'grid', gridTemplateColumns: \`repeat(\${n}, 56px)\` }}>
      {board.map((c, i) => <button key={i} onClick={() => play(i)} aria-label={'Cell ' + (i + 1) + (c ? ' ' + c : '')} style={{ height: 56 }}>{c}</button>)}
    </div>
    <button onClick={() => setHistory(h => (h.length > 1 ? h.slice(0, -1) : h))}>Undo</button>
    <button onClick={() => setHistory([Array(n * n).fill(null)])}>Restart</button>
  </>
}`),
M('Hard', `Build a toast / notification system (system design).`,
  `Little messages pop up in a corner and disappear on their own.`,
  `A provider holds a queue; a hook exposes <code>toast.success/error(message, options)</code> from anywhere; toasts render in a portal with an <code>aria-live</code> region; each auto-dismisses (pause on hover/focus), can be closed manually, and the stack has a max length. Design points: positions, types, actions ("Undo"), deduplication, no focus stealing, reduced motion.`,
  `const ToastCtx = createContext(null)
function ToastProvider({ children, max = 3 }) {
  const [toasts, setToasts] = useState([])
  const remove = id => setToasts(t => t.filter(x => x.id !== id))
  const show = useCallback((message, { type = 'info', duration = 3000 } = {}) => {
    const id = crypto.randomUUID()
    setToasts(t => [...t, { id, message, type }].slice(-max))
    if (duration) setTimeout(() => remove(id), duration)
  }, [max])
  return <ToastCtx value={show}>
    {children}
    {createPortal(<div aria-live="polite" className="toasts">
      {toasts.map(t => <div key={t.id} className={'toast ' + t.type} role={t.type === 'error' ? 'alert' : 'status'}>
        {t.message}<button onClick={() => remove(t.id)} aria-label="Dismiss">×</button></div>)}
    </div>, document.body)}
  </ToastCtx>
}
const useToast = () => useContext(ToastCtx)`),
M('Medium', `Build a poll widget (system design).`,
  `Ask a question, people pick an answer, and everyone sees the percentages.`,
  `Props/config: question, options, single or multiple choice, poll id. State: selected option(s), submitted, results. Flow: vote → optimistic update of counts → POST to API → reconcile or roll back; prevent double voting (server-side by user/device, client remembers in storage); show results with percentage bars (role="progressbar"); handle loading/error; real-time updates via polling or WebSocket. Embeddable: no global CSS leakage (scoped styles).`,
  `function Poll({ poll, onVote }) {
  const [counts, setCounts] = useState(poll.counts), [voted, setVoted] = useState(() => localStorage.getItem('poll:' + poll.id))
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  async function vote(option) {
    if (voted) return
    setVoted(option); setCounts(c => ({ ...c, [option]: c[option] + 1 }))          // optimistic
    try { await onVote(poll.id, option); localStorage.setItem('poll:' + poll.id, option) }
    catch { setVoted(null); setCounts(c => ({ ...c, [option]: c[option] - 1 })) }  // rollback
  }
  return <fieldset><legend>{poll.question}</legend>
    {poll.options.map(o => <div key={o}>
      <button onClick={() => vote(o)} disabled={!!voted} aria-pressed={voted === o}>{o}</button>
      {voted && <span>{total ? Math.round((counts[o] / total) * 100) : 0}%</span>}
    </div>)}
  </fieldset>
}`),
M('Medium', `Build a "match similar tiles" memory game.`,
  `Flip two cards; if the pictures match they stay open, otherwise they flip back.`,
  `Shuffle pairs (Fisher–Yates), track flipped indices (max 2) and matched ids; on two flips compare, keep or flip back after a delay; lock input during the delay; count moves; win when all matched.`,
  `const shuffle = a => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]] } return r }
function MemoryGame({ symbols = ['🍎', '🍌', '🍇', '🍒'] }) {
  const [cards] = useState(() => shuffle([...symbols, ...symbols]))
  const [open, setOpen] = useState([]), [matched, setMatched] = useState(new Set()), [moves, setMoves] = useState(0)
  useEffect(() => {
    if (open.length !== 2) return
    setMoves(m => m + 1)
    const [a, b] = open
    if (cards[a] === cards[b]) { setMatched(s => new Set([...s, cards[a]])); setOpen([]); return }
    const id = setTimeout(() => setOpen([]), 700)
    return () => clearTimeout(id)
  }, [open, cards])
  const flip = i => { if (open.length < 2 && !open.includes(i) && !matched.has(cards[i])) setOpen(o => [...o, i]) }
  return <>
    <p>Moves: {moves} {matched.size === symbols.length && '🎉 You won!'}</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 64px)', gap: 8 }}>
      {cards.map((c, i) => { const show = open.includes(i) || matched.has(c); return <button key={i} onClick={() => flip(i)} aria-label={show ? c : 'Hidden card'} style={{ height: 64, fontSize: 28 }}>{show ? c : '?'}</button> })}
    </div>
  </>
}`),
M('Hard', `Build a searchable multi-select dropdown with keyboard accessibility.`,
  `A list you can type into to search, then tick several options, shown as removable chips.`,
  `State: query, open, highlighted index, selected Set. Filter options with the query; arrows move highlight, Enter toggles, Backspace on empty query removes the last chip, Escape closes; chips are buttons to remove. ARIA: combobox input + listbox with <code>aria-multiselectable</code> and <code>aria-selected</code>; close on outside click.`,
  `function MultiSelect({ options, value, onChange, label = 'Choose' }) {
  const [q, setQ] = useState(''), [open, setOpen] = useState(false), [hi, setHi] = useState(0)
  const list = options.filter(o => o.toLowerCase().includes(q.toLowerCase()))
  const toggle = o => onChange(value.includes(o) ? value.filter(x => x !== o) : [...value, o])
  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setHi(i => Math.min(list.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi(i => Math.max(0, i - 1)) }
    else if (e.key === 'Enter' && open && list[hi]) { e.preventDefault(); toggle(list[hi]) }
    else if (e.key === 'Backspace' && !q && value.length) onChange(value.slice(0, -1))
    else if (e.key === 'Escape') setOpen(false)
  }
  return <div onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false) }}>
    {value.map(v => <button key={v} type="button" onClick={() => toggle(v)} aria-label={'Remove ' + v}>{v} ×</button>)}
    <input role="combobox" aria-label={label} aria-expanded={open} aria-controls="ms-list" value={q}
      onChange={e => { setQ(e.target.value); setOpen(true); setHi(0) }} onFocus={() => setOpen(true)} onKeyDown={onKey} />
    {open && <ul id="ms-list" role="listbox" aria-multiselectable="true">
      {list.length ? list.map((o, i) => <li key={o} role="option" aria-selected={value.includes(o)} tabIndex={-1}
        onMouseDown={e => { e.preventDefault(); toggle(o) }} style={{ fontWeight: i === hi ? 700 : 400 }}>{value.includes(o) ? '✓ ' : ''}{o}</li>)
        : <li>No matches</li>}
    </ul>}
  </div>
}`),
M('Medium', `Build a product CRUD app (add, list, edit, delete) that persists to localStorage.`,
  `A product notebook: add items, change them, remove them, and they are still there after refresh.`,
  `One list in state initialised lazily from localStorage and saved in an effect; a single form for add and edit (editingId); immutable add/update/delete; validation; confirm before delete. Mention: in real apps the server is the source of truth (React Query), and localStorage is per-browser, ~5 MB, synchronous, and readable by any script (never store secrets).`,
  `function useLocalState(key, initial) {
  const [v, setV] = useState(() => { try { return JSON.parse(localStorage.getItem(key)) ?? initial } catch { return initial } })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(v)) }, [key, v])
  return [v, setV]
}
function Products() {
  const [items, setItems] = useLocalState('products', [])
  const empty = { name: '', price: '' }
  const [form, setForm] = useState(empty), [editingId, setEditingId] = useState(null), [error, setError] = useState('')
  function save(e) {
    e.preventDefault()
    if (!form.name.trim() || !(Number(form.price) > 0)) return setError('Enter a name and a price above 0')
    const product = { name: form.name.trim(), price: Number(form.price) }
    setItems(list => editingId ? list.map(p => (p.id === editingId ? { ...p, ...product } : p)) : [...list, { id: crypto.randomUUID(), ...product }])
    setForm(empty); setEditingId(null); setError('')
  }
  return <>
    <form onSubmit={save}>
      <input aria-label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      <input aria-label="Price" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
      <button>{editingId ? 'Update' : 'Add'}</button>
      {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(empty) }}>Cancel</button>}
      {error && <p role="alert">{error}</p>}
    </form>
    <ul>{items.map(p => <li key={p.id}>{p.name}: ₹{p.price}
      <button onClick={() => { setEditingId(p.id); setForm({ name: p.name, price: String(p.price) }) }}>Edit</button>
      <button onClick={() => confirm('Delete ' + p.name + '?') && setItems(l => l.filter(x => x.id !== p.id))}>Delete</button>
    </li>)}</ul>
    {!items.length && <p>No products yet.</p>}
  </>
}`),
M('Hard', `Build a shopping cart in vanilla JavaScript, HTML and CSS (no React).`,
  `The same shopping basket, but you move the pieces on the page yourself instead of React doing it.`,
  `Keep one <b>state object</b> as the source of truth, write <b>pure functions</b> to change it, and a single <code>render()</code> that rebuilds the cart UI from state (a mini React). Use <b>event delegation</b> on the container with <code>data-</code> attributes; compute totals from state, never read them from the DOM; persist to localStorage; escape text (use textContent) to avoid XSS.`,
  `<!-- <ul id="products"></ul> <ul id="cart"></ul> <p id="total"></p> -->
const products = [{ id: 1, name: 'Pen', price: 20 }, { id: 2, name: 'Book', price: 150 }]
const state = { cart: JSON.parse(localStorage.getItem('cart') || '{}') }   // { productId: qty }

function setQty(id, qty) {
  if (qty <= 0) delete state.cart[id]; else state.cart[id] = qty
  localStorage.setItem('cart', JSON.stringify(state.cart)); render()
}
function li(text, ...buttons) {
  const el = document.createElement('li'); el.append(text)
  buttons.forEach(([label, action, id]) => { const b = document.createElement('button'); b.textContent = label; b.dataset.action = action; b.dataset.id = id; el.append(' ', b) })
  return el
}
function render() {
  document.getElementById('products').replaceChildren(...products.map(p => li(p.name + ' ₹' + p.price, ['Add', 'add', p.id])))
  const rows = Object.entries(state.cart).map(([id, qty]) => { const p = products.find(x => x.id === +id); return li(\`\${p.name} × \${qty} = ₹\${p.price * qty}\`, ['−', 'dec', id], ['+', 'inc', id], ['Remove', 'remove', id]) })
  document.getElementById('cart').replaceChildren(...(rows.length ? rows : [li('Cart is empty')]))
  const total = Object.entries(state.cart).reduce((t, [id, q]) => t + products.find(x => x.id === +id).price * q, 0)
  document.getElementById('total').textContent = 'Total: ₹' + total
}
document.addEventListener('click', e => {
  const { action, id } = e.target.dataset; if (!action) return
  const qty = state.cart[id] || 0
  if (action === 'add' || action === 'inc') setQty(id, qty + 1)
  if (action === 'dec') setQty(id, qty - 1)
  if (action === 'remove') setQty(id, 0)
})
render()`,
  `Reported in a candidate's Flipkart machine-coding round (LinkedIn post): explain your state → render structure; it shows you understand what React does for you.`),
    ],
  });
})();
