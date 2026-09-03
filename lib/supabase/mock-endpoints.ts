import type { MockEndpoint, MockEndpointDraft } from "@/lib/mock-endpoints"
import type { MockEndpointRow } from "@/lib/db/types"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { getLearner } from "@/lib/supabase/progress"

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

export async function listOwnMockEndpoints(): Promise<MockEndpoint[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  const client = createSupabaseBrowserClient()
  if (!client) {
    return []
  }

  const user = await getLearner(client)
  if (!user) {
    return []
  }

  const { data, error } = await client
    .from("mock_endpoints")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return (data as MockEndpointRow[] | null)?.map(fromRow) ?? []
}

export async function saveMockEndpoint(
  draft: MockEndpointDraft
): Promise<MockEndpoint> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.")
  }

  const client = createSupabaseBrowserClient()
  if (!client) {
    throw new Error("Supabase is not configured.")
  }

  const user = await getLearner(client)
  if (!user) {
    throw new Error("Sign in to save a mock endpoint.")
  }

  const { data, error } = await client
    .from("mock_endpoints")
    .upsert(
      {
        user_id: user.id,
        slug: draft.slug,
        method: draft.method,
        status_code: draft.statusCode,
        response_body: draft.responseBody,
      },
      { onConflict: "slug,method" }
    )
    .select("*")
    .single()

  if (error) {
    if (error.code === "23505") {
      throw new Error("That slug and method are already taken.")
    }
    throw error
  }

  return fromRow(data as MockEndpointRow)
}

export async function deleteMockEndpoint(id: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.")
  }

  const client = createSupabaseBrowserClient()
  if (!client) {
    throw new Error("Supabase is not configured.")
  }

  const user = await getLearner(client)
  if (!user) {
    throw new Error("Sign in to delete a mock endpoint.")
  }

  const { error } = await client
    .from("mock_endpoints")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    throw error
  }
}
