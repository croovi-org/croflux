"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useProfile } from "@/context/ProfileContext";

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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  currentSection?:
    | "/workspace"
    | "/dashboard"
    | "/projects"
    | "/activity"
    | "/my-tasks"
    | "/leaderboard"
    | "/profile"
    | "/pricing";
  mode?: "default" | "workspaceHome";
  projects?: Array<{
    id: string;
    name: string;
    progress: number;
    color: string;
  }>;
  allProjects?: Array<{
    id: string
    name: string
    workspace_name?: string | null
  }>;
  activeProjectId?: string | null;
  projectCount?: number;
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
  collapsed = false,
  onToggleCollapse,
  currentSection,
  mode = "default",
  projects = [],
  allProjects = [],
  activeProjectId = null,
  projectCount,
}: SidebarProps) {
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)
  const {
    displayName: ctxName,
    initials: ctxInitials,
    workspaceName: ctxWorkspace,
    streak: ctxStreak,
  } = useProfile()
  const pathname = usePathname();
  const normalizedPathname =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  const navItems = [
    {
      href: "/workspace",
      label: "Home",
      badge: null as string | null,
      badgeTone: "default" as const,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      badge: null as string | null,
      badgeTone: "default" as const,
    },
    {
      href: "/projects",
      label: "Projects",
      badge:
        typeof projectCount === "number" && projectCount > 0
          ? String(projectCount)
          : null,
      badgeTone: "accent" as const,
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

  useEffect(() => {
    if (!switcherOpen) return
    const handleClick = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [switcherOpen])
  return (
    <aside className={`sidebar-shell ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <div className="workspace-switcher-wrap" ref={switcherRef} style={{ position: "relative" }}>
          <div className="workspace-switcher-row">
            <button
              type="button"
              className="workspace-switcher"
              onClick={() => setSwitcherOpen((o) => !o)}
              title={ctxName}
            >
              <span className="workspace-avatar">{ctxInitials}</span>
              <span className="workspace-name">{ctxWorkspace}</span>
            </button>
            <button
              type="button"
              className="sidebar-collapse-btn"
              aria-label="Close sidebar"
              onClick={onToggleCollapse}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m10 4-4 4 4 4" />
              </svg>
            </button>
          </div>

          {switcherOpen && (
            <div className="ws-switcher-dropdown">
              <div className="ws-switcher-label">WORKSPACES</div>
              {(allProjects ?? []).map((p) => {
                const rawP = p as typeof p & { workspace_name?: string | null }
                const displayName = rawP.workspace_name ?? p.name
                const isActive = p.id === activeProjectId
                return (
                  <Link
                    key={p.id}
                    href={`/dashboard?project=${p.id}`}
                    className={`ws-switcher-item ${isActive ? "active" : ""}`}
                    onClick={() => setSwitcherOpen(false)}
                  >
                    <span className="ws-switcher-avatar">
                      {displayName[0]?.toUpperCase() ?? "W"}
                    </span>
                    <span className="ws-switcher-name">{displayName}</span>
                    {isActive && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
                        <polyline points="2,6 5,9 10,3" />
                      </svg>
                    )}
                  </Link>
                )
              })}
              <div className="ws-switcher-divider" />
              <Link
                href="/onboarding"
                className="ws-switcher-new"
                onClick={() => setSwitcherOpen(false)}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6 2v8M2 6h8" />
                </svg>
                New workspace
              </Link>
            </div>
          )}
        </div>
        <div className="next-up-wrap">
          <div className="next-up-card">
            <div className="next-up-top">
              <span className="next-up-dot" />
              <span className="next-up-label">NEXT UP</span>
            </div>
            <div className="next-up-task">
              {nextUpTask ?? "Everything shipped."}
            </div>
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
            !navItems.some(
              (item) =>
                normalizedPathname === item.href ||
                normalizedPathname.startsWith(`${item.href}/`),
            ) &&
            index === 0;
          const isActive = currentSection
            ? currentSection === href
            : derivedActive || fallbackActive;

          return (
            <Link
              key={label}
              href={href}
              className={`nav-item ${isActive ? "active" : ""}`}
              aria-current={isActive ? "page" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                width: "100%",
                height: "32px",
                padding: "0 12px",
                borderRadius: "10px",
                position: "relative",
                boxSizing: "border-box",
                textDecoration: "none",
                cursor: "pointer",
                color: isActive ? "#f3f3f8" : "#8c90a7",
                background: isActive ? "var(--accent-subtle)" : "transparent",
                boxShadow: isActive
                  ? "inset 3px 0 0 var(--accent-text), inset 0 0 0 1px var(--accent-subtle), 0 0 0 1px var(--purple-mid), -6px 0 16px -12px var(--accent-glow), 0 10px 22px -20px var(--accent-glow)"
                  : "none",
              }}
            >
              <span className="nav-label">{label}</span>
              {badge ? (
                <span
                  className={`nav-badge ${isActive ? "active" : ""} ${
                    badgeTone === "amber" ? "amber" : ""
                  } ${badgeTone === "accent" ? "accent" : ""}`}
                  style={
                    badgeTone === "amber"
                      ? {
                          height: "22px",
                          minWidth: "22px",
                          padding: "0 7px",
                          borderRadius: "8px",
                          background: "#40351d",
                          color: "#e2a72a",
                        }
                      : badgeTone === "accent"
                        ? isActive
                          ? {
                              height: "22px",
                              minWidth: "22px",
                              padding: "0 7px",
                              borderRadius: "8px",
                              background: "var(--accent-subtle)",
                              color: "var(--accent-text)",
                              border: "1px solid var(--accent-muted)",
                            }
                          : {
                              height: "22px",
                              minWidth: "22px",
                              padding: "0 7px",
                              borderRadius: "8px",
                              background:
                                "color-mix(in srgb, var(--accent) 12%, transparent)",
                              color: "var(--accent-text)",
                              border:
                                "1px solid color-mix(in srgb, var(--accent) 24%, transparent)",
                            }
                      : isActive
                        ? {
                            height: "22px",
                            minWidth: "22px",
                            padding: "0 7px",
                            borderRadius: "8px",
                            background: "#2d2b3c",
                            color: "#8589a0",
                          }
                        : {
                            height: "22px",
                            minWidth: "22px",
                            padding: "0 7px",
                            borderRadius: "8px",
                            background: "#262633",
                            color: "#74788f",
                          }
                  }
                >
                  {badge}
                </span>
              ) : null}
            </Link>
          );
        })}

        {mode === "workspaceHome" ? (
          <>
            <div className="milestones-label project-section-label">PROJECTS</div>
            <div className="project-list">
              {projects.map((project) => {
                const isActive = activeProjectId === project.id;

                return (
                  <Link
                    key={project.id}
                    href={`/dashboard?project=${project.id}`}
                    className={`project-row ${isActive ? "active" : ""}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      minHeight: "38px",
                      padding: "0 12px",
                      borderRadius: "14px",
                      position: "relative",
                      boxSizing: "border-box",
                      textDecoration: "none",
                      background: isActive ? "var(--accent-subtle)" : "transparent",
                    }}
                  >
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: "0",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "3px",
                          height: "18px",
                          borderRadius: "0 3px 3px 0",
                          background: "var(--accent)",
                        }}
                      />
                    ) : null}
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <span
                        className="project-row-dot"
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "999px",
                          flexShrink: 0,
                          background: isActive ? "var(--accent)" : project.color,
                          animation: isActive ? "projectPulse 2.4s ease-in-out infinite" : "none",
                        }}
                      />
                      <span
                        className="project-row-name"
                        style={{
                          flex: 1,
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: "12px",
                          color: isActive ? "var(--text)" : "var(--text2)",
                        }}
                      >
                        {project.name}
                      </span>
                    </span>
                    <span
                      className="project-row-progress"
                      style={{
                        marginLeft: "12px",
                        flexShrink: 0,
                        fontSize: "11px",
                        color: "var(--text3)",
                        fontFamily: '"Geist Mono", monospace',
                      }}
                    >
                      {project.progress}%
                    </span>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      <div className="sidebar-bottom">
        <div className="streak-card">
          <span className="streak-icon">⚡</span>
          <div>
            <div className="streak-title">{ctxStreak} day streak</div>
            <div className="streak-copy">Don&apos;t break it today</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sidebar-shell {
          width: 220px;
          height: 100%;
          min-height: 0;
          background: #111014;
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          opacity: 1;
          transform: translateX(0);
          transition:
            opacity 0.18s ease,
            transform 0.24s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sidebar-shell.collapsed {
          opacity: 0;
          transform: translateX(-16px);
          pointer-events: none;
        }
        .sidebar-top {
          padding: 0;
          border-bottom: 1px solid var(--border);
          background: #111014;
          position: relative;
          z-index: 2;
        }
        .workspace-switcher-row {
          display: flex;
          align-items: center;
          width: 100%;
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }
        .workspace-switcher {
          flex: 1;
          min-width: 0;
          height: 64px;
          background: #111014;
          border: 0;
          border-radius: 0;
          padding: 0 0 0 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text);
          text-align: left;
          cursor: pointer;
          transition: background 0.12s ease;
        }
        .workspace-switcher:hover {
          background: #17161d;
        }
        .sidebar-collapse-btn {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.06);
          background: #17161d;
          color: var(--text3);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          margin-right: 12px;
          transition: background 0.14s ease, border-color 0.14s ease, color 0.14s ease, transform 0.14s ease;
        }
        .sidebar-collapse-btn:hover {
          background: #1d1c24;
          border-color: var(--purple-mid);
          color: var(--accent-text);
          transform: translateX(-1px);
        }
        .ws-switcher-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 8px;
          right: 8px;
          background: #13131e;
          border: 1px solid #252538;
          border-radius: 12px;
          padding: 6px;
          z-index: 100;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .ws-switcher-label {
          font-size: 9px;
          color: #5f5f7a;
          letter-spacing: 0.1em;
          font-family: "Geist Mono", monospace;
          padding: 6px 10px 4px;
        }
        .ws-switcher-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 10px;
          border-radius: 8px;
          text-decoration: none;
          color: #c3c6d7;
          font-size: 12px;
          transition: background 0.12s ease;
          cursor: pointer;
        }
        .ws-switcher-item:hover {
          background: rgba(255,255,255,0.04);
        }
        .ws-switcher-item.active {
          background: var(--accent-subtle);
          color: #f0f0f8;
        }
        .ws-switcher-avatar {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: var(--accent);
          color: white;
          display: grid;
          place-items: center;
          font-size: 10px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .ws-switcher-name {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ws-switcher-divider {
          height: 1px;
          background: #252538;
          margin: 6px 0;
        }
        .ws-switcher-new {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 10px;
          border-radius: 8px;
          text-decoration: none;
          color: #8c90a7;
          font-size: 12px;
          transition: background 0.12s ease, color 0.12s ease;
        }
        .ws-switcher-new:hover {
          background: rgba(255,255,255,0.04);
          color: var(--accent-text);
        }
        .workspace-avatar {
          width: 24px;
          height: 24px;
          border-radius: 5px;
          background: var(--accent);
          color: white;
          display: grid;
          place-items: center;
          font-size: 10px;
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
        .next-up-wrap {
          padding: 10px 8px 10px;
        }
        .next-up-card {
          background: var(--accent-subtle);
          border: 1px solid var(--accent-muted);
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
          background: var(--accent-text);
          flex-shrink: 0;
          animation: pulse 2s infinite;
        }
        .next-up-label {
          font-size: 10px;
          color: var(--accent-text);
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
          padding: 14px 14px 8px;
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .ws-home-nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          height: 32px;
          padding: 0 10px;
          border-radius: 10px;
          position: relative;
          box-sizing: border-box;
          text-decoration: none;
          color: #8c90a7;
          transition:
            background-color 0.15s ease,
            color 0.15s ease,
            box-shadow 0.15s ease;
        }
        .ws-home-nav-item:hover {
          background: rgba(255, 255, 255, 0.03);
          color: #d6d8e4;
        }
        .ws-home-nav-item.active {
          background: var(--accent-subtle);
          color: #f3f3f8;
          box-shadow:
            inset 2px 0 0 var(--accent),
            inset 0 0 0 1px var(--accent-subtle);
        }
        .ws-home-nav-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: currentColor;
          flex-shrink: 0;
        }
        .nav-item {
          position: relative;
          height: 32px;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            box-shadow 0.2s ease;
          margin-bottom: 0;
        }
        .nav-item:last-of-type {
          margin-bottom: 0;
        }
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.03);
          color: #d6d8e4;
          box-shadow: 0 0 14px -12px rgba(139, 127, 255, 0.45);
          cursor: pointer;
        }
        .nav-item.active:hover {
          background: rgba(120, 100, 255, 0.14);
        }
        .nav-label {
          font-size: 12px;
          font-weight: 500;
          flex: 1;
          line-height: 1;
        }
        .nav-badge {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 22px;
          min-width: 22px;
          font-size: 12px;
          padding: 0 7px;
          border-radius: 8px;
          background: #262633;
          color: #74788f;
          border: 0;
          font-family: "Geist Mono", monospace;
          line-height: 1.2;
        }
        .nav-badge.active {
          background: #2d2b3c;
          color: #8589a0;
        }
        .nav-badge.amber {
          background: #40351d;
          color: #e2a72a;
        }
        .milestones-label {
          padding: 15px 9px 4px;
          font-size: 10px;
          color: var(--text3);
          letter-spacing: 0.08em;
          font-family: "Geist Mono", monospace;
        }
        .project-section-label {
          padding-top: 14px;
        }
        .project-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .project-row {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          min-height: 38px;
          padding: 0 12px;
          border-radius: 14px;
          position: relative;
          text-decoration: none;
          box-sizing: border-box;
          transition:
            background-color 0.12s ease,
            color 0.12s ease;
        }
        .project-row:hover {
          background: color-mix(in srgb, var(--accent) 5%, var(--bg4));
        }
        .project-row.active {
          background: var(--accent-subtle);
        }
        .project-row.active::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 18px;
          border-radius: 0 3px 3px 0;
          background: var(--accent);
        }
        .project-row-dot {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          flex-shrink: 0;
        }
        .project-row-name {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12px;
          color: var(--text2);
        }
        .project-row.active .project-row-name {
          color: var(--text);
        }
        .project-row-progress {
          font-size: 11px;
          color: var(--text3);
          font-family: "Geist Mono", monospace;
          flex-shrink: 0;
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
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
        @keyframes projectPulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.55;
            transform: scale(0.92);
          }
        }
      `}</style>
    </aside>
  );
}
