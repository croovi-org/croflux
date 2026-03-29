"use client";

type ProgressBarProps = {
  progress: number;
  completedTasks: number;
  totalTasks: number;
};

export function ProgressBar({ progress, completedTasks, totalTasks }: ProgressBarProps) {
  return (
    <div className="lp">
      <div className="lp-top">
        <span>Launch progress</span>
        <span>{completedTasks} / {totalTasks} tasks</span>
      </div>
      <div className="lp-track">
        <div className="lp-fill" style={{ width: `${progress}%` }} />
        <span className="lp-dot" style={{ left: `${progress}%` }} />
      </div>

      <style jsx>{`
        .lp { margin-bottom: 20px; }
        .lp-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .lp-top span:first-child { font-size: 11px; color: #5f5f7a; }
        .lp-top span:last-child { font-size: 11px; color: #5f5f7a; font-family: "Geist Mono", monospace; }
        .lp-track {
          position: relative;
          height: 5px;
          border-radius: 3px;
          background: #1a1a28;
          overflow: visible;
        }
        .lp-fill {
          position: relative;
          height: 100%;
          border-radius: 3px;
          background: var(--accent);
          transition: width 0.5s ease;
        }
        .lp-dot {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          margin-left: 1px;
          z-index: 1;
          pointer-events: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: none;
        }
        .lp-track::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 3px;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.01);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
