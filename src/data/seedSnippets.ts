import type { Snippet } from '../types/snippet'

type SeedInput = Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function seed(input: SeedInput, days = 0): Snippet {
  const ts = daysAgo(days)
  return {
    ...input,
    id: crypto.randomUUID(),
    createdAt: ts,
    updatedAt: ts,
  }
}

export function createSeedSnippets(): Snippet[] {
  return [
    seed({
      title: 'useDeferredValue search filter',
      code: `const [query, setQuery] = useState('')
const deferredQuery = useDeferredValue(query)
const isStale = query !== deferredQuery

const results = useMemo(
  () => snippets.filter(s => s.title.includes(deferredQuery)),
  [snippets, deferredQuery],
)`,
      language: 'typescript',
      tags: ['react', 'hooks', 'performance'],
      favorite: true,
      copyCount: 24,
    }, 1),

    seed({
      title: 'Custom useLocalStorage hook',
      code: `function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : initial
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}`,
      language: 'typescript',
      tags: ['react', 'hooks', 'storage'],
      favorite: true,
      copyCount: 18,
    }, 2),

    seed({
      title: 'Binary search',
      code: `function binarySearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (arr[mid] === target) return mid
    if (arr[mid] < target) lo = mid + 1
    else hi = mid - 1
  }
  return -1
}`,
      language: 'typescript',
      tags: ['algorithms', 'interview'],
      favorite: true,
      copyCount: 31,
    }, 3),

    seed({
      title: 'Two pointer — pair sum',
      code: `function twoSumSorted(nums: number[], target: number): [number, number] | null {
  let left = 0, right = nums.length - 1
  while (left < right) {
    const sum = nums[left] + nums[right]
    if (sum === target) return [left, right]
    if (sum < target) left++
    else right--
  }
  return null
}`,
      language: 'typescript',
      tags: ['algorithms', 'interview', 'arrays'],
      favorite: false,
      copyCount: 14,
    }, 4),

    seed({
      title: 'Debounce utility',
      code: `function debounce<T extends (...args: never[]) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}`,
      language: 'typescript',
      tags: ['utilities', 'performance'],
      favorite: false,
      copyCount: 11,
    }, 5),

    seed({
      title: 'Async error boundary pattern',
      code: `type State = { error: Error | null }

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) return <Fallback error={this.state.error} />
    return this.props.children
  }
}`,
      language: 'typescript',
      tags: ['react', 'error-handling'],
      favorite: false,
      copyCount: 7,
    }, 6),

    seed({
      title: 'Fetch with timeout',
      code: `async function fetchWithTimeout(url: string, ms = 8000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}`,
      language: 'javascript',
      tags: ['javascript', 'api', 'async'],
      favorite: true,
      copyCount: 16,
    }, 2),

    seed({
      title: 'Deep clone via structuredClone',
      code: `function clone<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }
  return JSON.parse(JSON.stringify(value))
}`,
      language: 'javascript',
      tags: ['javascript', 'utilities'],
      favorite: false,
      copyCount: 9,
    }, 7),

    seed({
      title: 'Group by key',
      code: `const groupBy = (items, key) =>
  items.reduce((acc, item) => {
    const k = item[key]
    ;(acc[k] ??= []).push(item)
    return acc
  }, {})`,
      language: 'javascript',
      tags: ['javascript', 'arrays'],
      favorite: false,
      copyCount: 13,
    }, 8),

    seed({
      title: 'Promise.allSettled wrapper',
      code: `async function settleAll(tasks) {
  const results = await Promise.allSettled(tasks)
  const fulfilled = results.filter(r => r.status === 'fulfilled').map(r => r.value)
  const rejected = results.filter(r => r.status === 'rejected')
  return { fulfilled, rejected }
}`,
      language: 'javascript',
      tags: ['javascript', 'async'],
      favorite: false,
      copyCount: 6,
    }, 9),

    seed({
      title: 'LRU cache',
      code: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)`,
      language: 'python',
      tags: ['python', 'algorithms', 'interview'],
      favorite: true,
      copyCount: 22,
    }, 3),

    seed({
      title: 'List comprehensions cheat sheet',
      code: `# filter + map
squares = [x * x for x in range(10) if x % 2 == 0]

# flatten
matrix = [[1, 2], [3, 4]]
flat = [n for row in matrix for n in row]

# dict comprehension
word = "hello"
freq = {c: word.count(c) for c in set(word)}`,
      language: 'python',
      tags: ['python', 'basics'],
      favorite: false,
      copyCount: 10,
    }, 10),

    seed({
      title: 'FastAPI health endpoint',
      code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}`,
      language: 'python',
      tags: ['python', 'api', 'backend'],
      favorite: false,
      copyCount: 5,
    }, 11),

    seed({
      title: 'Read file with context manager',
      code: `from pathlib import Path

def read_lines(path: str) -> list[str]:
    file = Path(path)
    with file.open("r", encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]`,
      language: 'python',
      tags: ['python', 'io'],
      favorite: false,
      copyCount: 4,
    }, 12),

    seed({
      title: 'Binary tree level order',
      code: `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;

    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
        int size = queue.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(level);
    }
    return result;
}`,
      language: 'java',
      tags: ['java', 'algorithms', 'trees'],
      favorite: false,
      copyCount: 15,
    }, 5),

    seed({
      title: 'Java stream group by',
      code: `Map<String, List<User>> byRole = users.stream()
    .collect(Collectors.groupingBy(User::getRole));

long activeCount = users.stream()
    .filter(User::isActive)
    .count();`,
      language: 'java',
      tags: ['java', 'streams'],
      favorite: false,
      copyCount: 8,
    }, 13),

    seed({
      title: 'Go HTTP middleware',
      code: `func withLogging(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}`,
      language: 'go',
      tags: ['go', 'middleware', 'backend'],
      favorite: false,
      copyCount: 7,
    }, 6),

    seed({
      title: 'Go worker pool',
      code: `func workerPool(jobs <-chan int, results chan<- int, workers int) {
    var wg sync.WaitGroup
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                results <- job * 2
            }
        }()
    }
    wg.Wait()
}`,
      language: 'go',
      tags: ['go', 'concurrency'],
      favorite: false,
      copyCount: 11,
    }, 14),

    seed({
      title: 'Rust Result error handling',
      code: `fn read_config(path: &str) -> Result<Config, Box<dyn Error>> {
    let data = std::fs::read_to_string(path)?;
    let config: Config = serde_json::from_str(&data)?;
    Ok(config)
}`,
      language: 'rust',
      tags: ['rust', 'error-handling'],
      favorite: false,
      copyCount: 6,
    }, 15),

    seed({
      title: 'Rust ownership borrow rules',
      code: `fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() >= b.len() { a } else { b }
}

let s1 = String::from("hello");
let result;
{
    let s2 = String::from("world");
    result = longest(s1.as_str(), s2.as_str());
}`,
      language: 'rust',
      tags: ['rust', 'basics'],
      favorite: false,
      copyCount: 9,
    }, 16),

    seed({
      title: 'SQL top N per group',
      code: `SELECT employee_id, department, salary
FROM (
  SELECT
    employee_id,
    department,
    salary,
    ROW_NUMBER() OVER (
      PARTITION BY department
      ORDER BY salary DESC
    ) AS rn
  FROM employees
) ranked
WHERE rn <= 3;`,
      language: 'sql',
      tags: ['sql', 'interview', 'window-functions'],
      favorite: true,
      copyCount: 19,
    }, 2),

    seed({
      title: 'SQL recursive CTE',
      code: `WITH RECURSIVE chain AS (
  SELECT id, manager_id, name, 1 AS depth
  FROM employees
  WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.manager_id, e.name, c.depth + 1
  FROM employees e
  JOIN chain c ON e.manager_id = c.id
)
SELECT * FROM chain ORDER BY depth, name;`,
      language: 'sql',
      tags: ['sql', 'cte'],
      favorite: false,
      copyCount: 12,
    }, 7),

    seed({
      title: 'SQL index-friendly query',
      code: `-- uses index on (status, created_at)
SELECT id, title, status
FROM orders
WHERE status = 'open'
  AND created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 50;`,
      language: 'sql',
      tags: ['sql', 'performance'],
      favorite: false,
      copyCount: 8,
    }, 17),

    seed({
      title: 'Bash backup script',
      code: `#!/bin/bash
set -euo pipefail

SRC="\${1:-./src}"
DEST="\${2:-./backup}"
STAMP=\$(date +%Y%m%d_%H%M%S)

mkdir -p "\$DEST"
tar -czf "\$DEST/backup_\$STAMP.tar.gz" "\$SRC"
echo "Backup saved to \$DEST/backup_\$STAMP.tar.gz"`,
      language: 'bash',
      tags: ['bash', 'devops'],
      favorite: false,
      copyCount: 5,
    }, 18),

    seed({
      title: 'Bash find and replace',
      code: `#!/bin/bash
# Replace foo with bar in all .ts files
grep -rl 'foo' --include='*.ts' . | while read -r file; do
  sed -i 's/foo/bar/g' "\$file"
done`,
      language: 'bash',
      tags: ['bash', 'shell'],
      favorite: false,
      copyCount: 4,
    }, 19),

    seed({
      title: 'package.json scripts template',
      code: `{
  "name": "my-app",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts,.tsx",
    "test": "vitest run"
  }
}`,
      language: 'json',
      tags: ['json', 'config'],
      favorite: false,
      copyCount: 3,
    }, 20),

    seed({
      title: 'tsconfig strict baseline',
      code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true,
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "skipLibCheck": true
  },
  "include": ["src"]
}`,
      language: 'json',
      tags: ['json', 'typescript', 'config'],
      favorite: false,
      copyCount: 6,
    }, 21),

    seed({
      title: 'Flexbox center layout',
      code: `.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
}

