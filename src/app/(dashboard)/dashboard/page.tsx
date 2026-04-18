import { Suspense } from "react";
import { DashboardClient } from "./DashboardClient";
import DashboardLoading from "./loading";
import { getWorkspaceData } from "@/lib/workspace/data";

type DashboardPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

async function DashboardData({ projectParam }: { projectParam: string | null }) {
  const { user, project, milestones, rank, projectCount, workspaceName, allProjects } =
    await getWorkspaceData(projectParam);
  return (
    <DashboardClient
      user={user}
      project={project}
      milestones={milestones}
      initialRank={rank}
      projectCount={projectCount}
      workspaceName={workspaceName}
      allProjects={allProjects}
    />
  );
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = searchParams ? await searchParams : {};
  const projectParam = Array.isArray(params.project) ? params.project[0] : params.project;

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardData projectParam={projectParam ?? null} />
    </Suspense>
  );
}
