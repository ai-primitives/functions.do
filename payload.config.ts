// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import type { Config } from './payload-types'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { collections } from './collections'

// Import our database schema and collection generator
// import collections from './database.config'

// // Import individual collections that are not yet handled by our schema system
// import { Images } from './collections/Images'
// import { Completions } from './collections/Completions'
// import { Groups } from './collections/Groups'

import { isSuperAdmin } from './collections/hooks/isSuperAdmin'
import { updateModels } from './tasks/updateModels'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users', // Now users collection has auth configuration
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections,
  // collections: [
  //   // Collections from our schema system
  //   ...Object.values(collections),
    
  //   // Individual collections not yet in the schema system
  //   Groups,
  //   Completions,
  //   Images,
  // ],
  jobs: {
    tasks: [updateModels],
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
    multiTenantPlugin<Config>({
      tenantSelectorLabel: 'Project',
      tenantsArrayField: {},
      tenantField: {},
      collections: {
        images: {},
        functions: {},
        schemas: {},
        completions: {},
        // projects: {},
      },
      userHasAccessToAllTenants: isSuperAdmin,
    }),
  ],
})
