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

  const start = Date.now()
  const functionPromise = payload.find({
    collection: 'functions',
    where: {
      name: {
        equals: functionName
      }
    }
  })
  const data = await generateObject({ functionName, input, schema, settings })
  const { object, reasoning, model, id, provider } = data
  const duration = Date.now() - start

  const functionDocs = await functionPromise

  waitUntil(payload.create({
    collection: 'completions',
    data: {
      tenant: auth.user?.tenants?.[0]?.id || 'default',
      function: functionDocs.docs[0].id,
      output: object,
      input: input,
      functionName,
      schema,
      debug: { body, data },
      seed: settings?.seed,
      model: model,
      reasoning,
      provider,
      requestId: id,
      duration,
    } 
  }).then(console.log))

  return Response.json({ model, data: object, reasoning })
}