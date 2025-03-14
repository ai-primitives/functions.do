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
      name: 'results', 
      type: 'relationship', 
      relationTo: 'evalResults', 
      hasMany: true,
    },
    { name: 'startTime', type: 'date', required: true },
    { name: 'endTime', type: 'date' },
    // Additional status fields
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
