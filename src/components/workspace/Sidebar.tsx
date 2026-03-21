"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarMilestone = {
  id: string;
  title: string;
  progress: number;
  state: "active" | "locked" | "done";
};

type SidebarProps = {
  workspaceName: string;
  initials: string;
  nextUpTask: string | null;
  nextUpContext: string | null;
  incompleteTaskCount: number;
  rank: number | null;
  milestones: SidebarMilestone[];
  streak: number;
};

function DashboardNavIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
      <rect x="4" y="4" width="6" height="6" rx="1.2" fill="none" />
      <rect x="14" y="4" width="6" height="6" rx="1.2" fill="none" />
      <rect x="4" y="14" width="6" height="6" rx="1.2" fill="none" />
      <rect x="14" y="14" width="6" height="6" rx="1.2" fill="none" />
    </svg>
  );
}

function TasksNavIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
      <rect x="5" y="5" width="14" height="14" rx="3" fill="none" />
      <path d="m8.5 12 2.2 2.2 4.8-5.2" />
    </svg>
  );
}

function LeaderboardNavIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
      <path d="M7.5 11.2a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4Z" />
      <path d="M16.6 10.3a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" />
      <path d="M12.6 18.8a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
      <path d="M3.9 18.8a4.2 4.2 0 0 1 7.2-2.9M19.9 18.8a4 4 0 0 0-4.7-3.9" />
    </svg>
  );
}

const navConfig = [
  { href: "/dashboard", label: "Dashboard", Icon: DashboardNavIcon },
  { href: "/my-tasks", label: "My Tasks", Icon: TasksNavIcon },
  { href: "/leaderboard", label: "Leaderboard", Icon: LeaderboardNavIcon },
];

