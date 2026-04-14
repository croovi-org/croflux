import { WorkspaceClient, type WorkspaceProjectSummary, type WorkspaceSummary } from "./WorkspaceClient";
import { createClient } from "@/lib/supabase/server";
import {
  getActiveMilestoneIndex,
  getBossHp,
  getWorkspaceData,
  getIncompleteTaskCount,
  getInitials,
  getNextUpTask,
  getSidebarMilestones,
  type MilestoneWithTasks,
} from "@/lib/workspace/data";
import type { Milestone, Project, Task } from "@/types";

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

type WorkspacePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

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

export default async function WorkspacePage({ searchParams }: WorkspacePageProps) {
  const params = searchParams ? await searchParams : {};
  const projectParam = Array.isArray(params.project) ? params.project[0] : params.project;
  const { user, project, rank, projectCount, workspaceName, allProjects } = await getWorkspaceData(
    projectParam ?? null,
  );
  const supabase = await createClient();
  const projects = allProjects as Project[];

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
  const workspaceProjects = allProjects.filter((p) => p.id === project.id);
  const activeProjects = projectSummaries.filter((p) =>
    workspaceProjects.some((workspaceProject) => workspaceProject.id === p.id),
  );

  const summary: WorkspaceSummary = {
    projectCount: projectSummaries.length,
    totalCompletedTasks: projectSummaryResult.totalCompletedTasks,
    streakDays: user.streak,
    bossesDefeated: projectSummaryResult.totalBossesDefeated,
  };

  const activeWorkspaceMilestones = groupedMilestones.get(project.id) ?? [];
  const nextUp = getNextUpTask(activeWorkspaceMilestones);

  return (
    <WorkspaceClient
      {...({
        projectName: project.name ?? "",
        initials: getInitials(user.name ?? "Builder"),
        avatarUrl: user.avatar_url ?? null,
        userName: user.name ?? "Builder",
        workspaceName,
        summary,
        projects: activeProjects,
        nextUpTask: nextUp?.task.title ?? null,
        nextUpContext: nextUp?.context ?? null,
        incompleteTaskCount: getIncompleteTaskCount(activeWorkspaceMilestones),
        rank,
        milestones: getSidebarMilestones(activeWorkspaceMilestones),
        projectCount,
        allProjects,
        activeProjectId: project.id,
      } as any)}
    />
  );
}
