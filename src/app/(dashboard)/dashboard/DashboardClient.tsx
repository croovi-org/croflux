"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BossMilestone } from "@/components/dashboard/BossMilestone";
import { LockedMilestone } from "@/components/dashboard/LockedMilestone";
import { ProgressBar } from "@/components/dashboard/ProgressBar";
import { StatCards } from "@/components/dashboard/StatCards";
import { IconRail } from "@/components/workspace/IconRail";
import { Sidebar } from "@/components/workspace/Sidebar";
import { Topbar } from "@/components/workspace/Topbar";
import { createClient } from "@/lib/supabase/client";
import type { Milestone, Project, Task, User } from "@/types";

type MilestoneWithTasks = Milestone & { tasks: Task[] };

type DashboardClientProps = {
  user: User;
  project: Project;
  milestones: MilestoneWithTasks[];
  initialRank: number | null;
};

type ToastState = {
  title: string;
  body: string;
};

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || "Builder";
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (
    parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "AS"
  );
}

function isMilestoneComplete(milestone: MilestoneWithTasks) {
  return milestone.tasks.length > 0 && milestone.tasks.every((task) => task.completed);
}

function getActiveMilestoneIndex(milestones: MilestoneWithTasks[]) {
  const firstIncomplete = milestones.findIndex((milestone) => !isMilestoneComplete(milestone));
  return firstIncomplete === -1 ? 0 : firstIncomplete;
}

function getMilestoneProgress(milestone: MilestoneWithTasks) {
  if (milestone.tasks.length === 0) return 0;
  const complete = milestone.tasks.filter((task) => task.completed).length;
  return Math.round((complete / milestone.tasks.length) * 100);
}

function getBossHp(milestone: MilestoneWithTasks) {
  if (milestone.tasks.length === 0) return 100;
  const remaining = milestone.tasks.filter((task) => !task.completed).length;
  return Math.round((remaining / milestone.tasks.length) * 100);
}

function getNextUpTask(milestones: MilestoneWithTasks[]) {
  const activeMilestone = milestones[getActiveMilestoneIndex(milestones)];
  if (!activeMilestone) return null;
  const task = activeMilestone.tasks.find((item) => !item.completed);
  if (!task) return null;
  const taskIndex = activeMilestone.tasks.findIndex((item) => item.id === task.id);
  return {
    task,
    context: `${activeMilestone.title} · task ${taskIndex + 1} of ${activeMilestone.tasks.length}`,
  };
}

function ViewTabs() {
  const tabs = [
    { id: "list", label: "List", active: true },
    { id: "board", label: "Board", active: false },
    { id: "calendar", label: "Calendar", active: false },
    { id: "integrations", label: "Integrations", active: false, connected: 3 },
  ];

  return (
    <div className="view-tabs-shell">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`view-tab ${tab.active ? "active" : ""}`}
        >
          {tab.id === "integrations" ? (
            <span className="integrations-dot" />
          ) : (
            <TabIcon id={tab.id} />
          )}
          <span>{tab.label}</span>
          {tab.id === "integrations" && tab.connected ? (
            <span className="integrations-count">{tab.connected} connected</span>
          ) : null}
        </button>
      ))}
      <style jsx>{`
        .view-tabs-shell {
          display: flex;
          align-items: stretch;
          border-bottom: 1px solid #252538;
          background: var(--bg2);
          flex-shrink: 0;
          padding: 0 6px;
        }
        .view-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 14px;
          font-size: 11px;
          font-weight: 500;
          color: #5f5f7a;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          cursor: pointer;
          transition: color 0.12s ease, border-color 0.12s ease;
          white-space: nowrap;
        }
        .view-tab:hover {
          color: #9898b8;
        }
        .view-tab.active {
          color: #7c6ef7;
          border-bottom-color: #7c6ef7;
        }
        .view-tab :global(svg) {
          width: 13px;
          height: 13px;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          flex-shrink: 0;
        }
        .integrations-dot {
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: #22c55e;
          flex-shrink: 0;
        }
        .integrations-count {
          font-size: 10px;
          color: #22c55e;
          font-family: "Geist Mono", monospace;
        }
      `}</style>
    </div>
  );
}

function TabIcon({ id }: { id: string }) {
  if (id === "list") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    );
  }
  if (id === "board") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="7" height="18" rx="1.5" fill="none" />
        <rect x="14" y="3" width="7" height="11" rx="1.5" fill="none" />
      </svg>
    );
  }
  if (id === "calendar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2.5" fill="none" />
        <path d="M8 3.8v3.4M16 3.8v3.4M4 9.5h16" />
      </svg>
    );
  }
  return null;
}

function getIncompleteTaskCount(milestones: MilestoneWithTasks[]) {
  return milestones.reduce(
    (count, milestone) => count + milestone.tasks.filter((task) => !task.completed).length,
    0,
  );
}

