"use client";

type Badge =
  | { type: "github"; label: string }
  | { type: "calendar"; label: string }
  | null;

type TaskRowProps = {
  id: string;
  title: string;
  completed: boolean;
  difficulty?: "easy" | "medium" | "hard";
  isLast?: boolean;
  badge?: Badge;
  onComplete: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
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
  difficulty,
  isLast = false,
  badge = null,
  onComplete,
  onDelete,
}: TaskRowProps) {
  return (
    <div className={`task-row ${completed ? "done" : ""} ${isLast ? "last" : ""}`}>
      <button
        type="button"
        className="task-main"
        onClick={() => !completed && onComplete(id)}
        disabled={completed}
      >
        <span className={`task-checkbox ${completed ? "done" : ""}`}>
          {completed ? <CheckIcon /> : null}
        </span>
        <span className="task-name">{title}</span>
        {difficulty ? (
          <span className={`task-difficulty-badge ${difficulty}`}>
            {difficulty}
          </span>
        ) : null}
        {badge ? (
          <span className={`task-badge ${badge.type}`}>
            {badge.type === "github" ? <GithubMark /> : <CalendarIcon />}
            {badge.label}
          </span>
        ) : null}
      </button>
      {onDelete ? (
        <button
          type="button"
          className="task-delete"
          aria-label={`Delete ${title}`}
          onClick={() => onDelete(id)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M10 11v6m4-6v6M8 7l1-2h6l1 2m-9 0 1 12h8l1-12" />
          </svg>
        </button>
      ) : null}

      <style jsx>{`
        .task-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 8px;
          border-bottom: 1px solid var(--border);
          border-radius: 8px;
        }
        .task-main {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0;
          border: 0;
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
          transform: translateX(0) translateY(0);
          transition:
            transform 0.18s ease,
            background 0.18s ease,
            box-shadow 0.18s ease;
        }
        .task-main:disabled {
          cursor: default;
        }
        .task-row:not(.done) .task-main:hover {
          background: rgba(255, 255, 255, 0.028);
          transform: translateX(6px) translateY(-2px);
          box-shadow: 0 10px 18px rgba(8, 8, 14, 0.18);
          border-radius: 8px;
          padding: 4px 6px;
          margin: -4px -6px;
        }
        .task-row.last {
          border-bottom: none;
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
        .task-difficulty-badge {
          font-size: 10px;
          font-family: "Geist Mono", monospace;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 2px 7px;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .task-difficulty-badge.easy {
          background: rgba(34, 197, 94, 0.12);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }
        .task-difficulty-badge.medium {
          background: rgba(251, 191, 36, 0.12);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.2);
        }
        .task-difficulty-badge.hard {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .task-delete {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          color: #6f738a;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          transition: border-color 0.14s ease, color 0.14s ease, background 0.14s ease;
        }
        .task-delete:hover {
          border-color: rgba(239, 68, 68, 0.4);
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
        .task-delete :global(svg) {
          width: 12px;
          height: 12px;
          stroke: currentColor;
          stroke-width: 1.8;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `}</style>
    </div>
  );
}
