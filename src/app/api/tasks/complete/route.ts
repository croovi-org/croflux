import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { taskId } = await request.json()
    
    if (!taskId) {
      return NextResponse.json({ error: "taskId required" }, { status: 400 })
    }

    const supabase = await createClient()
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
      .from("tasks")
      .update({ completed: true, updated_at: new Date().toISOString() })
      .eq("id", taskId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: taskRow } = await supabase
      .from("tasks")
      .select("milestone_id")
      .eq("id", taskId)
      .single()

    const projectId = taskRow?.milestone_id
      ? (await supabase
          .from("milestones")
          .select("project_id")
          .eq("id", taskRow.milestone_id)
          .single()
        ).data?.project_id ?? null
      : null

    const userId = user.id
    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split("T")[0]

    try {
      await supabase
        .from("activity_log")
        .insert({
          user_id: userId,
          task_completed: true,
          timestamp: new Date().toISOString(),
          project_id: projectId,
        })
    } catch (err) {
      console.error("activity_log write failed:", err)
    }

    let currentWeeklyTasksCompleted = 0
    let currentStreak = 0
    let userSnapshotLoaded = false

    try {
      const { data: currentUser } = await serviceSupabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()

      currentWeeklyTasksCompleted = currentUser?.weekly_tasks_completed ?? 0
      currentStreak = currentUser?.streak ?? 0
      userSnapshotLoaded = true
    } catch (err) {
      console.error("users select failed:", err)
    }

    let nextStreak = currentStreak
    let shouldUpdateStreak = false

    try {
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

        nextStreak = yesterdayLogs && yesterdayLogs.length > 0
          ? currentStreak + 1
          : 1
        shouldUpdateStreak = true
      }
    } catch (err) {
      console.error("streak calculation failed:", err)
    }

    try {
      const updates: {
        weekly_tasks_completed?: number
        streak?: number
      } = {}

      if (userSnapshotLoaded) {
        updates.weekly_tasks_completed = currentWeeklyTasksCompleted + 1
      }

      if (shouldUpdateStreak) {
        updates.streak = nextStreak
      }

      if (Object.keys(updates).length > 0) {
        await serviceSupabase
          .from("users")
          .update(updates)
          .eq("id", userId)
      }
    } catch (err) {
      console.error("users update failed:", err)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    )
  }
}
