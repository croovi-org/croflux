"use client";

export default function DashboardLoading() {
  return (
    <div className="shell">
      {/* Icon rail */}
      <div className="icon-rail" />

      {/* Sidebar skeleton */}
      <div className="sidebar">
        <div className="sk sk-workspace-name" />
        <div className="sk sk-nav-item" />
        <div className="sk sk-nav-item" />
        <div className="sk sk-nav-item" />
        <div className="sk sk-nav-item w60" />
        <div className="sidebar-divider" />
        <div className="sk sk-label" />
        <div className="sk sk-milestone" />
        <div className="sk sk-milestone" />
        <div className="sk sk-milestone w70" />
      </div>

      {/* Main content shell */}
      <div className="content">
        {/* Topbar */}
        <div className="topbar">
          <div className="sk sk-breadcrumb" />
          <div className="topbar-right">
            <div className="sk sk-avatar" />
          </div>
        </div>

        {/* Tab bar */}
        <div className="tabbar">
          <div className="sk sk-tab" />
          <div className="sk sk-tab" />
          <div className="sk sk-tab w50" />
        </div>

        {/* Body */}
        <div className="body">
          {/* Greeting + title */}
          <div className="sk sk-greeting" />
          <div className="sk sk-title" />

          {/* Stat cards row */}
          <div className="stat-row">
            <div className="sk sk-stat-card" />
            <div className="sk sk-stat-card" />
            <div className="sk sk-stat-card" />
            <div className="sk sk-stat-card" />
          </div>

          {/* Progress bar */}
          <div className="sk sk-progress-bar" />

          {/* Section heading */}
          <div className="sk sk-section-head" />

          {/* Milestone block */}
          <div className="milestone-block">
            <div className="sk sk-milestone-title" />
            <div className="sk sk-task-row" />
            <div className="sk sk-task-row" />
            <div className="sk sk-task-row w80" />
            <div className="sk sk-task-row w60" />
          </div>

          {/* Locked milestone */}
          <div className="milestone-block locked">
            <div className="sk sk-milestone-title w50" />
            <div className="sk sk-task-row w70" />
            <div className="sk sk-task-row w55" />
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ── Layout ── */
        .shell {
          position: fixed;
          inset: 0;
          display: flex;
          background: #0f0f17;
          overflow: hidden;
        }
        .icon-rail {
          width: 52px;
          min-width: 52px;
          background: #0d0d14;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }
        .sidebar {
          width: 220px;
          min-width: 220px;
          background: #0d0d14;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-shrink: 0;
        }
        .sidebar-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
          margin: 6px 0;
        }
        .content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .topbar {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tabbar {
          height: 48px;
          display: flex;
          align-items: center;
          gap: 28px;
          padding: 0 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }
        .body {
          flex: 1;
          padding: 22px 24px 28px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .stat-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin: 4px 0;
        }
        .milestone-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(255, 255, 255, 0.015);
        }
        .milestone-block.locked {
          opacity: 0.4;
        }

        /* ── Shimmer base ── */
        @keyframes shimmer {
          0% {
            background-position: -400px 0;
          }
          100% {
            background-position: 400px 0;
          }
        }
        .sk {
          border-radius: 6px;
          background: linear-gradient(
            90deg,
            #1a1a28 0px,
            #23233a 80px,
            #1a1a28 160px
          );
          background-size: 400px 100%;
          animation: shimmer 1.4s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* ── Skeleton sizes ── */
        .sk-workspace-name {
          height: 18px;
          width: 80%;
        }
        .sk-nav-item {
          height: 32px;
          width: 100%;
          border-radius: 8px;
        }
        .sk-label {
          height: 10px;
          width: 40%;
        }
        .sk-milestone {
          height: 24px;
          width: 100%;
          border-radius: 6px;
        }
        .sk-breadcrumb {
          height: 14px;
          width: 160px;
        }
        .sk-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .sk-tab {
          height: 12px;
          width: 48px;
        }
        .sk-greeting {
          height: 11px;
          width: 120px;
        }
        .sk-title {
          height: 22px;
          width: 180px;
        }
        .sk-stat-card {
          height: 72px;
          border-radius: 10px;
        }
        .sk-progress-bar {
          height: 4px;
          width: 100%;
          border-radius: 2px;
        }
        .sk-section-head {
          height: 10px;
          width: 200px;
          margin-top: 8px;
        }
        .sk-milestone-title {
          height: 14px;
          width: 55%;
        }
        .sk-task-row {
          height: 36px;
          border-radius: 8px;
        }

        /* width modifiers */
        .w80 {
          width: 80% !important;
        }
        .w70 {
          width: 70% !important;
        }
        .w60 {
          width: 60% !important;
        }
        .w55 {
          width: 55% !important;
        }
        .w50 {
          width: 50% !important;
        }
      `}</style>
    </div>
  );
}
