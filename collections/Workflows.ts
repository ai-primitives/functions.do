import type { CollectionConfig } from 'payload'

export const Workflows: CollectionConfig = {
  slug: 'workflows',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    { 
      name: 'project', 
      type: 'relationship', 
      relationTo: 'projects',
      required: true,
    },
    { 
      name: 'workflowCalls', 
      type: 'relationship', 
      relationTo: 'workflowCalls', 
      hasMany: true,
    },
    // Additional configuration fields
    { name: 'description', type: 'richText' },
    { name: 'config', type: 'json' },
    { name: 'steps', type: 'array', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'type', type: 'select', required: true, options: [
        { label: 'Function', value: 'function' },
        { label: 'Condition', value: 'condition' },
        { label: 'Loop', value: 'loop' },
      ]},
      { 
        name: 'function', 
        type: 'relationship', 
        relationTo: 'functions',
        admin: { condition: (data, siblingData) => siblingData.type === 'function' },
      },
      { name: 'condition', type: 'code', admin: { 
        language: 'javascript', 
        condition: (data, siblingData) => siblingData.type === 'condition',
      }},
      { name: 'loopConfig', type: 'json', admin: { 
        condition: (data, siblingData) => siblingData.type === 'loop',
      }},
    ]},
  ],
}
