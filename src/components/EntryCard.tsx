import Link from "next/link";
import type { ReactNode } from "react";

interface EntryCardProps {
  href: string;
  title: string;
  description?: string;
  meta?: ReactNode;
}

export function EntryCard({ href, title, description, meta }: EntryCardProps) {
  return (
    <Link
      href={href}
      transitionTypes={["nav-forward"]}
      className="group block -mx-3 px-3 py-5 rounded-lg transition-colors duration-200 hover:bg-[color:var(--hover-bg)]"
    >
      <article>
        <h2 className="text-lg font-medium mb-1.5">
          {title}
          <span
            aria-hidden="true"
            className="inline-block ml-1.5 text-[color:var(--muted)] opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          >
            →
          </span>
        </h2>
        {description && (
          <p className="text-[color:var(--muted)] text-sm mb-3">
            {description}
          </p>
        )}
        {meta && (
          <div className="flex items-center gap-3 text-xs text-[color:var(--muted)]">
            {meta}
          </div>
        )}
      </article>
    </Link>
  );
}
