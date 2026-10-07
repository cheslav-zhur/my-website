# Product

Personal site + notes for **Cheslav Zhuravsky**.

## Goal

- Public home: who I am, links, contact-ish surface.
- Notes from a local Obsidian vault (projects, months, countries).
- Readers: myself, other people, and AI agents (`llms.txt` + clear structure).

## Locked decisions

| Topic | Decision |
|---|---|
| Stack | Astro, static (`astro build`). No SSR |
| Styling | Tailwind v4 + CSS tokens in `src/styles/global.css` |
| Package manager | pnpm 10 (Dev Container / corepack) |
| Site data | `src/data/*.json` in git |
| Notes | gitignored vault; Dev Container bind-mounts `NOTES_VAULT` onto it |
| Notes layout | `projects/`, `areas/`, `journal/` (+ vault `AGENTS.md`) |
| Notes format | frontmatter + tags + `[[wikilinks]]`; no backlinks/graph yet |
| Publish notes | md stays out of git; site consumes them at local build |
| Deploy | local for now — no CI |
| Old Gatsby UI | do not port |

## Out of scope (now)

- CI / GitHub Actions
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
3. Render `[[wikilinks]]` in notes
4. Optional: projects page from salvage / fresh data
5. Deploy later

## Constraints

- Prefer a clean Astro app over rewriting Gatsby leftovers.
- Do not commit notes or secrets.
- Keep the first version small and shippable.
