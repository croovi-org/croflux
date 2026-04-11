import { createClient } from "@/lib/supabase/server"
import { getWorkspaceData } from "@/lib/workspace/data"
import { ActivityClient } from "./ActivityClient"

export default async function ActivityPage() {
  const { user, project, milestones, rank, projectCount } = await getWorkspaceData()
  const supabase = await createClient()

  const now = new Date()
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(now.getDate() - 29)
  thirtyDaysAgo.setHours(0, 0, 0, 0)

  const { data: activityData } = await supabase
    .from("activity_log")
    .select("timestamp")
    .eq("user_id", user.id)
    .gte("timestamp", thirtyDaysAgo.toISOString())
    .order("timestamp", { ascending: true })

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const dayCounts: number[] = Array(7).fill(0)

  for (const row of activityData ?? []) {
    const d = new Date(row.timestamp)
    const dayOfWeek = d.getDay()
    const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    dayCounts[index] = (dayCounts[index] ?? 0) + 1
  }

  const totalTasksThisMonth = (activityData ?? []).length
  const activeDaysSet = new Set(
    (activityData ?? []).map((r) => new Date(r.timestamp).toISOString().split("T")[0])
  )
  const activeDays = activeDaysSet.size

  return (
    <ActivityClient
      user={user}
      project={project}
      milestones={milestones}
      rank={rank}
      projectCount={projectCount}
      dayCounts={dayCounts}
      dayLabels={dayLabels}
      totalTasksThisMonth={totalTasksThisMonth}
      activeDays={activeDays}
      streak={user.streak}
    />
  )
}
