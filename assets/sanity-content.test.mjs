// assets/sanity-content.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderAnnouncementHTML } from './sanity-content.js';

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
