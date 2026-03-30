"use client";

import { Check, ChevronDown, LayoutGrid, List, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type ProjectsSortOption = "recent" | "progress" | "name" | "created";

type ProjectsToolbarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  sort: ProjectsSortOption;
  onSortChange: (value: ProjectsSortOption) => void;
  view: "list" | "grid";
  onViewChange: (value: "list" | "grid") => void;
};

const SORT_LABELS: Record<ProjectsSortOption, string> = {
  recent: "Recently updated",
  progress: "Progress",
  name: "Name (A–Z)",
  created: "Created date",
};

export function ProjectsToolbar({
  searchValue,
  onSearchChange,
  sort,
  onSortChange,
  view,
  onViewChange,
}: ProjectsToolbarProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <label className="search">
          <Search size={14} />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search projects..."
          />
        </label>

        <div className="sort-wrap" ref={containerRef}>
          <button type="button" className="sort-btn" onClick={() => setOpen((value) => !value)}>
            <span>{SORT_LABELS[sort]}</span>
            <ChevronDown size={13} />
          </button>

          {open ? (
            <div className="sort-menu">
              {(Object.keys(SORT_LABELS) as ProjectsSortOption[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`sort-option ${sort === option ? "active" : ""}`}
                  onClick={() => {
                    onSortChange(option);
                    setOpen(false);
                  }}
                >
                  <span>{SORT_LABELS[option]}</span>
                  {sort === option ? <Check size={12} /> : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="toolbar-spacer" />

      <div className="view-pill">
        <button
          type="button"
          className={`view-btn ${view === "list" ? "active" : ""}`}
          onClick={() => onViewChange("list")}
          aria-label="List view"
        >
          <List size={13} />
        </button>
        <button
          type="button"
          className={`view-btn ${view === "grid" ? "active" : ""}`}
          onClick={() => onViewChange("grid")}
          aria-label="Grid view"
        >
          <LayoutGrid size={13} />
        </button>
      </div>

      <style jsx>{`
        .toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 0;
        }
        .toolbar-spacer {
          flex: 1;
        }
        .search {
          flex: 1;
          max-width: 320px;
          height: 34px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 11px;
          border-radius: 8px;
          border: 1px solid var(--border2);
          background: var(--bg3);
          color: var(--text3);
          transition: border-color 0.3s ease;
        }
        .search:focus-within {
          border-color: var(--accent);
        }
        .search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 12px;
        }
        .search input::placeholder {
          color: var(--text3);
        }
        .sort-wrap {
          position: relative;
        }
        .sort-btn {
          height: 34px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 11px;
          border-radius: 8px;
          border: 1px solid var(--border2);
          background: var(--bg3);
          color: var(--text2);
          font-size: 12px;
          cursor: pointer;
        }
        .sort-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 170px;
          border-radius: 10px;
          border: 1px solid var(--border2);
          background: #171722;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          padding: 6px;
          z-index: 20;
        }
        .sort-option {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 8px 9px;
          border-radius: 8px;
          border: 0;
          background: transparent;
          color: var(--text2);
          font-size: 12px;
          cursor: pointer;
        }
        .sort-option:hover,
        .sort-option.active {
          background: var(--accent-subtle);
          color: var(--text);
        }
        .view-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px;
          border-radius: 999px;
          border: 1px solid var(--border2);
          background: var(--bg3);
        }
        .view-btn {
          width: 28px;
          height: 28px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: var(--text3);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition:
            background-color 0.2s ease,
            color 0.2s ease;
        }
        .view-btn.active {
          background: var(--accent-subtle);
          color: var(--accent-text);
        }
      `}</style>
    </div>
  );
}
