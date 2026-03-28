"use client";

import {
  BellOff,
  LogOut,
  MoonStar,
  PlusSquare,
  Settings,
  SmilePlus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type TopbarProps = {
  workspaceName: string;
  currentPage: string;
  initials: string;
  userName: string;
};

type MenuItem = {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  trailing?: "chevron";
  tone?: "default" | "danger";
  onClick?: () => void | Promise<void>;
};

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 3 4 5-4 5" />
    </svg>
  );
}

export function Topbar({ workspaceName, currentPage, initials, userName }: TopbarProps) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  const closeMenu = () => setOpen(false);
  const menuItems: MenuItem[] = [
    { label: "Set status", icon: SmilePlus, onClick: closeMenu },
    {
      label: "Settings",
      icon: Settings,
      onClick: () => {
        closeMenu();
        router.push("/profile");
      },
    },
    { label: "Themes", icon: MoonStar, onClick: closeMenu },
    { label: "Mute notifications", icon: BellOff, trailing: "chevron", onClick: closeMenu },
    { label: "Create Task", icon: PlusSquare, onClick: closeMenu },
    { label: "Trash", icon: Trash2, tone: "danger", onClick: closeMenu },
    { label: "Log out", icon: LogOut, tone: "danger", onClick: handleLogout },
  ];

  return (
    <header className="tb">
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
        <div className="tb-user-wrap" ref={menuRef}>
          <button
            type="button"
            className={`tb-user-trigger ${open ? "open" : ""}`}
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="tb-user-avatar-wrap">
              <div className="tb-user-avatar">{initials}</div>
              <span className="tb-user-dot" aria-hidden="true" />
            </span>
            <span className="tb-user-chevron" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m4 6 4 4 4-4" />
              </svg>
            </span>
          </button>

          {open ? (
            <div className="tb-menu" role="menu">
              <div className="tb-menu-head">
                <button
                  type="button"
                  className="tb-menu-profile-link"
                  onClick={() => {
                    closeMenu();
                    router.push("/profile");
                  }}
                >
                  Profile
                </button>
                <div className="tb-menu-avatar-wrap">
                  <div className="tb-menu-avatar">{initials}</div>
                  <span className="tb-menu-dot" aria-hidden="true" />
                </div>
                <Link
                  href="/profile"
                  className="tb-menu-user"
                  onClick={() => setOpen(false)}
                >
                  <div className="tb-menu-name">{userName}</div>
                  <div className="tb-menu-status">Online</div>
                </Link>
              </div>

              <button type="button" className="tb-status-chip" onClick={closeMenu}>
                <SmilePlus size={18} />
                <span>Set status</span>
              </button>

              <div className="tb-menu-list">
                {menuItems.slice(1).map(({ label, icon: Icon, trailing, tone, onClick }) => (
                  <button
                    key={label}
                    type="button"
                    className={`tb-menu-item ${tone === "danger" ? "danger" : ""}`}
                    role="menuitem"
                    onClick={onClick}
                    disabled={label === "Log out" && loggingOut}
                  >
                    <span className="tb-menu-item-left">
                      <Icon size={19} />
                      <span>{label === "Log out" && loggingOut ? "Logging out..." : label}</span>
                    </span>
                    {trailing === "chevron" ? <ChevronRightIcon /> : null}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <style jsx>{`
        .tb {
          width: 100%;
          height: 100%;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0;
          background: transparent;
          border-bottom: 0;
        }
        .tb-crumbs {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 100%;
          padding: 0;
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
          gap: 12px;
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
          height: 36px;
          border-radius: 8px;
          padding-left: 12px;
          padding-right: 12px;
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
        .tb-user-wrap {
          position: relative;
        }
        .tb-user-trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0;
          border: 0;
          background: transparent;
        }
        .tb-user-avatar-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .tb-user-chevron {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #71758b;
          transition: transform 0.16s ease, color 0.16s ease;
        }
        .tb-user-trigger.open .tb-user-chevron {
          transform: rotate(180deg);
          color: #9ca0b6;
        }
        .tb-user-dot,
        .tb-menu-dot {
          position: absolute;
          width: 11px;
          height: 11px;
          border-radius: 999px;
          background: #35c76f;
          border: 2px solid #1a1a25;
        }
        .tb-user-dot {
          right: -2px;
          bottom: -1px;
        }
        .tb-menu {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 272px;
          border-radius: 16px;
          background: #1a1a1b;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.38);
          padding: 10px 8px 8px;
          z-index: 40;
        }
        .tb-menu-head {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 8px 10px;
        }
        .tb-menu-profile-link {
          position: absolute;
          top: -2px;
          right: 0;
          height: 24px;
          padding: 0 8px;
          border-radius: 999px;
          border: 1px solid rgba(124, 110, 247, 0.2);
          background: rgba(124, 110, 247, 0.08);
          color: #9186ff;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        }
        .tb-menu-profile-link:hover {
          background: rgba(124, 110, 247, 0.14);
          color: #aca2ff;
        }
        .tb-menu-avatar-wrap {
          position: relative;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
        }
        .tb-menu-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #7c6ef7;
          color: #fff;
          display: grid;
          place-items: center;
          font-size: 15px;
          font-weight: 700;
          font-family: Inter, sans-serif;
        }
        .tb-menu-dot {
          left: 34px;
          bottom: 1px;
        }
        .tb-menu-user {
          min-width: 0;
          flex: 1;
          display: block;
          text-decoration: none;
          cursor: pointer;
          border-radius: 10px;
          padding: 6px 8px;
          margin: -6px -8px;
          border: 1px solid transparent;
          transition:
            background 0.14s ease,
            border-color 0.14s ease,
            box-shadow 0.14s ease,
            filter 0.14s ease;
        }
        .tb-menu-user:hover {
          background: rgba(124, 110, 247, 0.12);
          border-color: rgba(124, 110, 247, 0.28);
          box-shadow:
            inset 0 0 0 1px rgba(124, 110, 247, 0.12),
            0 0 0 1px rgba(124, 110, 247, 0.16),
            0 0 22px -6px rgba(124, 110, 247, 0.95);
          filter: drop-shadow(0 0 10px rgba(124, 110, 247, 0.55));
        }
        .tb-menu-user:hover .tb-menu-name {
          color: #ffffff;
          text-shadow: 0 0 10px rgba(124, 110, 247, 0.55);
        }
        .tb-menu-user:hover .tb-menu-status {
          color: #c6caf0;
        }
        .tb-menu-name {
          font-size: 14px;
          font-weight: 600;
          color: #f3f3f7;
          line-height: 1.15;
        }
        .tb-menu-status {
          margin-top: 3px;
          font-size: 12px;
          color: #7f8792;
          line-height: 1;
        }
        .tb-status-chip {
          width: 100%;
          height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #1c1c1d;
          color: #d5d5dc;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .tb-status-chip:hover {
          background: #212123;
          border-color: rgba(255, 255, 255, 0.12);
        }
        .tb-menu-list {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 8px;
          display: grid;
          gap: 2px;
        }
        .tb-menu-item {
          width: 100%;
          min-height: 44px;
          border: 0;
          background: transparent;
          color: #e6e6ea;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
        }
        .tb-menu-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }
        .tb-menu-item-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tb-menu-item :global(svg) {
          color: #b9bbc3;
          flex-shrink: 0;
        }
        .tb-menu-item.danger {
          color: #ececef;
        }
      `}</style>
    </header>
  );
}
