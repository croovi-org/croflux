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
  currentSection?: "/dashboard" | "/my-tasks" | "/leaderboard";
};

export function Sidebar({
  workspaceName,
  initials,
  nextUpTask,
  nextUpContext,
  incompleteTaskCount,
  rank,
  milestones,
  streak,
  currentSection,
}: SidebarProps) {
  const pathname = usePathname();
  const normalizedPathname =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

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
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
        {navItems.map(({ href, label, badge, badgeTone }, index) => {
          const derivedActive =
            normalizedPathname === href ||
            normalizedPathname.startsWith(`${href}/`) ||
            (href === "/dashboard" && normalizedPathname === "/");
          const fallbackActive =
            !currentSection &&
            !navItems.some((item) =>
              normalizedPathname === item.href || normalizedPathname.startsWith(`${item.href}/`),
            ) &&
            index === 0;
          const isActive = currentSection ? currentSection === href : derivedActive || fallbackActive;

          return (
            <Link
              key={label}
              href={href}
              className={`nav-item ${isActive ? "active" : ""}`}
              aria-current={isActive ? "page" : undefined}
              style={
                isActive
                  ? {
                      background: "rgba(120, 100, 255, 0.10)",
                      color: "#f0f0f8",
                      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.025)",
                    }
                  : undefined
              }
            >
              <span className="nav-label">{label}</span>
              {badge ? (
                <span
                  className={`nav-badge ${isActive ? "active" : ""} ${
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
          height: 100%;
          min-height: 0;
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
          padding: 10px 12px 8px;
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 10px 14px;
          width: 100%;
          border-radius: 12px;
          border: 0;
          color: rgba(255, 255, 255, 0.65);
          position: relative;
          transition: background 0.2s ease, color 0.2s ease;
          margin-bottom: 0;
          cursor: pointer;
          text-decoration: none;
          box-sizing: border-box;
        }
        .nav-item:last-of-type {
          margin-bottom: 0;
        }
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.9);
        }
        .nav-item.active:hover {
          background: rgba(120, 100, 255, 0.12);
        }
        .nav-item.active {
          background: rgba(120, 100, 255, 0.1);
          border-radius: 14px;
          color: #f0f0f8 !important;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.025);
        }
        .nav-item.active::before {
          content: "";
          position: absolute;
          left: 0;
          top: 6px;
          bottom: 6px;
          width: 3px;
          border-radius: 3px;
          background: linear-gradient(
            to bottom,
            rgba(140, 120, 255, 0.9),
            rgba(120, 100, 255, 0.6)
          );
        }
        .nav-label {
          font-size: 12px;
          font-weight: 400;
          flex: 1;
          line-height: 1;
        }
        .nav-badge {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 24px;
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.7);
          border: 0;
          font-family: "Geist Mono", monospace;
          line-height: 1.2;
        }
        .nav-badge.active {
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.7);
        }
        .nav-badge.amber {
          background: rgba(255, 200, 0, 0.12);
          color: rgba(255, 200, 0, 0.9);
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
