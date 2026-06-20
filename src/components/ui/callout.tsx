import type { ReactNode } from "react";

type CalloutType = "aha" | "info" | "warning" | "tip";

interface CalloutProps {
  type?: CalloutType;
  children: ReactNode;
}

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
      className="my-6 rounded-2xl p-5 bg-[color:var(--code-bg)] border-l-2 border-[color:var(--muted)]"
      role="note"
      aria-label={calloutLabels[type]}
    >
      <div className="flex gap-3 items-start">
        <span className="text-lg flex-shrink-0" aria-hidden="true">
          {calloutIcons[type]}
        </span>
        <div className="flex-1 text-[color:var(--fg)] leading-7 text-[15px]">
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
