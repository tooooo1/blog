import type { ReactNode } from "react";

interface TimelineItemProps {
  time: string;
  children: ReactNode;
}

export function TimelineItem({ time, children }: TimelineItemProps) {
  return (
    <div className="flex gap-6 my-4">
      <div className="font-mono text-sm font-medium text-gray-500 dark:text-gray-500 min-w-[140px] flex-shrink-0">
        {time}
      </div>
      <div className="flex-1 text-gray-800 dark:text-gray-200 leading-7">
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
      className="my-8 rounded-xl bg-gray-50 dark:bg-gray-900/40 p-6"
      role="list"
      aria-label="타임라인"
    >
      {children}
    </div>
  );
}
