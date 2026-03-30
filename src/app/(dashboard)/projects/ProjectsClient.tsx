"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { EmptyProjects } from "@/components/projects/EmptyProjects";
import { ProjectRow, type ProjectsPageRow } from "@/components/projects/ProjectRow";
import {
  ProjectsToolbar,
  type ProjectsSortOption,
} from "@/components/projects/ProjectsToolbar";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

type SidebarMilestone = {
  id: string;
  title: string;
  progress: number;
  state: "active" | "locked" | "done";
};

type ProjectsClientProps = {
  initials: string;
  userName: string;
  workspaceName: string;
  projectCount: number;
  nextUpTask: string | null;
  nextUpContext: string | null;
  incompleteTaskCount: number;
  rank: number | null;
  milestones: SidebarMilestone[];
  streak: number;
  stats: {
    total: number;
    active: number;
    completed: number;
    bossesDefeated: number;
  };
  projects: ProjectsPageRow[];
};

export function ProjectsClient({
  initials,
  userName,
  workspaceName,
  projectCount,
  nextUpTask,
  nextUpContext,
  incompleteTaskCount,
  rank,
  milestones,
  streak,
  stats,
  projects,
}: ProjectsClientProps) {
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<ProjectsSortOption>("recent");
  const [view, setView] = useState<"list" | "grid">("list");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase();
    const visible = normalizedQuery
      ? projects.filter((project) => project.name.toLowerCase().includes(normalizedQuery))
      : projects;

    const sorted = [...visible];
    sorted.sort((left, right) => {
      switch (sort) {
        case "progress":
          return right.progress - left.progress;
        case "name":
          return left.name.localeCompare(right.name);
        case "created":
          return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
        case "recent":
        default:
          return right.updatedAtValue - left.updatedAtValue;
      }
    });

    return sorted;
  }, [projects, searchValue, sort]);

  const showToast = (message: string) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast(message);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2400);
  };

  return (
    <WorkspaceShell
      workspaceName={workspaceName}
      breadcrumbRoot={workspaceName}
      currentPage="Projects"
      currentSection="/projects"
      initials={initials}
      userName={userName}
      nextUpTask={nextUpTask}
      nextUpContext={nextUpContext}
      incompleteTaskCount={incompleteTaskCount}
      rank={rank}
      milestones={milestones}
      streak={streak}
      actionLabel="New Project"
      actionHref="/onboarding"
      projectCount={projectCount}
    >
      <main className="projects-main">
        <div className="projects-wrap">
          <section className="projects-header">
            <div>
              <h1>Projects</h1>
              <p>Manage and organize all your startup projects.</p>
            </div>
            <Link href="/onboarding" className="new-project-btn">
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path
                  d="M12 5v14M5 12h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>New Project</span>
            </Link>
          </section>

          {projects.length === 0 ? (
            <EmptyProjects />
          ) : (
            <>
              <section className="stats-strip">
                <div className="stat-chip">
                  <span className="dot accent" />
                  <strong>{stats.total}</strong>
                  <span>projects</span>
                </div>
                <div className="stat-chip">
                  <span className="dot green" />
                  <strong>{stats.active}</strong>
                  <span>active</span>
                </div>
                <div className="stat-chip">
                  <span className="dot blue" />
                  <strong>{stats.completed}</strong>
                  <span>completed</span>
                </div>
                <div className="stat-chip">
                  <span className="dot amber" />
                  <strong>{stats.bossesDefeated}</strong>
                  <span>bosses defeated</span>
                </div>
              </section>

              <ProjectsToolbar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                sort={sort}
                onSortChange={setSort}
                view={view}
                onViewChange={(nextView) => {
                  if (nextView === "grid") {
                    showToast("Grid view is coming soon");
                    return;
                  }
                  setView(nextView);
                }}
              />

              <section className="projects-table">
                <div className="table-head">
                  <span>Project</span>
                  <span>Progress</span>
                  <span>Tasks</span>
                  <span>Current boss</span>
                  <span>Last updated</span>
                  <span>Status</span>
                  <span />
                </div>

                <div className="table-body">
                  {filteredProjects.map((project) => (
                    <ProjectRow key={project.id} project={project} />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        <div className={`projects-toast ${toast ? "show" : ""}`}>{toast}</div>

        <style jsx>{`
          .projects-main {
            flex: 1;
            min-width: 0;
            overflow-y: auto;
            overflow-x: hidden;
            background: #0f0f17;
          }
          .projects-wrap {
            padding: 28px 32px;
            display: flex;
            flex-direction: column;
            gap: 18px;
          }
          .projects-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 18px;
          }
          h1 {
            margin: 0;
            font-size: 20px;
            line-height: 1.1;
            letter-spacing: -0.02em;
            font-weight: 600;
            color: var(--text);
          }
          .projects-header p {
            margin: 8px 0 0;
            font-size: 13px;
            color: var(--text3);
          }
          .new-project-btn {
            height: 36px;
            padding: 0 14px;
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: var(--accent);
            color: white;
            text-decoration: none;
            font-size: 12px;
            font-weight: 600;
            transition: background-color 0.3s ease;
          }
          .new-project-btn:hover {
            background: var(--accent-hover);
          }
          .stats-strip {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .stat-chip {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 6px 12px;
            border-radius: 7px;
            border: 1px solid var(--border2);
            background: var(--bg3);
            font-size: 11px;
            color: var(--text3);
          }
          .stat-chip strong {
            color: var(--text);
            font-family: "Geist Mono", monospace;
            font-weight: 700;
          }
          .dot {
            width: 7px;
            height: 7px;
            border-radius: 999px;
            flex-shrink: 0;
          }
          .dot.accent {
            background: var(--accent);
          }
          .dot.green {
            background: #22c55e;
          }
          .dot.blue {
            background: #378add;
          }
          .dot.amber {
            background: #ffb700;
          }
          .projects-table {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .table-head {
            display: grid;
            grid-template-columns: 1fr 180px 140px 160px 120px 100px 60px;
            gap: 12px;
            padding: 7px 16px;
            border-bottom: 1px solid var(--border2);
            font-size: 10px;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--text3);
          }
          .table-body {
            display: grid;
            gap: 10px;
          }
          .projects-toast {
            position: fixed;
            right: 28px;
            bottom: 24px;
            padding: 10px 14px;
            border-radius: 10px;
            border: 1px solid var(--border2);
            background: #171722;
            color: var(--text);
            font-size: 12px;
            opacity: 0;
            transform: translateY(8px);
            pointer-events: none;
            transition:
              opacity 0.2s ease,
              transform 0.2s ease;
          }
          .projects-toast.show {
            opacity: 1;
            transform: translateY(0);
          }
        `}</style>
      </main>
    </WorkspaceShell>
  );
}
