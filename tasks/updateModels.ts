import type { TaskConfig } from 'payload'
import camelcaseKeys from 'camelcase-keys'

// TODO: look at refactoring to this endpoint for more details
// https://openrouter.ai/api/frontend/models/find?fmt=cards&order=newest
// https://openrouter.ai/api/frontend/models/find?fmt=cards&order=newest&supported_parameters=structured_outputs%2Cresponse_format
// https://openrouter.ai/api/frontend/models/find?fmt=cards&order=newest&supported_parameters=tools

export const updateModels: TaskConfig<'updateModels'> = {
  slug: 'updateModels',
  outputSchema: [
    { name: 'success', type: 'checkbox' },
    { name: 'message', type: 'text' },
    { name: 'count', type: 'number' },
  ],
  handler: async ({ input, job, req }) => {
    try {
      console.log('Fetching models from OpenRouter API')

      // Fetch models from OpenRouter API using fetch instead of axios
      const response = await fetch('https://openrouter.ai/api/v1/models')
      const data = await response.json()
      const models = data.data

      console.log(`Found ${models.length} models`)

      // Get the payload instance from req
      const { payload } = req

      // Process each model
      let count = 0
      for (const model of models) {
        try {
          // Convert snake_case keys to camelCase using camelcase-keys package
          const camelCaseModel = camelcaseKeys(model, { deep: true })
          console.log(camelCaseModel)
          camelCaseModel.id = camelCaseModel.id.replace('/','_')
          camelCaseModel.created = new Date(camelCaseModel.created * 1000)

          // Check if model already exists
          const existingModel = await payload.find({
            collection: 'models' as any,
            where: {
              id: {
                equals: camelCaseModel.id,
              },
            },
          })

          if (existingModel.docs.length > 0) {
            // Update existing model
            await payload.update({
              collection: 'models' as any,
              id: existingModel.docs[0].id,
              data: camelCaseModel,
            })
          } else {
            // Create new model
            await payload.create({
              collection: 'models' as any,
              data: camelCaseModel,
            })
          }

          count++
        } catch (modelError) {
          console.error(`Error processing model ${model.id}:`, modelError)
        }
      }

      return {
        output: {
          success: true,
          message: `Successfully processed ${count} models`,
          count,
        },
      }
    } catch (error) {
      console.error('Error updating models:', error)
      return {
        output: {
          success: false,
          message: error instanceof Error ? error.message : String(error),
          count: 0,
        },
      }
    }
  },
}
