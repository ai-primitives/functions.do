import { DB } from './lib/payload';


const collections = DB({
  // Core entities
  users: {
    name: 'text',
    email: 'email',
    password: 'text',
    firstName: 'text',
    lastName: 'text', 
    active: 'checkbox',
    avatar: 'text',
    projects: 'projects[]',
    function: 'functions[]',
    permissions: 'json',
    role: 'Admin | Editor | Viewer',
    preferences: 'json',
    _auth: { tokenExpiration: 60 * 60 * 24 * 30, useAPIKey: true },
  },

  tenants: {
    id: 'text',
    name: 'text',
    domain: 'text',
    apiKey: 'text',
    active: 'checkbox',
    deployed: 'checkbox',
    functions: 'functions[]',
    users: 'users[]'
  },

  projects: {
    name: 'text',
    description: 'richText',
    active: 'checkbox',
    status: 'Draft | Active | Archived',
    users: 'users[]',
    functions: 'functions[]',
    metadata: 'json',
    config: 'json'
  },

  // Function-related entities
  functions: {
    name: 'text',
    description: 'richText',
    deployment: 'Dev | Test | Prod',
    active: 'checkbox',
    output: 'Object | Text',
    modelGroup: 'modelGroups',
    code: 'json',
    workflows: 'workflows[]',
    functionCalls: '<-functionCalls.function',
    evals: 'evals[]',
    prompts: 'prompts[]',
    projects: '<-projects.functions'
  },

  functionCalls: {
    function: 'functions',
    model: 'models',
    input: 'json',
    output: 'json',
    status: 'Pending | Running | Completed | Failed',
    cost: 'number',
    tokens: 'json',
    duration: 'number',
    meta: 'json',
    data: 'data[]',
    workflow: 'workflowCalls',
    // Removed useAsTitle setting to avoid field existence issues
  },

  // Model-related entities
  modelGroups: {
    name: 'text',
    family: 'text',
    version: 'text',
    active: 'checkbox',
    models: '<-models.modelGroup',
    functions: '<-functions.modelGroup'
  },

  models: {
    name: 'text',
    description: 'text',
    modelGroup: 'modelGroups',
    provider: 'providers',
    family: 'text',
    version: 'text',
    active: 'checkbox',
    architecture: 'json',
    pricing: 'json',
    capabilities: 'json',
    functionCalls: '<-functionCalls.model'
  },

  providers: {
    name: 'text',
    description: 'richText',
    active: 'checkbox',
    endpoint: 'text',
    apiUrl: 'text',
    apiKey: 'text',
    organizationId: 'text',
    authType: 'apiKey | oauth | bearer | none',
    config: 'json',
    headers: 'json',
    tools: 'json',
    models: '<-models.provider'
  },

  // Schema-related entities
  schemas: {
    name: 'text',
    schema: 'json',
    schemaYaml: 'code',
    type: 'json | typescript | openai',
    version: 'text',
    functions: '<-functions.schema',
    models: 'models[]'
  },

  // Data-related entities
  data: {
    dataset: 'datasets',
    content: 'text',
    format: 'Text | JSON | Blob',
    createdAt: 'date',
    updatedAt: 'date',
    extractedFrom: 'text',
    embeddingType: 'text',
    embeddingDim: 'number',
    data: 'json',
    functionCalls: 'functionCalls[]'
  },

  datasets: {
    name: 'text',
    description: 'textarea',
    source: 'text',
    imported: 'date',
    version: 'text',
    format: 'Text | JSON | CSV | Images | Mixed',
    // collection: 'text',
    metadata: 'json',
    data: '<-data.dataset',
    evals: '<-evals.dataset'
  },

  // Evaluation-related entities
  evals: {
    name: 'text',
    description: 'richText',
    type: 'Accuracy | Performance | Robustness | Safety | Custom',
    method: 'text',
    metric: 'text',
    dataset: 'datasets',
    functions: 'functions[]',
    evalRuns: '<-evalRuns.eval'
  },

  evalRuns: {
    eval: 'evals',
    model: 'models',
    function: 'functions',
    dataset: 'datasets',
    metrics: 'json',
    summary: 'json',
    status: 'Pending | Running | Completed | Failed',
    results: '<-evalResults.evalRun'
  },

  evalResults: {
    evalRun: 'evalRuns',
    metrics: 'json',
    score: 'number',
    pass: 'checkbox',
    result: 'json',
    details: 'json'
  },

  // Workflow-related entities
  workflows: {
    name: 'text',
    description: 'richText',
    deployed: 'checkbox',
    active: 'checkbox',
    steps: 'json',
    functions: 'functions[]',
    workflowCalls: '<-workflowCalls.workflow'
  },

  workflowCalls: {
    workflow: 'workflows',
    input: 'json',
    output: 'json',
    timestamp: 'date',
    status: 'Pending | Running | Completed | Failed',
    error: 'text',
    duration: 'number',
    success: 'checkbox',
    logs: 'json',
    metadata: 'json',
    functionCalls: 'functionCalls[]',
    steps: 'array'
  },

  // Templates and prompts
  prompts: {
    name: 'text',
    content: 'code',
    description: 'richText',
    version: 'text',
    template: 'checkbox',
    category: 'text',
    functions: 'functions[]',
    variables: 'array',
    metadata: 'json'
  },

}, {
  admin: {
    // Group collections under 'Core' heading
    Core: {
      users: [
        ['name', 'email', 'password'],
        ['firstName', 'lastName'],
        ['active', 'role', 'avatar'],
        ['permissions', 'preferences'],
      ],
      tenants: [
        ['name', 'domain'],
        ['apiKey', 'active', 'deployed'],
      ],
      projects: [
        ['name', 'description'],
        ['active', 'status'],
      ]
    },
    // Group collections under 'Functions' heading
    Functions: {
      functions: [
        ['name', 'description'],
        ['active', 'deployment', 'output'],
        ['modelGroup', 'code'],
      ],
      functionCalls: [
        ['function', 'model', 'status'],
        ['input', 'output'],
        ['cost', 'tokens', 'duration'],
      ]
    },
    // Group collections under 'Models' heading
    Models: {
      modelGroups: [
        ['name', 'family', 'version'],
        ['active'],
      ],
      models: [
        ['name', 'description'],
        ['modelGroup', 'provider', 'family', 'version'],
        ['active', 'architecture', 'pricing', 'capabilities'],
      ],
      providers: [
        ['name', 'description'],
        ['active', 'endpoint', 'apiUrl'],
        ['apiKey', 'organizationId', 'authType'],
      ]
    },
    // Group collections under 'Evaluation' heading
    Evaluation: {
      evals: [
        ['name', 'type', 'method', 'metric'],
        ['description', 'dataset'],
      ],
      evalRuns: [
        ['eval', 'model', 'function', 'dataset'],
        ['metrics', 'summary', 'status'],
      ],
      evalResults: [
        ['evalRun', 'score', 'pass'],
        ['metrics', 'result', 'details'],
      ]
    }
  }
})

console.log(collections)

export default collections;