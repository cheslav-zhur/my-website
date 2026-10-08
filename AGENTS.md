# AGENTS.md

Reply to the owner in **Russian**. Keep this file, commit messages, code, comments, and identifiers in **English**.

## Read first

- Product decisions and backlog: [`docs/PRODUCT.md`](docs/PRODUCT.md). Prefer that file over guessing.
- How to run the site, the stack, and the notes vault mount: [`docs/DEV.md`](docs/DEV.md).
- Note conventions, when the vault is mounted: `content/notes/AGENTS.md`.

## Do not

- Commit `content/notes/`, `archive/`, secrets, or `.env*`
- Add SSR adapters, CMS, comments, search, a notes git repo, or CI beyond `pnpm test`
- Port the old Gatsby UI
- Install packages without asking first
- Expand scope past a small shippable site
- Move `NOTES_VAULT` out of `.devcontainer/.env`, add a second `$` in `docker-compose.yml`, or replace the bind-mount with a host symlink

## Workflow

- `pnpm` only (not npm/yarn).
- Match `.prettierrc` (2 spaces, single quotes, printWidth 100).
- Keep the first version small. Propose extras; do not build them unasked.
- Visual tweaks: change tokens in `src/styles/global.css` first.
