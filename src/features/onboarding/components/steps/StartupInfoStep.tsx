interface StartupInfoStepProps {
  startupName: string;
  oneLiner: string;
  onChange: (field: "startupName" | "oneLiner", value: string) => void;
}

export function StartupInfoStep({
  startupName,
  oneLiner,
  onChange,
}: StartupInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--purple2)]">
          Step 01 / 04
        </div>
        <h1 className="mt-3 text-[clamp(32px,5vw,48px)] font-semibold tracking-[-0.05em] text-[var(--text)]">
          Tell us about your startup.
        </h1>
        <p className="mt-4 max-w-[560px] text-[15px] leading-7 text-[var(--text2)]">
          Keep it tight. We only need the startup name and a clear one-liner to
          set up your workspace and contextualize the roadmap.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="mb-2 block text-[12px] font-medium text-[var(--text2)]">
            Startup name
          </span>
          <input
            value={startupName}
            onChange={(event) => onChange("startupName", event.target.value)}
            placeholder="e.g. CroFlux"
            className="h-13 w-full rounded-[12px] border border-[var(--border2)] bg-[var(--bg3)] px-4 text-[15px] text-[var(--text)] outline-none transition placeholder:text-[var(--text4)] focus:border-[var(--purple)] focus:bg-[var(--bg2)]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[12px] font-medium text-[var(--text2)]">
            One-line description
          </span>
          <input
            value={oneLiner}
            onChange={(event) => onChange("oneLiner", event.target.value)}
            placeholder="e.g. Startup execution OS for indie hackers"
            className="h-13 w-full rounded-[12px] border border-[var(--border2)] bg-[var(--bg3)] px-4 text-[15px] text-[var(--text)] outline-none transition placeholder:text-[var(--text4)] focus:border-[var(--purple)] focus:bg-[var(--bg2)]"
          />
        </label>
      </div>
    </div>
  );
}
