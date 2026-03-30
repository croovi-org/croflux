"use client";

import Link from "next/link";
import { CheckSquare, CheckCircle2, Shield } from "lucide-react";
import type { WorkspaceProjectSummary } from "@/app/(dashboard)/workspace/WorkspaceClient";

export function ProjectCard({
  project,
  active = false,
}: {
  project: WorkspaceProjectSummary;
  active?: boolean;
}) {
  return (
    <Link
      href={project.href}
      className={`project-card ${active ? "active-card" : ""}`}
    >
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
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
          background: #0f0e16;
          border: 0;
          border-radius: 0;
          padding: 0;
          overflow: hidden;
          cursor: pointer;
          text-decoration: none;
          transition:
            box-shadow 0.18s ease,
            transform 0.18s ease;
        }
        .project-card.active-card {
          box-shadow: none;
        }
        .project-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.24);
        }
        .project-card-top {
          padding: 20px 20px 16px;
          flex: 1;
          background: #0f0e16;
        }
        .project-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 13px;
        }
        .project-card-icon {
          width: 35px;
          height: 35px;
          border-radius: 9px;
          background: var(--bg4);
          border: 1px solid var(--border2);
          color: var(--accent);
          display: grid;
          place-items: center;
          font-size: 15px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .project-status {
          display: inline-flex;
          align-items: center;
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
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 5px;
          color: var(--text);
          letter-spacing: -0.01em;
        }
        .project-idea {
          font-size: 12px;
          margin-bottom: 15px;
          color: var(--text3);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .project-progress {
          margin-bottom: 11px;
        }
        .project-progress-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 7px;
        }
        .project-progress-head span {
          font-size: 11px;
          color: var(--text3);
          letter-spacing: 0.04em;
        }
        .project-progress-head strong {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          font-family: var(--mono);
        }
        .project-progress-bar {
          height: 5px;
          background: var(--bg4);
          border-radius: 2px;
          overflow: hidden;
        }
        .project-progress-fill {
          height: 100%;
          position: relative;
          border-radius: 2px;
          background: var(--accent);
          transition: width 0.4s ease;
        }
        .project-progress-fill::after {
          content: "";
          position: absolute;
          right: -1px;
          top: -2px;
          width: 11px;
          height: 11px;
          border-radius: 999px;
          background: var(--accent);
          border: 2px solid #0f0e16;
        }
        .project-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 5px;
        }
        .project-tasks {
          font-size: 12px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--text2);
        }
        .project-tasks :global(svg) {
          stroke: var(--text3);
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          width: 13px;
          height: 13px;
          color: var(--text3);
        }
        .project-streak {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--amber);
          font-size: 12px;
          font-weight: 500;
        }
        .project-boss {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 5px;
          font-size: 11px;
          font-family: var(--mono);
        }
        .project-boss :global(svg) {
          width: 11px;
          height: 11px;
        }
        .project-boss.active {
          color: var(--amber);
        }
        .project-boss.defeated {
          color: var(--green);
        }
        .project-card-footer {
          padding: 11px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          background: #0f0e16;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .project-footer-copy {
          font-size: 11px;
          color: var(--text3);
        }
        .project-footer-copy span {
          color: var(--text2);
        }
        .project-open {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--accent);
          font-size: 11px;
          font-weight: 500;
        }
      `}</style>
    </Link>
  );
}
