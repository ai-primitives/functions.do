import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    group: 'Admin',
  },
  // access: {
  //   read: () => true,
  // },
  fields: [
    { name: 'id', label: 'ID', type: 'text', required: true },
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'domain', label: 'Domain', type: 'text' },
  ],
}