export function Sidebar({
  workspaceName,
  initials,
  nextUpTask,
  nextUpContext,
  incompleteTaskCount,
  rank,
  milestones,
  streak,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      badge: null as string | null,
      badgeTone: "default" as const,
    },
    {
      href: "/my-tasks",
      label: "My Tasks",
      badge: String(incompleteTaskCount),
      badgeTone: "default" as const,
    },
    {
      href: "/leaderboard",
      label: "Leaderboard",
      badge: rank ? `#${rank}` : "#—",
      badgeTone: "amber" as const,
    },
  ];

  return (
    <aside className="sidebar-shell">
      <div className="sidebar-top">
        <button type="button" className="workspace-switcher">
          <span className="workspace-avatar">{initials}</span>
          <span className="workspace-name">{workspaceName}</span>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>
        <div className="next-up-wrap">
          <div className="next-up-card">
            <div className="next-up-top">
              <span className="next-up-dot" />
              <span className="next-up-label">NEXT UP</span>
            </div>
            <div className="next-up-task">{nextUpTask ?? "Everything shipped."}</div>
            <div className="next-up-context">
              {nextUpContext ?? "All milestones are complete"}
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-nav">
        {navItems.map(({ href, label, badge, badgeTone }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          const NavIcon = navConfig.find((n) => n.href === href)?.Icon;

          return (
            <Link
              key={label}
              href={href === "/dashboard" ? "/dashboard" : "#"}
              className={`nav-item ${active ? "active" : ""}`}
            >
              {NavIcon ? <NavIcon /> : null}
              <span className="nav-label">{label}</span>
              {badge ? (
                <span
                  className={`nav-badge ${active ? "active" : ""} ${
                    badgeTone === "amber" ? "amber" : ""
                  }`}
                >
                  {badge}
                </span>
              ) : null}
            </Link>
          );
        })}

        <div className="milestones-label">MILESTONES</div>
        <div className="milestones-list">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="milestone-row">
              <span className={`milestone-pip ${milestone.state}`} />
              <span
                className={`milestone-title ${
                  milestone.state === "locked" ? "locked" : ""
                }`}
              >
                {milestone.title}
              </span>
              <span className="milestone-mini-bar">
                <span
                  className="milestone-mini-fill"
                  style={{ width: `${milestone.progress}%` }}
                />
              </span>
              <span className="milestone-mini-pct">{milestone.progress}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="streak-card">
          <span className="streak-icon">⚡</span>
          <div>
            <div className="streak-title">{streak} day streak</div>
            <div className="streak-copy">Don&apos;t break it today</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sidebar-shell {
          width: 220px;
          height: 100vh;
          background: var(--bg3);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }
        .sidebar-top {
          padding: 0;
          border-bottom: 1px solid var(--border);
          background: var(--bg3);
          position: relative;
          z-index: 2;
        }
        .workspace-switcher {
          width: 100%;
          height: 42px;
          background: var(--bg3);
          border: 0;
          border-bottom: 1px solid var(--border);
          border-radius: 0;
          padding: 0 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text);
          text-align: left;
          transition: background 0.12s ease;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02);
          cursor: pointer;
        }
        .workspace-switcher:hover {
          background: rgba(255, 255, 255, 0.02);
        }
        .workspace-avatar {
          width: 20px;
          height: 20px;
          border-radius: 5px;
          background: var(--accent);
          color: white;
          display: grid;
          place-items: center;
          font-size: 9px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .workspace-name {
          flex: 1;
          font-size: 12px;
          font-weight: 500;
          min-width: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .workspace-switcher :global(svg) {
          width: 11px;
          height: 11px;
          stroke: var(--text3);
          stroke-width: 1.8;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .next-up-wrap {
          padding: 10px 8px 10px;
        }
        .next-up-card {
          background: rgba(124, 110, 247, 0.08);
          border: 1px solid rgba(124, 110, 247, 0.20);
          border-radius: 8px;
          padding: 10px 12px 11px;
        }
        .next-up-top {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 8px;
        }
        .next-up-dot {
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: var(--accent);
          flex-shrink: 0;
          animation: pulse 2s infinite;
        }
        .next-up-label {
          font-size: 10px;
          color: var(--accent);
          font-weight: 600;
          letter-spacing: 0.08em;
          font-family: "Geist Mono", monospace;
          text-transform: uppercase;
        }
        .next-up-task {
          font-size: 12px;
          color: var(--text);
          font-weight: 500;
        }
        .next-up-context {
          margin-top: 4px;
          font-size: 10px;
          color: var(--text3);
          font-family: "Geist Mono", monospace;
        }
        .sidebar-nav {
          padding: 8px 8px 6px;
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          border-radius: 7px;
          color: var(--text2);
          position: relative;
          transition: background 0.12s ease;
          margin-bottom: 4px;
        }
        .nav-item:last-of-type {
          margin-bottom: 0;
        }
        .nav-item:hover {
          background: #1a1a28;
        }
        .nav-item.active {
          background: var(--accent-dim);
          color: var(--text);
          box-shadow: inset 0 0 0 1px rgba(124, 110, 247, 0.12);
        }
        .nav-item.active::before {
          content: "";
          position: absolute;
          left: 0;
          top: 7px;
          bottom: 7px;
          width: 2px;
          border-radius: 0 999px 999px 0;
          background: var(--accent);
        }
        .nav-item :global(.nav-icon) {
          width: 14px;
          height: 14px;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          flex-shrink: 0;
        }
        .nav-label {
          font-size: 12px;
          flex: 1;
        }
        .nav-badge {
          font-size: 9px;
          padding: 1px 6px;
          border-radius: 10px;
          background: var(--bg5);
          color: var(--text3);
          border: 1px solid var(--border2);
          font-family: "Geist Mono", monospace;
        }
        .nav-badge.active {
          background: var(--accent-dim);
          color: var(--accent);
          border-color: rgba(124, 110, 247, 0.2);
        }
        .nav-badge.amber {
          color: var(--amber);
          border-color: rgba(255, 183, 0, 0.15);
          background: var(--amber-dim);
        }
        .milestones-label {
          padding: 15px 9px 4px;
          font-size: 10px;
          color: var(--text3);
          letter-spacing: 0.08em;
          font-family: "Geist Mono", monospace;
        }
        .milestones-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .milestone-row {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 5px 9px;
          border-radius: 7px;
        }
        .milestone-row:hover {
          background: var(--bg4);
        }
        .milestone-pip {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          flex-shrink: 0;
        }
        .milestone-pip.active {
          background: var(--accent);
        }
        .milestone-pip.locked {
          background: var(--border3);
        }
        .milestone-pip.done {
          background: var(--green);
        }
        .milestone-title {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 11px;
          color: var(--text2);
          max-width: 110px;
        }
        .milestone-title.locked {
          color: var(--text3);
        }
        .milestone-mini-bar {
          width: 28px;
          height: 2px;
          background: var(--border2);
          border-radius: 999px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .milestone-mini-fill {
          display: block;
          height: 100%;
          background: var(--accent);
        }
        .milestone-mini-pct {
          font-size: 10px;
          color: var(--text3);
          font-family: "Geist Mono", monospace;
          width: 24px;
          text-align: right;
          flex-shrink: 0;
        }
        .sidebar-bottom {
          padding: 12px;
          border-top: 1px solid var(--border);
        }
        .streak-card {
          background: var(--amber-dim);
          border: 1px solid rgba(255, 183, 0, 0.15);
          border-radius: 8px;
          padding: 8px 10px;
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .streak-icon {
          font-size: 14px;
          line-height: 1;
        }
        .streak-title {
          color: var(--amber);
          font-size: 12px;
          font-weight: 600;
        }
        .streak-copy {
          font-size: 10px;
          color: var(--text3);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </aside>
  );
}
