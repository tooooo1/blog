"use client";

import { REPRO_BARS, REPRO_HEAP_MIB, barLength } from "./logic";
import { DemoFigure, Pill, STROKE, TEXT, type Tone } from "./parts";
import { useAutoplay } from "./useAutoplay";

/*
  운영과 같은 Node 버전에서 8KB 에러 응답 2만 건을 흘린 로컬 재현의 RSS 증가량.
  화면에 들어오면 막대가 자라고, 쉬었다가 다시 자란다.
  감속 선호에서는 다 자란 상태만 보여준다.
*/

const DELAYS = [700, 4200];
const REDUCED_STEP = 1;
const FULL = 440;

const BAR_COLOR: Record<Tone, string> = {
  warn: STROKE.warn,
  cell: STROKE.line,
  ok: STROKE.ok,
};

interface Props {
  caption?: string;
}

export function ReproBarsDemo({ caption }: Props) {
  const { rootRef, step, cycle } = useAutoplay(DELAYS, REDUCED_STEP);
  const grown = step >= 1;

  return (
    <DemoFigure
      figureRef={rootRef}
      cycle={cycle}
      viewBox="0 0 640 268"
      label="8KB 에러 응답 2만 건의 RSS 증가량. 원본을 읽지 않으면 93MiB, clone 없이는 7MiB, cancel을 부르면 2MiB이고 강제 GC 뒤 heapUsed는 셋 다 7.5MiB"
      caption={caption}
    >
      <text x={20} y={26} fontSize="15" fontWeight="700" fill="var(--fg)">
        RSS 증가량 · 에러 응답 8KB × 2만 건
      </text>
      {REPRO_BARS.map((bar, i) => {
        const y = 48 + i * 62;
        const len = barLength(bar.mib, FULL);
        return (
          <g key={bar.key}>
            <text
              x={20}
              y={y + 14}
              fontSize="14"
              fontWeight="600"
              fill="var(--fg)"
            >
              {bar.label}
            </text>
            <rect
              className="t-grow"
              x={20}
              y={y + 24}
              width={len}
              height={26}
              rx={6}
              fill={BAR_COLOR[bar.tone]}
              style={{
                transform: `scaleX(${grown ? 1 : 0})`,
                transitionDelay: grown ? `${i * 250}ms` : "0ms",
              }}
            />
            <text
              className="t-pop"
              x={20 + len + 10}
              y={y + 38}
              dominantBaseline="central"
              fontSize="16"
              fontWeight="700"
              fill={bar.tone === "cell" ? "var(--fg)" : TEXT[bar.tone]}
              opacity={grown ? 1 : 0}
              style={{ transitionDelay: grown ? `${600 + i * 250}ms` : "0ms" }}
            >
              {bar.mib} MiB
            </text>
          </g>
        );
      })}
      <Pill
        cx={320}
        cy={246}
        text={`강제 GC 뒤 heapUsed는 셋 다 ${REPRO_HEAP_MIB}MiB`}
        tone="cell"
        show={grown}
      />
    </DemoFigure>
  );
}
