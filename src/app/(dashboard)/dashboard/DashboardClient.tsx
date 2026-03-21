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

type ToastState = { title: string; body: string };
type TabId = "list" | "board" | "calendar" | "integrations";

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || "Builder";
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "AS";
}

function isMilestoneComplete(m: MilestoneWithTasks) {
  return m.tasks.length > 0 && m.tasks.every((t) => t.completed);
}

function getActiveMilestoneIndex(milestones: MilestoneWithTasks[]) {
  const i = milestones.findIndex((m) => !isMilestoneComplete(m));
  return i === -1 ? 0 : i;
}

function getMilestoneProgress(m: MilestoneWithTasks) {
  if (m.tasks.length === 0) return 0;
  return Math.round((m.tasks.filter((t) => t.completed).length / m.tasks.length) * 100);
}

function getBossHp(m: MilestoneWithTasks) {
  if (m.tasks.length === 0) return 100;
  return Math.round((m.tasks.filter((t) => !t.completed).length / m.tasks.length) * 100);
}

function getNextUpTask(milestones: MilestoneWithTasks[]) {
  const active = milestones[getActiveMilestoneIndex(milestones)];
  if (!active) return null;
  const task = active.tasks.find((t) => !t.completed);
  if (!task) return null;
  const idx = active.tasks.findIndex((t) => t.id === task.id);
  return { task, context: `${active.title} · task ${idx + 1} of ${active.tasks.length}` };
}

function getIncompleteTaskCount(milestones: MilestoneWithTasks[]) {
  return milestones.reduce((n, m) => n + m.tasks.filter((t) => !t.completed).length, 0);
}

