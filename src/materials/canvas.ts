"use client";

import { useEffect, useState, type RefObject } from "react";

/*
  캔버스는 CSS 토큰을 읽지 못한다. 토큰 이름은 호출부가 넘긴다 —
  --m-* 같은 글 전용 색을 공용 훅이 알아선 안 된다(폴더를 지우면 색도 사라져야 한다).

  캔버스가 토큰을 정의한 요소의 자손이어야 값이 상속된다. 스코프 밖이면 빈 문자열이
  오고 fillStyle = "" 는 조용히 이전 값을 유지하므로, 호출부가 같은 JSX 안에서
  스코프 요소와 캔버스를 함께 렌더하는 것이 전제다.

  테마 전환 감지에 next-themes의 resolvedTheme을 쓰지 않는다 — React는 자식 effect를
  부모보다 먼저 실행하므로, 깊은 자식인 이 훅이 getComputedStyle을 읽는 시점에 조상인
  ThemeProvider는 아직 html 클래스를 바꾸지 않았다. 그래서 낡은 값을 읽고, resolvedTheme은
  다시 바뀌지 않으니 영구히 낡은 색으로 남는다(2026-08-05 실측: 초기 렌더는 맞고 전환만 실패).
  토큰 값의 원천은 html의 클래스이므로 그것을 직접 관찰한다. OS 테마 변경도 next-themes가
  같은 클래스를 갱신하므로 함께 커버된다.
*/
export function useCanvasTokens<T extends string>(
  ref: RefObject<HTMLCanvasElement | null>,
  tokens: readonly T[]
): Record<T, string> | undefined {
  const [value, setValue] = useState<Record<T, string>>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const read = () => {
      const cs = getComputedStyle(el);
      const next = Object.fromEntries(
        tokens.map((t) => [t, cs.getPropertyValue(t).trim()])
      ) as Record<T, string>;
      setValue((prev) =>
        prev && tokens.every((t) => prev[t] === next[t]) ? prev : next
      );
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });
    return () => observer.disconnect();
  }, [ref, tokens]);

  return value;
}

/** 컨테이너 폭을 관찰한다 — 캔버스가 모바일에서 가로 스크롤 대신 리플로우하도록 */
export function useContainerWidth<T extends HTMLElement>(
  ref: RefObject<T | null>
): number {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = Math.floor(entries[0].contentRect.width);
      setWidth((prev) => (prev === w ? prev : w));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}

/*
  캔버스를 DPR에 맞춰 키우고 CSS 픽셀 좌표계로 되돌린다.
  ponytail: DPR은 그리는 시점 값으로 고정된다 — 창을 다른 배율 모니터로 옮기면
  다음 재그리기(상태 변경·테마 전환)까지 흐릴 수 있다. resolution 미디어쿼리
  구독은 그 빈도 대비 과해서 뺐다.
*/
export function setupCanvas(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number
): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssWidth, cssHeight);
  return ctx;
}
