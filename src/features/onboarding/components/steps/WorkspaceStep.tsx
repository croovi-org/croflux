interface WorkspaceStepProps {
  workspaceName: string;
  slug: string;
  onChange: (field: "workspaceName" | "slug", value: string) => void;
}

export function WorkspaceStep({
  workspaceName,
  slug,
  onChange,
}: WorkspaceStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--purple2)]">
          Step 02 / 04
        </div>
        <h1 className="mt-3 text-[clamp(32px,5vw,48px)] font-semibold tracking-[-0.05em] text-[var(--text)]">
          Set up your workspace.
        </h1>
        <p className="mt-4 max-w-[560px] text-[15px] leading-7 text-[var(--text2)]">
          This should feel familiar. Give the workspace a name, confirm the
          URL slug, and you are ready to turn strategy into a structured build
          system.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="mb-2 block text-[12px] font-medium text-[var(--text2)]">
            Workspace name
          </span>
          <input
            value={workspaceName}
            onChange={(event) => onChange("workspaceName", event.target.value)}
            placeholder="e.g. CroFlux Workspace"
            className="h-13 w-full rounded-[12px] border border-[var(--border2)] bg-[var(--bg3)] px-4 text-[15px] text-[var(--text)] outline-none transition placeholder:text-[var(--text4)] focus:border-[var(--purple)] focus:bg-[var(--bg2)]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[12px] font-medium text-[var(--text2)]">
            Workspace URL
          </span>
          <div className="flex overflow-hidden rounded-[12px] border border-[var(--border2)] bg-[var(--bg3)] transition focus-within:border-[var(--purple)] focus-within:bg-[var(--bg2)]">
            <div className="flex items-center border-r border-[var(--border)] bg-[var(--bg4)] px-4 font-mono text-[13px] text-[var(--text3)]">
              croflux.app/
            </div>
            <input
              value={slug}
              onChange={(event) => onChange("slug", event.target.value)}
              placeholder="croflux-workspace"
              className="h-13 min-w-0 flex-1 bg-transparent px-4 font-mono text-[14px] text-[var(--text)] outline-none placeholder:text-[var(--text4)]"
            />
          </div>
        </label>
      </div>
    </div>
  );
}
