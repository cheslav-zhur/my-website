# AGENTS.md

Reply to the owner in **Russian**. Keep this file, commit messages, code, comments, and identifiers in **English**.

## Project

Personal site for **Cheslav Zhuravsky**: a small public home (“who I am”) plus **Obsidian-style notes** (projects, months, countries).

Readers: the owner, other people, and AI agents (clear structure + a short “who I am”).

Product decisions and backlog: [`docs/PRODUCT.md`](docs/PRODUCT.md). Prefer that file over guessing.

## Stack (locked)

- **Astro**, static HTML (`astro build`). No SSR.
- **Tailwind CSS v4** via `@tailwindcss/vite`. Design tokens in `src/styles/global.css` (`@theme`).
- **pnpm** via corepack (`packageManager` in `package.json`), Node **24**, work in the **Dev Container**.
- Pages: TypeScript / `.astro` in git.
- Site copy/data: `src/data/*.json` in git.
- Notes vault: gitignored. Compose bind-mounts it from `NOTES_VAULT` in `.devcontainer/.env` (not the repo-root `.env`, not the shell). One `$` in `docker-compose.yml`. A Mac-absolute symlink is broken inside the container. After editing `.env`, rebuild the Dev Container.
- Notes format: frontmatter + tags + `[[wikilinks]]`. No backlinks/graph yet.
- Deploy: local for now. GitHub Actions runs `pnpm test`.

## Do not

- Commit the notes vault, `archive/`, secrets, or `.env*`
- Add SSR adapters, CMS, comments, search, a notes git repo, or CI beyond `pnpm test`
- Port the old Gatsby UI
- Install packages without asking first
- Expand scope past a small shippable site

## Layout

```
.devcontainer/          # Node 24 + pnpm
archive/                # gitignored local salvage; not the live site
content/notes/          # gitignored vault
src/content.config.ts   # notes collection loader
src/data/               # about.json, links.json
src/pages/              # home, notes, social
src/styles/global.css   # Tailwind + theme tokens
public/                 # favicon; llms.txt later
```

`public/llms.txt` + a sitemap are enough for visiting AI agents. No extra agent stack.

## Workflow

- `pnpm` only (not npm/yarn).
- Match `.prettierrc` (2 spaces, single quotes, printWidth 100).
- Keep the first version small. Propose extras; do not build them unasked.
- Visual tweaks: change tokens in `src/styles/global.css` first.
