"use client";

import Link from "next/link";
import { Layers3, Plus } from "lucide-react";

export function EmptyProjects() {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Layers3 size={24} />
      </div>
      <h2>Start your first project</h2>
      <p>
        Turn your idea into a structured execution plan. Paste your strategy and let
        AI generate your roadmap in seconds.
      </p>
      <Link
        href="/onboarding"
        className="empty-cta"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: "10px",
          height: "47px",
          padding: "0 23px",
          borderRadius: "16px",
          background: "var(--accent)",
          color: "#fff",
          whiteSpace: "nowrap",
          boxShadow: "0 8px 24px color-mix(in srgb, var(--accent) 22%, transparent)",
        }}
      >
        <Plus size={14} />
        <span>Create Project</span>
      </Link>

      <style jsx>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 64px 32px;
          background: var(--bg3);
          border: 1.5px dashed var(--border2);
          border-radius: 14px;
        }
        .empty-icon {
          width: 56px;
          height: 56px;
          margin-bottom: 18px;
          border-radius: 14px;
          border: 1px solid var(--border2);
          background: var(--bg4);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--text3);
        }
        h2 {
          margin: 0 0 6px;
          color: var(--text);
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.015em;
        }
        p {
          max-width: 340px;
          margin: 0 0 22px;
          color: var(--text3);
          font-size: 13px;
          line-height: 1.7;
        }
        .empty-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 47px;
          padding: 0 23px;
          border-radius: 16px;
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
        }
        .empty-cta:hover {
          background: color-mix(in srgb, var(--accent) 90%, black 10%);
        }
        .empty-cta :global(svg) {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
