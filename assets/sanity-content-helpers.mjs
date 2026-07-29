
export function resolveLocalized(doc, fieldBase, lang) {
  if (lang === 'tr') return doc[`${fieldBase}Tr`] ?? '';
  const enValue = doc[`${fieldBase}En`];
  return enValue && enValue.trim() !== '' ? enValue : (doc[`${fieldBase}Tr`] ?? '');
}

export function truncateTeaser(text, maxLen) {
  if (!text || text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  const trimmed = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim();
  return `${trimmed}…`;
}

export function buildCoverUrl(rawUrl, width) {
  return `${rawUrl}?w=${width}&auto=format`;
}

export function buildQuery(type, { limit } = {}) {
  const range = limit ? `[0..${limit - 1}]` : '';
  return `*[_type == "${type}" && !(_id in path("drafts.**"))] | order(coalesce(order, -1) desc, publishedAt desc)${range}{
    _id, slug, titleTr, titleEn, dateLabel, publishedAt, order,
    "coverUrl": coverImage.asset->url, coverImageAltTr, coverImageAltEn,
    bodyTr, bodyEn, teaserTr, teaserEn, linkUrl, linkLabelTr, linkLabelEn, pdfUrl
  }`;
}
