import type { DetailedHTMLProps, HTMLAttributes } from "react";

export function H3({
  id,
  children,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return (
    <h3
      id={id}
      className={`text-2xl font-bold mb-4 mt-12 text-[color:var(--fg)] leading-tight scroll-mt-20${id ? " group relative" : ""}`}
      {...props}
    >
      {id && (
        <a
          href={`#${id}`}
          aria-label="이 섹션 링크"
          className="absolute -left-5 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-[color:var(--muted)]"
        >
          #
        </a>
      )}
      {children}
    </h3>
  );
}
