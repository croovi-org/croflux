"use client";

import type { Milestone, Task } from "@/types";
import { TaskRow } from "./TaskRow";

type Badge =
  | { type: "github"; label: string }
  | { type: "calendar"; label: string }
  | null;

type BossMilestoneProps = {
  milestone: Milestone & { tasks: Task[] };
  progress: number;
  onTaskComplete: (milestoneId: string, taskId: string) => void;
  getTaskBadge: (taskIndex: number) => Badge;
};

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.8 6.5 6v5c0 4 2.6 7.2 5.5 9.2 2.9-2 5.5-5.2 5.5-9.2V6L12 3.8Z" />
    </svg>
  );
}

export function BossMilestone({
  milestone,
  progress,
  onTaskComplete,
  getTaskBadge,
}: BossMilestoneProps) {
  const defeated = progress === 100;

  return (
    <section className="boss-shell">
      <div className="boss-top">
        <div className="boss-icon">
          <ShieldIcon />
        </div>
        <div className="boss-title">{milestone.title}</div>
        <div className="boss-pill">BOSS</div>
      </div>

      <div className="boss-hp">
        <div className="boss-hp-top">
          <span>{defeated ? "DEFEATED" : "Boss health"}</span>
          <span>{progress}%</span>
        </div>
        <div className="boss-progress-bar">
          <span
            className={`boss-progress-fill ${defeated ? "defeated" : ""}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="boss-tasks">
        {milestone.tasks.map((task, index) => (
          <TaskRow
            key={task.id}
            id={task.id}
            title={task.title}
            completed={task.completed}
            badge={getTaskBadge(index)}
            isLast={index === milestone.tasks.length - 1}
            onComplete={(taskId) => onTaskComplete(milestone.id, taskId)}
          />
        ))}
      </div>

      <style jsx>{`
        .boss-shell {
          margin-bottom: 8px;
          overflow: hidden;
          border: 1px solid rgba(255, 183, 0, 0.2);
          border-radius: 10px;
          background: #12121e;
        }
        .boss-top {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px 8px;
        }
        .boss-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--amber-dim);
          border: 1px solid rgba(255, 183, 0, 0.2);
          display: grid;
          place-items: center;
        }
        .boss-icon :global(svg) {
          width: 12px;
          height: 12px;
          stroke: var(--amber);
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
        }
        .boss-title {
          flex: 1;
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
        }
        .boss-pill {
          border-radius: 4px;
          border: 1px solid rgba(255, 183, 0, 0.25);
          background: var(--amber-dim);
          padding: 2px 7px;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--amber);
        }
        .boss-hp {
          padding: 0 15px 8px;
        }
        .boss-hp-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }
        .boss-hp-top span {
          font-size: 10px;
          color: ${""}var(--amber);
          font-family: var(--mono);
        }
        .boss-progress-bar {
          height: 4px;
          overflow: hidden;
          border-radius: 2px;
          background: var(--bg4);
        }
        .boss-progress-fill {
          display: block;
          height: 100%;
          background: var(--amber);
          transition: width 0.5s ease;
        }
        .boss-progress-fill.defeated {
          background: var(--green);
        }
        .boss-tasks {
          padding: 0 15px 8px;
        }
      `}</style>
    </section>
  );
}
