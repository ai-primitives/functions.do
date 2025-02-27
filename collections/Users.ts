import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: { tokenExpiration: 60 * 60 * 24 * 30 },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