.card {
  padding: 1.5rem;
  border-radius: 0.75rem;
  background: var(--surface);
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.1);
}`,
      language: 'css',
      tags: ['css', 'layout'],
      favorite: false,
      copyCount: 10,
    }, 8),

    seed({
      title: 'CSS grid dashboard',
      code: `.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}

.sidebar { grid-row: 1 / -1; }
.header { grid-column: 2; }
.main { grid-column: 2; padding: 1.5rem; }`,
      language: 'css',
      tags: ['css', 'grid', 'layout'],
      favorite: false,
      copyCount: 7,
    }, 22),

    seed({
      title: 'Semantic HTML shell',
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>App</title>
  </head>
  <body>
    <header><nav aria-label="Main"></nav></header>
    <main id="root"></main>
    <footer><small>&copy; 2026</small></footer>
  </body>
</html>`,
      language: 'html',
      tags: ['html', 'accessibility'],
      favorite: false,
      copyCount: 4,
    }, 23),

    seed({
      title: 'Accessible modal markup',
      code: `<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm delete</h2>
  <p>Are you sure you want to remove this snippet?</p>
  <button type="button">Cancel</button>
  <button type="button">Delete</button>
</div>`,
      language: 'html',
      tags: ['html', 'accessibility', 'a11y'],
      favorite: false,
      copyCount: 5,
    }, 24),

    seed({
      title: 'README project template',
      code: `# Project Name

Short description of what this project does.

## Setup
\`\`\`bash
npm install
npm run dev
\`\`\`

## Scripts
- \`npm run dev\` — start dev server
- \`npm run build\` — production build`,
      language: 'markdown',
      tags: ['markdown', 'docs'],
      favorite: false,
      copyCount: 2,
    }, 25),

    seed({
      title: 'Git cheat sheet',
      code: `# Create branch
git checkout -b feature/my-change

# Stage and commit
git add .
git commit -m "feat: add snippet filters"

# Push and open PR
git push -u origin HEAD`,
      language: 'markdown',
      tags: ['markdown', 'git'],
      favorite: false,
      copyCount: 8,
    }, 26),

    seed({
      title: 'Valid parentheses stack',
      code: `function isValid(s: string): boolean {
  const stack: string[] = []
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' }

  for (const ch of s) {
    if (ch === '(' || ch === '{' || ch === '[') stack.push(ch)
    else if (map[ch] !== stack.pop()) return false
  }
  return stack.length === 0
}`,
      language: 'typescript',
      tags: ['algorithms', 'interview', 'stack'],
      favorite: false,
      copyCount: 17,
    }, 4),

    seed({
      title: 'Sliding window max sum',
      code: `function maxSumSubarray(nums: number[], k: number): number {
  let window = nums.slice(0, k).reduce((a, b) => a + b, 0)
  let best = window
  for (let i = k; i < nums.length; i++) {
    window += nums[i] - nums[i - k]
    best = Math.max(best, window)
  }
  return best
}`,
      language: 'typescript',
      tags: ['algorithms', 'interview', 'sliding-window'],
      favorite: false,
      copyCount: 13,
    }, 9),

    seed({
      title: 'React useCallback memo child',
      code: `const handleSelect = useCallback((id: string) => {
  setSelected(id)
}, [])

return items.map(item => (
  <Row key={item.id} item={item} onSelect={handleSelect} />
))`,
      language: 'typescript',
      tags: ['react', 'performance', 'hooks'],
      favorite: false,
      copyCount: 9,
    }, 10),
  ]
}
