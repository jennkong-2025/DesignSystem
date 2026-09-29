# Accessibility guidelines for the Accessibility table

Load this whenever you write, append, or revise rows in the **Accessibility** table. Every row must trace to a rule below. Rules are distilled from the IH [Accessibility Confluence space](https://includedhealth.atlassian.net/wiki/spaces/A11Y/overview) (WCAG 2.2 Level AA baseline). If a rule here and the Confluence page disagree, the Confluence page wins — re-read it and update this file.

## Sources

| Page | Use for |
|------|---------|
| [Design Handoff Checklist for Accessibility](https://includedhealth.atlassian.net/wiki/spaces/A11Y/pages/3738501123/Design+Handoff+Checklist+for+Accessibility) | **Primary.** Tier 1 / Tier 2 design requirements |
| [Accessibility Guidelines - Web](https://includedhealth.atlassian.net/wiki/spaces/A11Y/pages/3741155329/Accessibility+Guidelines+-+Web) | Semantics, landmarks, lists, focus, custom widgets, WCAG numbers |
| [Accessibility Guidelines - iOS](https://includedhealth.atlassian.net/wiki/spaces/A11Y/pages/3738501179/Accessibility+Guidelines+-+iOS) | VoiceOver traits, grouping, state |
| [Accessibility Guidelines - Android](https://includedhealth.atlassian.net/wiki/spaces/A11Y/pages/3739255100/Accessibility+Guidelines+-+Android) | TalkBack, 48dp targets, carousels, grouping |
| [Accessibility Guidelines - Customer-Facing Materials](https://includedhealth.atlassian.net/wiki/spaces/A11Y/pages/4332748912/Accessibility+Guidelines+-+Customer-Facing+Materials) | Headings, link text, plain language, text spacing, alt text |
| [Multimedia Accessibility Guidelines](https://includedhealth.atlassian.net/wiki/spaces/A11Y/pages/5518786659/Multimedia+Accessibility+Guidelines) | Captions, transcripts, audio description matrix |
| [Accessibility Testing - Web](https://includedhealth.atlassian.net/wiki/spaces/A11Y/pages/3917840398/Accessibility+Testing+-+Web) · [iOS](https://includedhealth.atlassian.net/wiki/spaces/A11Y/pages/3920756737/Accessibility+Testing+-+iOS) · [Android](https://includedhealth.atlassian.net/wiki/spaces/A11Y/pages/3920691201/Accessibility+Testing+-+Android) | What QA will verify — write rows that are testable this way |
| [Accessibility Issue User Impact Definitions](https://includedhealth.atlassian.net/wiki/spaces/A11Y/pages/3726442611/Accessibility+Issue+User+Impact+Definitions) | Severity language (Critical / Serious / Moderate / Minor) — do not put in cells |
| [Accessibility Fundamentals](https://includedhealth.atlassian.net/wiki/spaces/A11Y/pages/3329499243/Accessibility+Fundamentals) | Background: POUR principles, WCAG levels |

Context only (not component rules): space homepage, Accessibility Guidelines and Accessibility Testing parent pages (empty), IH Accessibility Maturity Model, Accessibility User Properties Tracked in Amplitude, newsletters.

## How to write a row

- **Elements** — the sub-component name as it appears in Tech Spec: Elements (`Icon`, `Title`, `Promo Bullets`).
- **Requirement** — a concern type (see vocabulary below). Keep the table's existing style; Modals-style tables that use `Required` / `Optional` stay that way.
- **Detail** — one concrete, testable behavior for this component, ending with the WCAG criterion in parentheses when the rule has one: `Text meets 4.5:1 contrast on the page background (WCAG 1.4.3)`. Rules marked "IH best practice" or "IH iOS / Android rule" get no parenthetical.
  - Tier 1 / MUST rules: state as a requirement (`must`, or an imperative).
  - Tier 2 / SHOULD rules: use `should`.
  - Name the Anatomy token when contrast depends on it (`fg/base on bg/base`). Do not invent ratios; use the thresholds below.
  - Say **member**, not user.
- One rule per row. Split "contrast and focus" into two rows.
- Only document what the linked component actually has. No form-field rows on a list; no multimedia rows on a card without video.

## Requirement vocabulary

Use these concern types (existing tables already use the first seven):

`Landmark` · `Structure` · `Role` · `State` · `Contrast` · `Dynamic content` · `Assistive technology` · `Text alternative` · `Focus` · `Keyboard` · `Touch target` · `Color as information` · `Text resize` · `Motion` · `Labels` · `Media`

## Rule checklist by component trait

Walk the linked component and add a row for every trait it has.

### Every component

| Concern | Rule | WCAG |
|---------|------|------|
| Contrast | Small text (under 18pt regular / 14pt bold) at least 4.5:1; 7:1 preferred (Tier 1) | 1.4.3 |
| Contrast | Large text (18pt+ regular / 14pt+ bold) at least 3:1 (Tier 1) | 1.4.3 |
| Text resize | Readable and functional at 200% text size; no content or functionality disappears | 1.4.4 |
| Structure | Reading order is logical and matches the visual order | 1.3.2 |
| Color as information | Meaning carried by color also has visible text or an icon with a label (Tier 1) | 1.4.1 |
| Structure | Instructions do not rely only on shape, color, size, or location (Tier 1) | 1.3.3 |

### Has icons or images

| Concern | Rule | WCAG |
|---------|------|------|
| Text alternative | Decorative or redundant icons are hidden from assistive technology; mark decorative in the spec (Tier 1) | 1.1.1 |
| Text alternative | Informative images have meaningful alt text, under ~250 characters, without "image of" | 1.1.1 |
| Text alternative | Actionable icons (icon buttons, nav) have an accessible name (Tier 1) | 1.1.1 |
| Contrast | Graphics needed to understand content have 3:1 against adjacent colors (Tier 1) | 1.4.11 |
| Text alternative | Complex images (charts) have brief alt text plus a visible longer description (Tier 1) | 1.1.1 |
| Structure | No informative text baked into images (Tier 1) | 1.4.5 |

### Has headings or titles

| Concern | Rule | WCAG |
|---------|------|------|
| Structure | Text that acts as a heading uses heading markup / the header trait; text that does not, does not | 1.3.1 |
| Structure | Headings are accurate, brief, and do not skip levels | 2.4.6 |
| Structure | Screen has a unique title and one visible main heading (Tier 1) | 2.4.2 |

### Is a list or group of related items

| Concern | Rule | WCAG |
|---------|------|------|
| Structure | Lists use list semantics (`ul` / `ol` / `li`) | 1.3.1 |
| Assistive technology | Multi-line card or row content is grouped and announced as one element (iOS / Android testing) | 1.3.1 |
| Landmark | Keep landmarks few; a component is not a landmark unless it is a page region | 2.4.1 |

### Is interactive (button, link, selectable row, control)

| Concern | Rule | WCAG |
|---------|------|------|
| Role | Conveys the correct role (button, link, tab, switch) to VoiceOver / TalkBack | 4.1.2 |
| Labels | Has an accessible name; the programmatic name contains the visible label | 2.5.3 |
| Focus | Visible focus indicator on every focusable element, 3:1 against the background (Tier 1) | 2.4.7, 1.4.11 |
| Keyboard | Reachable and operable by keyboard; focus is never trapped | 2.1.1, 2.1.2 |
| Touch target | At least 44×44 px (48×48dp on Android) with at least 6 px between targets (Tier 2) | IH best practice |
| Contrast | Control boundaries have 3:1 against adjacent areas (Tier 1) | 1.4.11 |
| Contrast | Text links are 3:1 against surrounding text and get an extra cue on hover/focus (Tier 1) | 1.4.1 |
| Role | Activates on release, not on first touch | 2.5.2 |
| Labels | Link text describes the destination; no "click here" / "read more" | 2.4.4 |

### Has state (expand/collapse, selected, checked, disabled)

| Concern | Rule | WCAG |
|---------|------|------|
| State | Initial state is exposed (`aria-expanded`, selected, checked) | 4.1.2 |
| State | State changes are announced when they happen | 4.1.3 |
| State | Disabled controls convey disabled; if the member must know about them, provide another way to discover them | 1.3.1 |

### Changes content on screen (reveal, load, toast, error)

| Concern | Rule | WCAG |
|---------|------|------|
| Dynamic content | New content is announced, or is the next thing the screen reader reaches | 4.1.3 |
| Focus | Focus is moved on purpose when context changes, never lost or reset to the top | 2.4.3 |
| Focus | Dialogs take focus when opened, keep it until dismissed, and return it to the trigger | 2.4.3 |

### Moves or animates (carousel, auto-advance, animation)

| Concern | Rule | WCAG |
|---------|------|------|
| Motion | Auto-moving content over 5 seconds can be paused, stopped, or hidden (Tier 1) | 2.2.2 |
| Motion | No flashing more than 3 times per second (Tier 1) | 2.3.1 |
| Motion | Nothing depends on a gesture alone; offer a button alternative | 2.5.1 |
| Motion | Honor reduced motion; non-essential motion can be turned off | IH iOS / Android rule |

### Is a form field or input

| Concern | Rule | WCAG |
|---------|------|------|
| Labels | Visible label near the field; placeholder is never the only label (Tier 1) | 3.3.2 |
| Labels | Groups (radios, checkboxes) have a visible group label plus a label per option | 1.3.1 |
| Labels | Required fields are marked visually and programmatically (Tier 1) | 3.3.2 |
| Dynamic content | Errors are visible, describe the fix, and are tied to the field (Tier 2) | 3.3.1, 3.3.3 |

### Plays media

| Concern | Rule | WCAG |
|---------|------|------|
| Media | Pre-recorded video with audio: captions and audio description required; transcript best practice | 1.2.2, 1.2.5 |
| Media | Pre-recorded audio only: transcript required | 1.2.1 |
| Media | Live video with audio: captions required | 1.2.4 |

## Text and layout (Tier 2, add when the component is text-heavy)

- Line height at least 1.5; paragraph spacing at least 1.5× line spacing
- Left-aligned, not fully justified; no more than 80 characters per line
- Plain language; expand acronyms on first use
