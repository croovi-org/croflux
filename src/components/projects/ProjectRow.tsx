"use client";

import { Check, CheckSquare, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export type ProjectsPageRow = {
  id: string;
  name: string;
  idea: string;
  progress: number;
  tasksDone: number;
  tasksTotal: number;
  currentBoss: string | null;
  bossHp: number | null;
  bossesDefeated: number;
  lastUpdated: string;
  status: "active" | "paused" | "completed" | "not_started";
  href: string;
  accentColor: string;
  createdAt: string;
  updatedAtValue: number;
};

type ProjectRowProps = {
  project: ProjectsPageRow;
};

const STATUS_META = {
  active: {
    label: "Active",
    dot: "#22c55e",
    text: "#22c55e",
    border: "rgba(34,197,94,0.28)",
    background: "rgba(34,197,94,0.08)",
  },
  paused: {
    label: "Paused",
    dot: "#ffb700",
    text: "#ffb700",
    border: "rgba(255,183,0,0.28)",
    background: "rgba(255,183,0,0.08)",
  },
  completed: {
    label: "Completed",
    dot: "#378add",
    text: "#378add",
    border: "rgba(55,138,221,0.3)",
    background: "rgba(55,138,221,0.08)",
  },
  not_started: {
    label: "Not started",
    dot: "#66677d",
    text: "var(--text3)",
    border: "var(--border2)",
    background: "var(--bg4)",
  },
} as const;

export function ProjectRow({ project }: ProjectRowProps) {
  const router = useRouter();
  const statusMeta = STATUS_META[project.status];
  const progressColor =
    project.status === "completed" || project.progress > 50 ? "#22c55e" : "var(--accent)";
  const taskMuted = project.tasksDone === 0;

  return (
    <article
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

      <div className={`tasks-col ${taskMuted ? "muted" : ""}`}>
        <CheckSquare size={13} />
        <span>
          {project.tasksDone} / {project.tasksTotal} tasks
        </span>
      </div>

      <div className="boss-col">
        {project.currentBoss ? (
          <>
            <div className="boss-top">
              <Shield size={12} />
              <span>{project.currentBoss}</span>
            </div>
            <div className="boss-sub">{project.bossHp}% HP remaining</div>
          </>
        ) : project.bossesDefeated > 0 ? (
          <div className="boss-done">
            <Check size={13} />
            <span>
              {project.bossesDefeated} boss{project.bossesDefeated === 1 ? "" : "es"} defeated
            </span>
          </div>
        ) : (
          <span className="boss-empty">--</span>
        )}
      </div>

      <div className="updated-col">{project.lastUpdated}</div>

      <div className="status-col">
        <span
          className="status-badge"
          style={{
            color: statusMeta.text,
            borderColor: statusMeta.border,
            background: statusMeta.background,
          }}
        >
          <span className="status-dot" style={{ background: statusMeta.dot }} />
          {statusMeta.label}
        </span>
      </div>

      <div className="open-col">
        <button
          type="button"
          className="open-btn"
          onClick={(event) => {
            event.stopPropagation();
            router.push(project.href);
          }}
        >
          Open <span aria-hidden="true">→</span>
        </button>
      </div>

      <style jsx>{`
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
        .boss-col {
          min-width: 0;
        }
        .boss-top,
        .boss-done {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
          font-size: 11px;
          white-space: nowrap;
        }
        .boss-top {
          color: #ffb700;
        }
        .boss-done {
          color: #22c55e;
        }
        .boss-sub {
          margin-top: 2px;
          font-size: 10px;
          color: var(--text3);
          font-family: "Geist Mono", monospace;
        }
        .boss-empty,
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
          cursor: pointer;
          transition: opacity 0.18s ease;
        }
        .open-btn:hover {
          opacity: 0.75;
        }
      `}</style>
    </article>
  );
}
