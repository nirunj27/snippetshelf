export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-')
}

export function parseTagsInput(input: string): string[] {
  return [...new Set(input.split(',').map(normalizeTag).filter(Boolean))]
}

export function collectAllTags(snippets: { tags: string[] }[]): string[] {
  const tagSet = new Set<string>()
  for (const snippet of snippets) {
    for (const tag of snippet.tags) {
      tagSet.add(tag)
    }
  }
  return [...tagSet].sort()
}
