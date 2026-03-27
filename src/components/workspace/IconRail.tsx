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
        <Link href="/" className="rail-logo" aria-label="CroFlux home">
          <span className="rail-logo-mark" aria-hidden="true">
            <Image
              src="/croflux-mark.png"
              alt=""
              fill
              sizes="40px"
              className="object-contain"
            />
          </span>
        </Link>
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
          padding: 0 0 14px;
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
          height: 64px;
          justify-content: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .rail-middle {
          flex: 1;
          justify-content: flex-start;
          gap: 14px;
          min-height: 0;
          padding-top: 14px;
        }
        .rail-logo {
          width: 38px;
          height: 38px;
          color: #897cff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          font-family: Inter, sans-serif;
          flex-shrink: 0;
          text-decoration: none;
          cursor: pointer;
          border-radius: 10px;
          transition: filter 0.14s ease, transform 0.14s ease;
        }
        .rail-logo:hover {
          filter: drop-shadow(0 0 10px rgba(124, 110, 247, 0.34));
          transform: scale(1.06);
        }
        .rail-logo-mark {
          position: relative;
          width: 26px;
          height: 26px;
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
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #636882;
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
          width: 17px;
          height: 17px;
          stroke: currentColor;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
        }
        .rail-btn:hover {
          background: rgba(255, 255, 255, 0.018);
          color: #7d829a;
        }
        .rail-btn.active {
          background: #1f1b34;
          color: #8b7fff;
          box-shadow:
            inset 0 0 0 1px rgba(124, 110, 247, 0.08),
            0 6px 16px rgba(10, 10, 16, 0.18);
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
          background: linear-gradient(180deg, #9f92ff 0%, #7c6ef7 100%);
        }
        .rail-bottom .rail-btn {
          background: transparent;
          box-shadow: none;
          color: #636882;
        }
      `}</style>
    </aside>
  );
}
