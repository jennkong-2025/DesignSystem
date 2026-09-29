#!/usr/bin/env node
/**
 * Structural diff of Anatomy (IH Design System) vs a named Figma version.
 *
 * Usage:
 *   node diff-anatomy-versions.mjs
 *   node diff-anatomy-versions.mjs --from VERSION_ID
 *   FIGMA_ACCESS_TOKEN=… node diff-anatomy-versions.mjs
 *
 * Token: FIGMA_ACCESS_TOKEN or FIGMA_TOKEN (env or repo .env.local).
 * Needs file_content:read and file_versions:read.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const FILE_KEY = "VT79VSlhYlpl0g2JS9vLKt";
const API = "https://api.figma.com/v1";
const MAX_LIST = 40;

function loadDotEnv() {
  for (const name of [".env.local", ".env"]) {
    const path = resolve(process.cwd(), name);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const match = trimmed.match(/^(?:export\s+)?([A-Z0-9_]+)=(.*)$/);
      if (!match) continue;
      const value = match[2].trim().replace(/^['"]|['"]$/g, "");
      if (!process.env[match[1]]) process.env[match[1]] = value;
    }
  }
}

function parseArgs(argv) {
  const out = { from: null, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") out.help = true;
    else if (arg === "--from") out.from = argv[++i];
    else if (arg.startsWith("--from=")) out.from = arg.slice("--from=".length);
  }
  return out;
}

function token() {
  return process.env.FIGMA_ACCESS_TOKEN || process.env.FIGMA_TOKEN || "";
}

async function figma(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { "X-Figma-Token": token() },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body.err || body.message || res.statusText;
    const err = new Error(`Figma ${res.status} ${path}: ${msg}`);
    err.status = res.status;
    throw err;
  }
  return body;
}

async function listVersions() {
  const versions = [];
  let path = `/files/${FILE_KEY}/versions?page_size=50`;
  while (path && versions.length < 100) {
    const page = await figma(path);
    versions.push(...(page.versions || []));
    const next = page.pagination?.next_page;
    if (!next) break;
    path = next.replace(/^https:\/\/api\.figma\.com\/v1/, "");
  }
  return versions;
}

function labeled(versions) {
  return versions.filter((v) => v.label && String(v.label).trim());
}

function indexTree(file) {
  const pages = [];
  const byId = new Map();
  for (const page of file.document?.children || []) {
    const frames = (page.children || []).map((child) => ({
      id: child.id,
      name: child.name,
      type: child.type,
    }));
    const entry = { id: page.id, name: page.name, frames };
    pages.push(entry);
    byId.set(page.id, entry);
  }
  return { pages, byId, version: file.version, lastModified: file.lastModified };
}

function mapMeta(map = {}) {
  return Object.entries(map).map(([id, meta]) => ({
    id,
    name: meta.name || "",
    setId: meta.componentSetId || null,
  }));
}

function diffLists(before, after, key = "id") {
  const beforeMap = new Map(before.map((item) => [item[key], item]));
  const afterMap = new Map(after.map((item) => [item[key], item]));
  const added = [];
  const removed = [];
  const renamed = [];
  for (const item of after) {
    const prev = beforeMap.get(item[key]);
    if (!prev) added.push(item);
    else if (prev.name !== item.name) renamed.push({ from: prev.name, to: item.name, id: item.id });
  }
  for (const item of before) {
    if (!afterMap.has(item[key])) removed.push(item);
  }
  return { added, removed, renamed };
}

function clip(list) {
  if (list.length <= MAX_LIST) return list;
  return [...list.slice(0, MAX_LIST), { name: `… +${list.length - MAX_LIST} more` }];
}

function names(list) {
  return clip(list).map((item) => item.name || item.to || item.id);
}

function uniqueSorted(list) {
  return [...new Set(list.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function isNoiseName(name) {
  if (!name) return true;
  return /screenshot|ellipse \d+|frame \d+|^[?\d]+$|^text$/i.test(name.trim());
}

function isVariantName(name) {
  return /=/.test(name || "");
}

function bucketChangelog(baselineFile, currentFile, pages) {
  const beforeSets = new Map(mapMeta(baselineFile.componentSets).map((s) => [s.id, s]));
  const afterSets = new Map(mapMeta(currentFile.componentSets).map((s) => [s.id, s]));
  const afterComps = mapMeta(currentFile.components);
  const setDiff = diffLists(
    mapMeta(baselineFile.componentSets),
    mapMeta(currentFile.componentSets),
  );
  const compDiff = diffLists(mapMeta(baselineFile.components), mapMeta(currentFile.components));
  const afterCompById = new Map(afterComps.map((c) => [c.id, c]));

  const added = [];
  const improved = new Set();
  const cleanedUp = [];

  for (const set of setDiff.added) {
    if (!isNoiseName(set.name)) added.push(set.name);
  }
  for (const comp of compDiff.added) {
    if (isNoiseName(comp.name) || isVariantName(comp.name)) continue;
    if (!comp.setId) added.push(comp.name);
  }

  for (const set of setDiff.removed) {
    if (!isNoiseName(set.name)) cleanedUp.push(set.name);
  }
  for (const comp of compDiff.removed) {
    if (isNoiseName(comp.name) || isVariantName(comp.name)) continue;
    if (!comp.setId) cleanedUp.push(comp.name);
  }

  for (const rename of setDiff.renamed) {
    if (!isNoiseName(rename.to)) improved.add(rename.to);
  }
  for (const rename of compDiff.renamed) {
    const set = afterSets.get(afterCompById.get(rename.id)?.setId);
    if (set) improved.add(set.name);
    else if (!isVariantName(rename.to) && !isNoiseName(rename.to)) improved.add(rename.to);
  }

  for (const comp of compDiff.added) {
    if (!comp.setId || !beforeSets.has(comp.setId)) continue;
    const set = afterSets.get(comp.setId);
    if (set && !isNoiseName(set.name)) improved.add(set.name);
  }
  for (const comp of compDiff.removed) {
    if (!comp.setId || !afterSets.has(comp.setId)) continue;
    const set = afterSets.get(comp.setId);
    if (set && !isNoiseName(set.name)) improved.add(set.name);
  }

  for (const page of pages.removed) {
    if (!isNoiseName(page.name)) cleanedUp.push(page.name);
  }

  const addedSet = new Set(added);
  return {
    added: uniqueSorted(added),
    improved: uniqueSorted([...improved].filter((name) => !addedSet.has(name))),
    cleanedUp: uniqueSorted(cleanedUp),
  };
}

function isEmptyDiff(diff) {
  if (Array.isArray(diff.added) || Array.isArray(diff.improved) || Array.isArray(diff.cleanedUp)) {
    return (
      (diff.added?.length ?? 0) === 0 &&
      (diff.improved?.length ?? 0) === 0 &&
      (diff.cleanedUp?.length ?? 0) === 0
    );
  }
  return (
    diff.pages.added.length === 0 &&
    diff.pages.removed.length === 0 &&
    diff.pages.renamed.length === 0 &&
    diff.pageChanges.length === 0 &&
    diff.components.added.length === 0 &&
    diff.components.removed.length === 0 &&
    diff.components.renamed.length === 0 &&
    diff.componentSets.added.length === 0 &&
    diff.componentSets.removed.length === 0 &&
    diff.componentSets.renamed.length === 0
  );
}

function compare(baselineFile, currentFile, baselineMeta) {
  const before = indexTree(baselineFile);
  const after = indexTree(currentFile);
  const pages = diffLists(before.pages, after.pages);
  const pageChanges = [];
  for (const page of after.pages) {
    const prev = before.byId.get(page.id);
    if (!prev) continue;
    const frames = diffLists(prev.frames, page.frames);
    if (frames.added.length || frames.removed.length || frames.renamed.length) {
      pageChanges.push({
        page: page.name,
        pageId: page.id,
        added: names(frames.added),
        removed: names(frames.removed),
        renamed: frames.renamed.map((item) => `${item.from} → ${item.to}`),
      });
    }
  }
  const buckets = bucketChangelog(baselineFile, currentFile, pages);
  return {
    baseline: {
      id: baselineMeta.id,
      label: baselineMeta.label,
      createdAt: baselineMeta.created_at,
      user: baselineMeta.user?.handle || null,
    },
    current: {
      version: after.version,
      lastModified: after.lastModified,
    },
    added: buckets.added,
    improved: buckets.improved,
    cleanedUp: buckets.cleanedUp,
    pages: {
      added: names(pages.added),
      removed: names(pages.removed),
      renamed: pages.renamed.map((item) => `${item.from} → ${item.to}`),
    },
    pageChanges,
    components: (() => {
      const d = diffLists(mapMeta(baselineFile.components), mapMeta(currentFile.components));
      return { added: names(d.added), removed: names(d.removed), renamed: d.renamed.map((i) => `${i.from} → ${i.to}`) };
    })(),
    componentSets: (() => {
      const d = diffLists(mapMeta(baselineFile.componentSets), mapMeta(currentFile.componentSets));
      return { added: names(d.added), removed: names(d.removed), renamed: d.renamed.map((i) => `${i.from} → ${i.to}`) };
    })(),
  };
}

function pickBaseline(versions, fromId, usedFallback) {
  if (fromId) {
    const match = versions.find((v) => String(v.id) === String(fromId));
    if (!match) {
      throw new Error(`No version ${fromId} in the first ${versions.length} history entries.`);
    }
    return { baseline: match, usedFallback };
  }
  const named = labeled(versions);
  if (named.length === 0) {
    throw new Error("No named version in history. Save to version history in Figma, then retry.");
  }
  return { baseline: named[0], usedFallback };
}

async function main() {
  loadDotEnv();
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`diff-anatomy-versions.mjs [--from VERSION_ID]

Compares the live Anatomy file to the latest named Figma version (or --from).
If that diff is empty, compares to the previous named version instead.
`);
    process.exit(0);
  }
  if (!token()) {
    console.error(`Missing FIGMA_ACCESS_TOKEN.

Create a personal access token: https://www.figma.com/developers/api#access-tokens
Scopes: file_content:read, file_versions:read
Then:
  export FIGMA_ACCESS_TOKEN=figd_…
or add FIGMA_ACCESS_TOKEN to .env.local (gitignored).`);
    process.exit(2);
  }

  const versions = await listVersions();
  let { baseline, usedFallback } = pickBaseline(versions, args.from, false);
  const [baselineFile, currentFile] = await Promise.all([
    figma(`/files/${FILE_KEY}?version=${baseline.id}&depth=2`),
    figma(`/files/${FILE_KEY}?depth=2`),
  ]);
  let diff = compare(baselineFile, currentFile, baseline);

  const named = labeled(versions);
  const previousNamed = named[1];
  if (!args.from && isEmptyDiff(diff) && previousNamed) {
    const previousFile = await figma(`/files/${FILE_KEY}?version=${previousNamed.id}&depth=2`);
    diff = compare(previousFile, currentFile, previousNamed);
    usedFallback = true;
    diff.note =
      `Live file matched named save "${baseline.label}". Showing changes since previous named save "${previousNamed.label}".`;
  } else if (isEmptyDiff(diff)) {
    diff.note = `No page, frame, or component changes since named save "${baseline.label}". Nested copy-only edits are not in this diff.`;
  }

  diff.usedPreviousNamedSave = usedFallback;
  diff.recentNamedSaves = named.slice(0, 5).map((v) => ({
    id: v.id,
    label: v.label,
    createdAt: v.created_at,
  }));
  console.log(JSON.stringify(diff, null, 2));
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(err.status === 403 ? 3 : 1);
});
