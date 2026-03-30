"use client";

import Link from "next/link";
import { CheckSquare, CheckCircle2, Shield } from "lucide-react";
import type { WorkspaceProjectSummary } from "@/app/(dashboard)/workspace/WorkspaceClient";

export function ProjectCard({ project }: { project: WorkspaceProjectSummary }) {
  return (
    <Link href={project.href} className="project-card">
      <div className="project-card-top">
        <div className="project-card-header">
          <div className="project-card-icon">{project.initial}</div>
          <span className={`project-status ${project.status}`}>
            {project.status === "active"
              ? "Active"
              : project.status === "idle"
                ? "Idle"
                : "Not started"}
          </span>
        </div>

        <div className="project-name">{project.name}</div>
        <div className="project-idea">{project.idea}</div>

        <div className="project-progress">
          <div className="project-progress-head">
            <span>Launch progress</span>
            <strong>{project.progress}%</strong>
          </div>
          <div className="project-progress-bar">
            <div className="project-progress-fill" style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        <div className="project-meta-row">
          <div className="project-tasks">
            <CheckSquare size={12} />
            <span>
              {project.doneTasks} / {project.totalTasks} tasks done
            </span>
          </div>
          {project.streak > 0 ? <div className="project-streak">⚡ {project.streak}d</div> : null}
        </div>

        {project.boss.label ? (
          <div className={`project-boss ${project.boss.state}`}>
            {project.boss.state === "defeated" ? <CheckCircle2 size={10} /> : <Shield size={10} />}
            <span>{project.boss.label}</span>
          </div>
        ) : null}
      </div>

      <div className="project-card-footer">
        <span className="project-footer-copy">
          Last worked on <span>{project.lastWorkedLabel}</span>
        </span>
        <span className="project-open">Open →</span>
      </div>

      <style jsx>{`
        .project-card {
          background: var(--bg3);
          border: 1px solid var(--border2);
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
          transition:
            border-color 0.18s ease,
            transform 0.18s ease,
            box-shadow 0.18s ease;
        }
        .project-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.24);
        }
        .project-card-top {
          padding: 18px 18px 14px;
        }
        .project-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }
        .project-card-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid var(--border2);
          background: var(--bg4);
          color: var(--accent);
          display: grid;
          place-items: center;
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .project-status {
          display: inline-flex;
          align-items: center;
          min-height: 18px;
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 500;
          font-family: var(--mono);
        }
        .project-status.active {
          background: var(--green-dim);
          border: 1px solid rgba(34, 197, 94, 0.2);
          color: var(--green);
        }
        .project-status.idle,
        .project-status.not_started {
          background: var(--bg4);
          border: 1px solid var(--border2);
          color: var(--text3);
        }
        .project-name {
          margin-bottom: 4px;
          color: var(--text);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        .project-idea {
          margin-bottom: 14px;
          color: var(--text3);
          font-size: 11px;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .project-progress {
          margin-bottom: 10px;
        }
        .project-progress-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .project-progress-head span {
          color: var(--text3);
          font-size: 10px;
          letter-spacing: 0.04em;
        }
        .project-progress-head strong {
          color: var(--text);
          font-size: 13px;
          font-weight: 700;
          font-family: var(--mono);
        }
        .project-progress-bar {
          height: 4px;
          border-radius: 2px;
          background: var(--bg4);
          overflow: hidden;
        }
        .project-progress-fill {
          position: relative;
          height: 100%;
          border-radius: 2px;
          background: var(--accent);
        }
        .project-progress-fill::after {
          content: "";
          position: absolute;
          right: -1px;
          top: -3px;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--accent);
          border: 2px solid var(--bg3);
        }
        .project-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 4px;
        }
        .project-tasks {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--text2);
          font-size: 11px;
        }
        .project-tasks :global(svg) {
          color: var(--text3);
        }
        .project-streak {
          color: var(--amber);
          font-size: 11px;
          font-weight: 500;
        }
        .project-boss {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 4px;
          font-size: 10px;
          font-family: var(--mono);
        }
        .project-boss.active {
          color: var(--amber);
        }
        .project-boss.defeated {
          color: var(--green);
        }
        .project-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 18px;
          border-top: 1px solid var(--border);
          background: var(--bg4);
        }
        .project-footer-copy {
          color: var(--text3);
          font-size: 10px;
        }
        .project-footer-copy span {
          color: var(--text2);
        }
        .project-open {
          color: var(--accent);
          font-size: 10px;
          font-weight: 500;
        }
      `}</style>
    </Link>
  );
}
