import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactSidebar } from "@/components/contact/ContactSidebar";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact", active: true },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0f] text-[#e4e4e7]">
      <header className="sticky top-0 z-[100] border-b border-[#1e1e24] bg-[#0d0d0f]">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-12 py-[18px] max-md:flex-wrap max-md:justify-center max-md:gap-5 max-md:px-6">
          <Link
            href="/"
            className="relative flex h-[34px] w-[84px] shrink-0 items-center justify-center"
          >
            <Image
              src="/croflux-mark.png"
              alt="CroFlux"
              fill
              sizes="84px"
              className="object-contain"
            />
          </Link>

          <div
            role="navigation"
            aria-label="Primary navigation"
            className="flex items-center gap-8 text-[14px] text-[#a1a1aa] max-md:order-3 max-md:w-full max-md:justify-center max-md:gap-5"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  item.active
                    ? "text-[var(--accent)]"
                    : "text-[#a1a1aa] transition-colors duration-200 hover:text-white"
                }
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            href="/signup"
            className="inline-flex h-[40px] shrink-0 items-center justify-center rounded-[8px] bg-[var(--accent)] px-5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[var(--accent-hover)]"
          >
            Get started <ArrowRight className="ml-1 size-4" />
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-[1180px] px-6 pt-16 pb-20">
        <div className="mx-auto max-w-[560px] text-center">
          <div className="inline-flex items-center rounded-full border border-[#2a2a35] bg-[#18181f] px-4 py-2 text-[13px] font-medium text-[var(--accent)]">
            ✉️&nbsp; Get in touch
          </div>
          <h1 className="mt-6 text-[42px] leading-[1.05] font-bold tracking-[-1px] text-[#e4e4e7] max-md:text-[34px]">
            Tell us what <span className="bg-linear-to-r from-[var(--accent)] to-[#a78bfa] bg-clip-text text-transparent">you need</span>
          </h1>
          <p className="mt-5 text-[15px] leading-7 text-[#71717a]">
            For teams with specific needs, custom workflows, or early enterprise setup. We&apos;re
            happy to explore how CroFlux can support your team.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-[960px] grid-cols-[minmax(0,1fr)_320px] items-start gap-5 max-md:grid-cols-1">
          <ContactForm />
          <ContactSidebar />
        </div>
      </section>

      <footer className="border-t border-[#1e1e24]">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-6 py-6 text-[13px] text-[#3f3f4a] max-md:flex-col max-md:items-start">
          <p>© 2026 CroFlux. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a
              href="mailto:support@croflux.ai?subject=Privacy"
              className="hover:text-[#71717a]"
            >
              Privacy
            </a>
            <a
              href="mailto:support@croflux.ai?subject=Terms"
              className="hover:text-[#71717a]"
            >
              Terms
            </a>
            <Link href="/pricing" className="hover:text-[#71717a]">
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
