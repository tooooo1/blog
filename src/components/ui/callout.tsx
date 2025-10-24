import type { ReactNode } from "react";

type CalloutType = "aha" | "info" | "warning" | "tip";

interface CalloutProps {
  type?: CalloutType;
  children: ReactNode;
}

const calloutStyles: Record<CalloutType, string> = {
  aha: "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50",
  info: "bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-600/50",
  warning: "bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/50",
  tip: "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50",
};

const calloutIcons: Record<CalloutType, string> = {
  aha: "💡",
  info: "ℹ️",
  warning: "⚠️",
  tip: "✨",
};

const calloutLabels: Record<CalloutType, string> = {
  aha: "아하",
  info: "정보",
  warning: "주의",
  tip: "팁",
};

export function Callout({ type = "info", children }: CalloutProps) {
  return (
    <div
      className={`my-8 rounded-xl p-6 ${calloutStyles[type]}`}
      role="note"
      aria-label={calloutLabels[type]}
    >
      <div className="flex gap-4">
        <span className="text-xl flex-shrink-0 mt-1" aria-hidden="true">
          {calloutIcons[type]}
        </span>
        <div className="flex-1 text-gray-700 dark:text-gray-200 leading-relaxed text-base">
          {children}
        </div>
      </div>
    </div>
  );
}

export function AhaPoint({ children }: { children: ReactNode }) {
  return <Callout type="aha">{children}</Callout>;
}

export function InfoBox({ children }: { children: ReactNode }) {
  return <Callout type="info">{children}</Callout>;
}

export function Warning({ children }: { children: ReactNode }) {
  return <Callout type="warning">{children}</Callout>;
}

export function Tip({ children }: { children: ReactNode }) {
  return <Callout type="tip">{children}</Callout>;
}
