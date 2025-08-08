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
    "underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500 dark:decoration-gray-600 dark:hover:decoration-gray-400";

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
