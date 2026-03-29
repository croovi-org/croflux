"use client";

import { useMemo, useState, useTransition } from "react";

type PersonalValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  location: string;
  timezone: string;
};

export function PersonalInfoForm({
  values,
  onSave,
}: {
  values: PersonalValues;
  onSave: (payload: Record<string, string>) => Promise<void>;
}) {
  const [form, setForm] = useState(values);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const timezones = useMemo(
    () => [
      "Asia/Kolkata",
      "Europe/London",
      "America/New_York",
      "America/Los_Angeles",
      "Asia/Singapore",
      "Australia/Sydney",
    ],
    [],
  );

  return (
    <section className="section-card">
      <div className="section-head">
        <div>
          <h2>Personal information</h2>
          <p>Keep your identity and regional preferences up to date.</p>
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
          <span>First name</span>
          <input value={form.firstName} onChange={(e) => setForm((v) => ({ ...v, firstName: e.target.value }))} />
        </label>
        <label>
          <span>Last name</span>
          <input value={form.lastName} onChange={(e) => setForm((v) => ({ ...v, lastName: e.target.value }))} />
        </label>
        <label>
          <span>Email</span>
          <input value={form.email} readOnly />
        </label>
        <label>
          <span>Phone</span>
          <input value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} />
        </label>
        <label>
          <span>Gender</span>
          <select value={form.gender} onChange={(e) => setForm((v) => ({ ...v, gender: e.target.value }))}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </label>
        <label>
          <span>Date of birth</span>
          <input type="date" value={form.dateOfBirth} onChange={(e) => setForm((v) => ({ ...v, dateOfBirth: e.target.value }))} />
        </label>
        <label>
          <span>Location</span>
          <input value={form.location} onChange={(e) => setForm((v) => ({ ...v, location: e.target.value }))} />
        </label>
        <label>
          <span>Timezone</span>
          <select value={form.timezone} onChange={(e) => setForm((v) => ({ ...v, timezone: e.target.value }))}>
            {timezones.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>
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
          padding: 12px 14px;
          border-bottom: 1px solid #252538;
        }
        h2 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #f0f0f8;
        }
        p {
          display: none;
        }
        .save-btn {
          height: 28px;
          padding: 0 10px;
          border-radius: 8px;
          border: 1px solid var(--purple-border);
          background: var(--accent-subtle);
          color: var(--accent-text);
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px 12px;
          padding: 12px 14px 14px;
        }
        label {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        span {
          font-size: 9px;
          color: #5f5f7a;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-family: "Geist Mono", monospace;
        }
        input,
        select {
          height: 36px;
          border-radius: 8px;
          border: 1px solid #252538;
          background: #1a1a28;
          color: #f0f0f8;
          padding: 0 10px;
          font-size: 12px;
          outline: none;
        }
        input[readonly] {
          color: #9095af;
        }
        .message {
          padding: 0 14px 12px;
          font-size: 10px;
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
