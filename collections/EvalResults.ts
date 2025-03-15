import type { CollectionConfig } from 'payload'

export const EvalResults: CollectionConfig = {
  slug: 'evalResults',
  admin: {
    group: 'Evaluation',
    useAsTitle: 'id',
  },
  versions: true,
  fields: [
    {
      name: 'evalRun',
      type: 'relationship',
      relationTo: 'evalRuns',
      required: true,
    },
    { name: 'metrics', type: 'json', required: true },
    // Additional result fields
    { name: 'createdAt', type: 'date', required: true },
    { name: 'summary', type: 'richText' },
  ],
}
