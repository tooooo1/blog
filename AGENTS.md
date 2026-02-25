# AGENTS.md

## Cursor Cloud specific instructions

### Overview
Korean tech blog (정충일) built with **Next.js 14** + **MDX** + **Tailwind CSS v4**. Single-package project, no database, no external services required. Content is file-based MDX in `src/posts/` and `src/scribbles/`.

### Runtime
- Node.js v23.9.0 (specified in `.nvmrc`)
- Package manager: **bun** (lockfile: `bun.lockb`)

### Key commands
See `package.json` scripts:
- `bun run dev` — dev server on port 3000
- `bun run build` — production build
- `bun run lint` — ESLint via `next lint`

### Non-obvious notes
- The original repo was missing `eslint` and `eslint-config-next` as devDependencies despite having a `lint` script. These were added alongside `.eslintrc.json` (extends `next/core-web-vitals`). If these are not present, `bun run lint` will fail or prompt interactively.
- No `.env` files are required. No secrets needed.
- No automated test suite exists (`test` script is not defined).
- Tailwind CSS v4 uses `@tailwindcss/postcss` plugin (configured in `postcss.config.mjs`), not the classic `tailwind.config.js` approach.
