# Exemplars, IDs, and write recipe

Anatomy file key: `VT79VSlhYlpl0g2JS9vLKt`

## Filled exemplars (read these; copy their shape)

| Component | Specs & Details | Page | Design Intent |
|-----------|-----------------|------|----------------|
| [Page Banner](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=47299-14446) | `47299:14446` | Banners | 4 col, no Component |
| [Service Card](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=47228-45748) | `47228:45748` | Cards | 4 col, last header **Avoid when** |
| [List item](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=47319-24056) | `47319:24056` | Lists | 4 col, **Not for** |
| [Modals](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=48830-9633) | `48830:9633` | Sheets & modals | 5 col, **Component** |
| [Accordion](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=50184-14956) | `50184:14956` | Lists | 4 col, **Not for** |
| [Timeline](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=50193-14434) | `50193:14434` | Lists | 4 col, **Not for** |
| [Carousel](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=50215-16181) | `50215:16181` | Pagination | 4 col, **Not for** |
| [Promo Bullets](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=50260-15154) | `50260:15154` | Lists | 4 col, **Not for** |

Default **clone source** for a **new** block: **Page Banner** `47299:14446`. Then **blank Eventing and Content bodies** before filling Design Intent, Usage Guidelines, Elements, Interactions, Accessibility. Usage Guidelines is a second clone of that block's Design Intent table, placed directly under it.

On an **existing** Specs & Details frame: do not clone. Do not blank anything. Append to Elements / Interactions / Accessibility only.

Use Modals as clone source only when the target section already uses 5-col Design Intent (named variants).

## Page Banner tables (clone / identify)

| Title | Node | Cols | New block | Existing spec |
|-------|------|------|-----------|----------------|
| Design Intent | `47299:14447` | 4 | Fill | **Do not touch** |
| Tech Spec: Elements | `47299:14449` | 3 | Fill | **Append new rows** |
| Tech Spec: Interactions | `47299:14450` | 2 | Fill | **Append new rows** |
| Accessibility | `47299:14451` | 3 | Fill | **Append new rows** |
| Eventing | `47299:14452` | 4 | Blank body | **Do not touch** |
| Content Spec: … | `47877:25687`, `47877:25749` | 4 | Blank body | **Do not touch** |

After `frame.clone()`, find tables on the **clone** by title (`cellAt(0,0)`), not by these source IDs.

## Identify tables on any Specs frame

```js
function tableTitle(t) {
  try {
    const a = t.cellAt(0, 0).text.characters.trim();
    if (a) return a;
    return t.cellAt(0, 1).text.characters.trim(); // Modals title sits in col 1
  } catch (e) {
    return t.name;
  }
}
```

| Title contains | New block | Existing spec |
|----------------|-----------|----------------|
| `Design Intent` | Fill | Do not touch |
| `Usage Guidelines` | Create under Design Intent, then fill | Create if missing, else append missing topics |
| `Tech Spec: Elements` | Fill with implementation details | Append new rows |
| `Tech Spec: Interactions` | Fill | Append new rows |
| `Accessibility` (and not Content) | Fill | Append new rows |
| `Eventing` | Blank body | Do not touch |
| `Content Spec` or `Content Guiding` | Blank body | Do not touch |

## Usage Guidelines table

Clone the frame's **Design Intent** table. Do not create a `TABLE` from scratch. The clone keeps the purple title fill.

```js
function tableTitle(t) {
  try {
    const a = t.cellAt(0, 0).text.characters.trim();
    if (a) return a;
    return t.cellAt(0, 1).text.characters.trim();
  } catch (e) {
    return t.name;
  }
}

async function ensureUsageGuidelines(frame) {
  for (const child of frame.children) {
    if (child.type === "TABLE" && tableTitle(child) === "Usage Guidelines") return child;
  }
  const intent = frame.children.find(
    (child) => child.type === "TABLE" && tableTitle(child) === "Design Intent",
  );
  if (!intent) throw new Error("No Design Intent table to clone");
  const clone = intent.clone();
  const index = frame.children.indexOf(intent);
  frame.insertChild(index + 1, clone);
  await writeCell(clone, 0, 0, "Usage Guidelines");
  await writeCell(clone, 1, 0, "Guideline");
  await writeCell(clone, 1, 1, "Detail");
  while (clone.numColumns > 2) clone.removeColumn(clone.numColumns - 1);
  const width = intent.width;
  clone.resizeColumn(0, Math.round(width * 0.32));
  clone.resizeColumn(1, Math.round(width - Math.round(width * 0.32)));
  await blankBody(clone);
  if (frame.layoutMode === "NONE") {
    clone.x = intent.x;
    clone.y = intent.y + intent.height + 48;
    for (const child of frame.children) {
      if (child.id === intent.id || child.id === clone.id) continue;
      if (child.y >= clone.y) child.y += clone.height + 48;
    }
  }
  return clone;
}
```

