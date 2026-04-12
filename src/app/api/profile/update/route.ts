import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Only allow these fields to be updated
    const allowedFields = [
      "first_name", "last_name", "phone", "gender", "date_of_birth",
      "location", "timezone", "role", "github", "twitter", "instagram",
      "bio", "personal_website", "linkedin", "avatar_url"
    ]

    const updates: Record<string, string | null> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field] ?? null
      }
    }

    // Also update the name field to keep it in sync
    if (updates.first_name !== undefined || updates.last_name !== undefined) {
      const { data: current } = await supabase
        .from("users")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single()

      const firstName = updates.first_name ?? current?.first_name ?? ""
      const lastName = updates.last_name ?? current?.last_name ?? ""
      updates.name = [firstName, lastName].filter(Boolean).join(" ") || null
    }

    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await serviceSupabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    )
  }
}
