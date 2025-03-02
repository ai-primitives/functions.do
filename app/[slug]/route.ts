import configPromise from 'payload.config'
import { getPayload } from 'payload'
import { waitUntil } from '@vercel/functions'
import { NextApiRequest } from 'next'
import crypto from 'crypto'

import { generateObject, generateText } from 'ai'
import { openrouter } from '@openrouter/ai-sdk-provider'

export const GET = async (request: Request, { params }: { params: Promise<{ slug: string }>; searchParams: Promise<{ [key: string]: string | string[] }> }) => {
  const payload = await getPayload({
    config: configPromise,
  })

  const start = Date.now()
  const query = Object.fromEntries(new URL(request.url).searchParams) || {}
  console.log(query)

  const { slug } = await params
  const { seed, model, input, system, prompt, ...args } = query

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
        ...(seed && typeof seed === 'string' ? { seed: { equals: parseInt(seed) } } : {}),
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

  // if function exists but no completion, generate completion
  if (func.docs.length > 0) {
    const completionResult = await generateObject({
      // model: openrouter('openrouter/auto'),
      model: openrouter('google/gemini-2.0-flash-001'),
      prompt: `${slug}(${inputString})`,
      output: 'no-schema'
    })
    waitUntil(payload.create({
      collection: 'completions',
      data: {
        hash: inputHash,
        function: func.docs[0],
        input: inputString,
        output: completionResult.object,
      },
    }))
    return Response.json({ cacheHit: false, cacheLatency, func: func.docs[0], completion: completionResult, input, inputHash, args, query })
  }

  // if no function or completion, generate function and completion

  const [completionResult, funcResult] = await Promise.all([
    generateObject({
      // model: openrouter('openrouter/auto'),
      model: openrouter('google/gemini-2.0-flash-001'),
      prompt: `${slug}(${inputString})`,
      output: 'no-schema'
    }),
    payload.create({
      collection: 'functions',
      data: {
        tenant: 'default',
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
      hash: inputHash,
      function: func.docs[0],
      input: inputString,
      output: completionResult.object,
    },
  }))

  return Response.json({ completion: completionResult, func: funcResult, cacheHit: false, cacheLatency, latency, completionLatency, input, inputHash, args, query })
}
