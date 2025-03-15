import type { CollectionConfig } from 'payload'

export const Providers: CollectionConfig = {
  slug: 'providers',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    // Using join field for models relationship
    {
      name: 'models',
      type: 'join',
      collection: 'models',
      on: 'provider',
      admin: {
        description: 'Models using this provider',
      },
    },
    // Additional fields for provider configuration
    { name: 'endpoint', type: 'text' },
    { name: 'apiKey', type: 'text', admin: { condition: () => false } }, // Hidden in admin UI for security
    { name: 'organizationId', type: 'text' },
  ],
}
