"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const liveMessages = [
  "247 builders active right now",
  "1,284 tasks shipped today",
  "34 boss milestones defeated this week",
  "92% daily retention among builders",
];

export function CtaSection() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % liveMessages.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden border-t border-[var(--border)] px-5 py-24 text-center md:px-10 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-[-160px] mx-auto h-[520px] w-[760px] bg-[radial-gradient(ellipse_at_center,rgba(124,111,247,0.1)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[54%] text-[clamp(120px,20vw,240px)] font-semibold tracking-[-0.08em] text-[rgba(124,111,247,0.04)]">
        SHIP
      </div>

      <div className="relative z-10 mx-auto max-w-[760px]">
        <h2 className="text-[clamp(38px,7vw,72px)] font-semibold leading-[1.02] tracking-[-0.05em] text-[var(--text)]">
          <span className="block">Stop planning.</span>
          <span className="block text-gradient">Start shipping.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-[520px] text-[17px] leading-8 text-[var(--text2)]">
          Turn strategy into momentum, make progress visible, and build your
          startup with a system that keeps you moving.
        </p>

        <Link
          href="/signup"
          className="mt-10 inline-flex h-12 items-center rounded-[var(--radius)] bg-[var(--purple)] px-6 text-[14px] font-medium text-white shadow-[0_8px_28px_rgba(124,111,247,0.24)] hover:-translate-y-0.5 hover:bg-[var(--purple3)]"
        >
          Start Building with CroFlux →
        </Link>

        <div className="mt-6 inline-flex items-center gap-2 text-[12px] text-[var(--text3)]">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
          <span>{liveMessages[messageIndex]}</span>
        </div>
      </div>
    </section>
  );
}
