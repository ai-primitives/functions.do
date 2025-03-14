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
    { 
      name: 'functions', 
      type: 'relationship', 
      relationTo: 'functions', 
      hasMany: true,
    },
    // Additional references
    { 
      name: 'models', 
      type: 'relationship', 
      relationTo: 'models', 
      hasMany: true,
    },
    { 
      name: 'providers', 
      type: 'relationship', 
      relationTo: 'providers', 
      hasMany: true,
    },
    // Configuration
    { name: 'variables', type: 'array', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'description', type: 'text' },
      { name: 'defaultValue', type: 'text' },
    ]},
  ],
}
