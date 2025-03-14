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
    // Reverse relation from models
    { 
      name: 'models', 
      type: 'relationship', 
      relationTo: 'models', 
      hasMany: true,
    },
    // Additional fields for provider configuration
    { name: 'endpoint', type: 'text' },
    { name: 'apiKey', type: 'text', admin: { condition: () => false } }, // Hidden in admin UI for security
    { name: 'organizationId', type: 'text' },
  ],
}
