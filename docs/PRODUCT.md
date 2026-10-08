# Product

Personal site + notes for **Cheslav Zhuravsky**.

## Goal

- Public home: who I am, links, contact-ish surface.
- Notes from a local Obsidian vault (projects, months, countries).
- Readers: myself, other people, and AI agents (`llms.txt` + clear structure).

## Locked decisions

| Topic | Decision |
|---|---|
| Stack | Static Astro, no SSR. Versions, commands, and layout: [`DEV.md`](DEV.md) |
| Site data | `src/data/*.json` in git |
| Notes vault | Gitignored `content/notes/`. Folders: `projects/`, `areas/`, `journal/`. Conventions: that folder’s `AGENTS.md` |
| Publish notes | Markdown stays out of git. `astro build` includes only frontmatter `publish: ready`. `pnpm dev` still shows the vault. `pnpm notes:ready` lists the set |
| Wikilinks | `[[wikilinks]]` render as `/notes/.../` links. No backlinks or graph |
| Private paths | `content/notes/`, `archive/`, and `.env*` stay out of git. `pnpm check:private`; `pnpm prepare` installs a pre-push hook that runs it |
| Deploy | Local for now. GitHub Actions runs `pnpm test` |
| Old Gatsby UI | Do not port |

## Out of scope (now)

- Separate notes git repo or cloud sync as a product feature
- Backlinks, graph view, comments, search, CMS
- Railway / env files / GH_TOKEN for the site

## Salvage (`archive/`, local only)

Still useful if needed:

- `archive/projects.json` — old project list
- `archive/logo.png`, `archive/logo2.png`
- `archive/images/projects/` — screenshots

Already moved into the live site:

- about → `src/data/about.json`
- social/resume links → `src/data/links.json`

## Next

1. `public/llms.txt` (who I am + site map)
2. Sitemap
3. Optional: projects page from salvage / fresh data
4. Deploy later

## Constraints

- Prefer a clean Astro app over rewriting Gatsby leftovers.
- Keep the first version small and shippable.
