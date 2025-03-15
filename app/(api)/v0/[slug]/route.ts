import configPromise from 'payload.config'
import { getPayload } from 'payload'
import { waitUntil } from '@vercel/functions'
import { NextApiRequest } from 'next'
import crypto from 'crypto'

import { generateObject, generateText } from 'ai'
import { wrapLanguageModel } from 'ai'
import { createOpenAI, openai } from '@ai-sdk/openai'
// import { openrouter } from '@openrouter/ai-sdk-provider'

const openrouter = createOpenAI({
  baseURL: process.env.AI_GATEWAY_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    'HTTP-Referer': 'https://functions.do', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': 'Functions.do - Simple & Fast Strongly-Typed AI Functions', // Optional. Site name for rankings on openrouter.ai.
  }
})

export const maxDuration = 300

export const GET = async (request: Request, { params }: { params: Promise<{ slug: string }>; searchParams: Promise<{ [key: string]: string | string[] }> }) => {
  const payload = await getPayload({
    config: configPromise,
  })

  const { origin, hostname } = new URL(request.url)

  const auth = await payload.auth(request)
  console.log(auth.user)
  // const tenant = auth.user?.tenants?.[0]?.id
  const tenant = 'default'

  const start = Date.now()
  const query = Object.fromEntries(new URL(request.url).searchParams) || {}
  console.log(query)

  const { slug } = await params
  const { seed: seedString, temperature: temperatureString, model = 'google/gemini-2.0-flash-001', input, system, prompt, ...args } = query
  const seed = seedString ? parseInt(seedString) : 1
  const temperature = temperatureString ? parseFloat(temperatureString) : 1.0

  // get sha1 hash of input
  const inputString = typeof input === 'string' ? input : JSON.stringify(args)
  const inputHash = crypto.createHash('sha1').update(inputString).digest('hex')

  console.log({ inputString, inputHash })

  // check if completion and/or function exists
  const [completion, func] = await Promise.all([
    payload.find({
      collection: 'completions',
      depth: 0,
      where: {
        tenant: { equals: hostname },
        'function.name': { equals: slug },
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

  console.log({ completion, func })
  console.log(func)

  const cacheLatency = Date.now() - start
  console.log({ cacheLatency })

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
  // const languageModel = openrouter(model || 'anthropic/claude-3.7-sonnet')
  // const languageModel = openrouter('openrouter/auto')

  const languageModel = wrapLanguageModel({
    // model: openrouter(model || 'anthropic/claude-3.7-sonnet'),
    // model: openrouter(model || 'google/gemini-2.0-flash-001'),
    model: openrouter(model, { structuredOutputs: true }),
    middleware: [
      {
        transformParams: async (options) => {
          console.log({ transformParams: options})
          return options?.params
        },
        wrapGenerate: async ({ doGenerate, params }) => {
          console.log('doGenerate called')
          console.log(`params: ${JSON.stringify(params, null, 2)}`)

          const result = await doGenerate()

          console.log(result)

          // waitUntil(payload.create({
          //   collection: 'completions',
          //   data: {
          //     tenant,
          //     hash: inputHash,
          //     function: func.docs[0],
          //     input: input ? input : args,
          //     output: result.object,
          //     model: completionResult.response.modelId,
          //     requestId: completionResult.response.id,
          //     debug: completionResult as any,
          //     seed,
          //   },
          // }))

          return result
        },
      },
    ],
  })

  // if function exists but no completion, generate completion
  if (func.docs.length > 0) {
    const completionResult = await generateObject({
      // model: openrouter('openrouter/auto'),
      model: languageModel,
      providerOptions: {
        reasoning: {
          effort: 'high',
        },
      },
      system,
      prompt: `${slug}(${inputString})`,
      output: 'no-schema',
      seed,
      temperature,
      experimental_repairText: async ({ text, error }) => {
        // example: add a closing brace to the text
        console.log({ text, error })
        const repairedText = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
        console.log({ repairedText })
        return repairedText
      },
    })
    // waitUntil(
    //   payload.create({
    //     collection: 'completions',
    //     data: {
    //       tenant,
    //       hash: inputHash,
    //       function: func.docs[0],
    //       input: input ? input : args,
    //       output: completionResult.object,
    //       model: completionResult.response.modelId,
    //       requestId: completionResult.response.id,
    //       debug: completionResult as any,
    //       seed,
    //     },
    //   }),
    // )
    return Response.json({ cacheHit: false, cacheLatency, func: func.docs[0], completion: completionResult, input, inputHash, args, query })
  }

  // if no function or completion, generate function and completion

  const [completionResult, variantResult,
    // funcResult
    ] = await Promise.all([
    generateObject({
      // model: openrouter('openrouter/auto'),
      system,
      model: languageModel,
      providerOptions: {
        reasoning: {
          effort: 'high',
        },
        openai: {
          provider: {
            require_parameters: true
          }
        }
      },
      // reasoning: { effort: 'high' },
      prompt: `${slug}(${inputString})`,
      output: 'no-schema',
      seed,
      temperature,
      experimental_repairText: async ({ text, error }) => {
        console.log({ text, error })
        if (text === '') return '{}'
        const repairedText = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
        console.log({ repairedText })
        return repairedText
      },
    }),

    generateObject({
      // model: openrouter('openrouter/auto'),
      system,
      // model: openrouter('openai/gpt-4o-mini', { structuredOutputs: true }),
      model: openrouter('anthropic/claude-3.5-sonnet'),
      providerOptions: {
        reasoning: {
          effort: 'high',
        },
        openai: {
          provider: {
            require_parameters: true
          }
        }
      },
      // reasoning: { effort: 'high' },
      prompt: `${slug}(${inputString})`,
      output: 'no-schema',
      seed,
      temperature,
      experimental_repairText: async ({ text, error }) => {
        console.log({ text, error })
        if (text === '') return '{}'
        const repairedText = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
        console.log({ repairedText })
        return repairedText
      },
    }),
    // payload.create({
    //   collection: 'functions',
    //   data: {
    //     tenant: 'functions.do',
    //     name: slug,
    //     output: 'Object',
    //     // model,
    //   },
    // }),
  ])

  const latency = Date.now() - start
  const completionLatency = latency - cacheLatency

  waitUntil(
    payload.create({
      collection: 'completions',
      data: {
        tenant,
        hash: inputHash,
        function: func.docs[0],
        input: input ? input : args,
        output: completionResult.object,
        model: completionResult.response.modelId,
        requestId: completionResult.response.id,
        debug: completionResult as any,
        // reasoning: completionResult.,
        seed,
      },
    }),
  )

  const url = new URL(request.url)
  const { object, reasoning } = completionResult as any
  return Response.json({ function: slug, args, 
    links: {
      home: origin + '/api',
      // variant: origin + `/variant/${completionResult.response.id}`,
      // 
      next: url.toString()
    },
    data: object, variant: variantResult.object, 
    // control: object, variant: variantResult.object,
    // optionA: object, optionB: variantResult.object,
    feedback: { 
      // 'Prefer Control': origin + 'feedback?prefer=' + completionResult.response.id,
      // 'Prefer Variant': origin + 'feedback?variant=' + completionResult.response.id,
      'Control is better': origin + `/feedback/${completionResult.response.id.slice(16)}?prefer=control`,
      'Variant is better': origin + `/feedback/${completionResult.response.id.slice(16)}?prefer=variant`,
      'Both are good': origin + `/feedback/${completionResult.response.id.slice(16)}?both=good`,
      'Both are bad': origin + `/feedback/${completionResult.response.id.slice(16)}?both=bad`,
    }, latency }, { headers: { 'Content-Type': 'application/json; charset=utf-8' }})
  // return Response.json({ completion: completionResult, 
  //   // func: funcResult, 
  //   cacheHit: false, cacheLatency, latency, completionLatency, input, inputHash, args, query })
}
