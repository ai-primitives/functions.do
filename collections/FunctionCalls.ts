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
    { name: 'input', type: 'json', required: true },
    { name: 'output', type: 'json' },
    { name: 'timestamp', type: 'date', required: true },
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
    { name: 'duration', type: 'number' }, // Duration in milliseconds
  ],
}
