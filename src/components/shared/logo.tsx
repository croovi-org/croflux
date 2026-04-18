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
        className={markClassName}
        aria-hidden="true"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "40px",
          width: "84px",
          flexShrink: 0,
        }}
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
