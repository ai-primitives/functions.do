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
    { name: 'description', type: 'richText' },
    { name: 'type', type: 'select', options: ['accuracy', 'performance', 'robustness', 'safety', 'custom'] },
    { name: 'method', type: 'text' },
    { name: 'metric', type: 'text' },
    {
      name: 'dataset',
      type: 'relationship',
      relationTo: 'datasets',
    },
    {
      name: 'functions',
      type: 'relationship',
      relationTo: 'functions',
      hasMany: true,
    },
    {
      name: 'evalRuns',
      type: 'relationship',
      relationTo: 'evalRuns',
      hasMany: true,
    },
    { name: 'resultsTable', type: 'json' },
    { name: 'config', type: 'json' },
  ],
}
