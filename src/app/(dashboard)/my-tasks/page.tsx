import { IconRail } from "@/components/workspace/IconRail";
import { Sidebar } from "@/components/workspace/Sidebar";
import { Topbar } from "@/components/workspace/Topbar";
import {
  getBossHp,
  getIncompleteTaskCount,
  getInitials,
  getMilestoneProgress,
  getNextUpTask,
  getSidebarMilestones,
  getWorkspaceData,
} from "@/lib/workspace/data";

export default async function MyTasksPage() {
  const { user, project, milestones, rank } = await getWorkspaceData();
  const initials = getInitials(user.name);
  const nextUp = getNextUpTask(milestones);
  const tasks = milestones.flatMap((milestone) =>
    milestone.tasks.map((task) => ({
      ...task,
      milestoneTitle: milestone.title,
      isBoss: milestone.is_boss,
      progress: milestone.is_boss
        ? 100 - getBossHp(milestone)
        : getMilestoneProgress(milestone),
    })),
  );
  const openTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#f0f0f8" }}>
      <Topbar workspaceName={project.name} currentPage="My Tasks" initials={initials} userName={user.name} />

      <div style={{ display: "flex", minHeight: "calc(100vh - 48px)" }}>
        <IconRail />
        <Sidebar
          workspaceName={project.name}
          initials={initials}
          nextUpTask={nextUp?.task.title ?? null}
          nextUpContext={nextUp?.context ?? null}
          incompleteTaskCount={getIncompleteTaskCount(milestones)}
          rank={rank}
          milestones={getSidebarMilestones(milestones)}
          streak={user.streak}
          currentSection="/my-tasks"
        />

        <main style={{ flex: 1, minWidth: 0, background: "#0f0f17" }}>
          <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  marginBottom: 6,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#7c6ef7",
                }}
              >
                Workspace queue
              </div>
              <h1 style={{ margin: "0 0 6px", fontSize: 28, lineHeight: 1 }}>My tasks</h1>
              <p style={{ margin: 0, color: "#9898b8", fontSize: 14 }}>
                Everything still open across your current roadmap, ordered by milestone.
              </p>
            </div>

            <section
              style={{
                border: "1px solid #1e1e2e",
                borderRadius: 16,
                background: "#13131e",
                padding: 18,
                marginBottom: 16,
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
                <span>Open now</span>
                <span>{openTasks.length} tasks</span>
              </div>

              {openTasks.length === 0 ? (
                <div
                  style={{
                    border: "1px dashed #2e2e48",
                    borderRadius: 14,
                    padding: "24px 16px",
                    color: "#5f5f7a",
                    textAlign: "center",
                  }}
                >
                  No open tasks. Your roadmap is fully cleared.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {openTasks.map((task) => (
                    <article
                      key={task.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        border: "1px solid #252538",
                        borderRadius: 14,
                        padding: "14px 16px",
                        background: "#101019",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{task.title}</div>
                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            marginTop: 4,
                            color: "#5f5f7a",
                            fontSize: 12,
                          }}
                        >
                          <span>{task.milestoneTitle}</span>
                          <span>{task.progress}% complete</span>
                        </div>
                      </div>
                      <span
                        style={{
                          borderRadius: 999,
                          padding: "5px 9px",
                          fontSize: 11,
                          color: task.isBoss ? "#ffb700" : "#9898b8",
                          background: task.isBoss ? "rgba(255, 183, 0, 0.08)" : "#161625",
                          border: task.isBoss
                            ? "1px solid rgba(255, 183, 0, 0.28)"
                            : "1px solid #2e2e48",
                        }}
                      >
                        {task.isBoss ? "Boss" : "Task"}
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </section>

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
                <span>Completed</span>
                <span>{completedTasks.length} tasks</span>
              </div>

              {completedTasks.length === 0 ? (
                <div
                  style={{
                    border: "1px dashed #2e2e48",
                    borderRadius: 14,
                    padding: "24px 16px",
                    color: "#5f5f7a",
                    textAlign: "center",
                  }}
                >
                  No completed tasks yet.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {completedTasks.slice(0, 10).map((task) => (
                    <article
                      key={task.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        border: "1px solid #252538",
                        borderRadius: 14,
                        padding: "14px 16px",
                        background: "#101019",
                        opacity: 0.72,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{task.title}</div>
                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            marginTop: 4,
                            color: "#5f5f7a",
                            fontSize: 12,
                          }}
                        >
                          <span>{task.milestoneTitle}</span>
                          <span>Done</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
