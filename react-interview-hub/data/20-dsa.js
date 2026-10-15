/* From DSA.pdf (Top 30 FAANG questions, C++). Solutions rewritten in JavaScript. */
HUB.add({
  id: 'dsa', title: 'DSA: top 30 problems (in JavaScript)', short: 'DSA',
  blurb: 'Arrays, strings, linked lists, trees, graphs and design, with patterns, complexity and JS code.',
  items: [
{ q: `Two Sum: return indices of two numbers that add up to target.`,
  k: `For each number, ask a notebook: "have I already seen the number that would complete the pair?"`,
  a: `<b>Pattern: hash map.</b> Walk once; for each <code>nums[i]</code> check if <code>target - nums[i]</code> is already in the map; if yes return both indices, else store <code>nums[i] → i</code>. Time <b>O(n)</b>, space <b>O(n)</b> (brute force is O(n²)).`,
  c: `function twoSum(nums, target) {
  const seen = new Map()
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i]
    if (seen.has(diff)) return [seen.get(diff), i]
    seen.set(nums[i], i)
  }
  return []
}
twoSum([2, 7, 11, 15], 9) // [0, 1]` },
{ q: `Best Time to Buy and Sell Stock: maximum profit from one buy and one sell.`,
  k: `Remember the cheapest day so far; each day, check how much you'd earn if you sold today.`,
  a: `<b>Pattern: greedy / running minimum.</b> Track <code>minPrice</code> and <code>maxProfit = max(maxProfit, price - minPrice)</code>. O(n) time, O(1) space.`,
  c: `function maxProfit(prices) {
  let min = Infinity, best = 0
  for (const p of prices) { min = Math.min(min, p); best = Math.max(best, p - min) }
  return best
}
maxProfit([7, 1, 5, 3, 6, 4]) // 5 (buy at 1, sell at 6)` },
{ q: `Maximum Subarray (Kadane's algorithm).`,
  k: `Keep adding numbers; if your running total goes below zero, drop it and start fresh.`,
  a: `<b>Pattern: Kadane.</b> At each element choose "extend or restart": <code>cur = max(x, cur + x)</code>, <code>best = max(best, cur)</code>. Works for all-negative arrays. O(n) / O(1).`,
  c: `function maxSubArray(nums) {
  let cur = nums[0], best = nums[0]
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i])
    best = Math.max(best, cur)
  }
  return best
}
maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) // 6 ([4, -1, 2, 1])` },
{ q: `Product of Array Except Self (O(1) extra space).`,
  k: `For each spot, multiply everything on its left by everything on its right.`,
  a: `<b>Pattern: prefix and suffix products.</b> First pass writes left products into the result; second pass multiplies by a running right product. No division, O(n) time, O(1) extra space (output doesn't count).`,
  c: `function productExceptSelf(nums) {
  const n = nums.length, res = new Array(n).fill(1)
  let left = 1
  for (let i = 0; i < n; i++) { res[i] = left; left *= nums[i] }
  let right = 1
  for (let i = n - 1; i >= 0; i--) { res[i] *= right; right *= nums[i] }
  return res
}
productExceptSelf([1, 2, 3, 4]) // [24, 12, 8, 6]` },
{ q: `Merge Intervals.`,
  k: `Line up the time slots by start time, then glue together any that overlap.`,
  a: `<b>Pattern: sort then sweep.</b> Sort by start; if the next start ≤ current end, extend the end; else push current and move on. O(n log n) for sorting, O(n) output.`,
  c: `function merge(intervals) {
  if (!intervals.length) return []
  intervals.sort((a, b) => a[0] - b[0])
  const out = [intervals[0].slice()]
  for (const [s, e] of intervals.slice(1)) {
    const last = out[out.length - 1]
    if (s <= last[1]) last[1] = Math.max(last[1], e)
    else out.push([s, e])
  }
  return out
}
merge([[1, 3], [2, 6], [8, 10], [15, 18]]) // [[1, 6], [8, 10], [15, 18]]` },
{ q: `Rotate Array right by k steps (in place).`,
  k: `Flip the whole line, then flip the first k kids back, then flip the rest back.`,
  a: `<b>Pattern: triple reverse.</b> <code>k %= n</code>; reverse all, reverse first k, reverse the rest. O(n) time, O(1) space.`,
  c: `function rotate(nums, k) {
  const n = nums.length; k %= n
  const rev = (l, r) => { while (l < r) [nums[l++], nums[r--]] = [nums[r], nums[l]] }
  rev(0, n - 1); rev(0, k - 1); rev(k, n - 1)
  return nums
}
rotate([1, 2, 3, 4, 5, 6, 7], 3) // [5, 6, 7, 1, 2, 3, 4]`,
  t: `Destructuring swap evaluates the right side first, so [a[l++], a[r--]] = [a[r], a[l]] reads the old values. If that feels risky, use a temp variable.` },
{ q: `Valid Anagram.`,
  k: `Count letters in the first word, take them away using the second word; if every count is zero, they match.`,
  a: `<b>Pattern: frequency count.</b> Different lengths → false. Count with a 26-slot array for lowercase letters (O(n) time, O(1) space) or a Map for Unicode. Sorting both strings is O(n log n).`,
  c: `function isAnagram(s, t) {
  if (s.length !== t.length) return false
  const count = new Array(26).fill(0)
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++
    count[t.charCodeAt(i) - 97]--
  }
  return count.every(c => c === 0)
}` },
{ q: `Longest Substring Without Repeating Characters.`,
  k: `Slide a window over the word; when a letter repeats, move the left edge just past its last spot.`,
  a: `<b>Pattern: sliding window + last-seen map.</b> When <code>s[right]</code> was seen at index ≥ left, jump <code>left = last + 1</code>. Track max window. O(n) time, O(min(n, alphabet)) space.`,
  c: `function lengthOfLongestSubstring(s) {
  const last = new Map()
  let left = 0, best = 0
  for (let right = 0; right < s.length; right++) {
    const ch = s[right]
    if (last.has(ch) && last.get(ch) >= left) left = last.get(ch) + 1
    last.set(ch, right)
    best = Math.max(best, right - left + 1)
  }
  return best
}
lengthOfLongestSubstring('abcabcbb') // 3 ('abc')` },
{ q: `Longest Palindromic Substring.`,
  k: `Every palindrome has a middle. Stand in each middle and spread out while both sides match.`,
  a: `<b>Pattern: expand around center</b> for odd (i, i) and even (i, i+1) centers. O(n²) time, O(1) space. (Manacher's is O(n) but rarely expected.)`,
  c: `function longestPalindrome(s) {
  let start = 0, maxLen = s.length ? 1 : 0
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++ }
    if (r - l - 1 > maxLen) { maxLen = r - l - 1; start = l + 1 }
  }
  for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1) }
  return s.slice(start, start + maxLen)
}
longestPalindrome('babad') // 'bab' (or 'aba')` },
{ q: `Group Anagrams.`,
  k: `Give each word a label made from its letter counts; words with the same label go in the same group.`,
  a: `<b>Pattern: hash by canonical key.</b> Key = letter-count signature (O(k)) or sorted word (O(k log k)). Map key → list. Total O(n·k).`,
  c: `function groupAnagrams(strs) {
  const groups = new Map()
  for (const s of strs) {
    const freq = new Array(26).fill(0)
    for (const ch of s) freq[ch.charCodeAt(0) - 97]++
    const key = freq.join('#')
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(s)
  }
  return [...groups.values()]
}
groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])
// [['eat','tea','ate'], ['tan','nat'], ['bat']]` },
{ q: `Reverse a Linked List.`,
  k: `Walk down the chain and turn each arrow around, remembering where you came from.`,
  a: `<b>Pattern: three pointers</b> (prev, curr, next). O(n) time, O(1) space. Recursive version uses O(n) stack.`,
  c: `function reverseList(head) {
  let prev = null, curr = head
  while (curr) {
    const next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }
  return prev
}` },
{ q: `Linked List Cycle: does the list have a cycle?`,
  k: `A slow tortoise and a fast hare run on the track; if there's a loop, the hare catches the tortoise.`,
  a: `<b>Pattern: Floyd's fast and slow pointers.</b> Slow moves 1, fast moves 2; if they meet there's a cycle; if fast hits null there isn't. O(n) time, O(1) space (a Set of visited nodes is O(n) space).`,
  c: `function hasCycle(head) {
  let slow = head, fast = head
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) return true
  }
  return false
}` },
{ q: `Merge Two Sorted Lists.`,
  k: `Two sorted lines of kids; keep taking the shorter kid from the front of either line.`,
  a: `<b>Pattern: dummy head + tail pointer.</b> Attach the smaller node each step, then attach the leftover list. O(m+n) time, O(1) space.`,
  c: `function mergeTwoLists(a, b) {
  const dummy = { next: null }
  let tail = dummy
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next }
    else { tail.next = b; b = b.next }
    tail = tail.next
  }
  tail.next = a || b
  return dummy.next
}` },
{ q: `Remove Nth Node From End of List.`,
  k: `Send a runner n steps ahead; when the runner reaches the end, the walker behind is just before the node to remove.`,
  a: `<b>Pattern: two pointers with a gap</b>, starting from a dummy node so removing the head works. One pass, O(L) time, O(1) space.`,
  c: `function removeNthFromEnd(head, n) {
  const dummy = { next: head }
  let fast = dummy, slow = dummy
  for (let i = 0; i < n; i++) fast = fast.next
  while (fast.next) { fast = fast.next; slow = slow.next }
  slow.next = slow.next.next
  return dummy.next
}
// 1→2→3→4→5, n = 2  →  1→2→3→5`,
  t: `The PDF's dry-run result shows 1→2→3→4, but removing the 2nd node from the end of 1→2→3→4→5 removes 4, giving 1→2→3→5.` },
{ q: `Linked List Cycle II: find the node where the cycle begins (follow-up to cycle detection).`,
  k: `After the tortoise and hare meet, put one back at the start; walking one step each, they meet again exactly at the loop's door.`,
  a: `Your PDF lists cycle detection twice (Q12 and Q15), so here is the common follow-up. After Floyd's meeting point, reset one pointer to head and move both one step at a time; they meet at the cycle start. The distance from head to the start equals the distance from the meeting point to the start (mod cycle length). O(n), O(1).`,
  c: `function detectCycle(head) {
  let slow = head, fast = head
  while (fast && fast.next) {
    slow = slow.next; fast = fast.next.next
    if (slow === fast) {
      let p = head
      while (p !== slow) { p = p.next; slow = slow.next }
      return p
    }
  }
  return null
}` },
{ q: `Intersection of Two Linked Lists.`,
  k: `Two walkers swap to the other road when they finish theirs, so both walk the same distance and meet at the crossing.`,
  a: `<b>Pattern: two pointers switching heads.</b> Each walks lenA + lenB steps total, so they meet at the intersection or both reach null together. O(m+n), O(1).`,
  c: `function getIntersectionNode(headA, headB) {
  let a = headA, b = headB
  while (a !== b) {
    a = a ? a.next : headB
    b = b ? b.next : headA
  }
  return a
}` },
{ q: `Add Two Numbers (digits stored in reverse order in linked lists).`,
  k: `Add digit by digit like at school, carrying the one to the next column.`,
  a: `<b>Pattern: simulate addition with carry</b> and a dummy node; continue while either list or the carry remains. O(max(m, n)).`,
  c: `function addTwoNumbers(l1, l2) {
  const dummy = { next: null }
  let cur = dummy, carry = 0
  while (l1 || l2 || carry) {
    const sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry
    carry = Math.floor(sum / 10)
    cur.next = { val: sum % 10, next: null }
    cur = cur.next
    l1 = l1?.next; l2 = l2?.next
  }
  return dummy.next
}
// 2→4→3 + 5→6→4 = 7→0→8  (342 + 465 = 807)` },
{ q: `Merge K Sorted Lists.`,
  k: `Keep the front kid of every line in a "who is smallest" box, take the smallest, and refill from that line.`,
  a: `<b>Pattern: min-heap</b> of list heads, O(N log k). JavaScript has no built-in heap, so in interviews either write a small binary heap or use <b>divide and conquer</b>: merge pairs of lists repeatedly (also O(N log k), simpler to write).`,
  c: `function mergeKLists(lists) {
  if (!lists.length) return null
  while (lists.length > 1) {
    const next = []
    for (let i = 0; i < lists.length; i += 2) {
      next.push(mergeTwoLists(lists[i], lists[i + 1] || null))
    }
    lists = next
  }
  return lists[0]
}` },
{ q: `LRU Cache with O(1) get and put.`,
  k: `A small shelf: whatever you touch moves to the front; when the shelf is full, the thing at the back (used longest ago) is thrown out.`,
  a: `Classic answer: hash map + doubly linked list (move to front on access, evict tail). In JavaScript, a <b>Map keeps insertion order</b>, so delete-and-reinsert moves a key to "most recent", and <code>map.keys().next().value</code> is the least recent. Both O(1). Mention the linked-list version if they want the underlying design.`,
  c: `class LRUCache {
  constructor(capacity) { this.cap = capacity; this.map = new Map() }
  get(key) {
    if (!this.map.has(key)) return -1
    const v = this.map.get(key)
    this.map.delete(key); this.map.set(key, v)   // mark most recent
    return v
  }
  put(key, value) {
    this.map.delete(key)
    this.map.set(key, value)
    if (this.map.size > this.cap) this.map.delete(this.map.keys().next().value)
  }
}` },
{ q: `Word Ladder: shortest transformation length from beginWord to endWord.`,
  k: `Change one letter at a time, only into real words, and explore level by level until you reach the goal.`,
  a: `<b>Pattern: BFS on an implicit graph</b> (BFS gives shortest path in unweighted graphs). Generate neighbours by changing each letter a–z; use a Set of words; remove words when enqueued to avoid revisits. O(N · M · 26).`,
  c: `function ladderLength(begin, end, wordList) {
  const words = new Set(wordList)
  if (!words.has(end)) return 0
  let queue = [begin], level = 1
  while (queue.length) {
    const next = []
    for (const word of queue) {
      if (word === end) return level
      for (let i = 0; i < word.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const cand = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1)
          if (words.has(cand)) { words.delete(cand); next.push(cand) }
        }
      }
    }
    queue = next; level++
  }
  return 0
}
ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']) // 5` },
{ q: `Trapping Rain Water.`,
  k: `Water above each bar fills up to the shorter of the tallest walls on its left and right.`,
  a: `<b>Pattern: two pointers.</b> Move the side with the smaller height; track leftMax/rightMax; water at that index = max − height. O(n), O(1). (Prefix max arrays: O(n) space.)`,
  c: `function trap(h) {
  let l = 0, r = h.length - 1, lMax = 0, rMax = 0, water = 0
  while (l < r) {
    if (h[l] <= h[r]) { lMax = Math.max(lMax, h[l]); water += lMax - h[l]; l++ }
    else { rMax = Math.max(rMax, h[r]); water += rMax - h[r]; r-- }
  }
  return water
}
trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) // 6` },
{ q: `Top K Frequent Elements.`,
  k: `Count how often each number appears, then put numbers in buckets by count and pick from the fullest buckets.`,
  a: `<b>Pattern: count + bucket sort</b>, O(n). Alternatives: sort by frequency O(n log n), or a min-heap of size k O(n log k).`,
  c: `function topKFrequent(nums, k) {
  const freq = new Map()
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1)
  const buckets = Array.from({ length: nums.length + 1 }, () => [])
  for (const [n, f] of freq) buckets[f].push(n)
  const out = []
  for (let f = buckets.length - 1; f >= 0 && out.length < k; f--) out.push(...buckets[f])
  return out.slice(0, k)
}
topKFrequent([1, 1, 1, 2, 2, 3], 2) // [1, 2]` },
{ q: `Product of Array Except Self using prefix and suffix arrays (the version with O(n) extra space).`,
  k: `Make one list of "everything to my left" and one of "everything to my right", then multiply them.`,
  a: `Your PDF lists this problem twice (Q4 and Q23). This version builds explicit <code>left[]</code> and <code>right[]</code> arrays: easier to explain first, then optimise to the O(1)-extra-space version (Q4) when the interviewer asks.`,
  c: `function productExceptSelf(nums) {
  const n = nums.length
  const left = new Array(n).fill(1), right = new Array(n).fill(1)
  for (let i = 1; i < n; i++) left[i] = left[i - 1] * nums[i - 1]
  for (let i = n - 2; i >= 0; i--) right[i] = right[i + 1] * nums[i + 1]
  return nums.map((_, i) => left[i] * right[i])
}` },
{ q: `Longest Consecutive Sequence in O(n).`,
  k: `Only start counting from a number whose "one smaller" friend is missing, then count up.`,
  a: `<b>Pattern: hash set + sequence starts.</b> Put all numbers in a Set; for each x where x−1 is absent, count x, x+1, x+2… Each number is visited at most twice, O(n).`,
  c: `function longestConsecutive(nums) {
  const set = new Set(nums)
  let best = 0
  for (const x of set) {
    if (set.has(x - 1)) continue
    let len = 1
    while (set.has(x + len)) len++
    best = Math.max(best, len)
  }
  return best
}
longestConsecutive([100, 4, 200, 1, 3, 2]) // 4` },
{ q: `Binary Tree Level Order Traversal.`,
  k: `Visit the tree floor by floor, left to right.`,
  a: `<b>Pattern: BFS with a queue</b>, processing <code>queue.length</code> nodes per level. O(n) time, O(w) space (w = max width). Use an index pointer instead of <code>shift()</code> for big trees.`,
  c: `function levelOrder(root) {
  if (!root) return []
  const result = []
  let level = [root]
  while (level.length) {
    result.push(level.map(n => n.val))
    level = level.flatMap(n => [n.left, n.right].filter(Boolean))
  }
  return result
}
// [3,9,20,null,null,15,7] → [[3], [9, 20], [15, 7]]` },
{ q: `Lowest Common Ancestor of a Binary Tree.`,
  k: `Ask each branch "did you find p or q?" The first node where both sides say yes is the shared grandparent.`,
  a: `<b>Pattern: post-order DFS.</b> Return root if it's null, p or q; recurse left and right; if both are non-null, root is the LCA; else return the non-null side. O(n) time, O(h) space. For a BST, walk down using value comparisons in O(h).`,
  c: `function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root
  const left = lowestCommonAncestor(root.left, p, q)
  const right = lowestCommonAncestor(root.right, p, q)
  return left && right ? root : left || right
}` },
{ q: `Validate Binary Search Tree.`,
  k: `In a correct search tree, reading left-middle-right gives numbers that always go up.`,
  a: `Either in-order traversal checking strictly increasing values, or DFS passing (min, max) bounds. O(n) time, O(h) space. Use <code>-Infinity/Infinity</code> bounds in JS (no INT_MIN edge case like in C++).`,
  c: `function isValidBST(node, min = -Infinity, max = Infinity) {
  if (!node) return true
  if (node.val <= min || node.val >= max) return false
  return isValidBST(node.left, min, node.val) && isValidBST(node.right, node.val, max)
}` },
{ q: `Kth Smallest Element in a BST.`,
  k: `Read the tree in order (smallest to largest) and stop at the kth number.`,
  a: `<b>Pattern: in-order traversal with early stop.</b> Iterative with a stack is easy to stop early. O(h + k) time, O(h) space.`,
  c: `function kthSmallest(root, k) {
  const stack = []
  let node = root
  while (node || stack.length) {
    while (node) { stack.push(node); node = node.left }
    node = stack.pop()
    if (--k === 0) return node.val
    node = node.right
  }
}` },
{ q: `Serialize and Deserialize a Binary Tree.`,
  k: `Write the tree as a list, using # for empty spots, so you can rebuild the exact same tree later.`,
  a: `<b>Pattern: pre-order with null markers.</b> Serialize root, left, right with "#" for null; deserialize by reading tokens in the same order recursively. O(n) both ways.`,
  c: `function serialize(root) {
  const out = []
  const dfs = n => { if (!n) { out.push('#'); return } out.push(n.val); dfs(n.left); dfs(n.right) }
  dfs(root)
  return out.join(',')
}
function deserialize(data) {
  const tokens = data.split(','); let i = 0
  const build = () => {
    const t = tokens[i++]
    if (t === '#') return null
    const node = { val: Number(t), left: null, right: null }
    node.left = build(); node.right = build()
    return node
  }
  return build()
}
// tree 1,2,3,4,5,6 → '1,2,4,#,#,5,#,#,3,#,6,#,#'` },
{ q: `Diameter of a Binary Tree.`,
  k: `Find the longest path between any two leaves; at each node it's the height of the left side plus the right side.`,
  a: `<b>Pattern: DFS returning height while updating a global best.</b> At each node, diameter through it = leftHeight + rightHeight (in edges). O(n) time, O(h) space.`,
  c: `function diameterOfBinaryTree(root) {
  let best = 0
  const height = n => {
    if (!n) return 0
    const l = height(n.left), r = height(n.right)
    best = Math.max(best, l + r)
    return 1 + Math.max(l, r)
  }
  height(root)
  return best
}` },
{ q: `How do you approach any DSA problem in an interview?`,
  k: `Understand the question, try the slow way, find the trick, then write it carefully and test it.`,
  a: `1) Repeat the problem and clarify inputs, outputs, constraints and edge cases. 2) Give the brute force and its complexity. 3) Spot the pattern: hash map, two pointers, sliding window, prefix sums, sorting, binary search, stack, heap, BFS/DFS, DP, greedy. 4) Agree on the optimal approach before coding. 5) Code cleanly with good names. 6) Dry-run a small example and edge cases (empty, one element, duplicates, negatives). 7) State time and space complexity.` },
  ],
});
