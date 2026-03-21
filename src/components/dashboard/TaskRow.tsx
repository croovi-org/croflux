"use client";

type Badge =
  | { type: "github"; label: string }
  | { type: "calendar"; label: string }
  | null;

type TaskRowProps = {
  id: string;
  title: string;
  completed: boolean;
  isLast?: boolean;
  badge?: Badge;
  onComplete: (taskId: string) => void;
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6.8 12 3.3 3.4 7-7.4" />
    </svg>
  );
}

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18.3c-3.4 1-3.4-1.7-4.7-2.1M18 20v-2.6a3 3 0 0 0-.8-2.3c2.6-.3 5.3-1.2 5.3-5.6a4.3 4.3 0 0 0-1.1-3 4 4 0 0 0-.1-2.9s-.9-.3-3 .9a10.1 10.1 0 0 0-5.4 0c-2.1-1.2-3-.9-3-.9a4 4 0 0 0-.1 2.9 4.3 4.3 0 0 0-1.1 3c0 4.3 2.7 5.2 5.3 5.6a3 3 0 0 0-.8 2.3V20" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="3" />
      <path d="M8 3.8v3.4M16 3.8v3.4M4 9.5h16" />
    </svg>
  );
}

export function TaskRow({
  id,
  title,
  completed,
  isLast = false,
  badge = null,
  onComplete,
}: TaskRowProps) {
  return (
    <button
      type="button"
      className={`task-row ${completed ? "done" : ""} ${isLast ? "last" : ""}`}
      onClick={() => !completed && onComplete(id)}
    >
      <span className={`task-checkbox ${completed ? "done" : ""}`}>
        {completed ? <CheckIcon /> : null}
      </span>
      <span className="task-name">{title}</span>
      {badge ? (
        <span className={`task-badge ${badge.type}`}>
          {badge.type === "github" ? <GithubMark /> : <CalendarIcon />}
          {badge.label}
        </span>
      ) : null}

      <style jsx>{`
        .task-row {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 7px 0;
          border-bottom: 1px solid var(--border);
          color: inherit;
          text-align: left;
          cursor: pointer;
          transition: all 0.12s ease;
        }
        .task-row:hover {
          background: rgba(255, 255, 255, 0.02);
          padding-left: 5px;
          margin-left: -5px;
          margin-right: -5px;
          border-radius: 4px;
        }
        .task-row.last {
          border-bottom: none;
        }
        .task-row.done {
          cursor: default;
        }
        .task-checkbox {
          width: 14px;
          height: 14px;
          border-radius: 4px;
          border: 1px solid var(--border2);
          display: grid;
          place-items: center;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }
        .task-checkbox.done {
          background: var(--accent);
          border-color: var(--accent);
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
          color: var(--text);
          font-weight: 400;
          opacity: 0.86;
        }
        .done .task-name {
          color: var(--text3);
          text-decoration: line-through;
        }
        .task-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid var(--border2);
          font-size: 9px;
          color: var(--text2);
          font-family: var(--mono);
          flex-shrink: 0;
        }
        .task-badge.github {
          background: var(--bg4);
        }
        .task-badge.calendar {
          background: rgba(66, 133, 244, 0.1);
          border-color: rgba(66, 133, 244, 0.2);
          color: #4285f4;
        }
        .task-badge :global(svg) {
          width: 9px;
          height: 9px;
          stroke: currentColor;
          stroke-width: 1.8;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `}</style>
    </button>
  );
}
