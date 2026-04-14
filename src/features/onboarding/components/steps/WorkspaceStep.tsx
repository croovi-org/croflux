import { useState } from "react";

interface WorkspaceStepProps {
  workspaceName: string;
  slug: string;
  onChange: (field: "workspaceName" | "slug", value: string) => void;
  existingWorkspaces?: Array<{
    id: string;
    workspace_name: string;
    workspace_slug: string;
  }>;
  onSelectExisting?: (workspace: {
    workspace_name: string;
    workspace_slug: string;
  }) => void;
}

export function WorkspaceStep({
  workspaceName,
  slug,
  onChange,
  existingWorkspaces,
  onSelectExisting,
}: WorkspaceStepProps) {
  const [selectedExistingId, setSelectedExistingId] = useState("");

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
        {existingWorkspaces && existingWorkspaces.length > 0 && (
          <div>
            <div className="mb-3 text-[12px] font-medium text-[var(--text2)]">
              Add to existing workspace
            </div>
            <div className="relative">
              <select
                value={selectedExistingId}
                onChange={(e) => {
                  const ws = existingWorkspaces.find((w) => w.id === e.target.value);
                  if (ws) {
                    onSelectExisting?.({
                      workspace_name: ws.workspace_name,
                      workspace_slug: ws.workspace_slug,
                    });
                  }
                  setSelectedExistingId(e.target.value);
                }}
                className="w-full appearance-none rounded-[12px] border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3 text-[14px] text-[var(--text)] outline-none transition focus:border-[var(--purple)] cursor-pointer"
                style={{ paddingRight: "2.5rem" }}
              >
                <option value="">Select existing workspace...</option>
                {existingWorkspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.workspace_name} — croflux.app/{ws.workspace_slug}
                  </option>
                ))}
              </select>
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text3)]"
              >
                <path d="m4 6 4 4 4-4" />
              </svg>
            </div>
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-[11px] text-[var(--text3)]">or create new workspace</span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>
          </div>
        )}

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
