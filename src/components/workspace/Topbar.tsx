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
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>
        <span className="tb-divider" />
        <span className="tb-ws-dim">{workspaceName}</span>
        <span className="tb-sep">/</span>
        <span className="tb-page">{currentPage}</span>
      </div>

      <div className="tb-spacer" />

      <div className="tb-right">
        <button type="button" className="tb-search">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" />
          </svg>
          <span>Search</span>
        </button>
        <button type="button" className="tb-add">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span>Add task</span>
        </button>
        <div className="tb-user-avatar">{initials}</div>
      </div>

      <style jsx>{`
        .tb {
          height: 48px;
          min-height: 48px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          padding: 0 16px 0 0;
          gap: 0;
          background: #0a0a0f;
          border-bottom: 1px solid #1e1e2e;
        }
        .tb-left {
          display: flex;
          align-items: center;
          gap: 0;
          flex-shrink: 0;
        }
        .tb-ws-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 14px;
          height: 48px;
          background: transparent;
          border: none;
          color: #f0f0f8;
          cursor: pointer;
          font-family: Inter, sans-serif;
          font-size: 13px;
          font-weight: 500;
          transition: background 0.12s;
        }
        .tb-ws-btn:hover { background: #13131e; }
        .tb-avatar {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: #7c6ef7;
          color: white;
          display: grid;
          place-items: center;
          font-size: 10px;
          font-weight: 700;
          font-family: Inter, sans-serif;
          flex-shrink: 0;
        }
        .tb-ws-name { color: #f0f0f8; }
        .tb-divider {
          width: 1px;
          height: 20px;
          background: #2e2e48;
          flex-shrink: 0;
          margin: 0 4px;
        }
        .tb-ws-dim {
          font-size: 12px;
          color: #5f5f7a;
          padding: 0 6px;
          font-family: Inter, sans-serif;
        }
        .tb-sep {
          font-size: 12px;
          color: #2e2e48;
          margin: 0 2px;
        }
        .tb-page {
          font-size: 12px;
          color: #f0f0f8;
          font-weight: 500;
          padding: 0 6px;
          font-family: Inter, sans-serif;
        }
        .tb-spacer { flex: 1; }
        .tb-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tb-search, .tb-add {
          display: flex;
          align-items: center;
          gap: 5px;
          border-radius: 7px;
          padding: 5px 11px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.12s, border-color 0.12s, color 0.12s;
          font-family: Inter, sans-serif;
        }
        .tb-search {
          background: #13131e;
          border: 1px solid #252538;
          color: #9898b8;
        }
        .tb-search:hover { border-color: #2e2e48; color: #f0f0f8; }
        .tb-add {
          background: #7c6ef7;
          border: 1px solid #7c6ef7;
          color: white;
        }
        .tb-add:hover { background: #6357d4; border-color: #6357d4; }
        .tb-user-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #7c6ef7;
          color: white;
          display: grid;
          place-items: center;
          font-size: 10px;
          font-weight: 600;
          font-family: Inter, sans-serif;
          margin-left: 2px;
        }
      `}</style>
    </header>
  );
}
