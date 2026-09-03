import "server-only"

import type { MockEndpoint } from "@/lib/mock-endpoints"
import type { MockEndpointRow } from "@/lib/db/types"
import { createSupabaseServerClient } from "@/lib/supabase/server"

function fromRow(row: MockEndpointRow): MockEndpoint {
  return {
    id: row.id,
    userId: row.user_id,
    slug: row.slug,
    method: row.method,
    statusCode: row.status_code,
    responseBody: row.response_body,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function lookupMockEndpoint(slug: string, method: string) {
  const client = await createSupabaseServerClient()
  if (!client) {
    return { status: "unconfigured" as const }
  }

  const { data, error } = await client
    .from("mock_endpoints")
    .select("*")
    .eq("slug", slug)
    .eq("method", method)
    .maybeSingle()

  if (error) {
    return { status: "error" as const, message: error.message }
  }

  if (!data) {
    const { data: sameSlug, error: slugError } = await client
      .from("mock_endpoints")
      .select("method")
      .eq("slug", slug)

    if (slugError) {
      return { status: "error" as const, message: slugError.message }
    }

    const methods = (sameSlug ?? []).map((row) => row.method)
    if (methods.length === 0) {
      return { status: "missing" as const }
    }

    return { status: "method" as const, methods }
  }

  return { status: "ok" as const, endpoint: fromRow(data as MockEndpointRow) }
}
