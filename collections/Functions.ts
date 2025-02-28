import type { CollectionConfig } from 'payload'

export const Functions: CollectionConfig = {
  slug: 'functions',
  // access: {
  //   read: () => true,
  // },
  admin: {
    group: 'AI',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    // { type: 'row', admin: { position: 'sidebar' }, fields: [
      { name: 'name', type: 'text', required: true, admin: { position: 'sidebar' } },
      { name: 'type', type: 'select', required: true, options: ['AI', 'Code'], defaultValue: 'AI', admin: { position: 'sidebar' } },
    // ]},
    { name: 'system', type: 'textarea', admin: { condition: (data) => data.type === 'AI' } },
    { name: 'user', type: 'textarea', admin: { condition: (data) => data.type === 'AI' } },
    { name: 'code', type: 'code', admin: { language: 'typescript', condition: (data) => data.type === 'Code', editorOptions: { padding: { top: 20, bottom: 20 } } } },
  ],
}
