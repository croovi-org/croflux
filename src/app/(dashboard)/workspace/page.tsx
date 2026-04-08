import { redirect } from "next/navigation";
import { WorkspaceClient, type WorkspaceProjectSummary, type WorkspaceSummary } from "./WorkspaceClient";
import { createClient } from "@/lib/supabase/server";
import {
  getActiveMilestoneIndex,
  getBossHp,
  getIncompleteTaskCount,
  getInitials,
  getNextUpTask,
  getSidebarMilestones,
  type MilestoneWithTasks,
} from "@/lib/workspace/data";
import type { Milestone, Project, Task, User } from "@/types";

type MilestoneRow = Milestone & {
  tasks?: Task[];
};

const PROJECT_DOT_COLORS = [
  "var(--accent)",
  "#22c55e",
  "#ffb700",
  "#5f5f7a",
  "#14b8a6",
  "#ec4899",
] as const;

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

function getWorkspaceName(name: string | null | undefined) {
  if (!name || typeof name !== "string") return "Builder's Workspace";
  const firstName = name.trim().split(/\s+/)[0] || "Builder";
  return `${firstName}'s Workspace`;
}

function formatLastWorked(value: string | null) {
  if (!value) return "Never";

  const diffMs = Date.now() - new Date(value).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours <= 0) return "just now";
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays === 1) return "yesterday";
  return `${diffDays} days ago`;
}

function isProjectIdle(lastActivityAt: string | null) {
  if (!lastActivityAt) return false;
  const diffMs = Date.now() - new Date(lastActivityAt).getTime();
  return diffMs >= 7 * 24 * 60 * 60 * 1000;
}

export default async function WorkspacePage() {
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
  const profile = profileData as User | null;

  const user: User = profile ?? {
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

  let groupedMilestones = new Map<string, MilestoneWithTasks[]>();

  if (projects.length > 0) {
    const { data: milestoneRows } = await supabase
      .from("milestones")
      .select("*, tasks(*)")
      .in(
        "project_id",
        projects.map((project) => project.id),
      )
      .order("order_index", { ascending: true });

    groupedMilestones = (milestoneRows ?? []).reduce(
      (map, row) => {
        const milestone = row as MilestoneRow;
        const current = map.get(milestone.project_id) ?? [];
        current.push(milestone as MilestoneWithTasks);
        map.set(milestone.project_id, current);
        return map;
      },
      new Map<string, MilestoneWithTasks[]>(),
    );

    groupedMilestones.forEach((rows, projectId) => {
      groupedMilestones.set(projectId, normalizeMilestones(rows as MilestoneRow[]));
    });
  }

  const projectSummaryResult = projects.reduce(
    (acc, project, index) => {
      const milestones = groupedMilestones.get(project.id) ?? [];
      const tasks = milestones.flatMap((milestone) => milestone.tasks);
      const totalTasks = tasks.length;
      const doneTasks = tasks.filter((task) => task.completed).length;
      const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
      const latestTaskAt = [...tasks]
        .sort((a, b) => b.created_at.localeCompare(a.created_at))[0]?.created_at ?? null;
      const latestCompletedTaskAt = [...tasks]
        .filter((task) => task.completed)
        .sort((a, b) => b.created_at.localeCompare(a.created_at))[0]?.created_at ?? null;
      const lastWorkedAt = latestCompletedTaskAt ?? latestTaskAt ?? project.created_at;
      const bossesCompleted = milestones.filter(
        (milestone) =>
          milestone.is_boss &&
          milestone.tasks.length > 0 &&
          milestone.tasks.every((task) => task.completed),
      ).length;
      const activeMilestone = milestones.length
        ? milestones[getActiveMilestoneIndex(milestones)]
        : null;
      const isActiveBoss = Boolean(
        activeMilestone &&
          activeMilestone.is_boss &&
          activeMilestone.tasks.some((task) => !task.completed),
      );
      const bossLabel = isActiveBoss
        ? `Boss: ${activeMilestone?.title ?? "Milestone"} · ${getBossHp(
            activeMilestone as MilestoneWithTasks,
          )}% HP`
        : bossesCompleted > 0
          ? `${bossesCompleted} boss${bossesCompleted === 1 ? "" : "es"} defeated`
          : null;

      acc.totalCompletedTasks += doneTasks;
      acc.totalBossesDefeated += bossesCompleted;
      acc.projects.push({
        id: project.id,
        name: project.name,
        idea: project.idea,
        progress,
        totalTasks,
        doneTasks,
        href: `/dashboard?project=${project.id}`,
        lastWorkedLabel: formatLastWorked(lastWorkedAt),
        status:
          doneTasks === 0
            ? "not_started"
            : isProjectIdle(latestCompletedTaskAt ?? latestTaskAt)
              ? "idle"
              : "active",
        streak: user.streak,
        boss: {
          state: isActiveBoss ? "active" : bossesCompleted > 0 ? "defeated" : "none",
          label: bossLabel,
        },
        color: PROJECT_DOT_COLORS[index % PROJECT_DOT_COLORS.length],
        initial: project.name.trim().charAt(0).toUpperCase() || "P",
      });

      return acc;
    },
    {
      projects: [] as WorkspaceProjectSummary[],
      totalCompletedTasks: 0,
      totalBossesDefeated: 0,
    },
  );

  const projectSummaries = projectSummaryResult.projects;

  const summary: WorkspaceSummary = {
    projectCount: projectSummaries.length,
    totalCompletedTasks: projectSummaryResult.totalCompletedTasks,
    streakDays: user.streak,
    bossesDefeated: projectSummaryResult.totalBossesDefeated,
  };

  const activeWorkspaceProject = projects[0] ?? null;
  const activeWorkspaceMilestones = activeWorkspaceProject
    ? groupedMilestones.get(activeWorkspaceProject.id) ?? []
    : [];
  const nextUp = getNextUpTask(activeWorkspaceMilestones);
  const rank =
    user.weekly_tasks_completed > 0
      ? Math.max(1, 18 - user.weekly_tasks_completed)
      : null;

  return (
    <WorkspaceClient
      initials={getInitials(user.name)}
      userName={user.name}
      workspaceName={getWorkspaceName(user.name)}
      summary={summary}
      projects={projectSummaries}
      nextUpTask={nextUp?.task.title ?? null}
      nextUpContext={nextUp?.context ?? null}
      incompleteTaskCount={getIncompleteTaskCount(activeWorkspaceMilestones)}
      rank={rank}
      milestones={getSidebarMilestones(activeWorkspaceMilestones)}
      projectCount={projects.length}
    />
  );
}
