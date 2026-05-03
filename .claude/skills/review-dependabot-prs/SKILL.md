---
name: review-dependabot-prs
description: Use when the user asks to review, process, or merge open Dependabot PRs (e.g. "review the dependabot PRs", "merge the open dependency bumps"). Walks each PR through CI check, review, rebase-if-stale, and squash-merge.
---

# Review Dependabot PRs

Process every open Dependabot PR in the repo: verify CI, review the bump, rebase onto the latest `main` if stale, and squash-merge. Handle them one at a time — each merge can stale the remaining PRs.

## Steps

1. **List open Dependabot PRs.** Search `is:pr is:open author:app/dependabot` and order them oldest-first (lowest number first). Process them sequentially — merging one stales the rest.
2. **For each PR, in order:**
   1. **Check CI.** Read `get_check_runs`. `Lint` and `Test` must be `conclusion: success`. `Deploy` is `skipped` on PRs (correct — only runs on push to `main`). If anything failed, surface it to the user and stop.
   2. **Review the bump.** Read the diff and the changelog/release-notes embedded in the PR body. Focus on:
      - Whether it's patch / minor / major.
      - Any "breaking" notes — and whether they apply to *this* app. The app uses `adapter-static` with prerendering and no server-side runtime, so SvelteKit server-only features (remote functions, hooks.server, etc.) and SSR-only changes don't affect it.
      - Lockfile churn beyond the bump itself (e.g. `libc:` lines disappearing) is usually cosmetic from a pnpm regeneration — note it but don't block on it.
   3. **Confirm up-to-date with `main`.** Compare the PR's `base.sha` to current `main`. If they differ, the branch is stale — post a `@dependabot rebase` comment and wait. Dependabot also auto-rebases some PRs on its own when their base falls behind; if you see "Dependabot is rebasing this PR" in the body, you don't need to comment.
   4. **Wait for the rebase.** Poll until the head SHA changes, then wait for the new CI run to complete (Lint + Test green). Don't merge until CI is green on the rebased commit.
   5. **Approve and squash-merge.** Approve with a one-paragraph review summarizing the bump and why the breaking-change notes (if any) don't apply. Use `merge_method: squash` — the repo's history is squash-merged.
3. **After all PRs are processed,** report which merged and which (if any) need follow-up.

## Notes

- Always squash-merge — matches the existing repo history.
- Don't run `pnpm install` / `pnpm test` locally as part of the review — CI already does this on the rebased commit, and that's what gates the merge.
- If a bump fails CI after rebase, surface the failure to the user with a link to the failed job. Don't try to fix the upstream package.
- If two PRs touch the same lockfile section and the second one needs a rebase, Dependabot handles it — never resolve lockfile conflicts by hand.
