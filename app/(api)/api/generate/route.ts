import config from 'payload.config'
import { getPayload } from 'payload'
import generateObject from '@/lib/generateObject'
import { waitUntil } from '@vercel/functions'

export const maxDuration = 300

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const auth = await payload.auth(request)
  console.log(auth.user)
  // if (!auth.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { functionName, input, schema, settings } = body
  console.log({ body })
  const data = await generateObject({ functionName, input, schema, settings })
  const { object, reasoning, model, id, provider } = data
  waitUntil(payload.create({
    collection: 'completions',
    data: {
      tenant: auth.user?.tenants?.[0]?.id || 'default',
      function: functionName,
      output: object,
      input: input,
      debug: { body, data },
      seed: settings?.seed,
      model: model,
      reasoning,
      // provider: data.provider,
      requestId: id,
    } 
  }).then(console.log))
  return Response.json({ model, data: object, reasoning })
}