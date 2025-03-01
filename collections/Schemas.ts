import type { CollectionConfig } from 'payload'
import yaml from 'yaml'

export const Schemas: CollectionConfig = {
  slug: 'schemas',
  admin: {
    group: 'Data',
    useAsTitle: 'name',
  },
  versions: {
    drafts: true,
  },
  fields: [
    { name: 'name', type: 'text', required: true, admin: { position: 'sidebar' } },
    { name: 'schema', type: 'json', required: true, admin: { hidden: true }, defaultValue: {} },
    {
      name: 'schemaYaml',
      type: 'code',
      admin: {
        language: 'yaml',
        description: 'Edit schema in YAML format for better readability',
        editorOptions: { lineNumbers: 'off' },
      },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (value && typeof value === 'string' && value.trim()) {
              try {
                // Convert YAML to JSON and update the schema field
                const jsonData = yaml.parse(value)
                siblingData.schema = jsonData
              } catch (error) {
                // If YAML parsing fails, return validation error
                return 'Invalid YAML format'
              }
            } else {
              // Initialize with empty object if no value
              siblingData.schema = {}
            }
            return value
          },
        ],
        afterRead: [
          ({ value, data }) => {
            // Convert JSON to YAML when reading the document
            if (data && data.schema) {
              try {
                return yaml.stringify(data.schema, {
                  indent: 2,
                  lineWidth: -1, // No line wrapping
                })
              } catch (error) {
                console.error('Error converting JSON to YAML:', error)
                return ''
              }
            }
            // Return empty string if no schema data
            return value || ''
          },
        ],
      },
    },
  ],
}
