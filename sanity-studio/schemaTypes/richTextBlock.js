// Shared rich-text paragraph block for body fields. Deliberately minimal --
// bold/italic decorators and a link annotation only. No headings/lists,
// since the site's CSS only styles plain <p> paragraphs.
const richTextBlock = {
  type: 'block',
  styles: [{ title: 'Normal', value: 'normal' }],
  lists: [],
  marks: {
    decorators: [
      { title: 'Bold', value: 'strong' },
      { title: 'Italic', value: 'em' },
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          { name: 'href', title: 'URL', type: 'url', validation: (Rule) => Rule.required() },
        ],
      },
    ],
  },
};

export default richTextBlock;
