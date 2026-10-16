export const CATEGORIES = [
  { id: 'data-structures', label: 'Data Structures' },
  { id: 'sorting', label: 'Sorting' },
  { id: 'searching', label: 'Searching' },
  { id: 'graphs', label: 'Graphs' },
  { id: 'patterns', label: 'Patterns' },
  { id: 'dynamic-programming', label: 'Dynamic Programming' },
];

export const ENTRIES = [
  // ── Data Structures ──────────────────────────────────────────
  {
    id: 'array',
    category: 'data-structures',
    title: 'Array',
    complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)' },
    description:
      'Contiguous memory storing elements of the same type. Fast random access by index; inserts and deletes in the middle require shifting.',
    example: `// Create & access
const nums = [10, 20, 30, 40];
console.log(nums[2]); // 30

// Append / pop — O(1) amortized
nums.push(50);
nums.pop();

// Insert / remove at index — O(n)
nums.splice(1, 0, 15); // [10, 15, 20, 30, 40]
nums.splice(1, 1);     // remove one at index 1

// Iterate
for (let i = 0; i < nums.length; i++) {
  console.log(nums[i]);
}
nums.forEach((n) => console.log(n));`,
  },
  {
    id: 'linked-list',
    category: 'data-structures',
    title: 'Linked List',
    complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)*', delete: 'O(1)*' },
    description:
      'Nodes linked by pointers. *Insert/delete are O(1) when you already hold the node reference. No random access — traversal is sequential.',
    example: `class Node {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

class LinkedList {
  constructor() { this.head = null; }

  prepend(val) {
    this.head = new Node(val, this.head);
  }

  append(val) {
    if (!this.head) { this.head = new Node(val); return; }
    let cur = this.head;
    while (cur.next) cur = cur.next;
    cur.next = new Node(val);
  }

  find(val) {
    let cur = this.head;
    while (cur) {
      if (cur.val === val) return cur;
      cur = cur.next;
    }
    return null;
  }
}

const list = new LinkedList();
list.prepend(3);
list.prepend(2);
list.append(4); // 2 → 3 → 4`,
  },
  {
    id: 'stack',
    category: 'data-structures',
    title: 'Stack',
    complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)' },
    description:
      'LIFO (Last In, First Out). Push and pop only at the top. Used for undo, call stacks, DFS, and matching parentheses.',
    example: `class Stack {
  constructor() { this.items = []; }

  push(val) { this.items.push(val); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}

// Valid parentheses
function isValid(s) {
  const stack = new Stack();
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if ('([{'.includes(ch)) stack.push(ch);
    else if (stack.pop() !== pairs[ch]) return false;
  }
  return stack.isEmpty();
}

console.log(isValid('({[]})')); // true`,
  },
  {
    id: 'queue',
    category: 'data-structures',
    title: 'Queue',
    complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)' },
    description:
      'FIFO (First In, First Out). Enqueue at the back, dequeue from the front. Foundation for BFS and task scheduling.',
    example: `class Queue {
  constructor() {
    this.items = [];
    this.head = 0;
  }

  enqueue(val) { this.items.push(val); }

  dequeue() {
    if (this.isEmpty()) return undefined;
    const val = this.items[this.head++];
    // occasional compact to free memory
    if (this.head > 50 && this.head * 2 > this.items.length) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }
    return val;
  }

  peek() { return this.items[this.head]; }
  isEmpty() { return this.head >= this.items.length; }
}

const q = new Queue();
q.enqueue('A');
q.enqueue('B');
console.log(q.dequeue()); // 'A'`,
  },
  {
    id: 'hash-table',
    category: 'data-structures',
    title: 'Hash Table (Map)',
    complexity: { access: 'O(1)*', search: 'O(1)*', insert: 'O(1)*', delete: 'O(1)*' },
    description:
      'Key → value lookups via a hash function. *Average O(1); worst case O(n) with collisions. Ideal for frequency counts and caching.',
    example: `// Native Map
const freq = new Map();
for (const ch of 'banana') {
  freq.set(ch, (freq.get(ch) || 0) + 1);
}
console.log(freq.get('a')); // 3

// Two-sum with a hash map — O(n)
function twoSum(nums, target) {
  const seen = new Map(); // value → index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]`,
  },
  {
    id: 'binary-tree',
    category: 'data-structures',
    title: 'Binary Tree / BST',
    complexity: { access: 'O(log n)*', search: 'O(log n)*', insert: 'O(log n)*', delete: 'O(log n)*' },
    description:
      'Each node has at most two children. In a BST, left < node < right. *Balanced trees are O(log n); skewed trees degrade to O(n).',
    example: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function bstInsert(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = bstInsert(root.left, val);
  else root.right = bstInsert(root.right, val);
  return root;
}

function bstSearch(root, val) {
  if (!root || root.val === val) return root;
  return val < root.val
    ? bstSearch(root.left, val)
    : bstSearch(root.right, val);
}

// In-order traversal → sorted values
function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out);
  out.push(node.val);
  inorder(node.right, out);
  return out;
}

