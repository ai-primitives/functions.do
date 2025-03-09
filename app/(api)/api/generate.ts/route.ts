import generateObject from "@/lib/generateObject"


export async function POST(request: Request) {
  const body = await request.json()
  const object = await generateObject(body)
  return Response.json({ object })
}