import type { CollectionConfig } from 'payload'

export const Functions: CollectionConfig = {
  slug: 'functions',
  // access: {
  //   read: () => true,
  // },
  admin: {
    group: 'Functions',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { type: 'row', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'type', type: 'select', required: true, options: ['AI', 'Code'], defaultValue: 'AI' },
    ]},
    { name: 'systemPrompt', type: 'textarea', admin: { condition: (data) => data.type === 'AI' } },
    { name: 'userPrompt', type: 'textarea', admin: { condition: (data) => data.type === 'AI' } },
    { name: 'code', type: 'code', admin: { language: 'typescript', condition: (data) => data.type === 'Code', editorOptions: { padding: { top: 20, bottom: 20 } } } },
  ],
}
