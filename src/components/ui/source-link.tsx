import type { ReactNode } from "react";

interface SourceLinkProps {
  href: string;
  children: ReactNode;
}

export function SourceLink({ href, children }: SourceLinkProps) {
  return (
    <div className="my-6 text-sm text-[color:var(--muted)] italic">
      <span className="font-medium not-italic">출처: </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[color:var(--link)] underline underline-offset-2 transition-colors"
        aria-label={`출처 링크: ${children}`}
      >
        {children}
      </a>
    </div>
  );
}
