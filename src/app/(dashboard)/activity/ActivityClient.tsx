"use client"

import { useMemo, useState } from "react"
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell"
import type { Milestone, Project, Task, User } from "@/types"

type MilestoneWithTasks = Milestone & { tasks: Task[] }

type ActivityClientProps = {
  user: User
  project: Project
  milestones: MilestoneWithTasks[]
  rank: number | null
  projectCount: number
  dayCounts: number[]
  dayLabels: string[]
  totalTasksThisMonth: number
  activeDays: number
  streak: number
}

function getInitials(name: string | null | undefined) {
  if (!name) return "AS"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "AS"
}

function getMilestoneProgress(milestone: MilestoneWithTasks) {
  if (milestone.tasks.length === 0) return 0
  return Math.round((milestone.tasks.filter((task) => task.completed).length / milestone.tasks.length) * 100)
}

function getBossHp(milestone: MilestoneWithTasks) {
  if (milestone.tasks.length === 0) return 100
  return Math.round((milestone.tasks.filter((task) => !task.completed).length / milestone.tasks.length) * 100)
}

function getActiveMilestoneIndex(milestones: MilestoneWithTasks[]) {
  const index = milestones.findIndex(
    (milestone) =>
      milestone.tasks.length === 0 || milestone.tasks.some((task) => !task.completed),
  )

  return index === -1 ? 0 : index
}

function getSidebarMilestones(milestones: MilestoneWithTasks[]) {
  const activeMilestoneIndex = getActiveMilestoneIndex(milestones)

  return milestones.map((milestone, index) => ({
    id: milestone.id,
    title: milestone.title,
    progress: milestone.is_boss
      ? 100 - getBossHp(milestone)
      : getMilestoneProgress(milestone),
    state:
      index < activeMilestoneIndex
        ? ("done" as const)
        : index === activeMilestoneIndex
          ? ("active" as const)
          : ("locked" as const),
  }))
}

function getNextUpTask(milestones: MilestoneWithTasks[]) {
  const activeMilestone = milestones[getActiveMilestoneIndex(milestones)]
  if (!activeMilestone) return null

  const task = activeMilestone.tasks.find((item) => !item.completed)
  if (!task) return null

  const taskIndex = activeMilestone.tasks.findIndex((item) => item.id === task.id)

  return {
    task,
    context: `${activeMilestone.title} · task ${taskIndex + 1} of ${activeMilestone.tasks.length}`,
  }
}

function getIncompleteTaskCount(milestones: MilestoneWithTasks[]) {
  return milestones.reduce(
    (count, milestone) => count + milestone.tasks.filter((task) => !task.completed).length,
    0,
  )
}

