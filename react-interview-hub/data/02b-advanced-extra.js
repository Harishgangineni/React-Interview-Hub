/* Extra Advanced React questions, appended (existing question ids stay the same). Added from the topics of a React interview video the user shared. */
HUB.sections.find(s => s.id === 'advanced').items.push(
{ q: `What is the difference between useMemo, useCallback and React.memo? When do you use each?`,
  k: `useMemo remembers an answer, useCallback remembers a recipe, React.memo lets a brick skip redrawing when its instructions didn't change.`,
  a: `<b>useMemo(fn, deps)</b> caches a <i>computed value</i> (expensive filtering, sorting, derived objects) between renders. <b>useCallback(fn, deps)</b> caches a <i>function identity</i>; it's <code>useMemo(() =&gt; fn, deps)</code>. <b>React.memo(Component)</b> wraps a <i>component</i> so it skips re-rendering when its props are shallowly equal. They work as a team: memo on the child only helps if the parent passes stable props, which is what useMemo (objects/arrays) and useCallback (handlers) provide. Use them for measured problems: expensive calculations, large lists, values used in effect dependencies, or props of memoized children. The React Compiler (1.0, Oct 2025) can add this memoization automatically.`,
  c: `const Row = memo(function Row({ item, onSelect }) {      // React.memo: skip when props equal
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>
})
function List({ items, query }) {
  const [selected, setSelected] = useState(null)
  const visible = useMemo(() => items.filter(i => i.name.includes(query)), [items, query])   // cached value
  const onSelect = useCallback(id => setSelected(id), [])                                     // stable function
  return <ul>{visible.map(i => <Row key={i.id} item={i} onSelect={onSelect} />)}</ul>
}`,
  t: `A common follow-up: "If you remove useCallback here, what happens?" Answer: onSelect becomes a new function every render, so memo's shallow comparison fails and every Row re-renders.` },
{ q: `What is list virtualization and how would you implement it?`,
  k: `Only draw the toys you can see through the window; as you scroll, swap which toys are drawn.`,
  a: `Virtualization (windowing) renders only the rows visible in the scroll viewport plus a small overscan, instead of thousands of DOM nodes. A tall spacer element keeps the scrollbar correct, and visible rows are absolutely positioned (or offset) at <code>index × rowHeight</code>. On scroll, compute <code>start = floor(scrollTop / rowHeight)</code> and <code>end = start + ceil(viewportHeight / rowHeight)</code>. Use libraries in production (TanStack Virtual, react-window, react-virtuoso) for variable heights, grids, sticky headers and measurements. Trade-offs: browser find (Ctrl+F) and some accessibility features only see rendered rows; keep keyboard navigation and aria-rowcount/aria-rowindex where needed. Alternatives: pagination, or CSS <code>content-visibility: auto</code> for long static content.`,
  c: `function VirtualList({ items, rowHeight = 40, height = 400, overscan = 5 }) {
  const [scrollTop, setScrollTop] = useState(0)
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
  const end = Math.min(items.length, Math.ceil((scrollTop + height) / rowHeight) + overscan)
  return (
    <div style={{ height, overflowY: 'auto' }} onScroll={e => setScrollTop(e.currentTarget.scrollTop)}>
      <div style={{ height: items.length * rowHeight, position: 'relative' }}>   {/* full-height spacer */}
        {items.slice(start, end).map((item, i) => (
          <div key={item.id} style={{ position: 'absolute', top: (start + i) * rowHeight, height: rowHeight, left: 0, right: 0 }}>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  )
}
// production: const v = useVirtualizer({ count: items.length, getScrollElement: () => ref.current, estimateSize: () => 40 })`,
  t: `Mention when you would NOT virtualize: under a few hundred simple rows, pagination is clearer for users, or when content must be searchable/printable.` },
{ q: `What is a stale closure in React? Show practical examples and fixes.`,
  k: `A helper keeps looking at an old photo of your toys instead of the toys you have now.`,
  a: `Every render creates new functions that "close over" that render's props and state. A function created once and kept around (interval callback, event listener added in an effect, memoized callback with missing dependencies, a timeout started before an update) keeps reading the <b>old</b> values. Fixes: 1) <b>functional updates</b> (<code>setCount(c =&gt; c + 1)</code>) when the new state depends on the old; 2) <b>correct dependencies</b> so the function is recreated (the exhaustive-deps lint rule finds these); 3) a <b>ref</b> holding the latest value for callbacks that must stay stable; 4) <b>useEffectEvent</b> (React 19.2) for effect logic that reads the latest values without re-running the effect.`,
  c: `// ❌ 1. Interval reads the first count forever
useEffect(() => { const id = setInterval(() => setCount(count + 1), 1000); return () => clearInterval(id) }, [])
// ✅ functional update
useEffect(() => { const id = setInterval(() => setCount(c => c + 1), 1000); return () => clearInterval(id) }, [])

// ❌ 2. Memoized handler with missing dependency logs the old cart
const checkout = useCallback(() => api.checkout(cart), [])
// ✅ include the dependency
const checkout = useCallback(() => api.checkout(cart), [cart])

// ✅ 3. Ref for a stable listener that needs the latest value
const latest = useRef(value)
useEffect(() => { latest.current = value })
useEffect(() => {
  const onKey = e => { if (e.key === 'Enter') save(latest.current) }
  window.addEventListener('keydown', onKey)
  return () => window.removeEventListener('keydown', onKey)
}, [])`,
  t: `Explain the cause in one sentence first ("the function captured values from an earlier render"), then pick the fix that matches the case. Interviewers like hearing that the lint rule catches most of these.` },
);
