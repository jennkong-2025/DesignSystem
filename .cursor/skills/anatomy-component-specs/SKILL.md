---
name: anatomy-component-specs
description: >-
  Reads any linked Anatomy Figma layer and writes Specs & Details tables
  (Design Intent, Usage Guidelines, Tech Spec: Elements, Tech Spec: Interactions,
  Accessibility) to match Page Banner, Service Card, List item, Modals, and
  Accordion. Usage Guidelines is a purple table under Design Intent for when
  and how a designer or PM should use the component. Tech Spec: Elements is
  implementation-only (constraints, truncation, dependencies), not usage.
  Accessibility rows trace to IH A11Y Confluence guidelines
  (accessibility-guidelines.md). On existing specs, add Usage Guidelines if
  missing, and only append new rows to Elements, Interactions, and
  Accessibility — never Design Intent, Eventing, or Content.
  Use when documenting an Anatomy component from a Figma URL or filling spec
  tables in the Anatomy file.
---

# Anatomy component specs (Figma)

Read **any linked layer** in [Anatomy: IH Design System](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System) and write Specs & Details tables for **that** component. Copy reflects the linked section. **Do not change headers.**

**File key:** `VT79VSlhYlpl0g2JS9vLKt`

**Always fill on a new block:** Design Intent · Usage Guidelines · Tech Spec: Elements · Tech Spec: Interactions · Accessibility

**On an existing spec:** add **Usage Guidelines** if that table is missing. Append **new rows only** to Usage Guidelines, Elements, Interactions, and Accessibility. **Do not add rows or edit cells** on Design Intent, Eventing, or Content — leave those for manual (or a later skill).

**Copy contract (load every time):** [table-contract.md](table-contract.md) — **Usage Guidelines** is when/how to use the component (designer or PM). **Tech Spec: Elements** is what an engineer needs that the file does not already show (min/max size, truncation, dependencies). Do not put usage DO/DON'T copy in Elements.
**Exemplars, table IDs, `cellAt`:** [exemplar.md](exemplar.md)

## Guideline sources (load before writing a table)

| Table | Guideline file | Built from |
|-------|----------------|------------|
| Accessibility | [accessibility-guidelines.md](accessibility-guidelines.md) | [IH Accessibility Confluence space](https://includedhealth.atlassian.net/wiki/spaces/A11Y/overview) |

When writing new rows **or** revising existing rows in a table listed here, load its guideline file and trace every row to a rule in it. Add a row to this table when another table gets a guideline source.

**Related:** `figma-use` (required before every `use_figma`) · `figma-wireframe-to-anatomy` · `m4-figma-to-code`

## Hard stops

- **Load `figma-use` before every `use_figma`.** Pass `skillNames: "figma-use,anatomy-component-specs"`.
- **Need a Figma URL with `node-id`.** That node is the source of truth (section, example, or component).
- **Never edit header rows** (row 0 title, row 1 column names). If the table says `Avoid when` instead of `Not for`, keep it.
- **Never edit Design Intent, Eventing, or Content \*** on a spec that already has body copy. No new rows, no overwrites, no clearing.
- **Never fill Eventing or Content \*** when cloning a new block. Clear cloned body rows so Page Banner copy does not leak.
- **Clone existing tables.** Do not create TABLE nodes from scratch.
- **Existing Elements / Interactions / Accessibility:** append rows for parts not already listed. Do not rewrite filled rows unless the user explicitly asks for a revision.
- **Accessibility rows must trace to** [accessibility-guidelines.md](accessibility-guidelines.md). No generic a11y copy that is not backed by an IH rule.
- **Do not fill leftover rows with** `TBD`, `—`, `N/A`.
- Token / gradient swatch cards are out of scope.
- This skill **writes to the Anatomy library file**.

## Constraints-only

No YAML. No approval gate. Draft against [table-contract.md](table-contract.md), then `cellAt` write. If the user asks to review copy first, show only the tables this run will change.

## Workflow

```
- [ ] 1. Open the linked node (any layer)
- [ ] 2. Measure that layer + find or clone Specs & Details
- [ ] 3. Identify tables by title — do not rename headers
- [ ] 4. Choose path: new block vs existing spec
- [ ] 5. Write only the allowed tables / rows
- [ ] 6. Expand the parent so tables are not clipped
- [ ] 7. Screenshot what changed
```

### 1. Read the linked layer

Parse `node-id` (`49128-13373` → `49128:13373`). Switch page once (`setCurrentPageAsync`). Inspect the node:

- Name, type, size, auto-layout, variants
- Nested instances / Anatomy components
- TEXT (labels, CTAs)
- Fills, strokes, radius, padding, gap, effects — prefer variable names

If the node is a small example, also inspect its **parent section** (the named page block: Banners, Cards, Lists, Sheets & modals). Context for Design Intent comes from that section, not from a generic overlay template.

### 2. Find or clone Specs & Details

| Situation | Path |
|-----------|------|
| Linked node **is** a Specs & Details frame with body copy | **Existing spec** |
| Parent section already has Specs & Details with body copy | **Existing spec** |
| No spec block yet | **New block** — clone Page Banner `47299:14446` (see [exemplar.md](exemplar.md)) |

**New block:** after clone, clear Eventing and Content \* body rows so banner copy does not leak. Clone the Design Intent table into **Usage Guidelines** directly under it (same purple title row). Then fill Design Intent, Usage Guidelines, Elements, Interactions, Accessibility.

**Existing spec:** do not clone a whole new block. If Usage Guidelines is missing, clone only the Design Intent table into that new table and place it directly under Design Intent. Hands off Design Intent, Eventing, Content. Append new rows only to Usage Guidelines, Elements, Interactions, Accessibility.

### 3. Identify tables

Match `cellAt(0, 0)` (or the first title cell) to:

`Design Intent` · `Usage Guidelines` · `Tech Spec: Elements` · `Tech Spec: Interactions` · `Accessibility` · `Eventing` · `Content Spec…`

Do not assume column count. **Page Banner / List item / Service Card** use 4-col Design Intent (no Component column). **Modals** use 5-col (Component + four). Write into the columns that exist.

### 4–5. What to write

| Table | New block | Existing spec |
|-------|-----------|----------------|
| Design Intent | Fill | **Do not touch** (no new rows, no edits) |
| Usage Guidelines | Create under Design Intent, then fill | **Create** if missing, then fill. If it already has body rows, **append** missing topics only |
| Tech Spec: Elements | Fill with implementation details | **Append** rows for parts not already listed. Detail is implementation, not usage |
| Tech Spec: Interactions | Fill | **Append** rows for interactions not already listed |
| Accessibility | Fill | **Append** rows for a11y items not already listed |
| Eventing | Blank body | **Do not touch** |
| Content Spec / Guiding Principle | Blank body | **Do not touch** |

Match new rows against the first-column label (case-insensitive). Skip duplicates. Use leftover empty body rows first; `insertRow` after the last filled row if the grid is full (recipe in [exemplar.md](exemplar.md)). Do not rewrite filled rows.

### 6–7. Verify

Increase section height if clipped. Screenshot. Confirm: headers untouched; Usage Guidelines sits directly under Design Intent and its title row is the same purple as Design Intent; Design Intent / Eventing / Content unchanged on existing specs; Elements rows are implementation details, not usage guidance.
