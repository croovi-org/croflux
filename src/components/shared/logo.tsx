import Link from "next/link";

type LogoProps = {
  href?: string;
  className?: string;
  textClassName?: string;
  markClassName?: string;
};

export function Logo({
  href = "/",
  className = "",
  textClassName = "",
  markClassName = "",
}: LogoProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-[var(--text)] ${className}`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-[6px] bg-[var(--purple)] ${markClassName}`}
      >
        <svg viewBox="0 0 14 14" className="h-[13px] w-[13px]" fill="none">
          <path
            d="M2 12L7 2L12 12"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.5 9H10.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className={textClassName}>CroFlux</span>
    </Link>
  );
}
