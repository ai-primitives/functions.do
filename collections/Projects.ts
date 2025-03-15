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
    // Using array fields for many-to-many relationships with users
    {
      name: 'users',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
      ],
      admin: {
        description: 'Users with access to this project',
      },
    },
    // Using join fields for one-to-many relationships
    {
      name: 'modelGroups',
      type: 'join',
      collection: 'modelGroups',
      on: 'project',
      admin: {
        description: 'Model groups in this project',
      },
    },
    {
      name: 'datasets',
      type: 'join',
      collection: 'datasets',
      on: 'project',
      admin: {
        description: 'Datasets in this project',
      },
    },
    {
      name: 'functions',
      type: 'join',
      collection: 'functions',
      on: 'project',
      admin: {
        description: 'Functions in this project',
      },
    },
    {
      name: 'workflows',
      type: 'join',
      collection: 'workflows',
      on: 'project',
      admin: {
        description: 'Workflows in this project',
      },
    },
    {
      name: 'prompts',
      type: 'join',
      collection: 'prompts',
      on: 'project',
      admin: {
        description: 'Prompts in this project',
      },
    },
  ],
}
