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
    // Using a join field for data entries
    {
      name: 'data',
      type: 'join',
      collection: 'data',
      on: 'dataset',
      admin: {
        description: 'Data entries in this dataset',
      },
    },
    // Using a join field for evals
    {
      name: 'evals',
      type: 'join',
      collection: 'evals',
      on: 'dataset',
      admin: {
        description: 'Evaluations for this dataset',
      },
    },
  ],
}
