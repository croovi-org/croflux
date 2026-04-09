import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
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

    const { error } = await supabase
      .from("tasks")
      .update({ completed: true })
      .eq("id", taskId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const userId = user.id

    void Promise.allSettled([
      (async () => {
        try {
          await supabase
            .from("activity_log")
            .insert({
              user_id: userId,
              task_completed: true,
              timestamp: new Date().toISOString()
            })
        } catch (err) {
          console.error("activity_log write failed:", err)
        }
      })(),
      (async () => {
        try {
          await supabase.rpc("increment_weekly_tasks", { uid: userId })
        } catch (err) {
          console.error("increment_weekly_tasks rpc failed:", err)
        }
      })(),
      (async () => {
        try {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split("T")[0]
          const today = new Date().toISOString().split("T")[0]

          const { data: todayLogs } = await supabase
            .from("activity_log")
            .select("id")
            .eq("user_id", userId)
            .gte("timestamp", today + "T00:00:00.000Z")
            .lt("timestamp", today + "T23:59:59.999Z")
            .limit(2)

          if (!todayLogs || todayLogs.length <= 1) {
            const { data: yesterdayLogs } = await supabase
              .from("activity_log")
              .select("id")
              .eq("user_id", userId)
              .gte("timestamp", yesterdayStr + "T00:00:00.000Z")
              .lt("timestamp", yesterdayStr + "T23:59:59.999Z")
              .limit(1)

            const { data: currentUser } = await supabase
              .from("users")
              .select("streak")
              .eq("id", userId)
              .single()

            const currentStreak = currentUser?.streak ?? 0
            const newStreak = yesterdayLogs && yesterdayLogs.length > 0
              ? currentStreak + 1
              : 1

            await supabase
              .from("users")
              .update({ streak: newStreak })
              .eq("id", userId)
          }
        } catch (err) {
          console.error("streak update failed:", err)
        }
      })(),
      (async () => {
        try {
          const { data: currentUser } = await supabase
            .from("users")
            .select("weekly_tasks_completed")
            .eq("id", userId)
            .single()

          await supabase
            .from("users")
            .update({
              weekly_tasks_completed: (currentUser?.weekly_tasks_completed ?? 0) + 1
            })
            .eq("id", userId)
        } catch (err) {
          console.error("direct weekly_tasks_completed update failed:", err)
        }
      })(),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    )
  }
}
