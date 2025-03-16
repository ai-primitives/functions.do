import { describe, it, expect } from 'vitest'
import { DB } from './payload'
import type { CollectionConfig } from 'payload'

// Helper function to find a field by name in a collection
const findField = (collection: any, name: string): any => {
  // First look for the field directly in the fields array
  for (const field of collection.fields) {
    if (field.name === name) return field;
    
    // Check if this is a row field that might contain our target field
    if (field.type === 'row' && Array.isArray(field.fields)) {
      for (const rowField of field.fields) {
        if (rowField.name === name) return rowField;
      }
    }
  }
  return undefined;
}

describe('DB Schema Function', () => {
  // Test basic field types
  it('should transform basic field types correctly', () => {
    const schema = {
      test: {
        textField: 'text',
        richTextField: 'richText',
        numberField: 'number',
        emailField: 'email',
        checkboxField: 'checkbox',
        dateField: 'date',
        jsonField: 'json',
        codeField: 'code',
      },
    }

    const result = DB(schema)

    // Verify collection basics
    expect(result).toHaveProperty('test')
    expect(result.test).toHaveProperty('slug', 'test')
    expect(result.test).toHaveProperty('fields')
    expect(result.test.fields).toBeInstanceOf(Array)
    
    // Verify each field type was transformed correctly
    const fields = result.test.fields as any[]
    
    // Text field
    const textField = fields.find(f => f.name === 'textField')
    expect(textField).toMatchObject({ name: 'textField', type: 'text' })
    
    // Rich text field
    const richTextField = fields.find(f => f.name === 'richTextField')
    expect(richTextField).toMatchObject({ name: 'richTextField', type: 'richText' })
    
    // Number field
    const numberField = fields.find(f => f.name === 'numberField')
    expect(numberField).toMatchObject({ name: 'numberField', type: 'number' })
    
    // Email field
    const emailField = fields.find(f => f.name === 'emailField')
    expect(emailField).toMatchObject({ name: 'emailField', type: 'email' })
    
    // Checkbox field
    const checkboxField = fields.find(f => f.name === 'checkboxField')
    expect(checkboxField).toMatchObject({ name: 'checkboxField', type: 'checkbox' })
    
    // Date field
    const dateField = fields.find(f => f.name === 'dateField')
    expect(dateField).toMatchObject({ name: 'dateField', type: 'date' })
    
    // JSON field
    const jsonField = fields.find(f => f.name === 'jsonField')
    expect(jsonField).toMatchObject({ name: 'jsonField', type: 'json' })
    
    // Code field
    const codeField = fields.find(f => f.name === 'codeField')
    expect(codeField).toMatchObject({ 
      name: 'codeField', 
      type: 'code',
      admin: { language: 'javascript' } 
    })
  })

  // Test select field with options
  it('should transform select fields with options correctly', () => {
    const schema = {
      test: {
        status: 'Draft | Active | Archived',
        visibility: 'Public | Private | Unlisted'
      },
    }

    const result = DB(schema)
    const fields = result.test.fields as any[]
    
    // Status field
    const statusField = fields.find(f => f.name === 'status')
    expect(statusField).toHaveProperty('type', 'select')
    expect(statusField.options).toBeInstanceOf(Array)
    expect(statusField.options).toHaveLength(3)
    expect(statusField.options).toContainEqual({ label: 'Draft', value: 'draft' })
    expect(statusField.options).toContainEqual({ label: 'Active', value: 'active' })
    expect(statusField.options).toContainEqual({ label: 'Archived', value: 'archived' })
    
    // Visibility field
    const visibilityField = fields.find(f => f.name === 'visibility')
    expect(visibilityField).toHaveProperty('type', 'select')
    expect(visibilityField.options).toHaveLength(3)
    expect(visibilityField.options).toContainEqual({ label: 'Public', value: 'public' })
    expect(visibilityField.options).toContainEqual({ label: 'Private', value: 'private' })
    expect(visibilityField.options).toContainEqual({ label: 'Unlisted', value: 'unlisted' })
  })

  // Test relation fields
  it('should transform relation fields correctly', () => {
    const schema = {
      test: {
        // Single relation
        author: 'users',
        // Array relation
        categories: 'categories[]',
        // Reverse relation
        comments: '<-comments.post'
      },
    }

    const result = DB(schema)
    const fields = result.test.fields as any[]
    
    // Single relation field
    const authorField = fields.find(f => f.name === 'author')
    expect(authorField).toMatchObject({ 
      name: 'author', 
      type: 'relationship',
      relationTo: 'users',
    })
    expect(authorField).not.toHaveProperty('hasMany')
    
    // Array relation field
    const categoriesField = fields.find(f => f.name === 'categories')
    expect(categoriesField).toMatchObject({ 
      name: 'categories', 
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true
    })
    
    // Reverse relation field
    const commentsField = fields.find(f => f.name === 'comments')
    expect(commentsField).toMatchObject({ 
      name: 'comments', 
      type: 'relationship',
      relationTo: 'comments',
      hasMany: true
    })
  })

  // Test array fields
  it('should transform array fields correctly', () => {
    const schema = {
      test: {
        tags: 'array',
      },
    }

    const result = DB(schema)
    const fields = result.test.fields as any[]
    
    const tagsField = fields.find(f => f.name === 'tags')
    expect(tagsField).toHaveProperty('type', 'array')
    expect(tagsField).toHaveProperty('fields')
    expect(tagsField.fields).toBeInstanceOf(Array)
    expect(tagsField.fields[0]).toMatchObject({ name: 'item', type: 'text' })
  })

  // Test complex schema with multiple collections
  it('should transform a complex schema with multiple collections', () => {
    const schema = {
      posts: {
        title: 'text',
        content: 'richText',
        status: 'Draft | Published | Archived',
        author: 'users',
        categories: 'categories[]',
        comments: '<-comments.post'
      },
      categories: {
        name: 'text',
        description: 'richText',
        posts: '<-posts.categories'
      },
      comments: {
        content: 'richText',
        author: 'users',
        post: 'posts'
      }
    }

    const result = DB(schema)
    
    // Verify all collections were created
    expect(result).toHaveProperty('posts')
    expect(result).toHaveProperty('categories')
    expect(result).toHaveProperty('comments')
    
    // Verify collections have the correct fields
    expect(result.posts.fields.length).toBe(6)
    expect(result.categories.fields.length).toBe(3)
    expect(result.comments.fields.length).toBe(3)
    
    // Check specific relations
    const postsFields = result.posts.fields as any[]
    const categoriesField = postsFields.find(f => f.name === 'categories')
    expect(categoriesField).toMatchObject({ 
      name: 'categories', 
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true
    })
  })

  // Test code fields with specific languages
  it('should handle code fields with specific languages', () => {
    const schema = {
      test: {
        markdownCode: 'code:markdown',
        pythonCode: 'code:python',
        htmlCode: 'code:html',
        cssCode: 'code:css',
      },
    }

    const result = DB(schema)
    const fields = result.test.fields as any[]
    
    // Markdown code field
    const markdownField = fields.find(f => f.name === 'markdownCode')
    expect(markdownField).toMatchObject({ 
      name: 'markdownCode', 
      type: 'code',
      admin: { language: 'markdown' } 
    })
    
    // Python code field
    const pythonField = fields.find(f => f.name === 'pythonCode')
    expect(pythonField).toMatchObject({ 
      name: 'pythonCode', 
      type: 'code',
      admin: { language: 'python' } 
    })
    
    // HTML code field
    const htmlField = fields.find(f => f.name === 'htmlCode')
    expect(htmlField).toMatchObject({ 
      name: 'htmlCode', 
      type: 'code',
      admin: { language: 'html' } 
    })
    
    // CSS code field
    const cssField = fields.find(f => f.name === 'cssCode')
    expect(cssField).toMatchObject({ 
      name: 'cssCode', 
      type: 'code',
      admin: { language: 'css' } 
    })
  })

  // Test underscore-prefixed properties passed as collection configuration
  it('should pass underscore-prefixed properties directly to collection config', () => {
    const schema = {
      users: {
        name: 'text',
        email: 'email',
        _auth: { tokenExpiration: 60 * 60 * 24 * 30, useAPIKey: true },
        _access: { read: () => true, create: () => false },
        _hooks: { beforeChange: [] }
      },
    }

    const result = DB(schema)
    
    // Verify underscore properties were passed directly to collection config
    expect(result.users).toHaveProperty('auth')
    expect(result.users.auth).toEqual({ tokenExpiration: 60 * 60 * 24 * 30, useAPIKey: true })
    
    expect(result.users).toHaveProperty('access')
    // Use non-null assertion to tell TypeScript the property exists
    const access = result.users.access!
    expect(typeof access.read).toBe('function')
    expect(typeof access.create).toBe('function')
    
    expect(result.users).toHaveProperty('hooks')
    // Use non-null assertion to tell TypeScript the property exists
    const hooks = result.users.hooks!
    expect(Array.isArray(hooks.beforeChange)).toBe(true)
  })

  // Test fallback for unknown field types
  it('should provide a fallback for unknown field types', () => {
    const schema = {
      test: {
        unknownField: 'something_unknown',
      },
    }

    const result = DB(schema)
    const fields = result.test.fields as any[]
    
    const unknownField = fields.find(f => f.name === 'unknownField')
    // Should fall back to text type
    expect(unknownField).toHaveProperty('type', 'text')
  })

  // ====== ADMIN UI CUSTOMIZATION TESTS ======

  // Test admin UI group assignment
  it('should assign collections to admin UI groups', () => {
    const schema = {
      posts: {
        title: 'text',
        content: 'richText',
      },
      categories: {
        name: 'text',
        description: 'richText',
      },
      authors: {
        name: 'text',
        bio: 'richText',
      }
    }

    const adminConfig = {
      admin: {
        Content: {
          posts: [],
          categories: []
        },
        Users: {
          authors: []
        }
      }
    }

    const result = DB(schema, adminConfig)
    
    // Check that collections were assigned to the correct groups
    expect(result.posts.admin).toHaveProperty('group', 'Content')
    expect(result.categories.admin).toHaveProperty('group', 'Content')
    expect(result.authors.admin).toHaveProperty('group', 'Users')
  })

  // Test field row layout - simple case with one row
  it('should organize fields into rows based on admin config', () => {
    const schema = {
      authors: {
        firstName: 'text',
        lastName: 'text',
        email: 'email',
        bio: 'richText',
      }
    }

    const adminConfig = {
      admin: {
        Users: {
          authors: [
            ['firstName', 'lastName'] // Group these two fields in a row
          ]
        }
      }
    }

    const result = DB(schema, adminConfig)
    
    // Check that a row was created
    const fields = result.authors.fields as any[]
    const rowField = fields.find(f => f.type === 'row')
    expect(rowField).toBeDefined()
    expect(rowField.type).toBe('row')
    expect(rowField.fields).toHaveLength(2)
    
    // Check that the row contains the expected fields
    const fieldNames = rowField.fields.map((f: any) => f.name)
    expect(fieldNames).toContain('firstName')
    expect(fieldNames).toContain('lastName')
    
    // Check that other fields are still present at the top level
    expect(findField(result.authors, 'email')).toBeDefined()
    expect(findField(result.authors, 'bio')).toBeDefined()
  })

  // Test complex field row layout with multiple rows
  it('should support complex layouts with multiple rows', () => {
    const schema = {
      products: {
        name: 'text',
        description: 'richText',
        price: 'number',
        discountPrice: 'number',
        sku: 'text',
        inventory: 'number',
        featured: 'checkbox',
        category: 'categories',
      }
    }

    const adminConfig = {
      admin: {
        Shop: {
          products: [
            ['name', 'sku'],              // Row 1: Basic info
            ['price', 'discountPrice'],   // Row 2: Pricing
            ['featured', 'inventory'],    // Row 3: Status
          ]
        }
      }
    }

    const result = DB(schema, adminConfig)
    
    // Check that the correct number of row fields were created
    const fields = result.products.fields as any[]
    const rowFields = fields.filter(f => f.type === 'row')
    expect(rowFields).toHaveLength(3)
    
    // Check first row (name, sku)
    const nameSkuRow = rowFields.find(r => 
      r.fields.some((f: any) => f.name === 'name') && 
      r.fields.some((f: any) => f.name === 'sku')
    )
    expect(nameSkuRow).toBeDefined()
    expect(nameSkuRow.fields).toHaveLength(2)
    
    // Check second row (price, discountPrice)
    const priceRow = rowFields.find(r => 
      r.fields.some((f: any) => f.name === 'price') && 
      r.fields.some((f: any) => f.name === 'discountPrice')
    )
    expect(priceRow).toBeDefined()
    expect(priceRow.fields).toHaveLength(2)
    
    // Check third row (featured, inventory)
    const statusRow = rowFields.find(r => 
      r.fields.some((f: any) => f.name === 'featured') && 
      r.fields.some((f: any) => f.name === 'inventory')
    )
    expect(statusRow).toBeDefined()
    expect(statusRow.fields).toHaveLength(2)
    
    // Check that other fields are still present at the top level
    expect(findField(result.products, 'description')).toBeDefined()
    expect(findField(result.products, 'category')).toBeDefined()
  })

  // Test empty or missing admin config
  it('should handle missing or empty admin config gracefully', () => {
    const schema = {
      posts: {
        title: 'text',
        content: 'richText',
      }
    }

    // Test with undefined admin config (default parameter in DB function)
    const result1 = DB(schema)
    expect(result1.posts).toBeDefined()
    expect(result1.posts.fields).toHaveLength(2)
    
    // Test with empty admin config
    const result2 = DB(schema, {})
    expect(result2.posts).toBeDefined()
    expect(result2.posts.fields).toHaveLength(2)
    
    // Test with admin config that doesn't include this collection
    const result3 = DB(schema, {
      admin: {
        Content: {
          someOtherCollection: []
        }
      }
    })
    expect(result3.posts).toBeDefined()
    expect(result3.posts.fields).toHaveLength(2)
  })

  // Test combination of admin UI customization with other features
  it('should work with all other features simultaneously', () => {
    const schema = {
      products: {
        name: 'text',
        price: 'number',
        status: 'Active | Draft | Archived',
        category: 'categories',
        tags: 'tags[]',
        code: 'code:javascript',
        _hooks: { beforeChange: [] },
        _access: { read: () => true }
      }
    }

    const adminConfig = {
      admin: {
        Shop: {
          products: [
            ['name', 'price'],          // Row 1: Basic info
            ['status', 'category'],     // Row 2: Classification
          ]
        }
      }
    }

    const result = DB(schema, adminConfig)
    
    // Check admin grouping
    expect(result.products.admin).toHaveProperty('group', 'Shop')
    
    // Check row layout
    const fields = result.products.fields as any[]
    const rowFields = fields.filter(f => f.type === 'row')
    expect(rowFields).toHaveLength(2)
    
    // Check that underscore properties were passed correctly
    expect(result.products).toHaveProperty('hooks')
    expect(result.products).toHaveProperty('access')
    
    // Check that code field with language was processed correctly
    const codeField = findField(result.products, 'code')
    expect(codeField).toBeDefined()
    expect(codeField).toMatchObject({
      name: 'code',
      type: 'code',
      admin: { language: 'javascript' }
    })
  })
})
