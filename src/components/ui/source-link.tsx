import type { ReactNode } from "react";

interface SourceLinkProps {
  href: string;
  children: ReactNode;
}

export function SourceLink({ href, children }: SourceLinkProps) {
  return (
    <div className="my-6 text-sm text-gray-500 dark:text-gray-500 italic">
      <span className="font-medium not-italic">출처: </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
        aria-label={`출처 링크: ${children}`}
      >
        {children}
      </a>
    </div>
  );
}
