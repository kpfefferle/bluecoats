# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit application that displays historical DCI (Drum Corps International) competition scores for the Bluecoats drum and bugle corps. The app visualizes score progression throughout competitive seasons and provides daily ranking data. It is a fully prerendered static SPA deployed to GitHub Pages under the custom domain `bluecoats.pfefferle.me`.

## Migration Status

This codebase was migrated from Ember.js to SvelteKit in three phased PRs:

- **PR 1 (this commit)**: Scaffold + layout/nav + CI. Both routes are stubs ("Coming soon").
- **PR 2 (planned)**: Data layer + `/daily-rankings` route.
- **PR 3 (planned)**: `/` route with chart action and `buildChartOption`.

Until PR 2/3 land, the app shell renders but no real content.

## Development Commands

### Package Manager

This project uses **pnpm** (not npm or yarn). All commands should use `pnpm`.

### Common Commands

- `pnpm install` - Install dependencies
- `pnpm dev` (or `pnpm start`) - Start development server (http://localhost:5173)
- `pnpm build` - Production build (outputs to `build/`)
- `pnpm preview` - Preview the production build locally (http://localhost:4173)
- `pnpm test` - Run Playwright E2E tests (auto-builds and previews)
- `pnpm lint` - Run all linters (JS, CSS, types, format)
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm format` - Format code with Prettier

### Linting

- `pnpm lint:js` - ESLint check
- `pnpm lint:js:fix` - ESLint auto-fix
- `pnpm lint:css` - Stylelint check
- `pnpm lint:css:fix` - Stylelint auto-fix
- `pnpm lint:types` - Type checking via `svelte-check`
- `pnpm lint:format` - Prettier check

### Testing

- Playwright E2E tests live in `tests/e2e/`
- `pnpm test` builds the app, starts `pnpm preview`, and runs the suite

### Deployment

Deployment is handled by `.github/workflows/ci.yml` on push to `main`:

1. Lint + Test jobs run.
2. Deploy job uses `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4` to publish `build/` to GitHub Pages.

The repo Settings → Pages source must be set to "GitHub Actions". The CNAME is in `static/CNAME`. Because the site serves from a custom domain root, `BASE_PATH` is left empty in CI (do not set it to `/bluecoats`).

## Architecture

### Tech Stack

- **SvelteKit 2.x** with **Svelte 5** runes (`$state`, `$derived`, `$props`)
- **`@sveltejs/adapter-static`** with `fallback: '404.html'`, `strict: true`
- **Vite 8** build system
- **Tailwind CSS 4** via `@tailwindcss/vite` (no `tailwind.config.js`; theme customizations live in `src/app.css` under `@theme {}`)
- **TypeScript** strict mode, type-checked via `svelte-check`
- **ECharts** for data visualization (planned PR 3)
- **Luxon** for date manipulation
- **Playwright** for E2E tests

### File Structure

```
src/
├── app.html                          # HTML shell (root <html>/<body> classes live here)
├── app.css                           # Tailwind 4 entry + custom range-input styles
├── lib/
│   ├── components/
│   │   ├── nav/{NavigationBar,Logo,DesktopMenu,MobileMenu,MobileMenuToggle}.svelte
│   │   ├── nav/types.ts              # NavItem type + NAV_ITEMS list
│   │   └── shared/{Card,PageContent,PageHeader}.svelte
│   ├── data/                         # (PR 2) base.ts, index.ts, seasons/[year].ts
│   ├── actions/                      # (PR 3) chart.ts
│   └── utils/                        # (PR 2/3) url-state.ts, chart-options.ts, ordinal.ts
└── routes/
    ├── +layout.svelte                # Renders <NavigationBar /> + children
    ├── +layout.ts                    # `export const prerender = true`
    ├── +page.svelte                  # Score History (stub until PR 3)
    └── daily-rankings/+page.svelte   # Daily Rankings (stub until PR 2)

static/
├── CNAME                             # bluecoats.pfefferle.me
├── .nojekyll
├── favicon.png
└── robots.txt

tests/e2e/                            # Playwright tests
```

Path aliases (defined in `svelte.config.js`):

- `$lib` → `src/lib` (SvelteKit default)
- `$components` → `src/lib/components`
- `$data` → `src/lib/data`
- `$app/*` → SvelteKit runtime (e.g. `$app/paths`, `$app/state`, `$app/navigation`)

### Key Patterns

#### Svelte 5 Component Structure

Components use runes for props/state and snippets for slots:

```svelte
<script lang="ts">
  import type { Snippet } from "svelte";

  let { title, children }: { title: string; children?: Snippet } = $props();
</script>

<h1>{title}</h1>
{#if children}
  {@render children()}
{/if}
```

For local reactive state, use `$state(...)`; for computed values, `$derived(...)` or `$derived.by(() => ...)`.

#### Internal Navigation

Use `resolve()` from `$app/paths` for typed internal links:

```svelte
<script lang="ts">
  import { resolve } from "$app/paths";
</script>

<a href={resolve("/daily-rankings")}>Daily Rankings</a>
```

Direct string `href`s to internal routes will trigger `svelte/no-navigation-without-resolve`.

For the active-link state, read `page.route.id` from `$app/state` (not `$app/stores` — Svelte 5 prefers `$app/state`).

#### URL State (planned PR 2/3)

Query-param-driven UI state lives in the URL, written via a small helper at `src/lib/utils/url-state.ts` that wraps `goto(url, { replaceState: true, keepFocus: true, noScroll: true })`.

#### Chart Action (planned PR 3)

ECharts is wired via a Svelte action at `src/lib/actions/chart.ts` that handles init, update (with `notMerge: true`), `ResizeObserver`, and `dispose()` on destroy. Import lazily inside the action body if bundle size is a concern.

### Adding New Season Data (planned PR 2)

1. Create `src/lib/data/seasons/[year].ts` following the existing pattern.
2. Export `SEASON_[year]` constant with type `SeasonScores`.
3. Import and add to `ALL_SEASONS` array in `src/lib/data/index.ts`.
4. Dates should be ISO format (YYYY-MM-DD).
5. Scores are numeric (decimals allowed).
6. `SeasonScores.year` is a **string** (e.g. `"2024"`); do not coerce to number.

### Styling

- Tailwind CSS 4 utility classes; no separate config file.
- Custom theme tokens (e.g. `--font-sans`) and custom CSS live in `src/app.css`.
- Root background/height classes (`h-full bg-gray-100`, `h-full font-sans`) are on `<html>`/`<body>` in `src/app.html` — the page header relies on this gray background for visual contrast.
