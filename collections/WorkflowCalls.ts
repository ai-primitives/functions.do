import type { CollectionConfig } from 'payload'

export const WorkflowCalls: CollectionConfig = {
  slug: 'workflowCalls',
  admin: {
    group: 'AI',
    useAsTitle: 'id',
  },
  versions: true,
  fields: [
    {
      name: 'workflow',
      type: 'relationship',
      relationTo: 'workflows',
      required: true,
    },
    { name: 'input', type: 'json', required: true },
    { name: 'output', type: 'json' },
    { name: 'timestamp', type: 'date', required: true },
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
    { name: 'duration', type: 'number' },
    { name: 'success', type: 'checkbox' }, 
    { name: 'logs', type: 'json' },
    { name: 'metadata', type: 'json' },
    {
      name: 'functionCalls',
      type: 'relationship',
      relationTo: 'functionCalls',
      hasMany: true,
    },
    {
      name: 'steps',
      type: 'array',
      fields: [
        { name: 'stepId', type: 'text', required: true },
        { name: 'stepName', type: 'text', required: true },
        { name: 'stepOrder', type: 'number' },
        {
          name: 'status',
          type: 'select',
          required: true,
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Running', value: 'running' },
            { label: 'Completed', value: 'completed' },
            { label: 'Failed', value: 'failed' },
            { label: 'Skipped', value: 'skipped' },
          ],
        },
        { name: 'input', type: 'json' },
        { name: 'output', type: 'json' },
        { name: 'error', type: 'text' },
        { name: 'startTime', type: 'date' },
        { name: 'endTime', type: 'date' },
      ],
    },
  ],
}
