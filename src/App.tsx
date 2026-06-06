import { useCallback, useMemo, useRef, useState } from 'react'
import { BookMarked, Library } from 'lucide-react'
import type { Snippet, SnippetInput, ViewMode } from './types/snippet'
import { useSnippets } from './hooks/useSnippets'
import { useSnippetFilters } from './hooks/useSnippetFilters'
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut'
import { useToast } from './hooks/useToast'
import { useTheme } from './hooks/useTheme'
import { useSnippetHash } from './hooks/useSnippetHash'
import { collectAllTags } from './utils/tags'
import { exportSnippets, parseImportedSnippets, validateImportFile } from './utils/importExport'
import { setSnippetHash } from './utils/share'
import { SearchBar } from './components/search/SearchBar'
import { TagFilter } from './components/search/TagFilter'
import { SortSelect } from './components/search/SortSelect'
import { LanguageFilter } from './components/search/LanguageFilter'
import { ViewToggle } from './components/search/ViewToggle'
import { SnippetForm } from './components/snippet/SnippetForm'
import { SnippetList } from './components/snippet/SnippetList'
import { SnippetFullscreen } from './components/snippet/SnippetFullscreen'
import { CopyAnalytics } from './components/analytics/CopyAnalytics'
import { QuickAccessPanel } from './components/sidebar/QuickAccessPanel'
import { HeaderActions } from './components/layout/HeaderActions'
import { ThemeToggle } from './components/layout/ThemeToggle'
import { Modal } from './components/ui/Modal'
import { ToastContainer } from './components/ui/Toast'
import { Button } from './components/ui/Button'
import { Card, CardBody } from './components/ui/Card'

const VIEW_STORAGE_KEY = 'snippetshelf:view'

