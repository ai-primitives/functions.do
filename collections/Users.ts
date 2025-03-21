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
    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'avatar', type: 'text' },
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
    {
      name: 'permissions',
      type: 'json',
    },
    // {
    //   name: 'tenants',
    //   type: 'relationship',
    //   relationTo: 'tenants',
    //   hasMany: true,
    // },
    { name: 'preferences', type: 'json' },
  ],
}
