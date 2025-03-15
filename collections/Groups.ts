import type { CollectionConfig } from 'payload'

export const Groups: CollectionConfig = {
  slug: 'groups',
  admin: {
    group: 'Organization',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    // Using array fields for many-to-many relationships
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
        description: 'Users in this group',
      },
    },
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
        description: 'Models in this group',
      },
    },
    // Additional configuration
    { name: 'description', type: 'richText' },
    { 
      name: 'type', 
      type: 'select', 
      options: [
        { label: 'User Group', value: 'userGroup' },
        { label: 'Model Group', value: 'modelGroup' },
        { label: 'Mixed Group', value: 'mixedGroup' },
      ],
      defaultValue: 'userGroup',
    },
  ],
}