const TABS: { id: TabId; label: string }[] = [
  { id: "list", label: "List" },
  { id: "board", label: "Board" },
  { id: "calendar", label: "Calendar" },
  { id: "integrations", label: "Integrations" },
];

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
function BoardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="18" rx="1.5" /><rect x="14" y="3" width="7" height="11" rx="1.5" />
    </svg>
  );
}
function CalTabIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ViewTabs({ active, onSelect }: { active: TabId; onSelect: (t: TabId) => void }) {
  return (
    <div className="vtabs">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`vtab ${active === tab.id ? "active" : ""}`}
          onClick={() => onSelect(tab.id)}
        >
          {tab.id === "list" && <ListIcon />}
          {tab.id === "board" && <BoardIcon />}
          {tab.id === "calendar" && <CalTabIcon />}
          {tab.id === "integrations" && <span className="vdot" />}
          <span>{tab.label}</span>
          {tab.id === "integrations" && (
            <span className="vconnected">3 connected</span>
          )}
        </button>
      ))}
      <style jsx>{`
        .vtabs {
          display: flex;
          border-bottom: 1px solid #252538;
          padding: 0 22px;
          flex-shrink: 0;
          background: #0f0f17;
        }
        .vtab {
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
          transition: color 0.12s, border-color 0.12s;
          white-space: nowrap;
          font-family: Inter, sans-serif;
        }
        .vtab:hover { color: #9898b8; }
        .vtab.active { color: #7c6ef7; border-bottom-color: #7c6ef7; }
        .vdot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #22c55e; flex-shrink: 0;
        }
        .vconnected { font-size: 10px; color: #22c55e; font-family: "Geist Mono", monospace; }
      `}</style>
    </div>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="coming-soon">
      <div className="cs-label">{label}</div>
      <div className="cs-text">Coming soon</div>
      <style jsx>{`
        .coming-soon {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #5f5f7a;
        }
        .cs-label { font-size: 11px; font-weight: 500; color: #5f5f7a; }
        .cs-text { font-size: 10px; font-family: "Geist Mono", monospace; color: #2e2e48; }
      `}</style>
    </div>
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
  const [activeTab, setActiveTab] = useState<TabId>("list");
  const toastTimer = useRef<number | null>(null);

  useEffect(() => () => { if (toastTimer.current) window.clearTimeout(toastTimer.current); }, []);

  const activeMilestoneIndex = useMemo(() => getActiveMilestoneIndex(milestones), [milestones]);
  const activeMilestone = milestones[activeMilestoneIndex];
  const lockedMilestones = milestones.slice(activeMilestoneIndex + 1);

  const totalTasks = useMemo(() => milestones.reduce((n, m) => n + m.tasks.length, 0), [milestones]);
  const completedTasks = useMemo(() => milestones.reduce((n, m) => n + m.tasks.filter((t) => t.completed).length, 0), [milestones]);
  const overallProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const currentMilestoneProgress = activeMilestone
    ? activeMilestone.is_boss ? getBossHp(activeMilestone) : getMilestoneProgress(activeMilestone)
    : 0;

  const sidebarMilestones = useMemo(() =>
    milestones.map((m, i) => ({
      id: m.id,
      title: m.title,
      progress: m.is_boss ? 100 - getBossHp(m) : getMilestoneProgress(m),
      state: i < activeMilestoneIndex ? ("done" as const) : i === activeMilestoneIndex ? ("active" as const) : ("locked" as const),
    })),
    [activeMilestoneIndex, milestones],
  );

  const nextUp = useMemo(() => getNextUpTask(milestones), [milestones]);
  const greeting = `${getGreeting()}, ${getFirstName(user.name)}`;
  const rank = initialRank;
  const topPercent = rank ? Math.max(4, rank * 4) : null;

  const showToast = (next: ToastState) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast(next);
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  };

  const handleTaskComplete = async (milestoneId: string, taskId: string) => {
    let defeatedName: string | null = null;
    let unlockedName: string | null = null;
    let nextToast: ToastState | null = null;

    setMilestones((cur) =>
      cur.map((m, mi) => {
        if (m.id !== milestoneId) return m;
        const tasks = m.tasks.map((t) => t.id === taskId ? { ...t, completed: true } : t);
        const updated = { ...m, tasks };
        if (m.is_boss && tasks.every((t) => t.completed)) {
          defeatedName = m.title;
          const next = cur[mi + 1];
          unlockedName = next?.title ?? null;
          nextToast = { title: "Boss defeated", body: `${m.title} cleared.${next ? ` ${next.title} unlocked.` : ""}` };
        }
        return updated;
      }),
    );

    const snapshot = milestones.map((m) =>
      m.id === milestoneId
        ? { ...m, tasks: m.tasks.map((t) => t.id === taskId ? { ...t, completed: true } : t) }
        : m,
    );
    const updActive = snapshot[getActiveMilestoneIndex(snapshot)];
    const updHp = updActive ? getBossHp(updActive) : 0;
    const updTotal = snapshot.reduce((n, m) => n + m.tasks.length, 0);
    const updDone = snapshot.reduce((n, m) => n + m.tasks.filter((t) => t.completed).length, 0);
    const updPct = updTotal === 0 ? 0 : Math.round((updDone / updTotal) * 100);

    if (!nextToast) {
      const msgs: ToastState[] = [
        { title: "Momentum", body: `You're ${updPct}% closer to launch.` },
        { title: "Shipping it", body: "Keep the streak alive." },
        { title: "Progress", body: `Boss HP at ${updHp}%. Almost there.` },
      ];
      nextToast = msgs[Math.floor(Math.random() * msgs.length)];
    }
    showToast(nextToast);

    const supabase = createClient();
    await Promise.all([
      supabase.from("tasks").update({ completed: true }).eq("id", taskId),
      supabase.from("activity_log").insert({ user_id: user.id, task_completed: true, timestamp: new Date().toISOString() }),
    ]);

    if (defeatedName && unlockedName) {
      showToast({ title: "Boss defeated", body: `${defeatedName} cleared. ${unlockedName} unlocked.` });
    }
  };

  return (
    <div className="shell">
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

      <main className="main">
        <Topbar workspaceName={project.name} currentPage="Dashboard" initials={getInitials(user.name)} />
        <ViewTabs active={activeTab} onSelect={setActiveTab} />

        {activeTab === "list" ? (
          <div className="body">
            <div className="header">
              <div className="greeting">{greeting}</div>
              <h1>{project.name}<span className="dot">.</span></h1>
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

            <ProgressBar progress={overallProgress} completedTasks={completedTasks} totalTasks={totalTasks} />

            <div className="section-head">
              <span>Active milestone</span>
              <span>{Math.min(activeMilestoneIndex + 1, milestones.length)} of {milestones.length} unlocked</span>
            </div>

            {activeMilestone && (
              <BossMilestone
                milestone={activeMilestone}
                hp={getBossHp(activeMilestone)}
                onTaskComplete={handleTaskComplete}
                getTaskBadge={() => null}
              />
            )}

            {lockedMilestones.map((m) => (
              <LockedMilestone key={m.id} title={m.title} />
            ))}
          </div>
        ) : (
          <ComingSoon label={TABS.find((t) => t.id === activeTab)?.label ?? ""} />
        )}
      </main>

      <div className={`toast ${toast ? "show" : ""}`}>
        <div className="toast-title">{toast?.title}</div>
        <div className="toast-body">{toast?.body}</div>
      </div>

      <style jsx>{`
        .shell {
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
          --accent-dim: rgba(124,110,247,0.08);
          --text: #f0f0f8;
          --text2: #9898b8;
          --text3: #5f5f7a;
          --green: #22c55e;
          --amber: #ffb700;
          --amber-dim: rgba(255,183,0,0.10);
          --mono: "Geist Mono", monospace;
          position: fixed;
          inset: 0;
          display: flex;
          overflow: hidden;
          background: var(--bg);
          color: var(--text);
          font-family: Inter, sans-serif;
        }
        .shell::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 1px;
          background: rgba(124,110,247,0.7);
          z-index: 10;
          pointer-events: none;
        }
        .main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: #0f0f17;
          overflow: hidden;
        }
        .body {
          flex: 1;
          overflow-y: auto;
          padding: 22px 24px 28px;
        }
        .header { margin-bottom: 18px; }
        .greeting {
          font-size: 11px;
          color: var(--text3);
          margin-bottom: 4px;
        }
        h1 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: var(--text);
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .dot { color: var(--accent); }
        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          padding-bottom: 8px;
          margin-bottom: 12px;
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
          background: #13131e;
          border: 1px solid #252538;
          border-left: 3px solid #7c6ef7;
          padding: 11px 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          opacity: 0;
          transform: translateY(8px);
          pointer-events: none;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .toast.show { opacity: 1; transform: translateY(0); }
        .toast-title {
          margin-bottom: 3px;
          font-size: 10px;
          color: #7c6ef7;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-family: var(--mono);
        }
        .toast-body {
          font-size: 11px;
          line-height: 1.5;
          color: #9898b8;
        }
      `}</style>
    </div>
  );
}
