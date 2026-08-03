
export function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function resolveLocalized(doc, fieldBase, lang) {
  if (lang === 'tr') return doc[`${fieldBase}Tr`] ?? '';
  const enValue = doc[`${fieldBase}En`];
  return enValue && enValue.trim() !== '' ? enValue : (doc[`${fieldBase}Tr`] ?? '');
}

export function resolveDateLabel(doc, lang) {
  if (lang === 'tr') return doc.dateLabel ?? '';
  return doc.dateLabelEn && doc.dateLabelEn.trim() !== '' ? doc.dateLabelEn : (doc.dateLabel ?? '');
}

export function truncateTeaser(text, maxLen) {
  if (!text || text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  const trimmed = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim();
  return `${trimmed}…`;
}

function renderSpan(span, markDefsByKey) {
  let html = escapeHtml(span.text ?? '');
  const marks = span.marks || [];
  if (marks.includes('strong')) html = `<strong>${html}</strong>`;
  if (marks.includes('em')) html = `<em>${html}</em>`;
  const linkKey = marks.find((m) => markDefsByKey[m] && markDefsByKey[m]._type === 'link');
  if (linkKey) {
    const href = markDefsByKey[linkKey].href || '';
    html = `<a href="${escapeHtml(href)}" target="_blank" rel="noopener">${html}</a>`;
  }
  return html;
}

// Body fields are Portable Text (rich text with bold/italic/link support).
// Renders each 'block' as a <p>, resolving link annotations against the
// block's own markDefs. Silently skips anything that isn't a plain
// paragraph block (this schema only allows normal-style text blocks, but
// old or malformed data shouldn't crash rendering).
export function renderPortableText(blocks) {
  return (blocks || [])
    .filter((block) => block && block._type === 'block' && Array.isArray(block.children))
    .map((block) => {
      const markDefsByKey = Object.fromEntries((block.markDefs || []).map((def) => [def._key, def]));
      const inner = block.children.map((span) => renderSpan(span, markDefsByKey)).join('');
      return `<p>${inner}</p>`;
    })
    .join('\n');
}

// Plain-text extraction for contexts that need a short string, not HTML
// (e.g. the homepage carousel's teaser fallback, which truncates to a
// character count). Concatenates span text, dropping all marks/links.
export function blockToPlainText(block) {
  if (!block || block._type !== 'block' || !Array.isArray(block.children)) return '';
  return block.children.map((span) => span.text ?? '').join('');
}

export function buildCoverUrl(rawUrl, width) {
  return `${rawUrl}?w=${width}&auto=format`;
}

export function buildQuery(type, { limit } = {}) {
  const range = limit ? `[0..${limit - 1}]` : '';
  return `*[_type == "${type}" && !(_id in path("drafts.**"))] | order(coalesce(order, -1) desc, publishedAt desc)${range}{
    _id, slug, titleTr, titleEn, dateLabel, dateLabelEn, publishedAt, order,
    "coverUrl": coverImage.asset->url, coverImageAltTr, coverImageAltEn,
    bodyTr, bodyEn, teaserTr, teaserEn, linkUrl, linkLabelTr, linkLabelEn, pdfUrl, hideFromCarousel
  }`;
}
