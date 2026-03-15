const navItems = [
  { label: "Dashboard", active: true },
  { label: "Milestones" },
  { label: "Tasks" },
  { label: "Leaderboard" },
  { label: "Settings" },
];

const milestones = [
  {
    icon: "✓",
    title: "CLI Foundation",
    state: "done",
    badge: "Done",
  },
  {
    icon: "⚡",
    title: "Bug Detection Engine",
    state: "active",
    badge: "BOSS",
  },
  {
    icon: "🔒",
    title: "Patch Generator",
    state: "locked",
    badge: "Locked",
  },
  {
    icon: "🔒",
    title: "GitHub Integration",
    state: "locked",
    badge: "Locked",
  },
];

const leaders = [
  { name: "Riya K.", score: 34 },
  { name: "Dev M.", score: 28 },
  { name: "Sara K.", score: 21 },
];

export function DashboardPreview() {
  return (
    <section className="mx-auto max-w-[1080px] px-5 pb-16 md:px-10 md:pb-24">
      <div className="overflow-hidden rounded-[var(--radius2)] border border-[var(--border2)] bg-[var(--bg2)] shadow-[0_30px_90px_rgba(0,0,0,0.5),0_0_100px_rgba(124,111,247,0.08)]">
        <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--bg3)] px-4 py-3">
          <div className="flex gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="ml-3 flex-1 rounded-[5px] bg-[var(--bg4)] px-3 py-1 text-center font-mono text-[11px] text-[var(--text3)]">
            croflux.app/dashboard
          </div>
        </div>

        <div className="grid min-h-[340px] md:grid-cols-[190px_1fr_175px]">
          <aside className="hidden border-r border-[var(--border)] bg-[var(--bg2)] p-3 md:block">
            <p className="px-2 pb-3 pt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text4)]">
              Workspace
            </p>
            <div className="space-y-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-[6px] px-3 py-2 text-[12px] ${
                    item.active
                      ? "bg-[var(--bg4)] text-[var(--text)]"
                      : "text-[var(--text3)] hover:bg-[var(--bg3)] hover:text-[var(--text)]"
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </aside>

          <div className="p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[var(--text)]">
                  Croofx — AI debugging CLI
                </h2>
                <p className="mt-1 text-[11px] text-[var(--text3)]">
                  Solo founder workspace
                </p>
              </div>
              <span className="rounded-[4px] border border-[rgba(34,197,94,0.2)] bg-[var(--green-dim)] px-2.5 py-1 text-[11px] text-[var(--green)]">
                Active
              </span>
            </div>

            <div className="mt-7 flex items-end justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text4)]">
                Progress
              </span>
              <span className="text-[24px] font-semibold tracking-[-0.04em] text-[var(--text)]">
                45%
              </span>
            </div>
            <div className="mt-2 h-[4px] rounded-full bg-[var(--bg5)]">
              <div className="dashboard-progress-fill relative h-full rounded-full bg-[linear-gradient(90deg,var(--purple3),var(--purple2))]" />
            </div>

            <div className="mt-7">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text4)]">
                Milestones
              </p>

              <div className="space-y-3">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.title}
                    className="flex items-center gap-3 border-b border-[var(--border)] pb-3 last:border-b-0"
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-[4px] text-[10px] ${
                        milestone.state === "done"
                          ? "bg-[var(--green-dim)] text-[var(--green)]"
                          : milestone.state === "active"
                            ? "bg-[var(--purple-dim)] text-[var(--purple2)]"
                            : "bg-[var(--bg4)] text-[var(--text4)]"
                      }`}
                    >
                      {milestone.icon}
                    </span>
                    <span
                      className={`flex-1 text-[12px] ${
                        milestone.state === "done"
                          ? "text-[var(--text3)] line-through"
                          : milestone.state === "locked"
                            ? "text-[var(--text4)]"
                            : "text-[var(--text)]"
                      }`}
                    >
                      {milestone.title}
                    </span>
                    <span
                      className={`rounded-[4px] px-2 py-1 font-mono text-[10px] ${
                        milestone.state === "done"
                          ? "border border-[rgba(34,197,94,0.18)] bg-[var(--green-dim)] text-[var(--green)]"
                          : milestone.state === "active"
                            ? "border border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.1)] text-[var(--amber)]"
                            : "border border-[var(--border)] bg-[var(--bg4)] text-[var(--text4)]"
                      }`}
                    >
                      {milestone.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="border-t border-[var(--border)] bg-[var(--bg2)] p-4 md:border-l md:border-t-0">
            <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
              <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg3)] p-3">
                <div className="text-[22px] font-semibold tracking-[-0.04em] text-[var(--amber)]">
                  6d
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text4)]">
                  streak
                </div>
              </div>
              <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg3)] p-3">
                <div className="text-[22px] font-semibold tracking-[-0.04em] text-[var(--purple2)]">
                  #12
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text4)]">
                  rank
                </div>
              </div>
              <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg3)] p-3">
                <div className="text-[22px] font-semibold tracking-[-0.04em] text-[var(--text)]">
                  18
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text4)]">
                  tasks
                </div>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text4)]">
                Mini leaderboard
              </p>
              <div className="space-y-2">
                {leaders.map((leader, index) => (
                  <div
                    key={leader.name}
                    className="flex items-center gap-2 border-b border-[var(--border)] pb-2 last:border-b-0"
                  >
                    <span className="w-4 text-center font-mono text-[10px] text-[var(--text4)]">
                      {index + 1}
                    </span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[var(--bg4)] font-mono text-[8px] text-[var(--text3)]">
                      {leader.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </span>
                    <span className="flex-1 text-[10px] text-[var(--text2)]">
                      {leader.name}
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-[var(--purple2)]">
                      {leader.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
