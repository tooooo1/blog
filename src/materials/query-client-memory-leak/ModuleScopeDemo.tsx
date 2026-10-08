"use client";

import { useId } from "react";
import { moduleState } from "./logic";
import { Arrow, Box, DemoFigure, Markers, Pill } from "./parts";
import { useAutoplay } from "./useAutoplay";

/*
  모듈 스코프 QueryClient가 브라우저에서는 사용자 한 명의 것이고 서버에서는 프로세스 전체의 것이라는 대비.
  서버에서 요청이 차례로 한 캐시에 쌓이고 비로그인이 남의 항목을 읽는 장면 뒤에,
  요청마다 새로 만드는 수정 후 장면이 이어진다.
  감속 선호에서는 남의 데이터가 읽히는 장면만 정지 상태로 보여준다.
*/

const DELAYS = [1200, 1500, 1500, 3000, 2000, 3000];
const REDUCED_STEP = 3;

const ROW_Y = [205, 255, 305] as const;
const CHIP_W = 112;

interface Props {
  caption?: string;
}

export function ModuleScopeDemo({ caption }: Props) {
  const id = useId();
  const { rootRef, step, cycle } = useAutoplay(DELAYS, REDUCED_STEP);
  const s = moduleState(step);
  const reqShown = [s.reqA, s.reqB, s.reqAnon];
  const reqNames = ["A 요청", "B 요청", "비로그인 요청"];

  return (
    <DemoFigure
      figureRef={rootRef}
      cycle={cycle}
      viewBox="0 0 640 420"
      label="브라우저에서는 탭마다 QueryClient가 따로 있지만, 서버에서는 Node 프로세스 하나의 모듈 스코프 QueryClient를 모든 요청이 같이 써서 비로그인 요청이 다른 사용자의 데이터를 읽고, 요청마다 새로 만들면 요청이 끝날 때 같이 사라지는 과정"
      caption={caption}
    >
      <Markers id={id} />

      {/* 브라우저 */}
      <text x={20} y={24} fontSize="15" fontWeight="700" fill="var(--fg)">
        브라우저
      </text>
      <Box x={20} y={36} w={280} h={84} tone="cell" lines={[]} />
      <Box x={340} y={36} w={280} h={84} tone="cell" lines={[]} />
      {["사용자 A", "사용자 B"].map((name, i) => (
        <g key={name}>
          <text
            x={i === 0 ? 160 : 480}
            y={56}
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill="var(--fg)"
          >
            {name}
          </text>
          <Box
            x={i === 0 ? 40 : 360}
            y={68}
            w={240}
            h={40}
            tone="ok"
            lines={["QueryClient"]}
            bold
          />
        </g>
      ))}

      {/* 서버 */}
      <text x={20} y={152} fontSize="15" fontWeight="700" fill="var(--fg)">
        {s.perRequest
          ? "수정 후 · 요청마다 새 QueryClient"
          : "서버 · Node 프로세스 1개"}
      </text>

      {reqNames.map((name, i) => (
        <Box
          key={name}
          x={20}
          y={(ROW_Y[i] ?? 0) - 17}
          w={CHIP_W}
          h={34}
          rx={17}
          tone="cell"
          lines={[name]}
          bold
          show={reqShown[i] ?? false}
        />
      ))}
      <Arrow d={`M${20 + CHIP_W} 205 H298`} id={id} kind="line" show={s.reqA} />
      <Arrow d={`M${20 + CHIP_W} 255 H298`} id={id} kind="line" show={s.reqB} />
      <Arrow
        d={`M${20 + CHIP_W} 305 H298`}
        id={id}
        kind="line"
        show={s.reqAnon}
      />

      {/* 공유 캐시 */}
      <g className="t-pop" opacity={s.shared ? 1 : 0}>
        <rect
          x={300}
          y={178}
          width={320}
          height={222}
          rx={12}
          fill="var(--surface)"
          stroke="var(--t-line)"
          strokeWidth="2"
        />
        <text
          x={460}
          y={199}
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="var(--fg)"
        >
          QueryClient (모듈 스코프)
        </text>
      </g>
      <Box
        x={316}
        y={216}
        w={288}
        h={32}
        rx={8}
        tone={s.leak ? "warn" : "cell"}
        lines={["A의 주소"]}
        show={s.shared && s.entryA}
      />
      <Box
        x={316}
        y={254}
        w={288}
        h={32}
        rx={8}
        tone="cell"
        lines={["B의 주문"]}
        show={s.shared && s.entryB}
      />
      <text
        className="t-pop"
        x={460}
        y={312}
        textAnchor="middle"
        fontSize="16"
        fill="var(--muted)"
        opacity={s.shared && s.reqAnon ? 0 : s.shared && s.entryB ? 1 : 0}
      >
        ...
      </text>
      <Pill
        cx={460}
        cy={378}
        text="gcTime: Infinity · 지워지지 않음"
        tone="warn"
        fs={13}
        show={s.shared && s.entryB}
      />

      {/* 비로그인이 A의 항목을 읽는다 */}
      <Arrow d="M316 238 H276 V318 H138" id={id} kind="warn" show={s.leak} />
      <Pill
        cx={160}
        cy={350}
        text="다른 사용자 데이터가 그려짐"
        tone="warn"
        show={s.leak}
      />

      {/* 수정 후 */}
      {ROW_Y.map((y) => (
        <g key={y}>
          <Box
            x={300}
            y={y - 17}
            w={140}
            h={34}
            tone="ok"
            lines={["QueryClient"]}
            bold
            show={s.perRequest && !s.gone}
          />
          <Box
            x={300}
            y={y - 17}
            w={140}
            h={34}
            tone="ok"
            lines={[]}
            dashed
            show={s.gone}
          />
        </g>
      ))}
      <Pill
        cx={450}
        cy={350}
        text="요청 끝나면 같이 사라짐"
        tone="ok"
        show={s.gone}
      />
    </DemoFigure>
  );
}
