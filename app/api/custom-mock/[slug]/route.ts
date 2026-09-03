import { lookupMockEndpoint } from "@/lib/supabase/mock-endpoints-server"
import { isMockMethod } from "@/lib/mock-endpoints"

export const dynamic = "force-dynamic"

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

type RouteContext = {
  params: Promise<{ slug: string }>
}

function json(
  status: number,
  body: unknown,
  extraHeaders?: HeadersInit
) {
  return Response.json(body, {
    status,
    headers: { ...CORS, ...extraHeaders },
  })
}

async function serve(request: Request, context: RouteContext) {
  const { slug } = await context.params
  const method = request.method.toUpperCase()

  if (!isMockMethod(method)) {
    return json(405, {
      error: "Method Not Allowed",
      message: "This mock server accepts GET, POST, and PUT.",
    })
  }

  const result = await lookupMockEndpoint(slug, method)

  if (result.status === "unconfigured") {
    return json(503, {
      error: "Service Unavailable",
      message: "Mock endpoints are not configured on this server.",
    })
  }

  if (result.status === "error") {
    return json(503, {
      error: "Service Unavailable",
      message: "Could not load mock endpoints. Run the mock_endpoints migration.",
    })
  }

  if (result.status === "missing") {
    return json(404, {
      error: "Not Found",
      message: `No mock endpoint is registered for /api/custom-mock/${slug}.`,
    })
  }

  if (result.status === "method") {
    return json(
      405,
      {
        error: "Method Not Allowed",
        message: `${method} is not defined for ${slug}.`,
        allowed: result.methods,
      },
      { Allow: result.methods.join(", ") }
    )
  }

  return json(result.endpoint.statusCode, result.endpoint.responseBody)
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export function GET(request: Request, context: RouteContext) {
  return serve(request, context)
}

export function POST(request: Request, context: RouteContext) {
  return serve(request, context)
}

export function PUT(request: Request, context: RouteContext) {
  return serve(request, context)
}
