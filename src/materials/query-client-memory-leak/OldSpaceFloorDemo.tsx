"use client";

import { makeSawtooth, textWidth, type Sawtooth } from "./logic";
import { DemoFigure, Pill, STROKE } from "./parts";
import { useAutoplay } from "./useAutoplay";

/*
  old space 톱니의 바닥. 정상은 major GC 뒤 바닥이 평평하고, 누수는 바닥이 오른다.
  선은 단계마다 왼쪽에서 오른쪽으로 그려진다. 보는 곳은 꼭대기가 아니라 떨어진 바닥이다.
  감속 선호에서는 다 그려진 마지막 장면만 정지 상태로 보여준다.
*/

const DELAYS = [700, 2100, 2500, 2100, 4200];
const REDUCED_STEP = 4;

const NORMAL = makeSawtooth("normal");
const LEAK = makeSawtooth("leak");

const X0 = 30;
const W = 580;
const H = 116;

interface ChartProps {
  data: Sawtooth;
  top: number;
  tone: "ok" | "warn";
  drawn: boolean;
  judged: boolean;
  gcLabel?: boolean;
}

function Chart({ data, top, tone, drawn, judged, gcLabel }: ChartProps) {
  const bottom = top + H;
  const px = (x: number) => X0 + x * W;
  const py = (v: number) => bottom - v * H;
  const d = data.points
    .map((p, i) => `${i === 0 ? "M" : "L"}${px(p.x)} ${py(p.v)}`)
    .join(" ");
  const first = data.troughs[0];
  const last = data.troughs[data.troughs.length - 1];
  // major GC 직후의 바닥 점. 시작점은 GC가 아니라서 뺀다
  const drops = data.troughs.slice(1);
  const labelDrop = drops[2];
  const color = STROKE[tone];

  return (
    <g>
      <line
        x1={X0}
        y1={bottom}
        x2={X0 + W}
        y2={bottom}
        stroke="var(--border-strong)"
      />
      <path
        className="t-series"
        d={d}
        pathLength={1}
        fill="none"
        stroke={STROKE.line}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={1}
        strokeDashoffset={drawn ? 0 : 1}
      />
      <g className="t-pop" opacity={judged ? 1 : 0}>
        {first && last && (
          <line
            x1={px(first.x)}
            y1={py(first.v)}
            x2={px(last.x)}
            y2={py(last.v)}
            stroke={color}
            strokeWidth="2.5"
            strokeDasharray="7 6"
          />
        )}
        {drops.map((t) => (
          <circle key={t.x} cx={px(t.x)} cy={py(t.v)} r={4.5} fill={color} />
        ))}
        {gcLabel && labelDrop && (
          <text
            x={px(labelDrop.x)}
            y={bottom - 8}
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill="var(--fg)"
          >
            major GC
          </text>
        )}
      </g>
    </g>
  );
}

interface Props {
  caption?: string;
}

export function OldSpaceFloorDemo({ caption }: Props) {
  const { rootRef, step, cycle } = useAutoplay(DELAYS, REDUCED_STEP);

  const leftPill = (text: string) => 20 + (textWidth(text, 14) + 24) / 2;
  const rightPill = (text: string) => 620 - (textWidth(text, 14) + 24) / 2;
  const okText = "바닥 평평 · 회수됨";
  const warnText = "major GC 뒤 바닥이 오름 · 참조가 남은 객체";

  return (
    <DemoFigure
      figureRef={rootRef}
      cycle={cycle}
      viewBox="0 0 640 380"
      label="old space 사용량의 톱니. 회수되는 힙은 major GC 뒤 바닥이 평평하고, 남는 객체가 느는 힙은 major GC 뒤 바닥이 계속 오른다"
      caption={caption}
    >
      <Pill
        cx={leftPill("회수되는 힙")}
        cy={22}
        text="회수되는 힙"
        tone="cell"
      />
      <Pill
        cx={rightPill(okText)}
        cy={22}
        text={okText}
        tone="ok"
        show={step >= 2}
      />
      <Chart
        data={NORMAL}
        top={44}
        tone="ok"
        drawn={step >= 1}
        judged={step >= 2}
        gcLabel
      />

      <Pill
        cx={leftPill("남는 객체가 느는 힙")}
        cy={212}
        text="남는 객체가 느는 힙"
        tone="cell"
      />
      <Pill
        cx={rightPill(warnText)}
        cy={212}
        text={warnText}
        tone="warn"
        fs={13}
        show={step >= 4}
      />
      <Chart
        data={LEAK}
        top={236}
        tone="warn"
        drawn={step >= 3}
        judged={step >= 4}
      />
    </DemoFigure>
  );
}
