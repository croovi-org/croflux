import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { createClient } from "@/lib/supabase/server";
import {
  getIncompleteTaskCount,
  getInitials,
  getNextUpTask,
  getSidebarMilestones,
  getWorkspaceData,
} from "@/lib/workspace/data";
import type { User } from "@/types";

export default async function LeaderboardPage() {
  const { user, project, milestones, rank, projectCount } = await getWorkspaceData();
  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("*")
    .order("weekly_tasks_completed", { ascending: false })
    .order("streak", { ascending: false })
    .limit(10);
  const userIds = (data ?? []).map((u: User) => u.id)
  const { data: projectsData } = await supabase
    .from("projects")
    .select("user_id, name")
    .in("user_id", userIds)

  const projectMap = Object.fromEntries(
    (projectsData ?? []).map((p: { user_id: string; name: string }) => [p.user_id, p.name])
  )
  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const { data: activityData } = await supabase
    .from("activity_log")
    .select("timestamp")
    .eq("user_id", user.id)
    .gte("timestamp", sevenDaysAgo.toISOString())
    .order("timestamp", { ascending: true })

  // Build a map of day label → count for the last 7 days
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const dayCounts: number[] = Array(7).fill(0)

  for (const row of activityData ?? []) {
    const d = new Date(row.timestamp)
    const dayOfWeek = d.getDay() // 0 = Sun
    const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Mon=0 ... Sun=6
    dayCounts[index] = (dayCounts[index] ?? 0) + 1
  }

  const maxCount = Math.max(...dayCounts, 1)
  const todayIndex = (() => {
    const d = new Date().getDay()
    return d === 0 ? 6 : d - 1
  })()

  const entries = ((data ?? []) as User[]).map((entry, index) => ({
    ...entry,
    position: index + 1,
  }));

  const initials = getInitials(user.name);
  const nextUp = getNextUpTask(milestones);

  return (
    <WorkspaceShell
      workspaceName={project.name}
      currentPage="Leaderboard"
      currentSection="/leaderboard"
      initials={initials}
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
          <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  marginBottom: 6,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--accent)",
                }}
              >
                Weekly competition
              </div>
              <h1 style={{ margin: "0 0 6px", fontSize: 28, lineHeight: 1 }}>
                Leaderboard
              </h1>
              <p style={{ margin: 0, color: "#9898b8", fontSize: 14 }}>
                Ranked by weekly shipped tasks, with streak used as the tiebreaker.
              </p>
            </div>

            <section
              style={{
                border: "1px solid #1e1e2e",
                borderRadius: 16,
                background: "#13131e",
                padding: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 14,
                  fontSize: 12,
                  color: "#9898b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                <span>Top builders</span>
                <span>{entries.length} tracked</span>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {entries.map((entry) => {
                  const isCurrentUser = entry.id === user.id;

                  return (
                    <article
                      key={entry.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "72px minmax(0, 1fr) 110px 110px",
                        gap: 12,
                        alignItems: "center",
                        padding: "14px 16px",
                        borderRadius: 14,
                        border: isCurrentUser
                          ? "1px solid var(--purple-border)"
                          : "1px solid #252538",
                        background: isCurrentUser
                          ? "var(--accent-subtle)"
                          : "#101019",
                      }}
                    >
                      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>
                        #{entry.position}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            display: "grid",
                            placeItems: "center",
                            background: "#1a1a28",
                            color: "#f0f0f8",
                            fontSize: 13,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {getInitials(entry.name ?? "Anonymous")}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{entry.name ?? "Anonymous Builder"}</div>
                          <div
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              color: "#5f5f7a",
                              fontSize: 12,
                            }}
                          >
                            {projectMap[entry.id] ?? "Building in stealth"}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>
                          {entry.weekly_tasks_completed}
                        </div>
                        <div
                          style={{
                            color: "#5f5f7a",
                            fontSize: 11,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          tasks
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{entry.streak}</div>
                        <div
                          style={{
                            color: "#5f5f7a",
                            fontSize: 11,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          day streak
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
            <section style={{ marginTop: 28, border: "1px solid #1e1e2e", borderRadius: 16, background: "#13131e", padding: 18 }}>
              <div style={{ marginBottom: 14, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#5f5f7a" }}>
                Your activity — this week
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 64 }}>
                {dayCounts.map((count, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
                    <div style={{
                      flex: 1,
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-end",
                    }}>
                      <div style={{
                        width: "100%",
                        height: `${Math.max(8, Math.round((count / maxCount) * 100))}%`,
                        borderRadius: 4,
                        background: i === todayIndex ? "var(--accent)" : count > 0 ? "rgba(124, 110, 247, 0.35)" : "rgba(255,255,255,0.05)",
                        transition: "height 0.3s ease",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {dayLabels.map((label, i) => (
                  <div key={i} style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 10,
                    fontFamily: "var(--mono)",
                    color: i === todayIndex ? "var(--accent)" : "#5f5f7a",
                  }}>
                    {label}
                  </div>
                ))}
              </div>
            </section>
          </div>
      </main>
    </WorkspaceShell>
  );
}
