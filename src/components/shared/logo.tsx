import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  href?: string;
  className?: string;
  markClassName?: string;
  showText?: boolean;
};

export function Logo({
  href = "/",
  className = "",
  markClassName = "",
  showText = true,
}: LogoProps) {
  return (
    <Link
      href={href}
      className={`logo-lockup ${className}`}
    >
      <span
        className={`relative flex h-10 w-[84px] items-center justify-center ${markClassName}`}
        aria-hidden="true"
      >
        <Image
          src="/croflux-mark.png"
          alt=""
          fill
          sizes="120px"
          className="object-contain"
        />
      </span>
      {showText ? (
        <span className="logo-wordmark">
          <span className="logo-wordmark-cro">Cro</span>
          <span className="logo-wordmark-flux">Flux</span>
        </span>
      ) : null}
    </Link>
  );
}
