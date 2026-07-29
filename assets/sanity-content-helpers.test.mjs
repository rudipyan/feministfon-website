import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveLocalized, truncateTeaser, buildCoverUrl, buildQuery } from './sanity-content-helpers.mjs';

test('resolveLocalized returns the EN field when present', () => {
  const doc = { titleTr: 'Başlık', titleEn: 'Title' };
  assert.equal(resolveLocalized(doc, 'title', 'en'), 'Title');
});

test('resolveLocalized falls back to TR when EN is empty', () => {
  const doc = { titleTr: 'Başlık', titleEn: '' };
  assert.equal(resolveLocalized(doc, 'title', 'en'), 'Başlık');
});

test('resolveLocalized falls back to TR when EN is missing entirely', () => {
  const doc = { titleTr: 'Başlık' };
  assert.equal(resolveLocalized(doc, 'title', 'en'), 'Başlık');
});

test('resolveLocalized returns TR field directly when lang is tr', () => {
  const doc = { titleTr: 'Başlık', titleEn: 'Title' };
  assert.equal(resolveLocalized(doc, 'title', 'tr'), 'Başlık');
});

test('truncateTeaser returns short text unchanged', () => {
  assert.equal(truncateTeaser('Kısa metin.', 140), 'Kısa metin.');
});

test('truncateTeaser cuts long text at a word boundary near maxLen', () => {
  const long = 'Bu ' + 'kelime '.repeat(30) + 'son.';
  const result = truncateTeaser(long, 40);
  assert.ok(result.length <= 44);
  assert.ok(!result.endsWith(' '));
  assert.ok(long.startsWith(result.replace(/…$/, '').trim()));
});

test('buildCoverUrl appends width and format params', () => {
  const url = buildCoverUrl('https://cdn.sanity.io/images/abc/production/img-800x600.png', 800);
  assert.equal(url, 'https://cdn.sanity.io/images/abc/production/img-800x600.png?w=800&auto=format');
});

test('buildQuery builds a GROQ query excluding drafts, sorted by order then publishedAt', () => {
  const q = buildQuery('announcement');
  assert.match(q, /_type == "announcement"/);
  assert.match(q, /!\(_id in path\("drafts\.\*\*"\)\)/);
  assert.match(q, /order\(coalesce\(order, -1\) desc, publishedAt desc\)/);
});

test('buildQuery applies a limit when given one', () => {
  const q = buildQuery('announcement', { limit: 6 });
  assert.match(q, /\[0\.\.5\]/);
});
