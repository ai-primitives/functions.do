import type { CollectionConfig } from 'payload'

export const Datasets: CollectionConfig = {
  slug: 'datasets',
  admin: {
    group: 'Data',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'richText' },
    { 
      name: 'project', 
      type: 'relationship', 
      relationTo: 'projects',
      required: true,
    },
    { 
      name: 'data', 
      type: 'relationship', 
      relationTo: 'data', 
      hasMany: true,
    },
    { 
      name: 'evals', 
      type: 'relationship', 
      relationTo: 'evals', 
      hasMany: true,
    },
  ],
}
