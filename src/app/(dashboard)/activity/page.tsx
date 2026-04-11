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
  const ninetyDaysAgo = new Date(now)
  ninetyDaysAgo.setDate(now.getDate() - 89)
  ninetyDaysAgo.setHours(0, 0, 0, 0)

  const { data: activityData } = await supabase
    .from("activity_log")
    .select("timestamp")
    .eq("user_id", user.id)
    .gte("timestamp", ninetyDaysAgo.toISOString())
    .order("timestamp", { ascending: true })

  const allTimestamps: string[] = (activityData ?? []).map((r) => r.timestamp)

  const totalTasksThisMonth = allTimestamps.filter((ts) => {
    const d = new Date(ts)
    return d >= thirtyDaysAgo
  }).length
  const activeDaysSet = new Set(
    allTimestamps
      .filter((ts) => new Date(ts) >= thirtyDaysAgo)
      .map((ts) => new Date(ts).toISOString().split("T")[0])
  )
  const activeDays = activeDaysSet.size

  return (
    <ActivityClient
      user={user}
      project={project}
      milestones={milestones}
      rank={rank}
      projectCount={projectCount}
      allTimestamps={allTimestamps}
      totalTasksThisMonth={totalTasksThisMonth}
      activeDays={activeDays}
      streak={user.streak}
    />
  )
}
