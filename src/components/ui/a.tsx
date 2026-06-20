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
    </a>
  );
};
