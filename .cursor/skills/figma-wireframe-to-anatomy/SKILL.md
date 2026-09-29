---
name: figma-wireframe-to-anatomy
description: >-
  Replaces lo-fi Figma wireframe layers with published Anatomy design-system
  component instances. Reads a selected frame, maps gray boxes to Anatomy
  (Button, Chip, List item, Text field, Action Center Card, Tabs, Nav), confirms
  the mapping, then swapComponent or replace-in-place via use_figma. Use when
  swapping wireframes for Anatomy, restyling a wireframe with the IH design
  system, or replacing placeholder layers with real Figma components.
---

# Figma wireframe → Anatomy

Turn **lo-fi wireframe layers** in a Figma **Design** file into **published Anatomy instances** on the same canvas. Do not rebuild the screen from scratch. Do not implement React (that is `m4-figma-to-code`).

**Anatomy library:** [Anatomy: IH Design System](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System) — file key `VT79VSlhYlpl0g2JS9vLKt`.

**Catalog (v1 swap targets):** [catalog.md](catalog.md)
**Plugin recipes:** [swap-recipes.md](swap-recipes.md)
**Code mapping (do not duplicate):** [`cursor/context/figma-mapping.md`](../../cursor/context/figma-mapping.md)

**Related:** `figma-use` (required before every `use_figma`) · `m4-figma-to-code` (Figma → React after the canvas is real Anatomy)

## Hard stops

- **Never write to the Anatomy library file** (`VT79VSlhYlpl0g2JS9vLKt`). Inspect it read-only to resolve component keys. Mutate only the **target** product / working file.
- **Remote Figma MCP required** (`use_figma`, `search_design_system`, `get_libraries`). Figma Desktop MCP is read-only for canvas writes — stop and tell the user to connect `https://mcp.figma.com/mcp` if `use_figma` is missing.
- **Load `figma-use` before every `use_figma` call.** Pass `skillNames: "figma-use,figma-wireframe-to-anatomy"`.
- **Do not mutate until the user confirms the mapping table.** Wrong swaps are destructive.
- **Do not replace screen chrome:** phone frame, iOS status bar, page-level artboard, scrims used as layout. Swap **controls and patterns** inside the frame.
- **Do not invent Anatomy components.** If it is not in [catalog.md](catalog.md) and `search_design_system` (scoped to Anatomy) has no match, leave the layer and list it as unmatched.
- **Do not detach** Anatomy instances to restyle them. Set variants / TEXT properties instead.

## Prerequisites

1. Target file URL (`figma.com/design/...`) and a **frame / node id** (or an explicit selection).
2. Anatomy is **published** and **enabled** on the target file (`get_libraries` → `libraries_added_to_file`). If it is only in `libraries_available_to_add`, stop: ask the user to enable the Anatomy library in Figma, then retry.
3. Edit access on the target file.

## Workflow

Copy this checklist and keep it updated:

```
- [ ] 1. Inspect wireframe (read-only)
- [ ] 2. Resolve Anatomy keys (read-only on library file)
- [ ] 3. Propose mapping table — STOP for confirmation
- [ ] 4. Swap / replace confirmed rows only
- [ ] 5. Screenshot + report unmatched
```

### 1. Inspect the wireframe

`use_figma` on the **target** `fileKey`. Switch to the page that owns the node (`await figma.setCurrentPageAsync` once). Walk the selected frame (not the whole page).

For each candidate child (skip locked, hidden, and chrome listed above), return:

| Field | Why |
|-------|-----|
| `id`, `name`, `type` | Identity |
| `width`, `height`, `x`, `y` | Size / position heuristics |
| `layoutMode` / parent auto-layout | FILL vs FIXED after insert |
| Instance? `mainComponent` name + key | Prefer `swapComponent` |
| Descendant TEXT `characters` (truncated) | Labels, placeholders |
| Child count / nested frame names | Grouping (e.g. Action Center Card) |

