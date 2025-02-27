import type { CollectionConfig } from 'payload'

export const Functions: CollectionConfig = {
  slug: 'functions',
  // access: {
  //   read: () => true,
  // },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'type', type: 'select', required: true, options: ['AI', 'Code'] },
    { name: 'systemPrompt', type: 'textarea', admin: { condition: (data) => data.type === 'AI' } },
    { name: 'userPrompt', type: 'textarea', admin: { condition: (data) => data.type === 'AI' } },
    { name: 'code', type: 'code', admin: { condition: (data) => data.type === 'Code' } },
  ],
}
