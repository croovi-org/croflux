"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { EmptyProjects } from "@/components/projects/EmptyProjects";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

type ProjectsSortOption = "recent" | "progress" | "name" | "created";

const SORT_LABELS: Record<ProjectsSortOption, string> = {
  recent: "Recently updated",
  progress: "Progress",
  name: "Name (A-Z)",
  created: "Created date",
};

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
  projectName: string;
  initials: string;
  avatarUrl: string | null;
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
  allProjects?: Array<{
    id: string;
    name: string;
    workspace_name?: string | null;
  }>;
  activeProjectId?: string | null;
};

export function ProjectsClient({
  projectName,
  initials,
  avatarUrl,
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
  allProjects,
  activeProjectId,
}: ProjectsClientProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<ProjectsSortOption>("recent");
  const [view, setView] = useState<"list" | "grid">("list");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [selectedWorkspaceName, setSelectedWorkspaceName] = useState<string | "all">("all");
  const [wsDropdownOpen, setWsDropdownOpen] = useState(false);
  const wsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wsDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (wsDropdownRef.current && !wsDropdownRef.current.contains(e.target as Node)) {
        setWsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [wsDropdownOpen]);

  useEffect(() => {
    if (!sortOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [sortOpen]);

  useEffect(() => {
    if (!activeProjectId) return;
    if (selectedWorkspaceName === "all") return;
    const exists = (allProjects ?? []).some((item) => {
      const rawItem = item as typeof item & { workspace_name?: string | null };
      return (rawItem.workspace_name ?? item.name) === selectedWorkspaceName;
    });
    if (!exists) {
      setSelectedWorkspaceName("all");
    }
  }, [activeProjectId, allProjects, selectedWorkspaceName]);

  const uniqueWorkspaces = useMemo(() => {
    return (allProjects ?? []).reduce<
      Array<{ id: string; name: string; workspace_name?: string | null }>
    >((acc, p) => {
      const rawP = p as typeof p & { workspace_name?: string | null };
      const wsName = rawP.workspace_name ?? p.name;
      const already = acc.find((item) => {
        const r = item as typeof item & { workspace_name?: string | null };
        return (r.workspace_name ?? item.name) === wsName;
      });
      if (!already) acc.push(p);
      return acc;
    }, []);
  }, [allProjects]);

  const workspaceNameByProjectId = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of allProjects ?? []) {
      const rawItem = item as typeof item & { workspace_name?: string | null };
      map.set(item.id, rawItem.workspace_name ?? item.name);
    }
    return map;
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    if (selectedWorkspaceName === "all") return projects;
    return projects.filter(
      (project) => workspaceNameByProjectId.get(project.id) === selectedWorkspaceName,
    );
  }, [projects, selectedWorkspaceName, workspaceNameByProjectId]);

  const displayedProjects = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase();
    const visible = normalizedQuery
      ? filteredProjects.filter((project) => {
          const nameMatch = project.name.toLowerCase().includes(normalizedQuery);
          const ideaMatch = (project.idea ?? "").toLowerCase().includes(normalizedQuery);
          return nameMatch || ideaMatch;
        })
      : filteredProjects;

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
  }, [filteredProjects, searchValue, sort]);

  return (
    <WorkspaceShell
      workspaceName={workspaceName}
      projectName={projectName}
      breadcrumbRoot={workspaceName}
      currentPage="Projects"
      currentSection="/projects"
      initials={initials}
      avatarUrl={avatarUrl}
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

              <section className="projects-toolbar-row">
                <div className="projects-toolbar-left">
                  <label className="projects-search">
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="6.5" />
                      <path d="m16 16 4 4" />
                    </svg>
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(event) => setSearchValue(event.target.value)}
                      placeholder="Search projects..."
                    />
                  </label>

                  <div ref={wsDropdownRef} style={{ position: "relative" }}>
                    <button
                      type="button"
                      onClick={() => setWsDropdownOpen((o) => !o)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        height: 38,
                        padding: "0 12px",
                        borderRadius: 8,
                        background:
                          selectedWorkspaceName === "all"
                            ? "#13131e"
                            : "var(--accent-subtle)",
                        border:
                          selectedWorkspaceName === "all"
                            ? "1px solid #252538"
                            : "1px solid var(--accent-muted)",
                        color:
                          selectedWorkspaceName === "all"
                            ? "#8c90a7"
                            : "var(--accent-text)",
                        fontSize: 12,
                        fontFamily: "Inter, sans-serif",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {selectedWorkspaceName === "all"
                        ? "All workspaces"
                        : (() => {
                            const selected = uniqueWorkspaces.find((item) => {
                              const rawItem = item as typeof item & { workspace_name?: string | null };
                              return (rawItem.workspace_name ?? item.name) === selectedWorkspaceName;
                            });
                            const rawSelected = selected as
                              | (typeof selected & { workspace_name?: string | null })
                              | undefined;
                            return rawSelected?.workspace_name ?? selected?.name ?? "Workspace";
                          })()}
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 4.5l3 3 3-3" />
                      </svg>
                    </button>

                    {wsDropdownOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "calc(100% + 6px)",
                          left: 0,
                          minWidth: 200,
                          background: "#13131e",
                          border: "1px solid #252538",
                          borderRadius: 10,
                          padding: 4,
                          zIndex: 100,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedWorkspaceName("all");
                            setWsDropdownOpen(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: 7,
                            background:
                              selectedWorkspaceName === "all"
                                ? "var(--accent-subtle)"
                                : "transparent",
                            border: "none",
                            color:
                              selectedWorkspaceName === "all"
                                ? "var(--accent-text)"
                                : "#c3c6d7",
                            fontSize: 12,
                            fontFamily: "Inter, sans-serif",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          All workspaces
                          {selectedWorkspaceName === "all" && (
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 12 12"
                              fill="none"
                              stroke="var(--accent)"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ marginLeft: "auto" }}
                            >
                              <polyline points="2,6 5,9 10,3" />
                            </svg>
                          )}
                        </button>
                        <div style={{ height: 1, background: "#1e1e2e", margin: "3px 4px" }} />
                        {uniqueWorkspaces.map((item) => {
                          const rawItem = item as typeof item & { workspace_name?: string | null };
                          const displayName = rawItem.workspace_name ?? item.name;
                          const isSelected = selectedWorkspaceName === displayName;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setSelectedWorkspaceName(displayName);
                                setWsDropdownOpen(false);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                width: "100%",
                                padding: "6px 10px",
                                borderRadius: 7,
                                background: isSelected ? "var(--accent-subtle)" : "transparent",
                                border: "none",
                                color: isSelected ? "var(--accent-text)" : "#c3c6d7",
                                fontSize: 12,
                                fontFamily: "Inter, sans-serif",
                                cursor: "pointer",
                                textAlign: "left",
                              }}
                            >
                              <span
                                style={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: 5,
                                  background: "var(--accent)",
                                  color: "white",
                                  display: "grid",
                                  placeItems: "center",
                                  fontSize: 9,
                                  fontWeight: 700,
                                  flexShrink: 0,
                                  fontFamily: '"Geist Mono", monospace',
                                }}
                              >
                                {displayName[0]?.toUpperCase() ?? "W"}
                              </span>
                              <span
                                style={{
                                  flex: 1,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {displayName}
                              </span>
                              {isSelected && (
                                <svg
                                  width="11"
                                  height="11"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  stroke="var(--accent)"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ flexShrink: 0 }}
                                >
                                  <polyline points="2,6 5,9 10,3" />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="sort-wrap" ref={sortRef}>
                    <button
                      type="button"
                      className="sort-btn"
                      onClick={() => setSortOpen((open) => !open)}
                    >
                      <span>{SORT_LABELS[sort]}</span>
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 4.5l3 3 3-3" />
                      </svg>
                    </button>
                    {sortOpen ? (
                      <div className="sort-menu">
                        {(Object.keys(SORT_LABELS) as ProjectsSortOption[]).map((option) => (
                          <button
                            key={option}
                            type="button"
                            className={`sort-option ${sort === option ? "active" : ""}`}
                            onClick={() => {
                              setSort(option);
                              setSortOpen(false);
                            }}
                          >
                            <span>{SORT_LABELS[option]}</span>
                            {sort === option ? (
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 12 12"
                                fill="none"
                                stroke="var(--accent)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="2,6 5,9 10,3" />
                              </svg>
                            ) : null}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="toolbar-spacer" />

                <div className="view-pill">
                  <button
                    type="button"
                    className={`view-btn ${view === "list" ? "active" : ""}`}
                    onClick={() => setView("list")}
                    aria-label="List view"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="13"
                      height="13"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M8 6h12M8 12h12M8 18h12M3 6h.01M3 12h.01M3 18h.01" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={`view-btn ${view === "grid" ? "active" : ""}`}
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="13"
                      height="13"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
                    </svg>
                  </button>
                </div>
              </section>

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
                    {displayedProjects.map((project) => {
                      const statusLabel =
                        project.status === "active"
                          ? "Active"
                          : project.status === "completed"
                            ? "Completed"
                            : project.status === "paused"
                              ? "Paused"
                              : "Not started";
                      const statusStyles =
                        project.status === "active"
                          ? {
                              color: "#22c55e",
                              borderColor: "rgba(34,197,94,0.28)",
                              background: "rgba(34,197,94,0.08)",
                            }
                          : project.status === "completed"
                            ? {
                                color: "#378add",
                                borderColor: "rgba(55,138,221,0.3)",
                                background: "rgba(55,138,221,0.08)",
                              }
                            : project.status === "paused"
                              ? {
                                  color: "#ffb700",
                                  borderColor: "rgba(255,183,0,0.28)",
                                  background: "rgba(255,183,0,0.08)",
                                }
                              : {
                                  color: "var(--text3)",
                                  borderColor: "var(--border2)",
                                  background: "var(--bg4)",
                                };
                      const progressColor =
                        project.status === "completed" || project.progress > 50
                          ? "#22c55e"
                          : "var(--accent)";

                      return (
                        <article
                          key={project.id}
                          className="project-row"
                          onClick={() => router.push(project.href)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              router.push(project.href);
                            }
                          }}
                        >
                          <div className="project-identity">
                            <div className="project-avatar" style={{ color: project.accentColor }}>
                              {project.name.trim().charAt(0).toUpperCase() || "P"}
                            </div>
                            <div className="project-copy">
                              <div className="project-name">{project.name}</div>
                              <div className="project-idea">{project.idea}</div>
                            </div>
                          </div>

                          <div className="progress-col">
                            <div className="progress-value">{project.progress}%</div>
                            <div className="progress-bar">
                              <span
                                className="progress-fill"
                                style={{ width: `${project.progress}%`, background: progressColor }}
                              />
                            </div>
                          </div>

                          <div
                            className={`tasks-col ${project.tasksDone === 0 ? "muted" : ""}`}
                          >
                            <span>
                              {project.tasksDone} / {project.tasksTotal} tasks
                            </span>
                          </div>

                          <div className="milestone-col">
                            {project.currentMilestoneTitle ? (
                              <div
                                style={{
                                  overflow: "hidden",
                                  minWidth: 0,
                                  maxWidth: "100%",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: project.currentMilestoneIsBoss
                                      ? "#ffb700"
                                      : "var(--text)",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {project.currentMilestoneIsBoss ? "⚔ " : ""}
                                  {project.currentMilestoneTitle}
                                </div>
                                <div style={{ fontSize: 11, color: "#5f5f7a", marginTop: 2 }}>
                                  {project.currentMilestoneIsBoss
                                    ? `${100 - (project.currentMilestoneProgress ?? 0)}% HP remaining`
                                    : `${project.currentMilestoneProgress ?? 0}% complete`}
                                </div>
                              </div>
                            ) : (
                              <span style={{ color: "#5f5f7a", fontSize: 12 }}>—</span>
                            )}
                          </div>

                          <div className="updated-col">{project.lastUpdated}</div>

                          <div className="status-col">
                            <span className="status-badge" style={statusStyles}>
                              <span
                                className="status-dot"
                                style={{ background: statusStyles.color }}
                              />
                              {statusLabel}
                            </span>
                          </div>

                          <div className="open-col">
                            <Link
                              href={project.href}
                              className="open-btn"
                              onClick={(event) => event.stopPropagation()}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                whiteSpace: "nowrap",
                                color: "var(--accent)",
                                textDecoration: "none",
                                fontSize: 13,
                                fontWeight: 500,
                              }}
                            >
                              Open <span aria-hidden="true">→</span>
                            </Link>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}

              {view === "grid" && (
                <section className="projects-grid">
                  {displayedProjects.map((project) => {
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
          .projects-toolbar-row {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .projects-toolbar-left {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
            min-width: 0;
          }
          .projects-search {
            flex: 1;
            max-width: 320px;
            height: 38px;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0 11px;
            border-radius: 8px;
            border: 1px solid var(--border2);
            background: #12121e;
            color: var(--text3);
            transition: border-color 0.3s ease;
          }
          .projects-search:focus-within {
            border-color: var(--accent);
          }
          .projects-search input {
            width: 100%;
            border: 0;
            outline: 0;
            background: transparent;
            color: var(--text);
            font-size: 12px;
          }
          .projects-search input::placeholder {
            color: var(--text3);
          }
          .sort-wrap {
            position: relative;
          }
          .sort-btn {
            height: 38px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 0 11px;
            border-radius: 8px;
            border: 1px solid var(--border2);
            background: #12121e;
            color: var(--text2);
            font-size: 12px;
            cursor: pointer;
          }
          .sort-menu {
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            min-width: 170px;
            border-radius: 10px;
            border: 1px solid var(--border2);
            background: #171722;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
            padding: 6px;
            z-index: 20;
          }
          .sort-option {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 8px 9px;
            border-radius: 8px;
            border: 0;
            background: transparent;
            color: var(--text2);
            font-size: 12px;
            cursor: pointer;
          }
          .sort-option:hover,
          .sort-option.active {
            background: var(--accent-subtle);
            color: var(--text);
          }
          .toolbar-spacer {
            flex: 1;
          }
          .view-pill {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 3px;
            border-radius: 999px;
            border: 1px solid var(--border2);
            background: #12121e;
          }
          .view-btn {
            width: 28px;
            height: 28px;
            border: 0;
            border-radius: 999px;
            background: transparent;
            color: var(--text3);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s ease, color 0.2s ease;
          }
          .view-btn.active {
            background: var(--accent-subtle);
            color: var(--accent-text);
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
          .project-row {
            display: grid;
            grid-template-columns: 1fr 180px 140px 160px 120px 100px 60px;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            border-radius: 10px;
            border: 1px solid var(--border2);
            background: #12121e;
            cursor: pointer;
            transition:
              border-color 0.3s ease,
              background-color 0.3s ease,
              transform 0.18s ease;
          }
          .project-row:hover {
            border-color: var(--accent);
            background: rgba(124, 110, 247, 0.03);
            transform: translateY(-1px);
          }
          .project-identity {
            min-width: 0;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .project-avatar {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            border: 1px solid var(--border2);
            background: var(--bg4);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            font-weight: 700;
            flex-shrink: 0;
          }
          .project-copy {
            min-width: 0;
          }
          .project-name {
            font-size: 13px;
            font-weight: 500;
            color: var(--text);
          }
          .project-idea {
            margin-top: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 10px;
            color: var(--text3);
          }
          .progress-col {
            display: flex;
            flex-direction: column;
            gap: 7px;
          }
          .progress-value {
            font-size: 11px;
            font-weight: 700;
            color: var(--text);
            font-family: "Geist Mono", monospace;
          }
          .progress-bar {
            width: 100%;
            height: 4px;
            border-radius: 999px;
            background: var(--bg4);
            overflow: hidden;
          }
          .progress-fill {
            display: block;
            height: 100%;
            border-radius: inherit;
          }
          .tasks-col {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            font-size: 11px;
            color: var(--text2);
          }
          .tasks-col.muted {
            color: var(--text3);
          }
          .milestone-col {
            min-width: 0;
          }
          .updated-col {
            font-size: 11px;
            color: var(--text3);
          }
          .status-col {
            display: flex;
            justify-content: flex-start;
          }
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 3px 9px;
            border-radius: 4px;
            border: 1px solid var(--border2);
            font-size: 10px;
            letter-spacing: 0.04em;
            font-family: "Geist Mono", monospace;
            white-space: nowrap;
          }
          .status-dot {
            width: 5px;
            height: 5px;
            border-radius: 999px;
            flex-shrink: 0;
          }
          .open-col {
            display: flex;
            justify-content: flex-end;
          }
          .open-btn {
            border: 0;
            background: transparent;
            color: var(--accent);
            font-size: 11px;
            font-weight: 500;
            text-decoration: none;
            cursor: pointer;
            transition: opacity 0.18s ease;
          }
          .open-btn:hover {
            opacity: 0.75;
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
