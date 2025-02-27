import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  // access: {
  //   read: () => true,
  // },
  fields: [
    { name: 'id', type: 'text', required: true },
  ],
}
