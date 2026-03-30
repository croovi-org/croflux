"use client";

import Link from "next/link";

export function EmptyProjects() {
  return (
    <section className="empty-state">
      <div className="empty-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2>Create your first project</h2>
      <p>
        Turn your idea into milestones and tasks. Paste your strategy and let AI build your
        execution roadmap.
      </p>
      <Link href="/onboarding" className="empty-cta">
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path
            d="M12 5v14M5 12h14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Create Project</span>
      </Link>

      <style jsx>{`
        .empty-state {
          border: 1.5px dashed var(--border2);
          border-radius: 12px;
          background: var(--bg3);
          padding: 56px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .empty-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          border: 1px solid var(--border2);
          background: var(--bg4);
          display: grid;
          place-items: center;
          color: var(--text3);
        }
        h2 {
          margin: 16px 0 8px;
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
        }
        p {
          margin: 0;
          max-width: 300px;
          font-size: 12px;
          line-height: 1.55;
          color: var(--text3);
        }
        .empty-cta {
          margin-top: 20px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 38px;
          padding: 0 16px;
          border-radius: 10px;
          background: var(--accent);
          color: #fff;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }
        .empty-cta:hover {
          background: var(--accent-hover);
        }
      `}</style>
    </section>
  );
}
