import { DashboardClient } from "./DashboardClient";
import { getWorkspaceData } from "@/lib/workspace/data";

type DashboardPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = searchParams ? await searchParams : {};
  const projectParam = Array.isArray(params.project) ? params.project[0] : params.project;
  const { user, project, milestones, rank } = await getWorkspaceData(projectParam ?? null);

  return (
    <DashboardClient
      user={user}
      project={project}
      milestones={milestones}
      initialRank={rank}
    />
  );
}
