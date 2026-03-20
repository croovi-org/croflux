interface OnboardingSidebarProps {
  currentStep: number;
  completedSteps: number[];
  onStepSelect: (step: number) => void;
}

const steps = [
  "Startup info",
  "Workspace",
  "Product strategy",
  "Review & launch",
];

export function OnboardingSidebar({
  currentStep,
  completedSteps,
  onStepSelect,
}: OnboardingSidebarProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <aside className="flex min-h-full flex-col border-b border-[var(--border)] bg-[var(--bg3)] lg:border-r lg:border-b-0">
      <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6 sm:py-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--purple2)]">
          Builder setup
        </div>
        <div className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[var(--text)]">
          Onboarding
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-3 py-4 lg:block lg:flex-1 lg:space-y-1 lg:overflow-visible lg:px-3 lg:py-6">
        {steps.map((label, index) => {
          const done = completedSteps.includes(index);
          const active = currentStep === index;

          return (
            <button
              key={label}
              type="button"
              onClick={() => onStepSelect(index)}
              className={`group flex min-w-[170px] items-center gap-3 rounded-[12px] border px-4 py-3 text-left transition lg:min-w-0 ${
                active
                  ? "border-[var(--purple-border)] bg-[var(--purple-dim)]"
                  : "border-transparent bg-transparent hover:border-[var(--border)] hover:bg-[rgba(255,255,255,0.02)]"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium ${
                  done
                    ? "border-[rgba(34,197,94,0.24)] bg-[var(--green-dim)] text-[var(--green)]"
                    : active
                      ? "border-[var(--purple)] bg-[rgba(169,157,254,0.12)] text-[var(--purple2)]"
                      : "border-[var(--border2)] bg-[var(--bg4)] text-[var(--text3)]"
                }`}
              >
                {done ? "✓" : String(index + 1).padStart(2, "0")}
              </div>
              <div>
                <div
                  className={`text-[13px] font-medium ${
                    active || done ? "text-[var(--text)]" : "text-[var(--text2)]"
                  }`}
                >
                  {label}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto border-t border-[var(--border)] px-5 py-4 sm:px-6">
        <div className="h-1 overflow-hidden rounded-full bg-[var(--bg5)]">
          <div
            className="h-full rounded-full bg-[var(--purple)] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 text-[12px] text-[var(--text3)]">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>
    </aside>
  );
}
