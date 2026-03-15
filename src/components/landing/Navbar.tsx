"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const tickerMessages = [
  "Riya K. just completed: Launch landing page",
  "Dev M. defeated Boss: MVP Launch",
  "34 builders active right now",
  "Sara K. started: User onboarding flow",
  "1,284 tasks shipped today",
  "Jay L. extended streak to 3 days",
  "New builder joined: Aarav M. — Nexly",
  "Top builder this week: Riya K. with 34 tasks",
];

export function Navbar() {
  const items = [...tickerMessages, ...tickerMessages];

  return (
    <header className="sticky top-0 z-50">
      <div className="glass-nav border-b border-[var(--border)]">
        <div className="mx-auto flex h-[52px] max-w-[1280px] items-center px-5 md:px-10">
          <Logo />

          <nav className="mx-8 hidden flex-1 items-center gap-1 md:flex">
            <Link
              href="#features"
              className="rounded-md px-3 py-1.5 text-[13px] text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--text)]"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-md px-3 py-1.5 text-[13px] text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--text)]"
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="rounded-md px-3 py-1.5 text-[13px] text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--text)]"
            >
              Pricing
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-md px-3 py-1.5 text-[13px] text-[var(--text2)] hover:text-[var(--text)] md:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center rounded-[var(--radius)] bg-[var(--purple)] px-4 text-[13px] font-medium text-white hover:-translate-y-px hover:bg-[var(--purple3)]"
            >
              Start Building →
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-hidden border-b border-[var(--purple-mid)] bg-[rgba(124,111,247,0.05)]">
        <div className="marquee-track flex w-max gap-12 py-2.5">
          {items.map((message, index) => (
            <div
              key={`${message}-${index}`}
              className="flex items-center gap-2 whitespace-nowrap font-mono text-[12px] text-[rgba(157,152,255,0.7)]"
            >
              <span className="h-1 w-1 rounded-full bg-[var(--purple2)]" />
              <span>{message}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
