import { resolveLocalized, truncateTeaser, buildCoverUrl, buildQuery } from './sanity-content-helpers.mjs';
import { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION } from './sanity-config.js';

function escapeHtml(str) {
  const div = typeof document !== 'undefined' ? document.createElement('div') : null;
  if (div) { div.textContent = str; return div.innerHTML; }
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function renderAnnouncementHTML(doc, lang) {
  const title = resolveLocalized(doc, 'title', lang);
  const alt = lang === 'tr' ? doc.coverImageAltTr : (doc.coverImageAltEn || doc.coverImageAltTr);
  const paragraphs = lang === 'tr' ? doc.bodyTr : (doc.bodyEn && doc.bodyEn.length ? doc.bodyEn : doc.bodyTr);
  const bodyHtml = (paragraphs || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('\n');
  const linkLabel = resolveLocalized(doc, 'linkLabel', lang);
  const linkHtml = doc.linkUrl
    ? `<p><a class="report-link" href="${escapeHtml(doc.linkUrl)}" target="_blank" rel="noopener">${escapeHtml(linkLabel || doc.linkUrl)}<span class="visually-hidden"> (yeni sekmede açılır)</span></a></p>`
    : '';
  return `<article class="duyuru" id="${escapeHtml(doc.slug.current)}">
    <div class="duyuru-row">
      <div class="duyuru-cover"><img src="${escapeHtml(buildCoverUrl(doc.coverUrl, 600))}" alt="${escapeHtml(alt)}"></div>
      <div class="duyuru-copy">
        <div class="duyuru-meta">${escapeHtml(doc.dateLabel)}</div>
        <h2>${escapeHtml(title)}</h2>
        ${bodyHtml}
        ${linkHtml}
      </div>
    </div>
  </article>`;
}

export function renderPublicationHTML(doc, lang, { embed } = { embed: false }) {
  const title = resolveLocalized(doc, 'title', lang);
  const alt = lang === 'tr' ? doc.coverImageAltTr : (doc.coverImageAltEn || doc.coverImageAltTr);
  const readLabel = lang === 'tr' ? 'Raporu Okuyun' : 'Read the report';
  const card = `<div class="pub-row">
    <div class="pub-cover"><img src="${escapeHtml(buildCoverUrl(doc.coverUrl, 600))}" alt="${escapeHtml(alt)}"></div>
    <div class="pub-copy">
      <h2>${escapeHtml(title)}</h2>
      <div class="pub-meta">
        <span class="pub-date">${escapeHtml(doc.dateLabel)}</span>
        <a class="btn btn-primary" href="${escapeHtml(doc.pdfUrl)}" target="_blank" rel="noopener">${readLabel}<span class="visually-hidden"> (yeni sekmede açılır)</span></a>
      </div>
    </div>
  </div>`;
  if (!embed) return card;
  return `${card}
  <div class="pub-reader">
    <object class="pub-reader__embed" data="${escapeHtml(doc.pdfUrl)}" type="application/pdf" aria-label="${escapeHtml(title)}">
      <p class="pub-reader__fallback">Tarayıcınız PDF'i bu sayfada görüntüleyemiyor. <a href="${escapeHtml(doc.pdfUrl)}" target="_blank" rel="noopener">Raporu yeni sekmede açmak için tıklayın</a>.</p>
    </object>
  </div>`;
}

async function fetchDocs(type, { limit } = {}) {
  const query = buildQuery(type, { limit });
  const url = `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status}`);
  const { result } = await res.json();
  return result;
}

function showError(container, lang) {
  container.textContent = lang === 'tr' ? 'İçerik şu anda yüklenemedi.' : "Content couldn't load right now.";
}

function scrollToHash(container) {
  const id = window.location.hash.replace('#', '');
  if (!id) return;
  const target = container.querySelector(`#${CSS.escape(id)}`);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export async function initAnnouncements(containerId) {
  const container = document.getElementById(containerId);
  const lang = document.documentElement.lang === 'tr' ? 'tr' : 'en';
  try {
    const docs = await fetchDocs('announcement');
    container.innerHTML = docs.map((doc) => renderAnnouncementHTML(doc, lang)).join('\n');
    scrollToHash(container);
  } catch (err) {
    showError(container, lang);
  }
}

export async function initPublications(containerId) {
  const container = document.getElementById(containerId);
  const lang = document.documentElement.lang === 'tr' ? 'tr' : 'en';
  try {
    const docs = await fetchDocs('publication');
    container.innerHTML = docs.map((doc, i) => renderPublicationHTML(doc, lang, { embed: i === 0 })).join('\n');
    scrollToHash(container);
  } catch (err) {
    showError(container, lang);
  }
}

export async function initCarousel(containerId, onRendered) {
  const container = document.getElementById(containerId);
  const lang = document.documentElement.lang === 'tr' ? 'tr' : 'en';
  try {
    const [announcements, publications] = await Promise.all([
      fetchDocs('announcement', { limit: 6 }),
      fetchDocs('publication', { limit: 6 }),
    ]);
    const combined = [...announcements, ...publications]
      .sort((a, b) => (b.order ?? -1) - (a.order ?? -1) || new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 6);
    container.innerHTML = combined.map((doc) => {
      const isPublication = 'pdfUrl' in doc;
      const teaser = resolveLocalized(doc, 'teaser', lang) || truncateTeaser(resolveLocalized(doc, 'body', lang) ? (lang === 'tr' ? doc.bodyTr : doc.bodyEn)?.[0] : '', 140);
      const title = resolveLocalized(doc, 'title', lang);
      const alt = lang === 'tr' ? doc.coverImageAltTr : (doc.coverImageAltEn || doc.coverImageAltTr);
      const targetPage = isPublication
        ? (lang === 'tr' ? 'yayinlar.html' : 'en-yayinlar.html')
        : (lang === 'tr' ? 'duyurular.html' : 'en-duyurular.html');
      const readmore = lang === 'tr' ? 'Devamını oku' : 'Read more';
      return `<li class="pub-slide">
        <article class="pub-row">
          <div class="pub-cover"><img src="${escapeHtml(buildCoverUrl(doc.coverUrl, 600))}" alt="${escapeHtml(alt)}"></div>
          <div class="pub-copy">
            <div class="pub-meta">${escapeHtml(doc.dateLabel)}</div>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(teaser || '')}</p>
            <a class="pub-readmore" href="${targetPage}#${escapeHtml(doc.slug.current)}">${readmore}<span aria-hidden="true"> →</span></a>
          </div>
        </article>
      </li>`;
    }).join('\n');
    if (onRendered) onRendered();
  } catch (err) {
    showError(container, lang);
  }
}
