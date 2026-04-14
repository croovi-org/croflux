import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Milestone, Project, Task, User } from "@/types";

export type MilestoneWithTasks = Milestone & {
  tasks: Task[];
};

type MilestoneRow = Milestone & {
  tasks?: Task[];
};

export type WorkspaceData = {
  user: User;
  project: Project;
  milestones: MilestoneWithTasks[];
  rank: number | null;
  projectCount: number;
  workspaceName: string;
  allProjects: Project[];
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

export function getInitials(name: string | null | undefined) {
  if (!name || typeof name !== "string") return "AS";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "AS";
}

export function getMilestoneProgress(milestone: MilestoneWithTasks) {
  if (milestone.tasks.length === 0) return 0;
  return Math.round(
    (milestone.tasks.filter((task) => task.completed).length / milestone.tasks.length) * 100,
  );
}

export function getBossHp(milestone: MilestoneWithTasks) {
  if (milestone.tasks.length === 0) return 100;
  return Math.round(
    (milestone.tasks.filter((task) => !task.completed).length / milestone.tasks.length) * 100,
  );
}

export function getActiveMilestoneIndex(milestones: MilestoneWithTasks[]) {
  const index = milestones.findIndex(
    (milestone) =>
      milestone.tasks.length === 0 || milestone.tasks.some((task) => !task.completed),
  );

  return index === -1 ? 0 : index;
}

export function getSidebarMilestones(milestones: MilestoneWithTasks[]) {
  const activeMilestoneIndex = getActiveMilestoneIndex(milestones);

  return milestones.map((milestone, index) => ({
    id: milestone.id,
    title: milestone.title,
    progress: milestone.is_boss
      ? 100 - getBossHp(milestone)
      : getMilestoneProgress(milestone),
    state:
      index < activeMilestoneIndex
        ? ("done" as const)
        : index === activeMilestoneIndex
          ? ("active" as const)
          : ("locked" as const),
  }));
}

export function getNextUpTask(milestones: MilestoneWithTasks[]) {
  const activeMilestone = milestones[getActiveMilestoneIndex(milestones)];
  if (!activeMilestone) return null;

  const task = activeMilestone.tasks.find((item) => !item.completed);
  if (!task) return null;

  const taskIndex = activeMilestone.tasks.findIndex((item) => item.id === task.id);

  return {
    task,
    context: `${activeMilestone.title} · task ${taskIndex + 1} of ${activeMilestone.tasks.length}`,
  };
}

export function getIncompleteTaskCount(milestones: MilestoneWithTasks[]) {
  return milestones.reduce(
    (count, milestone) => count + milestone.tasks.filter((task) => !task.completed).length,
    0,
  );
}

export async function getWorkspaceData(selectedProjectId?: string | null) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const [{ data: projectsData }, { data: profileData }] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("user_id", authUser.id)
      .order("created_at", { ascending: true }),
    supabase.from("users").select("*").eq("id", authUser.id).maybeSingle(),
  ]);

  const projects = (projectsData ?? []) as Project[];
  let resolvedProjectId = selectedProjectId ?? null;
  if (!resolvedProjectId) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    resolvedProjectId = cookieStore.get("activeProject")?.value ?? null;
  }
  const project =
    (resolvedProjectId
      ? projects.find((item) => item.id === resolvedProjectId)
      : null) ?? projects[0] ?? null;
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

  const user: User = profile ?? {
    id: authUser.id,
    email: authUser.email ?? "",
    name: authUser.user_metadata?.full_name ?? authUser.email?.split("@")[0] ?? "Builder",
    first_name: null,
    last_name: null,
    phone: null,
    gender: null,
    date_of_birth: null,
    location: null,
    timezone: null,
    role: null,
    github: null,
    twitter: null,
    instagram: null,
    bio: null,
    personal_website: null,
    linkedin: null,
    avatar_url: null,
    weekly_tasks_completed: 0,
    streak: 0,
    created_at: new Date().toISOString(),
  };

  const { count: rankCount } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .or(
      `weekly_tasks_completed.gt.${user.weekly_tasks_completed ?? 0},` +
      `and(weekly_tasks_completed.eq.${user.weekly_tasks_completed ?? 0},streak.gt.${user.streak ?? 0})`
    )

  const rank = (user.weekly_tasks_completed ?? 0) > 0
    ? (rankCount ?? 0) + 1
    : null;
  const rawProject = project as typeof project & {
    workspace_name?: string | null
    workspace_slug?: string | null
  }

  const workspaceName = rawProject.workspace_name ?? rawProject.name ?? "My Workspace"

  return {
    user,
    project,
    milestones,
    rank,
    projectCount: projects.length,
    workspaceName,
    allProjects: projects,
  } satisfies WorkspaceData;
}
