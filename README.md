# Cheslav Zhuravsky — personal site

Static Astro site: home (“who I am”), social links, and notes from a local Obsidian vault.

## Requirements

- Node 24
- pnpm 10
- Prefer the Dev Container (`.devcontainer/`)

## Commands

| Command | Action |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Dev server at `http://localhost:4321` |
| `pnpm build` | Static build to `./dist/` |
| `pnpm preview` | Preview the production build |

## Layout

- Pages: `src/pages/`
- Site data: `src/data/about.json`, `src/data/links.json`
- Theme tokens: `src/styles/global.css`
- Notes vault: gitignored; Dev Container bind-mounts `NOTES_VAULT` onto it

## Docs

- Agent rules: [`AGENTS.md`](AGENTS.md)
- Product decisions / backlog: [`docs/PRODUCT.md`](docs/PRODUCT.md)
