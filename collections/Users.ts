import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Admin',
    useAsTitle: 'email',
  },
  auth: { tokenExpiration: 60 * 60 * 24 * 30, useAPIKey: true },
  fields: [
    // Email added by default
    { name: 'name', type: 'text' },
    { 
      name: 'role', 
      type: 'select', 
      required: true, 
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
      defaultValue: 'viewer',
    },
    // Using array fields for many-to-many relationships with projects
    {
      name: 'projects',
      type: 'array',
      fields: [
        {
          name: 'project',
          type: 'relationship',
          relationTo: 'projects',
          required: true,
        },
      ],
      admin: {
        description: 'Projects this user has access to',
      },
    },
  ],
}
