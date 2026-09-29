# Restyle recipes (`use_figma`)

Load **`figma-use`** first. Every call: `skillNames: "figma-use,figma-mockup-to-anatomy"`.

`fileKey` is the **target** working file unless the script is a read-only key lookup on Anatomy (`VT79VSlhYlpl0g2JS9vLKt`).

Rules: `return` IDs; no `figma.notify`; no async IIFE; `await figma.setCurrentPageAsync` at most once; load fonts before text; `insertChild` before `FILL`; ≤10 logical ops per call.

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

## Import + linked instance (target file)

```js
const page = await figma.getNodeByIdAsync("PAGE_ID");
await figma.setCurrentPageAsync(page);

const parent = await figma.getNodeByIdAsync("RESTYLE_FRAME_ID");
if (!parent || !("appendChild" in parent)) return { error: "missing parent" };

const set = await figma.importComponentSetByKeyAsync("PUBLISHED_SET_KEY");
const variant =
  set.children.find(
    (c) =>
      c.type === "COMPONENT" &&
      c.name.includes("Size=medium") &&
      c.name.includes("Type=primary"),
  ) || set.defaultVariant;

const inst = variant.createInstance();
parent.appendChild(inst);
if (parent.layoutMode !== "NONE") {
  inst.layoutSizingHorizontal = "FILL";
}

const owner = variant.parent?.type === "COMPONENT_SET" ? variant.parent : variant;
const defs = owner.componentPropertyDefinitions;
const labelKey = Object.keys(defs).find((k) => defs[k].type === "TEXT");
if (labelKey) {
  const fonts = inst
    .findAllWithCriteria({ types: ["TEXT"] })
    .map((t) => t.fontName)
    .filter((f) => f !== figma.mixed);
  const unique = [...new Map(fonts.map((f) => [JSON.stringify(f), f])).values()];
  await Promise.all(unique.map((f) => figma.loadFontAsync(f)));
  inst.setProperties({ [labelKey]: "Continue" });
}

if (inst.type !== "INSTANCE" || !inst.mainComponent) {
  return { error: "instance not linked", id: inst.id };
}

return {
  createdNodeIds: [inst.id],
  mutatedNodeIds: [parent.id],
  mainComponentKey: inst.mainComponent.key,
  variantName: inst.mainComponent.name,
};
```

Match **actual** variant strings from the set (`defaultVariant.name` first). Do not assume `Size=` vs `size=`. Property keys include a `#uid` suffix; read them from the **set**.

## New restyle frame (same page, do not delete source)

```js
const page = await figma.getNodeByIdAsync("PAGE_ID");
await figma.setCurrentPageAsync(page);
const source = await figma.getNodeByIdAsync("SOURCE_FRAME_ID");
if (!source || !("x" in source)) return { error: "missing source" };

const frame = figma.createFrame();
page.appendChild(frame);
frame.name = `${source.name} · Anatomy`;
frame.x = source.x + source.width + 80;
frame.y = source.y;
frame.resize(375, Math.max(source.height, 812));
frame.layoutMode = "VERTICAL";
frame.primaryAxisAlignItems = "MIN";
frame.counterAxisAlignItems = "MIN";
frame.itemSpacing = 16;
frame.paddingTop = 16;
frame.paddingRight = 16;
frame.paddingBottom = 16;
frame.paddingLeft = 16;
frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];

return { createdNodeIds: [frame.id], mutatedNodeIds: [page.id] };
```

Prefer binding a surface variable for `fills` when Anatomy color variables are already in the file (`figma.variables.getVariableByIdAsync` / bound fills). Do not invent hex.

## Detach last resort + linked palette copy

Create **two** instances. Detach only the restyle copy.

```js
const page = await figma.getNodeByIdAsync("PAGE_ID");
await figma.setCurrentPageAsync(page);
const restyle = await figma.getNodeByIdAsync("RESTYLE_FRAME_ID");
const section = await figma.getNodeByIdAsync("COMPONENTS_TO_USE_SECTION_ID");
if (!restyle || !section) return { error: "missing parent" };

const set = await figma.importComponentSetByKeyAsync("PUBLISHED_SET_KEY");
const variant =
  set.children.find((c) => c.type === "COMPONENT" && c.name.includes("VARIANT_NEEDLE")) ||
  set.defaultVariant;

const linked = variant.createInstance();
section.appendChild(linked);

const toDetach = variant.createInstance();
restyle.appendChild(toDetach);
const detached = toDetach.detachInstance();

return {
  createdNodeIds: [linked.id, detached.id],
  mutatedNodeIds: [restyle.id, section.id],
  linkedStillInstance: linked.type === "INSTANCE",
  detachedType: detached.type,
};
```

## Section named `Components to use`

Reuse if a section with this exact name already exists on the page.

```js
const page = await figma.getNodeByIdAsync("PAGE_ID");
await figma.setCurrentPageAsync(page);
const restyle = await figma.getNodeByIdAsync("RESTYLE_FRAME_ID");

const existing = page.findChild((n) => n.type === "SECTION" && n.name === "Components to use");
if (existing) return { createdNodeIds: [], mutatedNodeIds: [], sectionId: existing.id };

const section = figma.createSection();
page.appendChild(section);
section.name = "Components to use";
if (restyle && "x" in restyle) {
  section.x = restyle.x + restyle.width + 80;
  section.y = restyle.y;
}
section.resizeWithoutConstraints(480, 320);

return { createdNodeIds: [section.id], mutatedNodeIds: [page.id], sectionId: section.id };
```

`$fig.section({ name: "Components to use" })` is valid if the rest of the call is `$fig`-only; still set the name to this exact string.

## Assert restyle instances stayed linked

```js
const frame = await figma.getNodeByIdAsync("RESTYLE_FRAME_ID");
const instances = frame.findAllWithCriteria({ types: ["INSTANCE"] });
return {
  instances: instances.map((i) => ({
    id: i.id,
    name: i.name,
    key: i.mainComponent?.key ?? null,
    variant: i.mainComponent?.name ?? null,
  })),
};
```
