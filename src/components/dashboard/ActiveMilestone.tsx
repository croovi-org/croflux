"use client";

import { useState } from "react";
import type { Milestone, Task } from "@/types";
import { TaskRow } from "./TaskRow";

type ActiveMilestoneProps = {
  milestone: Milestone & { tasks: Task[] };
  progress: number;
  onTaskComplete: (milestoneId: string, taskId: string) => void;
  onTaskDelete?: (milestoneId: string, taskId: string) => void;
};

function MilestoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m8 10 4 4 4-4" />
    </svg>
  );
}

export function ActiveMilestone({
  milestone,
  progress,
  onTaskComplete,
  onTaskDelete,
}: ActiveMilestoneProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="milestone-shell">
      <button
        type="button"
        className="milestone-top"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
      >
        <div className="milestone-icon">
          <MilestoneIcon />
        </div>
        <div className="milestone-title">{milestone.title}</div>
        <div className="milestone-pill">MILESTONE</div>
        <span className={`milestone-chevron ${expanded ? "open" : ""}`}>
          <ChevronIcon />
        </span>
      </button>

      <div className="milestone-progress">
        <div className="milestone-progress-top">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="milestone-progress-bar">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      {expanded ? (
        <div className="milestone-tasks">
          {milestone.tasks.map((task, index) => (
            <TaskRow
              key={task.id}
              id={task.id}
              title={task.title}
              completed={task.completed}
              difficulty={
                (task as Task & { difficulty?: "easy" | "medium" | "hard" }).difficulty
              }
              badge={null}
              isLast={index === milestone.tasks.length - 1}
              onComplete={(taskId) => onTaskComplete(milestone.id, taskId)}
              onDelete={
                onTaskDelete
                  ? (taskId) => onTaskDelete(milestone.id, taskId)
                  : undefined
              }
            />
          ))}
        </div>
      ) : null}

      <style jsx>{`
        .milestone-shell {
          margin-bottom: 8px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          background: #12121e;
        }
        .milestone-top {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          border: 0;
          background: transparent;
          text-align: left;
          cursor: pointer;
          padding: 12px 15px 8px;
        }
        .milestone-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--accent-subtle);
          border: 1px solid var(--purple-border);
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .milestone-icon :global(svg) {
          width: 12px;
          height: 12px;
          stroke: var(--accent);
          stroke-width: 2;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .milestone-title {
          flex: 1;
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
        }
        .milestone-pill {
          border-radius: 4px;
          border: 1px solid var(--purple-border);
          background: var(--accent-subtle);
          padding: 2px 7px;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--accent);
        }
        .milestone-chevron {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          display: grid;
          place-items: center;
          color: #8f90a6;
          transition: transform 0.18s ease;
          flex-shrink: 0;
          transform: rotate(-90deg);
        }
        .milestone-chevron.open {
          transform: rotate(0deg);
        }
        .milestone-chevron :global(svg) {
          width: 11px;
          height: 11px;
          stroke: currentColor;
          stroke-width: 2;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .milestone-progress {
          padding: 0 15px 8px;
        }
        .milestone-progress-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }
        .milestone-progress-top span {
          font-size: 10px;
          color: var(--accent);
          font-family: var(--mono);
        }
        .milestone-progress-bar {
          height: 4px;
          overflow: hidden;
          border-radius: 2px;
          background: var(--bg4);
        }
        .milestone-progress-bar span {
          display: block;
          height: 100%;
          background: var(--accent);
          transition: width 0.5s ease;
        }
        .milestone-tasks {
          padding: 0 15px 8px;
        }
      `}</style>
    </section>
  );
}
