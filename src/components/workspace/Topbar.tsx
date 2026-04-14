"use client";

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
  hideWorkspaceSwitcher?: boolean;
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
  hideWorkspaceSwitcher = false,
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
            {hideWorkspaceSwitcher ? (
              <span className="tb-ws-name">{workspaceName}</span>
            ) : (
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
            )}

            {!hideWorkspaceSwitcher && switcherOpen && (
              <div className="tb-ws-dropdown">
                <div className="tb-ws-dropdown-label">WORKSPACES</div>
                {(allProjects ?? []).map((p) => {
                  const rawP = p as typeof p & { workspace_name?: string | null }
                  const displayName = rawP.workspace_name ?? p.name
                  const isActive = p.id === activeProjectId
                  return (
                    <a key={p.id} href={`?project=${p.id}`}
                      className={`tb-ws-item${isActive ? " active" : ""}`}
                      onClick={() => {
                        sessionStorage.setItem("activeProjectId", p.id);
                        document.cookie = `activeProject=${p.id};path=/;max-age=86400`;
                        setSwitcherOpen(false);
                      }}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderRadius: 7, textDecoration: "none", cursor: "pointer" }}
                    >
                      <span style={{ width: 20, height: 20, borderRadius: 5, background: "var(--accent)", color: "white", display: "grid", placeItems: "center", fontSize: 9, fontWeight: 700, flexShrink: 0, fontFamily: '"Geist Mono", monospace' }}>
                        {displayName[0]?.toUpperCase() ?? "W"}
                      </span>
                      <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13, fontFamily: "Inter, 'Inter Fallback'", fontWeight: 500, lineHeight: "19.5px", color: "rgb(236, 236, 239)" }}>
                        {displayName}
                      </span>
                      {isActive && (
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                          stroke="var(--accent)" strokeWidth="2.2"
                          strokeLinecap="round" strokeLinejoin="round"
                          style={{ flexShrink: 0 }}>
                          <polyline points="2,6 5,9 10,3" />
                        </svg>
                      )}
                    </a>
                  )
                })}
                <div style={{ height: 1, background: "#1e1e2e", margin: "3px 4px" }} />
                <a href="/onboarding"
                  className="tb-ws-new"
                  onClick={() => setSwitcherOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderRadius: 7, textDecoration: "none", cursor: "pointer" }}
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    style={{ flexShrink: 0, color: "#8c90a7" }}>
                    <path d="M6 2v8M2 6h8" />
                  </svg>
                  <span style={{ fontSize: 13, fontFamily: "Inter, 'Inter Fallback'", fontWeight: 500, lineHeight: "19.5px", color: "#8c90a7" }}>
                    New workspace
                  </span>
                </a>
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
          gap: 6px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(255, 255, 255, 0.09);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 6px 20px rgba(0, 0, 0, 0.22);
          cursor: pointer;
          padding: 6px 10px 6px 9px;
          border-radius: 10px;
          transition: background 0.16s ease, border-color 0.16s ease, transform 0.16s ease;
          color: #c3c6d7;
        }
        .tb-ws-btn:hover {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.035));
          border-color: rgba(124, 110, 247, 0.38);
          transform: translateY(-0.5px);
        }
        .tb-ws-btn:focus-visible {
          outline: none;
          border-color: rgba(124, 110, 247, 0.62);
          box-shadow: 0 0 0 2px rgba(124, 110, 247, 0.25), 0 10px 28px rgba(0, 0, 0, 0.28);
        }
        .tb-ws-name {
          font-size: 12px;
          color: #d3d5e3;
          font-family: Inter, sans-serif;
          line-height: 1;
          font-weight: 550;
          letter-spacing: 0.01em;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tb-ws-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          min-width: 200px;
          background: #13131e;
          border: 1px solid #252538;
          border-radius: 10px;
          padding: 4px;
          z-index: 200;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
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
          gap: 10px;
          padding: 9px 10px;
          border-radius: 10px;
          text-decoration: none;
          color: #d0d3e4;
          font-size: 12px;
          font-family: Inter, sans-serif;
          font-weight: 500;
          border: 1px solid transparent;
          transition: background 0.14s ease, border-color 0.14s ease, transform 0.14s ease;
        }
        .tb-ws-item:hover {
          background: rgba(255,255,255,0.04);
        }
        .tb-ws-item.active {
          background: var(--accent-subtle);
        }
        .tb-ws-item-avatar {
          width: 24px;
          height: 24px;
          border-radius: 7px;
          background: linear-gradient(160deg, color-mix(in srgb, var(--accent) 82%, #fff), color-mix(in srgb, var(--accent) 72%, #000));
          color: white;
          display: grid;
          place-items: center;
          font-size: 9px;
          font-weight: 700;
          flex-shrink: 0;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }
        .tb-ws-item-name {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .tb-ws-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 7px 2px 6px;
        }
        .tb-ws-new {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 10px;
          text-decoration: none;
          color: #9fa3ba;
          font-size: 12px;
          font-family: Inter, sans-serif;
          font-weight: 500;
          border: 1px solid transparent;
          transition: background 0.14s ease, color 0.14s ease, border-color 0.14s ease, transform 0.14s ease;
        }
        .tb-ws-new:hover {
          background: rgba(255,255,255,0.04);
        }
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
