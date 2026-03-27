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
              style={{
                width: "42px",
                height: "42px",
                minWidth: "42px",
                minHeight: "42px",
                borderRadius: "12px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                boxSizing: "border-box",
                flexShrink: 0,
                textDecoration: "none",
                appearance: "none",
                cursor: "pointer",
                color: active ? "#8b7fff" : "#70758d",
                border: active
                  ? "1px solid rgba(124, 110, 247, 0.14)"
                  : "1px solid rgba(255, 255, 255, 0.03)",
                background: active
                  ? "linear-gradient(180deg, #211d36 0%, #1d1a31 100%)"
                  : "rgba(255, 255, 255, 0.015)",
                boxShadow: active
                  ? "inset 0 0 0 1px rgba(124, 110, 247, 0.08), 0 8px 18px rgba(10, 10, 16, 0.22), 0 0 18px -14px rgba(124, 110, 247, 0.6)"
                  : "inset 0 1px 0 rgba(255, 255, 255, 0.01)",
              }}
            >
              <span
                className="rail-active-line"
                style={{
                  position: "absolute",
                  left: "-3px",
                  top: "4px",
                  bottom: "4px",
                  width: "3px",
                  borderRadius: "0 999px 999px 0",
                  background: active
                    ? "linear-gradient(180deg, #9f92ff 0%, #7c6ef7 100%)"
                    : "transparent",
                  boxShadow: active
                    ? "0 0 10px rgba(124, 110, 247, 0.42)"
                    : "none",
                }}
              />
              <IconComponent />
            </Link>
          );
        })}
      </div>

      <div className="rail-bottom">
        <button
          type="button"
          className="rail-btn"
          aria-label="Settings"
          style={{
            width: "42px",
            height: "42px",
            minWidth: "42px",
            minHeight: "42px",
            borderRadius: "12px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            boxSizing: "border-box",
            flexShrink: 0,
            appearance: "none",
            cursor: "pointer",
            color: "#70758d",
            border: "1px solid rgba(255, 255, 255, 0.03)",
            background: "rgba(255, 255, 255, 0.015)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.01)",
          }}
        >
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
          gap: 12px;
          min-height: 0;
          padding-top: 12px;
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
          padding-bottom: 6px;
        }
        .rail-btn {
          width: 42px;
          height: 42px;
          min-width: 42px;
          min-height: 42px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #70758d;
          position: relative;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.015);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.01);
          box-sizing: border-box;
          flex-shrink: 0;
          text-decoration: none;
          appearance: none;
          transition:
            background 0.14s ease,
            color 0.14s ease,
            border-color 0.14s ease,
            box-shadow 0.14s ease;
          cursor: pointer;
        }
        .rail-btn :global(svg) {
          width: 18px;
          height: 18px;
          stroke: currentColor;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
        }
        .rail-btn:hover {
          background: rgba(124, 110, 247, 0.08);
          border-color: rgba(124, 110, 247, 0.12);
          color: #8a8fb0;
        }
        .rail-btn.active {
          background: linear-gradient(180deg, #211d36 0%, #1d1a31 100%);
          color: #8b7fff;
          box-shadow:
            inset 0 0 0 1px rgba(124, 110, 247, 0.14),
            0 8px 18px rgba(10, 10, 16, 0.22),
            0 0 18px -14px rgba(124, 110, 247, 0.6);
        }
        .rail-active-line {
          position: absolute;
          left: -3px;
          top: 4px;
          bottom: 4px;
          width: 3px;
          border-radius: 0 999px 999px 0;
          background: transparent;
        }
        .rail-btn.active .rail-active-line {
          background: linear-gradient(180deg, #9f92ff 0%, #7c6ef7 100%);
          box-shadow: 0 0 10px rgba(124, 110, 247, 0.42);
        }
        .rail-bottom .rail-btn {
          color: #70758d;
        }
      `}</style>
    </aside>
  );
}
