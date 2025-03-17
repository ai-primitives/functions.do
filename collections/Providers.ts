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
    { name: 'description', type: 'richText' },
    { name: 'active', type: 'checkbox', defaultValue: true },
    {
      name: 'models',
      type: 'join',
      collection: 'models',
      on: 'provider',
    },
    { name: 'endpoint', type: 'text' },
    { name: 'apiUrl', type: 'text' },
    { name: 'apiKey', type: 'text', admin: { condition: () => false } }, // Hidden in admin UI for security
    { name: 'organizationId', type: 'text' },
    { name: 'authType', type: 'select', options: ['apiKey', 'oauth', 'bearer', 'none'] },
    { name: 'config', type: 'json' },
    { name: 'headers', type: 'json' },
    { name: 'tools', type: 'json' },
  ],
}
