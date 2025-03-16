import type { CollectionConfig } from 'payload'

export const Prompts: CollectionConfig = {
  slug: 'prompts',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'content', type: 'code', admin: { language: 'mdx' }, required: true },
    { name: 'description', type: 'richText' },
    { name: 'version', type: 'text' },
    { name: 'template', type: 'checkbox', defaultValue: false },
    { name: 'category', type: 'text' },
    {
      name: 'functions',
      type: 'relationship',
      relationTo: 'functions',
      hasMany: true,
    },
    {
      name: 'variables',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'defaultValue', type: 'text' },
        { name: 'required', type: 'checkbox', defaultValue: false },
        { name: 'type', type: 'select', options: ['string', 'number', 'boolean', 'object', 'array'] },
      ],
    },
    { name: 'metadata', type: 'json' },
  ],
}
