# Swap recipes (`use_figma`)

Load **`figma-use`** first. Every call: `skillNames: "figma-use,figma-wireframe-to-anatomy"`, `fileKey` of the **target** file (never Anatomy) unless the script is a read-only key lookup.

Rules that bite this workflow: `return` IDs; no `figma.notify`; no async IIFE; `await figma.setCurrentPageAsync` at most once; load fonts before text; `insertChild` before `FILL`; ≤10 logical ops per call.

## Resolve published keys (Anatomy file, read-only)

`fileKey`: `VT79VSlhYlpl0g2JS9vLKt`

```js
const ids = ["42821:7424", "38090:9013"];
const out = [];
for (const id of ids) {
  const node = await figma.getNodeByIdAsync(id);
  if (!node) {
    out.push({ id, error: "missing" });
    continue;
  }
  const set =
    node.type === "COMPONENT_SET"
      ? node
      : node.parent?.type === "COMPONENT_SET"
        ? node.parent
        : node;
  out.push({
    requestedId: id,
    name: set.name,
    type: set.type,
    key: set.key,
    id: set.id,
  });
}
return { resolved: out };
```

## Inspect a wireframe frame (target file, read-only)

```js
const page = await figma.getNodeByIdAsync("PAGE_ID");
await figma.setCurrentPageAsync(page);
const frame = await figma.getNodeByIdAsync("FRAME_ID");
if (!frame || !("children" in frame)) return { error: "not a frame" };

function textSample(node) {
  const texts = node.findAllWithCriteria
    ? node.findAllWithCriteria({ types: ["TEXT"] })
    : [];
  return texts
    .slice(0, 4)
    .map((t) => t.characters.slice(0, 80));
}

const candidates = frame.children.map((n, index) => ({
  id: n.id,
  name: n.name,
  type: n.type,
  index,
  x: n.x,
  y: n.y,
  width: n.width,
  height: n.height,
  visible: n.visible,
  layoutSizingHorizontal: n.layoutSizingHorizontal,
  isInstance: n.type === "INSTANCE",
  mainName: n.type === "INSTANCE" ? n.mainComponent?.name ?? null : null,
  texts: textSample(n),
  childNames: "children" in n ? n.children.slice(0, 8).map((c) => c.name) : [],
}));

return { frameId: frame.id, frameName: frame.name, candidates };
```

## Import + pick variant (target file)

```js
const set = await figma.importComponentSetByKeyAsync("PUBLISHED_SET_KEY");
const variant =
  set.children.find(
    (c) =>
      c.type === "COMPONENT" &&
      c.name.includes("Size=medium") &&
      c.name.includes("Type=primary")
  ) || set.defaultVariant;

return {
  createdNodeIds: [],
  mutatedNodeIds: [],
  setId: set.id,
  variantId: variant.id,
  variantName: variant.name,
};
```

Match **actual** variant property strings from the set (inspect `defaultVariant.name` first). Do not assume `Size=` vs `size=`.

## `swapComponent` (source is already an instance)

```js
const page = await figma.getNodeByIdAsync("PAGE_ID");
await figma.setCurrentPageAsync(page);

const [set] = await Promise.all([
  figma.importComponentSetByKeyAsync("PUBLISHED_SET_KEY"),
]);
const variant =
  set.children.find(
    (c) => c.type === "COMPONENT" && c.name.includes("Size=medium")
  ) || set.defaultVariant;

const inst = await figma.getNodeByIdAsync("SOURCE_INSTANCE_ID");
if (!inst || inst.type !== "INSTANCE") return { error: "not an instance" };
inst.swapComponent(variant);

const owner = variant.parent?.type === "COMPONENT_SET" ? variant.parent : variant;
const defs = owner.componentPropertyDefinitions;
const labelKey = Object.keys(defs).find((k) => defs[k].type === "TEXT");
if (labelKey) {
  const fonts = inst
    .findAllWithCriteria({ types: ["TEXT"] })
    .map((t) => t.fontName);
  const unique = [...new Map(fonts.map((f) => [JSON.stringify(f), f])).values()];
  await Promise.all(unique.map((f) => figma.loadFontAsync(f)));
  inst.setProperties({ [labelKey]: "Continue" });
}

return { createdNodeIds: [], mutatedNodeIds: [inst.id] };
```

## Replace-in-place (source is a frame / rectangle / group)

```js
const page = await figma.getNodeByIdAsync("PAGE_ID");
await figma.setCurrentPageAsync(page);

const source = await figma.getNodeByIdAsync("SOURCE_NODE_ID");
if (!source || !source.parent) return { error: "missing source" };
const parent = source.parent;
const index = parent.children.indexOf(source);
const wasFill = source.layoutSizingHorizontal === "FILL";
const x = source.x;
const y = source.y;
const w = source.width;

const set = await figma.importComponentSetByKeyAsync("PUBLISHED_SET_KEY");
const variant =
  set.children.find(
    (c) => c.type === "COMPONENT" && c.name.includes("Size=medium")
  ) || set.defaultVariant;

const inst = variant.createInstance();
parent.insertChild(index, inst);
inst.x = x;
inst.y = y;
if (wasFill) {
  inst.layoutSizingHorizontal = "FILL";
} else {
  inst.resize(w, inst.height);
}

const removedId = source.id;
source.remove();

return {
  createdNodeIds: [inst.id],
  mutatedNodeIds: [parent.id],
  removedNodeIds: [removedId],
};
```

`source.remove()` invalidates `source.id`. Capture `inst.id` before remove. For grouped card replacements, delete **all** confirmed sibling ids after one insert, highest index first so remaining indices stay valid — or delete by id after collecting them.

## Property owner narrowing

Never read `componentPropertyDefinitions` on a variant `COMPONENT`. Use the parent `COMPONENT_SET`. TEXT / BOOLEAN / INSTANCE_SWAP keys include a `#uid` suffix (`Label#2:0`). Wrong keys silently no-op.

## Batching

One call: import (if not already in-file) + up to five replacements on the **same page**. Then `await frame.screenshot()` on the parent frame and return IDs. Fix layout before the next batch.
