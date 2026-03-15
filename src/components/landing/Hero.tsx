import Link from "next/link";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-[1140px] px-5 pb-16 pt-24 text-center md:px-10 md:pb-20">
      <div className="pointer-events-none absolute left-1/2 top-[-160px] h-[520px] w-[900px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(124,111,247,0.12)_0%,transparent_68%)]" />

      <div className="relative z-10">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--purple-mid)] bg-[var(--purple-dim)] px-4 py-2 text-[12px] font-medium text-[var(--purple2)]">
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--purple)]">
            <span className="h-[6px] w-[6px] rounded-full bg-white" />
          </span>
          <span>Now in beta · 247 builders shipping daily</span>
        </div>

        <h1 className="mx-auto max-w-[920px] text-[clamp(44px,8vw,80px)] font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--text)]">
          <span className="block">Track your startup</span>
          <span className="block">
            from idea to <span className="text-gradient">launch.</span>
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-8 text-[var(--text2)]">
          Turn your Product Development Strategy into milestones, tasks, and
          real progress. Ship daily. Beat the bosses. Climb the board.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center rounded-[var(--radius)] bg-[var(--purple)] px-6 text-[14px] font-medium text-white shadow-[0_8px_28px_rgba(124,111,247,0.24)] hover:-translate-y-0.5 hover:bg-[var(--purple3)]"
          >
            Start Building with CroFlux →
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex h-12 items-center rounded-[var(--radius)] border border-[var(--border2)] px-6 text-[14px] text-[var(--text2)] hover:border-[var(--border3)] hover:bg-[var(--bg3)] hover:text-[var(--text)]"
          >
            See how it works
          </Link>
        </div>

        <div className="mt-11 inline-grid overflow-hidden rounded-[var(--radius)] border border-[var(--border)] md:grid-cols-3">
          <div className="border-b border-[var(--border)] px-8 py-4 md:border-b-0 md:border-r">
            <div className="text-[26px] font-semibold tracking-[-0.04em] text-[var(--text)]">
              247
            </div>
            <div className="text-[11px] text-[var(--text3)]">Active builders</div>
          </div>
          <div className="border-b border-[var(--border)] px-8 py-4 md:border-b-0 md:border-r">
            <div className="text-[26px] font-semibold tracking-[-0.04em] text-[var(--amber)]">
              1.2k
            </div>
            <div className="text-[11px] text-[var(--text3)]">
              Tasks shipped / week
            </div>
          </div>
          <div className="px-8 py-4">
            <div className="text-[26px] font-semibold tracking-[-0.04em] text-[var(--purple2)]">
              92%
            </div>
            <div className="text-[11px] text-[var(--text3)]">Daily retention</div>
          </div>
        </div>
      </div>
    </section>
  );
}
