import { useDeferredValue, useMemo, useState } from 'react'
import type { Language, Snippet, SnippetFilters, SortOption } from '../types/snippet'

function sortSnippets(snippets: Snippet[], sort: SortOption): Snippet[] {
  const sorted = [...snippets]

  switch (sort) {
    case 'recent':
      return sorted.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
    case 'oldest':
      return sorted.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
    case 'most-copied':
      return sorted.sort((a, b) => b.copyCount - a.copyCount)
    case 'alphabetical':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return sorted
  }
}

export function useSnippetFilters(snippets: Snippet[]) {
  const [search, setSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [language, setLanguage] = useState<Language | 'all'>('all')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [sort, setSort] = useState<SortOption>('recent')

  const deferredSearch = useDeferredValue(search)
  const isSearchStale = search !== deferredSearch

  const filteredSnippets = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase()

    const filtered = snippets.filter((snippet) => {
      if (favoritesOnly && !snippet.favorite) return false
      if (language !== 'all' && snippet.language !== language) return false

      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every((tag) =>
          snippet.tags.includes(tag),
        )
        if (!hasAllTags) return false
      }

      if (!query) return true

      const haystack = [
        snippet.title,
        snippet.code,
        snippet.language,
        ...snippet.tags,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })

    return sortSnippets(filtered, sort)
  }, [snippets, deferredSearch, selectedTags, language, favoritesOnly, sort])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  const addTagFilter = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]))
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedTags([])
    setLanguage('all')
    setFavoritesOnly(false)
    setSort('recent')
  }

  const hasContentFilters =
    search.length > 0 ||
    selectedTags.length > 0 ||
    favoritesOnly ||
    language !== 'all'

  const hasActiveFilters = hasContentFilters || sort !== 'recent'

  return {
    filters: {
      search,
      tags: selectedTags,
      language,
      favoritesOnly,
      sort,
    } satisfies SnippetFilters,
    deferredSearch,
    isSearchStale,
    filteredSnippets,
    hasContentFilters,
    setSearch,
    toggleTag,
    addTagFilter,
    setLanguage,
    setFavoritesOnly,
    setSort,
    clearFilters,
    hasActiveFilters,
  }
}

export type SnippetFilterState = ReturnType<typeof useSnippetFilters>
