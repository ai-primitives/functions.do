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

const openrouter = createOpenAI({
  baseURL: process.env.AI_GATEWAY_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    'HTTP-Referer': 'https://functions.do', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': 'Functions.do - Simple & Fast Strongly-Typed AI Functions', // Optional. Site name for rankings on openrouter.ai.
  }
})

export const maxDuration = 800

export const GET = async (request: Request, { params }: { params: Promise<{ slug: string }>; searchParams: Promise<{ [key: string]: string | string[] }> }) => {
  
  const payload = await getPayload({ config })

  const { origin, hostname, searchParams } = new URL(request.url)
  const auth = await payload.auth(request)
  console.log(auth.user?.email)
  // const tenant = auth.user?.tenants?.[0]?.id
  const tenant = hostname
  
  const start = Date.now()
  const { system, prompt, seed, temperature, topK, topP, model = 'google/gemini-2.0-flash-001', variant, ...rest } = Object.fromEntries(searchParams) || {}

  console.log(rest)

  const { slug } = await params
  // match `listBlogPostTitles(topic:puppies)` function name and args for yaml flow style parse
  const functionName = decodeURIComponent(slug.split('(')[0])
  let args = slug.split('(')[1].split(')')[0]
  if (args[0] !== '{') args = '{' + args + '}'
  const inputArgs = yaml.parse(args.replaceAll('_', ' '))
  const input = args ? inputArgs : rest

  const [completionResult, variantResult] = await Promise.all([
    // fetchObject({ functionName, input, model, settings: { system, prompt, seed, temperature, topK, topP } }),
    generateObject({ functionName, input, model, settings: { system, prompt, seed, temperature, topK, topP } }),
    // TODO: Figure out a more effective way to create & test variants
    generateObject({ functionName, input, model: variant, settings: { system, prompt, seed: 1, temperature, topK, topP } })
    // fetchObject({ functionName, input, model: variant, settings: { system, prompt, seed: 1, temperature, topK, topP } })
  ])

  const latency = Date.now() - start

  const url = new URL(request.url.replaceAll('%20', '+'))
  // const { object, reasoning } = completionResult as any
  return Response.json({ function: functionName, args: input, 
    links: {
      home: origin + '/api',
      // variant: origin + `/variant/${completionResult.response.id}`,
      // 
      next: url.toString()
    },
    data: completionResult.object, variant: variantResult.object, 
    // control: object, variant: variantResult.object,
    // optionA: object, optionB: variantResult.object,
    feedback: { 
      // 'Prefer Control': origin + 'feedback?prefer=' + completionResult.response.id,
      // 'Prefer Variant': origin + 'feedback?variant=' + completionResult.response.id,
      'Control is better': origin + `/feedback/${completionResult.id.slice(16)}?prefer=control`,
      'Variant is better': origin + `/feedback/${completionResult.id.slice(16)}?prefer=variant`,
      'Both are good': origin + `/feedback/${completionResult.id.slice(16)}?both=good`,
      'Both are bad': origin + `/feedback/${completionResult.id.slice(16)}?both=bad`,
    }, latency }, { headers: { 'Content-Type': 'application/json; charset=utf-8' }})
  // return Response.json({ completion: completionResult, 
  //   // func: funcResult, 
  //   cacheHit: false, cacheLatency, latency, completionLatency, input, inputHash, args, query })
}
