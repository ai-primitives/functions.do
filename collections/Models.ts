import type { CollectionConfig } from 'payload'

export const Models: CollectionConfig = {
  slug: 'models',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'id', type: 'text', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'code', admin: { language: 'markdown', editorOptions: { padding: { top: 20, bottom: 20 } } } },
    {
      name: 'modelGroup',
      type: 'relationship',
      relationTo: 'modelGroups',
      // required: true,
    },
    {
      name: 'provider',
      type: 'relationship',
      relationTo: 'providers',
      // required: true,
    },
    { name: 'created', type: 'date' },
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
      name: 'capabilities',
      type: 'group',
      fields: [
        { name: 'contextLength', type: 'number' },
        { name: 'maxCompletionTokens', type: 'number' },
        { name: 'isModerated', type: 'checkbox' },
        { name: 'multimodal', type: 'checkbox' },
        { name: 'tools', type: 'checkbox' },
        { name: 'vision', type: 'checkbox' },
      ],
    },
    { name: 'perRequestLimits', type: 'json' },
  ],
}
