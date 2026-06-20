import type { ReactNode } from "react";

interface TimelineItemProps {
  time: string;
  children: ReactNode;
}

export function TimelineItem({ time, children }: TimelineItemProps) {
  return (
    <div className="flex gap-6 my-4">
      <div className="font-mono text-sm font-medium text-[color:var(--muted)] min-w-[140px] flex-shrink-0">
        {time}
      </div>
      <div className="flex-1 text-[color:var(--fg)] leading-7">
        {children}
      </div>
    </div>
  );
}

interface TimelineProps {
  children: ReactNode;
}

export function Timeline({ children }: TimelineProps) {
  return (
    <div
      className="my-8 rounded-xl bg-[color:var(--code-bg)] border border-[color:var(--border)] p-6"
      role="list"
      aria-label="타임라인"
    >
      {children}
    </div>
  );
}
