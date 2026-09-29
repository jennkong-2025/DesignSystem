---
name: figma-mockup-to-anatomy
description: >-
  Rebuilds a screenshot or Figma mockup using published Anatomy (IH Design
  System) component instances that stay linked to the library. Prefer variants
  and text properties over detach. If a region must be detached, also place
  matching linked instances on the same page in a section named Components to
  use. Use when restyling a mockup with Anatomy, converting a screenshot to
  Anatomy, or rebuilding a hi-fi frame from library components.
---

# Figma mockup / screenshot → Anatomy

Rebuild a **screenshot** or **Figma mockup** as a new composition of **published Anatomy instances**. Keep every Anatomy piece **linked to the library**. Do not swap lo-fi layers in place (that is `figma-wireframe-to-anatomy`). Do not implement React (that is `m4-figma-to-code`).

**Anatomy library:** [Anatomy: IH Design System](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System) — file key `VT79VSlhYlpl0g2JS9vLKt`.

**Swap catalog (component node ids):** [../figma-wireframe-to-anatomy/catalog.md](../figma-wireframe-to-anatomy/catalog.md)
**Plugin recipes:** [recipes.md](recipes.md)
**Code mapping (do not duplicate):** [`cursor/context/figma-mapping.md`](../../cursor/context/figma-mapping.md)

**Related:** `figma-use` (required before every `use_figma`) · `figma-wireframe-to-anatomy` (in-place layer swap) · `m4-figma-to-code` (Figma → React)

## Hard stops

- **Never write to the Anatomy library file** (`VT79VSlhYlpl0g2JS9vLKt`). Inspect it read-only for keys. Mutate only the **target** working file.
- **Remote Figma MCP required** (`use_figma`, `search_design_system`, `get_libraries`). If `use_figma` is missing, stop and tell the user to connect `https://mcp.figma.com/mcp`.
- **Load `figma-use` before every `use_figma` call.** Pass `skillNames: "figma-use,figma-mockup-to-anatomy"`.
- **Do not mutate until the user confirms the mapping table.**
- **Do not detach** Anatomy instances to restyle them. Set variants / TEXT / BOOLEAN / INSTANCE_SWAP properties instead.
- **If a region must be detached**, still **pull the instances of the matching components into the same figma page and put them all in a section called "Components to use".** Those palette instances stay **linked**. Detach only a separate copy used in the restyle frame.
- **Do not invent Anatomy components.** Catalog first, then `search_design_system` scoped to Anatomy. Unmatched regions stay primitives (or the original crop) and are listed as unmatched.
- **Do not destroy the source mockup.** Build a sibling frame named `{source} · Anatomy`.
- **Do not use Figma Code Connect.** Resolve Anatomy via catalog node ids + published `key`.

## Prerequisites

1. **Source:** a screenshot (chat image) **or** a Figma Design URL with `node-id`.
2. **Target file** the agent can edit (`figma.com/design/...`). If the source is already a Figma node, default to **that file and page**. If the source is only a screenshot, ask for a target file URL.
3. Anatomy is **published** and **enabled** on the target file (`get_libraries` → `libraries_added_to_file`). If it is only in `libraries_available_to_add`, stop: ask the user to enable the Anatomy library, then retry.

## Workflow

```
- [ ] 1. Capture source (read-only)
- [ ] 2. Inventory regions → Anatomy map
- [ ] 3. Resolve published keys (read-only on Anatomy)
- [ ] 4. Propose mapping table — STOP for confirmation
- [ ] 5. Build `{source} · Anatomy` with linked instances
- [ ] 6. If any confirmed row used detach: fill section "Components to use"
- [ ] 7. Screenshot + report
```

### 1. Capture the source

**Screenshot in chat:** describe layout regions, type, and copy. Do not guess unseen controls.

**Figma mockup:** `get_screenshot` + read-only `use_figma` walk of the selected frame (same inspect fields as `figma-wireframe-to-anatomy`: id, name, type, size, auto-layout, instance keys, truncated TEXT). Switch page once with `await figma.setCurrentPageAsync`.

