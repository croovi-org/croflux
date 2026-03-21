import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Milestone, Project, Task, User } from "@/types";
import { DashboardClient } from "./DashboardClient";

type MilestoneRow = Milestone & {
  tasks?: Task[];
};

function normalizeMilestones(rows: MilestoneRow[]) {
  return rows
    .map((milestone) => ({
      ...milestone,
      tasks: [...(milestone.tasks ?? [])].sort((a, b) =>
        a.created_at.localeCompare(b.created_at),
      ),
    }))
    .sort((a, b) => a.order_index - b.order_index);
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const [{ data: projectData }, { data: profileData }] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("user_id", authUser.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase.from("users").select("*").eq("id", authUser.id).maybeSingle(),
  ]);

  const project = projectData as Project | null;
  const profile = profileData as User | null;

  if (!project) {
    redirect("/onboarding");
  }

  const { data: milestoneRows } = await supabase
    .from("milestones")
    .select("*, tasks(*)")
    .eq("project_id", project.id)
    .order("order_index", { ascending: true });

  const milestones = normalizeMilestones((milestoneRows ?? []) as MilestoneRow[]);

  const safeProfile: User = profile ?? {
    id: authUser.id,
    email: authUser.email ?? "",
    name:
      typeof authUser.user_metadata?.full_name === "string"
        ? authUser.user_metadata.full_name
        : (authUser.email?.split("@")[0] ?? "Builder"),
    weekly_tasks_completed: 0,
    streak: 0,
    created_at: new Date().toISOString(),
  };

  const derivedRank =
    safeProfile.weekly_tasks_completed > 0
      ? Math.max(1, 18 - safeProfile.weekly_tasks_completed)
      : null;

  return (
    <DashboardClient
      user={safeProfile}
      project={project}
      milestones={milestones}
      initialRank={derivedRank}
    />
  );
}
