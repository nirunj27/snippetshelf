import type { Language } from '../types/snippet'

type LanguagePattern = {
  language: Language
  patterns: RegExp[]
  weight?: number
}

const LANGUAGE_PATTERNS: LanguagePattern[] = [
  {
    language: 'sql',
    patterns: [
      /\bSELECT\b/i,
      /\bINSERT\s+INTO\b/i,
      /\bUPDATE\b.+\bSET\b/i,
      /\bDELETE\s+FROM\b/i,
      /\bCREATE\s+TABLE\b/i,
      /\bFROM\b.+\bWHERE\b/is,
      /\bJOIN\b/i,
      /\bGROUP\s+BY\b/i,
      /\bORDER\s+BY\b/i,
      /\bWITH\b.+\bAS\s*\(/is,
      /\bRANK\s*\(\s*\)\s+OVER\b/i,
    ],
  },
  {
    language: 'python',
    patterns: [
      /\bdef\s+\w+\s*\(/,
      /\bimport\s+\w+/,
      /\bfrom\s+\w+\s+import\b/,
      /\bclass\s+\w+/,
      /\belif\b/,
      /\bprint\s*\(/,
      /if\s+__name__\s*==\s*['"]__main__['"]/,
      /:\s*$/m,
    ],
  },
  {
    language: 'typescript',
    patterns: [
      /\binterface\s+\w+/,
      /\btype\s+\w+\s*=/,
      /:\s*(string|number|boolean|void|unknown|never)\b/,
      /\bexport\s+(type|interface)\b/,
      /<[A-Z]\w*>/,
    ],
  },
  {
    language: 'javascript',
    patterns: [
      /\bconst\s+\w+\s*=/,
      /\blet\s+\w+\s*=/,
      /\bfunction\s+\w*\s*\(/,
      /\bexport\s+(default\s+)?(function|const|class)\b/,
      /=>/,
      /\bconsole\.log\s*\(/,
    ],
  },
  {
    language: 'java',
    patterns: [
      /\bpublic\s+class\b/,
      /\bpublic\s+static\s+void\s+main\b/,
      /\bSystem\.out\.println\b/,
      /\bprivate\s+\w+/,
      /\bvoid\s+\w+\s*\(/,
    ],
  },
  {
    language: 'go',
    patterns: [
      /\bpackage\s+\w+/,
      /\bfunc\s+\w+\s*\(/,
      /:=/,
      /\bfmt\./,
      /\bimport\s*\(/,
    ],
  },
  {
    language: 'rust',
    patterns: [
      /\bfn\s+\w+\s*\(/,
      /\blet\s+mut\b/,
      /\bimpl\b/,
      /\bpub\s+fn\b/,
      /\bmatch\s+\w+/,
    ],
  },
  {
    language: 'bash',
    patterns: [
      /^#!\/bin\/(ba)?sh/m,
      /\becho\s+/,
      /\bexport\s+\w+=/,
      /\$\{\w+\}/,
      /\$\w+/,
    ],
  },
  {
    language: 'json',
    patterns: [/^\s*[\[{]/, /"[\w-]+"\s*:/],
  },
  {
    language: 'css',
    patterns: [
      /[\w.#-]+\s*\{[^}]*:[^}]*\}/,
      /@media\b/,
      /@import\b/,
    ],
  },
  {
    language: 'html',
    patterns: [
      /<!DOCTYPE\s+html/i,
      /<\/?(html|head|body|div|span|p|a|script|style)\b/i,
    ],
  },
  {
    language: 'markdown',
    patterns: [/^#{1,6}\s+\w/m, /```[\w]*/m, /\*\*[^*]+\*\*/, /^\s*[-*]\s+/m],
  },
]

const MIN_SCORE = 2
const MIN_LEAD = 1

function scoreLanguage(code: string, language: Language): number {
  const entry = LANGUAGE_PATTERNS.find((p) => p.language === language)
  if (!entry) return 0

  return entry.patterns.reduce((score, pattern) => {
    return pattern.test(code) ? score + 1 : score
  }, 0)
}

export function detectLikelyLanguage(code: string): Language | null {
  const trimmed = code.trim()
  if (trimmed.length < 10) return null

  const scores = LANGUAGE_PATTERNS.map(({ language }) => ({
    language,
    score: scoreLanguage(trimmed, language),
  })).sort((a, b) => b.score - a.score)

  const best = scores[0]
  const second = scores[1]

  if (!best || best.score < MIN_SCORE) return null
  if (second && best.score - second.score < MIN_LEAD) return null

  if (best.language === 'javascript' && scoreLanguage(trimmed, 'typescript') >= best.score) {
    return 'typescript'
  }

  return best.language
}

export function getLanguageMismatch(
  selected: Language,
  code: string,
): Language | null {
  const detected = detectLikelyLanguage(code)
  if (!detected || detected === selected) return null
  return detected
}
