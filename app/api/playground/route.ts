import { resolveDummyStatus } from "@/lib/dummy-api"

const catalog = [
  { id: "order-1001", sku: "GENKI-HOODIE", name: "GENKI Hoodie", price: 64 },
  { id: "order-1002", sku: "GENKI-BEANIE", name: "GENKI Beanie", price: 12 },
]

export async function GET(request: Request) {
  const url = new URL(request.url)
  const status = resolveDummyStatus(null, url.searchParams)
  return dummyResponse(status, {
    method: "GET",
    query: Object.fromEntries(url.searchParams),
  })
}

export async function POST(request: Request) {
  const raw = await request.text()
  let payload: unknown = {}

  if (raw.trim()) {
    try {
      payload = JSON.parse(raw)
    } catch {
      return Response.json(
        {
          error: "Bad Request",
          message: "Send valid JSON. The playground stays on this page so you can fix the body and send it again.",
        },
        { status: 400 }
      )
    }
  }

  const status = resolveDummyStatus(payload)
  return dummyResponse(status, {
    method: "POST",
    received: payload,
  })
}

function dummyResponse(
  status: 200 | 404 | 500,
  extra: Record<string, unknown>
) {
  if (status === 404) {
    return Response.json(
      {
        error: "Not Found",
        message: "No resource matched the request.",
        ...extra,
      },
      { status: 404 }
    )
  }

  if (status === 500) {
    return Response.json(
      {
        error: "Internal Server Error",
        message: "The server could not complete this request.",
        ...extra,
      },
      { status: 500 }
    )
  }

  return Response.json(
    {
      ok: true,
      message: "Request succeeded.",
      catalog,
      ...extra,
    },
    { status: 200 }
  )
}
