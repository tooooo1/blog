"use client";

import { useId } from "react";
import { MEMORY_SLOTS, memoryState } from "./logic";
import { Arrow, DemoFigure, FILL, Markers, Pill, STROKE } from "./parts";
import { useAutoplay } from "./useAutoplay";

/*
  process.memoryUsage()의 칸 나누기. 응답 body 버퍼는 V8 힙이 아니라 external에 잡힌다.
  장면 1은 에러 응답의 버퍼가 external에 쌓이는 모습, 장면 2는 cancel로 비우는 모습이다.
  감속 선호에서는 쌓인 채 남은 장면만 정지 상태로 보여준다.
*/

const DELAYS = [1100, 1400, 2600, 2800];
const REDUCED_STEP = 2;

interface Props {
  caption?: string;
}

export function ProcessMemoryDemo({ caption }: Props) {
  const id = useId();
  const { rootRef, step, cycle } = useAutoplay(DELAYS, REDUCED_STEP);
  const { buffers, tone } = memoryState(step);

  return (
    <DemoFigure
      figureRef={rootRef}
      cycle={cycle}
      viewBox="0 0 640 330"
      label="RSS 안에 V8 힙의 heapUsed와 힙 밖의 external이 있고, 응답 body 버퍼는 external에 쌓이다가 cancel로 비워지는 과정"
      caption={caption}
    >
      <Markers id={id} />
      <Pill cx={555} cy={24} text="응답 body 버퍼" tone="cell" />
      <rect
        x={20}
        y={60}
        width={600}
        height={250}
        rx={16}
        fill="none"
        stroke="var(--t-line)"
        strokeWidth="2"
      />
      <text x={36} y={84} fontSize="15" fontWeight="700" fill="var(--fg)">
        RSS (프로세스 전체)
      </text>
      <rect x={36} y={104} width={300} height={146} rx={10} fill={FILL.cell} />
      <text
        x={186}
        y={126}
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="var(--fg)"
      >
        heapUsed · JS 객체 (V8 힙)
      </text>
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          cx={68 + i * 56}
          cy={176}
          r={12}
          fill="var(--surface)"
        />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={96 + i * 56}
          cy={214}
          r={12}
          fill="var(--surface)"
        />
      ))}
      <rect
        className="t-pop"
        x={350}
        y={104}
        width={254}
        height={146}
        rx={10}
        fill={FILL[tone]}
      />
      <text
        x={477}
        y={126}
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="var(--fg)"
      >
        external · Buffer 등 힙 밖
      </text>
      {Array.from({ length: MEMORY_SLOTS }, (_, i) => (
        <rect
          key={i}
          className="t-pop"
          x={364 + (i % 4) * 58}
          y={146 + Math.floor(i / 4) * 40}
          width={50}
          height={30}
          rx={5}
          fill={tone === "warn" ? FILL.warn : FILL.cell}
          stroke={tone === "warn" ? STROKE.warn : STROKE.line}
          strokeWidth="1.5"
          opacity={i < buffers ? 1 : 0}
        />
      ))}
      <Arrow d="M555 42 V102" id={id} kind="line" />
      <text x={543} y={84} textAnchor="end" fontSize="13" fill="var(--muted)">
        힙 밖에 잡힘
      </text>
      <Pill
        cx={477}
        cy={282}
        text="clone 누수는 여기로"
        tone="warn"
        show={step === 2}
      />
      <Pill
        cx={477}
        cy={282}
        text="cancel()로 비움"
        tone="ok"
        show={step === 3}
      />{" "}
    </DemoFigure>
  );
}