export default function App() {
  const searchRef = useRef<HTMLInputElement>(null)
  const { theme, toggleTheme } = useTheme()
  const { toasts, show, dismiss } = useToast()

  const {
    snippets,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    restoreSnippet,
    duplicateSnippet,
    importSnippets,
    toggleFavorite,
    incrementCopyCount,
  } = useSnippets()

  const {
    filteredSnippets,
    isSearchStale,
    hasActiveFilters,
    hasContentFilters,
    setSearch,
    toggleTag,
    addTagFilter,
    setLanguage,
    setFavoritesOnly,
    setSort,
    clearFilters,
    filters,
  } = useSnippetFilters(snippets)

  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Snippet | null>(null)
  const [importPreview, setImportPreview] = useState<Snippet[] | null>(null)
  const [fullscreenSnippet, setFullscreenSnippet] = useState<Snippet | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const stored = localStorage.getItem(VIEW_STORAGE_KEY)
    return stored === 'grid' ? 'grid' : 'list'
  })

  const allTags = collectAllTags(snippets)

  const languageCounts = useMemo(() => {
    return snippets.reduce<Record<string, number>>((acc, s) => {
      acc[s.language] = (acc[s.language] ?? 0) + 1
      return acc
    }, {})
  }, [snippets])

  const openFullscreen = useCallback(
    (snippet: Snippet) => {
      setFullscreenSnippet(snippet)
      setSnippetHash(snippet.id)
    },
    [],
  )

  const closeFullscreen = useCallback(() => {
    setFullscreenSnippet(null)
    setSnippetHash(null)
  }, [])

  const handleHashOpen = useCallback(
    (id: string) => {
      const snippet = snippets.find((s) => s.id === id)
      if (snippet) setFullscreenSnippet(snippet)
    },
    [snippets],
  )

  useSnippetHash(handleHashOpen)

  const focusSearch = useCallback(() => {
    searchRef.current?.focus()
  }, [])

  useKeyboardShortcut('/', focusSearch)

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem(VIEW_STORAGE_KEY, mode)
  }

  const handleShowFavorites = () => {
    clearFilters()
    setFavoritesOnly(true)
    show('Showing favorites')
  }

  const handleTagClick = (tag: string) => {
    addTagFilter(tag)
    show(`Filtered by #${tag}`)
  }

  const handleSubmit = (input: SnippetInput) => {
    if (editingSnippet) {
      updateSnippet(editingSnippet.id, input)
      setEditingSnippet(null)
      show('Snippet updated')
    } else {
      addSnippet(input)
      show('Snippet added')
    }
  }

  const handleEdit = (snippet: Snippet) => {
    closeFullscreen()
    setEditingSnippet(snippet)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteRequest = (id: string) => {
    const target = snippets.find((s) => s.id === id)
    if (target) setDeleteTarget(target)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return

    const deleted = deleteTarget
    const index = snippets.findIndex((s) => s.id === deleted.id)

    deleteSnippet(deleted.id)
    if (editingSnippet?.id === deleted.id) setEditingSnippet(null)
    if (fullscreenSnippet?.id === deleted.id) closeFullscreen()
    setDeleteTarget(null)

    show('Snippet deleted', 'info', {
      durationMs: 6000,
      action: {
        label: 'Undo',
        onClick: () => {
          restoreSnippet(deleted, index)
          show('Snippet restored')
        },
      },
    })
  }

  const handleDuplicate = (id: string) => {
    duplicateSnippet(id)
    show('Snippet duplicated')
  }

  const handleExport = () => {
    try {
      const exportingFiltered = hasContentFilters
      const toExport = exportingFiltered ? filteredSnippets : snippets

      exportSnippets(toExport, { filtered: exportingFiltered })

      show(
        exportingFiltered
          ? `Exported ${toExport.length} filtered snippet${toExport.length === 1 ? '' : 's'}`
          : `Exported all ${toExport.length} snippets`,
      )
    } catch (err) {
      show(err instanceof Error ? err.message : 'Export failed', 'error')
    }
  }

  const handleImportFile = async (file: File) => {
    try {
      validateImportFile(file)
      const text = await file.text()
      const parsed = parseImportedSnippets(text)
      setImportPreview(parsed)
    } catch (err) {
      show(err instanceof Error ? err.message : 'Import failed', 'error')
    }
  }

  const confirmImport = (mode: 'merge' | 'replace') => {
    if (!importPreview) return
    importSnippets(importPreview, mode)
    show(
      mode === 'replace'
        ? `Replaced library with ${importPreview.length} snippets`
        : `Imported ${importPreview.length} snippets`,
    )
    setImportPreview(null)
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute top-1/4 -right-24 h-[360px] w-[420px] rounded-full bg-favorite/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[280px] w-[360px] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <header className="relative border-b border-border-subtle bg-bg-base/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-muted border border-accent-border shadow-glow">
              <Library size={20} className="text-accent" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-text-primary">
                SnippetShelf
              </h1>
              <p className="text-xs text-text-tertiary">Personal code library</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-surface px-3 py-1.5 text-xs text-text-tertiary">
              <BookMarked size={12} className="text-accent" />
              <span className="tabular-nums text-text-secondary font-medium">
                {snippets.length}
              </span>
              snippets
            </div>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <HeaderActions
              onExport={handleExport}
              onImport={handleImportFile}
              exportLabel={
                hasContentFilters
                  ? `Export (${filteredSnippets.length})`
                  : 'Export'
              }
              exportHint={
                hasContentFilters
                  ? `Export ${filteredSnippets.length} filtered snippets`
                  : `Export all ${snippets.length} snippets`
              }
            />
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_280px] xl:grid-cols-[300px_1fr_300px]">
          <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
            <SnippetForm
              editingSnippet={editingSnippet}
              theme={theme}
              onSubmit={handleSubmit}
              onCancel={() => setEditingSnippet(null)}
            />
            <QuickAccessPanel
              snippets={snippets}
              onCopy={incrementCopyCount}
              onEdit={handleEdit}
              onShowFavorites={handleShowFavorites}
            />
          </aside>

          <section className="flex flex-col gap-4 min-w-0">
            <SearchBar
              ref={searchRef}
              value={filters.search}
              onChange={setSearch}
              isStale={isSearchStale}
            />

            <div className="flex items-center justify-between gap-3 text-xs text-text-tertiary">
              <span>
                Showing{' '}
                <span className="font-medium text-text-secondary tabular-nums">
                  {filteredSnippets.length}
                </span>{' '}
                of{' '}
                <span className="font-medium text-text-secondary tabular-nums">
                  {snippets.length}
                </span>{' '}
                snippets
              </span>
              <div className="flex items-center gap-3">
                {isSearchStale && (
                  <span className="text-accent animate-pulse">Searching...</span>
                )}
                <ViewToggle value={viewMode} onChange={handleViewChange} />
              </div>
            </div>

            <Card>
              <CardBody className="flex flex-col gap-5">
                <SortSelect value={filters.sort} onChange={setSort} />
                <LanguageFilter
                  value={filters.language}
                  onChange={setLanguage}
                  snippetCounts={languageCounts}
                />
                <TagFilter
                  allTags={allTags}
                  selectedTags={filters.tags}
                  favoritesOnly={filters.favoritesOnly}
                  onToggleTag={toggleTag}
                  onToggleFavorites={setFavoritesOnly}
                  onClear={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </CardBody>
            </Card>

            <SnippetList
              snippets={filteredSnippets}
              viewMode={viewMode}
              theme={theme}
              isSearchStale={isSearchStale}
              hasActiveFilters={hasActiveFilters}
              onCopy={incrementCopyCount}
              onToggleFavorite={toggleFavorite}
              onDuplicate={handleDuplicate}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
              onOpen={openFullscreen}
              onShare={() => show('Share link copied')}
              onTagClick={handleTagClick}
              onClearFilters={clearFilters}
            />
          </section>

          <aside className="hidden lg:flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
            <CopyAnalytics snippets={snippets} />
          </aside>
        </div>
      </main>

      <SnippetFullscreen
        snippet={fullscreenSnippet}
        theme={theme}
        onClose={closeFullscreen}
        onCopy={incrementCopyCount}
        onEdit={handleEdit}
        onToggleFavorite={toggleFavorite}
        onShare={() => show('Share link copied')}
      />

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete snippet?"
        description={deleteTarget?.title}
      >
        <p className="text-sm text-text-secondary">
          You can undo this action within 6 seconds after deleting.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>

      <Modal
        open={Boolean(importPreview)}
        onClose={() => setImportPreview(null)}
        title="Import snippets"
        description={`Found ${importPreview?.length ?? 0} snippets in file`}
      >
        <p className="text-sm text-text-secondary">
          Choose how to import. Merge keeps your existing snippets; Replace
          overwrites the entire library.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => setImportPreview(null)}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={() => confirmImport('merge')}>
            Merge
          </Button>
          <Button variant="primary" onClick={() => confirmImport('replace')}>
            Replace all
          </Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}
