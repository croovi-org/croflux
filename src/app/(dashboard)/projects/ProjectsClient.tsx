"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyProjects } from "@/components/projects/EmptyProjects";
import { ProjectRow } from "@/components/projects/ProjectRow";
import {
  ProjectsToolbar,
  type ProjectsSortOption,
} from "@/components/projects/ProjectsToolbar";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

type ProjectsPageRow = {
  id: string;
  name: string;
  idea: string;
  progress: number;
  tasksDone: number;
  tasksTotal: number;
  currentBoss: string | null;
  bossHp: number | null;
  currentMilestoneTitle: string | null;
  currentMilestoneIsBoss: boolean;
  currentMilestoneProgress: number | null;
  bossesDefeated: number;
  lastUpdated: string;
  status: "active" | "paused" | "completed" | "not_started";
  href: string;
  accentColor: string;
  createdAt: string;
  updatedAtValue: number;
};

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

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase();
    const visible = normalizedQuery
      ? projects.filter((project) =>
          project.name.toLowerCase().includes(normalizedQuery),
        )
      : projects;

    const sorted = [...visible];
    sorted.sort((left, right) => {
      switch (sort) {
        case "progress":
          return right.progress - left.progress;
        case "name":
          return left.name.localeCompare(right.name);
        case "created":
          return (
            new Date(right.createdAt).getTime() -
            new Date(left.createdAt).getTime()
          );
        case "recent":
        default:
          return right.updatedAtValue - left.updatedAtValue;
      }
    });

    return sorted;
  }, [projects, searchValue, sort]);

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
            <Link
              href="/onboarding"
              className="new-project-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: "8px",
                height: "40px",
                padding: "0 19px",
                borderRadius: "14px",
                background: "var(--accent)",
                color: "#fff",
                whiteSpace: "nowrap",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 400,
                boxShadow:
                  "0 8px 24px color-mix(in srgb, var(--accent) 22%, transparent)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                aria-hidden="true"
              >
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
                onViewChange={setView}
              />

              {view === "list" && (
                <section className="projects-table">
                  <div className="table-head">
                    <span>Project</span>
                    <span>Progress</span>
                    <span>Tasks</span>
                    <span>Current milestone</span>
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
              )}

              {view === "grid" && (
                <section className="projects-grid">
                  {filteredProjects.map((project) => {
                    const statusLabel =
                      project.status === "active"
                        ? "Active"
                        : project.status === "completed"
                          ? "Completed"
                          : project.status === "paused"
                            ? "Paused"
                            : "Not started";

                    return (
                      <article key={project.id} className="project-card">
                        <div className="project-card-head">
                          <div className="project-card-title-wrap">
                            <h3>{project.name}</h3>
                            <p>{project.idea}</p>
                          </div>
                          <span className={`grid-status ${project.status}`}>
                            {statusLabel}
                          </span>
                        </div>

                        <div className="grid-progress">
                          <div className="grid-progress-top">
                            <span>Progress</span>
                            <strong>{project.progress}%</strong>
                          </div>
                          <div className="grid-progress-bar">
                            <span style={{ width: `${project.progress}%` }} />
                          </div>
                        </div>

                        <div className="grid-meta">
                          <div className="grid-meta-row">
                            <span>Tasks</span>
                            <strong>
                              {project.tasksDone} / {project.tasksTotal}
                            </strong>
                          </div>
                          <div className="grid-meta-row">
                            <span>Current milestone</span>
                            <strong>{project.currentMilestoneTitle ?? "—"}</strong>
                          </div>
                          <div className="grid-meta-row">
                            <span>Last updated</span>
                            <strong>{project.lastUpdated}</strong>
                          </div>
                        </div>

                        <div className="grid-card-footer">
                          <Link
                            href={project.href}
                            className="grid-open-link"
                            style={{
                              color: "var(--accent)",
                              fontSize: 14,
                              fontWeight: 500,
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            Open →
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </section>
              )}
            </>
          )}
        </div>

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
            font-size: 8px;
            font-weight: 400;
            transition:
              background-color 0.3s ease,
              transform 0.18s ease,
              box-shadow 0.18s ease;
          }
          .new-project-btn:hover {
            background: var(--accent-hover);
            transform: translateY(-1px);
            box-shadow: 0 10px 26px
              color-mix(in srgb, var(--accent) 26%, transparent);
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
            background: #12121e;
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
          .projects-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
          }
          .project-card {
            display: flex;
            flex-direction: column;
            gap: 14px;
            border-radius: 12px;
            border: 1px solid var(--border2);
            background: #12121e;
            padding: 16px;
          }
          .project-card-head {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            align-items: flex-start;
          }
          .project-card-title-wrap {
            min-width: 0;
          }
          .project-card-title-wrap h3 {
            margin: 0;
            font-size: 14px;
            color: var(--text);
            font-weight: 600;
          }
          .project-card-title-wrap p {
            margin: 5px 0 0;
            color: var(--text3);
            font-size: 12px;
            line-height: 1.35;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .grid-status {
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 10px;
            border: 1px solid var(--border2);
            background: var(--bg4);
            color: var(--text3);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .grid-status.active {
            color: #22c55e;
            border-color: rgba(34, 197, 94, 0.28);
            background: rgba(34, 197, 94, 0.08);
          }
          .grid-status.completed {
            color: #378add;
            border-color: rgba(55, 138, 221, 0.3);
            background: rgba(55, 138, 221, 0.08);
          }
          .grid-status.paused {
            color: #ffb700;
            border-color: rgba(255, 183, 0, 0.28);
            background: rgba(255, 183, 0, 0.08);
          }
          .grid-progress {
            display: grid;
            gap: 7px;
          }
          .grid-progress-top {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: var(--text3);
          }
          .grid-progress-top strong {
            color: var(--text);
            font-family: "Geist Mono", monospace;
          }
          .grid-progress-bar {
            width: 100%;
            height: 5px;
            border-radius: 999px;
            background: var(--bg4);
            overflow: hidden;
          }
          .grid-progress-bar span {
            display: block;
            height: 100%;
            border-radius: inherit;
            background: var(--accent);
          }
          .grid-meta {
            display: grid;
            gap: 8px;
          }
          .grid-meta-row {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            font-size: 11px;
          }
          .grid-meta-row span {
            color: var(--text3);
          }
          .grid-meta-row strong {
            color: var(--text2);
            text-align: right;
            font-weight: 500;
          }
          .grid-card-footer {
            margin-top: auto;
            padding-top: 4px;
          }
          .grid-open-link {
            border: 0;
            background: transparent;
            color: var(--accent);
            font-size: 38px;
            line-height: 1;
            letter-spacing: -0.02em;
            font-weight: 500;
            text-decoration: none;
            cursor: pointer;
            transition: opacity 0.18s ease;
          }
          .grid-open-link:hover {
            opacity: 0.75;
          }
          @media (max-width: 1200px) {
            .projects-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }
          @media (max-width: 780px) {
            .projects-wrap {
              padding: 22px 16px;
            }
            .projects-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </main>
    </WorkspaceShell>
  );
}
