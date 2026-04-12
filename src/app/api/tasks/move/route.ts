import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { taskId, completed } = await request.json()

    if (!taskId || typeof completed !== "boolean") {
      return NextResponse.json({ error: "taskId and completed required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
      .from("tasks")
      .update({ completed })
      .eq("id", taskId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (completed) {
      Promise.allSettled([
        supabase.from("activity_log").insert({
          user_id: user.id,
          task_completed: true,
          timestamp: new Date().toISOString()
        }),
        supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single()
          .then(({ data }) =>
            supabase
              .from("users")
              .update({ weekly_tasks_completed: (data?.weekly_tasks_completed ?? 0) + 1 })
              .eq("id", user.id)
          )
      ])
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    )
  }
}
