import type { Snippet } from '../types/snippet'
import { createSeedSnippets } from '../data/seedSnippets'

const STORAGE_KEY = 'snippetshelf:v2'
const LEGACY_STORAGE_KEY = 'snippetshelf:v1'

export function loadSnippets(): Snippet[] {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY)

    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createSeedSnippets()
    const parsed = JSON.parse(raw) as Snippet[]
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : createSeedSnippets()
  } catch {
    return createSeedSnippets()
  }
}

export function saveSnippets(snippets: Snippet[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets))
}
