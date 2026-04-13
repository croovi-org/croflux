"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AvatarMenu } from "@/components/AvatarMenu";
import { useProfile } from "@/context/ProfileContext";

type TopbarProps = {
  breadcrumbRoot: string;
  currentPage?: string;
  initials: string;
  avatarUrl?: string | null;
  userName: string;
  hideAddTask?: boolean;
  actionLabel?: string;
  actionHref?: string;
  workspaceName?: string
  allProjects?: Array<{
    id: string
    name: string
    workspace_name?: string | null
  }>
  activeProjectId?: string | null
};

export function Topbar({
  breadcrumbRoot,
  currentPage,
  initials,
  avatarUrl,
  userName,
  hideAddTask = false,
  actionLabel = "Add task",
  actionHref = "/my-tasks",
  workspaceName,
  allProjects,
  activeProjectId,
}: TopbarProps) {
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)

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
  const {
    initials: ctxInitials,
    avatarUrl: ctxAvatarUrl,
    displayName: ctxName,
  } = useProfile()
  const router = useRouter();
  const hasCurrentPage = Boolean(currentPage);

  return (
    <header className="tb">
      <div className="tb-crumbs">
        {workspaceName ? (
          <div className="tb-ws-wrap" ref={switcherRef}>
            <button
              type="button"
              className="tb-ws-btn"
              onClick={() => setSwitcherOpen((o) => !o)}
            >
              <span className="tb-ws-name">{workspaceName}</span>
              <svg
                width="11" height="11" viewBox="0 0 12 12"
                fill="none" stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M3 4.5l3 3 3-3" />
              </svg>
            </button>

            {switcherOpen && (
              <div className="tb-ws-dropdown">
                <div className="tb-ws-dropdown-label">WORKSPACES</div>
                {(allProjects ?? []).map((p) => {
                  const rawP = p as typeof p & { workspace_name?: string | null }
                  const displayName = rawP.workspace_name ?? p.name
                  const isActive = p.id === activeProjectId
                  return (
                    <Link
                      key={p.id}
                      href={`/dashboard?project=${p.id}`}
                      className={`tb-ws-item ${isActive ? "active" : ""}`}
                      onClick={() => setSwitcherOpen(false)}
                    >
                      <span className="tb-ws-item-avatar">
                        {displayName[0]?.toUpperCase() ?? "W"}
                      </span>
                      <span className="tb-ws-item-name">{displayName}</span>
                      {isActive && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                          stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
                          <polyline points="2,6 5,9 10,3" />
                        </svg>
                      )}
                    </Link>
                  )
                })}
                <div className="tb-ws-divider" />
                <Link
                  href="/onboarding"
                  className="tb-ws-new"
                  onClick={() => setSwitcherOpen(false)}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M6 2v8M2 6h8" />
                  </svg>
                  New workspace
                </Link>
              </div>
            )}
          </div>
        ) : (
          <span className={`tb-ws-dim ${!hasCurrentPage ? "root-only" : ""}`}>
            {breadcrumbRoot}
          </span>
        )}
        {hasCurrentPage ? <span className="tb-sep">/</span> : null}
        {hasCurrentPage ? <span className="tb-page">{currentPage}</span> : null}
      </div>

      <div className="tb-spacer" />

      <div className="tb-right">
        <button type="button" className="tb-search">
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
          <span>Search</span>
        </button>
        {!hideAddTask ? (
          <button type="button" className="tb-add" onClick={() => router.push(actionHref)}>
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>{actionLabel}</span>
          </button>
        ) : null}

        <AvatarMenu initials={ctxInitials} avatarUrl={ctxAvatarUrl} userName={ctxName} />
      </div>

      <style jsx>{`
        .tb {
          width: 100%;
          height: 100%;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0;
          background: transparent;
          border-bottom: 0;
        }
        .tb-crumbs {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 100%;
          padding: 0;
          min-width: 0;
        }
        .tb-ws-dim {
          font-size: 12px;
          color: #6f6f86;
          font-family: Inter, sans-serif;
          line-height: 1;
        }
        .tb-ws-dim.root-only {
          color: var(--accent);
          font-weight: 500;
        }
        .tb-ws-wrap {
          position: relative;
        }
        .tb-ws-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 6px;
          transition: background 0.12s ease;
          color: #6f6f86;
        }
        .tb-ws-btn:hover {
          background: rgba(255,255,255,0.04);
        }
        .tb-ws-name {
          font-size: 12px;
          color: #6f6f86;
          font-family: Inter, sans-serif;
          line-height: 1;
          font-weight: 500;
        }
        .tb-ws-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          min-width: 220px;
          background: #13131e;
          border: 1px solid #252538;
          border-radius: 12px;
          padding: 6px;
          z-index: 200;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .tb-ws-dropdown-label {
          font-size: 9px;
          color: #5f5f7a;
          letter-spacing: 0.1em;
          font-family: "Geist Mono", monospace;
          text-transform: uppercase;
          padding: 6px 10px 4px;
          display: block;
        }
        .tb-ws-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 7px 10px;
          border-radius: 8px;
          text-decoration: none;
          color: #c3c6d7;
          font-size: 12px;
          font-family: Inter, sans-serif;
          font-weight: 500;
          transition: background 0.12s ease;
        }
        .tb-ws-item:hover { background: rgba(255,255,255,0.04); }
        .tb-ws-item.active { background: var(--accent-subtle); color: #f0f0f8; }
        .tb-ws-item-avatar {
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
        .tb-ws-item-name {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tb-ws-divider { height: 1px; background: #252538; margin: 4px 0; }
        .tb-ws-new {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 7px 10px;
          border-radius: 8px;
          text-decoration: none;
          color: #8c90a7;
          font-size: 12px;
          font-family: Inter, sans-serif;
          transition: background 0.12s ease, color 0.12s ease;
        }
        .tb-ws-new:hover { background: rgba(255,255,255,0.04); color: var(--accent-text); }
        .tb-sep {
          font-size: 12px;
          color: #44445a;
          line-height: 1;
        }
        .tb-page {
          font-size: 12px;
          color: #f0f0f8;
          font-weight: 500;
          font-family: Inter, sans-serif;
          line-height: 1;
        }
        .tb-spacer {
          flex: 1;
        }
        .tb-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .tb-search,
        .tb-add {
          display: flex;
          align-items: center;
          gap: 6px;
          border-radius: 7px;
          padding: 0 12px;
          height: 32px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition:
            background-color 0.3s ease,
            border-color 0.3s ease,
            color 0.3s ease;
          font-family: Inter, sans-serif;
        }
        .tb-search {
          background: #1a1a25;
          border: 1px solid #252538;
          color: #8f8fa8;
          height: 36px;
          border-radius: 8px;
          padding-left: 12px;
          padding-right: 12px;
        }
        .tb-search:hover {
          border-color: #2e2e48;
          color: #f0f0f8;
        }
        .tb-add {
          background: var(--accent);
          border: 1px solid var(--accent);
          color: white;
        }
        .tb-add:hover {
          background: var(--accent-hover);
          border-color: var(--accent-hover);
        }
      `}</style>
    </header>
  );
}
