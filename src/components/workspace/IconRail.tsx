"use client";

import {
  Activity,
  CheckSquare,
  LayoutDashboard,
  Settings,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/milestones", label: "Milestones", icon: CheckSquare },
  { href: "/calendar", label: "Calendar", icon: Activity },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function IconRail() {
  const pathname = usePathname();

  return (
    <aside className="rail-shell">
      <div className="rail-top">
        <div className="rail-logo" aria-label="CroFlux">
          C
        </div>
      </div>

      <div className="rail-middle">
        {items.map(({ href, label, icon }) => {
          const IconComponent = icon;
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
              <IconComponent />
            </Link>
          );
        })}
      </div>

      <div className="rail-bottom">
        <button type="button" className="rail-btn" aria-label="Settings">
          <Settings />
        </button>
      </div>

      <style jsx>{`
        .rail-shell {
          width: 64px;
          min-width: 64px;
          max-width: 64px;
          height: 100%;
          min-height: 0;
          background: #13131e;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 0 14px;
          position: relative;
          flex-shrink: 0;
        }
        .rail-top,
        .rail-middle,
        .rail-bottom {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .rail-top {
          flex-shrink: 0;
        }
        .rail-middle {
          flex: 1;
          justify-content: flex-start;
          gap: 14px;
          min-height: 0;
          padding-top: 20px;
        }
        .rail-logo {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(120, 100, 255, 0.08);
          box-shadow:
            inset 0 0 0 1px rgba(120, 100, 255, 0.3),
            0 0 0 1px rgba(18, 18, 29, 0.5);
          color: #8a7dff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 700;
          font-family: Inter, sans-serif;
          flex-shrink: 0;
        }
        .rail-bottom {
          margin-top: auto;
          padding-bottom: 4px;
        }
        .rail-btn {
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #6f748c;
          position: relative;
          border: none;
          background: transparent;
          box-shadow: none;
          box-sizing: border-box;
          flex-shrink: 0;
          text-decoration: none;
          appearance: none;
          transition: background 0.14s ease, color 0.14s ease, box-shadow 0.14s ease;
          cursor: pointer;
        }
        .rail-btn :global(svg) {
          width: 17px;
          height: 17px;
          stroke: currentColor;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
        }
        .rail-btn:hover {
          background: rgba(255, 255, 255, 0.025);
          color: #8a8fa6;
        }
        .rail-btn.active {
          background: rgba(120, 100, 255, 0.14);
          color: #7c6ef7;
          box-shadow:
            inset 0 0 0 1px rgba(120, 100, 255, 0.22),
            0 0 16px rgba(124, 110, 247, 0.08);
        }
        .rail-active-line {
          position: absolute;
          left: -7px;
          top: 5px;
          bottom: 5px;
          width: 3px;
          border-radius: 0 999px 999px 0;
          background: transparent;
        }
        .rail-btn.active .rail-active-line {
          background: #7c6ef7;
        }
        .rail-bottom .rail-btn {
          background: transparent;
          box-shadow: none;
        }
      `}</style>
    </aside>
  );
}
