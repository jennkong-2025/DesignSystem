---
name: anatomy-changelog
description: >-
  Summarizes Anatomy (IH Design System) Figma file changes since the last
  named version save as Added / Improved / Cleaned up. Use when the user asks
  for an Anatomy changelog, version-history summary, what changed since last
  save, or to follow anatomy-changelog.
---

# Anatomy changelog

Write a **short three-bucket list** of what changed in [Anatomy: IH Design System](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System) since the last **named** File → Save to version history. Chat only unless the user asks to put it on the canvas.

**File key:** `VT79VSlhYlpl0g2JS9vLKt`
**Script (run this):** [scripts/diff-anatomy-versions.mjs](scripts/diff-anatomy-versions.mjs)

Figma MCP cannot read version history. Do not walk the live file as a substitute.

## Hard stops

- Do **not** fetch the full Anatomy document JSON.
- Do **not** publish the library or edit component pages.
- Do **not** write the bullets into Figma unless the user asks.
- Do **not** invent changes that are not in the script JSON.
- Do **not** list pages, frames, or page-first diffs in chat. Use only `added`, `improved`, and `cleanedUp`.

## Token

The script needs `FIGMA_ACCESS_TOKEN` or `FIGMA_TOKEN` (env or gitignored `.env.local`).

Create one at [Figma access tokens](https://www.figma.com/developers/api#access-tokens) with `file_content:read` and `file_versions:read`. If the script exits `2` or `3`, stop and tell the user to set the token — do not scrape MCP OAuth.

## Workflow

```
- [ ] 1. Confirm token (run the script; if it fails, stop)
- [ ] 2. Diff live file vs named save (latest, or --from if the user pins a date)
- [ ] 3. Write the three buckets in chat
```

From the repo root:

```bash
node .cursor/skills/anatomy-changelog/scripts/diff-anatomy-versions.mjs
```

Optional: `--from VERSION_ID` to pin a baseline. The JSON includes `recentNamedSaves` if the user names one (e.g. Sept 14 **BASELINE SEPT 2026**).

If the live file already matches the latest named save, the script compares to the **previous** named save and sets `note`. Use that.

## Chat output

Open with one line: baseline **label**, date, and who saved it (`baseline.label`, `baseline.createdAt`, `baseline.user`).

Then **only** these headings. Skip a heading if its array is empty. Copy names from the JSON — do not paraphrase.

### Added

New components and component sets (`added`). One bullet per name.

### Improved

Existing components that changed — renamed, or gained/lost variants (`improved`). One bullet per name.

### Cleaned up

Removed components or pages (`cleanedUp`). One bullet per name. If the list mixes both, you may write a single line such as `Insurance Card Module, date pickers` — still only names from this array.

If `note` says there are no structural changes, say that. Nested copy-only edits inside an unchanged frame will not appear.

The script still emits `pages`, `pageChanges`, `components`, and `componentSets` for debugging. Do not put those in chat.

## Out of scope

Library publish notes, prototype code, and DESIGN.md-only edits. This is Figma file version history only.
