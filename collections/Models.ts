import type { CollectionConfig } from 'payload'

export const Models: CollectionConfig = {
  slug: 'models',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    // {
    //   type: 'row',
    //   fields: [
        { name: 'id', type: 'text', required: true },
        { name: 'name', type: 'text', required: true },
    //   ],
    // },
    { name: 'created', type: 'date' },
    { name: 'description', type: 'textarea' },
    { name: 'contextLength', type: 'number' },
    {
      name: 'architecture',
      type: 'group',
      fields: [
        { name: 'modality', type: 'text' },
        { name: 'tokenizer', type: 'text' },
        { name: 'instructType', type: 'text' },
      ],
    },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        { name: 'prompt', type: 'text' },
        { name: 'completion', type: 'text' },
        { name: 'image', type: 'text' },
        { name: 'request', type: 'text' },
      ],
    },
    {
      name: 'topProvider',
      type: 'group',
      fields: [
        { name: 'contextLength', type: 'number' },
        { name: 'maxCompletionTokens', type: 'number' },
        { name: 'isModerated', type: 'checkbox' },
      ],
    },
    { name: 'perRequestLimits', type: 'json' },
  ],
}