Skip phone chrome / iOS status bar / page artboard as **rebuild targets**; recreate them only if the user asked for a 375×812 product frame.

### 2. Inventory → Anatomy

For each visible control or pattern, pick **one** catalog component (group card guts into Action Center Card, tab pairs into Tabs, etc.).

Heuristics: layer name, height (~48 Button medium, ~36 Button small, circular icon-only → Icon button), short CTA vs placeholder vs status chip. Low confidence → unmatched.

### 3. Resolve keys

Read-only `use_figma` on Anatomy using catalog node ids ([recipes.md](recipes.md)). Cache `{ name, key, type }` for this conversation.

If a catalog node is missing, `search_design_system` on the **target** file with `includeLibraryKeys` = Anatomy’s library key. One intent per query (`"Button"`, `"Static Chip"`).

### 4. Propose the mapping — STOP

Do **not** call mutating `use_figma` in the same turn.

| Region (name / crop) | Anatomy | Variant / props | Method | Confidence |
|----------------------|---------|-----------------|--------|------------|
| Primary CTA | Button | Size=medium, Type=primary, label from copy | linked instance | high |

**Method** (pick one):

| Method | When |
|--------|------|
| **linked instance** | Default. `importComponentSetByKeyAsync` / `$fig.instance(key)` + `setProperties`. |
| **linked + layout** | Instance sits in a new auto-layout frame (spacing, FILL) — the Anatomy child stays an `INSTANCE`. |
| **detach** | Last resort, and only if variants/properties cannot express the mockup. Requires user confirmation on that row. |
| **unmatched** | Leave as text/vector; do not fake a component. |

Wait for the user to confirm, edit, or drop rows.

### 5. Build the restyle frame

Follow [recipes.md](recipes.md). Rules:

- Create a **new** frame on the same page, to the right of the source (or at a clear gap). Name: `{source name} · Anatomy`. Prefer 375 wide for member screens.
- Import published keys on the **target** file (`Promise.all`). Never copy nodes out of the Anatomy file.
- Pick the variant **before** `createInstance`. Set TEXT / BOOLEAN / INSTANCE_SWAP from `componentPropertyDefinitions` on the **set** (not the variant `COMPONENT`). Load fonts before text.
- Auto-layout the restyle: vertical stack, Anatomy spacing tokens if variables exist on the file; otherwise catalog paddings. Bind color/text **variables and styles** from Anatomy — no new hex.
- At most ~5 instances per `use_figma` call. `screenshot()` the restyle frame after each batch.
- Return `{ createdNodeIds, mutatedNodeIds }` every call.
- After build, every Anatomy control in the restyle must still be `type === "INSTANCE"` with a `mainComponent` from Anatomy — except rows the user confirmed as **detach**.

### 6. Detach fallback — section **"Components to use"**

Only if at least one confirmed row used **detach**:

1. Create (or reuse) a Figma **section** on the **same page**, named exactly `Components to use`.
2. For each unique Anatomy component + variant that was detached in the restyle, `createInstance` again and **leave it linked**. Place those instances inside the section (wrap layout, labeled with component + variant name).
3. Do **not** put detached frames in that section. Do **not** detach the palette copies.
4. Deduplicate: one linked instance per unique `key` + variant string.

Detach recipe: create **two** instances from the same variant. Palette copy → section (linked). Composition copy → restyle, then `detachInstance()`. Never detach first and try to re-link.

### 7. Report

- Restyle frame id + URL (`node-id` with `-`)
- Linked instances used (Anatomy name + variant)
- Detached regions (if any) and confirmation that **Components to use** holds matching **linked** instances
- Unmatched regions
- Offer `m4-figma-to-code` if they want it in the prototype next

## Not this skill

| Ask | Use instead |
|-----|-------------|
| Replace gray boxes **in place** on a lo-fi wireframe | `figma-wireframe-to-anatomy` |
| Implement the screen in React | `m4-figma-to-code` |
| New Anatomy components / variants | stop — Anatomy library, by designers |
| Code → Figma screen from the app | `figma-generate-design` (still Anatomy instances, not this restyle flow) |
