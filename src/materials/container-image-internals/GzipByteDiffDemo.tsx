"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useCanvasTokens, setupCanvas, useContainerWidth } from "../canvas";
import { STREAMS, LABELS, GZIP_HEADER_BYTES, decode } from "./gzipStreams";
import "./parcel.css";

/* 격자 치수: 셀 6px + 간격 1px = 피치 7px. 열 수는 컨테이너 폭이 정한다.
   모바일에서는 열이 줄고 행이 늘어나는 리플로우라 가로 스크롤이 없다.

   캔버스 높이는 최장 스트림(1,404B) 기준으로 고정한다. 현재 스트림 기준으로 잡으면
   621B ↔ 1404B 전환에서 높이가 2배로 뛰면서 아래 본문이 밀려 내려간다.
   기본 선택(621B)에서 아래쪽이 비지만 빈 면이 레이아웃 시프트보다 낫다는 판단이다. */
const CELL = 6;
const PITCH = 7;
const MIN_COLS = 24;
const MAX_BYTES = Math.max(...STREAMS.map((s) => s.bytes));

/* 바닥은 --surface다. 마지막 행의 부분 채움에서 남는 영역을 --bg로 칠하면
   패널 위에 흰 사각으로 뜬다. */
const TOKENS = ["--surface", "--fg", "--border", "--m-cell", "--m-accent"] as const;

const BASELINE_LEVEL = 9;

interface Props {
  caption?: string;
}

export function GzipByteDiffDemo({ caption }: Props) {
  const [level, setLevel] = useState(6);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const tokens = useCanvasTokens(canvasRef, TOKENS);
  const boxWidth = useContainerWidth(boxRef);
  const groupName = useId();

  const baseline = useMemo(
    () => decode(STREAMS.find((s) => s.level === BASELINE_LEVEL)!.b64),
    []
  );
  const stream = STREAMS.find((s) => s.level === level)!;
  const bytes = useMemo(() => decode(stream.b64), [stream.b64]);

  const cols = Math.max(MIN_COLS, Math.floor((boxWidth + 1) / PITCH));
  const rows = Math.ceil(MAX_BYTES / cols);
  const width = cols * PITCH - 1;
  const height = rows * PITCH - 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !tokens || boxWidth === 0) return;

    const drawUpTo = (count: number) => {
      const ctx = setupCanvas(canvas, width, height);
      if (!ctx) return;
      ctx.fillStyle = tokens["--surface"];
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < count; i++) {
        const x = (i % cols) * PITCH;
        const y = Math.floor(i / cols) * PITCH;

        const differs = i >= baseline.length || bytes[i] !== baseline[i];
        if (differs) {
          // 색 단독으로 정보를 싣지 않는다 — 빨강 fill(색) + 뚫린 중심(모양) 두 채널.
          ctx.fillStyle = tokens["--m-accent"];
          ctx.fillRect(x, y, CELL, CELL);
          ctx.fillStyle = tokens["--surface"];
          ctx.fillRect(x + 2, y + 2, CELL - 4, CELL - 4);
        } else {
          // 정보 없는 기본 셀은 균일한 파랑 면. 바이트 값을 색으로 인코딩하지 않는다.
          ctx.fillStyle = tokens["--m-cell"];
          ctx.fillRect(x, y, CELL, CELL);
        }
      }

      // 헤더 10바이트 구간을 괄호로 묶는다. 라벨은 캔버스 밖 DOM이 담당한다.
      ctx.strokeStyle = tokens["--border"];
      ctx.lineWidth = 1;
      ctx.strokeRect(-0.5, -0.5, GZIP_HEADER_BYTES * PITCH, CELL + 1);
    };

    // 압축기가 스트림을 다시 써 내려가는 것을 시간으로 보인다 — 유한 sweep 1회.
    // 영구 루프가 아니므로 화면 밖 정지 훅이 필요 없다.
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      drawUpTo(bytes.length);
      return;
    }
    const DURATION = 550;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      if (reduce.matches) {
        drawUpTo(bytes.length);
        return;
      }
      const t = Math.min((now - start) / DURATION, 1);
      // easeOutCubic — 끝에서 감속해야 마지막 셀들이 눈에 잡힌다
      const eased = 1 - (1 - t) ** 3;
      drawUpTo(Math.round(bytes.length * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tokens, bytes, baseline, width, height, cols, boxWidth]);

  const summary =
    stream.level === BASELINE_LEVEL
      ? "기준선. BuildKit이 압축한 그 바이트"
      : stream.diffCount === 1
        ? `다른 바이트 1개 · 오프셋 ${stream.firstDiff}(헤더 안) · 길이는 같다`
        : `다른 바이트 ${stream.diffCount.toLocaleString()}개 · 오프셋 ${stream.firstDiff}부터 · 길이 ${stream.bytes.toLocaleString()}B`;

  return (
    <figure className="m-parcel my-8">
      <div className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] overflow-hidden">
        <fieldset className="border-0 m-0 p-5 pb-4 border-b border-[color:var(--border-strong)]">
          <legend className="float-left w-full text-[13px] text-[color:var(--muted)] mb-3 px-0">
            같은 파일을 어떤 설정으로 압축했는가
          </legend>
          <div className="clear-both flex flex-wrap gap-2">
            {STREAMS.map((s) => (
              <label
                key={s.level}
                className="flex-1 min-w-[150px] cursor-pointer rounded-xl border px-3 py-2 transition-colors has-[:checked]:border-[color:var(--link)] has-[:checked]:bg-[color:var(--surface-2)] border-[color:var(--border)] hover:bg-[color:var(--hover-bg)]"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={groupName}
                    value={s.level}
                    checked={level === s.level}
                    onChange={() => setLevel(s.level)}
                    className="accent-[color:var(--link)]"
                  />
                  <code className="text-[13px] font-semibold text-[color:var(--fg)]">
                    {LABELS[s.level].title}
                  </code>
                </span>
                <span className="block text-[12px] text-[color:var(--muted)] mt-1 pl-6">
                  {LABELS[s.level].hint}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div ref={boxRef} className="px-5 py-4">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={`gzip ${LABELS[level].title} 스트림 ${stream.bytes}바이트의 바이트 격자. ${summary}`}
            className="block"
          />
          <p className="text-[12px] text-[color:var(--muted)] m-0 mt-2 leading-6">
            셀 = 바이트. 빨간 셀이 기준선과 다른 바이트다.
          </p>
        </div>

        <div className="px-5 py-4 border-t border-[color:var(--border-strong)] bg-[color:var(--surface-2)]">
          <p
            className={`text-[13px] m-0 leading-6 font-semibold ${
              stream.level === BASELINE_LEVEL
                ? "text-[color:var(--fg)]"
                : "text-[color:var(--m-accent-text)]"
            }`}
          >
            {summary}
          </p>
          <p className="text-[13px] text-[color:var(--muted)] m-0 mt-1 leading-6">
            {stream.level === 6
              ? "달라진 건 헤더의 XFL 한 바이트뿐인데 주소는 완전히 갈린다. 이래서 두 레이어의 크기가 621B로 같은데 digest가 다르다."
              : stream.level === 1
                ? "설정이 크게 다르면 데이터 자체가 다시 쓰인다. 한 바이트든 천 바이트든, 주소가 갈린다는 결과는 같다."
                : "이 바이트열의 sha256이 manifest에 적히는 그 digest다."}
          </p>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-2 text-[13px] text-[color:var(--muted)] text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
