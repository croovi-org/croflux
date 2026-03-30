"use client";

import { useRouter } from "next/navigation";
import { AvatarMenu } from "@/components/AvatarMenu";

type TopbarProps = {
  breadcrumbRoot: string;
  currentPage?: string;
  initials: string;
  userName: string;
  hideAddTask?: boolean;
};

export function Topbar({
  breadcrumbRoot,
  currentPage,
  initials,
  userName,
  hideAddTask = false,
}: TopbarProps) {
  const router = useRouter();
  const hasCurrentPage = Boolean(currentPage);

  return (
    <header className="tb">
      <div className="tb-crumbs">
        <span className={`tb-ws-dim ${!hasCurrentPage ? "root-only" : ""}`}>
          {breadcrumbRoot}
        </span>
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
          <button type="button" className="tb-add" onClick={() => router.push("/my-tasks")}>
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
            <span>Add task</span>
          </button>
        ) : null}

        <AvatarMenu initials={initials} userName={userName} />
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
          color: #f0f0f8;
          font-weight: 500;
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
