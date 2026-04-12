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
    let userSnapshotLoaded = false

    try {
      const { data: currentUser } = await serviceSupabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()

      currentWeeklyTasksCompleted = currentUser?.weekly_tasks_completed ?? 0
      userSnapshotLoaded = true
    } catch (err) {
      console.error("users select failed:", err)
    }

    // Recalculate streak fresh based on consecutive days of activity
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data: recentActivity } = await serviceSupabase
      .from("activity_log")
      .select("timestamp")
      .eq("user_id", user.id)
      .gte("timestamp", new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order("timestamp", { ascending: false })

    const activeDays = new Set(
      (recentActivity ?? []).map((entry) => {
        const d = new Date(entry.timestamp)
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      })
    )

    let streak = 0
    const checkDate = new Date(today)
    while (activeDays.has(checkDate.getTime())) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    }

    await serviceSupabase
      .from("users")
      .update({ streak })
      .eq("id", user.id)

    try {
      const updates: {
        weekly_tasks_completed?: number
      } = {}

      if (userSnapshotLoaded) {
        updates.weekly_tasks_completed = currentWeeklyTasksCompleted + 1
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
