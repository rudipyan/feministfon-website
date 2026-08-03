import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveLocalized, resolveDateLabel, truncateTeaser, buildCoverUrl, buildQuery, renderPortableText, blockToPlainText } from './sanity-content-helpers.mjs';

function block(children, markDefs = []) {
  return { _type: 'block', style: 'normal', children, markDefs };
}

function span(text, marks = []) {
  return { _type: 'span', text, marks };
}

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

test('resolveDateLabel returns dateLabelEn when present', () => {
  const doc = { dateLabel: 'Haziran 2026', dateLabelEn: 'June 2026' };
  assert.equal(resolveDateLabel(doc, 'en'), 'June 2026');
});

test('resolveDateLabel falls back to dateLabel when dateLabelEn is empty or missing', () => {
  assert.equal(resolveDateLabel({ dateLabel: 'Haziran 2026', dateLabelEn: '' }, 'en'), 'Haziran 2026');
  assert.equal(resolveDateLabel({ dateLabel: 'Haziran 2026' }, 'en'), 'Haziran 2026');
});

test('resolveDateLabel returns dateLabel directly when lang is tr', () => {
  const doc = { dateLabel: 'Haziran 2026', dateLabelEn: 'June 2026' };
  assert.equal(resolveDateLabel(doc, 'tr'), 'Haziran 2026');
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

test('renderPortableText renders a plain paragraph', () => {
  const html = renderPortableText([block([span('Merhaba dünya.')])]);
  assert.equal(html, '<p>Merhaba dünya.</p>');
});

test('renderPortableText applies bold and italic decorators', () => {
  const html = renderPortableText([block([span('kalın', ['strong']), span(' ve '), span('eğik', ['em'])])]);
  assert.equal(html, '<p><strong>kalın</strong> ve <em>eğik</em></p>');
});

test('renderPortableText resolves a link annotation via markDefs', () => {
  const html = renderPortableText([
    block(
      [span('rapora buradan '), span('ulaşabilirsiniz', ['link']), span('.')],
      [{ _key: 'link', _type: 'link', href: 'https://example.org/report.pdf' }],
    ),
  ]);
  assert.equal(html, '<p>rapora buradan <a href="https://example.org/report.pdf" target="_blank" rel="noopener">ulaşabilirsiniz</a>.</p>');
});

test('renderPortableText escapes span text and link href against injection', () => {
  const html = renderPortableText([
    block(
      [span('click', ['link'])],
      [{ _key: 'link', _type: 'link', href: 'javascript:alert(1)"onclick="x' }],
    ),
    block([span('<script>alert(1)</script>')]),
  ]);
  assert.match(html, /href="javascript:alert\(1\)&quot;onclick=&quot;x"/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>/);
});

test('renderPortableText joins multiple paragraph blocks and ignores non-block/malformed entries', () => {
  const html = renderPortableText([block([span('Birinci.')]), null, { _type: 'image' }, block([span('İkinci.')])]);
  assert.equal(html, '<p>Birinci.</p>\n<p>İkinci.</p>');
});

test('renderPortableText returns empty string for empty or missing input', () => {
  assert.equal(renderPortableText([]), '');
  assert.equal(renderPortableText(undefined), '');
});

test('blockToPlainText concatenates span text and drops marks', () => {
  const b = block([span('kalın', ['strong']), span(' metin')]);
  assert.equal(blockToPlainText(b), 'kalın metin');
});

test('blockToPlainText returns empty string for missing or non-block input', () => {
  assert.equal(blockToPlainText(undefined), '');
  assert.equal(blockToPlainText({ _type: 'image' }), '');
});
