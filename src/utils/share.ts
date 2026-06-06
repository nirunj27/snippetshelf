const HASH_PREFIX = 'snippet/'

export function buildSnippetUrl(id: string): string {
  const base = `${window.location.origin}${window.location.pathname}`
  return `${base}#${HASH_PREFIX}${id}`
}

export function parseSnippetIdFromHash(): string | null {
  const match = window.location.hash.match(/^#snippet\/([^/?#]+)/)
  return match?.[1] ?? null
}

export function setSnippetHash(id: string | null): void {
  if (id) {
    window.location.hash = `${HASH_PREFIX}${id}`
    return
  }

  if (window.location.hash.startsWith(`#${HASH_PREFIX}`)) {
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
}
