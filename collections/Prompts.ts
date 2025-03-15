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
    { 
      name: 'project', 
      type: 'relationship', 
      relationTo: 'projects',
      required: true,
    },
    // Using join fields for relationships
    {
      name: 'functions',
      type: 'array',
      fields: [
        {
          name: 'function',
          type: 'relationship',
          relationTo: 'functions',
          required: true,
        },
      ],
      admin: {
        description: 'Functions referenced by this prompt',
      },
    },
    // Additional references - using array fields for many-to-many relationships
    {
      name: 'models',
      type: 'array',
      fields: [
        {
          name: 'model',
          type: 'relationship',
          relationTo: 'models',
          required: true,
        },
      ],
      admin: {
        description: 'Models referenced by this prompt',
      },
    },
    {
      name: 'providers',
      type: 'array',
      fields: [
        {
          name: 'provider',
          type: 'relationship',
          relationTo: 'providers',
          required: true,
        },
      ],
      admin: {
        description: 'Providers referenced by this prompt',
      },
    },
    // Configuration
    { name: 'variables', type: 'array', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'description', type: 'text' },
      { name: 'defaultValue', type: 'text' },
    ]},
  ],
}
