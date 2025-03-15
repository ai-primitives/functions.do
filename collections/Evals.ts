import type { CollectionConfig } from 'payload'

export const Evals: CollectionConfig = {
  slug: 'evals',
  admin: {
    group: 'Evaluation',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'dataset',
      type: 'relationship',
      relationTo: 'datasets',
      required: true,
    },
    {
      name: 'evalRuns',
      type: 'relationship',
      relationTo: 'evalRuns',
      hasMany: true,
    },
    // Additional configuration fields
    { name: 'description', type: 'richText' },
    { name: 'config', type: 'json' },
  ],
}
