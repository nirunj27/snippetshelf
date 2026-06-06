# SnippetShelf

Personal code library built with React 19 — save snippets with language, tags, syntax highlighting, favorites, and copy analytics.

## Features

- **Instant search** with `useDeferredValue` for smooth filtering (`/` keyboard shortcut)
- **Sort** by recent, oldest, most copied, or A → Z
- **Language filter** with per-language counts
- **Tag filters** + favorites toggle
- **Compound `SnippetCard`** — copy, favorite, duplicate, edit, delete
- **Delete confirmation** modal
- **Export / Import** JSON (merge or replace)
- **Toast notifications** for all actions
- **Copy analytics** — top copied snippets, total copies, most-used language
- **Quick access panel** — favorites & recently updated with one-click copy
- **Light / dark toggle** — Midnight Sapphire themes with persistence
- **Grid / list view** — toggle layout, preference saved
- **Tag click on card** — click any tag to filter instantly
- **Full-screen snippet view** — expand any snippet for focused reading
- **CodeMirror editor** — syntax-aware editing in the form
- **Shareable links** — `#snippet/{id}` URLs with copy-link button
- **Undo delete** — 6-second undo toast after deletion

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 design system
- react-syntax-highlighter
- lucide-react icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build
# snippetshelf