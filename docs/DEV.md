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
| `pnpm run deploy` | Local production build, then upload it. Not `pnpm deploy` (that is a pnpm command) |

## Notes vault

Gitignored at `content/notes/`. The Dev Container bind-mounts it from `NOTES_VAULT` in `.devcontainer/.env` (not a repo-root `.env`, not the shell). `docker-compose.yml` uses one `$`. A Mac-absolute symlink does not resolve inside the container. After editing that `.env`, rebuild the Dev Container.

Note conventions live in `content/notes/AGENTS.md` when the vault is mounted.

## Deploy

The site is hosted on Vercel. The domain stays at the registrar. `vercel.json` sets `git.deploymentEnabled` to false, so a git push does not build there. Notes are not in git, so the build has to happen on a machine that has the vault.

`pnpm run deploy` runs `vercel build --prod`, then `vercel deploy --prebuilt --prod`. The Vercel CLI is installed in the Dev Container image, not as a project dependency. `VERCEL_TOKEN` lives in `.devcontainer/.env` and is passed in by `docker-compose.yml`. Recreate the container after changing it.

The project must already be linked. `.vercel/project.json` holds `projectId`, `orgId`, `projectName`, and local build settings. Do not set `scope` in `vercel.json` or pass `--scope`.

A project-scoped token is enough for that script (checked on CLI 63.0.1):

- `vercel build` and `vercel deploy` do call `GET /v2/user`, but only for telemetry. A failure there is ignored.
- The command stops on that error only when a scope is set.
- `vercel deploy` without `--dry` does not look up the project owner. It uses `.vercel/project.json`.
- `vercel build --prod` does not call the API when those local settings exist.

A full-account token is needed for `vercel whoami`, `vercel pull`, and creating new tokens. `vercel whoami` failing with `User not found` does not mean deploy will fail.

## Layout

- Pages: `src/pages/` — `/`, `/social/`, `/notes/`
- Site data: `src/data/about.json`, `src/data/links.json`
- Theme tokens: `src/styles/global.css`
- Notes loader: `src/content.config.ts`; helpers in `src/lib/`
