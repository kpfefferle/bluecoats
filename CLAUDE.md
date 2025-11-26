# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Ember.js application that displays historical DCI (Drum Corps International) competition scores for the Bluecoats drum and bugle corps. The app visualizes score progression throughout competitive seasons and provides daily ranking data.

## Development Commands

### Package Manager

This project uses **pnpm** (not npm or yarn). All commands should use `pnpm`.

### Common Commands

- `pnpm install` - Install dependencies
- `pnpm start` - Start development server (http://localhost:4200)
- `pnpm test` - Build and run all tests
- `pnpm lint` - Run all linters (JS, CSS, HBS, types)
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm build` - Production build
- `pnpm exec vite build --mode development` - Development build

### Linting

- `pnpm lint:js` - ESLint check
- `pnpm lint:js:fix` - ESLint auto-fix
- `pnpm lint:css` - Stylelint check
- `pnpm lint:hbs` - Template linting
- `pnpm lint:types` - TypeScript type checking (via ember-tsc)
- `pnpm format` - Format code with Prettier

### Testing

- Visit http://localhost:4200/tests in browser while dev server is running
- Tests are in `tests/acceptance/`, `tests/integration/`, and `tests/unit/`

### Deployment

- `pnpm deploy` - Deploy to production (gh-pages branch)

## Architecture

### Tech Stack

- **Ember.js** 6.8+ (Octane edition)
- **TypeScript** with strict type checking
- **Vite** build system (not Webpack)
- **Embroider** for modern Ember builds
- **Glint** for TypeScript support in templates
- **Tailwind CSS 4** for styling
- **ECharts** for data visualization
- **Luxon** for date manipulation

### File Structure

#### Data Layer

- `app/data/base.ts` - Core TypeScript interfaces (`Score`, `SeasonScores`)
- `app/data/[year].ts` - Individual season data files (1977-2025)
- `app/data/index.ts` - Exports `ALL_SEASONS` array aggregating all season data

Each season file exports a constant like `SEASON_2024` containing:

- `year`: string (e.g., "2024")
- `color`: optional Tailwind color hex code for charts
- `endDate`: ISO date string of DCI Finals
- `scores`: array of performance scores with date, location, and score

#### Routes

- `app/router.ts` - Route definitions (index, daily-rankings)
- `app/routes/index.ts` - Score history route (loads all seasons)
- `app/routes/daily-rankings.ts` - Daily rankings route
- `app/controllers/index.ts` - Score history controller (manages selected years, fit-all state)
- `app/controllers/daily-rankings.ts` - Daily rankings controller

#### Components (GTS format)

Components use `.gts` files (Glimmer TypeScript) with template-only components or class-based components:

- `app/components/navigation-bar.gts` - Main navigation (composed of subcomponents)
  - `navigation-bar/logo.gts`
  - `navigation-bar/desktop-menu.gts`
  - `navigation-bar/mobile-menu.gts`
  - `navigation-bar/mobile-menu-toggle.gts`
- `app/components/shared/` - Reusable UI components (card, page-header, page-content)
- `app/components/score-history/` - Score visualization components
  - `season-scores-chart.gts` - Main chart component using ECharts
  - `season-select.gts` - Multi-select for seasons
  - `fit-all-toggle.gts` - Toggle to fit all data in chart
- `app/components/daily-rankings/` - Daily ranking components
  - `table.gts` - Rankings table
  - `day-slider.gts` - Slider to select competition day

#### Templates

- `app/templates/application.gts` - Root template
- `app/templates/index.gts` - Score history page template
- `app/templates/daily-rankings.gts` - Daily rankings page template

#### Modifiers

- `app/modifiers/render-echart.ts` - Ember modifier that initializes ECharts on an element
  - Takes `EChartsOption` as positional argument
  - Automatically initializes chart when element renders

### Key Patterns

#### GTS Component Structure

Components use the `<template>` tag syntax with TypeScript:

```typescript
import Component from '@glimmer/component';

interface MyComponentSignature {
  Args: {
    foo: string;
  };
}

export default class MyComponent extends Component<MyComponentSignature> {
  // component logic

  <template>
    <div>{{@foo}}</div>
  </template>
}
```

Template-only components use `TOC` type:

```typescript
import { type TOC } from '@ember/component/template-only';

interface MySignature {
  Args: {
    foo: string;
  };
}

<template>
  <div>{{@foo}}</div>
</template> satisfies TOC<MySignature>;
```

#### Chart Data Flow

1. Route loads season data from `app/data/index.ts`
2. Controller maintains selected years and fit-all state
3. Chart component computes ECharts options based on selected seasons
4. Chart automatically adjusts X/Y axis ranges based on fit-all setting and selected data
5. Chart displays scores relative to DCI Finals (X-axis is days before finals)

#### Adding New Season Data

1. Create `app/data/[year].ts` following existing pattern
2. Export `SEASON_[year]` constant with type `SeasonScores`
3. Import and add to `ALL_SEASONS` array in `app/data/index.ts`
4. Dates should be ISO format (YYYY-MM-DD)
5. Scores are numeric (decimals allowed)

### TypeScript Configuration

- Path aliases: `bluecoats/*` maps to `app/*`
- Strict type checking enabled
- Glint provides template type checking

### Styling

- Tailwind CSS 4 utility classes
- Custom styles in `app/app.css`
- Uses Tailwind colors (e.g., `red-600`, `blue-700`)
- Responsive design with mobile menu toggle

### Testing

- QUnit test framework
- Test helpers from `@ember/test-helpers`
- Acceptance tests use real browser rendering
- Test files use `-test.ts` or `-test.gts` suffix
