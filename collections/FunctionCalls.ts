import type { CollectionConfig } from 'payload'

export const FunctionCalls: CollectionConfig = {
  slug: 'functionCalls',
  admin: {
    group: 'AI',
    useAsTitle: 'id',
  },
  versions: true,
  fields: [
    {
      name: 'function',
      type: 'relationship',
      relationTo: 'functions',
      required: true,
    },
    { name: 'model', type: 'relationship', relationTo: 'models' },
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
    { name: 'cost', type: 'number' },
    { name: 'tokens', type: 'json' },
    {
      name: 'meta',
      type: 'json',
      admin: {
        description: 'Additional metadata for the function call'
      }
    },
    {
      name: 'data',
      type: 'relationship',
      relationTo: 'data',
      hasMany: true,
    },
    {
      name: 'workflow',
      type: 'relationship',
      relationTo: 'workflows',
    }
  ],
}
