import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    group: 'Admin',
    // useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'id', label: 'ID', type: 'text', required: true },
    // { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'domain', label: 'Domain', type: 'text' },
    { name: 'apiKey', label: 'API Key', type: 'text' },
    { name: 'active', label: 'Active', type: 'checkbox', defaultValue: true },
    { name: 'deployed', label: 'Deployed', type: 'checkbox', defaultValue: false },
    {
      name: 'functions',
      label: 'Functions',
      type: 'relationship',
      relationTo: 'functions',
      hasMany: true,
    },
    {
      name: 'users',
      label: 'Users',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
  ],
}