Prefer `findAllWithCriteria` and `node.query(...)`. Return structured JSON. Do not mutate.

If the payload is huge, inspect one section at a time (top nav, body, tab bar).

### 2. Resolve Anatomy component keys

Read-only `use_figma` against Anatomy file key `VT79VSlhYlpl0g2JS9vLKt` using the **node ids in [catalog.md](catalog.md)**. Resolve the published `key` from the `COMPONENT_SET` (or standalone `COMPONENT`). Cache keys for this conversation.

If a catalog node is missing or unpublished, `get_libraries` on the **target** file, then `search_design_system` with `includeComponents: true` and `includeLibraryKeys` set to Anatomy’s library key. One search intent per query (`"Button"`, `"Static Chip"`, `"List item"`).

### 3. Propose the mapping — STOP

Show a table. Do **not** call mutating `use_figma` in the same turn.

| Source layer (name + id) | Anatomy component | Variant / props to set | Method | Confidence |
|--------------------------|-------------------|------------------------|--------|------------|
| `CTA 12:34` | Button | Size=medium, Type=primary, label from text | replace-in-place | high |

**Method:**

| Source | Method |
|--------|--------|
| `INSTANCE` | `swapComponent` after import (preserves overrides) |
| `FRAME` / `RECTANGLE` / `TEXT` / `GROUP` | replace-in-place: create instance, insert at same index, copy layout, `remove()` original |

**Grouping:** several sibling gray boxes that are clearly one pattern (card + title + chip + CTA) → **one** Anatomy instance (e.g. Action Center Card), not four swaps. Call that out in the table.

**Leave unmatched:** unnamed rectangles, illustrations, custom layout, copy-only text that is not a control.

Wait for the user to confirm, edit, or drop rows.

### 4. Apply confirmed rows

Follow [swap-recipes.md](swap-recipes.md). Rules:

- At most ~5 swaps per `use_figma` call. Validate with `screenshot()` after each batch.
- Import with `importComponentByKeyAsync` / `importComponentSetByKeyAsync` on the **target** file (`Promise.all`).
- Pick the variant **before** `createInstance` when the catalog lists Size / Type / State.
- Set TEXT / BOOLEAN / INSTANCE_SWAP via `setProperties` using keys from `componentPropertyDefinitions` on the **set** (never on a variant `COMPONENT`). Load fonts before any text mutation.
- After replace-in-place, match parent auto-layout: `appendChild` / `insertChild` **first**, then `layoutSizingHorizontal = 'FILL'` if the source was full-width.
- Return `{ createdNodeIds, mutatedNodeIds, removedNodeIds }` every call.

### 5. Report

- What swapped (old id → new instance id + Anatomy name)
- Unmatched layers (left as-is)
- Layout caveats (hug vs fill, variant guess)
- Offer `m4-figma-to-code` if they want the screen in the prototype next

## Matching (v1)

Use [catalog.md](catalog.md) first. Heuristics (highest signal wins):

1. Layer **name** contains the Anatomy name (`Button`, `Chip`, `List item`, `Text field`, `Tab`, `Nav`).
2. **Size:** ~48px tall full-width control → Button medium; ~36px → Button small; circular ~40px → Icon button; title + subtitle row → List item.
3. **Text:** short CTA (`Continue`, `View all`) → Button; placeholder-like (`Search`) → Text field; status word (`Upcoming`) → Static Chip.
4. **Group** before 1:1 when children look like one card.

Low confidence (no name, no text, odd size) → unmatched, do not guess.

## Not this skill

| Ask | Use instead |
|-----|-------------|
| Rebuild a screenshot or hi-fi mockup with linked Anatomy instances | `figma-mockup-to-anatomy` |
| Implement the screen in React | `m4-figma-to-code` |
| Build a new screen from code into Figma | `figma-generate-design` |
| Create new Anatomy components / variants | stop — that belongs in the Anatomy library, by designers |
| FigJam tables / flowcharts | `figma-use-figjam` / `figma-generate-diagram` |
