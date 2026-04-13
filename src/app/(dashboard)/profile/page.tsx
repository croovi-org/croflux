import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  getActiveMilestoneIndex,
  getIncompleteTaskCount,
  getInitials,
  getNextUpTask,
  getSidebarMilestones,
  getWorkspaceData,
} from "@/lib/workspace/data";
import { ProfileClient } from "./ProfileClient";

type SavePayload = Record<string, string>;

async function savePersonalInfo(payload: SavePayload) {
  "use server";

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return;

  const firstName = payload.firstName?.trim() ?? "";
  const lastName = payload.lastName?.trim() ?? "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || payload.email;

  await supabase
    .from("users")
    .update({
      name: fullName,
      first_name: firstName,
      last_name: lastName,
      phone: payload.phone?.trim() || null,
      gender: payload.gender || null,
      date_of_birth: payload.dateOfBirth || null,
      location: payload.location?.trim() || null,
      timezone: payload.timezone || null,
    })
    .eq("id", authUser.id);

  revalidatePath("/profile");
}

async function saveProfessionalInfo(payload: SavePayload) {
  "use server";

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return;

  await supabase
    .from("users")
    .update({
      role: payload.role?.trim() || null,
      bio: payload.bio?.trim() || null,
      twitter: payload.twitter?.trim() || null,
      personal_website: payload.website?.trim() || null,
      linkedin: payload.linkedin?.trim() || null,
      github: payload.github?.trim() || null,
      instagram: payload.instagram?.trim() || null,
    })
    .eq("id", authUser.id);

  if (payload.projectId) {
    await supabase
      .from("projects")
      .update({
        name: payload.startupName?.trim() || null,
        workspace_name: payload.workspaceName?.trim() || null,
        workspace_slug: payload.workspaceSlug?.trim() || null,
      })
      .eq("id", payload.projectId)
      .eq("user_id", authUser.id);
  }

  revalidatePath("/profile");
}

export default async function ProfilePage() {
  const { user, project, milestones, rank, projectCount, workspaceName, allProjects } = await getWorkspaceData();
  const rawUser = user as typeof user & {
    first_name?: string | null;
    last_name?: string | null;
    phone?: string | null;
    gender?: string | null;
    date_of_birth?: string | null;
    location?: string | null;
    timezone?: string | null;
    role?: string | null;
    github?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    avatar_url?: string | null;
    personal_website?: string | null;
    linkedin?: string | null;
    bio?: string | null;
    notion_connected?: boolean | null;
  };
  const rawProject = project as typeof project & {
    workspace_name?: string | null;
    workspace_slug?: string | null;
  };
  const safeName = typeof user.name === "string" ? user.name : "";
  const safeNameParts = safeName.trim().split(/\s+/).filter(Boolean);

  const firstName =
    rawUser.first_name ??
    safeNameParts[0] ??
    "Builder";
  const lastName =
    rawUser.last_name ??
    safeNameParts.slice(1).join(" ");

  const totalTasks = milestones.reduce((sum, milestone) => sum + milestone.tasks.length, 0);
  const completedTasks = milestones.reduce(
    (sum, milestone) => sum + milestone.tasks.filter((task) => task.completed).length,
    0,
  );
  const activeMilestoneIndex = getActiveMilestoneIndex(milestones);
  const inProgressTasks = milestones[activeMilestoneIndex]
    ? milestones[activeMilestoneIndex].tasks.filter((task) => !task.completed).length
    : 0;
  const remainingTasks = Math.max(totalTasks - completedTasks - inProgressTasks, 0);
  const bossesDefeated = milestones.filter(
    (milestone, index) =>
      milestone.is_boss &&
      index < activeMilestoneIndex &&
      milestone.tasks.length > 0 &&
      milestone.tasks.every((task) => task.completed),
  ).length;
  // Badge logic
  const isBossHunter = bossesDefeated >= 1

  const earlyBuilderCutoff = new Date("2026-06-30T23:59:59Z")
  const isEarlyBuilder = new Date(user.created_at) <= earlyBuilderCutoff

  const hasStreak = user.streak >= 1
  const nextUp = getNextUpTask(milestones);

  return (
    <ProfileClient
      shell={{
        projectName: project.name ?? "",
        workspaceName,
        initials: getInitials(user.name ?? "Builder"),
        avatarUrl: rawUser.avatar_url ?? null,
        userName: user.name ?? "Builder",
        nextUpTask: nextUp?.task.title ?? null,
        nextUpContext: nextUp?.context ?? null,
        incompleteTaskCount: getIncompleteTaskCount(milestones),
        rank,
        milestones: getSidebarMilestones(milestones),
        streak: user.streak,
        projectCount,
        allProjects,
      }}
      profile={{
        userId: user.id,
        projectId: project.id,
        name: user.name ?? "Builder",
        firstName,
        lastName,
        email: user.email,
        phone: rawUser.phone ?? "",
        gender: rawUser.gender ?? "",
        dateOfBirth: rawUser.date_of_birth ?? "",
        location: rawUser.location ?? "",
        timezone: rawUser.timezone ?? "Asia/Kolkata",
        role: rawUser.role ?? "Founder",
        avatarUrl: rawUser.avatar_url ?? null,
        githubUrl: rawUser.github ?? "",
        twitterUrl: rawUser.twitter ?? "",
        instagramUrl: rawUser.instagram ?? "",
        websiteUrl: rawUser.personal_website ?? "",
        linkedinUrl: rawUser.linkedin ?? "",
        bio:
          rawUser.bio ??
          "Building fast, shipping carefully, and turning product direction into weekly progress.",
        startupName: rawProject.name ?? project.name,
        workspaceName:
          rawProject.workspace_name ??
          rawProject.name ??
          project.name,
        workspaceSlug:
          rawProject.workspace_slug ??
          project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        notionConnected: Boolean(rawUser.notion_connected),
        createdAt: user.created_at,
        streak: user.streak,
        weeklyTasksCompleted: user.weekly_tasks_completed,
      }}
      stats={{
        inProgress: inProgressTasks,
        completed: completedTasks,
        remaining: remainingTasks,
        bossesDefeated,
        weeklyTasks: user.weekly_tasks_completed,
        leaderboardRank: rank,
        currentMilestone: milestones[activeMilestoneIndex]?.title ?? "No active milestone",
        memberSince: new Date(user.created_at).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
      }}
      badges={{
        streak: hasStreak,
        streakCount: user.streak,
        bossHunter: isBossHunter,
        earlyBuilder: isEarlyBuilder,
      }}
      savePersonalInfo={savePersonalInfo}
      saveProfessionalInfo={saveProfessionalInfo}
    />
  );
}
