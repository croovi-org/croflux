"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Milestone, Task } from "@/types";
import styles from "./CalendarView.module.css";

type MilestoneWithTasks = Milestone & { tasks: Task[] };

type CalendarDayItem = {
  task: Task & { due_date?: string | null; difficulty?: "easy" | "medium" | "hard" };
  milestoneTitle: string;
  milestoneId: string;
};

type CalendarCell = {
  key: string;
  dayNumber: number | null;
  isCurrentMonth: boolean;
  isToday: boolean;
};

type CalendarViewProps = {
  milestones: MilestoneWithTasks[];
  workspaceName: string;
  onTaskComplete: (milestoneId: string, taskId: string) => Promise<void>;
};

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getCalendarCells(monthDate: Date) {
  const firstDay = startOfMonth(monthDate);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0,
  ).getDate();
  const cells: CalendarCell[] = [];
  const today = new Date();

  for (let index = 0; index < 35; index += 1) {
    const dayNumber = index - firstWeekday + 1;
    const isCurrentMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
    const cellDate = isCurrentMonth
      ? new Date(monthDate.getFullYear(), monthDate.getMonth(), dayNumber)
      : null;

    cells.push({
      key: `${monthDate.getFullYear()}-${monthDate.getMonth()}-${index}`,
      dayNumber: isCurrentMonth ? dayNumber : null,
      isCurrentMonth,
      isToday: Boolean(
        cellDate
          && cellDate.getDate() === today.getDate()
          && cellDate.getMonth() === today.getMonth()
          && cellDate.getFullYear() === today.getFullYear(),
      ),
    });
  }

  return cells;
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function formatDueDate(value: string | null | undefined) {
  if (!value) return "No due date";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDiffClass(diff: "easy" | "medium" | "hard") {
  if (diff === "easy") return styles.csbDiffEasy;
  if (diff === "hard") return styles.csbDiffHard;
  return styles.csbDiffMedium;
}

export function CalendarView({ milestones, workspaceName, onTaskComplete }: CalendarViewProps) {
  const minMonth = new Date(2025, 0, 1);
  const maxYear = new Date().getFullYear() + 8;
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerDay, setPickerDay] = useState(() => new Date().getDate());
  const [pickerMonth, setPickerMonth] = useState(() => new Date().getMonth());
  const [pickerYear, setPickerYear] = useState(() => new Date().getFullYear());
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const monthLabel = visibleMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const cells = useMemo(() => getCalendarCells(visibleMonth), [visibleMonth]);
  const canGoPrev = visibleMonth > minMonth;
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const pickerDaysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
  const safePickerDay = Math.min(pickerDay, pickerDaysInMonth);
  const yearOptions = Array.from(
    { length: maxYear - 2025 + 1 },
    (_, index) => 2025 + index,
  );

  const [sidebarDate, setSidebarDate] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, CalendarDayItem[]>();
    milestones.forEach((milestone) => {
      milestone.tasks.forEach((task) => {
        const due = (task as Task & { due_date?: string | null }).due_date;
        if (!due) return;
        const key = due.slice(0, 10);
        if (!map.has(key)) map.set(key, []);
        map.get(key)?.push({
          task: task as CalendarDayItem["task"],
          milestoneTitle: milestone.title,
          milestoneId: milestone.id,
        });
      });
    });
    return map;
  }, [milestones]);

  const sidebarItems: CalendarDayItem[] = sidebarDate ? (tasksByDate.get(sidebarDate) ?? []) : [];
  const sidebarLabel = sidebarDate
    ? new Date(sidebarDate + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!pickerOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setPickerOpen(false);
      }
    };
    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [pickerOpen]);

  useEffect(() => {
    if (!sidebarDate) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarDate(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarDate]);

  const portalUI = mounted && sidebarDate
    ? createPortal(
      <>
        <div className={styles.csbBackdrop} onClick={() => setSidebarDate(null)} />
        <aside className={styles.calSidebar}>
          <div className={styles.csbHeader}>
            <div>
              <span className={styles.csbLabel}>TASKS FOR</span>
              <h3 className={styles.csbDate}>{sidebarLabel}</h3>
            </div>
            <button
              type="button"
              className={styles.csbClose}
              aria-label="Close"
              onClick={() => setSidebarDate(null)}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className={styles.csbScroll}>
            {sidebarItems.length === 0 ? (
              <div className={styles.csbEmpty}>No tasks on this date</div>
            ) : (
              sidebarItems.map(({ task, milestoneTitle, milestoneId }) => (
                <article
                  key={task.id}
                  className={`${styles.csbCard} ${task.completed ? styles.csbCardDone : ""}`.trim()}
                >
                  <div className={styles.csbCardTop}>
                    <span className={`${styles.csbTaskTitle} ${task.completed ? styles.csbTaskTitleDone : ""}`.trim()}>{task.title}</span>
                    {task.difficulty && (
                      <span className={`${styles.csbDiff} ${getDiffClass(task.difficulty)}`}>{task.difficulty}</span>
                    )}
                  </div>

                  <div className={styles.csbMeta}>
                    <span className={styles.csbMetaRow}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
                      <span>{milestoneTitle}</span>
                    </span>
                    <span className={styles.csbMetaRow}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>
                      <span>{workspaceName}</span>
                    </span>
                    <span className={styles.csbMetaRow}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h18" /><path d="M8 3v4" /><path d="M16 3v4" /><rect x="3" y="5" width="18" height="16" rx="2" /></svg>
                      <span>{formatDueDate(task.due_date)}</span>
                    </span>
                  </div>

                  {!task.completed ? (
                    <div className={styles.csbActions}>
                      <button
                        type="button"
                        className={`${styles.csbBtn} ${styles.csbBtnComplete}`}
                        onClick={async () => {
                          await onTaskComplete(milestoneId, task.id);
                          setSidebarDate(null);
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                        Mark complete
                      </button>
                    </div>
                  ) : (
                    <div className={styles.csbDoneBadge}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                      Completed
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </aside>
      </>,
      document.body,
    )
    : null;

  return (
    <>
      <div className={styles.calendarOuter}>
        <div className={styles.calendarView}>
          <div className={styles.calendarToolbar}>
            <div className={styles.calendarNav}>
              <button
                type="button"
                className={styles.calendarNavBtn}
                onClick={() => canGoPrev && setVisibleMonth((current) => addMonths(current, -1))}
                disabled={!canGoPrev}
                aria-label="Previous month"
              >
                <ChevronLeft />
              </button>
              <div className={styles.calendarPickerWrap} ref={pickerRef}>
                <button
                  type="button"
                  className={styles.calendarTitleBtn}
                  onClick={() => setPickerOpen((current) => !current)}
                >
                  <h2 className={styles.calendarNavTitle}>{monthLabel}</h2>
                </button>

                {pickerOpen ? (
                  <div className={styles.calendarPicker}>
                    <div className={styles.calendarPickerRow}>
                      <label className={styles.calendarPickerLabel}>
                        <span className={styles.calendarPickerLabelText}>Day</span>
                        <select
                          className={styles.calendarPickerSelect}
                          value={safePickerDay}
                          onChange={(event) => setPickerDay(Number(event.target.value))}
                        >
                          {Array.from({ length: pickerDaysInMonth }, (_, index) => index + 1).map((day) => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </label>
                      <label className={styles.calendarPickerLabel}>
                        <span className={styles.calendarPickerLabelText}>Month</span>
                        <select
                          className={styles.calendarPickerSelect}
                          value={pickerMonth}
                          onChange={(event) => setPickerMonth(Number(event.target.value))}
                        >
                          {monthNames.map((name, index) => (
                            <option key={name} value={index}>{name}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className={`${styles.calendarPickerLabel} ${styles.calendarYearField}`}>
                      <span className={styles.calendarPickerLabelText}>Year</span>
                      <select
                        className={styles.calendarPickerSelect}
                        value={pickerYear}
                        onChange={(event) => setPickerYear(Number(event.target.value))}
                      >
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      className={styles.calendarPickerApply}
                      onClick={() => {
                        const nextDate = new Date(pickerYear, pickerMonth, safePickerDay);
                        setSelectedDate(nextDate);
                        setVisibleMonth(startOfMonth(nextDate));
                        setPickerOpen(false);
                      }}
                    >
                      Go to date
                    </button>
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                className={styles.calendarNavBtn}
                onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
                aria-label="Next month"
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className={styles.calendarGridWrap}>
            <div className={styles.calendarWeekdays}>
              {weekdays.map((day) => (
                <span key={day} className={styles.calendarWeekday}>{day}</span>
              ))}
            </div>
            <div className={styles.calendarGrid}>
              {cells.map((cell) => {
                const cellKey = cell.dayNumber
                  ? `${visibleMonth.getFullYear()}-${String(visibleMonth.getMonth() + 1).padStart(2, "0")}-${String(cell.dayNumber).padStart(2, "0")}`
                  : null;
                const cellItems = cellKey ? (tasksByDate.get(cellKey) ?? []) : [];
                const hasItems = cellItems.length > 0;

                const cellClasses = [
                  styles.calendarCell,
                  cell.isCurrentMonth ? "" : styles.calendarCellEmpty,
                  cell.isToday ? styles.calendarCellToday : "",
                  cell.dayNumber
                    && visibleMonth.getMonth() === selectedDate.getMonth()
                    && visibleMonth.getFullYear() === selectedDate.getFullYear()
                    && cell.dayNumber === selectedDate.getDate()
                    ? styles.calendarCellSelected
                    : "",
                  hasItems ? styles.calendarCellHasTasks : "",
                ].filter(Boolean).join(" ");

                return (
                  <div
                    key={cell.key}
                    className={cellClasses}
                    onClick={() => {
                      if (!cell.dayNumber || !cellKey) return;
                      setSelectedDate(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), cell.dayNumber));
                      if (hasItems) setSidebarDate(cellKey);
                    }}
                  >
                    {cell.dayNumber ? (
                      <span className={`${styles.calendarDay} ${cell.isToday ? styles.calendarDayToday : ""}`.trim()}>{cell.dayNumber}</span>
                    ) : null}
                    {hasItems && (
                      <div className={styles.calTaskList}>
                        {cellItems.slice(0, 2).map(({ task, milestoneTitle }) => (
                          <div
                            key={task.id}
                            className={`${styles.calTaskChip} ${task.completed ? styles.calTaskChipDone : ""}`.trim()}
                          >
                            <span className={`${styles.calTaskTitle} ${task.completed ? styles.calTaskTitleDone : ""}`.trim()}>{task.title}</span>
                            <span className={styles.calTaskMilestone}>{milestoneTitle}</span>
                          </div>
                        ))}
                        {cellItems.length > 2 && (
                          <div className={styles.calMore}>+{cellItems.length - 2} more</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {portalUI}
    </>
  );
}
