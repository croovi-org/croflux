import {
  getIncompleteTaskCount,
  getInitials,
  getNextUpTask,
  getSidebarMilestones,
  getWorkspaceData,
} from "@/lib/workspace/data";
import { PricingClient } from "./PricingClient";

function normalizePlan(rawPlan: string | null | undefined) {
  const value = rawPlan?.trim().toLowerCase();

  switch (value) {
    case "builder":
    case "pro-builder":
    case "team-starter":
    case "team-pro":
    case "free":
      return value;
    default:
      return "free";
  }
}

export default async function PricingPage() {
  const { user, project, milestones, rank, projectCount } = await getWorkspaceData();
  const rawUser = user as typeof user & { plan?: string | null };
  const nextUp = getNextUpTask(milestones);

  return (
    <PricingClient
      shell={{
        workspaceName: project.name ?? "My Project",
        initials: getInitials(user.name ?? "Builder"),
        userName: user.name ?? "Builder",
        nextUpTask: nextUp?.task.title ?? null,
        nextUpContext: nextUp?.context ?? null,
        incompleteTaskCount: getIncompleteTaskCount(milestones),
        rank,
        milestones: getSidebarMilestones(milestones),
        streak: user.streak,
        projectCount,
      }}
      currentPlan={normalizePlan(rawUser.plan)}
    />
  );
}
