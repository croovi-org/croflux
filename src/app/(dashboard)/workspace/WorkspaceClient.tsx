"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { EmptyProjects } from "@/components/workspace/EmptyProjects";
import { ProjectCard } from "@/components/workspace/ProjectCard";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

export type WorkspaceProjectSummary = {
  id: string;
  name: string;
  idea: string;
  progress: number;
  totalTasks: number;
  doneTasks: number;
  href: string;
  lastWorkedLabel: string;
  status: "active" | "idle" | "not_started";
  streak: number;
  boss: {
    state: "active" | "defeated" | "none";
    label: string | null;
  };
  color: string;
  initial: string;
};

export type WorkspaceSummary = {
  projectCount: number;
  totalCompletedTasks: number;
  streakDays: number;
  bossesDefeated: number;
};

type WorkspaceClientProps = {
  initials: string;
  userName: string;
  workspaceName: string;
  summary: WorkspaceSummary;
  projects: WorkspaceProjectSummary[];
  nextUpTask: string | null;
  nextUpContext: string | null;
  incompleteTaskCount: number;
  rank: number | null;
  milestones: Array<{
    id: string;
    title: string;
    progress: number;
    state: "active" | "locked" | "done";
  }>;
};

export function WorkspaceClient({
  initials,
  userName,
  workspaceName,
  summary,
  projects,
  nextUpTask,
  nextUpContext,
  incompleteTaskCount,
  rank,
  milestones,
}: WorkspaceClientProps) {
  const [previewMode, setPreviewMode] = useState<"projects" | "empty">(
    projects.length > 0 ? "projects" : "empty",
  );

  return (
    <WorkspaceShell
      workspaceName={workspaceName}
      breadcrumbRoot="Workspace"
      currentSection="/workspace"
      initials={initials}
      userName={userName}
      nextUpTask={nextUpTask}
      nextUpContext={nextUpContext}
      incompleteTaskCount={incompleteTaskCount}
      rank={rank}
      milestones={milestones}
      streak={summary.streakDays}
      hideAddTask
    >
      <main className="workspace-main">
        <div className="workspace-scale">
          <div className="workspace-wrap">
            <section className="preview-strip">
              <span className="preview-label">Preview:</span>
              <div className="preview-actions">
                <button
                  type="button"
                  className={`preview-btn ${previewMode === "projects" ? "active" : ""}`}
                  onClick={() => setPreviewMode("projects")}
                >
                  With projects
                </button>
                <button
                  type="button"
                  className={`preview-btn ${previewMode === "empty" ? "active" : ""}`}
                  onClick={() => setPreviewMode("empty")}
                >
                  Empty state
                </button>
              </div>
            </section>

            <section className="workspace-header">
              <div>
                <div className="workspace-eyebrow">Your workspace</div>
                <h1>Stay consistent. Ship faster.</h1>
                <p>Track progress across all your startup projects.</p>
              </div>

              <Link
                href="/onboarding"
                className="new-project-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: "10px",
                  height: "47px",
                  padding: "0 23px",
                  borderRadius: "16px",
                  background: "var(--accent)",
                  color: "#fff",
                  whiteSpace: "nowrap",
                  boxShadow: "0 8px 24px color-mix(in srgb, var(--accent) 22%, transparent)",
                }}
              >
                <Plus size={14} />
                <span>New Project</span>
              </Link>
            </section>

            {previewMode === "projects" && projects.length > 0 ? (
              <>
                <section className="summary-strip">
                  <div className="summary-chip">
                    <span className="summary-dot accent" />
                    <strong>{summary.projectCount}</strong>
                    <span>projects</span>
                  </div>
                  <div className="summary-chip">
                    <span className="summary-dot green" />
                    <strong>{summary.totalCompletedTasks}</strong>
                    <span>tasks done</span>
                  </div>
                  <div className="summary-chip">
                    <span className="summary-dot amber" />
                    <strong>{summary.streakDays}</strong>
                    <span>day streak</span>
                  </div>
                  <div className="summary-chip">
                    <span className="summary-dot muted" />
                    <strong>{summary.bossesDefeated}</strong>
                    <span>bosses defeated</span>
                  </div>
                </section>

                <section>
                  <div className="section-head">
                    <span>Projects</span>
                    <strong>{projects.length} total</strong>
                  </div>

                  <div className="project-grid">
                    {projects.map((project, index) => (
                      <ProjectCard key={project.id} project={project} active={index === 0} />
                    ))}

                    <Link href="/onboarding" className="new-project-card">
                      <span className="new-card-icon">
                        <Plus size={18} />
                      </span>
                      <span className="new-card-title">New project</span>
                      <span className="new-card-copy">
                        Start a fresh roadmap and generate your next execution plan.
                      </span>
                    </Link>
                  </div>
                </section>
              </>
            ) : (
              <EmptyProjects />
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .workspace-main {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
          background: #0f0f17;
        }
        .workspace-scale {
          width: 119.0476190476%;
          transform: scale(0.84);
          transform-origin: top left;
        }
        .workspace-wrap {
          padding: 32px 36px;
        }
        .preview-strip {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 61px;
          margin-bottom: 30px;
          padding: 0 20px;
          border: 1px solid var(--border2);
          border-radius: 14px;
          background: rgba(19, 19, 30, 0.35);
        }
        .preview-label {
          color: var(--text3);
          font-size: 14px;
        }
        .preview-actions {
          display: inline-flex;
          gap: 8px;
        }
        .preview-btn {
          height: 34px;
          padding: 0 18px;
          border-radius: 9px;
          border: 1px solid var(--border2);
          background: var(--bg3);
          color: var(--text3);
          font-size: 14px;
          line-height: 1;
        }
        .preview-btn.active {
          border-color: var(--purple-border);
          background: var(--accent-subtle);
          color: var(--accent);
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 10%, transparent);
        }
        .workspace-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 32px;
        }
        .workspace-eyebrow {
          margin-bottom: 6px;
          color: var(--accent);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: var(--mono);
        }
        h1 {
          margin: 0;
          color: var(--text);
          font-size: 24px;
          font-weight: 600;
          letter-spacing: -0.025em;
        }
        p {
          margin: 0;
          color: var(--text3);
          font-size: 14px;
          line-height: 1.6;
        }
        .new-project-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 48px;
          padding: 12px 22px;
          border-radius: 8px;
          background: var(--accent);
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          flex-shrink: 0;
          white-space: nowrap;
          box-shadow: 0 8px 24px color-mix(in srgb, var(--accent) 22%, transparent);
        }
        .new-project-btn:hover {
          background: color-mix(in srgb, var(--accent) 90%, black 10%);
        }
        .new-project-btn :global(svg) {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
        .summary-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 28px;
        }
        .summary-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          background: var(--bg3);
          border: 1px solid var(--border2);
          border-radius: 8px;
        }
        .summary-chip strong {
          color: var(--text);
          font-size: 14px;
          font-family: var(--mono);
        }
        .summary-chip span:last-child {
          color: var(--text3);
          font-size: 11px;
        }
        .summary-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          flex-shrink: 0;
        }
        .summary-dot.accent {
          background: var(--accent);
        }
        .summary-dot.green {
          background: var(--green);
        }
        .summary-dot.amber {
          background: var(--amber);
        }
        .summary-dot.muted {
          background: var(--text3);
        }
        .section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .section-head span {
          color: var(--text);
          font-size: 12px;
          font-weight: 500;
        }
        .section-head strong {
          color: var(--text3);
          font-size: 12px;
          font-family: var(--mono);
          font-weight: 500;
        }
        .project-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          align-items: stretch;
          margin-bottom: 28px;
        }
        .new-project-card {
          width: 100%;
          min-height: 220px;
          padding: 35px 22px;
          border-radius: 12px;
          border: 1.5px dashed var(--border2);
          background: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .new-project-card:hover {
          border-color: var(--accent);
          background: var(--accent-subtle);
        }
        .new-card-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          margin-bottom: 13px;
          border-radius: 10px;
          border: 1px solid var(--border2);
          background: var(--bg4);
          color: var(--text3);
          transition: all 0.15s ease;
        }
        .new-project-card:hover .new-card-icon {
          border-color: var(--accent);
          background: var(--accent-subtle);
          color: var(--accent);
        }
        .new-card-title {
          margin-bottom: 5px;
          color: var(--text2);
          font-size: 14px;
          font-weight: 500;
          transition: color 0.15s ease;
        }
        .new-project-card:hover .new-card-title {
          color: var(--accent);
        }
        .new-card-copy {
          color: var(--text3);
          font-size: 12px;
          line-height: 1.5;
        }
        @media (max-width: 1180px) {
          .project-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 760px) {
          .workspace-wrap {
            padding: 24px 18px 28px;
          }
          .preview-strip {
            flex-direction: column;
            align-items: flex-start;
            padding: 14px 16px;
          }
          .workspace-header {
            flex-direction: column;
            align-items: stretch;
          }
          .project-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </WorkspaceShell>
  );
}
