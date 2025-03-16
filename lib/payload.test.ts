import { describe, it, expect } from 'vitest'
import { DB } from './payload'
import type { CollectionConfig } from 'payload'

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
})
