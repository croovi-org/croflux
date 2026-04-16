import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { taskId, completed } = await request.json()

    if (!taskId || typeof completed !== "boolean") {
      return NextResponse.json({ error: "taskId and completed required" }, { status: 400 })
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
      .update({ completed, updated_at: new Date().toISOString() })
      .eq("id", taskId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Only log activity + update stats when marking complete (not when moving back to todo/inprogress)
    if (completed) {
      // Resolve project_id from task → milestone → project
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

      // Log to activity_log with project_id
      try {
        await supabase.from("activity_log").insert({
          user_id: user.id,
          task_completed: true,
          timestamp: new Date().toISOString(),
          project_id: projectId,
        })
      } catch (err) {
        console.error("activity_log write failed:", err)
      }

      // Recalculate streak from activity history
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

      await serviceSupabase.from("users").update({ streak }).eq("id", user.id)

      // Increment weekly_tasks_completed
      try {
        const { data: currentUser } = await serviceSupabase
          .from("users")
          .select("weekly_tasks_completed")
          .eq("id", user.id)
          .single()

        await serviceSupabase
          .from("users")
          .update({ weekly_tasks_completed: (currentUser?.weekly_tasks_completed ?? 0) + 1 })
          .eq("id", user.id)
      } catch (err) {
        console.error("users update failed:", err)
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
