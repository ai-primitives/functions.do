import config from 'payload.config'
import { getPayload } from 'payload'
import { waitUntil } from '@vercel/functions'
import { NextApiRequest } from 'next'
import crypto from 'crypto'
import generateObject from '@/lib/generateObject'
// import { generateObject, generateText } from 'ai'
import { wrapLanguageModel } from 'ai'
import { createOpenAI, openai } from '@ai-sdk/openai'
import fetchObject from '@/lib/fetchObject'
// import { openrouter } from '@openrouter/ai-sdk-provider'
import yaml from 'yaml'
import { decode } from 'punycode'

export const maxDuration = 800



export const GET = async (request: Request, { params }: { params: Promise<{ slug: string }>; searchParams: Promise<{ [key: string]: string | string[] }> }) => {
  
  const payload = await getPayload({ config })

  const { origin, hostname, searchParams } = new URL(decodeURI(decode(request.url)))

  const api = {
    admin: origin + '/admin',
    api: origin + '/api',
    functions: origin + '/functions',
    models: origin + '/models',
    evaluation: origin + '/evaluation',
  }


  const auth = await payload.auth(request)
  console.log(auth.user?.email)
  // const tenant = auth.user?.tenants?.[0]?.id
  const tenant = hostname
  
  const start = Date.now()

  return Response.json({ api, message: 'Hello, world!', tenant, user: auth.user?.email })
}
