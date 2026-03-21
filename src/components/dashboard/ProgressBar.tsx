"use client";

type ProgressBarProps = {
  progress: number;
  completedTasks: number;
  totalTasks: number;
};

export function ProgressBar({ progress, completedTasks, totalTasks }: ProgressBarProps) {
  return (
    <div className="launch-progress">
      <div className="launch-progress-top">
        <span>Launch progress</span>
        <span>
          {completedTasks} / {totalTasks} tasks
        </span>
      </div>
      <div className="launch-progress-bar">
        <div className="launch-progress-fill" style={{ width: `${progress}%` }}>
          <span className="launch-progress-dot" />
        </div>
      </div>

      <style jsx>{`
        .launch-progress {
          margin-bottom: 20px;
        }
        .launch-progress-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          gap: 10px;
        }
        .launch-progress-top span:first-child {
          font-size: 11px;
          color: var(--text3);
        }
        .launch-progress-top span:last-child {
          font-size: 11px;
          color: var(--text3);
          font-family: var(--mono);
        }
        .launch-progress-bar {
          position: relative;
          height: 5px;
          overflow: hidden;
          border-radius: 3px;
          background: var(--bg4);
        }
        .launch-progress-fill {
          position: relative;
          height: 100%;
          border-radius: 3px;
          background: var(--accent);
          transition: width 0.5s ease;
        }
        .launch-progress-dot {
          position: absolute;
          right: 0;
          top: 50%;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--accent);
          border: 2px solid var(--bg2);
          transform: translate(50%, -50%);
          box-shadow: 0 0 0 4px rgba(124, 110, 247, 0.08);
        }
      `}</style>
    </div>
  );
}
