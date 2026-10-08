"use client";

import { useId } from "react";
import { CLONE_CHUNKS, cloneState } from "./logic";
import { Arrow, Box, DemoFigure, Markers, Pill, type Tone } from "./parts";
import { useAutoplay } from "./useAutoplay";

/*
  res.clone()이 body 스트림을 두 갈래로 나누는 모습. 한쪽만 읽으면 다른 쪽 버퍼가 남는다.
  장면 3개(성공 · 에러 수정 전 · 에러 수정 후)를 각각 "갈라짐 → 결과" 두 단계로 보여준다.
  재생 버튼은 없다. 화면에 들어오면 시작하고 끝나면 쉬었다 반복한다.
  감속 선호에서는 가장 많은 걸 말하는 장면(에러 수정 전의 결과)만 정지 상태로 보여준다.
*/

const DELAYS = [1400, 1900, 1400, 2400, 1400, 2400];
const REDUCED_STEP = 3;

const TITLES = ["성공 응답", "에러 응답 (수정 전)", "에러 응답 (수정 후)"];
const TITLE_TONES: Tone[] = ["cell", "warn", "ok"];

interface Props {
  caption?: string;
}

export function CloneTeeDemo({ caption }: Props) {
  const id = useId();
  const { rootRef, step, cycle } = useAutoplay(DELAYS, REDUCED_STEP);
  const { scene, phase, held, outcome } = cloneState(step);
  const done = phase === 1;

  const chunkTone: Tone = outcome === "held" ? "warn" : "cell";

  return (
    <DemoFigure
      figureRef={rootRef}
      cycle={cycle}
      viewBox="0 0 640 330"
      label="응답 body를 clone하면 스트림이 두 갈래로 나뉘고, 에러 응답에서 원본을 읽지 않으면 버퍼가 남지만 cancel을 부르면 바로 비는 과정"
      caption={caption}
    >
      <Markers id={id} />
      <Pill
        cx={320}
        cy={24}
        text={TITLES[scene] ?? ""}
        tone={TITLE_TONES[scene] ?? "cell"}
        fs={15}
      />

      <Box
        x={20}
        y={120}
        w={100}
        h={80}
        tone="cell"
        lines={["응답 body"]}
        bold
      />

      {/* 두 갈래 */}
      <Arrow d="M120 150 H155 V95 H446" id={id} kind="line" />
      <Arrow d="M120 170 H155 V235 H290" id={id} kind="line" />

      {/* 위: clone().json()이 끝까지 읽는다. 청크는 흘러나가 사라진다 */}
      <g
        className="t-move"
        style={{
          transform: `translateX(${done ? 130 : 0}px)`,
          opacity: done ? 0 : 1,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={190 + i * 34}
            y={86}
            width={18}
            height={18}
            rx={4}
            fill="var(--t-cell)"
            stroke="var(--t-line)"
            strokeWidth="1.5"
          />
        ))}
      </g>
      <Box
        x={450}
        y={64}
        w={170}
        h={62}
        tone={done ? "ok" : "cell"}
        lines={done ? ["clone().json()", "다 읽음"] : ["clone().json()"]}
        bold
      />

      {/* 아래: 원본 버퍼 */}
      <text
        x={370}
        y={206}
        textAnchor="middle"
        fontSize="13"
        fill="var(--muted)"
      >
        원본 버퍼
      </text>
      <rect
        x={295}
        y={215}
        width={150}
        height={40}
        rx={8}
        fill="none"
        stroke={outcome === "held" ? "var(--t-warn-text)" : "var(--t-line)"}
        strokeWidth="1.5"
      />
      {Array.from({ length: CLONE_CHUNKS }, (_, i) => (
        <g key={i}>
          <rect
            x={303 + i * 35}
            y={223}
            width={28}
            height={24}
            rx={4}
            fill="none"
            stroke="var(--border-strong)"
            strokeDasharray="3 3"
          />
          <rect
            className="t-pop"
            x={303 + i * 35}
            y={223}
            width={28}
            height={24}
            rx={4}
            fill={chunkTone === "warn" ? "var(--t-warn-soft)" : "var(--t-cell)"}
            stroke={
              chunkTone === "warn" ? "var(--t-warn-text)" : "var(--t-line)"
            }
            strokeWidth="1.5"
            opacity={i < held ? 1 : 0}
          />
        </g>
      ))}

      {/* 원본을 읽는 쪽 */}
      <Arrow d="M445 235 H466" id={id} kind="ok" show={scene === 0 && done} />
      <Box
        x={470}
        y={210}
        w={150}
        h={50}
        tone={
          scene === 0
            ? done
              ? "ok"
              : "cell"
            : outcome === "cancelled"
              ? "ok"
              : "warn"
        }
        dashed={scene !== 0 && outcome !== "cancelled"}
        lines={[
          scene === 0
            ? "API 클라이언트"
            : outcome === "cancelled"
              ? "body.cancel()"
              : outcome === "held"
                ? "읽는 코드 없음"
                : "throw로 종료",
        ]}
        bold
      />

      {/* 판정 */}
      <Pill
        cx={545}
        cy={282}
        text="아무도 안 읽음"
        tone="warn"
        show={outcome === "held"}
      />
      <Pill
        cx={320}
        cy={310}
        text="둘 다 읽음 · 버퍼 비움"
        tone="ok"
        show={outcome === "drained"}
      />
      <Pill
        cx={320}
        cy={310}
        text="GC가 치울 때까지 남음"
        tone="warn"
        show={outcome === "held"}
      />
      <Pill
        cx={320}
        cy={310}
        text="cancel()로 즉시 해제"
        tone="ok"
        show={outcome === "cancelled"}
      />
    </DemoFigure>
  );
}
