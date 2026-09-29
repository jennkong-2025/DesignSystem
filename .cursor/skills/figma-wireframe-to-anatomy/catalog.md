# Anatomy swap catalog (v1)

Published components this skill may swap **onto a wireframe**. Node ids are in the Anatomy file `VT79VSlhYlpl0g2JS9vLKt`. Resolve the published `key` at run time (keys change if the library is republished).

Source of node ids: [`cursor/context/figma-mapping.md`](../../cursor/context/figma-mapping.md) and [`cursor/context/design-system.md`](../../cursor/context/design-system.md).

When you add a new stable swap target, add a row here **and** keep figma-mapping in sync if the prototype already has a React wrapper.

## Swap targets

| Anatomy | Node | Typical variants / props | Match when the wireframe… | Group? |
|---------|------|--------------------------|---------------------------|--------|
| **Button** | [`42821:7424`](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=42821-7424) · size matrix [`38061:12501`](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=38061-12501) | Size `medium` (48px) / `small` (36px); Type primary / secondary / tertiary; label TEXT | Named Button/CTA; ~36–48px tall pill or bar; short action label | No |
| **Icon button** | [`16911:26834`](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=16911-26834) | Color brand / neutral; size small / medium | Circular or square icon-only hit target; overflow / close / add | No |
| **Text field** | [`16944:81143`](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=16944-81143) | Placeholder TEXT | Named search/input; one-line field with placeholder | No |
| **List item** | [`19874:935`](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=19874-935) | Title + subtitle TEXT; trailing | Full-width row, title + supporting line; activity/message row | No (one row each) |
| **Static Chip** | [`38090:9013`](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=38090-9013) | Size medium / small; color; emphasized | Small status label (`Upcoming`, `Paid`); non-interactive | No |
| **Interactive Chip** | [`38090:9256`](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=38090-9256) | Selected vs default; label | Filter chip / dismissible chip in a row | No |
| **Action Center Card** | [`44461:17134`](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=44461-17134) | Type calendar / bill / referral / provider-referral / progress | Stacked card: leading icon/date + title + optional chips + CTA | **Yes** — replace the whole card group |
| **Tabs** (2) | [`30284:42538`](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=30284-42538) | Selected segment | Two equal text tabs under a title | Yes if drawn as two boxes |
| **Tabs** (3) | [`30284:42639`](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=30284-42639) | Selected segment | Three segment tabs | Yes if drawn as three boxes |
| **Secondary navigation** | [`36992:39627`](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=36992-39627) | Title TEXT; back / overflow | Centered title bar under status bar | Yes if back + title + icon are separate |
| **Bottom tab bar** | [`179:39432`](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=179-39432) | Selected tab | Four/five items pinned to the bottom of a 375×812 frame | **Yes** — one bar, not per-icon |

## Nested pieces (do not swap alone)

These live **inside** Action Center Card. Only swap them if they appear as standalone wireframe controls, not as card guts.

| Anatomy | Node | Notes |
|---------|------|--------|
| leading-element | [`44016:15337`](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=44016-15337) | Prefer the parent Card |
| subcontent | [`44218:12623`](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=44218-12623) | Prefer the parent Card |
| chip-row | [`44218:12723`](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=44218-12723) | Prefer the parent Card |

## Out of v1 (leave unmatched unless user names the component)

- Product-only frames (Ferry cards, billing sheets, microsite chrome) — those are not Anatomy library components.
- Info-link (`M4AnatomyInfoLinkButton`) — product node, not a confirmed published Anatomy set. Search Anatomy by name only if the user asks.
- Icons as raw vectors — do not swap for a random icon set.
- Full-screen scaffolds, gradients, phone device frames.

## Variant guesses

| Cue | Guess | Confirm if ambiguous |
|-----|-------|----------------------|
| Height ≥ 44 and ≤ 52, full width | Button **medium** | Yes if height is ~40 |
| Height ~36 | Button **small** | — |
| Filled dark/blue bar vs outline vs text-only | primary / secondary / tertiary | Yes |
| Green/yellow/red chip | Static Chip success / warning / danger | Yes |
| Two vs three equal tabs | Tabs 2 vs 3 | Count labels |

Default Button to **medium + primary** and Static Chip to **small + neutral** only when the user did not specify; say so in the mapping table.
