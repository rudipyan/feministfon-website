// assets/sanity-content.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderAnnouncementHTML, renderPublicationHTML, buildCarouselLinkTarget, combineCarouselDocs } from './sanity-content.js';

test('renderAnnouncementHTML produces the expected structure with a link', () => {
  const doc = {
    slug: { current: 'women-deliver-2026' },
    titleTr: 'Başlık', titleEn: 'Title',
    dateLabel: '27–30 Nisan 2026',
    coverUrl: 'https://cdn.sanity.io/images/x/production/img-800x600.png',
    coverImageAltTr: 'Alt TR', coverImageAltEn: 'Alt EN',
    bodyTr: ['Paragraf bir.', 'Paragraf iki.'],
    bodyEn: ['Paragraph one.', 'Paragraph two.'],
    linkUrl: 'https://example.org/report.pdf',
    linkLabelTr: 'Raporu oku', linkLabelEn: 'Read report',
  };
  const html = renderAnnouncementHTML(doc, 'en');
  assert.match(html, /id="women-deliver-2026"/);
  assert.match(html, /<h2>Title<\/h2>/);
  assert.match(html, /Paragraph one\./);
  assert.match(html, /Paragraph two\./);
  assert.match(html, /alt="Alt EN"/);
  assert.match(html, /href="https:\/\/example\.org\/report\.pdf"/);
  assert.match(html, /Read report/);
  assert.match(html, /data-flow="duyuru1"/);
  assert.match(html, / \(opens in new tab\)/);
});

test('renderAnnouncementHTML numbers data-flow by 1-indexed render position', () => {
  const doc = {
    slug: { current: 'csw68' }, titleTr: 'Başlık', dateLabel: '2024',
    coverUrl: 'https://cdn.sanity.io/x.png', coverImageAltTr: 'Alt',
    bodyTr: ['Paragraf.'],
    linkUrl: 'https://example.org/report.pdf', linkLabelTr: 'Raporu oku',
  };
  const html = renderAnnouncementHTML(doc, 'tr', 2);
  assert.match(html, /data-flow="duyuru3"/);
  assert.match(html, / \(yeni sekmede açılır\)/);
});

test('renderAnnouncementHTML omits the link block when linkUrl is absent', () => {
  const doc = {
    slug: { current: 'edge-2025' }, titleTr: 'Başlık', dateLabel: '2025',
    coverUrl: 'https://cdn.sanity.io/x.png', coverImageAltTr: 'Alt',
    bodyTr: ['Tek paragraf.'],
  };
  const html = renderAnnouncementHTML(doc, 'tr');
  assert.doesNotMatch(html, /report-link/);
});

test('renderAnnouncementHTML handles missing teaser and empty bodyEn gracefully', () => {
  const doc = {
    slug: { current: 'test-en' },
    titleTr: 'Türkçe Başlık', titleEn: 'English Title',
    dateLabel: '2026',
    coverUrl: 'https://cdn.sanity.io/x.png',
    coverImageAltTr: 'TR Alt', coverImageAltEn: 'EN Alt',
    bodyTr: ['Turkish body paragraph.'],
    bodyEn: [], // empty array — should fallback to bodyTr
  };
  const html = renderAnnouncementHTML(doc, 'en');
  assert.match(html, /<h2>English Title<\/h2>/);
  assert.match(html, /Turkish body paragraph\./);
  assert.match(html, /alt="EN Alt"/);
});

test('renderAnnouncementHTML escapes double quotes so they cannot break out of an attribute', () => {
  const doc = {
    slug: { current: 'quote-test' },
    titleTr: 'Başlık', titleEn: 'Title',
    dateLabel: '2026',
    coverUrl: 'https://cdn.sanity.io/x.png',
    coverImageAltTr: 'Zararlı" onerror="alert(1)', coverImageAltEn: 'Zararlı" onerror="alert(1)',
    bodyTr: ['Paragraf.'],
    linkUrl: 'https://example.org/x"onclick="alert(1)',
    linkLabelTr: 'Link',
  };
  const html = renderAnnouncementHTML(doc, 'tr');
  assert.doesNotMatch(html, /onerror="alert\(1\)"/);
  assert.doesNotMatch(html, /onclick="alert\(1\)"/);
  assert.match(html, /alt="Zararlı&quot; onerror=&quot;alert\(1\)"/);
  assert.match(html, /href="https:\/\/example\.org\/x&quot;onclick=&quot;alert\(1\)"/);
});

