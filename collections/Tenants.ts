import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  // access: {
  //   read: () => true,
  // },
  fields: [
    { name: 'name', type: 'text', required: true },
  ],
}
