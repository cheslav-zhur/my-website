# Development

How to run the site. Product decisions: [`PRODUCT.md`](PRODUCT.md).

## Stack

- Astro, static HTML (`astro build`). No SSR.
- Tailwind CSS v4 via `@tailwindcss/vite`. Tokens in `src/styles/global.css` (`@theme`).
- pnpm via corepack (`packageManager` in `package.json`). Node 24. Dev Container (`.devcontainer/`).

## Commands

| Command | Action |
|---|---|
| `pnpm install` | Install dependencies. Also installs the pre-push hook (`prepare`) |
| `pnpm dev` | Dev server at `http://localhost:4321` (whole vault, including drafts) |
| `pnpm notes:ready` | List notes with `publish: ready` |
| `pnpm check:private` | Fail if git tracks `content/notes/`, `archive/`, or `.env*` |
| `pnpm test` | Vitest. GitHub Actions runs this on push and pull request (`.github/workflows/test.yml`) |
| `pnpm build` | Static build to `./dist/` (`publish: ready` only) |
| `pnpm preview` | Preview the production build |

## Notes vault

Gitignored at `content/notes/`. The Dev Container bind-mounts it from `NOTES_VAULT` in `.devcontainer/.env` (not a repo-root `.env`, not the shell). `docker-compose.yml` uses one `$`. A Mac-absolute symlink does not resolve inside the container. After editing that `.env`, rebuild the Dev Container.

Note conventions live in `content/notes/AGENTS.md` when the vault is mounted.

## Layout

- Pages: `src/pages/` — `/`, `/social/`, `/notes/`
- Site data: `src/data/about.json`, `src/data/links.json`
- Theme tokens: `src/styles/global.css`
- Notes loader: `src/content.config.ts`; helpers in `src/lib/`
