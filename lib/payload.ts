import type { CollectionConfig } from 'payload';

// Field can be a simple string or any JS value for underscore-prefixed properties
type SimpleSchemaField = string | any;

// Schema definition with collections and their fields
type SimpleSchema = Record<string, Record<string, SimpleSchemaField>>;

/**
 * Admin UI customization options
 */
type AdminUIFieldRow = string[];
type AdminUICollection = Record<string, AdminUIFieldRow[]>;
type AdminUIConfig = {
  admin?: Record<string, AdminUICollection>;
};

/**
 * DB function transforms a simplified schema syntax into PayloadCMS collection configurations
 * 
 * @param schema - The simplified schema definition
 * @param options - Additional configuration options
 * 
 * Schema Syntax examples:
 * - Simple fields: 'text', 'richText', 'checkbox', 'date', 'email', etc.
 * - Select fields: 'Option1 | Option2 | Option3'
 * - Relations: 'collectionName'
 * - Arrays of relations: 'collectionName[]'
 * - Reverse relations: '<-collectionName.fieldName'
 * - JSON fields: 'json'
 * - Array fields: 'array'
 * - Code with language: 'code:language' (e.g. 'code:markdown')
 * 
 * Options can include:
 * - admin: Configuration for Admin UI grouping and field layouts
 */
export const DB = (
  schema: SimpleSchema, 
  options: AdminUIConfig = {}
): Record<string, CollectionConfig> => {
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
    
    // Initialize collection config with basic settings
    const collection: CollectionConfig = {
      slug: collectionSlug,
      admin: {
        useAsTitle,
      },
      fields: [],
    };
    
    // Store field layout if specified for later processing
    let fieldLayout: AdminUIFieldRow[] | undefined;
    
    // Process admin UI customization if provided
    const adminConfig = options.admin;
    if (adminConfig) {
      // Find which group this collection belongs to
      for (const [groupName, groupCollections] of Object.entries(adminConfig)) {
        if (collectionSlug in groupCollections) {
          // Set the group for this collection
          if (collection.admin) {
            collection.admin.group = groupName;
          }
          
          // Store field layout if specified for later processing
          fieldLayout = groupCollections[collectionSlug];
          break;
        }
      }
    }

    // Add versions by default
    collection.versions = true;

    // Create a map to store all fields by name for later reference
    const fieldMap = new Map<string, any>();
    
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
        // Store field in map and add to collection
        fieldMap.set(key, field);
        collection.fields.push(field);
      }
    }
    
    // Apply field layout if specified
    if (fieldLayout && fieldLayout.length > 0 && collection.admin) {
      // Extract the original fields to rebuild with the row structure
      const originalFields = [...collection.fields] as any[];
      collection.fields = [];
      
      // Add field rows according to the layout
      for (const rowFields of fieldLayout) {
        if (rowFields.length > 1) {
          // Create a row with fields
          const row: any = {
            name: `row_${Math.random().toString(36).substring(2, 7)}`, // Create a unique name for the row
            type: 'row',
            fields: []
          };
          
          // Add fields to the row
          for (const fieldName of rowFields) {
            const field = fieldMap.get(fieldName);
            if (field) {
              row.fields.push(field);
              // Remove from map to track which fields have been used
              fieldMap.delete(fieldName);
            }
          }
          
          if (row.fields.length > 0) {
            collection.fields.push(row);
          }
        } else if (rowFields.length === 1) {
          // Single field in a row - just add it directly
          const field = fieldMap.get(rowFields[0]);
          if (field) {
            collection.fields.push(field);
            fieldMap.delete(rowFields[0]);
          }
        }
      }
      
      // Add any remaining fields that weren't in the layout
      for (const field of originalFields) {
        if ('name' in field && fieldMap.has(field.name)) {
          collection.fields.push(field);
        }
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