let root = null;
[5, 3, 7, 2, 4].forEach((v) => { root = bstInsert(root, v); });
console.log(inorder(root)); // [2, 3, 4, 5, 7]`,
  },
  {
    id: 'heap',
    category: 'data-structures',
    title: 'Heap (Priority Queue)',
    complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(log n)', delete: 'O(log n)' },
    description:
      'Complete binary tree where parent ≤ children (min-heap) or ≥ (max-heap). Peek min/max in O(1); insert and extract in O(log n).',
    example: `class MinHeap {
  constructor() { this.h = []; }

  peek() { return this.h[0]; }
  size() { return this.h.length; }

  push(val) {
    this.h.push(val);
    this._siftUp(this.h.length - 1);
  }

  pop() {
    if (this.h.length <= 1) return this.h.pop();
    const top = this.h[0];
    this.h[0] = this.h.pop();
    this._siftDown(0);
    return top;
  }

  _siftUp(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p] <= this.h[i]) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }

  _siftDown(i) {
    const n = this.h.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.h[l] < this.h[smallest]) smallest = l;
      if (r < n && this.h[r] < this.h[smallest]) smallest = r;
      if (smallest === i) break;
      [this.h[i], this.h[smallest]] = [this.h[smallest], this.h[i]];
      i = smallest;
    }
  }
}

const heap = new MinHeap();
[5, 1, 8, 3].forEach((v) => heap.push(v));
console.log(heap.pop()); // 1`,
  },
  {
    id: 'graph',
    category: 'data-structures',
    title: 'Graph (Adjacency List)',
    complexity: { access: 'O(V+E)', search: 'O(V+E)', insert: 'O(1)', delete: 'O(E)' },
    description:
      'Vertices connected by edges. Adjacency lists are space-efficient for sparse graphs and work well with BFS/DFS.',
    example: `class Graph {
  constructor() { this.adj = new Map(); }

  addVertex(v) {
    if (!this.adj.has(v)) this.adj.set(v, []);
  }

  addEdge(u, v, directed = false) {
    this.addVertex(u);
    this.addVertex(v);
    this.adj.get(u).push(v);
    if (!directed) this.adj.get(v).push(u);
  }

  neighbors(v) { return this.adj.get(v) || []; }
}

const g = new Graph();
g.addEdge('A', 'B');
g.addEdge('A', 'C');
g.addEdge('B', 'D');
console.log(g.neighbors('A')); // ['B', 'C']`,
  },
  {
    id: 'trie',
    category: 'data-structures',
    title: 'Trie (Prefix Tree)',
    complexity: { access: 'O(m)', search: 'O(m)', insert: 'O(m)', delete: 'O(m)' },
    description:
      'Tree of characters where each path from root is a prefix. m = key length. Excellent for autocomplete and dictionary lookups.',
    example: `class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
    }
    node.isEnd = true;
  }

  search(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return node.isEnd;
  }

  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return true;
  }
}

const trie = new Trie();
trie.insert('cat');
trie.insert('car');
console.log(trie.search('cat'));      // true
console.log(trie.startsWith('ca'));   // true
console.log(trie.search('cab'));      // false`,
  },

  // ── Sorting ──────────────────────────────────────────────────
  {
    id: 'bubble-sort',
    category: 'sorting',
    title: 'Bubble Sort',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    description:
      'Repeatedly swap adjacent out-of-order pairs. Simple but slow — mainly useful for teaching or nearly-sorted tiny arrays.',
    example: `function bubbleSort(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // already sorted
  }
  return a;
}

console.log(bubbleSort([5, 1, 4, 2, 8])); // [1, 2, 4, 5, 8]`,
  },
  {
    id: 'merge-sort',
    category: 'sorting',
    title: 'Merge Sort',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    description:
      'Divide-and-conquer: split in half, sort each half, merge. Stable and predictable O(n log n) — great when stability matters.',
    example: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out.push(left[i++]);
    else out.push(right[j++]);
  }
  return out.concat(left.slice(i), right.slice(j));
}