`blankBody` here only clears **this clone's** body (row 2+), so Design Intent sentences do not leak. Never run it on a Usage Guidelines table that already has body copy.

Then fill the topics from [table-contract.md](table-contract.md). Do not call `applyDoDontLists` on Usage Guidelines or on Tech Spec: Elements.

**Elements Detail** is plain newline-separated implementation lines. No list styling.

## Blank body rows (new block only)

Use **only** on a table you just cloned: Eventing, Content, and the new Usage Guidelines clone. Never run this on an existing spec's filled tables.

Row 0 = group title, row 1 = headers. Clear from row 2:

```js
async function blankBody(table) {
  for (let r = 2; r < table.numRows; r++) {
    for (let c = 0; c < table.numColumns; c++) {
      await writeCell(table, r, c, "");
    }
  }
}
```

## Append a row (existing spec)

Body starts at row 2. A row is occupied if any cell has trimmed text.

```js
function occupied(table, r) {
  for (let c = 0; c < table.numColumns; c++) {
    const t = table.cellAt(r, c).text;
    if (t && t.characters.trim()) return true;
  }
  return false;
}

function existingLabels(table) {
  const labels = new Set();
  for (let r = 2; r < table.numRows; r++) {
    const t = table.cellAt(r, 0).text;
    if (t && t.characters.trim()) labels.add(t.characters.trim().toLowerCase());
  }
  return labels;
}

async function appendRow(table, cells) {
  let row = -1;
  for (let r = 2; r < table.numRows; r++) {
    if (!occupied(table, r)) { row = r; break; }
  }
  if (row < 0) {
    table.insertRow(table.numRows);
    row = table.numRows - 1;
  }
  for (let c = 0; c < cells.length; c++) await writeCell(table, row, c, cells[c]);
}
```

Skip append when `existingLabels` already has the element / interaction name.

## `cellAt` recipe

```js
async function writeCell(table, row, col, text) {
  const cell = table.cellAt(row, col);
  const tn = cell.text;
  const seen = {};
  for (const s of tn.getStyledTextSegments(["fontName"])) {
    const key = s.fontName.family + "|" + s.fontName.style;
    if (!seen[key]) {
      await figma.loadFontAsync(s.fontName);
      seen[key] = true;
    }
  }
  tn.characters = text;
}
```

Never write to `row < 2`. Body starts at row 2. Preload Figtree Regular / Medium / Bold if needed.

**Elements Detail (column 2)** — after `writeCell`, apply one-level list style. Do not put `• ` in `text`.

```js
function applyDoDontLists(textNode) {
  const chars = textNode.characters;
  if (!chars) return;
  textNode.setRangeListOptions(0, chars.length, { type: "NONE" });
  let offset = 0;
  const lines = chars.split("\n");
  for (const line of lines) {
    const start = offset;
    const end = Math.min(offset + line.length + 1, chars.length);
    const trimmed = line.trim();
    const isHeader =
      trimmed === "" ||
      trimmed === "DO" ||
      trimmed === "DON'T" ||
      trimmed.startsWith("Appears when:");
    if (!isHeader) {
      textNode.setRangeListOptions(start, end, { type: "UNORDERED" });
    }
    offset += line.length + 1;
  }
}
```

Do **not** call `applyDoDontLists` for Usage Guidelines or Tech Spec: Elements. Those cells are plain text.

Return `{ createdNodeIds, mutatedNodeIds }` from every mutating `use_figma` call.

## Placement when cloning

Append the clone to the **target section** (the page block the user linked), not `(0,0)` on the page. Sit it next to existing examples, matching that page’s Specs & Details x/width when possible (~1146 wide on Banner/Card/List). Increase section height so nothing clips.

## Linked node types

| User links | Treat as |
|------------|----------|
| Specs & Details frame | Existing spec if it has body copy; append only |
| Component example / instance | Measure it; existing vs new path on parent specs |
| Page section (Banners, Cards, …) | Measure the primary example; existing vs new path |
| Component set | Measure default variant; document what is on canvas |
