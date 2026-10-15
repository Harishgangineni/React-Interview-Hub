/* Extra array/string problems from frontend interview lists the user pasted (LinkedIn). Solutions written and tested for this hub. */
(function () {
  const D = (lv, q, k, a, c) => ({ lv, q, k, a, c });
  HUB.sections.find(s => s.id === 'dsa').items.push(
D('Easy', `Check if one string is a rotation of another ("waterbottle" → "erbottlewat").`,
  `If you glue the word to itself, every rotation hides inside.`,
  `Same length and <code>(a + a).includes(b)</code>. O(n) average with built-in search.`,
  `const isRotation = (a, b) => a.length === b.length && (a + a).includes(b)
isRotation('waterbottle', 'erbottlewat')   // true`),
D('Easy', `Word pattern: do the words follow the pattern? ("abba", "dog cat cat dog" → true)`,
  `Each letter must always mean the same word, and each word the same letter.`,
  `Two maps (letter→word and word→letter) to enforce a one-to-one mapping. O(n).`,
  `function wordPattern(pattern, s) {
  const words = s.split(' ')
  if (words.length !== pattern.length) return false
  const p2w = new Map(), w2p = new Map()
  for (let i = 0; i < pattern.length; i++) {
    const p = pattern[i], w = words[i]
    if ((p2w.has(p) && p2w.get(p) !== w) || (w2p.has(w) && w2p.get(w) !== p)) return false
    p2w.set(p, w); w2p.set(w, p)
  }
  return true
}`),
D('Easy', `Move all even numbers to the front and odd numbers to the back.`,
  `Line up the even toys first, then the odd ones.`,
  `Two pointers swap in place: O(n) time, O(1) space (order not kept). Stable alternative: <code>[...evens, ...odds]</code> with filter.`,
  `function evensFirst(arr) {
  const a = [...arr]; let i = 0, j = a.length - 1
  while (i < j) {
    if (a[i] % 2 === 0) i++
    else if (a[j] % 2 !== 0) j--
    else { [a[i], a[j]] = [a[j], a[i]]; i++; j-- }
  }
  return a
}
const stable = arr => [...arr.filter(n => n % 2 === 0), ...arr.filter(n => n % 2 !== 0)]`),
D('Easy', `Validate balanced brackets: "{[()]}" → true, "([)]" → false.`,
  `Every opening bracket must be closed by its partner, latest first.`,
  `Push openers on a stack; on a closer, the top must be its pair; the stack must end empty. O(n).`,
  `function isBalanced(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' }, stack = []
  for (const ch of s) {
    if ('([{'.includes(ch)) stack.push(ch)
    else if (ch in pairs && stack.pop() !== pairs[ch]) return false
  }
  return stack.length === 0
}`),
D('Medium', `Return all subsets of an array ([1,2,3] → 8 subsets).`,
  `For every toy, you either take it or leave it.`,
  `Iteratively add each number to every existing subset (or backtracking). O(n·2ⁿ).`,
  `const subsets = nums => nums.reduce((all, n) => [...all, ...all.map(s => [...s, n])], [[]])
subsets([1, 2, 3])   // [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]`),
D('Medium', `Count subarrays whose sum equals k ([1,1,1], k=2 → 2).`,
  `Keep a running total and remember how often each total appeared.`,
  `Prefix sums with a hash map: for each running sum s, add the count of earlier prefix sums equal to s − k. Works with negatives. O(n).`,
  `function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]); let sum = 0, count = 0
  for (const n of nums) {
    sum += n
    count += seen.get(sum - k) || 0
    seen.set(sum, (seen.get(sum) || 0) + 1)
  }
  return count
}`),
D('Easy', `Return the longest word in a sentence.`,
  `Look at every word and keep the longest one.`,
  `Split on non-letters, reduce keeping the longer word (first one wins on ties).`,
  `const longestWord = s => s.split(/[^A-Za-z]+/).reduce((best, w) => (w.length > best.length ? w : best), '')
longestWord('I love frontend interviews!')   // 'interviews'`),
D('Medium', `Find all unique triplets that sum to zero (3Sum).`,
  `Pick one number, then find two others that cancel it out.`,
  `Sort, fix i, then two pointers on the rest; skip duplicates. O(n²).`,
  `function threeSum(nums) {
  const a = [...nums].sort((x, y) => x - y), res = []
  for (let i = 0; i < a.length - 2; i++) {
    if (i && a[i] === a[i - 1]) continue
    let l = i + 1, r = a.length - 1
    while (l < r) {
      const s = a[i] + a[l] + a[r]
      if (s === 0) { res.push([a[i], a[l], a[r]]); while (a[l] === a[l + 1]) l++; while (a[r] === a[r - 1]) r--; l++; r-- }
      else if (s < 0) l++; else r--
    }
  }
  return res
}`),
D('Easy', `Compress a string by counting repeats ("aabbb" → "a2b3").`,
  `Say each letter once followed by how many times it repeats.`,
  `Walk the string counting runs. O(n). (Variant: keep single letters without "1", or return the original if it isn't shorter.)`,
  `function compress(s) {
  let out = ''
  for (let i = 0; i < s.length;) {
    let j = i
    while (s[j] === s[i]) j++
    out += s[i] + (j - i); i = j
  }
  return out
}`),
D('Easy', `Reverse an array without using reverse().`,
  `Swap the first and last, then move inwards.`,
  `Two-pointer swap in place: O(n) time, O(1) space.`,
  `function reverseInPlace(a) {
  for (let i = 0, j = a.length - 1; i < j; i++, j--) [a[i], a[j]] = [a[j], a[i]]
  return a
}`),
D('Easy', `Remove all characters of the second string from the first ("hello world", "lo" → "he wrd").`,
  `Cross out every letter that appears in the "remove" list.`,
  `Put the second string's characters in a Set, filter the first. O(n + m).`,
  `const removeChars = (a, b) => { const bad = new Set(b); return [...a].filter(c => !bad.has(c)).join('') }`),
D('Hard', `Longest increasing subsequence length ([10,9,2,5,3,7,101,18] → 4).`,
  `Find the longest chain of numbers that keep getting bigger, skipping some if needed.`,
  `Patience sorting: keep <code>tails[i]</code> = smallest tail of an increasing subsequence of length i+1; binary search where each number fits. O(n log n). (DP O(n²) is fine to mention first.)`,
  `function lengthOfLIS(nums) {
  const tails = []
  for (const n of nums) {
    let lo = 0, hi = tails.length
    while (lo < hi) { const mid = (lo + hi) >> 1; if (tails[mid] < n) lo = mid + 1; else hi = mid }
    tails[lo] = n
  }
  return tails.length
}`),
D('Medium', `Count pairs that differ by exactly k ([1,5,3,4,2], k=2 → 3).`,
  `For each number, check whether its partner k away is in the bag.`,
  `Use a Set of values; for each unique x count x + k. O(n). (For k = 0 count values seen more than once.)`,
  `function pairsWithDiff(nums, k) {
  if (k === 0) { const c = new Map(); nums.forEach(n => c.set(n, (c.get(n) || 0) + 1)); return [...c.values()].filter(v => v > 1).length }
  const set = new Set(nums); let count = 0
  for (const x of set) if (set.has(x + k)) count++
  return count
}`),
D('Medium', `Find Pythagorean triplets in an array (a² + b² = c²).`,
  `Find three sides that make a right-angled triangle.`,
  `Square and sort; for each largest c², two-pointer search for a² + b². O(n²).`,
  `function pythagoreanTriplets(arr) {
  const sq = [...new Set(arr)].map(n => n * n).sort((x, y) => x - y), res = []
  for (let c = sq.length - 1; c >= 2; c--) {
    let l = 0, r = c - 1
    while (l < r) {
      const s = sq[l] + sq[r]
      if (s === sq[c]) { res.push([Math.sqrt(sq[l]), Math.sqrt(sq[r]), Math.sqrt(sq[c])]); l++; r-- }
      else if (s < sq[c]) l++; else r--
    }
  }
  return res
}
pythagoreanTriplets([3, 1, 4, 6, 5, 10, 8])   // [[6,8,10],[3,4,5]]`),
D('Easy', `Remove all vowels from a string ("Interview" → "ntrvw").`,
  `Cross out every a, e, i, o and u.`,
  `A case-insensitive regex replace is clearest; or filter characters against a Set of vowels. O(n).`,
  `const removeVowels = s => s.replace(/[aeiou]/gi, '')
const removeVowels2 = s => [...s].filter(c => !'aeiouAEIOU'.includes(c)).join('')
removeVowels('Interview')   // 'ntrvw'`),
D('Easy', `Find repeated elements and their indices ([3,3,5,7,5] → {3:[0,1], 5:[2,4]}).`,
  `Write down where each toy appears, then keep only toys that appear more than once.`,
  `Group indices by value in one pass, then keep entries with 2+ indices. O(n).`,
  `function repeatedIndices(arr) {
  const map = {}
  arr.forEach((v, i) => (map[v] ??= []).push(i))
  return Object.fromEntries(Object.entries(map).filter(([, idx]) => idx.length > 1))
}`),
  );
})();
