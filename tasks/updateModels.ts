import type { TaskConfig, TaskHandler } from 'payload'

export const updateModels: TaskConfig<'updateModels'> = {
  slug: 'updateModels',
  outputSchema: [
    { name: 'success', type: 'checkbox' },
  ],
  handler: async ({ input, job, req }) => {
    console.log('updateModels', input, job, req)
    // fetch latest models from: https://openrouter.ai/api/v1/models
    return {
      output: {
        success: true,
      },
    }
  },
}
