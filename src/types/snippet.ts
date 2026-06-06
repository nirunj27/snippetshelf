export type Language =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'java'
  | 'go'
  | 'rust'
  | 'sql'
  | 'bash'
  | 'json'
  | 'css'
  | 'html'
  | 'markdown'

export type Snippet = {
  id: string
  title: string
  code: string
  language: Language
  tags: string[]
  favorite: boolean
  copyCount: number
  createdAt: string
  updatedAt: string
}

export type SnippetInput = Pick<Snippet, 'title' | 'code' | 'language' | 'tags'>

export type SortOption = 'recent' | 'oldest' | 'most-copied' | 'alphabetical'

export type ViewMode = 'list' | 'grid'

export type SnippetFilters = {
  search: string
  tags: string[]
  language: Language | 'all'
  favoritesOnly: boolean
  sort: SortOption
}
