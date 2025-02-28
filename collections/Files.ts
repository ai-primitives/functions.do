import type { CollectionConfig } from 'payload'

export const Files: CollectionConfig = {
  slug: 'files',
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
