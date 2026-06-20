# 퉁이리 블로그

Personal blog built with Next.js 14 App Router.

## Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS v4 (CSS-first, no config file)
- **Content**: MDX via `next-mdx-remote/rsc`
- **Syntax highlighting**: `rehype-pretty-code` + `shiki`
- **Theming**: `next-themes`
- **Language**: TypeScript 5

## Local development

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Production build
bun build

# Lint
bun run lint

# Auto-format
bun run format

# Check formatting
bun run format:check

# Type check
bun run typecheck

# Run tests
bun run test
```

## How to add a post

1. Create a new file at `src/posts/<slug>.mdx`.
2. Add the required frontmatter at the top of the file:

```mdx
---
title: "Post title"
description: "Short summary shown in previews."
category: "category-name"
tags: ["tag1", "tag2"]
publishedAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"   # optional
---

Post content goes here.
```

3. The post becomes available at `/blog/<slug>`.

## How to add a scribble

1. Create a new file at `src/scribbles/YYYY-MM-DD.mdx` (the filename is the date).
2. Add frontmatter:

```mdx
---
title: "Scribble title"
description: "Optional short summary."
---

Scribble content goes here.
```

3. The scribble becomes available at `/scribble/YYYY-MM-DD`.
