"use client";

import type { ReactNode } from "react";
import { IconRail } from "@/components/workspace/IconRail";
import { Sidebar } from "@/components/workspace/Sidebar";
import { Topbar } from "@/components/workspace/Topbar";

type SidebarMilestone = {
  id: string;
  title: string;
  progress: number;
  state: "active" | "locked" | "done";
};

type WorkspaceShellProps = {
  workspaceName: string;
  currentPage: string;
  currentSection:
    | "/dashboard"
    | "/my-tasks"
    | "/leaderboard"
    | "/profile"
    | "/pricing";
  initials: string;
  userName: string;
  nextUpTask: string | null;
  nextUpContext: string | null;
  incompleteTaskCount: number;
  rank: number | null;
  milestones: SidebarMilestone[];
  streak: number;
  headerBottom?: ReactNode;
  children: ReactNode;
};

export function WorkspaceShell({
  workspaceName,
  currentPage,
  currentSection,
  initials,
  userName,
  nextUpTask,
  nextUpContext,
  incompleteTaskCount,
  rank,
  milestones,
  streak,
  headerBottom,
  children,
}: WorkspaceShellProps) {
  return (
    <div className="ws-shell">
      <div className="ws-body-row">
        <IconRail />
        <Sidebar
          workspaceName={workspaceName}
          initials={initials}
          nextUpTask={nextUpTask}
          nextUpContext={nextUpContext}
          incompleteTaskCount={incompleteTaskCount}
          rank={rank}
          milestones={milestones}
          streak={streak}
          currentSection={currentSection}
        />

        <div className="ws-content-shell">
          <div className="ws-navbar">
            <div className="ws-navbar-inner">
              <div className="ws-navbar-top">
                <Topbar
                  workspaceName={workspaceName}
                  currentPage={currentPage}
                  initials={initials}
                  userName={userName}
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
          --bg: #0a0a0f;
          --bg2: #0f0f17;
          --bg3: #13131e;
          --bg4: #1a1a28;
          --bg5: #1f1f30;
          --border: #1e1e2e;
          --border2: #252538;
          --border3: #2e2e48;
          --accent: #7c6ef7;
          --accent2: #6357d4;
          --accent-dim: rgba(124,110,247,0.08);
          --text: #f0f0f8;
          --text2: #9898b8;
          --text3: #5f5f7a;
          --green: #22c55e;
          --amber: #ffb700;
          --amber-dim: rgba(255,183,0,0.10);
          --mono: "Geist Mono", monospace;
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #0a0a0f;
          color: #f0f0f8;
        }
        .ws-shell::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 1px;
          background: rgba(124, 110, 247, 0.7);
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
      `}</style>
    </div>
  );
}