console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));
// [3, 9, 10, 27, 38, 43, 82]`,
  },
  {
    id: 'quick-sort',
    category: 'sorting',
    title: 'Quick Sort',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    description:
      'Pick a pivot, partition around it, recurse. Fast in practice; worst case is rare with good pivot choice (e.g. random / median-of-three).',
    example: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length >> 1];
  const left = arr.filter((x) => x < pivot);
  const mid = arr.filter((x) => x === pivot);
  const right = arr.filter((x) => x > pivot);
  return [...quickSort(left), ...mid, ...quickSort(right)];
}

// In-place partition version (Lomuto)
function partition(a, lo, hi) {
  const pivot = a[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (a[j] < pivot) {
      [a[i], a[j]] = [a[j], a[i]];
      i++;
    }
  }
  [a[i], a[hi]] = [a[hi], a[i]];
  return i;
}

console.log(quickSort([3, 6, 8, 10, 1, 2, 1]));
// [1, 1, 2, 3, 6, 8, 10]`,
  },

  // ── Searching ────────────────────────────────────────────────
  {
    id: 'linear-search',
    category: 'searching',
    title: 'Linear Search',
    complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    description:
      'Scan each element until a match. Works on unsorted data. Prefer binary search when the collection is sorted.',
    example: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

console.log(linearSearch([4, 2, 7, 1, 9], 7)); // 2
console.log(linearSearch([4, 2, 7, 1, 9], 5)); // -1`,
  },
  {
    id: 'binary-search',
    category: 'searching',
    title: 'Binary Search',
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    description:
      'Halve the search space each step on a sorted array. Classic interview staple and building block for many problems.',
    example: `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

// Lower bound — first index where arr[i] >= target
function lowerBound(arr, target) {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

const sorted = [1, 3, 5, 7, 9, 11];
console.log(binarySearch(sorted, 7));  // 3
console.log(lowerBound(sorted, 6));   // 3 (points at 7)`,
  },

  // ── Graphs ───────────────────────────────────────────────────
  {
    id: 'bfs',
    category: 'graphs',
    title: 'Breadth-First Search (BFS)',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    description:
      'Explore level by level using a queue. Finds shortest path in unweighted graphs and is used for level-order tree traversals.',
    example: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const nei of graph.neighbors(node)) {
      if (!visited.has(nei)) {
        visited.add(nei);
        queue.push(nei);
      }
    }
  }
  return order;
}

