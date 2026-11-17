# Spec table copy contract

Load this whenever filling Anatomy Specs & Details. **Headers stay exactly as they are on the table you are writing into.** Copy describes the **linked section**, not a generic overlay.

**Filled-cell exemplars:** Page Banner `47299:14446` · Service Card `47228:45748` · List item `47319:24056` · Modals `48830:9633` · Accordion `50184:14956`. Older Elements cells may still say DO / DON'T. New Elements rows do not. Put that usage in Usage Guidelines.

**Existing spec:** do not add rows or edit Design Intent, Eventing, or Content. Add Usage Guidelines if it is missing. Append only to Usage Guidelines, Elements, Interactions, Accessibility.

## Voice

- Say **member**, not user.
- Sentence case in body cells (`page banner`, `list item`, `modal`). Title case only if a Component column exists (`Modal`).
- Prefer Anatomy **token names** over raw hex. Hex only as a measured supplement after the token.
- “What does it do” = behavior. “When and why” = situation + interruption. Do not mix.
- Do not paraphrase after writing. If a cell is wrong, replace the whole string.

## Lists

**Design Intent — Use for / Not for (and Avoid when):**

- Real newlines (`\n`). Never `•` or `- `.
- Fragments, not sentences. No trailing periods on Use for / Not for items.
- 3–5 items. Density like Page Banner and List item.
- Not for / Avoid when: name the **alternative** when one exists (`use Toast`, `use Table`).
- Service Card uses **Avoid when** (prose is OK there). Do not rename that header to Not for.

**Usage Guidelines — Detail, and Tech Spec: Elements — Detail:**

- Do **not** use `DO` / `DON'T` headers in either table.
- Never type `• ` or `- ` in the string.
- Usage Guidelines Detail is designer/PM guidance and stays plain text.
- Tech Spec: Elements Detail is mechanical behavior, and every line is a bullet. See the two sections below.

## Design Intent — do not change headers

Row 0 = title `Design Intent`. Row 1 = headers. Body starts at row 2.

**4 columns** (Page Banner, List item, Service Card — default):

| Header | Shape | Limit |
|--------|--------|--------|
| What does it do | 1–2 sentences | Behavior of **this** component |
| When and why to use it | 1–2 sentences | When the member needs it |
| Use for | Newline list | 3–5 fragments from this section |
| Not for *or* Avoid when | Newline list | Alternatives; keep whichever header exists |

Usually **one body row**. Do not add a Component column.

On an **existing spec**, do not add Design Intent rows and do not edit the cells that are already there.

## Usage Guidelines (2 columns)

Place this table **directly under Design Intent**. Clone the Design Intent table so the title row keeps that same purple fill. Do not invent a new purple. Title text: `Usage Guidelines`.

Headers (do not change once written): `Guideline` · `Detail`

**Litmus test:** what a designer or PM needs to know to decide **when** and **how** to use this component on a real screen. Exclude implementation detail an engineer would own.

| Guideline (column 1) | Cover in Detail |
|----------------------|-----------------|
| Readability | Max items, rows, or columns before the screen is hard to scan |
| Label length | Recommended text or label length |
| Punctuation and capitalization | Conventions for this component's text |
| Variant choice | When to use this variant vs another variant vs a different component |
| Placement | Where it may and may not sit |

- One row per topic that applies. Skip a topic the component does not have (no Punctuation row on a component with no text).
- Detail: 1–3 sentences, or newline fragments. Sentence case. Say **member**.
- Name the other component when Variant choice points away (`use Icon button`, `use Chip Static`).
- Do not put min/max pixels, line-clamp rules, breakpoint reflow, or sibling height math here.
- **Existing spec:** append a topic only when column 1 does not already have it. Do not edit filled rows.

## Tiebreaker

If a fact affects both what is rendered and how someone decides to use it, split it:

| Put in Usage Guidelines | Put in Tech Spec: Elements |
|-------------------------|----------------------------|
| Recommended limit (`keep labels under 20 characters`) | Mechanical result (`truncate with an ellipsis after 20 characters`) |
| Which variant to pick | How that variant hides or shows a part |
| Where it should sit on a screen | How it reflows at a breakpoint |

## Design Intent — 5 columns (Modals only)

When the Design Intent table already has a `Component` column:

| Header | Shape |
|--------|--------|
| Component | 1–3 words, title case |
| What does it do | 1–2 sentences |
| When and why to use it | Viewport + interruption |
| Use for / Not for | Newline lists |

One row per variant the example actually shows. Do not invent variants.

## Tech Spec: Elements (3 columns)

Headers (do not change): `Elements` · `Required / Conditional / Optional` · `Detail`

This table explains **how each sub-component is built**. Not when a designer should choose it.

| Column | What to write |
|--------|----------------|
| **Elements** | Name of each sub-component. Use the layer / property name from the linked example. Name nested Anatomy components when used (`Anatomy Divider`, `List Item/Content`, `Badge Notification`). |
| **Required / Conditional / Optional** | Only `Required`, `Conditional`, `Optional`, `Not used`, or `Not in this example`. |
| **Detail** | Implementation facts an engineer or coding agent needs that the design file does not already show. Not usage advice. |

**Litmus test:** what is **not** already expressed by looking at the frames. Exclude anything a designer decides contextually (that belongs in Usage Guidelines).

Cover, where it applies to that element:

- Min or max width, and min or max height
- Line wrapping, truncation, or overflow
- Responsive behavior (breakpoints, reflow)
- Conditional or dependent parts (`hide the icon if the label is absent`)
- Sizing dependencies that are not a pixel size (`height matches the tallest sibling`, `fills the parent`)
- State logic that is not a static frame (hover, focus, disabled, error transitions)
- Differences between variants that are not obvious side by side

**Do not include in Detail:**

