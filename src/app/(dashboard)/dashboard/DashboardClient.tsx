"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BossMilestone } from "@/components/dashboard/BossMilestone";
import { LockedMilestone } from "@/components/dashboard/LockedMilestone";
import { ProgressBar } from "@/components/dashboard/ProgressBar";
import { StatCards } from "@/components/dashboard/StatCards";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
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
type BoardColumnId = "todo" | "inprogress" | "done";
type BoardItem = {
  id: string;
  title: string;
  milestoneTitle: string;
  sequence: number;
  dateLabel: string | null;
};
type BoardOverrides = Record<string, Exclude<BoardColumnId, "done">>;

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

function formatBoardDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getBoardColumnsWithOverrides(
  milestones: MilestoneWithTasks[],
  overrides: BoardOverrides,
) {
  const activeMilestoneIndex = getActiveMilestoneIndex(milestones);
  const columns: Record<BoardColumnId, BoardItem[]> = {
    todo: [],
    inprogress: [],
    done: [],
  };

  let sequence = 1;
  let inProgressAssigned = 0;

  milestones.forEach((milestone, milestoneIndex) => {
    milestone.tasks.forEach((task, taskIndex) => {
      const item: BoardItem = {
        id: task.id,
        title: task.title,
        milestoneTitle: milestone.title,
        sequence,
        dateLabel:
          sequence % 3 === 0 || taskIndex === milestone.tasks.length - 1
            ? formatBoardDate(task.created_at)
            : null,
      };

      if (task.completed) {
        columns.done.push(item);
      } else {
        const override = overrides[task.id];
        if (override === "inprogress") {
          columns.inprogress.push(item);
        } else if (override === "todo") {
          columns.todo.push(item);
        } else if (
          milestoneIndex === activeMilestoneIndex &&
          inProgressAssigned < 2
        ) {
          columns.inprogress.push(item);
          inProgressAssigned += 1;
        } else {
          columns.todo.push(item);
        }
      }

      sequence += 1;
    });
  });

  if (columns.inprogress.length === 0 && columns.todo.length > 0) {
    columns.inprogress.push(columns.todo.shift() as BoardItem);
  }

  return columns;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "list", label: "List" },
  { id: "board", label: "Board" },
  { id: "calendar", label: "Calendar" },
  { id: "integrations", label: "Integrations" },
];

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
function BoardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="18" rx="1.5" /><rect x="14" y="3" width="7" height="11" rx="1.5" />
    </svg>
  );
}
function CalTabIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IntegrationsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 7.5 5.5 5 3 7.5 5.5 10 8 7.5Z" />
      <path d="M21 7.5 18.5 5 16 7.5l2.5 2.5L21 7.5Z" />
      <path d="M12 12l-2-2m2 2 2-2m-2 2-2 2m2-2 2 2" />
      <path d="M8 16.5 5.5 14 3 16.5 5.5 19 8 16.5Z" />
      <path d="M21 16.5 18.5 14 16 16.5l2.5 2.5L21 16.5Z" />
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
          {tab.id === "integrations" && <IntegrationsIcon />}
          <span>{tab.label}</span>
        </button>
      ))}
      <style jsx>{`
        .vtabs {
          display: flex;
          padding: 0;
          gap: 28px;
          align-items: center;
          flex-shrink: 0;
          background: transparent;
        }
        .vtab {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 0 7px;
          font-size: 12px;
          font-weight: 500;
          color: #5f5f7a;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -7px;
          cursor: pointer;
          transition: color 0.12s, border-color 0.12s;
          white-space: nowrap;
          font-family: Inter, sans-serif;
        }
        .vtab:hover { color: #9898b8; }
        .vtab.active { color: #7c6ef7; border-bottom-color: #7c6ef7; }
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

function BoardView({
  milestones,
  projectId,
  onMoveTask,
}: {
  milestones: MilestoneWithTasks[];
  projectId: string;
  onMoveTask: (taskId: string, destination: BoardColumnId) => Promise<void>;
}) {
  const storageKey = `croflux-board:${projectId}`;
  const [boardOverrides, setBoardOverrides] = useState<BoardOverrides>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as BoardOverrides) : {};
    } catch {
      return {};
    }
  });
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<BoardColumnId | null>(null);

  const sanitizedOverrides = useMemo(() => {
    const incompleteTaskIds = new Set(
      milestones.flatMap((milestone) =>
        milestone.tasks.filter((task) => !task.completed).map((task) => task.id),
      ),
    );

    return Object.fromEntries(
      Object.entries(boardOverrides).filter(([taskId]) => incompleteTaskIds.has(taskId)),
    ) as BoardOverrides;
  }, [boardOverrides, milestones]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(sanitizedOverrides));
  }, [sanitizedOverrides, storageKey]);

  const columns = useMemo(
    () => getBoardColumnsWithOverrides(milestones, sanitizedOverrides),
    [milestones, sanitizedOverrides],
  );
  const columnMeta: {
    id: BoardColumnId;
    label: string;
    tone: "muted" | "accent" | "success";
  }[] = [
    { id: "todo", label: "TO DO", tone: "muted" },
    { id: "inprogress", label: "IN PROGRESS", tone: "accent" },
    { id: "done", label: "DONE", tone: "success" },
  ];

  const persistOverrides = (next: BoardOverrides) => {
    setBoardOverrides(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const handleDrop = async (destination: BoardColumnId) => {
    if (!draggedTaskId) return;

    const nextOverrides = { ...sanitizedOverrides };
    if (destination === "done") {
      delete nextOverrides[draggedTaskId];
    } else {
      nextOverrides[draggedTaskId] = destination;
    }

    persistOverrides(nextOverrides);
    setActiveDropColumn(null);
    const taskId = draggedTaskId;
    setDraggedTaskId(null);
    await onMoveTask(taskId, destination);
  };

  return (
    <div className="board-view">
      {columnMeta.map((column) => (
        <section
          key={column.id}
          className={`board-column ${column.tone} ${
            activeDropColumn === column.id ? "drop-active" : ""
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setActiveDropColumn(column.id);
          }}
          onDragLeave={() => {
            setActiveDropColumn((current) =>
              current === column.id ? null : current,
            );
          }}
          onDrop={async (event) => {
            event.preventDefault();
            await handleDrop(column.id);
          }}
        >
          <div className="board-column-head">
            <span className="board-column-label">{column.label}</span>
            <span className="board-column-count">{columns[column.id].length}</span>
          </div>

          <div className="board-stack">
            {columns[column.id].map((item) => (
              <article
                key={item.id}
                className="board-card"
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", item.id);
                  setDraggedTaskId(item.id);
                }}
                onDragEnd={() => {
                  setDraggedTaskId(null);
                  setActiveDropColumn(null);
                }}
              >
                <h3>{item.title}</h3>
                <div className="board-meta">
                  <span className="board-chip milestone">{item.milestoneTitle}</span>
                  {column.id !== "done" ? (
                    <span className="board-chip subtle">#{item.sequence}</span>
                  ) : null}
                  {item.dateLabel ? (
                    <span className="board-chip date">{item.dateLabel}</span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <style jsx>{`
        .board-view {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          padding: 22px 20px 18px;
          overflow: auto;
          min-height: 0;
        }
        .board-column {
          min-width: 0;
          min-height: 0;
          height: 100%;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(180deg, rgba(29, 29, 39, 0.96) 0%, rgba(27, 27, 37, 0.98) 100%);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.02),
            0 18px 40px rgba(0, 0, 0, 0.16);
          padding: 22px 20px 20px;
          display: flex;
          flex-direction: column;
          transition:
            border-color 0.16s ease,
            box-shadow 0.16s ease,
            background 0.16s ease;
        }
        .board-column.drop-active {
          border-color: rgba(124, 110, 247, 0.22);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.02),
            0 18px 40px rgba(0, 0, 0, 0.16),
            0 0 0 1px rgba(124, 110, 247, 0.12);
        }
        .board-column-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }
        .board-column-label {
          font-size: 11px;
          letter-spacing: 0.16em;
          font-family: var(--mono);
        }
        .board-column.muted .board-column-label {
          color: #6e7692;
        }
        .board-column.accent .board-column-label {
          color: #887cff;
        }
        .board-column.success .board-column-label {
          color: #38d27d;
        }
        .board-column-count {
          min-width: 24px;
          height: 24px;
          padding: 0 8px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.04);
          color: #757b94;
          font-size: 12px;
          font-family: var(--mono);
        }
        .board-stack {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .board-card {
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(180deg, rgba(34, 34, 46, 0.96) 0%, rgba(31, 31, 42, 0.98) 100%);
          padding: 18px 20px 16px;
          min-height: 110px;
          cursor: grab;
          transition:
            transform 0.16s ease,
            border-color 0.16s ease,
            box-shadow 0.16s ease;
        }
        .board-card:active {
          cursor: grabbing;
        }
        .board-card:hover {
          transform: translateY(-2px);
          border-color: rgba(124, 110, 247, 0.18);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.18);
        }
        .board-card h3 {
          margin: 0 0 18px;
          font-size: 16px;
          line-height: 1.35;
          font-weight: 500;
          color: #e3e6f2;
          letter-spacing: -0.01em;
        }
        .board-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .board-chip {
          height: 28px;
          padding: 0 11px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          letter-spacing: 0.02em;
          font-family: var(--mono);
        }
        .board-chip.milestone {
          color: #8b7fff;
          border: 1px solid rgba(124, 110, 247, 0.42);
          background: rgba(124, 110, 247, 0.08);
        }
        .board-chip.subtle {
          color: #70758c;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
        }
        .board-chip.date {
          color: #54a2ff;
          border: 1px solid rgba(64, 130, 255, 0.42);
          background: rgba(64, 130, 255, 0.08);
        }
        @media (max-width: 1180px) {
          .board-view {
            grid-template-columns: 1fr;
          }
          .board-column {
            min-height: 0;
          }
        }
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
    ? activeMilestone.is_boss
      ? 100 - getBossHp(activeMilestone)
      : getMilestoneProgress(activeMilestone)
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
    const updBossProgress = updActive
      ? updActive.is_boss
        ? 100 - getBossHp(updActive)
        : getMilestoneProgress(updActive)
      : 0;
    const updTotal = snapshot.reduce((n, m) => n + m.tasks.length, 0);
    const updDone = snapshot.reduce((n, m) => n + m.tasks.filter((t) => t.completed).length, 0);
    const updPct = updTotal === 0 ? 0 : Math.round((updDone / updTotal) * 100);

    if (!nextToast) {
      const msgs: ToastState[] = [
        { title: "Momentum", body: `You're ${updPct}% closer to launch.` },
        { title: "Shipping it", body: "Keep the streak alive." },
        { title: "Progress", body: `Boss progress at ${updBossProgress}%. Keep going.` },
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

  const handleBoardMove = async (taskId: string, destination: BoardColumnId) => {
    const shouldComplete = destination === "done";

    setMilestones((current) =>
      current.map((milestone) => ({
        ...milestone,
        tasks: milestone.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: shouldComplete } : task,
        ),
      })),
    );

    const supabase = createClient();
    await supabase
      .from("tasks")
      .update({ completed: shouldComplete })
      .eq("id", taskId);
  };

  return (
    <>
      <WorkspaceShell
        workspaceName={project.name}
        currentPage="Dashboard"
        currentSection="/dashboard"
        initials={getInitials(user.name)}
        userName={user.name}
        nextUpTask={nextUp?.task.title ?? null}
        nextUpContext={nextUp?.context ?? null}
        incompleteTaskCount={getIncompleteTaskCount(milestones)}
        rank={rank}
        milestones={sidebarMilestones}
        streak={user.streak}
        headerBottom={<div className="navbar-tabs"><ViewTabs active={activeTab} onSelect={setActiveTab} /></div>}
      >
        <main className="main">
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
                      ? `Boss milestone · ${currentMilestoneProgress}% complete`
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
                  progress={100 - getBossHp(activeMilestone)}
                  onTaskComplete={handleTaskComplete}
                  getTaskBadge={() => null}
                />
              )}

              {lockedMilestones.map((m) => (
                <LockedMilestone key={m.id} title={m.title} />
              ))}
            </div>
          ) : activeTab === "board" ? (
            <BoardView
              milestones={milestones}
              projectId={project.id}
              onMoveTask={handleBoardMove}
            />
          ) : (
            <ComingSoon label={TABS.find((t) => t.id === activeTab)?.label ?? ""} />
          )}
        </main>

        <div className={`toast ${toast ? "show" : ""}`}>
          <div className="toast-title">{toast?.title}</div>
          <div className="toast-body">{toast?.body}</div>
        </div>
      </WorkspaceShell>
      <style jsx>{`
        .navbar-tabs {
          height: 48px;
          display: flex;
          align-items: flex-end;
          margin-top: 0;
          padding-top: 0;
          padding-bottom: 8px;
          position: relative;
        }
        .navbar-tabs::after {
          content: "";
          position: absolute;
          left: -24px;
          right: -24px;
          bottom: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
        }
        .main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: hidden; }
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
    </>
  );
}
