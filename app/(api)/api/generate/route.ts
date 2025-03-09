import config from 'payload.config'
import { getPayload } from 'payload'
import generateObject from '@/lib/generateObject'
import { waitUntil } from '@vercel/functions'

export const maxDuration = 300

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const auth = await payload.auth(request)
  console.log(auth.user)
  if (!auth.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { functionName, args, schema, settings } = body
  console.log({ body })
  const data = await generateObject(body).catch(e => ({ error: e.message }))
  const { object, reasoning } = data
  const model = data.response?.modelId
  const requestId = data.response?.id
  waitUntil(payload.create({
    collection: 'completions',
    data: {
      tenant: auth.user?.tenants?.[0]?.id || 'default',
      function: functionName,
      output: object,
      input: body,
      debug: data,
      seed: settings?.seed,
      model: model,
      requestId: requestId,
    } 
  }).then(console.log))
  return Response.json({ model, data: object, reasoning })
}