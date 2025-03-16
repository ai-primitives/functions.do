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
    { name: 'score', type: 'number' },
    { name: 'pass', type: 'checkbox' },
    { name: 'createdAt', type: 'date', required: true },
    { name: 'result', type: 'json' },
    { name: 'summary', type: 'richText' },
    { name: 'details', type: 'json' },
  ],
}