// Shortest path (unweighted)
function shortestPath(graph, start, goal) {
  const prev = new Map([[start, null]]);
  const queue = [start];
  while (queue.length) {
    const node = queue.shift();
    if (node === goal) break;
    for (const nei of graph.neighbors(node)) {
      if (!prev.has(nei)) {
        prev.set(nei, node);
        queue.push(nei);
      }
    }
  }
  if (!prev.has(goal)) return null;
  const path = [];
  for (let at = goal; at != null; at = prev.get(at)) path.push(at);
  return path.reverse();
}`,
  },
  {
    id: 'dfs',
    category: 'graphs',
    title: 'Depth-First Search (DFS)',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    description:
      'Go deep along one path before backtracking (stack or recursion). Used for cycle detection, topological sort, and connected components.',
    example: `function dfsRecursive(graph, start, visited = new Set(), order = []) {
  visited.add(start);
  order.push(start);
  for (const nei of graph.neighbors(start)) {
    if (!visited.has(nei)) dfsRecursive(graph, nei, visited, order);
  }
  return order;
}

function dfsIterative(graph, start) {
  const visited = new Set();
  const stack = [start];
  const order = [];
  while (stack.length) {
    const node = stack.pop();
    if (visited.has(node)) continue;
    visited.add(node);
    order.push(node);
    for (const nei of graph.neighbors(node)) {
      if (!visited.has(nei)) stack.push(nei);
    }
  }
  return order;
}

// Detect cycle in directed graph
function hasCycle(graph) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map();
  for (const v of graph.adj.keys()) color.set(v, WHITE);

  function visit(v) {
    color.set(v, GRAY);
    for (const nei of graph.neighbors(v)) {
      if (color.get(nei) === GRAY) return true;
      if (color.get(nei) === WHITE && visit(nei)) return true;
    }
    color.set(v, BLACK);
    return false;
  }

  for (const v of graph.adj.keys()) {
    if (color.get(v) === WHITE && visit(v)) return true;
  }
  return false;
}`,
  },
  {
    id: 'dijkstra',
    category: 'graphs',
    title: "Dijkstra's Algorithm",
    complexity: { time: 'O((V + E) log V)', space: 'O(V)' },
    description:
      'Shortest paths from a source in a weighted graph with non-negative edge weights. Uses a priority queue (min-heap).',
    example: `function dijkstra(graph, start) {
  const dist = new Map();
  for (const v of graph.adj.keys()) dist.set(v, Infinity);
  dist.set(start, 0);

  // Simple array PQ — swap for a real heap in production
  const pq = [[0, start]]; // [distance, node]

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (d > dist.get(u)) continue;

    for (const [v, weight] of graph.weightedNeighbors(u)) {
      const nd = d + weight;
      if (nd < dist.get(v)) {
        dist.set(v, nd);
        pq.push([nd, v]);
      }
    }
  }
  return dist;
}

