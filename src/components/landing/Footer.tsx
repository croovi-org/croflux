import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const columns = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#how-it-works", label: "How it works" },
      { href: "#pricing", label: "Pricing" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/signup", label: "Builder access" },
      { href: "/login", label: "Log in" },
      { href: "#pricing", label: "Plans" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/", label: "About" },
      { href: "/", label: "Roadmap" },
      { href: "/", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/", label: "Privacy" },
      { href: "/", label: "Terms" },
      { href: "/", label: "Security" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg2)] px-5 py-12 md:px-10">
      <div className="mx-auto max-w-[1140px]">
        <div className="grid gap-10 md:grid-cols-[240px_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[220px] text-[13px] leading-6 text-[var(--text3)]">
              Premium startup execution for indie hackers and solo founders.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text3)]">
                  {column.title}
                </p>
                <div className="space-y-3">
                  {column.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="block text-[13px] text-[var(--text3)] hover:text-[var(--text)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[var(--border)] pt-6 text-[12px] text-[var(--text4)] md:flex-row md:items-center md:justify-between">
          <p>© 2026 CroFlux. Built for builders who ship.</p>
          <div className="flex gap-5">
            <Link href="/" className="hover:text-[var(--text)]">
              X
            </Link>
            <Link href="/" className="hover:text-[var(--text)]">
              GitHub
            </Link>
            <Link href="/" className="hover:text-[var(--text)]">
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
