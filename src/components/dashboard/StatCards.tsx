"use client";

type StatCardsProps = {
  overallProgress: number;
  completedTasks: number;
  totalTasks: number;
  currentMilestoneName: string;
  currentMilestoneCopy: string;
  rank: number | null;
  topPercent: number | null;
};

export function StatCards({
  overallProgress,
  completedTasks,
  totalTasks,
  currentMilestoneName,
  currentMilestoneCopy,
  rank,
  topPercent,
}: StatCardsProps) {
  const cards = [
    {
      label: "OVERALL PROGRESS",
      value: `${overallProgress}%`,
      sub: `${completedTasks} of ${totalTasks} tasks done`,
      tone: "accent",
    },
    {
      label: "CURRENT MILESTONE",
      value: currentMilestoneName,
      sub: currentMilestoneCopy,
      tone: "default",
    },
    {
      label: "LEADERBOARD RANK",
      value: rank ? `#${rank}` : "#—",
      sub: rank ? `Top ${topPercent}% this week` : "Complete tasks to rank",
      tone: "amber",
    },
  ] as const;

  return (
    <div className="stat-grid">
      {cards.map((card) => (
        <div key={card.label} className="stat-card">
          <div className="stat-label">{card.label}</div>
          <div className={`stat-value ${card.tone}`}>{card.value}</div>
          <div className="stat-sub">{card.sub}</div>
        </div>
      ))}

      <style jsx>{`
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 20px;
        }
        .stat-card {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 13px 15px;
        }
        .stat-label {
          margin-bottom: 5px;
          font-size: 10px;
          color: var(--text3);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .stat-value {
          margin-bottom: 5px;
          font-size: 20px;
          font-weight: 600;
          color: var(--text);
          line-height: 1.2;
        }
        .stat-value.accent,
        .stat-value.amber {
          font-family: var(--mono);
        }
        .stat-value.accent {
          color: var(--accent);
        }
        .stat-value.amber {
          color: var(--amber);
        }
        .stat-value.default {
          font-size: 14px;
        }
        .stat-sub {
          font-size: 10px;
          color: var(--text3);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
