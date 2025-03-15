import configPromise from 'payload.config'
import { getPayload } from 'payload'
import { waitUntil } from '@vercel/functions'

export const GET = async () => {
  const payload = await getPayload({
    config: configPromise,
  })

  const start = Date.now()

  const data = await payload.find({
    collection: 'users',
  })

  // const results = await payload.jobs.
  const job = await payload.jobs.queue({
    task: 'updateModels',
    input: {},
  })
  const queueTime = Date.now() - start

  waitUntil(payload.jobs.runByID({ id: job.id }))
  // const results = await payload.jobs.runByID({ id: job.id })
  // const runTime = (Date.now() - start) - queueTime

  return Response.json({ job, queueTime })
}
