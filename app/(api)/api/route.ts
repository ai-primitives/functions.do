import configPromise from 'payload.config'
import { getPayload } from 'payload'

export const GET = async (request: Request) => {
  const payload = await getPayload({
    config: configPromise,
  })

  const { origin, pathname, searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || '1')
  const limit = Number(searchParams.get('limit') || '10')

  const data = await payload.find({
    collection: 'functions',
    page,
    limit,
    depth: 0,
  })

  const links = {
    home: origin,
    next: page === data.totalPages ? undefined : `${origin}${pathname}?page=${page + 1}`,
    prev: page === 1 ? undefined : `${origin}${pathname}?page=${page - 1}`,
    first: page === 1 ? undefined : `${origin}${pathname}?page=1`,
    last: page === data.totalPages ? undefined : `${origin}${pathname}?page=${data.totalPages}`,
  }

  const functions = data.docs.map(({ id, ...rest }) => ({ id: `${origin}${pathname}/functions/${id}`, ...rest }))

  return Response.json({ links, functions })
}
