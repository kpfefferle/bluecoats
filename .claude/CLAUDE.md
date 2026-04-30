# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit application that displays historical DCI (Drum Corps International) competition scores for the Bluecoats drum and bugle corps. The app visualizes score progression throughout competitive seasons and provides daily ranking data. It is a fully prerendered static SPA deployed to GitHub Pages under the custom domain `bluecoats.pfefferle.me`.

## Development Commands

### Package Manager

This project uses **pnpm** (not npm or yarn). All commands should use `pnpm`.

### Common Commands

- `pnpm install` - Install dependencies
- `pnpm dev` (or `pnpm start`) - Start development server (http://localhost:5173)
- `pnpm build` - Production build (outputs to `build/`)
- `pnpm preview` - Preview the production build locally (http://localhost:4173)
- `pnpm test` - Run unit (Vitest) + E2E (Playwright) tests in parallel
- `pnpm test:unit` - Run Vitest unit tests only
- `pnpm test:e2e` - Run Playwright E2E tests only (auto-builds and previews)
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

- Vitest unit tests live in `tests/unit/` (config at `vitest.config.ts`).
- Playwright E2E tests live in `tests/e2e/`.
- `pnpm test` runs both suites in parallel; the Playwright runner builds and previews the app.

### Deployment

Deployment is handled by `.github/workflows/ci.yml` on push to `main`:

1. Lint + Test jobs run.
2. Deploy job uses `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4` to publish `build/` to GitHub Pages.

The repo Settings → Pages source must be set to "GitHub Actions". The CNAME is in `static/CNAME`. Because the site serves from a custom domain root, `BASE_PATH` is left empty in CI (do not set it to `/bluecoats`).

## Svelte MCP Server

This repo is configured with the Svelte MCP server, which exposes authoritative Svelte 5 / SvelteKit documentation and a Svelte-aware autofixer. Use it whenever you're writing or modifying Svelte/SvelteKit code — don't rely on training-data recall for API shapes.

- **`list-sections`** — Call first, at the start of any Svelte/SvelteKit task, to discover available doc sections (titles, use-cases, paths).
- **`get-documentation`** — After `list-sections`, fetch every section whose `use_cases` matches the task. Accepts single or multiple sections.
- **`svelte-autofixer`** — Run on any Svelte code you produce, before showing it to the user. Iterate until it returns no issues or suggestions.
- **`playground-link`** — Only offer when code is *not* being written to project files. Ask first; never call unprompted.

## Workflow

All changes go through a pull request — **never commit directly to `main`**. Before the first commit of any task, run `git branch --show-current`; if it returns `main`, branch off first with a descriptive name (e.g. `feat/score-history-zoom`, `chore/bump-deps`, `test/unit-daily-rankings`). When the work is ready, push the branch and open a PR with `gh pr create`.

The rule is "no direct commits to `main`," not "one PR per change." If a follow-up is closely related to an open PR, it's fine to add it to that PR's branch rather than spinning up a new one. When the relationship is unclear, ask.

## Architecture

### Tech Stack

- **SvelteKit 2.x** with **Svelte 5** runes (`$state`, `$derived`, `$props`)
- **`@sveltejs/adapter-static`** with `fallback: '404.html'`, `strict: true`
- **Vite 8** build system
- **Tailwind CSS 4** via `@tailwindcss/vite` (no `tailwind.config.js`; theme customizations live in `src/app.css` under `@theme {}`)
- **TypeScript** strict mode, type-checked via `svelte-check`
- **ECharts** for data visualization (wired via a Svelte action — see Chart Action below)
- **Luxon** for date manipulation
- **Vitest** for unit tests, **Playwright** for E2E tests

### File Structure

```
src/
├── app.html                          # HTML shell (root <html>/<body> classes live here)
├── app.css                           # Tailwind 4 entry + custom range-input styles
├── lib/
│   ├── components/
│   │   ├── nav/{NavigationBar,Logo,DesktopMenu,MobileMenu,MobileMenuToggle}.svelte
│   │   ├── nav/types.ts              # NavItem type + NAV_ITEMS list
│   │   ├── shared/{Card,PageContent,PageHeader}.svelte
│   │   ├── daily-rankings/{Table,DaySlider}.svelte
│   │   └── score-history/{SeasonScoresChart,SeasonSelect,FitAllToggle}.svelte
│   ├── data/                         # base.ts, index.ts, seasons/[year].ts
│   ├── actions/                      # chart.ts (ECharts lifecycle)
│   └── utils/                        # url-state.ts, ordinal.ts, daily-rankings.ts, chart-options.ts
└── routes/
    ├── +layout.svelte                # Renders <NavigationBar /> + children
    ├── +layout.ts                    # `export const prerender = true`
    ├── +page.svelte                  # Score History
    └── daily-rankings/+page.svelte   # Daily Rankings

static/
├── CNAME                             # bluecoats.pfefferle.me
├── .nojekyll
├── favicon.png
└── robots.txt

tests/
├── e2e/                              # Playwright tests
└── unit/                             # Vitest tests
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

#### URL State

Query-param-driven UI state lives in the URL, written via `setParam(key, value)` from `src/lib/utils/url-state.ts` (wraps `goto` with `replaceState: true, keepFocus: true, noScroll: true`).

**Important**: prerendered pages cannot read `page.url.searchParams` at build time. Gate the read on `browser` from `$app/environment`:

```svelte
const dayParam = $derived(browser ? page.url.searchParams.get('day') : null);
```

The prerendered HTML reflects the default state (no query params); on hydration, the client picks up the real URL and re-derives.

#### Chart Action

ECharts is wired via a Svelte action at `src/lib/actions/chart.ts` that handles init, update (with `notMerge: true` so series swaps replace rather than merge), `ResizeObserver` + `window.resize`, and `dispose()` on destroy.

Pure chart-option construction lives in `src/lib/utils/chart-options.ts` (`buildChartOption(seasons, selectedYears, fitAllSeasons)`); it has its own Vitest suite. Components compute the option via `$derived(buildChartOption(...))` and pass it to `use:chart={chartOption}` — the action's `update` runs whenever the derived value changes.

### Adding New Season Data

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
