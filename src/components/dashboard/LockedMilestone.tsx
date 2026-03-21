"use client";

type LockedMilestoneProps = {
  title: string;
};

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="10" width="12" height="10" rx="2.5" />
      <path d="M8.5 10V7.8a3.5 3.5 0 1 1 7 0V10" />
    </svg>
  );
}

export function LockedMilestone({ title }: LockedMilestoneProps) {
  return (
    <div className="locked-shell">
      <div className="locked-icon">
        <LockIcon />
      </div>
      <div className="locked-title">{title}</div>
      <div className="locked-label">locked</div>

      <style jsx>{`
        .locked-shell {
          margin-bottom: 7px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: var(--bg3);
          padding: 10px 15px;
          opacity: 0.42;
          pointer-events: none;
        }
        .locked-icon {
          width: 24px;
          height: 24px;
          border-radius: 7px;
          border: 1px solid var(--border2);
          background: var(--bg4);
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .locked-icon :global(svg) {
          width: 10px;
          height: 10px;
          stroke: var(--text3);
          stroke-width: 1.8;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .locked-title {
          flex: 1;
          font-size: 12px;
          color: var(--text2);
        }
        .locked-label {
          font-size: 10px;
          color: var(--text3);
          font-family: var(--mono);
        }
      `}</style>
    </div>
  );
}
