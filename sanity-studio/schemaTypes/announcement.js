export default {
  name: 'announcement',
  title: 'Duyuru / Announcement',
  type: 'document',
  fields: [
    { name: 'titleTr', title: 'Title (TR)', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'titleEn', title: 'Title (EN)', type: 'string' },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'titleTr',
        slugify: (input) => transliterateTr(input).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 96),
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (Rule) => Rule.required(),
    },
    { name: 'dateLabel', title: 'Date label (free text)', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    },
    { name: 'order', title: 'Manual sort override (optional)', type: 'number' },
    {
      name: 'hideFromCarousel',
      title: 'Hide from homepage carousel',
      description: 'Check this if the announcement covers the same topic as a publication already shown in the carousel (e.g. an announcement about a report that also has its own publication entry), to avoid showing the same story twice.',
      type: 'boolean',
      initialValue: false,
    },
    { name: 'coverImage', title: 'Cover image', type: 'image', validation: (Rule) => Rule.required() },
    { name: 'coverImageAltTr', title: 'Cover image alt text (TR)', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'coverImageAltEn', title: 'Cover image alt text (EN)', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'bodyTr',
      title: 'Body paragraphs (TR)',
      type: 'array',
      of: [{ type: 'text' }],
      validation: (Rule) => Rule.required().min(1),
    },
    { name: 'bodyEn', title: 'Body paragraphs (EN)', type: 'array', of: [{ type: 'text' }] },
    { name: 'teaserTr', title: 'Homepage teaser (TR, optional)', type: 'text' },
    { name: 'teaserEn', title: 'Homepage teaser (EN, optional)', type: 'text' },
    { name: 'linkUrl', title: 'External link (optional)', type: 'url' },
    { name: 'linkLabelTr', title: 'Link label (TR)', type: 'string' },
    { name: 'linkLabelEn', title: 'Link label (EN)', type: 'string' },
  ],
  preview: {
    select: { title: 'titleTr', subtitle: 'dateLabel', media: 'coverImage' },
  },
};

function transliterateTr(input) {
  const map = { İ: 'i', I: 'i', ı: 'i', ş: 's', Ş: 's', ğ: 'g', Ğ: 'g', ç: 'c', Ç: 'c', ö: 'o', Ö: 'o', ü: 'u', Ü: 'u' };
  return input.replace(/[İIışŞğĞçÇöÖüÜ]/g, (ch) => map[ch] ?? ch);
}
