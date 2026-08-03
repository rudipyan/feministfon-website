// scripts/migrate-body-to-portable-text.mjs — one-off migration. Converts
// existing bodyTr/bodyEn arrays of plain strings (the pre-rich-text shape)
// into Portable Text block arrays, so the new block-type schema fields can
// render/edit them. Idempotent: any array item that's already a block
// (an object with _type: 'block') is left untouched, so running this
// against already-migrated or mixed-state documents is safe.
// Requires SANITY_PROJECT_ID, SANITY_DATASET, SANITY_WRITE_TOKEN env vars.
const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_WRITE_TOKEN } = process.env;
if (!SANITY_PROJECT_ID || !SANITY_WRITE_TOKEN) {
  console.error('Set SANITY_PROJECT_ID, SANITY_DATASET, SANITY_WRITE_TOKEN first.');
  process.exit(1);
}

const dataset = SANITY_DATASET || 'production';

function randomKey() {
  return Math.random().toString(36).slice(2, 12);
}

function toBlock(text) {
  return {
    _type: 'block',
    _key: randomKey(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: randomKey(), text, marks: [] }],
  };
}

function needsMigration(arr) {
  return Array.isArray(arr) && arr.some((item) => typeof item === 'string');
}

function migrateArray(arr) {
  return arr.map((item) => (typeof item === 'string' ? toBlock(item) : item));
}

async function fetchDocs() {
  const query = `*[_type in ["announcement", "publication"]]{_id, bodyTr, bodyEn}`;
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${SANITY_WRITE_TOKEN}` } });
  if (!res.ok) throw new Error(`Query failed: ${res.status} ${await res.text()}`);
  const { result } = await res.json();
  return result;
}

async function patchDoc(id, patch) {
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SANITY_WRITE_TOKEN}` },
    body: JSON.stringify({ mutations: [{ patch: { id, set: patch } }] }),
  });
  if (!res.ok) throw new Error(`Patch failed for ${id}: ${res.status} ${await res.text()}`);
}

const docs = await fetchDocs();
let migrated = 0;
for (const doc of docs) {
  const patch = {};
  if (needsMigration(doc.bodyTr)) patch.bodyTr = migrateArray(doc.bodyTr);
  if (needsMigration(doc.bodyEn)) patch.bodyEn = migrateArray(doc.bodyEn);
  if (Object.keys(patch).length === 0) {
    console.log(`Skipping ${doc._id} — already migrated or empty.`);
    continue;
  }
  await patchDoc(doc._id, patch);
  console.log(`Migrated ${doc._id}.`);
  migrated += 1;
}
console.log(`Done. Migrated ${migrated}/${docs.length} documents.`);
