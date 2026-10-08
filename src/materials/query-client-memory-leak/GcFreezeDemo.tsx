"use client";

import { useId } from "react";
import {
  GC_BLOCK,
  GC_PROBES,
  GC_RESTART_X,
  TICKS_AFTER,
  TICKS_BEFORE,
  gcState,
} from "./logic";
import { Arrow, Box, DemoFigure, Markers, Pill, STROKE } from "./parts";
import { useAutoplay } from "./useAutoplay";

/*
  강제 전체 GC 한 번이 liveness probe를 어떻게 죽이는지 시간축으로 보여준다.
  마지막 장면은 재시작 뒤에 읽은 값이 다른 프로세스의 것이라는 점이다.
  감속 선호에서는 마지막 장면만 정지 상태로 보여준다.
*/

const DELAYS = [1500, 1500, 1800, 1900, 4200];
const REDUCED_STEP = 4;

interface Props {
  caption?: string;
}

export function GcFreezeDemo({ caption }: Props) {
  const id = useId();
  const { rootRef, step, cycle } = useAutoplay(DELAYS, REDUCED_STEP);
  const s = gcState(step);

  return (
    <DemoFigure
      figureRef={rootRef}
      cycle={cycle}
      viewBox="0 0 640 345"
      label="강제 전체 GC로 이벤트 루프가 멈추는 동안 liveness probe가 응답을 못 받아 컨테이너가 재시작되고, 다시 읽은 메모리 값은 새 프로세스의 것이라는 시간축"
      caption={caption}
    >
      <Markers id={id} />

      <text x={20} y={28} fontSize="13" fill="var(--muted)">
        이벤트 루프
      </text>
      {TICKS_BEFORE.map((x) => (
        <line
          key={x}
          x1={x}
          y1={44}
          x2={x}
          y2={66}
          stroke={STROKE.line}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
      <g className="t-pop" opacity={s.restarted ? 1 : 0}>
        {TICKS_AFTER.map((x) => (
          <line
            key={x}
            x1={x}
            y1={44}
            x2={x}
            y2={66}
            stroke={STROKE.line}
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
      </g>
      <Box
        x={GC_BLOCK.from}
        y={40}
        w={GC_BLOCK.to - GC_BLOCK.from}
        h={32}
        rx={8}
        tone="warn"
        lines={["강제 전체 GC · 실행 멈춤"]}
        fs={13}
        bold
        show={s.block}
      />

      <text x={20} y={102} fontSize="13" fill="var(--muted)">
        liveness probe
      </text>
      {GC_PROBES.map((p) => {
        const red = p.frozen;
        const show = !red || s.frozenProbes;
        return (
          <g key={p.x} className="t-pop" opacity={show ? 1 : 0}>
            <circle
              cx={p.x}
              cy={128}
              r={9}
              fill={red ? STROKE.warn : STROKE.ok}
            />
            <text
              x={p.x}
              y={152}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill={red ? "var(--t-warn-text)" : "var(--t-ok-text)"}
            >
              {red ? "응답 없음" : "200"}
            </text>
          </g>
        );
      })}

      <path
        className="t-pop"
        d={`M${GC_RESTART_X} 76 V156`}
        stroke={STROKE.warn}
        strokeWidth="2.5"
        strokeDasharray="6 5"
        fill="none"
        opacity={s.restarted ? 1 : 0}
      />
      <Pill
        cx={GC_RESTART_X}
        cy={172}
        text="컨테이너 재시작"
        tone="warn"
        show={s.restarted}
      />

      <text x={20} y={186} fontSize="13" fill="var(--muted)">
        프로세스
      </text>
      <Box
        x={30}
        y={194}
        w={420}
        h={40}
        tone="cell"
        lines={["이전 프로세스"]}
        bold
      />
      <Box
        x={460}
        y={194}
        w={160}
        h={40}
        tone="ok"
        lines={["새 프로세스", "막 뜬 상태"]}
        fs={13}
        bold
        show={s.restarted}
      />

      <Arrow d="M190 258 V238" id={id} kind="line" show={s.readings} />
      <Pill
        cx={190}
        cy={272}
        text="이전 프로세스 RSS 688MiB"
        tone="cell"
        show={s.readings}
      />
      <Arrow d="M540 258 V238" id={id} kind="warn" show={s.readings} />
      <Pill
        cx={490}
        cy={272}
        text="다시 읽은 값 228MiB · 재시작 뒤"
        tone="warn"
        show={s.readings}
      />
      <Pill
        cx={320}
        cy={322}
        text="uptime을 같이 찍었다면 바로 보인다"
        tone="ok"
        fs={13}
        show={s.readings}
      />
    </DemoFigure>
  );
}
