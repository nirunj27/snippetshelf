import { useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { go } from '@codemirror/lang-go'
import { rust } from '@codemirror/lang-rust'
import { sql } from '@codemirror/lang-sql'
import { json } from '@codemirror/lang-json'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { markdown } from '@codemirror/lang-markdown'
import { StreamLanguage } from '@codemirror/language'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { githubLight } from '@uiw/codemirror-theme-github'
import type { Language } from '../../types/snippet'
import type { Theme } from '../../hooks/useTheme'
import { cn } from '../../design-system/cn'

type CodeEditorProps = {
  value: string
  onChange: (value: string) => void
  language: Language
  theme: Theme
  label?: string
  minHeight?: string
}

function getLanguageExtension(language: Language) {
  switch (language) {
    case 'typescript':
      return javascript({ typescript: true })
    case 'javascript':
      return javascript()
    case 'python':
      return python()
    case 'java':
      return java()
    case 'go':
      return go()
    case 'rust':
      return rust()
    case 'sql':
      return sql()
    case 'json':
      return json()
    case 'css':
      return css()
    case 'html':
      return html()
    case 'markdown':
      return markdown()
    case 'bash':
      return StreamLanguage.define(shell)
    default:
      return javascript()
  }
}

export function CodeEditor({
  value,
  onChange,
  language,
  theme,
  label = 'Code',
  minHeight = '180px',
}: CodeEditorProps) {
  const extensions = useMemo(() => [getLanguageExtension(language)], [language])
  const editorTheme = theme === 'dark' ? vscodeDark : githubLight

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        {label}
      </label>
      <div
        className={cn(
          'overflow-hidden rounded-lg border border-border-default',
          'focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20',
        )}
      >
        <CodeMirror
          value={value}
          height={minHeight}
          theme={editorTheme}
          extensions={extensions}
          onChange={onChange}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
            bracketMatching: true,
            autocompletion: false,
          }}
          className="text-sm font-mono [&_.cm-editor]:bg-bg-elevated [&_.cm-scroller]:min-h-[inherit]"
        />
      </div>
    </div>
  )
}