export function DashboardClient({
  user,
  project,
  milestones: initialMilestones,
  initialRank,
}: DashboardClientProps) {
  const [milestones, setMilestones] = useState(initialMilestones);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        window.clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const activeMilestoneIndex = useMemo(
    () => getActiveMilestoneIndex(milestones),
    [milestones],
  );
  const activeMilestone = milestones[activeMilestoneIndex];
  const lockedMilestones = milestones.slice(activeMilestoneIndex + 1);
  const totalTasks = useMemo(
    () => milestones.reduce((count, milestone) => count + milestone.tasks.length, 0),
    [milestones],
  );
  const completedTasks = useMemo(
    () =>
      milestones.reduce(
        (count, milestone) => count + milestone.tasks.filter((task) => task.completed).length,
        0,
      ),
    [milestones],
  );
  const overallProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const currentMilestoneProgress = activeMilestone
    ? activeMilestone.is_boss
      ? getBossHp(activeMilestone)
      : getMilestoneProgress(activeMilestone)
    : 0;
  const sidebarMilestones = useMemo(
    () =>
      milestones.map((milestone, index) => ({
        id: milestone.id,
        title: milestone.title,
        progress: milestone.is_boss ? 100 - getBossHp(milestone) : getMilestoneProgress(milestone),
        state:
          index < activeMilestoneIndex
            ? ("done" as const)
            : index === activeMilestoneIndex
              ? ("active" as const)
              : ("locked" as const),
      })),
    [activeMilestoneIndex, milestones],
  );
  const nextUp = useMemo(() => getNextUpTask(milestones), [milestones]);
  const greeting = `${getGreeting()}, ${getFirstName(user.name)}`;
  const rank = initialRank;
  const topPercent = rank ? Math.max(4, rank * 4) : null;

  const showToast = (nextToast: ToastState) => {
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
    }
    setToast(nextToast);
    toastTimer.current = window.setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleTaskComplete = async (milestoneId: string, taskId: string) => {
    let defeatedMilestoneName: string | null = null;
    let unlockedMilestoneName: string | null = null;
    let nextToast: ToastState | null = null;

    setMilestones((current) =>
      current.map((milestone, milestoneIndex) => {
        if (milestone.id !== milestoneId) {
          return milestone;
        }

        const tasks = milestone.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task,
        );
        const updatedMilestone = { ...milestone, tasks };

        if (milestone.is_boss && tasks.every((task) => task.completed)) {
          defeatedMilestoneName = milestone.title;
          const unlocked = current[milestoneIndex + 1];
          unlockedMilestoneName = unlocked?.title ?? null;
          nextToast = {
            title: "Boss defeated",
            body: `${milestone.title} cleared.${unlocked?.title ? ` ${unlocked.title} unlocked.` : ""}`,
          };
        }

        return updatedMilestone;
      }),
    );

    const snapshot = milestones.map((milestone) =>
      milestone.id === milestoneId
        ? {
            ...milestone,
            tasks: milestone.tasks.map((task) =>
              task.id === taskId ? { ...task, completed: true } : task,
            ),
          }
        : milestone,
    );
    const updatedActive = snapshot[getActiveMilestoneIndex(snapshot)];
    const updatedBossHp = updatedActive ? getBossHp(updatedActive) : 0;
    const updatedTotalTasks = snapshot.reduce((count, milestone) => count + milestone.tasks.length, 0);
    const updatedCompletedTasks = snapshot.reduce(
      (count, milestone) => count + milestone.tasks.filter((task) => task.completed).length,
      0,
    );
    const updatedProgress =
      updatedTotalTasks === 0 ? 0 : Math.round((updatedCompletedTasks / updatedTotalTasks) * 100);

    if (!nextToast) {
      const messages: ToastState[] = [
        { title: "Momentum", body: `You're ${updatedProgress}% closer to launch.` },
        { title: "Shipping it", body: "Keep the streak alive." },
        { title: "Progress", body: `Boss HP at ${updatedBossHp}%. Almost there.` },
      ];
      nextToast = messages[Math.floor(Math.random() * messages.length)];
    }

    showToast(nextToast);

    const supabase = createClient();
    await Promise.all([
      supabase.from("tasks").update({ completed: true }).eq("id", taskId),
      supabase.from("activity_log").insert({
        user_id: user.id,
        task_completed: true,
        timestamp: new Date().toISOString(),
      }),
    ]);

    if (defeatedMilestoneName && unlockedMilestoneName) {
      showToast({
        title: "Boss defeated",
        body: `${defeatedMilestoneName} cleared. ${unlockedMilestoneName} unlocked.`,
      });
    }
  };

  return (
    <div className="dashboard-root">
      <div className="dashboard-glow" />
      <IconRail />
      <Sidebar
        workspaceName={project.name}
        initials={getInitials(user.name)}
        nextUpTask={nextUp?.task.title ?? null}
        nextUpContext={nextUp?.context ?? null}
        incompleteTaskCount={getIncompleteTaskCount(milestones)}
        rank={rank}
        milestones={sidebarMilestones}
        streak={user.streak}
      />
      <section className="dashboard-main">
        <Topbar
          workspaceName={project.name}
          currentPage="Dashboard"
          initials={getInitials(user.name)}
        />
        <ViewTabs />
        <div className="dashboard-body">
          <div className="dashboard-header">
            <div className="dashboard-greeting">{greeting}</div>
            <h1>
              {project.name}
              <span>.</span>
            </h1>
          </div>

          <StatCards
            overallProgress={overallProgress}
            completedTasks={completedTasks}
            totalTasks={totalTasks}
            currentMilestoneName={activeMilestone?.title ?? "No milestone"}
            currentMilestoneCopy={
              activeMilestone
                ? activeMilestone.is_boss
                  ? `Boss milestone · ${currentMilestoneProgress}% HP`
                  : `Milestone · ${currentMilestoneProgress}% complete`
                : "No active milestone"
            }
            rank={rank}
            topPercent={topPercent}
          />

          <ProgressBar
            progress={overallProgress}
            completedTasks={completedTasks}
            totalTasks={totalTasks}
          />

          <div className="section-head">
            <span>Active milestone</span>
            <span>
              {Math.min(activeMilestoneIndex + 1, milestones.length)} of {milestones.length} unlocked
            </span>
          </div>

          {activeMilestone ? (
            <BossMilestone
              milestone={activeMilestone}
              hp={getBossHp(activeMilestone)}
              onTaskComplete={handleTaskComplete}
              getTaskBadge={() => null}
            />
          ) : null}

          {lockedMilestones.map((milestone) => (
            <LockedMilestone key={milestone.id} title={milestone.title} />
          ))}
        </div>
      </section>

      <div className={`toast ${toast ? "visible" : ""}`}>
        <div className="toast-title">{toast?.title}</div>
        <div className="toast-body">{toast?.body}</div>
      </div>

      <style jsx>{`
        .dashboard-root {
          --bg: #0a0a0f;
          --bg2: #0f0f17;
          --bg3: #13131e;
          --bg4: #1a1a28;
          --bg5: #1f1f30;
          --border: #1e1e2e;
          --border2: #252538;
          --border3: #2e2e48;
          --accent: #7c6ef7;
          --accent2: #6357d4;
          --accent-dim: rgba(124, 110, 247, 0.08);
          --accent-glow: rgba(124, 110, 247, 0.15);
          --text: #f0f0f8;
          --text2: #9898b8;
          --text3: #5f5f7a;
          --green: #22c55e;
          --green-dim: rgba(34, 197, 94, 0.1);
          --amber: #ffb700;
          --amber-dim: rgba(255, 183, 0, 0.1);
          --red: #ef4444;
          --mono: "Geist Mono", monospace;
          position: relative;
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: var(--bg);
          color: var(--text);
          font-family: Inter, sans-serif;
        }
        .dashboard-root::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          background: rgba(124, 110, 247, 0.8);
          z-index: 2;
          pointer-events: none;
        }
        .dashboard-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 76% 8%, rgba(124, 110, 247, 0.03), transparent 24%);
        }
        .dashboard-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: var(--bg);
          overflow: hidden;
        }
        .dashboard-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px 24px 22px;
        }
        .dashboard-header {
          margin-bottom: 16px;
        }
        .dashboard-greeting {
          font-size: 11px;
          color: var(--text3);
          margin-bottom: 5px;
        }
        h1 {
          margin: 0;
          font-size: 18px;
          line-height: 1.1;
          font-weight: 600;
          color: var(--text);
          letter-spacing: -0.02em;
        }
        h1 span {
          color: var(--accent);
        }
        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          padding-bottom: 8px;
          margin-bottom: 12px;
          margin-top: 1px;
          gap: 10px;
        }
        .section-head span:first-child {
          font-size: 11px;
          font-weight: 500;
          color: var(--text);
        }
        .section-head span:last-child {
          font-size: 10px;
          color: var(--text3);
          font-family: var(--mono);
        }
        .toast {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 99;
          max-width: 260px;
          border-radius: 10px;
          background: var(--bg3);
          border: 1px solid var(--border2);
          border-left: 3px solid var(--accent);
          padding: 11px 14px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          opacity: 0;
          transform: translateY(8px);
          pointer-events: none;
          transition: all 0.3s ease;
        }
        .toast.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .toast-title {
          margin-bottom: 3px;
          font-size: 10px;
          color: var(--accent);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-family: var(--mono);
        }
        .toast-body {
          font-size: 11px;
          line-height: 1.5;
          color: var(--text2);
        }
      `}</style>
    </div>
  );
}
