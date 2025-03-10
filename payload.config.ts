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

import { Users } from './collections/Users'
import { Images } from './collections/Images'
import { Functions } from './collections/Functions'
import { Tenants } from './collections/Tenants'
import { Models } from './collections/Models'
import { Schemas } from './collections/Schemas'
import { Completions } from './collections/Completions'

import { isSuperAdmin } from './collections/hooks/isSuperAdmin'
import { updateModels } from './tasks/updateModels'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Functions, Models, Completions, Images, Schemas, Users, Tenants],
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
      tenantsArrayField: {
        
      },
      tenantField: {
        
      },
      collections: {
        images: {},
        functions: {},
        schemas: {},
        completions: {
          
        },
        // projects: {},
      },
      userHasAccessToAllTenants: isSuperAdmin,
    }),
  ],
})
