import type { CollectionConfig } from 'payload';

// Field can be a simple string or any JS value for underscore-prefixed properties
type SimpleSchemaField = string | any;

// Schema definition with collections and their fields
type SimpleSchema = Record<string, Record<string, SimpleSchemaField>>;

/**
 * DB function transforms a simplified schema syntax into PayloadCMS collection configurations
 * 
 * Syntax examples:
 * - Simple fields: 'text', 'richText', 'checkbox', 'date', 'email', etc.
 * - Select fields: 'Option1 | Option2 | Option3'
 * - Relations: 'collectionName'
 * - Arrays of relations: 'collectionName[]'
 * - Reverse relations: '<-collectionName.fieldName'
 * - JSON fields: 'json'
 * - Array fields: 'array'
 */
export const DB = (schema: SimpleSchema): Record<string, CollectionConfig> => {
  const result: Record<string, CollectionConfig> = {};

  for (const [collectionSlug, fields] of Object.entries(schema)) {
    // Determine which field to use as the title
    // Priority: id field if no other candidates exist
    // Then check for common title fields: name, title, label, etc.
    let useAsTitle = 'id';
    
    // Check for common title fields
    if ('name' in fields) useAsTitle = 'name';
    else if ('title' in fields) useAsTitle = 'title';
    else if ('label' in fields) useAsTitle = 'label';
    else if ('function' in fields) useAsTitle = 'function';
    else if ('id' in fields) useAsTitle = 'id';
    
    const collection: CollectionConfig = {
      slug: collectionSlug,
      admin: {
        useAsTitle,
      },
      fields: [],
    };

    // Add versions by default
    collection.versions = true;

    // Process each field in the collection
    for (const [key, value] of Object.entries(fields)) {
      // Skip empty values
      if (!value) continue;

      // Underscore fields are passed directly to the collection config
      if (key.startsWith('_')) {
        const configKey = key.substring(1); // Remove leading underscore
        (collection as any)[configKey] = value;
        continue;
      }

      // Add the field based on its type
      const field = parseField(key, value, collectionSlug);
      if (field) {
        collection.fields.push(field);
      }
    }

    result[collectionSlug] = collection;
  }

  return result;
};

/**
 * Parse a field string into a PayloadCMS field configuration
 */
const parseField = (name: string, fieldType: string, collectionSlug: string): any => {
  // Handle reverse relation fields (join fields)
  if (fieldType.startsWith('<-')) {
    // Format: '<-collectionName.fieldName'
    const [collection, relationField] = fieldType.substring(2).split('.');
    return {
      name,
      type: 'relationship',
      hasMany: true,
      relationTo: collection,
      admin: {
        description: `${name} that reference this ${collectionSlug}`,
      },
    };
  }

  // Handle arrays of relations
  if (fieldType.endsWith('[]')) {
    const relationTo = fieldType.substring(0, fieldType.length - 2);
    return {
      name,
      type: 'relationship',
      relationTo,
      hasMany: true,
    };
  }

  // Handle select fields with options
  if (fieldType.includes(' | ')) {
    const options = fieldType.split(' | ').map(option => ({
      label: option,
      value: option.toLowerCase(),
    }));

    return {
      name,
      type: 'select',
      options,
    };
  }

  // Handle code with specific language like 'code:markdown'
  if (fieldType.startsWith('code:')) {
    const language = fieldType.substring(5);
    return { name, type: 'code', admin: { language } };
  }

  // Handle standard field types
  switch (fieldType) {
    case 'text':
      return { name, type: 'text' };
    case 'richText':
      return { name, type: 'richText' };
    case 'email':
      return { name, type: 'email' };
    case 'checkbox':
      return { name, type: 'checkbox' };
    case 'date':
      return { name, type: 'date' };
    case 'number':
      return { name, type: 'number' };
    case 'json':
      return { name, type: 'json' };
    case 'code':
      return { name, type: 'code', admin: { language: 'javascript' } };
    case 'array':
      return { 
        name, 
        type: 'array',
        fields: [
          {
            name: 'item',
            type: 'text',
          }
        ] 
      };
    default:
      // If not a special type, assume it's a relation to another collection
      if (fieldType.match(/^[a-zA-Z0-9]+$/)) {
        return {
          name,
          type: 'relationship',
          relationTo: fieldType,
        };
      }
      // If we can't determine the type, return a text field with a warning
      console.warn(`Unknown field type: ${fieldType} for field ${name}`);
      return { name, type: 'text' };
  }
};

export default DB;
