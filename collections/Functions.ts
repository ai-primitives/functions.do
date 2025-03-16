import type { CollectionConfig } from 'payload'

export const Functions: CollectionConfig = {
  slug: 'functions',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'deployment', type: 'select', options: ['dev', 'test', 'prod'] },
        { name: 'active', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
    },
    {
      name: 'modelGroup',
      type: 'relationship',
      relationTo: 'modelGroups',
    },
    {
      name: 'output',
      type: 'select',
      required: true,
      options: ['Object', 'Text'],
      defaultValue: 'Object'
    },
    {
      name: 'schema',
      type: 'relationship',
      relationTo: 'schemas',
      admin: { condition: (data) => data.output === 'Object' }
    },
    {
      name: 'code',
      type: 'group',
      fields: [
        { name: 'system', type: 'code', admin: { language: 'mdx', editorOptions: { padding: { top: 20, bottom: 20 } } } },
        { name: 'user', type: 'code', admin: { language: 'mdx' } },
        { name: 'types', type: 'code', admin: { language: 'typescript' } },
        { name: 'validation', type: 'code', admin: { language: 'typescript' } },
        { name: 'deployment', type: 'code', admin: { language: 'typescript' } },
      ],
    },
    {
      name: 'workflows',
      type: 'relationship',
      relationTo: 'workflows',
      hasMany: true,
    },
    {
      name: 'functionCalls',
      type: 'join',
      collection: 'functionCalls',
      on: 'function',
      admin: {
        description: 'Calls made to this function',
      },
    },
    {
      name: 'evals',
      type: 'relationship',
      relationTo: 'evals',
      hasMany: true,
    },
    {
      name: 'prompts',
      type: 'relationship',
      relationTo: 'prompts',
      hasMany: true,
    },
  ],
}
