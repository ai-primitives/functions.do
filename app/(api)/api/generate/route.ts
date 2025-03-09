import config from 'payload.config'
import { getPayload } from 'payload'
import generateObject from '@/lib/generateObject'

export const maxDuration = 300

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const auth = await payload.auth(request)
  console.log(auth.user)
  if (!auth.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  console.log({ body })
  const object = await generateObject(body).catch(e => ({ error: e.message }))
  return Response.json({ object })
}