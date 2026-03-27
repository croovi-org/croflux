"use client";

import {
  Activity,
  CheckSquare,
  LayoutDashboard,
  Settings,
  Trophy,
} from "lucide-react";
import Image from "next/image";
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
          <span className="rail-logo-mark" aria-hidden="true">
            <Image
              src="/croflux-mark.png"
              alt=""
              fill
              sizes="40px"
              className="object-contain"
            />
          </span>
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
          gap: 12px;
          min-height: 0;
          padding-top: 16px;
        }
        .rail-logo {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: rgba(124, 110, 247, 0.08);
          box-shadow:
            inset 0 0 0 1px rgba(124, 110, 247, 0.34),
            0 0 0 1px rgba(17, 17, 26, 0.55);
          color: #897cff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          font-family: Inter, sans-serif;
          flex-shrink: 0;
        }
        .rail-logo-mark {
          position: relative;
          width: 22px;
          height: 22px;
          display: block;
          flex-shrink: 0;
        }
        .rail-bottom {
          margin-top: auto;
          padding-bottom: 8px;
        }
        .rail-btn {
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
          border-radius: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #676c85;
          position: relative;
          border: none;
          background: transparent;
          box-shadow: none;
          box-sizing: border-box;
          flex-shrink: 0;
          text-decoration: none;
          appearance: none;
          transition:
            background 0.14s ease,
            color 0.14s ease,
            box-shadow 0.14s ease;
          cursor: pointer;
        }
        .rail-btn :global(svg) {
          width: 18px;
          height: 18px;
          stroke: currentColor;
          stroke-width: 1.75;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
        }
        .rail-btn:hover {
          background: rgba(255, 255, 255, 0.02);
          color: #8489a1;
        }
        .rail-btn.active {
          background: rgba(124, 110, 247, 0.15);
          color: #7c6ef7;
          box-shadow:
            inset 0 0 0 1px rgba(124, 110, 247, 0.2),
            0 0 14px rgba(124, 110, 247, 0.07);
        }
        .rail-active-line {
          position: absolute;
          left: -6px;
          top: 4px;
          bottom: 4px;
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
          color: #676c85;
        }
      `}</style>
    </aside>
  );
}
