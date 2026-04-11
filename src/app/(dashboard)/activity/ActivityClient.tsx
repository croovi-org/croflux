"use client"

import { useMemo, useState, type CSSProperties } from "react"
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell"
import type { Milestone, Project, Task, User } from "@/types"

type MilestoneWithTasks = Milestone & { tasks: Task[] }

type ActivityClientProps = {
  user: User
  project: Project
  milestones: MilestoneWithTasks[]
  rank: number | null
  projectCount: number
  allTimestamps: string[]
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

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDayKey(date: Date) {
  return date.toISOString().split("T")[0]
}

export function ActivityClient({
  user,
  project,
  milestones,
  rank,
  projectCount,
  allTimestamps,
  totalTasksThisMonth,
  activeDays,
  streak,
}: ActivityClientProps) {
  const [chartType, setChartType] = useState<"bar" | "line">("bar")
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoveredCalendarKey, setHoveredCalendarKey] = useState<string | null>(null)

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const defaultStart = useMemo(() => {
    const d = new Date(today)
    d.setDate(today.getDate() - 6)
    return d
  }, [today])

  const minSelectableDate = useMemo(() => {
    const d = new Date(today)
    d.setDate(today.getDate() - 89)
    d.setHours(0, 0, 0, 0)
    return d
  }, [today])

  const [rangeStart, setRangeStart] = useState<Date>(defaultStart)
  const [rangeEnd, setRangeEnd] = useState<Date>(today)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
    const d = new Date(today)
    d.setDate(1)
    return d
  })
  const [firstClick, setFirstClick] = useState<Date | null>(null)

  const { dayCounts, dayLabels } = useMemo(() => {
    const start = new Date(rangeStart)
    start.setHours(0, 0, 0, 0)
    const end = new Date(rangeEnd)
    end.setHours(23, 59, 59, 999)

    const diffDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1
    const labels: string[] = []
    const counts: number[] = []

    for (let i = 0; i < diffDays; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      labels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }))
      counts.push(0)
    }

    for (const ts of allTimestamps) {
      const d = new Date(ts)
      if (d >= start && d <= end) {
        const dayIndex = Math.floor((d.getTime() - start.getTime()) / 86400000)
        if (dayIndex >= 0 && dayIndex < counts.length) {
          counts[dayIndex] = (counts[dayIndex] ?? 0) + 1
        }
      }
    }

    return { dayCounts: counts, dayLabels: labels }
  }, [allTimestamps, rangeStart, rangeEnd])

  const maxCount = useMemo(() => Math.max(...dayCounts, 1), [dayCounts])
  const todayIndex = useMemo(() => {
    const todayStr = today.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    return dayLabels.indexOf(todayStr)
  }, [dayLabels, today])

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

  const rangeLabelStr = rangeStart.toDateString() === rangeEnd.toDateString()
    ? rangeStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : `${rangeStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${rangeEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`

  const nextUp = getNextUpTask(milestones)

  const points = useMemo(
    () =>
      dayCounts.map((count, i) => {
        const x = 50 + (i / Math.max(dayCounts.length - 1, 1)) * 600
        const y = 240 - ((count / maxCount) * 220)
        return { x, y, count, label: dayLabels[i] }
      }),
    [dayCounts, dayLabels, maxCount],
  )

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ")

  const calendarDays = useMemo(() => {
    const firstOfMonth = new Date(calendarMonth)
    firstOfMonth.setDate(1)
    firstOfMonth.setHours(0, 0, 0, 0)

    const firstWeekday = firstOfMonth.getDay()
    const daysInMonth = new Date(
      firstOfMonth.getFullYear(),
      firstOfMonth.getMonth() + 1,
      0,
    ).getDate()

    const cells: Array<Date | null> = []
    for (let i = 0; i < firstWeekday; i += 1) cells.push(null)
    for (let day = 1; day <= daysInMonth; day += 1) {
      const d = new Date(firstOfMonth)
      d.setDate(day)
      cells.push(d)
    }
    while (cells.length % 7 !== 0) cells.push(null)

    return cells
  }, [calendarMonth])

  const canGoNextMonth = useMemo(() => {
    const currentMonthStart = new Date(today)
    currentMonthStart.setDate(1)
    currentMonthStart.setHours(0, 0, 0, 0)
    return calendarMonth < currentMonthStart
  }, [calendarMonth, today])

  const denseBars = dayCounts.length > 14
  const hideBarLabels = dayCounts.length > 30

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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#5f5f7a" }}>
                {rangeLabelStr}
              </div>
              <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap" }}>
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
                <button
                  type="button"
                  onClick={() => setCalendarOpen((o) => !o)}
                  style={{
                    height: 28,
                    padding: "0 12px",
                    borderRadius: 8,
                    background: calendarOpen ? "var(--accent-subtle)" : "transparent",
                    color: calendarOpen ? "var(--accent-text)" : "#5f5f7a",
                    border: calendarOpen ? "1px solid var(--purple-border)" : "1px solid #1e1e2e",
                    fontSize: 11,
                    cursor: "pointer",
                    fontFamily: "var(--mono)",
                  }}
                >
                  {rangeLabelStr}
                </button>
              </div>
            </div>

            {calendarOpen ? (
              <div
                style={{
                  background: "#13131e",
                  border: "1px solid #1e1e2e",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = new Date(calendarMonth)
                      prev.setMonth(prev.getMonth() - 1)
                      setCalendarMonth(prev)
                    }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      border: "1px solid #1e1e2e",
                      background: "transparent",
                      color: "#9898b8",
                      cursor: "pointer",
                    }}
                  >
                    {"<"}
                  </button>
                  <div style={{ fontSize: 12, color: "#e0e0f8", fontFamily: "var(--mono)" }}>
                    {calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!canGoNextMonth) return
                      const next = new Date(calendarMonth)
                      next.setMonth(next.getMonth() + 1)
                      setCalendarMonth(next)
                    }}
                    disabled={!canGoNextMonth}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      border: "1px solid #1e1e2e",
                      background: "transparent",
                      color: canGoNextMonth ? "#9898b8" : "#5f5f7a",
                      cursor: canGoNextMonth ? "pointer" : "not-allowed",
                      opacity: canGoNextMonth ? 1 : 0.5,
                    }}
                  >
                    {">"}
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 36px)", gap: 6, marginBottom: 8 }}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div
                      key={day}
                      style={{
                        width: 36,
                        height: 20,
                        fontSize: 10,
                        color: "#5f5f7a",
                        fontFamily: "var(--mono)",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      {day}
                    </div>
                  ))}

                  {calendarDays.map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} style={{ width: 36, height: 36 }} />
                    }

                    const day = startOfDay(date)
                    const dayKey = formatDayKey(day)
                    const isFuture = day > today
                    const isBeforeWindow = day < minSelectableDate
                    const isDisabled = isFuture || isBeforeWindow
                    const startDay = startOfDay(rangeStart)
                    const endDay = startOfDay(rangeEnd)
                    const isInRange = day >= startDay && day <= endDay
                    const isStart = formatDayKey(startDay) === dayKey
                    const isEnd = formatDayKey(endDay) === dayKey
                    const isToday = formatDayKey(today) === dayKey
                    const isHovered = hoveredCalendarKey === dayKey

                    const baseStyle: CSSProperties = {
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      fontSize: 12,
                      display: "grid",
                      placeItems: "center",
                      border: isToday ? "1px solid var(--purple-border)" : "1px solid transparent",
                      background: "transparent",
                      color: "#9898b8",
                      cursor: "pointer",
                      userSelect: "none",
                      opacity: 1,
                    }

                    if (isDisabled) {
                      baseStyle.opacity = isFuture ? 0.25 : 0.15
                      baseStyle.cursor = "not-allowed"
                    } else if (isStart || isEnd) {
                      baseStyle.background = "var(--accent)"
                      baseStyle.color = "white"
                    } else if (isInRange) {
                      baseStyle.background = "rgba(124,110,247,0.2)"
                      baseStyle.color = "#e0e0f8"
                    } else if (isHovered) {
                      baseStyle.background = "rgba(255,255,255,0.05)"
                    }

                    return (
                      <div
                        key={dayKey}
                        style={baseStyle}
                        onMouseEnter={() => setHoveredCalendarKey(dayKey)}
                        onMouseLeave={() => setHoveredCalendarKey(null)}
                        onClick={() => {
                          if (isDisabled) return
                          if (!firstClick) {
                            setFirstClick(day)
                            return
                          }

                          const first = startOfDay(firstClick)
                          const second = day
                          if (first <= second) {
                            setRangeStart(first)
                            setRangeEnd(second)
                          } else {
                            setRangeStart(second)
                            setRangeEnd(first)
                          }
                          setFirstClick(null)
                          setCalendarOpen(false)
                        }}
                        onDoubleClick={() => {
                          if (isDisabled) return
                          setRangeStart(day)
                          setRangeEnd(day)
                          setFirstClick(null)
                          setCalendarOpen(false)
                        }}
                      >
                        {day.getDate()}
                      </div>
                    )
                  })}
                </div>

                <div style={{ fontSize: 10, color: "#5f5f7a", fontFamily: "var(--mono)" }}>
                  Click two dates to select a range · Double-click for a single day
                </div>
              </div>
            ) : null}

            {chartType === "bar" ? (
              <>
                <div style={{ display: "flex", alignItems: "flex-end", gap: denseBars ? 4 : 8, height: 280 }}>
                  <div
                    style={{
                      width: 32,
                      minWidth: 32,
                      height: 280,
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

                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: denseBars ? 4 : 8, height: "100%" }}>
                    {dayCounts.map((count, i) => (
                      <div
                        key={i}
                        style={{ flex: 1, height: "100%", position: "relative", display: "flex", alignItems: "flex-end" }}
                        onMouseEnter={() => !denseBars && setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {!denseBars && hoveredIndex === i ? (
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

                {!hideBarLabels ? (
                  <div style={{ display: "flex", gap: denseBars ? 4 : 8, marginTop: 8, marginLeft: 32 }}>
                    {dayLabels.map((label, i) => (
                      <div
                        key={`${label}-${i}`}
                        style={{
                          flex: 1,
                          textAlign: "center",
                          fontSize: 10,
                          fontFamily: "var(--mono)",
                          color: i === todayIndex ? "var(--accent)" : "#5f5f7a",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <div style={{ height: 280 }}>
                <svg width="100%" height="280" viewBox="0 0 700 280" preserveAspectRatio="none">
                  <line x1="40" y1="24" x2="700" y2="24" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  <line x1="40" y1="132" x2="700" y2="132" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  <line x1="40" y1="244" x2="700" y2="244" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  <text x="34" y="24" textAnchor="end" fontSize="10" fill="#5f5f7a">
                    {maxCount}
                  </text>
                  <text x="34" y="132" textAnchor="end" fontSize="10" fill="#5f5f7a">
                    {Math.round(maxCount / 2)}
                  </text>
                  <text x="34" y="244" textAnchor="end" fontSize="10" fill="#5f5f7a">
                    0
                  </text>
                  <polyline
                    points={polylinePoints}
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.8"
                  />
                  {points.map((point, i) => (
                    <circle
                      key={`point-${i}`}
                      cx={point.x}
                      cy={point.y}
                      r={3.5}
                      fill="rgba(124, 110, 247, 0.75)"
                      stroke="#0f0f17"
                      strokeWidth={2}
                    />
                  ))}
                  {points.map((point, i) => {
                    const shouldShowLabel = dayCounts.length > 30
                      ? i % 7 === 0
                      : dayCounts.length > 14
                        ? i % 3 === 0
                        : true
                    if (!shouldShowLabel) return null

                    return (
                      <text
                        key={`label-${i}`}
                        x={point.x}
                        y="268"
                        textAnchor="middle"
                        fontSize="10"
                        fill={i === todayIndex ? "var(--accent)" : "#5f5f7a"}
                      >
                        {point.label}
                      </text>
                    )
                  })}
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
              Peak day: {dayLabels[peakDayIndex] ?? "—"} · {Math.max(...dayCounts, 0)} tasks
            </span>
            <span>·</span>
            <span>Best streak this week: {longestConsecutiveRun} days</span>
          </div>
        </div>
      </main>
    </WorkspaceShell>
  )
}
