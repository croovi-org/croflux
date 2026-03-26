"use client";

type TopbarProps = {
  workspaceName: string;
  currentPage: string;
  initials: string;
};

export function Topbar({ workspaceName, currentPage, initials }: TopbarProps) {
  return (
    <header className="tb">
      <div className="tb-crumbs">
        <span className="tb-ws-dim">{workspaceName}</span>
        <span className="tb-sep">/</span>
        <span className="tb-page">{currentPage}</span>
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
        <button type="button" className="tb-add">
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
        <div className="tb-user-avatar">{initials}</div>
      </div>

      <style jsx>{`
        .tb {
          height: 64px;
          min-height: 64px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          background: #111119;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .tb-crumbs {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 64px;
          padding: 0;
          min-width: 0;
        }
        .tb-ws-dim {
          font-size: 12px;
          color: #6f6f86;
          font-family: Inter, sans-serif;
          line-height: 1;
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
        .tb-spacer { flex: 1; }
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
          transition: background 0.12s, border-color 0.12s, color 0.12s;
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
        .tb-search:hover { border-color: #2e2e48; color: #f0f0f8; }
        .tb-add {
          background: #7c6ef7;
          border: 1px solid #7c6ef7;
          color: white;
        }
        .tb-add:hover { background: #6357d4; border-color: #6357d4; }
        .tb-user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #7c6ef7;
          color: white;
          display: grid;
          place-items: center;
          font-size: 10px;
          font-weight: 700;
          font-family: Inter, sans-serif;
        }
      `}</style>
    </header>
  );
}
