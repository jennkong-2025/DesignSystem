# Anatomy component states — tokens and recipes

Anatomy file key: `VT79VSlhYlpl0g2JS9vLKt`

## Style source

[Text Link](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=43307-40429) `43307:40429`

Filled exemplar: [List Item (archive)](https://www.figma.com/design/VT79VSlhYlpl0g2JS9vLKt/Anatomy--IH-Design-System?node-id=19874-935) `19874:935` — `State=Default | Disabled | Hover | Focus | Pressed`

Do not copy Text Link’s underline or brand text color onto the target. Only copy **surface / ring / disabled content** treatment. Leave the target’s type and Default colors alone.

## Tokens

| State | What to apply |
|-------|----------------|
| Disabled | No surface fill change. Rebind **TEXT** and **VECTOR** fills to `color/text/neutral/disabled`. Do not rebind surface/background fills. Nested instance icons need explicit vector rebinds. |
| Hover | Fill `color/surface/brand/weak`. If Default’s four corners are `0`, bind `Radius/S`; otherwise keep the source radii. |
| Focus | No fill. Absolute child named `Focus`: 1px stroke `color/border/brand/base`, 4px outset (`x/y = -4`, size = width+8 × height+8). Copy the wrapper’s corner radii onto the ring (or `Radius/S` if they are all `0`). Parent `clipsContent = false`. |
| Pressed | Fill `color/surface/overlay darken/weak`. Same radius rule as Hover. |

Do not change text or icon fills on Hover / Focus / Pressed.

## Helpers

Look variables up by **name**, not collection. Anatomy collections are `Color` (tokens named `color/…`) and `Size` (includes `Radius/S`). Do not look for collections named `color` or `Radius`.

```js
const allVars = await figma.variables.getLocalVariablesAsync();
function findVar(name) {
  const v = allVars.find((x) => x.name === name);
  if (!v) throw new Error("Missing variable " + name);
  return v;
}
function bindFill(node, variable) {
  node.fills = [
    figma.variables.setBoundVariableForPaint(
      { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
      "color",
      variable,
    ),
  ];
}
function bindStroke(node, variable) {
  node.strokes = [
    figma.variables.setBoundVariableForPaint(
      { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
      "color",
      variable,
    ),
  ];
}
function bindRadius(node, radiusVar) {
  node.setBoundVariable("topLeftRadius", radiusVar);
  node.setBoundVariable("topRightRadius", radiusVar);
  node.setBoundVariable("bottomLeftRadius", radiusVar);
  node.setBoundVariable("bottomRightRadius", radiusVar);
}
function cornersAreZero(node) {
  return (
    node.topLeftRadius === 0 &&
    node.topRightRadius === 0 &&
    node.bottomLeftRadius === 0 &&
    node.bottomRightRadius === 0
  );
}
function copyRadii(from, to) {
  to.topLeftRadius = from.topLeftRadius;
  to.topRightRadius = from.topRightRadius;
  to.bottomLeftRadius = from.bottomLeftRadius;
  to.bottomRightRadius = from.bottomRightRadius;
}
```

Variables: `color/text/neutral/disabled`, `color/surface/brand/weak`, `color/surface/overlay darken/weak`, `color/border/brand/base`, `Radius/S`.

## Apply states

```js
function applyHover(comp, brandWeak, radiusS) {
  bindFill(comp, brandWeak);
  if (cornersAreZero(comp)) bindRadius(comp, radiusS);
}
function applyPressed(comp, overlay, radiusS) {
  bindFill(comp, overlay);
  if (cornersAreZero(comp)) bindRadius(comp, radiusS);
}
function applyFocus(comp, borderBrand, radiusS) {
  comp.clipsContent = false;
  let ring = comp.children.find((c) => c.name === "Focus");
  if (!ring) {
    ring = figma.createFrame();
    ring.name = "Focus";
    ring.fills = [];
    comp.appendChild(ring);
  }
  ring.layoutPositioning = "ABSOLUTE";
  bindStroke(ring, borderBrand);
  ring.strokeWeight = 1;
  if (cornersAreZero(comp)) bindRadius(ring, radiusS);
  else copyRadii(comp, ring);
  const pad = 4;
  ring.resize(comp.width + pad * 2, comp.height + pad * 2);
  ring.x = -pad;
  ring.y = -pad;
}
function applyDisabled(comp, disabledText) {
  function walk(node) {
    if (
      (node.type === "TEXT" || node.type === "VECTOR") &&
      node.fills !== figma.mixed &&
      node.fills &&
      node.fills[0] &&
      node.fills[0].type === "SOLID"
    ) {
      bindFill(node, disabledText);
    }
    if ("children" in node) {
      for (const child of node.children) walk(child);
    }
  }
  walk(comp);
}
```

If a nested instance has a `State` variant property, set Hover / Pressed to match so inner white fills do not cover the wrapper. Leave Focus on the wrapper ring only.

## Clone into the set

`clone()` of a variant may land on the **page**. Always reparent:

```js
function ensureInSet(set, node) {
  if (node.parent && node.parent.id !== set.id) set.appendChild(node);
}

const clone = src.clone();
clone.name = src.name.replace(/State=[^,]+/, "State=" + stateName);
// If the source had no State yet:
// clone.name = src.name + ", State=" + stateName;
ensureInSet(set, clone);
```

Skip when `set.children` already has that name.

## Grid

If `set.layoutMode` is not `NONE`, set it to `NONE` first, then fix each child’s size (`layoutSizingHorizontal/Vertical = 'FIXED'`) so auto-layout fill does not stretch them.

Keep each source’s **y**. Add columns to the right in **Default | Disabled | Hover | Focus | Pressed** order:

```
gap = 40
colWidth = widest source width
disabled.x = default.x + colWidth + gap
hover.x    = disabled.x + colWidth + gap
focus.x    = hover.x + colWidth + gap
pressed.x  = focus.x + colWidth + gap
```

Then:

```js
set.clipsContent = false;
let maxX = 0, maxY = 0;
for (const child of set.children) {
  maxX = Math.max(maxX, child.x + child.width);
  maxY = Math.max(maxY, child.y + child.height);
}
set.resizeWithoutConstraints(Math.ceil(maxX + 40), Math.ceil(maxY + 40));
```

## Batching

Clone at most **6 sources × 4 states** per `use_figma` call. Return `{ createdNodeIds, mutatedNodeIds }` every time.

## Naming

Existing List Item (archive) uses `Layout=Simple, State=Hover, Padding=False`.

This skill only **adds** `State=…`. It does not rename other axes (`Property 1=Top item` stays as-is).
