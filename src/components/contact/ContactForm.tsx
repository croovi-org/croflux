"use client";

import { LoaderCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

type SubmitState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setState("loading");
    setError("");

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      setState("success");
      form.reset();
    } catch (submissionError) {
      setState("error");
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <section className="rounded-[16px] border border-[#1e1e28] bg-[#111117] p-10 max-md:p-6">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <Field label="Name">
            <Input name="name" type="text" placeholder="Your name" required />
          </Field>
          <Field label="Email">
            <Input name="email" type="email" placeholder="you@company.com" required />
          </Field>
        </div>

        <Field label="Subject">
          <div className="relative">
            <select
              name="subject"
              required
              defaultValue=""
              className="h-[48px] w-full appearance-none rounded-[10px] border border-[#2a2a35] bg-[#0d0d0f] px-4 pr-11 text-[15px] text-[#e4e4e7] outline-none transition placeholder:text-[#3f3f4a] focus:border-[#7c6af7] focus:shadow-[0_0_0_3px_rgba(124,106,247,0.12)]"
            >
              <option value="" disabled>
                Select a topic
              </option>
              <option>Enterprise plan</option>
              <option>Larger team setup</option>
              <option>Custom feature request</option>
              <option>Partnership</option>
              <option>Other</option>
            </select>
            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[16px] text-[#71717a]">
              ▾
            </span>
          </div>
        </Field>

        <Field label="Message">
          <textarea
            name="message"
            required
            placeholder="Tell us about your team, goals, or requirements…"
            className="min-h-[130px] w-full resize-y rounded-[10px] border border-[#2a2a35] bg-[#0d0d0f] px-4 py-3 text-[15px] text-[#e4e4e7] outline-none transition placeholder:text-[#3f3f4a] focus:border-[#7c6af7] focus:shadow-[0_0_0_3px_rgba(124,106,247,0.12)]"
          />
        </Field>

        {state === "success" ? (
          <div className="rounded-[10px] border border-[rgba(34,197,94,0.28)] bg-[rgba(34,197,94,0.08)] px-4 py-4 text-center text-[14px] font-medium text-[#22c55e]">
            Message sent! We&apos;ll be in touch soon.
          </div>
        ) : (
          <>
            <Button
              type="submit"
              disabled={state === "loading"}
              className="h-[52px] w-full rounded-[10px] border border-transparent bg-[#7c6af7] text-[15px] font-semibold text-white shadow-none hover:-translate-y-px hover:bg-[#6a57e8] active:translate-y-0 disabled:pointer-events-none disabled:opacity-70"
            >
              {state === "loading" ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Sending…
                </>
              ) : (
                "Send message →"
              )}
            </Button>
            {state === "error" ? (
              <p className="text-center text-[13px] text-[#ef4444]">{error}</p>
            ) : null}
            <p className="text-center text-[12px] text-[#52525b]">⏱ Usually respond within 24 hours</p>
          </>
        )}
      </form>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-medium text-[#52525b]">{label}</div>
      {children}
    </label>
  );
}

function Input({
  name,
  type,
  placeholder,
  required,
}: {
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      className="h-[48px] w-full rounded-[10px] border border-[#2a2a35] bg-[#0d0d0f] px-4 text-[15px] text-[#e4e4e7] outline-none transition placeholder:text-[#3f3f4a] focus:border-[#7c6af7] focus:shadow-[0_0_0_3px_rgba(124,106,247,0.12)]"
    />
  );
}
