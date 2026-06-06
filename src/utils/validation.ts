import type { Language, SnippetInput } from '../types/snippet'
import { LANGUAGES } from './languages'
import { parseTagsInput } from './tags'

const VALID_LANGUAGES = new Set(LANGUAGES.map((l) => l.value))

export type ValidationResult =
  | { ok: true; value: SnippetInput }
  | { ok: false; errors: Record<string, string> }

export function validateSnippetInput(
  title: string,
  code: string,
  language: Language,
  tagsInput: string,
): ValidationResult {
  const errors: Record<string, string> = {}
  const trimmedTitle = title.trim()
  const trimmedCode = code.trim()

  if (!trimmedTitle) {
    errors.title = 'Title is required.'
  } else if (trimmedTitle.length > 120) {
    errors.title = 'Title must be 120 characters or fewer.'
  }

  if (!trimmedCode) {
    errors.code = 'Code is required.'
  } else if (trimmedCode.length > 50_000) {
    errors.code = 'Code must be 50,000 characters or fewer.'
  }

  if (!VALID_LANGUAGES.has(language)) {
    errors.language = 'Select a valid language.'
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : {
        ok: true,
        value: {
          title: trimmedTitle,
          code: trimmedCode,
          language,
          tags: parseTagsInput(tagsInput),
        },
      }
}

export function isValidLanguage(value: unknown): value is Language {
  return typeof value === 'string' && VALID_LANGUAGES.has(value as Language)
}
