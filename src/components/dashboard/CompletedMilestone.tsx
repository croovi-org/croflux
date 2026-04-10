"use client";

import { useState } from "react";
import type { Milestone, Task } from "@/types";

type CompletedMilestoneProps = {
  milestone: Milestone & { tasks: Task[] };
  defaultExpanded?: boolean;
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6.8 12 3.3 3.4 7-7.4" />
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

export function CompletedMilestone({
  milestone,
  defaultExpanded = false,
}: CompletedMilestoneProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <section className="completed-shell">
      <button
        type="button"
        className="completed-top"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
      >
        <div className="completed-icon">
          <CheckIcon />
        </div>
        <div className="completed-title">{milestone.title}</div>
        <div className="completed-pill">COMPLETED</div>
        <span className={`completed-chevron ${expanded ? "open" : ""}`}>
          <ChevronIcon />
        </span>
      </button>

      {expanded ? (
        <div className="completed-tasks">
          {milestone.tasks.map((task, index) => (
            <div
              key={task.id}
              className={`completed-task ${index === milestone.tasks.length - 1 ? "last" : ""}`}
            >
              <span className="task-checkbox done">
                <CheckIcon />
              </span>
              <span className="task-name">{task.title}</span>
            </div>
          ))}
        </div>
      ) : null}

      <style jsx>{`
        .completed-shell {
          margin-bottom: 8px;
          overflow: hidden;
          border: 1px solid rgba(34, 197, 94, 0.22);
          border-radius: 10px;
          background: #12121e;
          opacity: 1;
          pointer-events: auto;
        }
        .completed-top {
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
        .completed-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.28);
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .completed-icon :global(svg) {
          width: 12px;
          height: 12px;
          stroke: #22c55e;
          stroke-width: 2;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .completed-title {
          flex: 1;
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
        }
        .completed-pill {
          border-radius: 4px;
          border: 1px solid rgba(34, 197, 94, 0.3);
          background: rgba(34, 197, 94, 0.12);
          padding: 2px 7px;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #22c55e;
        }
        .completed-chevron {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          display: grid;
          place-items: center;
          color: #239354;
          transition: transform 0.18s ease;
          flex-shrink: 0;
          transform: rotate(-90deg);
        }
        .completed-chevron.open {
          transform: rotate(0deg);
        }
        .completed-chevron :global(svg) {
          width: 11px;
          height: 11px;
          stroke: currentColor;
          stroke-width: 2;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .completed-tasks {
          padding: 0 15px 8px;
        }
        .completed-task {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 7px 8px;
          border-bottom: 1px solid var(--border);
          border-radius: 8px;
        }
        .completed-task.last {
          border-bottom: none;
        }
        .task-checkbox {
          width: 14px;
          height: 14px;
          border-radius: 4px;
          border: 1px solid rgba(34, 197, 94, 0.28);
          display: grid;
          place-items: center;
          flex-shrink: 0;
          background: #22c55e;
        }
        .task-checkbox :global(svg) {
          width: 9px;
          height: 9px;
          stroke: white;
          stroke-width: 2;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .task-name {
          flex: 1;
          font-size: 12px;
          color: var(--text3);
          text-decoration: line-through;
        }
      `}</style>
    </section>
  );
}
