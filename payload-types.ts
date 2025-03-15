/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  blocks: {};
  collections: {
    users: User;
    projects: Project;
    groups: Group;
    functions: Function;
    functionCalls: FunctionCall;
    models: Model;
    modelGroups: ModelGroup;
    providers: Provider;
    workflows: Workflow;
    workflowCalls: WorkflowCall;
    prompts: Prompt;
    datasets: Dataset;
    data: Datum;
    evals: Eval;
    evalRuns: EvalRun;
    evalResults: EvalResult;
    completions: Completion;
    images: Image;
    schemas: Schema;
    tenants: Tenant;
    'payload-jobs': PayloadJob;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {
    projects: {
      modelGroups: 'modelGroups';
      datasets: 'datasets';
      workflows: 'workflows';
      prompts: 'prompts';
    };
    functions: {
      functionCalls: 'functionCalls';
    };
    modelGroups: {
      models: 'models';
    };
    providers: {
      models: 'models';
    };
    workflows: {
      workflowCalls: 'workflowCalls';
    };
    datasets: {
      data: 'data';
      evals: 'evals';
    };
    evalRuns: {
      results: 'evalResults';
    };
  };
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    projects: ProjectsSelect<false> | ProjectsSelect<true>;
    groups: GroupsSelect<false> | GroupsSelect<true>;
    functions: FunctionsSelect<false> | FunctionsSelect<true>;
    functionCalls: FunctionCallsSelect<false> | FunctionCallsSelect<true>;
    models: ModelsSelect<false> | ModelsSelect<true>;
    modelGroups: ModelGroupsSelect<false> | ModelGroupsSelect<true>;
    providers: ProvidersSelect<false> | ProvidersSelect<true>;
    workflows: WorkflowsSelect<false> | WorkflowsSelect<true>;
    workflowCalls: WorkflowCallsSelect<false> | WorkflowCallsSelect<true>;
    prompts: PromptsSelect<false> | PromptsSelect<true>;
    datasets: DatasetsSelect<false> | DatasetsSelect<true>;
    data: DataSelect<false> | DataSelect<true>;
    evals: EvalsSelect<false> | EvalsSelect<true>;
    evalRuns: EvalRunsSelect<false> | EvalRunsSelect<true>;
    evalResults: EvalResultsSelect<false> | EvalResultsSelect<true>;
    completions: CompletionsSelect<false> | CompletionsSelect<true>;
    images: ImagesSelect<false> | ImagesSelect<true>;
    schemas: SchemasSelect<false> | SchemasSelect<true>;
    tenants: TenantsSelect<false> | TenantsSelect<true>;
    'payload-jobs': PayloadJobsSelect<false> | PayloadJobsSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: {
      updateModels: TaskUpdateModels;
      inline: {
        input: unknown;
        output: unknown;
      };
    };
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  name?: string | null;
  role: 'admin' | 'editor' | 'viewer';
  /**
   * Projects this user has access to
   */
  projects?:
    | {
        project: string | Project;
        id?: string | null;
      }[]
    | null;
  tenants?:
    | {
        tenant: string | Tenant;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
  enableAPIKey?: boolean | null;
  apiKey?: string | null;
  apiKeyIndex?: string | null;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "projects".
 */
export interface Project {
  id: string;
  name: string;
  description?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  status: 'draft' | 'active' | 'archived';
  users?:
    | {
        user: string | User;
        id?: string | null;
      }[]
    | null;
  modelGroups?: {
    docs?: (string | ModelGroup)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  datasets?: {
    docs?: (string | Dataset)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  workflows?: {
    docs?: (string | Workflow)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  prompts?: {
    docs?: (string | Prompt)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "modelGroups".
 */
export interface ModelGroup {
  id: string;
  name: string;
  project: string | Project;
  /**
   * Models in this group
   */
  models?: {
    docs?: (string | Model)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "models".
 */
export interface Model {
  id: string;
  name: string;
  description?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  modelGroup: string | ModelGroup;
  provider: string | Provider;
  created?: string | null;
  contextLength?: number | null;
  architecture?: {
    modality?: string | null;
    tokenizer?: string | null;
    instructType?: string | null;
  };
  pricing?: {
    prompt?: string | null;
    completion?: string | null;
    image?: string | null;
    request?: string | null;
  };
  topProvider?: {
    contextLength?: number | null;
    maxCompletionTokens?: number | null;
    isModerated?: boolean | null;
  };
  perRequestLimits?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "providers".
 */
export interface Provider {
  id: string;
  name: string;
  /**
   * Models using this provider
   */
  models?: {
    docs?: (string | Model)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  endpoint?: string | null;
  apiKey?: string | null;
  organizationId?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "datasets".
 */
export interface Dataset {
  id: string;
  name: string;
  description?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  project: string | Project;
  /**
   * Data entries in this dataset
   */
  data?: {
    docs?: (string | Datum)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  /**
   * Evaluations for this dataset
   */
  evals?: {
    docs?: (string | Eval)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "data".
 */
export interface Datum {
  id: string;
  content: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  dataset: string | Dataset;
  metadata?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  tags?:
    | {
        tag?: string | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "evals".
 */
export interface Eval {
  id: string;
  name: string;
  dataset: string | Dataset;
  evalRuns?: (string | EvalRun)[] | null;
  description?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  config?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "evalRuns".
 */
export interface EvalRun {
  id: string;
  eval: string | Eval;
  /**
   * Results from this evaluation run
   */
  results?: {
    docs?: (string | EvalResult)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  startTime: string;
  endTime?: string | null;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "evalResults".
 */
export interface EvalResult {
  id: string;
  evalRun: string | EvalRun;
  metrics:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  createdAt: string;
  summary?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "workflows".
 */
export interface Workflow {
  id: string;
  name: string;
  project: string | Project;
  /**
   * Executions of this workflow
   */
  workflowCalls?: {
    docs?: (string | WorkflowCall)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  description?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  config?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  steps?:
    | {
        name: string;
        type: 'function' | 'condition' | 'loop';
        function?: (string | null) | Function;
        condition?: string | null;
        loopConfig?:
          | {
              [k: string]: unknown;
            }
          | unknown[]
          | string
          | number
          | boolean
          | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "workflowCalls".
 */
export interface WorkflowCall {
  id: string;
  workflow: string | Workflow;
  input:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  output?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  timestamp: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string | null;
  duration?: number | null;
  steps?:
    | {
        stepName: string;
        status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
        input?:
          | {
              [k: string]: unknown;
            }
          | unknown[]
          | string
          | number
          | boolean
          | null;
        output?:
          | {
              [k: string]: unknown;
            }
          | unknown[]
          | string
          | number
          | boolean
          | null;
        error?: string | null;
        startTime?: string | null;
        endTime?: string | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "functions".
 */
export interface Function {
  id: string;
  tenant?: (string | null) | Tenant;
  name: string;
  model?: (string | null) | Model;
  output: 'Object' | 'Text';
  schema?: (string | null) | Schema;
  /**
   * Calls made to this function
   */
  functionCalls?: {
    docs?: (string | FunctionCall)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  system?: string | null;
  user?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "tenants".
 */
export interface Tenant {
  id: string;
  name?: string | null;
  domain?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "schemas".
 */
export interface Schema {
  id: string;
  tenant?: (string | null) | Tenant;
  name: string;
  schema:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  schemaYaml?: string | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "functionCalls".
 */
export interface FunctionCall {
  id: string;
  function: string | Function;
  input:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  output?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  timestamp: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string | null;
  duration?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "prompts".
 */
export interface Prompt {
  id: string;
  name: string;
  content: string;
  project: string | Project;
  /**
   * Functions referenced by this prompt
   */
  functions?:
    | {
        function: string | Function;
        id?: string | null;
      }[]
    | null;
  /**
   * Models referenced by this prompt
   */
  models?:
    | {
        model: string | Model;
        id?: string | null;
      }[]
    | null;
  /**
   * Providers referenced by this prompt
   */
  providers?:
    | {
        provider: string | Provider;
        id?: string | null;
      }[]
    | null;
  variables?:
    | {
        name: string;
        description?: string | null;
        defaultValue?: string | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "groups".
 */
export interface Group {
  id: string;
  name: string;
  /**
   * Users in this group
   */
  users?:
    | {
        user: string | User;
        id?: string | null;
      }[]
    | null;
  /**
   * Models in this group
   */
  models?:
    | {
        model: string | Model;
        id?: string | null;
      }[]
    | null;
  description?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  type?: ('userGroup' | 'modelGroup' | 'mixedGroup') | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "completions".
 */
export interface Completion {
  id: string;
  tenant?: (string | null) | Tenant;
  function?: (string | null) | Function;
  functionName?: string | null;
  model?: (string | null) | Model;
  hash?: string | null;
  requestId?: string | null;
  seed?: number | null;
  output?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  input?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  schema?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  reasoning?: string | null;
  duration?: number | null;
  provider?: string | null;
  refusal?: string | null;
  error?: string | null;
  validation?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  debug?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "images".
 */
export interface Image {
  id: string;
  tenant?: (string | null) | Tenant;
  alt?: string | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-jobs".
 */
export interface PayloadJob {
  id: string;
  /**
   * Input data provided to the job
   */
  input?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  taskStatus?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  completedAt?: string | null;
  totalTried?: number | null;
  /**
   * If hasError is true this job will not be retried
   */
  hasError?: boolean | null;
  /**
   * If hasError is true, this is the error that caused it
   */
  error?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  /**
   * Task execution log
   */
  log?:
    | {
        executedAt: string;
        completedAt: string;
        taskSlug: 'inline' | 'updateModels';
        taskID: string;
        input?:
          | {
              [k: string]: unknown;
            }
          | unknown[]
          | string
          | number
          | boolean
          | null;
        output?:
          | {
              [k: string]: unknown;
            }
          | unknown[]
          | string
          | number
          | boolean
          | null;
        state: 'failed' | 'succeeded';
        error?:
          | {
              [k: string]: unknown;
            }
          | unknown[]
          | string
          | number
          | boolean
          | null;
        id?: string | null;
      }[]
    | null;
  taskSlug?: ('inline' | 'updateModels') | null;
  queue?: string | null;
  waitUntil?: string | null;
  processing?: boolean | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'projects';
        value: string | Project;
      } | null)
    | ({
        relationTo: 'groups';
        value: string | Group;
      } | null)
    | ({
        relationTo: 'functions';
        value: string | Function;
      } | null)
    | ({
        relationTo: 'functionCalls';
        value: string | FunctionCall;
      } | null)
    | ({
        relationTo: 'models';
        value: string | Model;
      } | null)
    | ({
        relationTo: 'modelGroups';
        value: string | ModelGroup;
      } | null)
    | ({
        relationTo: 'providers';
        value: string | Provider;
      } | null)
    | ({
        relationTo: 'workflows';
        value: string | Workflow;
      } | null)
    | ({
        relationTo: 'workflowCalls';
        value: string | WorkflowCall;
      } | null)
    | ({
        relationTo: 'prompts';
        value: string | Prompt;
      } | null)
    | ({
        relationTo: 'datasets';
        value: string | Dataset;
      } | null)
    | ({
        relationTo: 'data';
        value: string | Datum;
      } | null)
    | ({
        relationTo: 'evals';
        value: string | Eval;
      } | null)
    | ({
        relationTo: 'evalRuns';
        value: string | EvalRun;
      } | null)
    | ({
        relationTo: 'evalResults';
        value: string | EvalResult;
      } | null)
    | ({
        relationTo: 'completions';
        value: string | Completion;
      } | null)
    | ({
        relationTo: 'images';
        value: string | Image;
      } | null)
    | ({
        relationTo: 'schemas';
        value: string | Schema;
      } | null)
    | ({
        relationTo: 'tenants';
        value: string | Tenant;
      } | null)
    | ({
        relationTo: 'payload-jobs';
        value: string | PayloadJob;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  name?: T;
  role?: T;
  projects?:
    | T
    | {
        project?: T;
        id?: T;
      };
  tenants?:
    | T
    | {
        tenant?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
  enableAPIKey?: T;
  apiKey?: T;
  apiKeyIndex?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "projects_select".
 */
export interface ProjectsSelect<T extends boolean = true> {
  name?: T;
  description?: T;
  status?: T;
  users?:
    | T
    | {
        user?: T;
        id?: T;
      };
  modelGroups?: T;
  datasets?: T;
  workflows?: T;
  prompts?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "groups_select".
 */
export interface GroupsSelect<T extends boolean = true> {
  name?: T;
  users?:
    | T
    | {
        user?: T;
        id?: T;
      };
  models?:
    | T
    | {
        model?: T;
        id?: T;
      };
  description?: T;
  type?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "functions_select".
 */
export interface FunctionsSelect<T extends boolean = true> {
  tenant?: T;
  name?: T;
  model?: T;
  output?: T;
  schema?: T;
  functionCalls?: T;
  system?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "functionCalls_select".
 */
export interface FunctionCallsSelect<T extends boolean = true> {
  function?: T;
  input?: T;
  output?: T;
  timestamp?: T;
  status?: T;
  error?: T;
  duration?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "models_select".
 */
export interface ModelsSelect<T extends boolean = true> {
  id?: T;
  name?: T;
  description?: T;
  modelGroup?: T;
  provider?: T;
  created?: T;
  contextLength?: T;
  architecture?:
    | T
    | {
        modality?: T;
        tokenizer?: T;
        instructType?: T;
      };
  pricing?:
    | T
    | {
        prompt?: T;
        completion?: T;
        image?: T;
        request?: T;
      };
  topProvider?:
    | T
    | {
        contextLength?: T;
        maxCompletionTokens?: T;
        isModerated?: T;
      };
  perRequestLimits?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "modelGroups_select".
 */
export interface ModelGroupsSelect<T extends boolean = true> {
  name?: T;
  project?: T;
  models?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "providers_select".
 */
export interface ProvidersSelect<T extends boolean = true> {
  name?: T;
  models?: T;
  endpoint?: T;
  apiKey?: T;
  organizationId?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "workflows_select".
 */
export interface WorkflowsSelect<T extends boolean = true> {
  name?: T;
  project?: T;
  workflowCalls?: T;
  description?: T;
  config?: T;
  steps?:
    | T
    | {
        name?: T;
        type?: T;
        function?: T;
        condition?: T;
        loopConfig?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "workflowCalls_select".
 */
export interface WorkflowCallsSelect<T extends boolean = true> {
  workflow?: T;
  input?: T;
  output?: T;
  timestamp?: T;
  status?: T;
  error?: T;
  duration?: T;
  steps?:
    | T
    | {
        stepName?: T;
        status?: T;
        input?: T;
        output?: T;
        error?: T;
        startTime?: T;
        endTime?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "prompts_select".
 */
export interface PromptsSelect<T extends boolean = true> {
  name?: T;
  content?: T;
  project?: T;
  functions?:
    | T
    | {
        function?: T;
        id?: T;
      };
  models?:
    | T
    | {
        model?: T;
        id?: T;
      };
  providers?:
    | T
    | {
        provider?: T;
        id?: T;
      };
  variables?:
    | T
    | {
        name?: T;
        description?: T;
        defaultValue?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "datasets_select".
 */
export interface DatasetsSelect<T extends boolean = true> {
  name?: T;
  description?: T;
  project?: T;
  data?: T;
  evals?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "data_select".
 */
export interface DataSelect<T extends boolean = true> {
  content?: T;
  dataset?: T;
  metadata?: T;
  tags?:
    | T
    | {
        tag?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "evals_select".
 */
export interface EvalsSelect<T extends boolean = true> {
  name?: T;
  dataset?: T;
  evalRuns?: T;
  description?: T;
  config?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "evalRuns_select".
 */
export interface EvalRunsSelect<T extends boolean = true> {
  eval?: T;
  results?: T;
  startTime?: T;
  endTime?: T;
  status?: T;
  error?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "evalResults_select".
 */
export interface EvalResultsSelect<T extends boolean = true> {
  evalRun?: T;
  metrics?: T;
  createdAt?: T;
  summary?: T;
  updatedAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "completions_select".
 */
export interface CompletionsSelect<T extends boolean = true> {
  tenant?: T;
  function?: T;
  functionName?: T;
  model?: T;
  hash?: T;
  requestId?: T;
  seed?: T;
  output?: T;
  input?: T;
  schema?: T;
  reasoning?: T;
  duration?: T;
  provider?: T;
  refusal?: T;
  error?: T;
  validation?: T;
  debug?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "images_select".
 */
export interface ImagesSelect<T extends boolean = true> {
  tenant?: T;
  alt?: T;
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "schemas_select".
 */
export interface SchemasSelect<T extends boolean = true> {
  tenant?: T;
  name?: T;
  schema?: T;
  schemaYaml?: T;
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "tenants_select".
 */
export interface TenantsSelect<T extends boolean = true> {
  id?: T;
  name?: T;
  domain?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-jobs_select".
 */
export interface PayloadJobsSelect<T extends boolean = true> {
  input?: T;
  taskStatus?: T;
  completedAt?: T;
  totalTried?: T;
  hasError?: T;
  error?: T;
  log?:
    | T
    | {
        executedAt?: T;
        completedAt?: T;
        taskSlug?: T;
        taskID?: T;
        input?: T;
        output?: T;
        state?: T;
        error?: T;
        id?: T;
      };
  taskSlug?: T;
  queue?: T;
  waitUntil?: T;
  processing?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "TaskUpdateModels".
 */
export interface TaskUpdateModels {
  input?: unknown;
  output: {
    success?: boolean | null;
    message?: string | null;
    count?: number | null;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}