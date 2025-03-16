import type { CollectionConfig } from 'payload'

export const Data: CollectionConfig = {
  slug: 'data',
  admin: {
    group: 'Data',
    useAsTitle: 'id',
  },
  versions: true,
  fields: [
    {
      name: 'dataset',
      type: 'relationship',
      relationTo: 'datasets',
    },
    { name: 'content', type: 'richText' },
    { name: 'format', type: 'select', options: ['text', 'json', 'blob'] },
    { name: 'createdAt', type: 'date' },
    { name: 'updatedAt', type: 'date' },
    { name: 'extractedFrom', type: 'text' },
    { name: 'embeddingType', type: 'text' },
    { name: 'embeddingDim', type: 'number' },
    { name: 'data', type: 'json' },
    { name: 'blob', type: 'text' },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
    { name: 'metadata', type: 'json' },
    {
      name: 'functionCalls',
      type: 'relationship',
      relationTo: 'functionCalls',
      hasMany: true,
    },
  ],
}
