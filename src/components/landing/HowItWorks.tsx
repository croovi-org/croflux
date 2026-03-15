const steps = [
  {
    number: "01",
    title: "Paste your strategy",
    description:
      "Describe your build path. CLI tool, SaaS, AI product — anything.",
  },
  {
    number: "02",
    title: "AI generates your roadmap",
    description:
      "4–6 milestones, 3–5 tasks each. Fully editable before you start.",
  },
  {
    number: "03",
    title: "Execute daily",
    description:
      "Check off tasks. Watch your progress climb. Keep your streak alive.",
  },
  {
    number: "04",
    title: "Climb the board",
    description:
      "Weekly leaderboard resets every Monday. Ship more, rank higher.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]"
    >
      <div className="mx-auto max-w-[1140px] px-5 py-20 md:px-10 md:py-24">
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--purple2)]">
            Workflow
          </p>
          <h2 className="mt-4 text-[clamp(30px,5vw,48px)] font-semibold leading-[1.06] tracking-[-0.04em] text-[var(--text)]">
            From strategy to shipped in minutes
          </h2>
        </div>

        <div className="mt-12 grid gap-4 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 ? (
                <div className="pointer-events-none absolute -right-3 top-11 hidden xl:block">
                  <span className="font-mono text-[16px] text-[var(--text4)]">
                    →
                  </span>
                </div>
              ) : null}
              <article className="h-full rounded-[var(--radius2)] border border-[var(--border)] bg-[var(--bg2)] p-6">
                <p className="font-mono text-[14px] text-[var(--purple2)]">
                  {step.number}
                </p>
                <h3 className="mt-4 text-[18px] font-semibold tracking-[-0.02em] text-[var(--text)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[14px] leading-7 text-[var(--text2)]">
                  {step.description}
                </p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
