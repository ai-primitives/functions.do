import generateObject from "@/lib/generateObject"


export async function POST(request: Request) {
  const body = await request.json()
  console.log({ body })
  const object = await generateObject(body).catch(e => ({ error: e.message }))
  return Response.json({ object })
}