test('renderPublicationHTML (en, embedded) renders id, body paragraphs, and EN strings', () => {
  const doc = {
    slug: { current: 'ffi-fizibilite-raporu' },
    titleTr: 'Türkçe Başlık', titleEn: 'A Feminist Fund',
    dateLabel: 'June 2026',
    coverUrl: 'https://cdn.sanity.io/x.png',
    coverImageAltTr: 'TR Alt', coverImageAltEn: 'EN Alt',
    bodyTr: ['Paragraf bir.', 'Paragraf iki.'],
    bodyEn: ['Paragraph one.', 'Paragraph two.'],
    pdfUrl: 'https://example.org/report.pdf',
  };
  const html = renderPublicationHTML(doc, 'en', { embed: true });
  assert.match(html, /id="ffi-fizibilite-raporu"/);
  assert.match(html, /Paragraph one\./);
  assert.match(html, /Paragraph two\./);
  assert.match(html, />Read the Report</);
  assert.match(html, / \(opens in new tab\)/);
  assert.match(html, /report, readable inline/);
  assert.match(html, /Your browser can't display this PDF inline/);
});

test('renderPublicationHTML (tr, embedded) renders TR strings and falls back to bodyTr', () => {
  const doc = {
    slug: { current: 'ffi-fizibilite-raporu' },
    titleTr: 'Türkçe Başlık',
    dateLabel: 'Haziran 2026',
    coverUrl: 'https://cdn.sanity.io/x.png',
    coverImageAltTr: 'TR Alt',
    bodyTr: ['Paragraf bir.', 'Paragraf iki.'],
    pdfUrl: 'https://example.org/report.pdf',
  };
  const html = renderPublicationHTML(doc, 'tr', { embed: true });
  assert.match(html, /Paragraf bir\./);
  assert.match(html, /Paragraf iki\./);
  assert.match(html, />Raporu Okuyun</);
  assert.match(html, / \(yeni sekmede açılır\)/);
  assert.match(html, /raporu, sayfa içinde okunabilir/);
  assert.match(html, /Tarayıcınız PDF'i bu sayfada görüntüleyemiyor/);
});

test('buildCarouselLinkTarget routes announcements to duyurular pages by kind, not field presence', () => {
  const announcement = { _kind: 'announcement', pdfUrl: null };
  assert.equal(buildCarouselLinkTarget(announcement, 'tr'), 'duyurular.html');
  assert.equal(buildCarouselLinkTarget(announcement, 'en'), 'en-duyurular.html');
});

test('buildCarouselLinkTarget routes publications to yayinlar pages', () => {
  const publication = { _kind: 'publication', pdfUrl: 'https://example.org/report.pdf' };
  assert.equal(buildCarouselLinkTarget(publication, 'tr'), 'yayinlar.html');
  assert.equal(buildCarouselLinkTarget(publication, 'en'), 'en-yayinlar.html');
});

test('combineCarouselDocs excludes announcements flagged hideFromCarousel', () => {
  const announcements = [
    { _id: 'a1', hideFromCarousel: true, publishedAt: '2026-06-01T00:00:00.000Z' },
    { _id: 'a2', hideFromCarousel: false, publishedAt: '2026-04-27T00:00:00.000Z' },
  ];
  const publications = [
    { _id: 'p1', publishedAt: '2026-06-01T00:00:00.000Z' },
  ];
  const combined = combineCarouselDocs(announcements, publications);
  assert.equal(combined.length, 2);
  assert.ok(!combined.some((d) => d._id === 'a1'));
  assert.ok(combined.some((d) => d._id === 'a2' && d._kind === 'announcement'));
  assert.ok(combined.some((d) => d._id === 'p1' && d._kind === 'publication'));
});

test('combineCarouselDocs sorts by order then publishedAt and caps at 6', () => {
  const announcements = Array.from({ length: 5 }, (_, i) => ({
    _id: `a${i}`,
    publishedAt: new Date(2026, 0, i + 1).toISOString(),
  }));
  const publications = Array.from({ length: 3 }, (_, i) => ({
    _id: `p${i}`,
    publishedAt: new Date(2025, 0, i + 1).toISOString(),
  }));
  const combined = combineCarouselDocs(announcements, publications);
  assert.equal(combined.length, 6);
  assert.equal(combined[0]._id, 'a4');
});
