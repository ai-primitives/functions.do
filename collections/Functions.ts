import type { CollectionConfig } from 'payload'

export const Functions: CollectionConfig = {
  slug: 'functions',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { type: 'row', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'model', type: 'relationship', relationTo: 'models' },
      { name: 'output', type: 'select', required: true, options: ['Object', 'Text'], defaultValue: 'Object' },
      { name: 'schema', type: 'relationship', relationTo: 'schemas', admin: { condition: (data) => data.output === 'Object' } },
    ]},
    { 
      name: 'project', 
      type: 'relationship', 
      relationTo: 'projects',
      required: true,
    },
    // Using a join field for function calls
    {
      name: 'functionCalls',
      type: 'join',
      collection: 'functionCalls',
      on: 'function',
      admin: {
        description: 'Calls made to this function',
      },
    },
    { name: 'system', type: 'code', admin: { language: 'mdx', editorOptions: { padding: { top: 20, bottom: 20 }} } },
    { name: 'user', type: 'code', admin: { language: 'mdx' } },
  ],
}
