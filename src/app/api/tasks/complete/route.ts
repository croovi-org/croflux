import { createClient } from "@/lib/supabase/server"
import { completeTask } from "@/lib/tasks/completeTask"
import { ensureValidGoogleAccessToken, getSupabaseAdmin } from "@/lib/calendar/google"
import { completeGoogleTask } from "@/lib/googleTasks"
import { NextResponse } from "next/server"

async function handleComplete(request: Request) {
  try {
    const { taskId } = await request.json()
    
    if (!taskId) {
      return NextResponse.json({ error: "taskId required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await completeTask({
      userId: user.id,
      taskId,
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

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  return handleComplete(request)
}

export async function POST(request: Request) {
  return handleComplete(request)
}
