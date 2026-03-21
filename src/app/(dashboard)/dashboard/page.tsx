import { DashboardClient } from "./DashboardClient";
import { getWorkspaceData } from "@/lib/workspace/data";

export default async function DashboardPage() {
  const { user, project, milestones, rank } = await getWorkspaceData();

  return (
    <DashboardClient
      user={user}
      project={project}
      milestones={milestones}
      initialRank={rank}
    />
  );
}
