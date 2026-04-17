"use client";

import type { ReactNode } from "react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ActiveMilestone } from "@/components/dashboard/ActiveMilestone";
import { BossMilestone } from "@/components/dashboard/BossMilestone";
import { CalendarView } from "@/components/dashboard/CalendarView";
import { CompletedMilestone } from "@/components/dashboard/CompletedMilestone";
import { LockedMilestone } from "@/components/dashboard/LockedMilestone";
import { ProgressBar } from "@/components/dashboard/ProgressBar";
import { StatCards } from "@/components/dashboard/StatCards";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import type { Milestone, Project, Task, User } from "@/types";

type MilestoneWithTasks = Milestone & { tasks: Task[] };

type DashboardClientProps = {
  user: User;
  project: Project;
  milestones: MilestoneWithTasks[];
  initialRank: number | null;
  projectCount: number;
  workspaceName: string;
  allProjects: Project[];
};

type ToastState = { title: string; body: string };
type DeleteCandidate = {
  id: string;
  title: string;
  googleEventId: string | null;
};
type TabId = "list" | "board" | "calendar" | "integrations";
type BoardColumnId = "todo" | "inprogress" | "done";
type BoardItem = {
  id: string;
  title: string;
  milestoneTitle: string;
  sequence: number;
  dateLabel: string | null;
  googleEventId: string | null;
  difficulty?: "easy" | "medium" | "hard";
};
type BoardOverrides = Record<string, Exclude<BoardColumnId, "done">>;
type IntegrationItem = {
  id: string;
  name: string;
  description: string;
  features: string[];
  icon: ReactNode;
  action: "connect" | "soon";
  muted?: boolean;
};
function getFirstName(name: string | null | undefined) {
  if (!name) return "Builder";
  return name.trim().split(/\s+/)[0] || "Builder";
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string | null | undefined) {
  if (!name) return "AS";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "AS";
}

function isMilestoneComplete(m: MilestoneWithTasks) {
  return m.tasks.length > 0 && m.tasks.every((t) => t.completed);
}

function getActiveMilestoneIndex(milestones: MilestoneWithTasks[]) {
  const i = milestones.findIndex((m) => !isMilestoneComplete(m));
  return i === -1 ? milestones.length : i;
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
        dateLabel: (task as Task & { due_date?: string | null }).due_date
          ? formatBoardDate((task as Task & { due_date?: string | null }).due_date!)
          : null,
        googleEventId: (task as Task & { google_event_id?: string | null }).google_event_id ?? null,
        difficulty: (task as Task & { difficulty?: "easy" | "medium" | "hard" }).difficulty,
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
        .vtab.active { color: var(--accent); border-bottom-color: var(--accent); }
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

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58l-.02-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.34-1.75-1.34-1.75-1.1-.75.08-.73.08-.73 1.21.09 1.85 1.23 1.85 1.23 1.08 1.83 2.84 1.3 3.53 1 .11-.77.42-1.3.76-1.6-2.67-.3-5.48-1.32-5.48-5.89 0-1.3.47-2.36 1.24-3.19-.13-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.22a11.6 11.6 0 0 1 6 0c2.29-1.54 3.3-1.22 3.3-1.22.66 1.65.25 2.88.12 3.18.77.83 1.24 1.89 1.24 3.19 0 4.58-2.82 5.58-5.5 5.88.43.37.82 1.1.82 2.22l-.02 3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function NotionIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 4.5 17.5 3l2 2v14l-12.5 2L5 19V4.5Z" />
      <path d="M8 8.5v8m0-8 7-1m-7 1 7 8m0-9v9" />
    </svg>
  );
}

function GoogleCalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M8 2v4m8-4v4M3 9.5h18" />
      <rect x="8" y="12" width="4" height="4" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function AppleCalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M8 2v3m8-3v3M4 7h16M6 4h12a2 2 0 0 1 2 2v12a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V6a2 2 0 0 1 2-2Z" />
      <path d="M12 11.5c-.9-.8-2.2-.72-2.95.17-.75.9-.68 2.28.16 3.06.85.79 2.17.72 2.95-.17.79.89 2.11.96 2.95.17.84-.78.9-2.16.16-3.06-.75-.89-2.06-.97-2.95-.17Z" />
    </svg>
  );
}

function SlackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M9 4a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm0 0v5m0 6v5a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6-11h5a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 0h-5m-6 0H4a2 2 0 1 1 0-4 2 2 0 0 1 0 4m11 6v5a2 2 0 1 0 4 0 2 2 0 0 0-4 0m0 0v-5m0-6V4a2 2 0 1 1 4 0 2 2 0 0 1-4 0m-6 11H4a2 2 0 1 0 0 4 2 2 0 0 0 0-4m0 0h5m6 0h5a2 2 0 1 1 0 4 2 2 0 0 1 0-4" />
    </svg>
  );
}

function IntegrationsView({ user }: { user: User }) {
  const searchParams = useSearchParams();
  const calendarStatus = searchParams.get("calendar");
  const calendarConnected = Boolean(
    (user as User & { google_calendar_connected?: boolean | null }).google_calendar_connected,
  );
  const connected: IntegrationItem[] = [
    {
      id: "github",
      name: "GitHub",
      description: "Sync pull requests and issues directly with your tasks.",
      features: ["PR merges complete tasks", "Issues sync as tasks", "Milestone tracking"],
      icon: <GithubIcon />,
      action: "connect",
    },
    {
      id: "notion",
      name: "Notion",
      description: "Import your PDS from Notion and push progress back automatically.",
      features: ["Import PDS pages", "Sync milestones", "Push progress updates"],
      icon: <NotionIcon />,
      action: "connect",
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Block time for tasks and keep your calendar in two-way sync.",
      features: ["Block time for tasks", "Two-way sync", "Deadline reminders"],
      icon: <GoogleCalendarIcon />,
      action: "connect",
    },
  ];

  const comingSoon: IntegrationItem[] = [
    {
      id: "apple-calendar",
      name: "Apple Calendar",
      description:
        "Sync tasks with Apple Calendar and keep your sessions scheduled natively.",
      features: [],
      icon: <AppleCalendarIcon />,
      action: "soon",
      muted: true,
    },
    {
      id: "slack",
      name: "Slack",
      description: "Get task reminders and streak updates in Slack.",
      features: [],
      icon: <SlackIcon />,
      action: "soon",
      muted: true,
    },
  ];

  return (
    <div className="integrations-view">
      <div className="integrations-head">
        <h2>Integrations</h2>
        <p>Connect your tools to supercharge your startup execution.</p>
      </div>

      {calendarStatus === "connected" && (
        <div className="text-xs text-emerald-400 bg-emerald-400/10 px-3 py-2 rounded-lg mb-4">
          ✓ Google Calendar connected successfully!
        </div>
      )}
      {calendarStatus === "error" && (
        <div className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg mb-4">
          ✗ Failed to connect Google Calendar. Please try again.
        </div>
      )}

      <div className="integration-list">
        {connected.map((item) => (
          <article key={item.id} className="integration-card">
            <div className="integration-icon">{item.icon}</div>
            <div className="integration-content">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="integration-features">
                {item.features.map((feature) => (
                  <span key={feature} className="integration-chip">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            {item.id === "google-calendar" ? (
              calendarConnected ? (
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Connected
                </span>
              ) : (
                <a
                  href={`/api/auth/google-calendar?userId=${user?.id}`}
                  className="integration-button"
                >
                  Connect
                </a>
              )
            ) : (
              <button type="button" className="integration-button">
                Connect
              </button>
            )}
          </article>
        ))}
      </div>

      <section className="coming-section">
        <div className="coming-title">COMING SOON</div>
        <div className="integration-list">
          {comingSoon.map((item) => (
            <article key={item.id} className="integration-card muted">
              <div className="integration-icon">{item.icon}</div>
              <div className="integration-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <span className="integration-soon">soon</span>
            </article>
          ))}
        </div>
      </section>

      <style jsx>{`
        .integrations-view {
          flex: 1;
          overflow-y: auto;
          padding: 34px 24px 32px;
        }
        .integrations-head {
          margin-bottom: 28px;
        }
        .integrations-head h2 {
          margin: 0 0 10px;
          font-size: 20px;
          line-height: 1.1;
          font-weight: 600;
          color: #f0f2f8;
          letter-spacing: -0.02em;
        }
        .integrations-head p {
          margin: 0;
          font-size: 12px;
          color: #737995;
        }
        .integration-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .integration-card {
          display: grid;
          grid-template-columns: 68px minmax(0, 1fr) auto;
          align-items: center;
          gap: 18px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(180deg, rgba(30, 30, 39, 0.96) 0%, rgba(27, 27, 36, 0.99) 100%);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02);
          padding: 24px 24px 24px 20px;
        }
        .integration-card.muted {
          opacity: 0.5;
        }
        .integration-icon {
          width: 60px;
          height: 60px;
          border-radius: 15px;
          display: grid;
          place-items: center;
          color: #d4d7e7;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
        }
        .integration-content {
          min-width: 0;
        }
        .integration-content h3 {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #f0f2f8;
        }
        .integration-content p {
          margin: 0;
          font-size: 12px;
          line-height: 1.5;
          color: #8187a2;
        }
        .integration-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 18px;
        }
        .integration-chip {
          height: 28px;
          padding: 0 12px;
          border-radius: 7px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          color: #717791;
          font-size: 11px;
          white-space: nowrap;
          font-family: var(--mono);
        }
        .integration-button,
        .integration-soon {
          min-width: 122px;
          height: 44px;
          padding: 0 18px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: -0.01em;
          flex-shrink: 0;
        }
        .integration-button {
          border: 0;
          background: var(--accent);
          color: #f5f2ff;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            0 12px 28px -20px var(--accent-muted);
          cursor: pointer;
        }
        .integration-soon {
          min-width: 84px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.02);
          color: #70758c;
          text-transform: lowercase;
        }
        .coming-section {
          margin-top: 44px;
        }
        .coming-title {
          margin-bottom: 16px;
          font-size: 11px;
          letter-spacing: 0.18em;
          color: #6a708b;
          font-family: var(--mono);
        }
        @media (max-width: 1080px) {
          .integration-card {
            grid-template-columns: 68px minmax(0, 1fr);
          }
          .integration-button,
          .integration-soon {
            grid-column: 2;
            justify-self: flex-start;
            margin-top: 4px;
          }
        }
      `}</style>
    </div>
  );
}

function BoardView({
  milestones,
  projectId,
  onMoveTask,
  onDeleteTask,
}: {
  milestones: MilestoneWithTasks[];
  projectId: string;
  onMoveTask: (taskId: string, destination: BoardColumnId) => Promise<void>;
  onDeleteTask: (task: {
    id: string;
    title: string;
    googleEventId: string | null;
  }) => void;
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
                <div className="board-card-head">
                  <h3>{item.title}</h3>
                  <button
                    type="button"
                    className="board-delete-btn"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onDeleteTask({
                        id: item.id,
                        title: item.title,
                        googleEventId: item.googleEventId,
                      });
                    }}
                    draggable={false}
                    aria-label={`Delete ${item.title}`}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 7h16M10 11v6m4-6v6M8 7l1-2h6l1 2m-9 0 1 12h8l1-12" />
                    </svg>
                  </button>
                </div>
                <div className="board-meta">
                  <span className="board-chip milestone">{item.milestoneTitle}</span>
                  {column.id !== "done" ? (
                    <span className="board-chip subtle">#{item.sequence}</span>
                  ) : null}
                  {item.difficulty ? (
                    <span className={`task-diff-badge ${item.difficulty}`}>
                      {item.difficulty}
                    </span>
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
          border-color: var(--purple-border);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.02),
            0 18px 40px rgba(0, 0, 0, 0.16),
            0 0 0 1px var(--accent-subtle);
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
          border-color: var(--purple-mid);
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
        .board-card-head {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          justify-content: space-between;
        }
        .board-card-head h3 {
          margin-bottom: 18px;
          flex: 1;
        }
        .board-delete-btn {
          width: 24px;
          height: 24px;
          border-radius: 7px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          color: #6f738a;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          transition: border-color 0.14s ease, color 0.14s ease, background 0.14s ease;
        }
        .board-delete-btn:hover {
          border-color: rgba(239, 68, 68, 0.4);
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
        .board-delete-btn :global(svg) {
          width: 12px;
          height: 12px;
          stroke: currentColor;
          stroke-width: 1.8;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .board-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: nowrap;
          min-width: 0;
          overflow: hidden;
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
          color: var(--accent);
          border: 1px solid var(--purple-border);
          background: var(--accent-subtle);
          flex: 0 1 auto;
          max-width: 68%;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          justify-content: flex-start;
          padding-left: 11px;
        }
        .board-chip.subtle {
          color: #70758c;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          flex-shrink: 0;
        }
        .board-chip.date {
          color: #54a2ff;
          border: 1px solid rgba(64, 130, 255, 0.42);
          background: rgba(64, 130, 255, 0.08);
          flex-shrink: 0;
        }
        .task-diff-badge {
          font-size: 10px;
          font-family: "Geist Mono", monospace;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 7px;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .task-diff-badge.easy {
          background: rgba(34, 197, 94, 0.12);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }
        .task-diff-badge.medium {
          background: rgba(251, 191, 36, 0.12);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.2);
        }
        .task-diff-badge.hard {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
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
  projectCount,
  workspaceName,
  allProjects,
}: DashboardClientProps) {
  const router = useRouter();
  const [milestones, setMilestones] = useState(initialMilestones);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("list");
  const [deleteCandidate, setDeleteCandidate] = useState<DeleteCandidate | null>(null);
  const [deletingTask, setDeletingTask] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const rawProject = project as Project & {
    target_completion_date?: string | null;
  };
  const [targetCompletionDate, setTargetCompletionDate] = useState(
    rawProject.target_completion_date ?? "",
  );
  const toastTimer = useRef<number | null>(null);

  useEffect(() => () => { if (toastTimer.current) window.clearTimeout(toastTimer.current); }, []);

  const syncCalendar = () => {
    fetch('/api/calendar/poll').catch(() => {})
  }

  useEffect(() => {
    syncCalendar()
    const interval = setInterval(syncCalendar, 30000)
    return () => clearInterval(interval)
  }, [])

  const activeMilestoneIndex = useMemo(() => getActiveMilestoneIndex(milestones), [milestones]);
  const activeMilestone = milestones[activeMilestoneIndex];
  const completedMilestones = milestones.slice(0, activeMilestoneIndex);
  const remainingMilestones = milestones.slice(activeMilestoneIndex + 1);

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
  const googleCalendarConnected = Boolean(
    (user as User & { google_calendar_connected?: boolean | null }).google_calendar_connected,
  );

  const showToast = (next: ToastState) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast(next);
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  };

  const handleReschedule = async () => {
    if (!targetCompletionDate) {
      setRescheduleError("Please select a target completion date.");
      return;
    }

    setIsRescheduling(true);
    setRescheduleError(null);

    try {
      const response = await fetch("/api/projects/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          newTargetDate: targetCompletionDate,
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to reschedule project");
      }

      showToast({
        title: "Project rescheduled successfully",
        body: "Due dates have been recalculated.",
      });
      router.refresh();
    } catch (error) {
      setRescheduleError(
        error instanceof Error ? error.message : "Could not reschedule project.",
      );
    } finally {
      setIsRescheduling(false);
    }
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

    try {
      const response = await fetch("/api/tasks/complete", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to persist task completion");
      }
    } catch (error) {
      setMilestones((current) =>
        current.map((milestone) => ({
          ...milestone,
          tasks: milestone.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: false } : task,
          ),
        })),
      );

      showToast({
        title: "Update failed",
        body: error instanceof Error ? error.message : "Could not save task completion.",
      });
      return;
    }

    if (defeatedName && unlockedName) {
      showToast({ title: "Boss defeated", body: `${defeatedName} cleared. ${unlockedName} unlocked.` });
    }
  };

  const handleBoardMove = async (taskId: string, destination: BoardColumnId) => {
    const shouldComplete = destination === "done";

    const previousMilestones = milestones;

    setMilestones((current) =>
      current.map((milestone) => ({
        ...milestone,
        tasks: milestone.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: shouldComplete } : task,
        ),
      })),
    );

    try {
      const response = await fetch('/api/tasks/move', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, completed: shouldComplete })
      })
      const result = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to move task")
      }
    } catch (error) {
      setMilestones(previousMilestones);
      showToast({
        title: "Update failed",
        body: error instanceof Error ? error.message : "Could not move task.",
      });
    }
  };

  const openDeleteTaskModal = (task: DeleteCandidate) => {
    setDeleteCandidate(task);
  };

  const handleDeleteTask = async () => {
    if (!deleteCandidate || deletingTask) return;

    setDeletingTask(true);
    try {
      const response = await fetch("/api/tasks/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: deleteCandidate.id }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to delete task");
      }

      setMilestones((current) =>
        current.map((milestone) => ({
          ...milestone,
          tasks: milestone.tasks.filter((task) => task.id !== deleteCandidate.id),
        })),
      );

      showToast({
        title: "Task deleted",
        body: `${deleteCandidate.title} was removed.`,
      });
      setDeleteCandidate(null);
    } catch (error) {
      showToast({
        title: "Delete failed",
        body: error instanceof Error ? error.message : "Could not delete task.",
      });
    } finally {
      setDeletingTask(false);
    }
  };

  return (
    <>
      <WorkspaceShell
        workspaceName={workspaceName}
        projectName={project.name ?? ""}
        currentPage="Dashboard"
        currentSection="/dashboard"
        initials={getInitials(user.name ?? "Builder")}
        avatarUrl={user.avatar_url ?? null}
        userName={user.name ?? "Builder"}
        nextUpTask={nextUp?.task.title ?? null}
        nextUpContext={nextUp?.context ?? null}
        incompleteTaskCount={getIncompleteTaskCount(milestones)}
        rank={rank}
        milestones={sidebarMilestones}
        streak={user.streak}
        projectCount={projectCount}
        allProjects={allProjects}
        activeProjectId={project.id}
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

              <section className="reschedule-section">
                <div className="reschedule-label">Target Completion Date</div>
                <div className="reschedule-controls">
                  <input
                    type="date"
                    className="reschedule-input"
                    value={targetCompletionDate}
                    onChange={(event) => setTargetCompletionDate(event.target.value)}
                  />
                  <button
                    type="button"
                    className="reschedule-btn"
                    onClick={handleReschedule}
                    disabled={isRescheduling}
                  >
                    {isRescheduling ? "Rescheduling..." : "Reschedule"}
                  </button>
                </div>
                {rescheduleError ? (
                  <p className="reschedule-error">{rescheduleError}</p>
                ) : null}
              </section>

              <div className="section-head">
                <span>Active milestone</span>
                <span>{Math.min(activeMilestoneIndex + 1, milestones.length)} of {milestones.length} unlocked</span>
              </div>

              {completedMilestones.map((m) => (
                <CompletedMilestone key={m.id} milestone={m} />
              ))}

              {activeMilestone && (
                activeMilestone.is_boss ? (
                  <BossMilestone
                    milestone={activeMilestone}
                    progress={100 - getBossHp(activeMilestone)}
                    onTaskComplete={handleTaskComplete}
                    onTaskDelete={(milestoneId, taskId) => {
                      const milestone = milestones.find((item) => item.id === milestoneId);
                      const task = milestone?.tasks.find((item) => item.id === taskId);
                      if (!task) return;
                      openDeleteTaskModal({
                        id: task.id,
                        title: task.title,
                        googleEventId:
                          (task as Task & { google_event_id?: string | null }).google_event_id ??
                          null,
                      });
                    }}
                    getTaskBadge={() => null}
                  />
                ) : (
                  <ActiveMilestone
                    milestone={activeMilestone}
                    progress={getMilestoneProgress(activeMilestone)}
                    onTaskComplete={handleTaskComplete}
                    onTaskDelete={(milestoneId, taskId) => {
                      const milestone = milestones.find((item) => item.id === milestoneId);
                      const task = milestone?.tasks.find((item) => item.id === taskId);
                      if (!task) return;
                      openDeleteTaskModal({
                        id: task.id,
                        title: task.title,
                        googleEventId:
                          (task as Task & { google_event_id?: string | null }).google_event_id ??
                          null,
                      });
                    }}
                  />
                )
              )}

              {remainingMilestones.map((m) => (
                <LockedMilestone key={m.id} title={m.title} />
              ))}
            </div>
          ) : activeTab === "board" ? (
            <BoardView
              milestones={milestones}
              projectId={project.id}
              onMoveTask={handleBoardMove}
              onDeleteTask={openDeleteTaskModal}
            />
          ) : activeTab === "calendar" ? (
            <CalendarView
              milestones={milestones}
              workspaceName={workspaceName}
              onTaskComplete={handleTaskComplete}
            />
          ) : activeTab === "integrations" ? (
            <Suspense fallback={null}>
              <IntegrationsView user={user} />
            </Suspense>
          ) : (
            <ComingSoon label={TABS.find((t) => t.id === activeTab)?.label ?? ""} />
          )}
        </main>

        <div className={`toast ${toast ? "show" : ""}`}>
          <div className="toast-title">{toast?.title}</div>
          <div className="toast-body">{toast?.body}</div>
        </div>

        {deleteCandidate ? (
          <div className="delete-modal-wrap" role="presentation">
            <div
              className="delete-modal-backdrop"
              onClick={() => !deletingTask && setDeleteCandidate(null)}
            />
            <div className="delete-modal" role="dialog" aria-modal="true">
              <h3>Delete task</h3>
              <p>
                Are you sure you want to delete "{deleteCandidate.title}"? This cannot be undone.
              </p>
              {googleCalendarConnected && deleteCandidate.googleEventId ? (
                <p className="delete-warning">
                  ⚠️ This task is also synced with Google Calendar — deleting it here will remove the calendar event too.
                </p>
              ) : null}
              <div className="delete-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setDeleteCandidate(null)}
                  disabled={deletingTask}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={handleDeleteTask}
                  disabled={deletingTask}
                >
                  {deletingTask ? "Deleting..." : "Delete Task"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
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
          border-left: 3px solid var(--accent);
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
          color: var(--accent);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-family: var(--mono);
        }
        .toast-body {
          font-size: 11px;
          line-height: 1.5;
          color: #9898b8;
        }
        .reschedule-section {
          margin: 14px 0 18px;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #252538;
          background: #13131e;
        }
        .reschedule-label {
          margin-bottom: 10px;
          font-size: 11px;
          color: #8f93ad;
          font-family: var(--mono);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .reschedule-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .reschedule-input {
          height: 36px;
          min-width: 220px;
          border-radius: 8px;
          border: 1px solid #2b2b40;
          background: #0f0f17;
          color: #d2d4e2;
          padding: 0 10px;
          font-size: 12px;
        }
        .reschedule-btn {
          height: 36px;
          padding: 0 14px;
          border-radius: 8px;
          border: 1px solid var(--accent-muted);
          background: var(--accent-subtle);
          color: var(--accent-text);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .reschedule-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .reschedule-error {
          margin: 8px 0 0;
          font-size: 11px;
          color: #f48f8f;
        }
        .delete-modal-wrap {
          position: fixed;
          inset: 0;
          z-index: 120;
          display: grid;
          place-items: center;
        }
        .delete-modal-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.48);
        }
        .delete-modal {
          position: relative;
          width: min(480px, calc(100vw - 32px));
          border-radius: 14px;
          border: 1px solid #252538;
          background: #13131e;
          padding: 20px;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.45);
        }
        .delete-modal h3 {
          margin: 0 0 10px;
          font-size: 16px;
          color: #f0f0f8;
        }
        .delete-modal p {
          margin: 0 0 12px;
          color: #9a9eb8;
          font-size: 13px;
          line-height: 1.5;
        }
        .delete-warning {
          color: #f7bf63 !important;
          font-family: var(--mono);
          font-size: 11px !important;
          margin-bottom: 16px !important;
        }
        .delete-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .cancel-btn,
        .delete-btn {
          height: 34px;
          padding: 0 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .cancel-btn {
          border: 1px solid #2c2c40;
          background: transparent;
          color: #9a9eb8;
        }
        .delete-btn {
          border: 1px solid rgba(239, 68, 68, 0.4);
          background: rgba(239, 68, 68, 0.16);
          color: #ff8f8f;
        }
        .cancel-btn:disabled,
        .delete-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
