import type { CollectionConfig } from 'payload'

export const Completions: CollectionConfig = {
  slug: 'completions',
  admin: {
    group: 'Data',
    // useAsTitle: 'name',
  },
  fields: [
    { type: 'row', fields: [
      { name: 'function', type: 'relationship', relationTo: 'functions' },
      { name: 'model', type: 'relationship', relationTo: 'models' },
      { name: 'hash', type: 'text' },
      { name: 'requestId', type: 'text' },
      { name: 'seed', type: 'number' },
    ]},
    { name: 'output', type: 'json' },
    { name: 'input', type: 'json' },
    { name: 'debug', type: 'json' },
  ],
}
