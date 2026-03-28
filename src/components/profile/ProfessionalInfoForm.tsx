"use client";

import { useMemo, useState, useTransition } from "react";

type ProfessionalValues = {
  projectId: string;
  startupName: string;
  role: string;
  workspaceName: string;
  workspaceSlug: string;
  bio: string;
  twitter: string;
  website: string;
  linkedin: string;
};

export function ProfessionalInfoForm({
  values,
  onSave,
}: {
  values: ProfessionalValues;
  onSave: (payload: Record<string, string>) => Promise<void>;
}) {
  const [form, setForm] = useState(values);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const workspaceUrl = useMemo(
    () => `croflux.app/${form.workspaceSlug || "workspace"}`,
    [form.workspaceSlug],
  );

  return (
    <section className="section-card">
      <div className="section-head">
        <div>
          <h2>Professional details</h2>
          <p>Manage startup identity, workspace details, and public links.</p>
        </div>
        <button
          type="button"
          className="save-btn"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await onSave(form);
              setMessage("Saved");
            })
          }
        >
          {pending ? "Saving..." : "Save changes"}
        </button>
      </div>

      <div className="form-grid">
        <label>
          <span>Startup name</span>
          <input value={form.startupName} onChange={(e) => setForm((v) => ({ ...v, startupName: e.target.value }))} />
        </label>
        <label>
          <span>Role</span>
          <input value={form.role} onChange={(e) => setForm((v) => ({ ...v, role: e.target.value }))} />
        </label>
        <label>
          <span>Workspace name</span>
          <input value={form.workspaceName} onChange={(e) => setForm((v) => ({ ...v, workspaceName: e.target.value }))} />
        </label>
        <label>
          <span>Workspace URL</span>
          <input value={workspaceUrl} readOnly className="mono accent" />
        </label>
        <label className="full">
          <span>Bio</span>
          <textarea rows={3} value={form.bio} onChange={(e) => setForm((v) => ({ ...v, bio: e.target.value }))} />
        </label>
        <label>
          <span>Twitter / X</span>
          <input value={form.twitter} onChange={(e) => setForm((v) => ({ ...v, twitter: e.target.value }))} />
        </label>
        <label>
          <span>Personal website</span>
          <input value={form.website} onChange={(e) => setForm((v) => ({ ...v, website: e.target.value }))} />
        </label>
        <label>
          <span>LinkedIn</span>
          <input value={form.linkedin} onChange={(e) => setForm((v) => ({ ...v, linkedin: e.target.value }))} />
        </label>
      </div>
      <div className="message">{message}</div>

      <style jsx>{`
        .section-card {
          background: #13131e;
          border: 1px solid #252538;
          border-radius: 12px;
        }
        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 20px 22px;
          border-bottom: 1px solid #252538;
        }
        h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #f0f0f8;
        }
        p {
          display: none;
        }
        .save-btn {
          height: 34px;
          padding: 0 14px;
          border-radius: 8px;
          border: 1px solid rgba(124, 110, 247, 0.22);
          background: rgba(124, 110, 247, 0.08);
          color: #8f84ff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px 18px;
          padding: 18px 28px 28px;
        }
        label {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .full {
          grid-column: 1 / -1;
        }
        span {
          font-size: 10px;
          color: #5f5f7a;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-family: "Geist Mono", monospace;
        }
        input,
        textarea {
          border-radius: 8px;
          border: 1px solid #252538;
          background: #1a1a28;
          color: #f0f0f8;
          padding: 12px 16px;
          font-size: 13px;
          outline: none;
        }
        input {
          height: 46px;
        }
        textarea {
          resize: vertical;
          min-height: 108px;
        }
        .mono {
          font-family: "Geist Mono", monospace;
        }
        .accent {
          color: #7c6ef7;
        }
        .message {
          padding: 0 28px 22px;
          font-size: 11px;
          color: #22c55e;
        }
        @media (max-width: 860px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
