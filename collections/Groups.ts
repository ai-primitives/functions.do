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
    { 
      name: 'users', 
      type: 'relationship', 
      relationTo: 'users', 
      hasMany: true,
    },
    { 
      name: 'models', 
      type: 'relationship', 
      relationTo: 'models', 
      hasMany: true,
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
