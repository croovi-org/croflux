"use client";

type TopbarProps = {
  workspaceName: string;
  currentPage: string;
  initials: string;
};

export function Topbar({ workspaceName, currentPage, initials }: TopbarProps) {
  return (
    <header className="tb">
      <div className="tb-left">
        <button type="button" className="tb-ws-btn">
          <span className="tb-avatar">{initials}</span>
          <span className="tb-ws-name">{workspaceName}</span>
          <svg
            viewBox="0 0 16 16"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>
      </div>

      <div className="tb-divider" />

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
          height: 40px;
          min-height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          padding: 0 14px 0 0;
          background: #111119;
          border-bottom: 1px solid #252538;
        }
        .tb-left {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          width: 136px;
          height: 40px;
        }
        .tb-ws-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          height: 40px;
          padding: 0 12px;
          background: transparent;
          border: none;
          color: #f0f0f8;
          cursor: pointer;
          font-family: Inter, sans-serif;
          font-size: 12px;
          font-weight: 500;
          transition: background 0.12s ease;
        }
        .tb-ws-btn:hover { background: rgba(255, 255, 255, 0.02); }
        .tb-avatar {
          width: 20px;
          height: 20px;
          border-radius: 5px;
          background: #7c6ef7;
          color: white;
          display: grid;
          place-items: center;
          font-size: 9px;
          font-weight: 700;
          font-family: Inter, sans-serif;
          flex-shrink: 0;
        }
        .tb-ws-name {
          color: #f0f0f8;
          line-height: 1;
        }
        .tb-divider {
          width: 1px;
          align-self: stretch;
          background: #252538;
          flex-shrink: 0;
        }
        .tb-crumbs {
          display: flex;
          align-items: center;
          gap: 0;
          height: 40px;
          padding: 0 16px;
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
          margin: 0 10px;
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
          gap: 8px;
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
