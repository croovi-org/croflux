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
        <span className="tb-ws">{workspaceName}</span>
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
        <div className="tb-avatar">{initials}</div>
      </div>

      <style jsx>{`
        .tb {
          height: 48px;
          min-height: 48px;
          display: flex;
          align-items: center;
          padding: 0 22px;
          gap: 10px;
          background: #0f0f17;
          border-bottom: 1px solid #1e1e2e;
          flex-shrink: 0;
        }
        .tb-left { display: flex; align-items: center; }
        .tb-ws { font-size: 12px; color: #5f5f7a; }
        .tb-sep { font-size: 12px; color: #2e2e48; margin: 0 6px; }
        .tb-page { font-size: 12px; color: #f0f0f8; font-weight: 500; }
        .tb-spacer { flex: 1; }
        .tb-right { display: flex; align-items: center; gap: 8px; }
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
          background: #1a1a28;
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
        .tb-avatar {
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
        }
      `}</style>
    </header>
  );
}