// graph.weightedNeighbors(u) → [[v, weight], ...]
// Example: A--2--B--5--C, A--4--C
// dijkstra from A → { A: 0, B: 2, C: 4 }`,
  },

  // ── Patterns ─────────────────────────────────────────────────
  {
    id: 'two-pointers',
    category: 'patterns',
    title: 'Two Pointers',
    complexity: { time: 'O(n)', space: 'O(1)' },
    description:
      'Two indices move through a sequence (often from opposite ends or at different speeds). Common for sorted arrays, palindromes, and pair sums.',
    example: `// Pair sum in sorted array
function twoSumSorted(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    const sum = arr[lo] + arr[hi];
    if (sum === target) return [lo, hi];
    if (sum < target) lo++;
    else hi--;
  }
  return [];
}

// Valid palindrome
function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let lo = 0, hi = clean.length - 1;
  while (lo < hi) {
    if (clean[lo] !== clean[hi]) return false;
    lo++;
    hi--;
  }
  return true;
}

console.log(twoSumSorted([1, 2, 4, 6, 10], 8)); // [1, 3]
console.log(isPalindrome('A man, a plan, a canal: Panama')); // true`,
  },
  {
    id: 'sliding-window',
    category: 'patterns',
    title: 'Sliding Window',
    complexity: { time: 'O(n)', space: 'O(k)' },
    description:
      'Maintain a dynamic subarray/substring window. Expand and shrink to satisfy a constraint — max sum, longest unique substring, etc.',
    example: `// Max sum of subarray of size k
function maxSumSubarray(arr, k) {
  let window = 0;
  for (let i = 0; i < k; i++) window += arr[i];
  let best = window;
  for (let i = k; i < arr.length; i++) {
    window += arr[i] - arr[i - k];
    best = Math.max(best, window);
  }
  return best;
}

// Longest substring without repeating characters
function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    if (seen.has(s[right]) && seen.get(s[right]) >= left) {
      left = seen.get(s[right]) + 1;
    }
    seen.set(s[right], right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

console.log(maxSumSubarray([2, 1, 5, 1, 3, 2], 3)); // 9
console.log(lengthOfLongestSubstring('abcabcbb'));  // 3`,
  },
  {
    id: 'recursion',
    category: 'patterns',
    title: 'Recursion & Backtracking',
    complexity: { time: 'problem-dependent', space: 'O(depth)' },
    description:
      'Solve by reducing to a smaller subproblem. Backtracking explores choices, undoes them, and tries alternatives — permutations, subsets, mazes.',
    example: `// Factorial
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// All subsets (power set)
function subsets(nums) {
  const result = [];
  function backtrack(start, path) {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop(); // undo
    }
  }
  backtrack(0, []);
  return result;
}

// Permutations
function permute(nums) {
  const result = [];
  function backtrack(path, used) {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      backtrack(path, used);
      path.pop();
      used[i] = false;
    }
  }
  backtrack([], Array(nums.length).fill(false));
  return result;
}

console.log(subsets([1, 2])); // [[], [1], [1,2], [2]]`,
  },

  // ── Dynamic Programming ──────────────────────────────────────
  {
    id: 'fibonacci-dp',
    category: 'dynamic-programming',
    title: 'Fibonacci (Memoization & Tabulation)',
    complexity: { time: 'O(n)', space: 'O(n) / O(1)' },
    description:
      'Classic intro to DP: overlapping subproblems. Top-down memoization caches recursive results; bottom-up tabulation builds iteratively.',
    example: `// Naive — O(2^n)
function fibNaive(n) {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// Top-down memoization — O(n)
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

// Bottom-up tabulation — O(n) time, O(1) space
function fibTab(n) {
  if (n <= 1) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}

console.log(fibMemo(10)); // 55
console.log(fibTab(10));  // 55`,
  },
  {
    id: 'knapsack',
    category: 'dynamic-programming',
    title: '0/1 Knapsack',
    complexity: { time: 'O(nW)', space: 'O(nW)' },
    description:
      'Maximize value of items without exceeding capacity W. Each item used at most once. Foundation for many capacity / subset DP problems.',
    example: `function knapsack(weights, values, W) {
  const n = weights.length;
  // dp[i][w] = max value using first i items with capacity w
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      dp[i][w] = dp[i - 1][w]; // skip item
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i][w],
          dp[i - 1][w - weights[i - 1]] + values[i - 1]
        );
      }
    }
  }
  return dp[n][W];
}

const weights = [2, 3, 4, 5];
const values = [3, 4, 5, 6];
console.log(knapsack(weights, values, 5)); // 7 (items 0+1)`,
  },
  {
    id: 'lis',
    category: 'dynamic-programming',
    title: 'Longest Increasing Subsequence',
    complexity: { time: 'O(n²) / O(n log n)', space: 'O(n)' },
    description:
      'Find the longest subsequence that is strictly increasing. Classic DP; patience-sorting variant achieves O(n log n).',
    example: `// O(n²) DP
function lis(nums) {
  const n = nums.length;
  const dp = Array(n).fill(1);
  let best = 1;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
    best = Math.max(best, dp[i]);
  }
  return best;
}

// O(n log n) — tails[i] = smallest tail of all LIS of length i+1
function lisFast(nums) {
  const tails = [];
  for (const x of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = x;
  }
  return tails.length;
}

console.log(lis([10, 9, 2, 5, 3, 7, 101, 18]));     // 4
console.log(lisFast([10, 9, 2, 5, 3, 7, 101, 18])); // 4`,
  },
];
