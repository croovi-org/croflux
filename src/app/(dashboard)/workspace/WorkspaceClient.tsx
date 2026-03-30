"use client";

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
};

export function WorkspaceClient({
  initials,
  userName,
  workspaceName,
  summary,
  projects,
}: WorkspaceClientProps) {
  const sidebarProjects = projects.map((project) => ({
    id: project.id,
    name: project.name,
    progress: project.progress,
    color: project.color,
  }));

  return (
    <WorkspaceShell
      workspaceName={workspaceName}
      breadcrumbRoot="Workspace"
      currentSection="/workspace"
      initials={initials}
      userName={userName}
      nextUpTask={null}
      nextUpContext={null}
      incompleteTaskCount={0}
      rank={null}
      milestones={[]}
      streak={summary.streakDays}
      hideAddTask
      sidebarMode="workspaceHome"
      sidebarProjects={sidebarProjects}
      activeProjectId={projects[0]?.id ?? null}
    >
      <main className="workspace-main">
        <div className="workspace-wrap">
          <section className="workspace-header">
            <div>
              <div className="workspace-eyebrow">Your workspace</div>
              <h1>Stay consistent. Ship faster.</h1>
              <p>Track progress across all your startup projects.</p>
            </div>

            <Link href="/onboarding" className="new-project-btn">
              <Plus size={14} />
              <span>New Project</span>
            </Link>
          </section>

          {projects.length > 0 ? (
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
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
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
      </main>

      <style jsx>{`
        .workspace-main {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
          background: #0f0f17;
        }
        .workspace-wrap {
          padding: 32px 36px;
        }
        .workspace-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }
        .workspace-eyebrow {
          margin-bottom: 6px;
          color: var(--accent);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: var(--mono);
        }
        h1 {
          margin: 0;
          color: var(--text);
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.025em;
        }
        p {
          margin: 6px 0 0;
          color: var(--text3);
          font-size: 13px;
          line-height: 1.6;
        }
        .new-project-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          border-radius: 8px;
          background: var(--accent);
          color: #fff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          flex-shrink: 0;
        }
        .new-project-btn:hover {
          background: var(--accent-hover);
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
          margin-bottom: 14px;
        }
        .section-head span {
          color: var(--text);
          font-size: 11px;
          font-weight: 500;
        }
        .section-head strong {
          color: var(--text3);
          font-size: 11px;
          font-family: var(--mono);
          font-weight: 500;
        }
        .project-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        .new-project-card {
          min-height: 200px;
          padding: 32px 20px;
          border-radius: 12px;
          border: 1.5px dashed var(--border2);
          background: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          text-decoration: none;
          transition:
            border-color 0.18s ease,
            background-color 0.18s ease,
            transform 0.18s ease;
        }
        .new-project-card:hover {
          border-color: var(--accent);
          background: var(--accent-subtle);
          transform: translateY(-2px);
        }
        .new-card-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          margin-bottom: 12px;
          border-radius: 10px;
          border: 1px solid var(--border2);
          background: var(--bg4);
          color: var(--text3);
        }
        .new-project-card:hover .new-card-icon {
          border-color: var(--accent);
          background: var(--accent-subtle);
          color: var(--accent);
        }
        .new-card-title {
          margin-bottom: 4px;
          color: var(--text2);
          font-size: 13px;
          font-weight: 500;
        }
        .new-project-card:hover .new-card-title {
          color: var(--accent);
        }
        .new-card-copy {
          color: var(--text3);
          font-size: 11px;
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
