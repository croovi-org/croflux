const features = [
  {
    title: "AI Roadmap Generator",
    accent: "text-[#46d9d1]",
    badge: "teal",
    description:
      "Paste your strategy. Get milestones and tasks in seconds.",
  },
  {
    title: "Boss Milestones",
    accent: "text-[var(--amber)]",
    badge: "amber",
    description:
      "Major stages become boss battles. Defeat them to unlock the next stage.",
  },
  {
    title: "Builder Streak",
    accent: "text-[var(--purple2)]",
    badge: "purple",
    description:
      "Ship at least one task daily. Keep your streak. Lose momentum, lose the streak.",
  },
  {
    title: "Weekly Leaderboard",
    accent: "text-[var(--green)]",
    badge: "green",
    description:
      "Compete with other builders on tasks shipped this week. Resets every Monday.",
  },
  {
    title: "Progress Engine",
    accent: "text-[var(--purple2)]",
    badge: "purple",
    description:
      "Always know your exact % to launch. No vague 'in progress' states.",
  },
  {
    title: "Completion Messages",
    accent: "text-[var(--amber)]",
    badge: "amber",
    description:
      "Random motivation on every task. Momentum unlocked. Shipping > perfecting.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="mx-auto max-w-[1140px] px-5 py-20 md:px-10 md:py-24"
    >
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--purple2)]">
          Features
        </p>
        <h2 className="mt-4 text-[clamp(30px,5vw,48px)] font-semibold leading-[1.06] tracking-[-0.04em] text-[var(--text)]">
          Everything you need to ship
        </h2>
        <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-7 text-[var(--text2)]">
          Built for builders who execute, not just plan.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-[var(--radius2)] border border-[var(--border)] bg-[var(--bg2)] p-6 hover:border-[var(--border3)] hover:bg-[var(--bg3)]"
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] text-[16px] ${feature.accent}`}
              >
                ◈
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text4)]">
                {feature.badge}
              </span>
            </div>
            <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-[var(--text)]">
              {feature.title}
            </h3>
            <p className="mt-3 text-[14px] leading-7 text-[var(--text2)]">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
