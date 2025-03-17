import { Completions } from './Completions'
import { Data } from './Data'
import { Datasets } from './Datasets'
import { EvalResults } from './EvalResults'
import { EvalRuns } from './EvalRuns'
import { Evals } from './Evals'
import { FunctionCalls } from './FunctionCalls'
import { Functions } from './Functions'
import { Groups } from './Groups'
import { ModelGroups } from './ModelGroups'
import { Models } from './Models'
import { Projects } from './Projects'
import { Prompts } from './Prompts'
import { Providers } from './Providers'
import { Schemas } from './Schemas'
import { Tenants } from './Tenants'
import { Users } from './Users'
import { WorkflowCalls } from './WorkflowCalls'
import { Workflows } from './Workflows'

export const collections = [
  Functions,
  Completions,
  Datasets,
  Data,
  Evals,
  EvalRuns,
  EvalResults,
  FunctionCalls,
  // Groups,
  ModelGroups,
  Models,
  Prompts,
  Providers,
  Schemas,
  Tenants,
  Users,
  Workflows,
  WorkflowCalls,
]