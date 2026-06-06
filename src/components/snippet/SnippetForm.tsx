import { useEffect, useMemo, useState } from 'react'
import { Plus, Save, X } from 'lucide-react'
import type { Language, Snippet, SnippetInput } from '../../types/snippet'
import type { Theme } from '../../hooks/useTheme'
import { LANGUAGES } from '../../utils/languages'
import { getLanguageMismatch } from '../../utils/detectLanguage'
import { validateSnippetInput } from '../../utils/validation'
import { CodeEditor } from '../editor/CodeEditor'
import { LanguageMismatchWarning } from './LanguageMismatchWarning'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Card, CardBody, CardHeader } from '../ui/Card'

type SnippetFormProps = {
  editingSnippet?: Snippet | null
  theme: Theme
  onSubmit: (input: SnippetInput) => void
  onCancel?: () => void
}

const emptyForm = (): SnippetInput => ({
  title: '',
  code: '',
  language: 'typescript',
  tags: [],
})

export function SnippetForm({ editingSnippet, theme, onSubmit, onCancel }: SnippetFormProps) {
  const [form, setForm] = useState<SnippetInput>(emptyForm)
  const [tagsInput, setTagsInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [dismissedPair, setDismissedPair] = useState<string | null>(null)
  const isEditing = Boolean(editingSnippet)

  const suggestedLanguage = useMemo(
    () => getLanguageMismatch(form.language, form.code),
    [form.language, form.code],
  )

  const mismatchKey = suggestedLanguage
    ? `${form.language}:${suggestedLanguage}`
    : null

  const showMismatchWarning =
    mismatchKey !== null && dismissedPair !== mismatchKey

  useEffect(() => {
    if (editingSnippet) {
      setForm({
        title: editingSnippet.title,
        code: editingSnippet.code,
        language: editingSnippet.language,
        tags: editingSnippet.tags,
      })
      setTagsInput(editingSnippet.tags.join(', '))
    } else {
      setForm(emptyForm())
      setTagsInput('')
    }
    setErrors({})
    setDismissedPair(null)
  }, [editingSnippet])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = validateSnippetInput(
      form.title,
      form.code,
      form.language,
      tagsInput,
    )

    if (!result.ok) {
      setErrors(result.errors)
      return
    }

    setErrors({})
    onSubmit(result.value)

    if (!isEditing) {
      setForm(emptyForm())
      setTagsInput('')
      setDismissedPair(null)
    }
  }

  const handleSwitchLanguage = () => {
    if (!suggestedLanguage) return
    setForm((f) => ({ ...f, language: suggestedLanguage }))
    setDismissedPair(null)
  }

  return (
    <Card glow={isEditing}>
      <CardHeader>
        <div>
          <h2 className="text-sm font-semibold text-text-primary">
            {isEditing ? 'Edit snippet' : 'New snippet'}
          </h2>
          <p className="text-xs text-text-tertiary mt-0.5">
            {isEditing ? 'Update your saved code' : 'Add code to your library'}
          </p>
        </div>
        {isEditing && onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel} leftIcon={<X size={14} />}>
            Cancel
          </Button>
        )}
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            label="Title"
            placeholder="Snippet title"
            value={form.title}
            onChange={(e) => {
              setForm((f) => ({ ...f, title: e.target.value }))
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }))
            }}
            aria-invalid={Boolean(errors.title)}
            hint={errors.title}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Language"
              options={LANGUAGES}
              value={form.language}
              onChange={(e) =>
                setForm((f) => ({ ...f, language: e.target.value as Language }))
              }
            />
            <Input
              label="Tags"
              placeholder="react, hooks, interview"
              hint="Comma-separated"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <CodeEditor
              value={form.code}
              onChange={(code) => {
                setForm((f) => ({ ...f, code }))
                if (errors.code) setErrors((prev) => ({ ...prev, code: '' }))
              }}
              language={form.language}
              theme={theme}
            />
            {errors.code && (
              <p className="text-xs text-danger">{errors.code}</p>
            )}
          </div>

          {showMismatchWarning && suggestedLanguage && (
            <LanguageMismatchWarning
              selected={form.language}
              suggested={suggestedLanguage}
              onSwitch={handleSwitchLanguage}
              onDismiss={() => mismatchKey && setDismissedPair(mismatchKey)}
            />
          )}

          <Button
            type="submit"
            variant="primary"
            leftIcon={isEditing ? <Save size={16} /> : <Plus size={16} />}
          >
            {isEditing ? 'Save changes' : 'Add snippet'}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
