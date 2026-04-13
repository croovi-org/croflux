"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { IconRail } from "@/components/workspace/IconRail";
import { Sidebar } from "@/components/workspace/Sidebar";
import { Topbar } from "@/components/workspace/Topbar";
import { ProfileProvider, useOptionalProfile } from "@/context/ProfileContext";

type SidebarMilestone = {
  id: string;
  title: string;
  progress: number;
  state: "active" | "locked" | "done";
};

type SidebarProject = {
  id: string;
  name: string;
  progress: number;
  color: string;
};

type WorkspaceShellProps = {
  workspaceName: string;
  projectName?: string;
  breadcrumbRoot?: string;
  currentPage?: string;
  currentSection:
    | "/workspace"
    | "/dashboard"
    | "/projects"
    | "/activity"
    | "/my-tasks"
    | "/leaderboard"
    | "/profile"
    | "/pricing";
  initials: string;
  avatarUrl?: string | null;
  userName: string;
  nextUpTask: string | null;
  nextUpContext: string | null;
  incompleteTaskCount: number;
  rank: number | null;
  milestones: SidebarMilestone[];
  streak: number;
  headerBottom?: ReactNode;
  hideAddTask?: boolean;
  actionLabel?: string;
  actionHref?: string;
  sidebarMode?: "default" | "workspaceHome";
  sidebarProjects?: SidebarProject[];
  allProjects?: Array<{
    id: string
    name: string
    workspace_name?: string | null
  }>;
  activeProjectId?: string | null;
  projectCount?: number;
  children: ReactNode;
};

const SIDEBAR_STORAGE_KEY = "croflux-sidebar-collapsed";
const SIDEBAR_EVENT = "croflux-sidebar-collapsed-change";

export function WorkspaceShell({
  workspaceName,
  projectName,
  breadcrumbRoot,
  currentPage,
  currentSection,
  initials,
  avatarUrl,
  userName,
  nextUpTask,
  nextUpContext,
  incompleteTaskCount,
  rank,
  milestones,
  streak,
  headerBottom,
  hideAddTask = false,
  actionLabel,
  actionHref,
  sidebarMode = "default",
  sidebarProjects = [],
  allProjects,
  activeProjectId = null,
  projectCount,
  children,
}: WorkspaceShellProps) {
  const existingProfileContext = useOptionalProfile();
  const sidebarCollapsed = useSyncExternalStore(
    (onStoreChange) => {
      const handleStorage = (event: StorageEvent) => {
        if (event.key === SIDEBAR_STORAGE_KEY) {
          onStoreChange();
        }
      };

      const handleCustom = () => onStoreChange();

      window.addEventListener("storage", handleStorage);
      window.addEventListener(SIDEBAR_EVENT, handleCustom);

      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(SIDEBAR_EVENT, handleCustom);
      };
    },
    () => window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1",
    () => false,
  );

  const setSidebarCollapsed = (nextValue: boolean) => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, nextValue ? "1" : "0");
    window.dispatchEvent(new Event(SIDEBAR_EVENT));
  };
  const computedSidebarProjects = sidebarProjects.length > 0
    ? sidebarProjects
    : (allProjects ?? []).map((p, i) => {
        const colors = ["#7c6ef7", "#22c55e", "#ffb700", "#22d3ee", "#f472b6"]
        const rawP = p as typeof p & { workspace_name?: string | null }
        return {
          id: p.id,
          name: rawP.workspace_name ?? p.name,
          progress: 0,
          color: colors[i % colors.length] ?? "#7c6ef7",
        }
      })

  const shellContent = (
    <div className="ws-shell">
      <div className="ws-body-row">
        <IconRail />
        <div className={`ws-sidebar-wrap ${sidebarCollapsed ? "collapsed" : ""}`}>
          <Sidebar
            workspaceName={projectName ?? workspaceName}
            initials={initials}
            nextUpTask={nextUpTask}
            nextUpContext={nextUpContext}
            incompleteTaskCount={incompleteTaskCount}
            rank={rank}
            milestones={milestones}
            streak={streak}
            currentSection={currentSection}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            mode={sidebarMode}
            projects={computedSidebarProjects}
            projectCount={projectCount}
          />
        </div>

        <div className="ws-content-shell">
          <div className="ws-navbar">
            <div className="ws-navbar-inner">
              <div className="ws-navbar-top">
                {sidebarCollapsed ? (
                  <button
                    type="button"
                    className="ws-sidebar-reopen"
                    aria-label="Open sidebar"
                    onClick={() => setSidebarCollapsed(false)}
                  >
                    <svg
                      viewBox="0 0 16 16"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m6 4 4 4-4 4" />
                    </svg>
                  </button>
                ) : null}
                <Topbar
                  breadcrumbRoot={breadcrumbRoot ?? workspaceName}
                  currentPage={currentPage}
                  initials={initials}
                  avatarUrl={avatarUrl}
                  userName={userName}
                  hideAddTask={hideAddTask}
                  actionLabel={actionLabel}
                  actionHref={actionHref}
                  workspaceName={workspaceName}
                  allProjects={allProjects ?? []}
                  activeProjectId={activeProjectId}
                />
              </div>
              {headerBottom ? <div className="ws-navbar-bottom">{headerBottom}</div> : null}
            </div>
          </div>

          <main className="ws-main">{children}</main>
        </div>
      </div>

      <style jsx>{`
        .ws-shell {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #0f0f17;
          color: var(--text);
        }
        .ws-shell::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 1px;
          background: transparent;
          z-index: 10;
          pointer-events: none;
        }
        .ws-body-row {
          flex: 1;
          display: flex;
          min-height: 0;
          overflow: hidden;
        }
        .ws-content-shell {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: #0f0f17;
          overflow: hidden;
        }
        .ws-sidebar-wrap {
          width: 220px;
          min-width: 220px;
          max-width: 220px;
          overflow: hidden;
          flex-shrink: 0;
          transition:
            width 0.28s cubic-bezier(0.22, 1, 0.36, 1),
            min-width 0.28s cubic-bezier(0.22, 1, 0.36, 1),
            max-width 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ws-sidebar-wrap.collapsed {
          width: 0;
          min-width: 0;
          max-width: 0;
        }
        .ws-navbar {
          width: 100%;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }
        .ws-navbar-inner {
          padding-left: 24px;
          padding-right: 24px;
          box-sizing: border-box;
        }
        .ws-navbar-top {
          height: 64px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }
        .ws-navbar-top::after {
          content: "";
          position: absolute;
          left: -24px;
          right: -24px;
          bottom: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
        }
        .ws-navbar-bottom {
          position: relative;
        }
        .ws-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #0f0f17;
        }
        .ws-sidebar-reopen {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: 1px solid var(--accent-subtle);
          background: var(--accent-subtle);
          color: var(--accent);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          transition:
            transform 0.16s ease,
            background 0.16s ease,
            border-color 0.16s ease,
            box-shadow 0.16s ease;
        }
        .ws-sidebar-reopen:hover {
          transform: translateX(2px);
          background: var(--accent-subtle);
          border-color: var(--accent-muted);
          box-shadow: 0 0 16px -8px var(--accent-muted);
        }
      `}</style>
    </div>
  );

  if (existingProfileContext) {
    return shellContent;
  }

  return (
    <ProfileProvider
      initial={{
        displayName: userName,
        initials: initials,
        avatarUrl: avatarUrl ?? null,
        workspaceName: workspaceName,
        streak: streak,
      }}
    >
      {shellContent}
    </ProfileProvider>
  );
}
