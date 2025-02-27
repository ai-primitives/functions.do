import configPromise from 'payload.config'
import { getPayload } from 'payload'

export const GET = async () => {
  const payload = await getPayload({
    config: configPromise,
  })

  const data = await payload.find({
    collection: 'users',
  })

  // const results = await payload.jobs.

  return Response.json(data)
}
