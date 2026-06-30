---
name: add-score
description: Use when the user asks to log/record a result for a Bluecoats DCI event — either a numeric competition score ("log 90.3 for DCI Denton", "the Houston show scored 91.25") or a non-scored result ("Opening Night was an exhibition", "the Dallas show got rained out"). Fills the result into the matching scheduled entry in the season data and opens a PR.
---

# Add Score

Record a single event result into a season's data file, open a PR, and merge it as soon as CI is green so the deployed site shows the new score ASAP. The result is either a **number** (a scored competition) or **`null`** (the event happened but produced no comparable score — exhibitions, rained-out shows, etc.). The user provides the value inline; this skill never fetches scores from an external source.

## Background

Score data lives in `src/lib/data/seasons/<year>.ts`, one `SeasonScores` object per season (type defined in `src/lib/data/base.ts`). Each event is a `Score` entry whose `score` field carries the semantics (see `.claude/CLAUDE.md` → "Adding New Season Data"):

- **omitted / `undefined`** — on the schedule, not yet competed.
- **`null`** — competed but no comparable score (exhibition, rained out, etc.).
- **number** — scored competition result (decimals allowed).

An in-progress season is pre-seeded with the full schedule: each event already has its `date`, `location`, and `name`, but no `score` field. Logging a result almost always means **filling in the `score` on an entry that already exists** — not adding a new one.

Only numeric scores surface in the UI; `null` and `undefined` are filtered out by `POPULATED_SEASONS` in `src/lib/data/index.ts` (`typeof score.score === 'number'`). So logging a `null` is safe — it records that the event happened without making the season appear "populated."

## Steps

Create a todo per step and work through them in order.

1. **Identify the season and event.** Default to the most recent season file (highest year in `src/lib/data/seasons/`); honor an explicit year if the user names one. Open `src/lib/data/seasons/<year>.ts`.

2. **Match the scheduled entry.** Find the entry by `date` (preferred), falling back to `name`. **If no matching entry exists, stop and ask the user how to proceed** — do not append or invent an entry.

3. **Write the result on the matched entry only.**
   - Numeric score → `score: <number>` (keep the decimals exactly as given).
   - Non-scored (exhibition / rained out / no published score) → `score: null`.

   Edit in place; leave every other entry untouched so the existing date ordering is preserved. Do **not** add or change the season's `color` field — it is defined on the type but unused (the chart uses its own palette in `src/lib/utils/chart-options.ts`).

4. **Finals → set placement.** If the matched event is the DCI World Championship **Finals** and a numeric score was logged, ask the user for the season's final DCI placement and set `placement: <n>` on the `SeasonScores` object. For any other event, leave `placement` alone.

5. **Branch.** Run `git branch --show-current`. Per the project's workflow rule (`.claude/CLAUDE.md` → Workflow), never commit to `main`. Branch from `main` as `feat/<year>-score-<event-slug>` (e.g. `feat/2026-score-dci-denton`). One PR per result.

6. **Verify.** Run `pnpm lint` and `pnpm test:unit`; both must pass. (Node is pinned to 24.13.1 via `.node-version`/mise — pnpm runs directly, no prefix needed.)

7. **Commit, push, open the PR.** Commit message of the form `Log <event> score for <year>` (or `Log <event> as non-scored for <year>` for a `null`). Push and run `gh pr create` with a one-line summary of the event, value, and the lint/test result.

8. **Watch the PR and merge as soon as it's green.** Getting the score deployed is the point — Cloudflare Pages auto-deploys `main` on every push, so the score is **not live until the PR merges**. Watch the PR's checks with `gh pr checks <number> --watch`; once all required checks pass, squash-merge and delete the branch with `gh pr merge <number> --squash --delete-branch`. If any check **fails**, stop and report it to the user — do not merge. After merging, sync local `main` (`git checkout main && git pull --ff-only`) and tell the user the deploy is underway.

## Notes

- The repo's `lint-file.sh` PostToolUse hook auto-formats the file on save, so Prettier formatting is handled for you; step 6's `pnpm lint` is the authoritative check.
- If the user gives several results at once for the same season, it's reasonable to log them in a single branch/PR rather than one each — confirm with the user if unsure.
- Double-check the value against what the user said before committing; a transposed score (e.g. `92.95` vs `92.59`) is the most likely error and the hardest to catch later.
