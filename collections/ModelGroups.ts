import type { CollectionConfig } from 'payload'

export const ModelGroups: CollectionConfig = {
  slug: 'modelGroups',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'family', type: 'text' },
    { name: 'version', type: 'text' },
    { name: 'active', type: 'checkbox', defaultValue: true },
    {
      name: 'models',
      type: 'join',
      collection: 'models',
      on: 'modelGroup',
      admin: {
        description: 'Models in this group',
      },
    },
    {
      name: 'functions',
      type: 'relationship',
      relationTo: 'functions',
      hasMany: true,
    },
  ],
}
