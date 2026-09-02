import { resolveDummyStatus } from "@/lib/dummy-api"

const catalog = [
  { id: "order-1001", sku: "TRAIL-PACK", price: 64 },
  { id: "order-1002", sku: "MERINO-SOCKS", price: 12 },
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
          error: "Internal Server Error",
          message: "The dummy API could not parse the JSON payload.",
        },
        { status: 500 }
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
        message: "The dummy API simulated a server crash.",
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
