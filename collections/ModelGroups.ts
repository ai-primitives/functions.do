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
    { 
      name: 'project', 
      type: 'relationship', 
      relationTo: 'projects',
      required: true,
    },
    { 
      name: 'models', 
      type: 'relationship', 
      relationTo: 'models', 
      hasMany: true,
    },
  ],
}
