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
      <Link href="/onboarding" className="empty-cta">
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
          gap: 7px;
          padding: 11px 22px;
          border-radius: 8px;
          background: var(--accent);
          color: #fff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
        }
        .empty-cta:hover {
          background: var(--accent-hover);
        }
      `}</style>
    </div>
  );
}
