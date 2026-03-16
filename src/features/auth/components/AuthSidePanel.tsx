export function AuthSidePanel() {
  return (
    <aside className="hidden min-h-[720px] flex-col justify-between rounded-[var(--radius2)] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(124,111,247,0.08),rgba(255,255,255,0.02))] p-10 lg:flex">
      <div>
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--purple2)]">
          Builder OS
        </p>
        <h2 className="max-w-sm text-[38px] font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--text)]">
          The execution engine for builders.
        </h2>
        <p className="mt-5 max-w-sm text-[15px] leading-7 text-[var(--text2)]">
          CroFlux turns startup strategy into a daily execution system with
          milestones, momentum, and progress you can actually feel.
        </p>
      </div>

      <div className="space-y-8">
        <blockquote className="rounded-[var(--radius2)] border border-[var(--purple-border)] bg-[var(--purple-dim)] p-6">
          <p className="text-[16px] leading-7 text-[var(--text)]">
            “Generated my roadmap fast, kept me accountable every day, and made
            progress impossible to ignore.”
          </p>
          <footer className="mt-4 text-[13px] text-[var(--purple2)]">
            Sara K. — Formify
          </footer>
        </blockquote>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg3)] p-4">
            <div className="text-[26px] font-semibold tracking-[-0.04em] text-[var(--text)]">
              18d
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.08em] text-[var(--text3)]">
              avg idea→launch
            </div>
          </div>
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg3)] p-4">
            <div className="text-[26px] font-semibold tracking-[-0.04em] text-[var(--purple2)]">
              92%
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.08em] text-[var(--text3)]">
              daily retention
            </div>
          </div>
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg3)] p-4">
            <div className="text-[26px] font-semibold tracking-[-0.04em] text-[var(--amber)]">
              4.2k
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.08em] text-[var(--text3)]">
              bosses defeated
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
