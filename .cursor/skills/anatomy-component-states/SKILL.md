---
name: anatomy-component-states
description: >-
  Adds Hover, Focus, Pressed, and Disabled variants to an Anatomy Figma
  component set from a linked node. Clones each Default (or existing) variant,
  applies Text Link interaction tokens, and lays the new states out in columns.
  Use when the user asks to add component states, interaction states, or
  hover/focus/pressed/disabled to an Anatomy component from a Figma URL.
---

# Anatomy component states (Figma)

Add **Disabled**, **Hover**, **Focus**, and **Pressed** to a linked component in [Anatomy: IH Design System](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System). Clone from **Default**. Do not restyle Default. Do not restyle an existing Disabled / Hover / Focus / Pressed variant. Do not invent Loading, Destructive, or Selected unless the user asks.

**File key:** `VT79VSlhYlpl0g2JS9vLKt`

**Style source (always):** Text Link `43307:40429` — tokens and recipes in [reference.md](reference.md)

**Related:** `figma-use` (required before every `use_figma`) · `anatomy-component-specs` · `m4-figma-to-code`

## Hard stops

- **Load `figma-use` before every `use_figma`.** Pass `skillNames: "figma-use,anatomy-component-states"`.
- **Need a Figma URL with `node-id`.** Resolve instance → main → parent `COMPONENT_SET`.
- **This skill writes to the Anatomy library file.**
- **Do not overwrite** Default or any already-filled Disabled / Hover / Focus / Pressed variant.
- **Do not add Destructive, Loading, or Selected** unless the user asks.
- **Bind Anatomy variables.** No raw hex fills/strokes.
- **Match existing State casing** on the set (`Default` vs `default`). If there is no State axis, use Title Case: `Default`, `Disabled`, `Hover`, `Focus`, `Pressed`.
- **Keep existing corner radii** on the source (Top/Bottom menu items, etc.). Only bind `Radius/S` when Default’s four corners are all `0`.
- **One `setCurrentPageAsync` per `use_figma` call.** Batch clones (~6 Default sources per call, 24 new variants).
- After `clone()`, if the clone is on the page, **`set.appendChild(clone)`** so it joins the set.

## Constraints-only

No YAML. No approval gate. If the set already has Disabled, Hover, Focus, and Pressed, screenshot and stop.

## Workflow

```
- [ ] 1. Open the linked node and resolve the COMPONENT_SET
- [ ] 2. Read axes, Default sources, grid (x/y of existing variants)
- [ ] 3. If there is no State axis, rename every variant to add State=Default
- [ ] 4. Clone each Default source into missing Disabled / Hover / Focus / Pressed
- [ ] 5. Apply Text Link tokens (reference.md)
- [ ] 6. Column-layout new states; resize the set; clipsContent = false
- [ ] 7. Screenshot Default + new states
```

### 1. Resolve the set

Parse `node-id` (`49936-12193` → `49936:12193`). Switch page once.

| Linked type | Treat as |
|-------------|----------|
| `COMPONENT_SET` | That set |
| `COMPONENT` in a set | Parent set |
| `INSTANCE` | Main component’s parent set |
| Other | Find the nearest `COMPONENT_SET` ancestor; if none, stop |

### 2. Choose sources

A **source** is one variant per combination of **non-State** axes (Layout, Type, Property 1, Padding, …).

- Prefer `State=Default` / `State=default`.
- If there is no State axis, every current variant is a source (after step 3).
- Skip sources whose Disabled / Hover / Focus / Pressed names already exist.

### 3. Add a State axis if missing

Rename every child to `…, State=Default` in **one** call so the set stays consistent. Then clone.

### 4–6. Clone, style, place

Recipes: [reference.md](reference.md).

If the set is auto-layout (`layoutMode` VERTICAL or HORIZONTAL), set **`layoutMode = 'NONE'`** before placing columns — otherwise clones stack in one column and `x` is ignored. Place new columns to the **right** of Default in this order: **Disabled → Hover → Focus → Pressed**. Same `y` as the source. Gap: Default → next column (or 40px). Expand set width/height so focus rings are not clipped.

If a nested instance already exposes a `State` variant (e.g. List Item), set Hover / Focus / Pressed on that instance to match. Do **not** also put a Focus ring on the nested instance — the ring lives on the wrapper only. Disabled still needs text/icon rebinds (Text Link); nested List Item may not have a Disabled variant.

### 7. Verify

Confirm: variant count = sources × (existing states + newly added). Screenshot Disabled text, Hover fill, Focus ring, Pressed overlay. Optional: a white `{Component} / interaction states` preview to the right of the set.
