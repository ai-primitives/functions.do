import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    group: 'Organization',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'richText' },
    { 
      name: 'status', 
      type: 'select', 
      required: true, 
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
    },
    // Relationships
    { 
      name: 'users', 
      type: 'relationship', 
      relationTo: 'users', 
      hasMany: true,
    },
    { 
      name: 'modelGroups', 
      type: 'relationship', 
      relationTo: 'modelGroups', 
      hasMany: true,
    },
    { 
      name: 'datasets', 
      type: 'relationship', 
      relationTo: 'datasets', 
      hasMany: true,
    },
    { 
      name: 'functions', 
      type: 'relationship', 
      relationTo: 'functions', 
      hasMany: true,
    },
    { 
      name: 'workflows', 
      type: 'relationship', 
      relationTo: 'workflows', 
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
