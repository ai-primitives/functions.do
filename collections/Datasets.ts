import type { CollectionConfig } from 'payload'

export const Datasets: CollectionConfig = {
  slug: 'datasets',
  admin: {
    group: 'Data',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'richText' },
    { name: 'source', type: 'text' },
    { name: 'imported', type: 'date' },
    { name: 'version', type: 'text' },
    // { name: 'collection', type: 'checkbox' },
    { name: 'format', type: 'select', options: ['text', 'json', 'csv', 'images', 'mixed'] },
    {
      name: 'data',
      type: 'join',
      collection: 'data',
      on: 'dataset',
    },
    {
      name: 'evals',
      type: 'join',
      collection: 'evals',
      on: 'dataset',
    },
    {
      name: 'metadata',
      type: 'json',
    },
  ],
}
