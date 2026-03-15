import Link from "next/link";

const freeFeatures = [
  "1 project",
  "AI roadmap",
  "Task tracking",
  "Progress bar",
  "Leaderboard",
];

const builderFeatures = [
  "Everything in Free",
  "Unlimited projects",
  "Boss battles",
  "Activity analytics",
  "Streak tracking",
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="border-y border-[var(--border)] bg-[linear-gradient(180deg,rgba(124,111,247,0.04),transparent)]"
    >
      <div className="mx-auto max-w-[1140px] px-5 py-20 md:px-10 md:py-24">
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--purple2)]">
            Pricing
          </p>
          <h2 className="mt-4 text-[clamp(30px,5vw,46px)] font-semibold leading-[1.06] tracking-[-0.04em] text-[var(--text)]">
            Premium execution, simple pricing
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-[760px] gap-4 md:grid-cols-2">
          <article className="rounded-[var(--radius2)] border border-[var(--border)] bg-[var(--bg2)] p-8">
            <p className="text-[13px] text-[var(--text2)]">Free</p>
            <p className="mt-3 text-[44px] font-semibold tracking-[-0.05em] text-[var(--text)]">
              $0
            </p>
            <p className="mt-1 text-[12px] text-[var(--text3)]">for starters</p>

            <ul className="mt-7 space-y-3">
              {freeFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-[14px] text-[var(--text2)]"
                >
                  <span className="h-3.5 w-3.5 rounded-full border border-[rgba(34,197,94,0.18)] bg-[var(--green-dim)]" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-[var(--radius)] border border-[var(--border2)] text-[14px] text-[var(--text2)] hover:border-[var(--border3)] hover:text-[var(--text)]"
            >
              Start free
            </Link>
          </article>

          <article className="relative overflow-hidden rounded-[var(--radius2)] border border-[var(--purple-mid)] bg-[linear-gradient(180deg,rgba(124,111,247,0.08),rgba(255,255,255,0.02))] p-8 shadow-[0_0_40px_rgba(124,111,247,0.12)]">
            <span className="mb-4 inline-block rounded-[4px] bg-[var(--purple)] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-white">
              Builder
            </span>
            <p className="text-[13px] text-[var(--text2)]">Builder</p>
            <p className="mt-3 text-[44px] font-semibold tracking-[-0.05em] text-[var(--text)]">
              $9
            </p>
            <p className="mt-1 text-[12px] text-[var(--text3)]">per month</p>

            <ul className="mt-7 space-y-3">
              {builderFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-[14px] text-[var(--text2)]"
                >
                  <span className="h-3.5 w-3.5 rounded-full border border-[rgba(34,197,94,0.18)] bg-[var(--green-dim)]" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-[var(--radius)] bg-[var(--purple)] text-[14px] font-medium text-white hover:bg-[var(--purple3)]"
            >
              Start Building →
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
