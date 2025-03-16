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
    { name: 'description', type: 'richText' },
    { name: 'deployed', type: 'checkbox', defaultValue: false },
    { name: 'active', type: 'checkbox', defaultValue: true },
    {
      name: 'functions',
      type: 'relationship',
      relationTo: 'functions',
      hasMany: true,
    },
    {
      name: 'workflowRuns',
      type: 'join',
      collection: 'workflowCalls',
      on: 'workflow',
      admin: {
        description: 'Runs of this workflow',
      },
    },
    { name: 'config', type: 'json' },
    {
      name: 'steps',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'order', type: 'number' },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Function', value: 'function' },
            { label: 'Condition', value: 'condition' },
            { label: 'Loop', value: 'loop' },
            { label: 'Input', value: 'input' },
            { label: 'Output', value: 'output' },
          ],
        },
        {
          name: 'function',
          type: 'relationship',
          relationTo: 'functions',
          admin: { condition: (data, siblingData) => siblingData.type === 'function' },
        },
        {
          name: 'condition',
          type: 'code',
          admin: {
            language: 'javascript',
            condition: (data, siblingData) => siblingData.type === 'condition',
          },
        },
        {
          name: 'loopConfig',
          type: 'json',
          admin: {
            condition: (data, siblingData) => siblingData.type === 'loop',
          },
        },
        {
          name: 'inputConfig',
          type: 'json',
          admin: {
            condition: (data, siblingData) => siblingData.type === 'input',
          },
        },
        {
          name: 'outputConfig',
          type: 'json',
          admin: {
            condition: (data, siblingData) => siblingData.type === 'output',
          },
        },
      ],
    },
  ],
}
