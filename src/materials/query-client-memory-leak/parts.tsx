import type { ReactNode, RefObject } from "react";
import { textWidth } from "./logic";
import "./heap.css";

/* 데모 6개가 같이 쓰는 도형. 색은 heap.css 토큰만 쓴다. */

export type Tone = "cell" | "ok" | "warn";

export const FILL: Record<Tone, string> = {
  cell: "var(--t-cell)",
  ok: "var(--t-ok-soft)",
  warn: "var(--t-warn-soft)",
};
export const TEXT: Record<Tone, string> = {
  cell: "var(--fg)",
  ok: "var(--t-ok-text)",
  warn: "var(--t-warn-text)",
};
export const EDGE: Record<Tone, string> = {
  cell: "var(--t-line)",
  ok: "var(--t-ok-text)",
  warn: "var(--t-warn-text)",
};

interface FigureProps {
  figureRef: RefObject<HTMLElement | null>;
  viewBox: string;
  label: string;
  caption?: string;
  /** useAutoplay의 cycle. 바뀌면 그림을 새로 마운트한다 */
  cycle?: number;
  children: ReactNode;
}

export function DemoFigure({
  figureRef,
  viewBox,
  cycle = 0,
  label,
  caption,
  children,
}: FigureProps) {
  return (
    <figure ref={figureRef} className="m-heap my-8">
      <div className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] overflow-hidden">
        <svg
          viewBox={viewBox}
          className="block w-full h-auto"
          role="img"
          aria-label={label}
        >
          <g key={cycle}>{children}</g>
        </svg>
      </div>
      {caption && (
        <figcaption className="mt-2 text-[13px] text-[color:var(--muted)] text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** 화살촉 3색. 같은 id 접두사로 mark()를 부른다 */
export function Markers({ id }: { id: string }) {
  const kinds = [
    ["line", "var(--t-line)"],
    ["ok", "var(--t-ok-text)"],
    ["warn", "var(--t-warn-text)"],
  ] as const;
  return (
    <defs>
      {kinds.map(([kind, color]) => (
        <marker
          key={kind}
          id={`${id}-${kind}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill={color} />
        </marker>
      ))}
    </defs>
  );
}

export const mark = (id: string, kind: "line" | "ok" | "warn") =>
  `url(#${id}-${kind})`;

export const STROKE = {
  line: "var(--t-line)",
  ok: "var(--t-ok-text)",
  warn: "var(--t-warn-text)",
} as const;

interface ArrowProps {
  d: string;
  id: string;
  kind: "line" | "ok" | "warn";
  show?: boolean;
  dashed?: boolean;
}

export function Arrow({ d, id, kind, show = true, dashed }: ArrowProps) {
  return (
    <path
      className="t-pop"
      d={d}
      fill="none"
      stroke={STROKE[kind]}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? "6 5" : undefined}
      markerEnd={mark(id, kind)}
      opacity={show ? 1 : 0}
    />
  );
}

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: Tone;
  lines: string[];
  fs?: number;
  rx?: number;
  bold?: boolean;
  dashed?: boolean;
  show?: boolean;
}

export function Box({
  x,
  y,
  w,
  h,
  tone,
  lines,
  fs = 14,
  rx = 12,
  bold,
  dashed,
  show = true,
}: BoxProps) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const lh = fs + 4;
  return (
    <g className="t-pop" opacity={show ? 1 : 0}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        fill={dashed ? "none" : FILL[tone]}
        stroke={dashed ? EDGE[tone] : "none"}
        strokeWidth="1.5"
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={cx}
          y={cy + (i - (lines.length - 1) / 2) * lh}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fs}
          fontWeight={bold ? 700 : 600}
          fill={TEXT[tone]}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

interface PillProps {
  cx: number;
  cy: number;
  text: string;
  tone: Tone;
  fs?: number;
  show?: boolean;
}

/** 글자 폭에 맞춘 알약 라벨. 판정은 이 라벨이 말한다 */
export function Pill({ cx, cy, text, tone, fs = 14, show = true }: PillProps) {
  const w = textWidth(text, fs) + 24;
  const h = fs + 14;
  return (
    <Box
      x={cx - w / 2}
      y={cy - h / 2}
      w={w}
      h={h}
      rx={h / 2}
      tone={tone}
      lines={[text]}
      fs={fs}
      bold
      show={show}
    />
  );
}
