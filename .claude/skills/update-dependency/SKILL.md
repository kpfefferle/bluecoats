---
name: update-dependency
description: Use when the user asks to upgrade a specific npm/pnpm dependency (e.g. "upgrade vite", "bump @sveltejs/kit"). Bumps the package to its latest version on a feature branch, verifies the build, and opens a PR.
---

# Update Dependency

Upgrade a single dependency to its latest version, verify the project still builds and tests pass, and open a PR.

## Steps

1. **Confirm the package name.** If the user's request is ambiguous (e.g. "upgrade tailwind" — `tailwindcss`? `@tailwindcss/vite`? both?), ask before proceeding.
2. **Branch.** Create a feature branch named `chore/bump-<package>` (e.g. `chore/bump-vite`). Per the project's workflow rule (see `.claude/CLAUDE.md` → Workflow), never commit dependency bumps directly to `main`.
3. **Upgrade.** Run `pnpm update <package> --latest` to move it to the latest version (not just within the current semver range). Use `pnpm` — not `npm` or `yarn`.
4. **Verify.** Run `pnpm lint` and `pnpm test` (which runs Vitest + Playwright). All must pass.
5. **Commit.** Use a commit message of the form `Bump <package> from <old> to <new>`. Pull the old/new versions from the `pnpm-lock.yaml` diff or `pnpm update` output.
6. **Open the PR.** Push the branch and run `gh pr create` with a brief summary of what changed and the lint/test results.

## Notes

- If the upgrade introduces a breaking change that surfaces during lint or test, stop and surface the failure to the user — don't fix the API breakage silently. They may want to defer the bump or scope the migration.
- For dependency groups already covered by Dependabot (visible in `git log --oneline | grep Bump`), check whether a Dependabot PR is already open before creating a duplicate.
