import { redirect } from "next/navigation";
import { ProjectsClient } from "./ProjectsClient";
import { createClient } from "@/lib/supabase/server";
import {
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

const PROJECT_ACCENTS = ["var(--accent)", "#22c55e", "#ffb700"] as const;

function normalizeMilestones(rows: MilestoneRow[]) {
  return rows
    .map((milestone) => ({
      ...milestone,
      tasks: [...(milestone.tasks ?? [])].sort((left, right) =>
        left.created_at.localeCompare(right.created_at),
      ),
    }))
    .sort((left, right) => left.order_index - right.order_index);
}

function formatRelativeDate(value: string | null) {
  if (!value) return "Never";

  const diffMs = Date.now() - new Date(value).getTime();
  const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

function isRecentActivity(value: string | null) {
  if (!value) return false;
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return new Date(value).getTime() >= sevenDaysAgo;
}

function getWorkspaceName(name: string) {
  const firstName = name.trim().split(/\s+/)[0] || "Builder";
  return `${firstName}'s Workspace`;
}

export default async function ProjectsPage() {
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
      .order("created_at", { ascending: false }),
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

    groupedMilestones = (milestoneRows ?? []).reduce((map, row) => {
      const milestone = row as MilestoneRow;
      const currentRows = map.get(milestone.project_id) ?? [];
      currentRows.push(milestone as MilestoneWithTasks);
      map.set(milestone.project_id, currentRows);
      return map;
    }, new Map<string, MilestoneWithTasks[]>());

    groupedMilestones.forEach((rows, projectId) => {
      groupedMilestones.set(projectId, normalizeMilestones(rows as MilestoneRow[]));
    });
  }

  const rows = projects.map((project, index) => {
    const milestones = groupedMilestones.get(project.id) ?? [];
    const tasks = milestones.flatMap((milestone) => milestone.tasks);
    const tasksDone = tasks.filter((task) => task.completed).length;
    const tasksTotal = tasks.length;
    const progress = tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0;
    const latestActivity =
      tasks
        .filter((task) => task.completed)
        .sort((left, right) => right.created_at.localeCompare(left.created_at))[0]?.created_at ??
      null;
    const updatedAtValue = latestActivity
      ? new Date(latestActivity).getTime()
      : new Date(project.created_at).getTime();

    const currentBossMilestone =
      milestones.find(
        (milestone) =>
          milestone.is_boss &&
          milestone.tasks.length > 0 &&
          milestone.tasks.some((task) => !task.completed),
      ) ?? null;

    const bossesDefeated = milestones.filter(
      (milestone) =>
        milestone.is_boss &&
        milestone.tasks.length > 0 &&
        milestone.tasks.every((task) => task.completed),
    ).length;

    const status =
      progress === 100
        ? "completed"
        : tasksDone === 0
          ? "not_started"
          : isRecentActivity(latestActivity)
            ? "active"
            : "paused";

    return {
      id: project.id,
      name: project.name,
      idea: project.idea,
      progress,
      tasksDone,
      tasksTotal,
      currentBoss: currentBossMilestone?.title ?? null,
      bossHp: currentBossMilestone ? getBossHp(currentBossMilestone) : null,
      bossesDefeated,
      lastUpdated: formatRelativeDate(latestActivity ?? project.created_at),
      status,
      href: `/dashboard?project=${project.id}`,
      accentColor: PROJECT_ACCENTS[index % PROJECT_ACCENTS.length],
      createdAt: project.created_at,
      updatedAtValue,
    } as const;
  });

  const stats = {
    total: rows.length,
    active: rows.filter((row) => row.status === "active").length,
    completed: rows.filter((row) => row.status === "completed").length,
    bossesDefeated: rows.reduce((count, row) => count + row.bossesDefeated, 0),
  };

  const sidebarProject = projects[0] ?? null;
  const sidebarMilestones = sidebarProject ? groupedMilestones.get(sidebarProject.id) ?? [] : [];
  const nextUp = getNextUpTask(sidebarMilestones);
  const rank =
    user.weekly_tasks_completed > 0
      ? Math.max(1, 18 - user.weekly_tasks_completed)
      : null;

  return (
    <ProjectsClient
      initials={getInitials(user.name)}
      userName={user.name}
      workspaceName={getWorkspaceName(user.name)}
      projectCount={projects.length}
      nextUpTask={nextUp?.task.title ?? null}
      nextUpContext={nextUp?.context ?? null}
      incompleteTaskCount={getIncompleteTaskCount(sidebarMilestones)}
      rank={rank}
      milestones={getSidebarMilestones(sidebarMilestones)}
      streak={user.streak}
      stats={stats}
      projects={rows}
    />
  );
}
