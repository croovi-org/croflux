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
        <div className="lp-fill" style={{ width: `${progress}%` }}>
          <span className="lp-dot" />
        </div>
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
          background: #7c6ef7;
          transition: width 0.5s ease;
          overflow: visible;
        }
        .lp-dot {
          position: absolute;
          right: -5px;
          top: 50%;
          transform: translateY(-50%);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #7c6ef7;
          border: 2px solid #0f0f17;
          box-shadow: 0 0 0 3px rgba(124,110,247,0.15);
        }
      `}</style>
    </div>
  );
}
