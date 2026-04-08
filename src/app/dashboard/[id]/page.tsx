import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/app/(dashboard)/dashboard/DashboardClient"

type Props = {
  params: Promise<{ id: string }>
}

export default async function DashboardByIdPage({ params }: Props) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, name, email, streak, weekly_tasks_completed, created_at")
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/login")
  }

  const { data: project } = await supabase
    .from("projects")
    .select("id, user_id, name, idea, strategy, product_stage, created_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!project) {
    redirect("/dashboard")
  }

  const { data: milestones } = await supabase
    .from("milestones")
    .select("id, title, is_boss, order_index, project_id")
    .eq("project_id", id)
    .order("order_index", { ascending: true })

  const milestoneIds = (milestones ?? []).map((m) => m.id)

  const tasks =
    milestoneIds.length > 0
      ? (
          await supabase
            .from("tasks")
            .select("id, milestone_id, title, completed, created_at")
            .in("milestone_id", milestoneIds)
            .order("order_index", { ascending: true })
        ).data
      : []

  const milestonesWithTasks = (milestones ?? []).map((m) => ({
    ...m,
    tasks: (tasks ?? []).filter((t) => t.milestone_id === m.id),
  }))

  const { count: projectCount } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: rankCount } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .gt("weekly_tasks_completed", profile.weekly_tasks_completed ?? 0)

  const rank = (rankCount ?? 0) + 1

  return (
    <DashboardClient
      user={profile}
      project={project}
      milestones={milestonesWithTasks}
      initialRank={rank}
      projectCount={projectCount ?? 1}
    />
  )
}
