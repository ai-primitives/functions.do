import type { CollectionConfig } from 'payload'

export const Data: CollectionConfig = {
  slug: 'data',
  admin: {
    group: 'Data',
    useAsTitle: 'id',
  },
  versions: true,
  fields: [
    { name: 'content', type: 'richText', required: true },
    {
      name: 'dataset',
      type: 'relationship',
      relationTo: 'datasets',
      required: true,
    },
    // Additional metadata fields
    { name: 'metadata', type: 'json' },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
  ],
}
