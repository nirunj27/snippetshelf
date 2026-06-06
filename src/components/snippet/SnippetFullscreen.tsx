import { useEffect } from 'react'
import {
  Check,
  Copy,
  Link2,
  Pencil,
  Star,
  X,
} from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { Snippet } from '../../types/snippet'
import type { Theme } from '../../hooks/useTheme'
import { LANGUAGE_LABELS } from '../../utils/languages'
import { buildSnippetUrl } from '../../utils/share'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { IconButton } from '../ui/IconButton'

type SnippetFullscreenProps = {
  snippet: Snippet | null
  theme: Theme
  onClose: () => void
  onCopy: (id: string) => void
  onEdit: (snippet: Snippet) => void
  onToggleFavorite: (id: string) => void
  onShare: () => void
}

export function SnippetFullscreen({
  snippet,
  theme,
  onClose,
  onCopy,
  onEdit,
  onToggleFavorite,
  onShare,
}: SnippetFullscreenProps) {
  const { copy, copied } = useCopyToClipboard()
  const { copy: copyLink, copied: linkCopied } = useCopyToClipboard()

  useEffect(() => {
    if (!snippet) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [snippet, onClose])

  if (!snippet) return null

  const handleCopyCode = async () => {
    const ok = await copy(snippet.code)
    if (ok) onCopy(snippet.id)
  }

  const handleShare = async () => {
    const ok = await copyLink(buildSnippetUrl(snippet.id))
    if (ok) onShare()
  }

  const syntaxStyle = theme === 'dark' ? oneDark : oneLight

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg-base/95 backdrop-blur-md">
      <header className="flex items-center justify-between gap-4 border-b border-border-subtle px-4 py-3 sm:px-6">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold text-text-primary">
            {snippet.title}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge variant="language">{LANGUAGE_LABELS[snippet.language]}</Badge>
            {snippet.tags.map((tag) => (
              <Badge key={tag} variant="default">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <IconButton
            label={snippet.favorite ? 'Remove favorite' : 'Add favorite'}
            onClick={() => onToggleFavorite(snippet.id)}
            active={snippet.favorite}
          >
            <Star
              size={18}
              className={snippet.favorite ? 'fill-favorite text-favorite' : undefined}
            />
          </IconButton>
          <IconButton label="Share link" onClick={handleShare} active={linkCopied}>
            {linkCopied ? <Check size={18} className="text-success" /> : <Link2 size={18} />}
          </IconButton>
          <IconButton label="Edit" onClick={() => onEdit(snippet)}>
            <Pencil size={18} />
          </IconButton>
          <IconButton label="Close" onClick={onClose}>
            <X size={18} />
          </IconButton>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-border-default">
          <SyntaxHighlighter
            language={snippet.language}
            style={syntaxStyle}
            customStyle={{
              margin: 0,
              padding: '1.25rem',
              background: 'var(--color-bg-elevated)',
              fontSize: '0.875rem',
              lineHeight: '1.7',
              minHeight: '60vh',
            }}
            showLineNumbers
            lineNumberStyle={{
              color: 'var(--color-text-tertiary)',
              paddingRight: '1rem',
              minWidth: '2.5rem',
            }}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-border-subtle px-4 py-3 sm:px-6">
        <span className="text-xs text-text-tertiary tabular-nums">
          {snippet.copyCount} copies · Updated{' '}
          {new Date(snippet.updatedAt).toLocaleString()}
        </span>
        <Button
          variant="primary"
          leftIcon={copied ? <Check size={16} /> : <Copy size={16} />}
          onClick={handleCopyCode}
        >
          {copied ? 'Copied!' : 'Copy code'}
        </Button>
      </footer>
    </div>
  )
}
