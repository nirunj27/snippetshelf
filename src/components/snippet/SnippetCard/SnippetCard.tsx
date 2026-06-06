import { useState } from 'react'
import {
  Check,
  Copy,
  CopyPlus,
  Expand,
  Link2,
  Pencil,
  Star,
  Trash2,
} from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { Snippet, ViewMode } from '../../../types/snippet'
import type { Theme } from '../../../hooks/useTheme'
import { LANGUAGE_LABELS } from '../../../utils/languages'
import { buildSnippetUrl } from '../../../utils/share'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'
import { Badge } from '../../ui/Badge'
import { Card } from '../../ui/Card'
import { IconButton } from '../../ui/IconButton'
import { cn } from '../../../design-system/cn'
import { SnippetCardProvider, useSnippetCard } from './SnippetCardContext'

type SnippetCardProps = {
  snippet: Snippet
  viewMode?: ViewMode
  theme: Theme
  onCopy: (id: string) => void
  onToggleFavorite: (id: string) => void
  onDuplicate: (id: string) => void
  onEdit: (snippet: Snippet) => void
  onDelete: (id: string) => void
  onOpen: (snippet: Snippet) => void
  onShare: () => void
  onTagClick: (tag: string) => void
  children?: React.ReactNode
}

function SnippetCardRoot({
  snippet,
  viewMode = 'list',
  theme,
  onCopy,
  onToggleFavorite,
  onDuplicate,
  onEdit,
  onDelete,
  onOpen,
  onShare,
  onTagClick,
  children,
}: SnippetCardProps) {
  const { copy, copied } = useCopyToClipboard()
  const { copy: copyLink, copied: linkCopied } = useCopyToClipboard()

  const handleCopy = async () => {
    const success = await copy(snippet.code)
    if (success) onCopy(snippet.id)
  }

  const handleShare = async () => {
    const success = await copyLink(buildSnippetUrl(snippet.id))
    if (success) onShare()
  }

  const defaultLayout = (
    <>
      <SnippetCard.Header />
      <SnippetCard.Tags />
      <SnippetCard.Code />
      <SnippetCard.Actions />
    </>
  )

  return (
    <SnippetCardProvider
      value={{
        snippet,
        viewMode,
        theme,
        onCopy: handleCopy,
        onToggleFavorite: () => onToggleFavorite(snippet.id),
        onDuplicate: () => onDuplicate(snippet.id),
        onEdit: () => onEdit(snippet),
        onDelete: () => onDelete(snippet.id),
        onOpen: () => onOpen(snippet),
        onShare: handleShare,
        onTagClick,
        copied,
        linkCopied,
      }}
    >
      <Card
        className={cn(
          'group overflow-hidden transition-all duration-200 hover:border-border-default hover:shadow-md',
          viewMode === 'grid' && 'h-full flex flex-col',
        )}
      >
        {children ?? defaultLayout}
      </Card>
    </SnippetCardProvider>
  )
}

function Header() {
  const { snippet, viewMode, onOpen } = useSnippetCard()

  return (
    <div className="flex items-start justify-between gap-3 border-b border-border-subtle px-4 py-3">
      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 text-left transition-colors hover:text-accent"
      >
        <h3 className="truncate text-sm font-semibold text-text-primary group-hover:text-accent">
          {snippet.title}
        </h3>
        {viewMode === 'list' && (
          <p className="mt-0.5 text-xs text-text-tertiary">
            Updated {new Date(snippet.updatedAt).toLocaleDateString()}
          </p>
        )}
      </button>
      <Badge variant="language">{LANGUAGE_LABELS[snippet.language]}</Badge>
    </div>
  )
}

function Tags() {
  const { snippet, onTagClick } = useSnippetCard()
  if (snippet.tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 px-4 pt-3">
      {snippet.tags.map((tag) => (
        <Badge
          key={tag}
          variant="default"
          interactive
          onClick={() => onTagClick(tag)}
        >
          #{tag}
        </Badge>
      ))}
    </div>
  )
}

function Code() {
  const { snippet, viewMode, theme, onOpen } = useSnippetCard()
  const [expanded, setExpanded] = useState(false)
  const lineCount = snippet.code.split('\n').length
  const isLong = lineCount > 12
  const isGrid = viewMode === 'grid'
  const syntaxStyle = theme === 'dark' ? oneDark : oneLight

  return (
    <div className={cn('relative px-4 py-3', isGrid && 'flex-1')}>
      <div
        className={cn(
          'overflow-hidden rounded-lg border border-border-subtle',
          !expanded && isLong && !isGrid && 'max-h-[280px]',
          isGrid && 'max-h-[160px]',
        )}
      >
        <SyntaxHighlighter
          language={snippet.language}
          style={syntaxStyle}
          customStyle={{
            margin: 0,
            padding: isGrid ? '0.75rem' : '1rem',
            background: 'var(--color-bg-elevated)',
            fontSize: '0.8125rem',
            lineHeight: '1.6',
          }}
          showLineNumbers={!isGrid && lineCount > 3}
          lineNumberStyle={{
            color: 'var(--color-text-tertiary)',
            paddingRight: '1rem',
            minWidth: '2.5rem',
          }}
        >
          {snippet.code}
        </SyntaxHighlighter>
      </div>
      <div className="mt-2 flex items-center gap-3">
        {!isGrid && isLong && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
          >
            {expanded ? 'Show less' : `Show all ${lineCount} lines`}
          </button>
        )}
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-1 text-xs font-medium text-text-tertiary hover:text-accent transition-colors"
        >
          <Expand size={12} />
          Full screen
        </button>
      </div>
    </div>
  )
}

function Actions() {
  const {
    snippet,
    onCopy,
    onToggleFavorite,
    onDuplicate,
    onEdit,
    onDelete,
    onShare,
    copied,
    linkCopied,
  } = useSnippetCard()

  return (
    <div className="flex items-center justify-between border-t border-border-subtle px-3 py-2 mt-auto">
      <div className="flex items-center gap-0.5">
        <IconButton
          label={copied ? 'Copied' : 'Copy snippet'}
          onClick={onCopy}
          active={copied}
        >
          {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
        </IconButton>
        <IconButton
          label={linkCopied ? 'Link copied' : 'Copy share link'}
          onClick={onShare}
          active={linkCopied}
        >
          {linkCopied ? (
            <Check size={16} className="text-success" />
          ) : (
            <Link2 size={16} />
          )}
        </IconButton>
        <IconButton
          label={snippet.favorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={onToggleFavorite}
          active={snippet.favorite}
        >
          <Star
            size={16}
            className={snippet.favorite ? 'fill-favorite text-favorite' : undefined}
          />
        </IconButton>
        <IconButton label="Duplicate snippet" onClick={onDuplicate}>
          <CopyPlus size={16} />
        </IconButton>
        <IconButton label="Edit snippet" onClick={onEdit}>
          <Pencil size={16} />
        </IconButton>
        <IconButton
          label="Delete snippet"
          onClick={onDelete}
          className="hover:text-danger"
        >
          <Trash2 size={16} />
        </IconButton>
      </div>
      <span className="text-xs text-text-tertiary tabular-nums">
        {snippet.copyCount} {snippet.copyCount === 1 ? 'copy' : 'copies'}
      </span>
    </div>
  )
}

export const SnippetCard = Object.assign(SnippetCardRoot, {
  Header,
  Tags,
  Code,
  Actions,
})