export function ActivityClient({
  user,
  project,
  milestones,
  rank,
  projectCount,
  dayCounts,
  dayLabels,
  totalTasksThisMonth,
  activeDays,
  streak,
}: ActivityClientProps) {
  const [chartType, setChartType] = useState<"bar" | "line">("bar")
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const maxCount = useMemo(() => Math.max(...dayCounts, 1), [dayCounts])
  const todayIndex = useMemo(() => {
    const d = new Date().getDay()
    return d === 0 ? 6 : d - 1
  }, [])
  const tasksThisWeek = useMemo(() => dayCounts.reduce((a, b) => a + b, 0), [dayCounts])
  const peakDayIndex = useMemo(() => dayCounts.indexOf(Math.max(...dayCounts)), [dayCounts])
  const longestConsecutiveRun = useMemo(() => {
    let best = 0
    let current = 0

    for (const count of dayCounts) {
      if (count > 0) {
        current += 1
        best = Math.max(best, current)
      } else {
        current = 0
      }
    }

    return best
  }, [dayCounts])

  const nextUp = getNextUpTask(milestones)

  const points = useMemo(
    () =>
      dayCounts.map((count, i) => {
        const x = 40 + (i / 6) * 660
        const y = 140 - ((count / maxCount) * 130)
        return { x, y, count, label: dayLabels[i] }
      }),
    [dayCounts, dayLabels, maxCount],
  )

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ")

  return (
    <WorkspaceShell
      workspaceName={project.name}
      currentPage="Activity"
      currentSection="/activity"
      initials={getInitials(user.name)}
      userName={user.name}
      nextUpTask={nextUp?.task.title ?? null}
      nextUpContext={nextUp?.context ?? null}
      incompleteTaskCount={getIncompleteTaskCount(milestones)}
      rank={rank}
      milestones={getSidebarMilestones(milestones)}
      streak={user.streak}
      projectCount={projectCount}
    >
      <main style={{ flex: 1, minWidth: 0, background: "#0f0f17", overflow: "auto" }}>
        <div style={{ padding: 24 }} data-total-tasks-month={totalTasksThisMonth}>
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ margin: "0 0 6px", fontSize: 28, lineHeight: 1 }}>
              Activity
            </h1>
            <p style={{ margin: 0, color: "#9898b8", fontSize: 14 }}>
              Track your daily shipping momentum.
            </p>
          </div>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <div style={{ border: "1px solid #1e1e2e", borderRadius: 12, background: "#13131e", padding: 14 }}>
              <div style={{ fontSize: 11, color: "#5f5f7a", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Tasks this week
              </div>
              <div style={{ marginTop: 8, fontSize: 24, fontWeight: 700, color: "var(--accent)" }}>
                {tasksThisWeek}
              </div>
            </div>
            <div style={{ border: "1px solid #1e1e2e", borderRadius: 12, background: "#13131e", padding: 14 }}>
              <div style={{ fontSize: 11, color: "#5f5f7a", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Active days (30d)
              </div>
              <div style={{ marginTop: 8, fontSize: 24, fontWeight: 700, color: "#f0f0f8" }}>
                {activeDays}
              </div>
            </div>
            <div style={{ border: "1px solid #1e1e2e", borderRadius: 12, background: "#13131e", padding: 14 }}>
              <div style={{ fontSize: 11, color: "#5f5f7a", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Current streak
              </div>
              <div style={{ marginTop: 8, fontSize: 24, fontWeight: 700, color: "#e2a72a" }}>
                {streak} days
              </div>
            </div>
          </section>

          <section style={{ border: "1px solid #1e1e2e", borderRadius: 16, background: "#13131e", padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#5f5f7a" }}>
                YOUR ACTIVITY — THIS WEEK
              </div>
              <div style={{ display: "inline-flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setChartType("bar")}
                  style={{
                    height: 28,
                    padding: "0 12px",
                    borderRadius: 8,
                    background: chartType === "bar" ? "var(--accent-subtle)" : "transparent",
                    color: chartType === "bar" ? "var(--accent-text)" : "#5f5f7a",
                    border: chartType === "bar" ? "1px solid var(--purple-border)" : "1px solid #1e1e2e",
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  Bar
                </button>
                <button
                  type="button"
                  onClick={() => setChartType("line")}
                  style={{
                    height: 28,
                    padding: "0 12px",
                    borderRadius: 8,
                    background: chartType === "line" ? "var(--accent-subtle)" : "transparent",
                    color: chartType === "line" ? "var(--accent-text)" : "#5f5f7a",
                    border: chartType === "line" ? "1px solid var(--purple-border)" : "1px solid #1e1e2e",
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  Line
                </button>
              </div>
            </div>

            {chartType === "bar" ? (
              <>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160 }}>
                  <div
                    style={{
                      width: 32,
                      minWidth: 32,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      textAlign: "right",
                      fontSize: 10,
                      fontFamily: "var(--mono)",
                      color: "#5f5f7a",
                      paddingRight: 4,
                    }}
                  >
                    <span>{maxCount}</span>
                    <span>{Math.round(maxCount / 2)}</span>
                    <span>0</span>
                  </div>

                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 8, height: "100%" }}>
                    {dayCounts.map((count, i) => (
                      <div
                        key={i}
                        style={{ flex: 1, height: "100%", position: "relative", display: "flex", alignItems: "flex-end" }}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {hoveredIndex === i ? (
                          <div
                            style={{
                              position: "absolute",
                              bottom: "calc(100% + 8px)",
                              left: "50%",
                              transform: "translateX(-50%)",
                              fontSize: 10,
                              fontFamily: "var(--mono)",
                              color: "#d7d9e9",
                              background: "#181824",
                              border: "1px solid #2a2a3d",
                              borderRadius: 6,
                              padding: "4px 6px",
                              whiteSpace: "nowrap",
                              pointerEvents: "none",
                              zIndex: 1,
                            }}
                          >
                            {count} tasks
                          </div>
                        ) : null}
                        <div
                          style={{
                            width: "100%",
                            height: `${Math.max(6, Math.round((count / maxCount) * 100))}%`,
                            borderRadius: "6px 6px 0 0",
                            background: i === todayIndex
                              ? "var(--accent)"
                              : count > 0
                                ? "rgba(124,110,247,0.4)"
                                : "rgba(255,255,255,0.05)",
                            transition: "height 0.3s ease",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 8, marginLeft: 32 }}>
                  {dayLabels.map((label, i) => (
                    <div
                      key={label}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontSize: 10,
                        fontFamily: "var(--mono)",
                        color: i === todayIndex ? "var(--accent)" : "#5f5f7a",
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ height: 160 }}>
                <svg width="100%" height="160" viewBox="0 0 700 160" preserveAspectRatio="none">
                  <text x="34" y="10" textAnchor="end" fontSize="10" fill="#5f5f7a">
                    {maxCount}
                  </text>
                  <text x="34" y="75" textAnchor="end" fontSize="10" fill="#5f5f7a">
                    {Math.round(maxCount / 2)}
                  </text>
                  <text x="34" y="140" textAnchor="end" fontSize="10" fill="#5f5f7a">
                    0
                  </text>
                  <polyline
                    points={polylinePoints}
                    stroke="var(--accent)"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.8"
                  />
                  {points.map((point, i) => (
                    <circle
                      key={`point-${i}`}
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      fill={
                        i === todayIndex
                          ? "var(--accent)"
                          : point.count > 0
                            ? "rgba(124,110,247,0.7)"
                            : "rgba(255,255,255,0.1)"
                      }
                      stroke="#0f0f17"
                      strokeWidth="2"
                    />
                  ))}
                  {points.map((point, i) => (
                    <text
                      key={`label-${i}`}
                      x={point.x}
                      y="158"
                      textAnchor="middle"
                      fontSize="10"
                      fill={i === todayIndex ? "var(--accent)" : "#5f5f7a"}
                    >
                      {point.label}
                    </text>
                  ))}
                </svg>
              </div>
            )}
          </section>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
              fontSize: 12,
              color: "#5f5f7a",
              fontFamily: "var(--mono)",
            }}
          >
            <span>
              Peak day: {dayLabels[peakDayIndex]} · {Math.max(...dayCounts)} tasks
            </span>
            <span>·</span>
            <span>Best streak this week: {longestConsecutiveRun} days</span>
          </div>
        </div>
      </main>
    </WorkspaceShell>
  )
}
