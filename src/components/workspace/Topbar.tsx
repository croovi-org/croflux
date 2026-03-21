"use client";

type TopbarProps = {
  workspaceName: string;
  currentPage: string;
  initials: string;
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function Topbar({ workspaceName, currentPage, initials }: TopbarProps) {
  return (
    <header className="topbar-shell">
      <div className="topbar-breadcrumb">
        <span>{workspaceName}</span>
        <span>/</span>
        <strong>{currentPage}</strong>
      </div>

      <div className="topbar-actions">
        <button type="button" className="topbar-search">
          <SearchIcon />
          <span>Search</span>
        </button>
        <button type="button" className="topbar-add">
          <PlusIcon />
          <span>Add task</span>
        </button>
        <div className="topbar-avatar">{initials}</div>
      </div>

      <style jsx>{`
        .topbar-shell {
          height: 48px;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 0 18px;
          width: 100%;
          background: #11111a;
          border-bottom: 1px solid var(--border2);
          flex-shrink: 0;
          position: sticky;
          top: 0;
          z-index: 30;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.02),
            inset 0 -1px 0 rgba(255, 255, 255, 0.015),
            0 10px 24px rgba(0, 0, 0, 0.24);
        }
        .topbar-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }
        .topbar-breadcrumb span:first-child {
          font-size: 12px;
          color: var(--text3);
        }
        .topbar-breadcrumb span:nth-child(2) {
          color: var(--border3);
          font-size: 12px;
        }
        .topbar-breadcrumb strong {
          font-size: 12px;
          color: var(--text);
          font-weight: 500;
        }
        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .topbar-search,
        .topbar-add {
          display: flex;
          align-items: center;
          gap: 6px;
          border-radius: 7px;
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 500;
          transition:
            background 0.12s ease,
            border-color 0.12s ease;
        }
        .topbar-search {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border2);
          color: var(--text2);
        }
        .topbar-search:hover {
          background: var(--bg4);
          border-color: var(--border3);
        }
        .topbar-add {
          background: var(--accent);
          border: 1px solid var(--accent);
          color: white;
        }
        .topbar-add:hover {
          background: var(--accent2);
          border-color: var(--accent2);
        }
        .topbar-search :global(svg),
        .topbar-add :global(svg) {
          width: 13px;
          height: 13px;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
        }
        .topbar-avatar {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          background: var(--accent);
          color: white;
          display: grid;
          place-items: center;
          font-size: 10px;
          font-weight: 700;
          box-shadow: 0 0 0 1px rgba(124, 110, 247, 0.12);
        }
      `}</style>
    </header>
  );
}
