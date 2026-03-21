"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1.2" fill="none" />
      <rect x="14" y="4" width="6" height="6" rx="1.2" fill="none" />
      <rect x="4" y="14" width="6" height="6" rx="1.2" fill="none" />
      <rect x="14" y="14" width="6" height="6" rx="1.2" fill="none" />
    </svg>
  );
}

function CheckboxIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="3" fill="none" />
      <path d="m8.5 12 2.2 2.2 4.8-5.2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="3" fill="none" />
      <path d="M8 3.8v3.4M16 3.8v3.4M4 9.5h16M8 13h.01M12 13h.01M16 13h.01M8 16.5h.01M12 16.5h.01M16 16.5h.01" />
    </svg>
  );
}

function LeaderboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.5 11.2a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4Z" />
      <path d="M16.6 10.3a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" />
      <path d="M12.6 18.8a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
      <path d="M3.9 18.8a4.2 4.2 0 0 1 7.2-2.9M19.9 18.8a4 4 0 0 0-4.7-3.9" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.8v2.1M12 18.1v2.1M20.2 12h-2.1M5.9 12H3.8M17.7 6.3 16.2 7.8M7.8 16.2l-1.5 1.5M17.7 17.7l-1.5-1.5M7.8 7.8 6.3 6.3" />
      <circle cx="12" cy="12" r="3.6" fill="none" />
    </svg>
  );
}

const items = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/milestones", label: "Milestones", icon: CheckboxIcon },
  { href: "/calendar", label: "Calendar", icon: CalendarIcon },
  { href: "/leaderboard", label: "Leaderboard", icon: LeaderboardIcon },
];

export function IconRail() {
  const pathname = usePathname();

  return (
    <aside className="rail-shell">
      <div className="rail-logo" aria-label="CroFlux">
        C
      </div>

      <div className="rail-spacer" />

      <div className="rail-nav">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          const target =
            href === "/dashboard" || href === "/leaderboard" ? href : "#";

          return (
            <Link
              key={href}
              href={target}
              className={`rail-btn ${active ? "active" : ""}`}
              aria-label={label}
            >
              <span className="rail-active-line" />
              <Icon />
              <span className="rail-tooltip">{label}</span>
            </Link>
          );
        })}
      </div>

      <div className="rail-bottom">
        <button type="button" className="rail-btn" aria-label="Settings">
          <SettingsIcon />
          <span className="rail-tooltip">Settings</span>
        </button>
      </div>

      <style jsx>{`
        .rail-shell {
          width: 52px;
          height: 100vh;
          background: #13131e;
          border-right: 1px solid #1e1e2e;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 0 10px;
          position: relative;
          flex-shrink: 0;
        }
        .rail-logo {
          width: 28px;
          height: 28px;
          border-radius: 9px;
          background: #7c6ef7;
          color: white;
          display: grid;
          place-items: center;
          font-size: 13px;
          font-weight: 700;
          font-family: Inter, sans-serif;
          flex-shrink: 0;
        }
        .rail-spacer {
          height: 16px;
        }
        .rail-nav,
        .rail-bottom {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 100%;
          align-items: center;
        }
        .rail-bottom {
          margin-top: auto;
        }
        .rail-btn {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          display: grid;
          place-items: center;
          color: #5f5f7a;
          position: relative;
          border: none;
          background: transparent;
          transition: background 0.12s ease, color 0.12s ease;
          cursor: pointer;
        }
        .rail-btn :global(svg) {
          width: 17px;
          height: 17px;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
        }
        .rail-btn:hover {
          background: #1a1a28;
          color: #9898b8;
        }
        .rail-btn.active {
          background: rgba(124, 110, 247, 0.08);
          color: #7c6ef7;
        }
        .rail-active-line {
          position: absolute;
          left: -1px;
          top: 6px;
          bottom: 6px;
          width: 2.5px;
          border-radius: 0 999px 999px 0;
          background: transparent;
        }
        .rail-btn.active .rail-active-line {
          background: #7c6ef7;
        }
        .rail-tooltip {
          position: absolute;
          left: calc(100% + 10px);
          top: 50%;
          transform: translateY(-50%);
          background: #1a1a28;
          border: 1px solid #252538;
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 11px;
          line-height: 1;
          color: white;
          opacity: 0;
          pointer-events: none;
          white-space: nowrap;
          z-index: 50;
          transition: opacity 0.12s ease, transform 0.12s ease;
        }
        .rail-btn:hover .rail-tooltip {
          opacity: 1;
          transform: translateY(-50%) translateX(2px);
        }
      `}</style>
    </aside>
  );
}
