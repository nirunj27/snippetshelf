import type { Snippet } from '../types/snippet'
import { isValidLanguage } from './validation'
import { normalizeTag } from './tags'

const MAX_IMPORT_FILE_BYTES = 5 * 1024 * 1024

export function exportSnippets(
  snippets: Snippet[],
  options?: { filtered?: boolean },
): void {
  if (snippets.length === 0) {
    throw new Error('No snippets to export.')
  }

  const suffix = options?.filtered ? '-filtered' : ''
  const blob = new Blob([JSON.stringify(snippets, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `snippetshelf-export${suffix}-${new Date().toISOString().slice(0, 10)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

export function parseImportedSnippets(raw: string): Snippet[] {
  let parsed: unknown

  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Invalid JSON file.')
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Invalid file: expected a JSON array of snippets.')
  }

  if (parsed.length === 0) {
    throw new Error('Import file contains no snippets.')
  }

  return parsed.map((item, index) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Invalid snippet at index ${index}.`)
    }

    const record = item as Record<string, unknown>
    const title = typeof record.title === 'string' ? record.title.trim() : ''
    const code = typeof record.code === 'string' ? record.code.trim() : ''

    if (!title) {
      throw new Error(`Snippet at index ${index} is missing a title.`)
    }

    if (!code) {
      throw new Error(`Snippet at index ${index} is missing code.`)
    }

    const language = isValidLanguage(record.language)
      ? record.language
      : 'typescript'

    const tags = Array.isArray(record.tags)
      ? [...new Set(record.tags.map((t) => (typeof t === 'string' ? normalizeTag(t) : '')).filter(Boolean))]
      : []

    const now = new Date().toISOString()

    return {
      id: typeof record.id === 'string' && record.id ? record.id : crypto.randomUUID(),
      title,
      code,
      language,
      tags,
      favorite: Boolean(record.favorite),
      copyCount:
        typeof record.copyCount === 'number' && record.copyCount >= 0
          ? Math.floor(record.copyCount)
          : 0,
      createdAt: typeof record.createdAt === 'string' ? record.createdAt : now,
      updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : now,
    }
  })
}

export function validateImportFile(file: File): void {
  if (!file.name.endsWith('.json') && file.type !== 'application/json') {
    throw new Error('Please select a .json file.')
  }

  if (file.size > MAX_IMPORT_FILE_BYTES) {
    throw new Error('File is too large. Maximum size is 5 MB.')
  }
}
