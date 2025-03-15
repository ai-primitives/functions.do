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
import { Projects } from './collections/Projects'
import { ModelGroups } from './collections/ModelGroups'
import { Providers } from './collections/Providers'
import { Datasets } from './collections/Datasets'
import { Data } from './collections/Data'
import { Evals } from './collections/Evals'
import { EvalRuns } from './collections/EvalRuns'
import { EvalResults } from './collections/EvalResults'
import { FunctionCalls } from './collections/FunctionCalls'
import { Workflows } from './collections/Workflows'
import { WorkflowCalls } from './collections/WorkflowCalls'
import { Prompts } from './collections/Prompts'
import { Groups } from './collections/Groups'

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
  collections: [
    // Core collections
    Users,
    Projects,
    Groups,

    // AI collections
    Functions,
    FunctionCalls,
    Models,
    ModelGroups,
    Providers,
    Workflows,
    WorkflowCalls,
    Prompts,

    // Data collections
    Datasets,
    Data,
    Evals,
    EvalRuns,
    EvalResults,

    // Existing collections
    Completions,
    Images,
    Schemas,
    Tenants,
  ],
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
