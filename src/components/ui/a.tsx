import Link from "next/link";
import type { AnchorHTMLAttributes, DetailedHTMLProps } from "react";

export const Anchor = (
  props: DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
) => {
  const { href, children, className = "", ...rest } = props;

  const base =
    "text-[color:var(--link)] underline underline-offset-2 hover:opacity-80 transition-colors";

  if (!href) return <span className={base}>{children}</span>;

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={`${base} ${className}`} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${className}`}
      {...rest}
    >
      {children}
      <svg
        width={12}
        height={12}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="inline-block ml-0.5 align-baseline opacity-60"
      >
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    </a>
  );
};
