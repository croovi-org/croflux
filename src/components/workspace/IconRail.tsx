"use client";

import {
  Activity,
  CheckSquare,
  DollarSign,
  LayoutDashboard,
  Settings,
  Trophy,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/milestones", label: "Milestones", icon: CheckSquare },
  { href: "/calendar", label: "Activity", icon: Activity },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function IconRail() {
  const pathname = usePathname();
  const profileActive = pathname.startsWith("/profile");
  const pricingActive = pathname.startsWith("/pricing");

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
            <div key={href} className="rail-item">
              <Link
                href={target}
                className={`rail-btn ${active ? "active" : ""}`}
                aria-label={label}
                title={label}
                style={{
                  width: "44px",
                  height: "44px",
                  minWidth: "44px",
                  minHeight: "44px",
                  borderRadius: "14px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxSizing: "border-box",
                  flexShrink: 0,
                  textDecoration: "none",
                  appearance: "none",
                  cursor: "pointer",
                  color: active ? "var(--accent-text)" : "#70758d",
                  border: active ? "1px solid var(--purple-mid)" : "1px solid transparent",
                  background: active
                    ? "linear-gradient(180deg, var(--accent-subtle) 0%, rgba(17, 17, 23, 0.92) 100%)"
                    : "transparent",
                  boxShadow: active
                    ? "inset 0 0 0 1px var(--accent-subtle), 0 10px 22px rgba(8, 8, 14, 0.24), 0 0 20px -14px var(--accent-glow)"
                    : "none",
                }}
              >
                <span
                  className="rail-active-line"
                  style={{
                    position: "absolute",
                    left: "0",
                    top: "6px",
                    bottom: "6px",
                    width: "3px",
                    borderRadius: "0 999px 999px 0",
                    background: active
                      ? "linear-gradient(180deg, var(--accent-line-start) 0%, var(--accent) 100%)"
                      : "transparent",
                    boxShadow: active ? "0 0 12px var(--accent-glow)" : "none",
                  }}
                />
                <IconComponent size={15} strokeWidth={1.8} />
                <span className="rail-tooltip">{label}</span>
              </Link>
              <span className={`rail-caption ${active ? "active" : ""}`}>{label}</span>
            </div>
          );
        })}
      </div>

      <div className="rail-bottom">
        <Link
          href="/pricing"
          className="rail-btn"
          aria-label="Pricing"
          title="Pricing"
          style={{
            width: "46px",
            height: "44px",
            minWidth: "46px",
            minHeight: "44px",
            borderRadius: "14px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            boxSizing: "border-box",
            flexShrink: 0,
            appearance: "none",
            cursor: "pointer",
            textDecoration: "none",
            color: pricingActive ? "var(--accent-text)" : "#70758d",
            border: pricingActive ? "1px solid var(--purple-mid)" : "1px solid transparent",
            background: pricingActive
              ? "linear-gradient(180deg, var(--accent-subtle) 0%, rgba(17, 17, 23, 0.92) 100%)"
              : "transparent",
            boxShadow: pricingActive
              ? "inset 0 0 0 1px var(--accent-subtle), 0 10px 22px rgba(8, 8, 14, 0.24), 0 0 20px -14px var(--accent-glow)"
              : "none",
          }}
        >
          <span
            className="rail-active-line"
            style={{
              position: "absolute",
              left: "0",
              top: "6px",
              bottom: "6px",
              width: "3px",
              borderRadius: "0 999px 999px 0",
              background: pricingActive
                ? "linear-gradient(180deg, var(--accent-line-start) 0%, var(--accent) 100%)"
                : "transparent",
              boxShadow: pricingActive ? "0 0 12px var(--accent-glow)" : "none",
            }}
          />
          <DollarSign size={15} strokeWidth={1.8} />
          <span className="rail-tooltip">Pricing</span>
        </Link>
        <Link
          href="/profile"
          className="rail-btn"
          aria-label="Profile"
          title="Profile"
          style={{
            width: "46px",
            height: "44px",
            minWidth: "46px",
            minHeight: "44px",
            borderRadius: "14px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            boxSizing: "border-box",
            flexShrink: 0,
            appearance: "none",
            cursor: "pointer",
            textDecoration: "none",
            color: profileActive ? "var(--accent-text)" : "#70758d",
            border: profileActive ? "1px solid var(--purple-mid)" : "1px solid transparent",
            background: profileActive
              ? "linear-gradient(180deg, var(--accent-subtle) 0%, rgba(17, 17, 23, 0.92) 100%)"
              : "transparent",
            boxShadow: profileActive
              ? "inset 0 0 0 1px var(--accent-subtle), 0 10px 22px rgba(8, 8, 14, 0.24), 0 0 20px -14px var(--accent-glow)"
              : "none",
          }}
        >
          <span
            className="rail-active-line"
            style={{
              position: "absolute",
              left: "0",
              top: "6px",
              bottom: "6px",
              width: "3px",
              borderRadius: "0 999px 999px 0",
              background: profileActive
                ? "linear-gradient(180deg, var(--accent-line-start) 0%, var(--accent) 100%)"
                : "transparent",
              boxShadow: profileActive ? "0 0 12px var(--accent-glow)" : "none",
            }}
          />
          <UserRound size={15} strokeWidth={1.8} />
          <span className="rail-tooltip">Profile</span>
        </Link>
        <button
          type="button"
          className="rail-btn rail-settings"
          aria-label="Settings"
          title="Settings"
        >
          <Settings size={15} strokeWidth={1.8} />
          <span className="rail-tooltip">Settings</span>
        </button>
      </div>

      <style jsx>{`
        .rail-shell {
          width: 64px;
          min-width: 64px;
          max-width: 64px;
          height: 100%;
          min-height: 0;
          background: #0f0e13;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 0 14px;
          position: relative;
          overflow: visible;
          z-index: 8;
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
          gap: 10px;
          min-height: 0;
          padding-top: 12px;
        }
        .rail-item {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          flex-shrink: 0;
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
          filter: drop-shadow(0 0 10px var(--accent-muted));
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
          padding-bottom: 10px;
          gap: 14px;
        }
        .rail-btn {
          width: 44px;
          height: 44px;
          min-width: 44px;
          min-height: 44px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #70758d;
          position: relative;
          border: 1px solid transparent;
          background: transparent;
          box-shadow: none;
          box-sizing: border-box;
          flex-shrink: 0;
          text-decoration: none;
          appearance: none;
          transition:
            background 0.14s ease,
            color 0.14s ease,
            border-color 0.14s ease,
            box-shadow 0.14s ease,
            transform 0.14s ease;
          cursor: pointer !important;
        }
        .rail-btn :global(svg) {
          width: 15px;
          height: 15px;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          pointer-events: none;
        }
        .rail-btn:hover {
          background: var(--accent-subtle);
          border-color: var(--purple-mid);
          color: #9197b4;
        }
        .rail-caption {
          max-width: 58px;
          min-height: 0;
          padding: 0 1px;
          margin-top: -1px;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 10px;
          line-height: 1;
          letter-spacing: 0.01em;
          font-weight: 700;
          color: #7a809b;
          pointer-events: none;
        }
        .rail-caption.active {
          color: #9a90ff;
        }
        .rail-tooltip {
          position: absolute;
          left: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%) translateX(-4px);
          padding: 6px 10px;
          border-radius: 8px;
          background: #17161d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #d7d9e6;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
          transition:
            opacity 0.14s ease,
            visibility 0.14s ease,
            transform 0.14s ease;
          z-index: 60;
          cursor: pointer !important;
        }
        .rail-btn:hover .rail-tooltip,
        .rail-btn:focus-visible .rail-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateY(-50%) translateX(0);
        }
        .rail-btn,
        .rail-btn:focus-visible,
        .rail-btn:hover,
        .rail-btn * {
          cursor: pointer !important;
        }
        .rail-btn.active {
          background: linear-gradient(180deg, #221e38 0%, #1b1830 100%);
          color: var(--accent);
          box-shadow:
            inset 0 0 0 1px var(--purple-mid),
            0 10px 22px rgba(8, 8, 14, 0.24),
            0 0 20px -14px var(--accent-muted);
        }
        .rail-active-line {
          position: absolute;
          left: 0;
          top: 6px;
          bottom: 6px;
          width: 3px;
          border-radius: 0 999px 999px 0;
          background: transparent;
        }
        .rail-btn.active .rail-active-line {
          background: linear-gradient(180deg, var(--accent) 0%, var(--accent) 100%);
          box-shadow: 0 0 12px var(--accent-muted);
        }
        .rail-bottom .rail-btn {
          color: #70758d;
        }
        .rail-settings {
          background: transparent;
          border-color: transparent;
          box-shadow: none;
        }
      `}</style>
    </aside>
  );
}
