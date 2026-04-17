import { createClient } from "@/lib/supabase/server"
import { completeTask } from "@/lib/tasks/completeTask"
import { ensureValidGoogleAccessToken, getSupabaseAdmin } from "@/lib/calendar/google"
import { completeGoogleTask } from "@/lib/googleTasks"
import { NextResponse } from "next/server"

async function handleMove(request: Request) {
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

    if (completed) {
      const result = await completeTask({
        userId: user.id,
        taskId,
        source: "board",
      })

      try {
        if (result.task.googleTaskId && result.task.googleTasklistId) {
          const supabaseAdmin = getSupabaseAdmin()
          const auth = await ensureValidGoogleAccessToken(user.id, supabaseAdmin)

          if (auth.connected && auth.accessToken) {
            await completeGoogleTask(
              auth.accessToken,
              result.task.googleTasklistId,
              result.task.googleTaskId,
            )
          }
        }
      } catch (err) {
        console.error("google tasks completion sync failed:", err)
      }
    } else {
      const { error } = await supabase
        .from("tasks")
        .update({ completed: false, updated_at: new Date().toISOString() })
        .eq("id", taskId)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  return handleMove(request)
}

export async function POST(request: Request) {
  return handleMove(request)
}