- Color. No hex, no fill or stroke token, no color name.
- Line width or stroke weight.
- A pixel width or pixel height, including a fixed width, fixed height, padding, or gap in pixels.

The only size numbers allowed are a **min** or a **max** (`Max width: 300`, `min height: Size/40`). A fixed size is not a min or max. Omit it.

**Detail shape:**

- One fact per line, separated by real newlines. No `DO` / `DON'T`.
- Every non-empty line is a bullet. After `writeCell` on the Detail cell, apply unordered list style to each line. Do not type `• ` or `- ` into the string. Recipe: [exemplar.md](exemplar.md).
- Example: `Max width: 300` / `Truncation: ellipsis after 1 line` / `Depends on: hidden when Label is empty`
- A size token is allowed only when it is a min or max (`min height: Size/40`). Do not name a color token.
- Omit a line that does not apply. Do not write `TBD`, `—`, or `N/A`.
- One row per sub-component the example (or its component set) actually has.
- Leave unused grid rows blank.
- **Existing spec:** append a row only when that element is not already named in column 1. Do not edit filled rows. New rows use this implementation Detail, even if older rows still contain usage copy.

## Tech Spec: Interactions (2 columns)

Headers: `Interactions` · `Detail`

- Rows are **member verbs** as they appear on this component (`Select card`, `Select list item with chevron`, `View page banner`).
- Detail: what happens to the surface, navigation, and persistence. Newlines for stacked facts.
- Only interactions the example supports. Leave unused rows blank.
- **Existing spec:** append a row only when that interaction is not already named in column 1. Do not edit filled rows.

## Accessibility (3 columns)

Headers: `Elements` · `Requirement` · `Detail`

**Guideline source (required):** [accessibility-guidelines.md](accessibility-guidelines.md), distilled from the IH Accessibility Confluence space. Every new or revised row must trace to a rule in that file. Walk its "Rule checklist by component trait" against the linked component before drafting.

- **Do not rewrite Requirement to only Required/Optional** if the table uses concern types.
- Match the style already on that table:
  - Page Banner / List item / Service Card: concern types from the vocabulary in `accessibility-guidelines.md` (`Landmark`, `Structure`, `Role`, `State`, `Contrast`, `Dynamic content`, `Assistive technology`, `Text alternative`, `Focus`, `Touch target`, …)
  - Modals (if headers/cells already use it): `Required` / `Optional`
- **Reference exemplar (copy its shape):** the human-reviewed [Service card Accessibility table](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=50392-15874), node `50392:15874`, Cards page. Rows: `CTA button`, `Anatomy Chip Static`, `Anatomy Icon Container`, `Service card set`, `Service card`.
- **Never write a WCAG reference** in any cell: no `(WCAG 1.4.3)`, no criterion numbers, no "WCAG". The guideline file keeps them for tracing only.
- **No repeated elements.** Every value in the Elements column appears once in the table. Before writing, read column 1 of the whole table, including rows already filled. If an element has more than one concern, write one row: join the concerns in Requirement with ` / ` and give each concern its own sentence in Detail. Never add a second row for the same element.
- **Elements column:** one distinct part per row. Use the names from Tech Spec: Elements. Name a nested Anatomy component with the `Anatomy` prefix (`Anatomy Chip Static`, `Anatomy Icon Container`). Name the whole component, and the set of them, when each has its own behavior (`Service card`, `Service card set`).
- **Requirement:** 1 to 3 concern types from the vocabulary, joined with ` / ` (`Structure / Text alternative`).
- **Detail:** plain text, no bullets. One short sentence per concern, 2 sentences at most. State the rule, then the reason or an `e.g.` example when it helps the reader. Use `must` for Tier 1 / MUST rules and `should` for Tier 2 / SHOULD rules. Use a number only when the number is the rule (`at least 44×44 px, with at least 6 px between targets`).
- **Component-specific rows only.** Do not add rows every component shares, such as text contrast or text resize, unless something about this component changes them. Favor what a screen reader announces, how parts are grouped, what is hidden, reading order, list semantics, and touch targets.
- **Order:** nested parts first, then the whole component, then the set.
- Aim for 4 to 6 rows. Only rows for traits the component actually has (no form rows on a list). Leave unused rows blank.
- **Existing spec:** append a row only when that element is not already in column 1. Do not edit filled rows unless the user explicitly asks to revise them; then rewrite those rows against `accessibility-guidelines.md`.

## Eventing and Content

| Table title starts with | New block | Existing spec |
|-------------------------|-----------|----------------|
| Eventing | Blank body after clone | **Do not touch** |
| Content Spec | Blank body after clone | **Do not touch** |
| Content Guiding Principle | Blank body after clone | **Do not touch** |

On an existing spec, do **not** add rows to these tables.

## Do not

- Change `Not for` ↔ `Avoid when` or any other header
- Add rows to Design Intent, Eventing, or Content on an existing spec
- Fill Eventing or Content on a new clone (except clearing leaked clone copy)
- Paste Page Banner / Modal copy into a different component
- Put usage examples in “What does it do”
- Type `• ` or `- ` in any cell. Elements Detail bullets come from list style, not typed characters
- Leave Tech Spec: Elements Detail as plain text. Every non-empty line is a bullet
- Put when/how usage, recommended character counts, or variant-choice advice in Tech Spec: Elements
- Put color, line width, stroke weight, or a pixel width or height in Tech Spec: Elements, unless that size is a min or max
- Put min/max pixels, truncation mechanics, breakpoint reflow, or sibling sizing math in Usage Guidelines
- Fill empty rows with `TBD`, `—`, `N/A`
- Rewrite filled Usage Guidelines / Element / Interaction / Accessibility rows on an existing spec
- Create a Usage Guidelines table from scratch. Clone the Design Intent table
