import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  href?: string;
  className?: string;
  textClassName?: string;
  markClassName?: string;
  showText?: boolean;
};

export function Logo({
  href = "/",
  className = "",
  textClassName = "",
  markClassName = "",
  showText = true,
}: LogoProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-[var(--text)] ${className}`}
    >
      <span
        className={`relative flex h-9 w-9 items-center justify-center ${markClassName}`}
        aria-hidden="true"
      >
        <Image
          src="/croflux-logo.png"
          alt=""
          fill
          sizes="36px"
          className="object-contain"
        />
      </span>
      {showText ? <span className={textClassName}>CroFlux</span> : null}
    </Link>
  );
}
