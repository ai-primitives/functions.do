import type { CollectionConfig } from 'payload'

export const EvalRuns: CollectionConfig = {
  slug: 'evalRuns',
  admin: {
    group: 'Evaluation',
    useAsTitle: 'id',
  },
  versions: true,
  fields: [
    {
      name: 'eval',
      type: 'relationship',
      relationTo: 'evals',
      required: true,
    },
    {
      name: 'model',
      type: 'relationship',
      relationTo: 'models',
    },
    {
      name: 'function',
      type: 'relationship',
      relationTo: 'functions',
    },
    {
      name: 'dataset',
      type: 'relationship',
      relationTo: 'datasets',
    },
    {
      name: 'results',
      type: 'join',
      collection: 'evalResults',
      on: 'evalRun',
    },
    { name: 'startTime', type: 'date', required: true },
    { name: 'endTime', type: 'date' },
    { name: 'metrics', type: 'json' },
    { name: 'summary', type: 'richText' },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Running', value: 'running' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'pending',
    },
    { name: 'error', type: 'text' },
  ],
}
