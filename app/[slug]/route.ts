import configPromise from 'payload.config'
import { getPayload } from 'payload'
import { waitUntil } from '@vercel/functions'
import { NextApiRequest } from 'next'
import crypto from 'crypto'

import { generateObject, generateText } from 'ai'
import { wrapLanguageModel } from 'ai'
import { createOpenAI} from '@ai-sdk/openai'
import { openrouter } from '@openrouter/ai-sdk-provider'



export const maxDuration = 300

export const GET = async (request: Request, { params }: { params: Promise<{ slug: string }>; searchParams: Promise<{ [key: string]: string | string[] }> }) => {
  const payload = await getPayload({
    config: configPromise,
  })

  const auth = await payload.auth(request)
  console.log(auth.user)
  // const tenant = auth.user?.tenants?.[0]?.id
  const tenant = 'default'

  const start = Date.now()
  const query = Object.fromEntries(new URL(request.url).searchParams) || {}
  console.log(query)

  const { slug } = await params
  const { seed: seedString, model, input, system, prompt, ...args } = query
  const seed = seedString ? parseInt(seedString) : undefined

  // get sha1 hash of input
  const inputString = typeof input === 'string' ? input : JSON.stringify(args)
  const inputHash = crypto.createHash('sha1').update(inputString).digest('hex')

  // check if completion and/or function exists
  const [completion, func] = await Promise.all([
    payload.find({
      collection: 'completions',
      where: {
        function: { equals: slug },
        hash: { equals: inputHash },
        ...(seed ? { seed: { equals: seed } } : {}),
        ...(model && typeof model === 'string' ? { model: { equals: model } } : {}),
      },
    }),
    payload.find({
      collection: 'functions',
      where: {
        name: { equals: slug },
      },
    }),
  ])

  const cacheLatency = Date.now() - start

  // if completion exists, return it
  if (completion.docs.length > 0) {
    return Response.json({ cacheHit: true, cacheLatency, completion: completion.docs[0], function: func.docs[0], input, inputHash, args, query })
  }

  // const languageModel = createOpenAI({
  //   apiKey: process.env.OPENROUTER_API_KEY,
  //   baseURL: 'https://openrouter.ai/api/v1',
  // })(model || 'openrouter/auto', { reasoningEffort: 'high' })
  // })(model || 'google/gemini-2.0-flash-001')

  // const languageModel = openrouter(model || 'google/gemini-2.0-flash-001')
  const languageModel = openrouter('openrouter/auto')

  // const languageModel = wrapLanguageModel({
  //   model: openrouter(model || 'google/gemini-2.0-flash-001'),
  //   middleware: [
  //     { 
  //       wrapGenerate: async ({ doGenerate, params }) => {
  //         console.log('doGenerate called');
  //         console.log(`params: ${JSON.stringify(params, null, 2)}`);
      
  //         const result = await doGenerate();

  //         console.log(result)
    
      
  //         return result
  //       },
  //     }
  //   ]
  // })

  // if function exists but no completion, generate completion
  if (func.docs.length > 0) {
    const completionResult = await generateObject({
      // model: openrouter('openrouter/auto'),
      model: languageModel,
      system,
      prompt: `${slug}(${inputString})`,
      output: 'no-schema'
    })
    waitUntil(payload.create({
      collection: 'completions',
      data: {
        tenant,
        hash: inputHash,
        function: func.docs[0],
        input: input ? input : args,
        output: completionResult.object,
        seed,
      },
    }))
    return Response.json({ cacheHit: false, cacheLatency, func: func.docs[0], completion: completionResult, input, inputHash, args, query })
  }

  // if no function or completion, generate function and completion

  const [completionResult, funcResult] = await Promise.all([
    generateObject({
      // model: openrouter('openrouter/auto'),
      system,
      model: languageModel,
      // reasoning: { effort: 'high' },
      prompt: `${slug}(${inputString})`,
      output: 'no-schema'
    }),
    payload.create({
      collection: 'functions',
      data: {
        tenant,
        name: slug,
        output: 'Object'
      },
    }),
  ])

  const latency = Date.now() - start
  const completionLatency = latency - cacheLatency


  waitUntil(payload.create({
    collection: 'completions',
    data: {
      tenant,
      hash: inputHash,
      function: func.docs[0],
      input: input ? input : args,
      output: completionResult.object,
      seed,
    },
  }))

  return Response.json({ completion: completionResult, func: funcResult, cacheHit: false, cacheLatency, latency, completionLatency, input, inputHash, args, query })
}
