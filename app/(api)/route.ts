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
import { toUnicode } from 'punycode'

export const maxDuration = 800



export const GET = async (request: Request, { params }: { params: Promise<{ slug: string }>; searchParams: Promise<{ [key: string]: string | string[] }> }) => {
  
  const payload = await getPayload({ config })

  let { origin, hostname, searchParams } = new URL(request.url)

  try {
    // origin = origin.replace(hostname, decode(hostname))
    hostname = toUnicode(hostname)
  } catch (error) {
    console.log(error)
  }


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

  const headers = Object.fromEntries(request.headers)

  return Response.json({ api, message: 'Hello, world!', tenant, user: auth.user?.email, hostname, headers }, { headers: { 'Content-Type': 'application/json; charset=utf-8' } })
}
