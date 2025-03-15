import configPromise from 'payload.config'
import { getPayload } from 'payload'

export const GET = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const payload = await getPayload({
    config: configPromise,
  })

  const { id } = await params

  const { origin, pathname, searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || '1')
  const limit = Number(searchParams.get('limit') || '10')

  // const data = await payload.find({
  //   collection: 'functions',
  //   page,
  //   limit,
  //   depth: 0,
  // })

  const args = Object.fromEntries(searchParams)

  const links = {
    // site: origin,
    home: `${origin}/api`,
    self: request.url,
    // next: page === data.totalPages ? undefined : `${origin}${pathname}?page=${page + 1}`,
    // prev: page === 1 ? undefined : `${origin}${pathname}?page=${page - 1}`,
    // first: page === 1 ? undefined : `${origin}${pathname}?page=1`,
    // last: page === data.totalPages ? undefined : `${origin}${pathname}?page=${data.totalPages}`,
  }

  return Response.json({ links, generation: id, ...args })
}
