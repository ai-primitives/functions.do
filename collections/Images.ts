import type { CollectionConfig } from 'payload'

export const Images: CollectionConfig = {
  slug: 'images',
  // access: {
  //   read: () => true,
  // },
  admin: {
    group: 'Data',
  },
  fields: [
    { name: 'alt', type: 'text', required: false },
  ],
  upload: true,
}
